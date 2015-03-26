Router.configure({
    layoutTemplate: 'layout', waitOn: function(){
    }
});

Router.map(function(){

    /* *** INCLUDES *** */
    this.route('logIn');

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
            if(!Session.get('scoreView')){
                Session.set('scoreView', 'convincing-score');
            }
            if(!Session.get('typeView')){
                Session.set('typeView', 'all');
            }

            this.next();
        },
        data: function(){
            var data = putTheFourTypesOfWorksReviewsOnAnIdeology(this.params.name, Session.get("scoreView"),
                Session.get('typeView'));
            if(data){
                data.typeOfWork = typeOfWork;
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
            var policies = Policies.find().fetch();
            if(policies.length > 0){

                policies.sort(function(a, b){
                    if(a.solution < b.solution) return -1;
                    if(a.solution > b.solution) return 1;
                    return 0;
                });

                _.each(policies, function(policy){
                    utils_.putPositiveReviewsOnAPolicy(policy);
                });

                return {policies: policies};
            }
        }
    });

    this.route('policyPage', {
        path: '/policy/:solution/:_id',
        onBeforeAction: function(){
            if(!Session.get('scoreView')){
                Session.set('scoreView', 'convincing-score');
            }
            if(!Session.get('typeView')){
                Session.set('typeView', 'all');
            }
            this.next();
        },
        data: function(){
            var originalPolicy = putTheTwoTypesOfWorksReviewsOnAPolicy(this.params._id, Session.get("scoreView"));
            if(originalPolicy){
                var policyAreas = PolicyAreas.find({policyIds: originalPolicy._id}, {fields: {area: 1}}).fetch();
                if(policyAreas.length > 0){
                    policyAreas[policyAreas.length - 1].last = true;
                    originalPolicy.policyAreas = policyAreas;
                }
                originalPolicy.typeOfWork = typeOfWork;
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
            var policyAreas = PolicyAreas.find().fetch();

            policyAreas.sort(function(a, b){
                if(a.area < b.area) return -1;
                if(a.area > b.area) return 1;
                return 0;
            });

            return {policyAreas: policyAreas};
        }
    });

    this.route('policyAreaPage', {
        path: 'policy-area/:area/:_id',
        data: function(){
            var policyArea = PolicyAreas.findOne(this.params._id);
            if(policyArea){
                policyArea.policies = [];

                _.each(policyArea.policyIds, function(policyId){
                    policyArea.policies.push(Policies.findOne(policyId, {fields: {solution: 1}}));
                });

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
            var works = Works.find().fetch();

            works.sort(function(a, b){
                if(a.title < b.title) return -1;
                if(a.title > b.title) return 1;
            });


            return {works: works};
        }
    });

    this.route('worksPage', {
        path: '/works/:title',
        data: function(){
            return Works.findOne({title: this.params.title});
        }
    });

    this.route('newAddWork', {
        path: 'add-another-work',
        data: function(){
            var ideologies = Ideologies.find({}, {fields: {name: 1}}).fetch();
            ideologies.sort(function(a, b){
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
            });

            var policies = Policies.find({}, {fields: {solution: 1}}).fetch();

            policies.sort(function(a, b){
                if(a.solution < b.solution) return -1;
                if(a.solution > b.solution) return 1;
                return 0;
            });

            return {ideologies: ideologies, policies: policies};
        }
    });


    /* *** PLACES *** */
    this.route('placesList', {
        path: '/places',
        data: function(){
            return Places.find().fetch();
        }
    });

    this.route('placePage', {
        path: '/place/:_id',
        data: function(){
            var place = Places.findOne(this.params._id);
            if(place){

                if(place.country && !place.area){
                    place.truePlace = place.country;
                } else if(place.country && place.area){
                    place.truePlace = place.area + ", " + place.country;
                } else if(place.area && !place.country){
                    place.truePlace = place.area;
                }

                return place;
            }
        }
    });


    /* *** USER *** */
    this.route('userPage', {
        path: '/user/:username',
        data: function(){

            if(!jQuery.isEmptyObject(this.params.query)){
                Session.set('query', this.params.query);
            } else {
                Session.set('query', false);
            }

            var score = Session.get('scoreView'),
                userFromUsername = Meteor.users.findOne({username: this.params.username}),
                userFromProfileName = Meteor.users.findOne({"profile.name": this.params.username}),
                user = userFromUsername || userFromProfileName;

            if(!score){
                Session.set('scoreView', 'convincing-score');
                score = 'convincing-score';
            }


            if(user){
                var ratings = Ratings.find({userId: user._id}).fetch();
                if(ratings && ratings.length > 0){
                    user = utils_.putPositiveAndCriticalIdeologyRatingsOnUser(user, ratings, score);
                    user.userRatings = ratings;

                    user.ratingsOnIdeologies = _.filter(ratings, function(rating){
                        return rating.ideologyId;
                    });
                    user.ratingsOnPolicies = _.filter(ratings, function(rating){
                        return rating.policyId;
                    });

                    user.ratingsByIdeology = [];
                    user.ratingsByPolicy = [];

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

                    if(user.userRatings.length === 1){
                        user.userHasMadeOneRating = true;
                    }
                }
                user.hasDuplicate = Session.get('hasDuplicate');
                user.percentOfEverythingExperienced = utils_.howManyPercentageOfAllTheWorksHasThisUserRated(user._id);
//                user.badgesForReviewedIdeologies = get_.badgesForReviewedIdeologies(user._id);
                if(user._id == Meteor.userId()){
                    user.currentUserIsSameAsVisitingUser = true;
                }
                if(user.ideologies && user.ideologies.length === 1){
                    user.userSubscribesToOneIdeology = true;
                }
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
    setDocumentTitle(this.route._path);
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

