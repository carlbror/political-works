Router.configure({
    layoutTemplate: 'layout', waitOn: function(){
    }
});

Router.map(function(){

    /* *** INCLUDES *** */
    this.route('login');

    this.route('frontPage', {
        path: '/',
        data: function(){
            var policyArea = PolicyAreas.findOne();
            if(policyArea) return {policyArea: policyArea};
        }
    });

    this.route('aLongerIntroduction', {
        path: '/a-longer-introduction'
    });

    this.route('privacyPolicy', {path: 'privacy-policy'});
    this.route('badges', {
        data: function(){
            var ideologies = Ideologies.find({}, {fields: {name: 1}}).fetch(),
                ratings;
            if(ideologies.length > 0){
                ratings = Ratings.find({ideologyId: ideologies[2]._id}).fetch();
                if(ratings.length > 0){
                    var ratingsOnWork = _.where(ratings, {worksId: ratings[3].worksId}),
                        score = 0;

                    _.each(ratingsOnWork, function(rating){
                        score = +rating.scores.convincingScore;
                    });
                    score = score / ratingsOnWork.length;

                    var work = Works.findOne(ratingsOnWork[0].worksId);
                    if(work){
                        return {ideology: ideologies[2], work: work, score: score, points: get_.pointsFromScore(score)};
                    }
                }
            }
        }
    });


    /* *** IDEOLOGIES *** */

    this.route('ideologyList', {
        path: '/ideologies',
        data: function(){
            var ideologies = Ideologies.find().fetch();
            ideologies.sort(function(a, b){
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
            });

            return {ideologies: ideologies};
        }
    });

    this.route('ideologyPage', {
        path: '/ideology/:name',
        onBeforeAction: function(){
            if(!Session.get('scoreView') || Session.get('scoreView') === 'enlighteningScore'){
                Session.set('scoreView', 'convincingScore');
            }
            if(!Session.get('typeView')){
                Session.set('typeView', 'all');
            }

            if(!Session.get('familiarityView')){
                Session.set('familiarityView', [familiarityReveresed[0].number, familiarityReveresed[1].number,
                    familiarityReveresed[2].number, familiarityReveresed[3].number].toString());
            }

            this.next();
        },
        data: function(){
            var familiarities = Session.get('familiarityView').split(',').map(Number),
                data = putTheFourTypesOfWorksReviewsOnAnIdeology(this.params.name, Session.get("scoreView"),
                    Session.get('typeView'), familiarities),
                producers = Producers.find({}, {fields: {name: 1}}).fetch(),
                works = Works.find({}, {sort: {title:1}}).fetch();

            if(_.contains(familiarities, 0)) {
                var ideology = Ideologies.findOne({name:this.params.name});
                if(ideology){
                    var unrated = Ratings.find({ideologyId: ideology._id, familiarity: 0}).fetch(),
                        rated = Ratings.find({ideologyId: ideology._id , familiarity: {$gt: 0}}).fetch();
                }
            }

            if(data && producers && works){
                data.typeOfWork = typeOfWork;
                data.familiarities = familiarityReveresed;
                data.producerNames = _.pluck(producers, 'name');
                data.titles = _.pluck(works, 'title');
                data.works = works;
                data.producers = producers;
                if(unrated && unrated.length > 0){
                    if(rated && rated.length > 0){
                        data.unrated = Works.find(
                            {_id: {$in: _.without(_.pluck(unrated, 'worksId'), _.pluck(rated, 'worksId'))}},
                            {sort: {title:1}}).fetch();
                    } else {
                        data.unrated = Works.find({_id: {$in: _.pluck(unrated, 'worksId')}}, {sort: {title:1}});
                    }
                }
                return data;
            }
        }
    });

    this.route('chooseIdeology', {path: '/choose-ideology'});

    this.route('addIdeology', {
        path: '/add-ideology',
        data: function(){
            var createdId = Session.get('createdIdeology');
            if(createdId){
                return {ideology: Ideologies.findOne(createdId)};
            }
        }
    });


    /* *** POLICIES *** */
    this.route('policyList', {
        path: '/policies',
        data: function(){
            var policies = Policies.find({}, {sort: {solution: 1}}).fetch();
            if(policies.length > 0){
                for(x = 0; x < policies.length; x++){
                    var ratings = Ratings.find({policyId: policies[x]._id, ratingType: "for"},
                        {fields: {worksId: 1, scores: 1, ratingType: 1}}).fetch();

                    if(ratings.length > 0){
                        policies[x].bestWork = Works.findOne(calculateTotalScoreForRatingsAndSort(ratings,
                            "convincingScore")[0].worksId,
                            {fields: {producers: 1, title: 1, url: 1}});
                    }
                }

                return {policies: policies};
            }
        }
    });

    this.route('policyPage', {
        path: '/policy/:solution/:_id',
        onBeforeAction: function(){
            if(!Session.get('scoreView') || Session.get('scoreView') === 'enlighteningScore'){
                Session.set('scoreView', 'convincingScore');
            }
            if(!Session.get('typeView')){
                Session.set('typeView', 'all');
            }

            if(!Session.get('familiarityView')){
                Session.set('familiarityView', [familiarityReveresed[0].number, familiarityReveresed[1].number,
                    familiarityReveresed[2].number, familiarityReveresed[3].number].toString());
            }

            this.next();
        },
        data: function(){
            var familiarities = Session.get('familiarityView').split(',').map(Number),
                originalPolicy = putTheTwoTypesOfWorksReviewsOnAPolicy(this.params._id, Session.get("scoreView"),
                    Session.get('typeView'), familiarities),
                producers = Producers.find({}, {fields: {name: 1}}).fetch(),
                works = Works.find({}, {sort: {title:1}}).fetch();

            if(_.contains(familiarities, 0)){
                var unrated = Ratings.find({policyId: this.params._id, familiarity: 0}).fetch(),
                    rated = Ratings.find({policyId: this.params._id , familiarity: {$gt: 0}}).fetch();
            }

            if(originalPolicy){
                var policyAreas = PolicyAreas.find({policyIds: originalPolicy._id}, {fields: {area: 1}}).fetch();
                if(policyAreas.length > 0){
                    policyAreas[policyAreas.length - 1].last = true;
                    originalPolicy.policyAreas = policyAreas;
                }
                originalPolicy.typeOfWork = typeOfWork;
                originalPolicy.familiarities = familiarityReveresed;
                originalPolicy.titles = _.pluck(works, 'title');
                originalPolicy.producerNames = _.pluck(producers, 'name');
                originalPolicy.works = works;
                originalPolicy.producers = producers;
                if(unrated && unrated.length > 0){
                    if(rated && rated.length > 0){
                        originalPolicy.unrated = Works.find(
                            {_id: {$in: _.without(_.pluck(unrated, 'worksId'), _.pluck(rated, 'worksId'))}},
                            {sort: {title:1}}).fetch();
                    } else {
                        originalPolicy.unrated = Works.find({_id: {$in: _.pluck(unrated, 'worksId')}}, {sort: {title:1}});
                    }
                }

                return originalPolicy;
            }
        }
    });

    this.route('discussAPolicy', {
        path: 'discuss-policy',
        data: function(){
            var policies = Policies.find({}, {fields: {solution: 1, placeId: 1}}).fetch();
            if(policies){
                policies.sort(function(a, b){
                    if(a.solution < b.solution) return -1;
                    if(a.solution > b.solution) return 1;
                    return 0;
                });
                return {policies: policies};
            }
        }
    });


    /* *** POLICYAREAS *** */
    this.route('policyAreasList', {
        path: '/policy-areas',
        data: function(){
            var policyAreas = PolicyAreas.find({}, {sort: {area: 1}}).fetch();

            for(var x = 0; x < policyAreas.length; x++){
                var ratings = Ratings.find({policyAreaId: policyAreas[x]._id, familiarity: {$gt: 1}},
                    {fields: {"scores.enlighteningScore": 1, worksId: 1}}).fetch()

                if(ratings.length > 0){
                    policyAreas[x].bestWork = Works.findOne(calculateTotalScoreForRatingsAndSort(ratings,
                        "enlighteningScore")[0].worksId, {fields: {producers: 1, title: 1, url: 1}});
                }
            }

            return {policyAreas: policyAreas};
        }
    });

    this.route('policyAreaPage', {
        path: 'policy-area/:area/:_id',
        onBeforeAction: function(){
            if(!Session.get('scoreView') || Session.get('scoreView') === "convincingScore"){
                Session.set('scoreView', 'enlighteningScore');
            }
            if(!Session.get('typeView')){
                Session.set('typeView', 'all');
            }

            if(!Session.get('familiarityView')){
                Session.set('familiarityView', [familiarityReveresed[0].number, familiarityReveresed[1].number,
                    familiarityReveresed[2].number, familiarityReveresed[3].number].toString());
            }

            this.next();
        },
        data: function(){
            var familiarities = Session.get('familiarityView').split(',').map(Number),
                policyArea = PolicyAreas.findOne(this.params._id),
                works = Works.find({}, {sort: {title: 1}}).fetch(),
                producers = Producers.find({}, {fields: {name: 1}}).fetch(),
                ratingsOnArea = Ratings.find({policyAreaId: this.params._id, $and: [
                    {familiarity: {$gt: 0}},
                    {familiarity: {$in: familiarities}}
                ]}, {fields: {worksId: 1, scores: 1}}).fetch(),
                type = Session.get('typeView').split(',');

            if(_.contains(familiarities, 0))
                var unrated = Ratings.find({policyAreaId: this.params._id, familiarity: 0}).fetch();

            if(policyArea && works.length > 0 && producers.length > 0){
                policyArea.policies = [];

                _.each(policyArea.policyIds, function(policyId){
                    policyArea.policies.push(Policies.findOne(policyId, {fields: {solution: 1}}));
                });


                if(type[0] !== 'all'){
                    if(type[0] === 'none'){
                        ratingsOnArea = null;
                    } else {
                        var worksInRatings = _.filter(works, function(work){
                            return _.contains(type, work.type);
                        });

                        ratingsOnArea = _.filter(ratingsOnArea, function(rating){
                            return _.contains(_.pluck(worksInRatings, '_id'), rating.worksId);
                        });
                    }
                }
                if(ratingsOnArea && ratingsOnArea.length > 0){
                    policyArea.sortedRatings = calculateTotalScoreForRatingsAndSort(ratingsOnArea, Session.get('scoreView'));
                }

                policyArea.titles = _.pluck(works, "title");
                policyArea.producerNames = _.pluck(producers, 'name');
                policyArea.ratingsOnArea = ratingsOnArea;
                policyArea.typeOfWork = typeOfWork;
                policyArea.familiarities = familiarityReveresed;
                policyArea.works = works;
                policyArea.producers = producers;
                if(unrated && unrated.length > 0){
                    var alreadyRated = _.pluck(policyArea.sortedRatings, 'worksId'),
                        unratedButNotRated = _.reject(unrated, function(rating){
                            return _.contains(alreadyRated, rating.worksId);
                        });
                    policyArea.unrated = Works.find({_id: {$in: _.pluck(unratedButNotRated, 'worksId')}},
                        {sort: {title:1}}).fetch();
                }

                return policyArea;
            }
        }
    });

    this.route('discussAPolicyArea', {
        path: 'discuss-policy/:_id',
        data: function(){
            var policyArea = PolicyAreas.findOne(this.params._id);
            if(policyArea){
                var place = Places.findOne(policyArea.placeId);
                if(place) return {policyArea: policyArea, place: place};
            }
        },
        action: function(){
            this.render('discussAPolicy');
        }
    });

    this.route('createNewPolicyArea', {
        path: 'create-new-policy-area',

        data: function(){
            var policyAreas = PolicyAreas.find({}, {fields: {area: 1, placeId: 1}}).fetch();

            policyAreas.sort(function(a, b){
                if(a.area < b.area) return -1;
                if(a.area > b.area) return 1;
                return 0;
            });

            return {policyAreas: policyAreas};
        }
    });

    /* *** WORKS *** */
    this.route('worksList', {
        path: '/works',
        data: function(){
            return {works: Works.find({}, {sort: {title: 1}}, {fields: {title: 1, url: 1}}).fetch(),
            producers: Producers.find({}, {sort: {name:1}}).fetch()};
        }
    });

    this.route('worksPage', {
        path: '/works/:_id',
        data: function(){
            var works = Works.findOne({_id: this.params._id});
            if(works){
                var ratings = Ratings.find({worksId: works._id},
                    {sort: {ideologyId: -1, policyId: -1, scienceId: -1, ratingType: 1, convincingScore: -1, readabilityScore: -1}}).fetch();
                if(ratings){
                    return {works: works, ratings: ratings};
                }
            }
        }
    });

    this.route('newAddWork', {
        path: 'add-another-work',
        data: function(){
            var ideologies = Ideologies.find({}, {fields: {name: 1}}).fetch(),
                policies = Policies.find({}, {fields: {solution: 1}}).fetch(),
                producers = Producers.find({}, {fields: {name: 1}}).fetch();

            ideologies.sort(function(a, b){
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
            });

            policies.sort(function(a, b){
                if(a.solution < b.solution) return -1;
                if(a.solution > b.solution) return 1;
                return 0;
            });

            return {ideologies: ideologies, policies: policies, producers: _.pluck(producers, 'name'),
                typeOfWork: typeOfWork};
        }
    });


    /* *** PLACES *** */
    this.route('placesList', {
        path: '/places',
        data: function(){
            return {places: Places.find({}, {sort: {country: 1, area: 1}}).fetch()};
        }
    });

    this.route('placePage', {
        path: '/place/:_id',
        data: function(){
            var place = Places.findOne(this.params._id);
            if(place){
                place.truePlace = get_.truePlace(place);
                return place;
            }
        }
    });


    /* *** SCIENCES *** */
    this.route('addNewScience', {
        data: function(){
            return {sciences: Sciences.find().fetch()}
        }
    });

    this.route('sciencesList', {
        path: 'sciences',
        data: function(){
            return {sciences: Sciences.find({}, {sort: {"field.english":1}}).fetch()}
        }
    });

    this.route('sciencePage', {
        path: '/sciences/:_id',
        onBeforeAction: function(){
            if(!Session.get('scoreView') || Session.get('scoreView') === "convincingScore"){
                Session.set('scoreView', 'enlighteningScore');
            }
            if(!Session.get('typeView')){
                Session.set('typeView', 'all');
            }

            if(!Session.get('familiarityView')){
                Session.set('familiarityView', [familiarityReveresed[0].number, familiarityReveresed[1].number,
                    familiarityReveresed[2].number, familiarityReveresed[3].number].toString());
            }

            this.next();
        },
        data: function(){
            var familiarities = Session.get('familiarityView').split(',').map(Number),
                type = Session.get('typeView').split(','),
                works = Works.find({}, {sort: {title: 1}}).fetch(),
                producers = Producers.find({}, {fields: {name: 1}}).fetch(),
                ratingsOnScience = Ratings.find({scienceId: this.params._id, $and: [
                    {familiarity: {$gt: 0}},
                    {familiarity: {$in: familiarities}}
                ]}, {fields: {worksId: 1, scores: 1}}).fetch(),
                nonFamiliarRatingsOnScience = Ratings.find({scienceId: this.params._id, familiarity: 0},
                    {fields: {worksId: 1, scores: 1}}).fetch(),
                science = Sciences.findOne(this.params._id);

            if(science && works.length > 0 && producers.length > 0){

                if(type[0] !== 'all'){
                    if(type[0] === 'none'){
                        ratingsOnScience = null;
                        nonFamiliarRatingsOnScience = null;
                    } else {
                        var worksInRatings = _.filter(works, function(work){
                            return _.contains(type, work.type);
                        });

                        ratingsOnScience = _.filter(ratingsOnScience, function(rating){
                            return _.contains(_.pluck(worksInRatings, '_id'), rating.worksId);
                        });

                        nonFamiliarRatingsOnScience = _.filter(nonFamiliarRatingsOnScience, function(rating){
                            return _.contains(_.pluck(worksInRatings, '_id'), rating.worksId);
                        });
                    }
                }
                if(ratingsOnScience && ratingsOnScience.length > 0){
                    science.sortedRatings = calculateTotalScoreForRatingsAndSort(ratingsOnScience, Session.get('scoreView'));
                }
                if(nonFamiliarRatingsOnScience && nonFamiliarRatingsOnScience.length > 0 && _.contains(familiarities, 0)){
                    var uniqueWorkIds = _.uniq(_.pluck(nonFamiliarRatingsOnScience, 'worksId'));

                    if(ratingsOnScience && ratingsOnScience.length > 0){
                        var arrayOfFamiliarWorkIds = _.uniq(_.pluck(ratingsOnScience, 'worksId'));
                        uniqueWorkIds = _.reject(uniqueWorkIds, function(workId){
                            return _.contains(arrayOfFamiliarWorkIds, workId);
                        });
                    }
                    science.nonFamiliarRatedWorks = _.filter(works, function(work){
                        return _.contains(uniqueWorkIds, work._id);
                    });
                }

                science.titles = _.pluck(works, "title");
                science.producerNames = _.pluck(producers, 'name');
                science.typeOfWork = typeOfWork;
                science.familiarities = familiarityReveresed;
                science.works = works;
                science.producers = producers;

                return science;
            }
        }
    });


    /* *** LISTS *** */
    this.route('lists', {
        data: function(){
            return {lists: Lists.find({}, {sort: {name:1}, fields: {name:1}}).fetch()};
        }
    });

    this.route('listPage', {
        path: '/lists/:name/:_id',
        data: function(){
            var list = Lists.findOne(this.params._id),
                user = Meteor.user(),
                subscribes, essentialWorksCompleted, importantWorksCompleted, totalWorksCompleted, coAdmin,
                works = Works.find({}, {sort: {title:1}, fields: {title:1, producers: 1, type:1}}).fetch();


            if(list){
                var essentialWorks = Works.find({_id: {$in: list.essentialWorks}}, {sort: {title:1}}).fetch(),
                    importantWorks = Works.find({_id: {$in: list.importantWorks}}, {sort: {title:1}}).fetch();

                if(user && _.contains(list.subscribers, user._id)){
                    subscribes = true;
                    if(list.coAdmins && _.contains(list.coAdmins, user._id))
                        coAdmin = true;

                    var uniqueRatingsOnEssentialWorks, uniqueRatingsOnImportantWorks;

                    if(essentialWorks.length > 0){
                        var ratingsOnEssentialWorks = Ratings.find({userId: user._id, worksId: {$in: _.pluck(essentialWorks, '_id')},
                            familiarity: {$gt: 1}}, {fields: {_id: 1, worksId: 1}}).fetch();
                        if(ratingsOnEssentialWorks.length > 0){
                            essentialWorksCompleted = _.uniq(_.pluck(ratingsOnEssentialWorks, 'worksId')).length;
                        }
                    }

                    if(importantWorks.length > 0){
                        var ratingsOnImportantWorks = Ratings.find({userId: user._id, worksId: {$in: _.pluck(importantWorks, '_id')},
                            familiarity: {$gt: 1}}, {fields: {_id: 1, worksId: 1}}).fetch();
                        if(ratingsOnImportantWorks.length > 0){
                            importantWorksCompleted = _.uniq(_.pluck(ratingsOnImportantWorks, 'worksId')).length;
                        }
                    }

                    essentialWorksCompleted = essentialWorksCompleted || 0;
                    importantWorksCompleted = importantWorksCompleted || 0;
                    totalWorksCompleted = essentialWorksCompleted + importantWorksCompleted;

                    var essentialWorksCompletedPercentage, importantWorksCompletedPercentage;

                    if(essentialWorksCompleted > 0)
                        essentialWorksCompletedPercentage = Math.round((essentialWorksCompleted / essentialWorks.length)*100);

                    if(importantWorksCompleted > 0)
                        importantWorksCompletedPercentage = Math.round((importantWorksCompleted / importantWorks.length)*100);

                    var totalWorksCompletedPercentage = Math.round(((essentialWorksCompleted+importantWorksCompleted)/
                        (essentialWorks.length + importantWorks.length))*100);

                    if(works.length > 0){
                        _.each(works, function(work){
                            if(_.contains(list.essentialWorks, work._id)){
                                work.essentialWork = true;
                                work.importantWork = false;
                            }
                            else if(_.contains(list.importantWorks, work._id)){
                                work.importantWork = true;
                                work.essentialWork = false;
                            } else {
                                work.essentialWork = false;
                                work.importantWork = false;
                            }
                        });

                        works.sort(function(a,b){
                            return b.importantWork - a.importantWork;
                        });
                        works.sort(function(a,b){
                            return b.essentialWork - a.essentialWork;
                        });

                    }
                }

                return {
                    list: list,
                    works: works,
                    essentialWorks: essentialWorks,
                    importantWorks: importantWorks,
                    subscribes: subscribes,
                    coAdmin: coAdmin,
                    hasEssentialWorks: !!essentialWorks[0],
                    hasImportantWorks: !!importantWorks[0],
                    essentialWorksCompletedPercentage: essentialWorksCompletedPercentage || 0,
                    importantWorksCompletedPercentage: importantWorksCompletedPercentage || 0,
                    totalWorksCompletedPercentage: totalWorksCompletedPercentage || 0
                }
            }
        }
    });

    this.route('createNewList',{
        path: '/create-new-list',
        data: function(){
            return {
                lists: Lists.find({}, {fields: {name:1}}).fetch(),
                works: Works.find({}, {sort: {title:1}, fields: {title:1, producers: 1, type:1}}).fetch()
            };
        }
    });




    /* *** TURING TESTS *** */
    this.route('createIdeologicalTuringTest', {
        path: '/create-ideological-turing-test',
        data: function(){
            return {
                ideologies: Ideologies.find({}, {sort: {name:1}}, {fields: {name:1}}).fetch()
            }
        }
    });

    this.route('ittPage',{
        path: '/ideological-turing-test/:_id',
        data: function(){
            return {
                itt: ITT.findOne(this.params._id)
            }
        }
    });

    this.route('ittAnswerPage', {
        path: '/ideological-turing-test/:_id/give-answer',
        data: function(){
            return {
                itt: ITT.findOne(this.params._id)
            }
        }
    });


    /* *** USER *** */
    this.route('userPage', {
        path: '/user/:username',
        onBeforeAction: function(){
            if(!Session.get('scoreView')){
                Session.set('scoreView', 'convincingScore');
            }
            if(!Session.get('typeView')){
                Session.set('typeView', 'all');
            }

            if(!Session.get('familiarityView')){
                Session.set('familiarityView', [familiarityReveresed[0].number, familiarityReveresed[1].number,
                    familiarityReveresed[2].number, familiarityReveresed[3].number].toString());
            }

            this.next();
        },
        data: function(){
            var score = Session.get('scoreView'),
                type = Session.get('typeView'),
                familiarity = Session.get('familiarityView').split(',').map(Number),
                user = Meteor.users.findOne({username: this.params.username});

            if(user){
                user.userRatings = Ratings.find({userId: user._id}).fetch();
                if(user.userRatings.length === 1){
                    user.userHasMadeOneRating = true;
                }

                var ratings = Ratings.find({userId: user._id, familiarity: {$in: familiarity}}).fetch();
                if(ratings && ratings.length > 0){
                    user.ratingsOnPolicyAreas = _.filter(ratings, function(rating){
                        return rating.policyAreaId
                    });
                    user.ratingsOnIdeologies = _.filter(ratings, function(rating){
                        return rating.ideologyId;
                    });
                    user.ratingsOnPolicies = _.filter(ratings, function(rating){
                        return rating.policyId;
                    });

                    user.ratingsByPolicyArea = [];
                    user.ratingsByIdeology = [];
                    user.ratingsByPolicy = [];

                    var listOfPolicyAreasAlreadyAdded = [];
                    _.each(user.ratingsOnPolicyAreas, function(rating){
                        if(_.indexOf(listOfPolicyAreasAlreadyAdded, rating.policyAreaId) === -1){
                            user.ratingsByPolicyArea.push({
                                policyAreaId: rating.policyAreaId,
                                ratings: _.where(user.ratingsOnPolicyAreas, {policyAreaId: rating.policyAreaId})
                            });
                            listOfPolicyAreasAlreadyAdded.push(rating.policyAreaId);
                        }
                    });
                    _.each(user.ratingsByPolicyArea, function(ratingOnPolicyArea){
                        ratingOnPolicyArea.ratings.sort(function(a, b){
                            return b.scores[score] - a.scores[score];
                        });
                    });

                    var listOfIdeologiesAlreadyAdded = [];
                    _.each(user.ratingsOnIdeologies, function(rating){
                        if(_.indexOf(listOfIdeologiesAlreadyAdded, rating.ideologyId) === -1){
                            user.ratingsByIdeology.push({
                                ideologyId: rating.ideologyId,
                                supportiveRatings: _.where(user.ratingsOnIdeologies,
                                    {ideologyId: rating.ideologyId, ratingType: "positive"}),
                                underminingRatings: _.where(user.ratingsOnIdeologies,
                                    {ideologyId: rating.ideologyId, ratingType: "critical"})
                            });
                            listOfIdeologiesAlreadyAdded.push(rating.ideologyId);
                            if(user.ratingsByIdeology[user.ratingsByIdeology.length - 1].supportiveRatings.length === 0){
                                delete user.ratingsByIdeology[user.ratingsByIdeology.length - 1].supportiveRatings;
                            }
                            if(user.ratingsByIdeology[user.ratingsByIdeology.length - 1].underminingRatings.length === 0){
                                delete user.ratingsByIdeology[user.ratingsByIdeology.length - 1].underminingRatings;
                            }
                        }
                    });
                    _.each(user.ratingsByIdeology, function(ratingsOnIdeology){
                        if(ratingsOnIdeology.supportiveRatings){
                            ratingsOnIdeology.supportiveRatings.sort(function(a, b){
                                return b.scores[score] - a.scores[score];
                            });
                        }

                        if(ratingsOnIdeology.underminingRatings){
                            ratingsOnIdeology.underminingRatings.sort(function(a, b){
                                return b.scores[score] - a.scores[score];
                            });
                        }
                    });

                    var listOfPoliciesAlreadyAdded = [];
                    _.each(user.ratingsOnPolicies, function(rating){
                        if(_.indexOf(listOfPoliciesAlreadyAdded, rating.policyId) === -1){
                            user.ratingsByPolicy.push({
                                policyId: rating.policyId,
                                supportiveRatings: _.where(user.ratingsOnPolicies, {policyId: rating.policyId, ratingType: "for"}),
                                underminingRatings: _.where(user.ratingsOnPolicies, {policyId: rating.policyId, ratingType: "against"})
                            });
                            listOfPoliciesAlreadyAdded.push(rating.policyId);
                            if(user.ratingsByPolicy[user.ratingsByPolicy.length - 1].supportiveRatings.length === 0){
                                delete user.ratingsByPolicy[user.ratingsByPolicy.length - 1].supportiveRatings;
                            }
                            if(user.ratingsByPolicy[user.ratingsByPolicy.length - 1].underminingRatings.length === 0){

                                delete user.ratingsByPolicy[user.ratingsByPolicy.length - 1].underminingRatings;
                            }
                        }
                    });
                    _.each(user.ratingsByPolicy, function(ratingsOnPolicy){
                        if(ratingsOnPolicy.supportiveRatings){
                            ratingsOnPolicy.supportiveRatings.sort(function(a, b){
                                return b.scores[score] - a.scores[score];
                            });
                        }

                        if(ratingsOnPolicy.underminingRatings){
                            ratingsOnPolicy.underminingRatings.sort(function(a, b){
                                return b.scores[score] - a.scores[score];
                            });
                        }
                    });
                }

                if(user.ideologies && user.ideologies.length === 1){
                    user.userSubscribesToOneIdeology = true;
                }

                user.typeOfWork = typeOfWork;
                user.familiarities = familiarityReveresed;

                return user;
            }
        }
    });
});


Deps.autorun(function(){
    var current = Router.current();

    Deps.afterFlush(function(){
        $('.content').scrollTop(0);
        $(window).scrollTop(0);
    });
});


Router.onAfterAction(function(){
    setDocumentTitle(this.location.get().path);
});


setDocumentTitle = function(pathString){
    var splitString = pathString.split(['/']);

    if(splitString[2]){
        splitString[1] = o_.capitaliseFirstLetter(splitString[1]);
        splitString[2] = o_.capitaliseFirstLetter(splitString[2]);

        for(var x = 0; x < 5; x++){
            splitString[2] = splitString[2].replace("%20", " ");
        }
        splitString[1] = splitString[1].replace("%20", " ");
        splitString[1] = splitString[1].replace("-", " ");

        document.title = "The Best Political Works  -  " + splitString[1] + " - " + splitString[2];
    } else if(splitString[1]){

        document.title = "The Best Political Works  -  " + o_.capitaliseFirstLetter(splitString[1]).replace("-", " ");

    } else {
        document.title = "The Best Political Works";
    }
};

