sanitizeHtml = function(string, object){
    return string;
};

addSortedRatingsOnIdeology = function(ratings){
    var valuableWorks = [];

    for(var x = 0; x < ratings.length; x++){
        var valuableWork = ratings[x].worksId;
        var possibleWorksId = _.where(valuableWorks, {worksId: valuableWork});
        if(possibleWorksId[0]){

        } else {
            var allRatings = _.where(ratings, {worksId: valuableWork});
            var scoresOfOneWorksId = _.pluck(allRatings, 'score');
            var totalRating = _.reduce(scoresOfOneWorksId, function(memo, num){ return memo + num; }, 0) / scoresOfOneWorksId.length;
            valuableWorks.push({worksId: valuableWork, totalRating: totalRating});
        }
    }
    valuableWorks.sort(function (a, b) {
        return b.totalRating - a.totalRating;
    });

    return valuableWorks;
};

certainSortedRatings = function(ratings, scoreType){
    var valuableWorks = [];

    for(var x = 0; x < ratings.length; x++){
        var valuableWork = ratings[x].worksId;
        var possibleWorksId = _.where(valuableWorks, {worksId: valuableWork});
        if(possibleWorksId[0]){

        } else {
            var allRatings = _.where(ratings, {worksId: valuableWork});
            var temp = _.pluck(allRatings, 'scores');
            var scoresOfOneWorksId = _.pluck(temp, scoreType);
            var newTotalRating = 0;
            _.each(scoresOfOneWorksId, function(score){
                newTotalRating += parseInt(score);
            });
            var totalRating = newTotalRating / scoresOfOneWorksId.length;
            valuableWorks.push({worksId: valuableWork, totalRating: totalRating});
        }
    }
    valuableWorks.sort(function (a, b) {
        return b.totalRating - a.totalRating;
    });


    return valuableWorks;
};

putTheTwoTypesOfWorksReviewsOnAPolicy = function(policyId, scoreType, typeOfWork, familiarity){
    if(scoreType.indexOf('-')){
        var scoreTypeSplit = scoreType.split('-');
        scoreType = scoreTypeSplit[0] + "Score";
    }
    var policy = Policies.findOne(policyId);
    if(policy) {
        var ratings = Ratings.find({policyId: policy._id},
            {fields: {worksId: 1, scores: 1, ratingType: 1, familiarity: 1}}).fetch();

        if(typeOfWork !== "all"){
            var arrayOfSelectedTypes = typeOfWork.split(',');

            _.each(ratings, function(rating){
                var work = Works.findOne(rating.worksId, {fields: {type:1}});
                if(!_.contains(arrayOfSelectedTypes, work.type)){
                    ratings = _.without(ratings, rating);
                }
            });
        }

        if(familiarity !== 'any'){
            var arrayOfSelectedFamiliarities = familiarity.split(',');

            _.each(ratings, function(rating){
                if(!_.contains(arrayOfSelectedFamiliarities, rating.familiarity.toString())){
                    ratings = _.without(ratings, rating);
                }
            });
        }

        var positiveRatings = _.where(ratings, {ratingType: "for"}),
            criticalRatings = _.where(ratings, {ratingType: "against"});


        policy.positiveWorks = certainSortedRatings(positiveRatings, scoreType);
        policy.criticalWorks = certainSortedRatings(criticalRatings, scoreType);
        return policy;
    }
};

utils_.putPositiveReviewsOnAPolicy = function(policy, scoreType){
    if(policy) {
        var ratings = Ratings.find({policyId: policy._id}, {fields: {worksId: 1, scores: 1, ratingType: 1}}).fetch();

        var positiveRatings = _.where(ratings, {ratingType: "for"});

        policy.positiveWorks = certainSortedRatings(positiveRatings, scoreType);
        return policy;
    }
};





putTheFourTypesOfWorksReviewsOnAnIdeology = function(ideologyName, scoreType, typeOfWork, familiarity){
    if(scoreType.indexOf('-')){
        var scoreTypeSplit = scoreType.split('-');
        scoreType = scoreTypeSplit[0] + "Score";
    }

    var ideology = Ideologies.findOne({name: ideologyName});
    if(ideology) {
        var ratings = Ratings.find({ideologyId: ideology._id},
            {fields: {worksId: 1, scores: 1, ratingType: 1, userId: 1, familiarity: 1}}).fetch();

        if(typeOfWork !== "all"){
            var arrayOfSelectedTypes = typeOfWork.split(',');

            _.each(ratings, function(rating){
                var work = Works.findOne(rating.worksId, {fields: {type:1}});
                if(!_.contains(arrayOfSelectedTypes, work.type)){
                    ratings = _.without(ratings, rating);
                }
            });
        }

        if(familiarity !== 'any'){
            var arrayOfSelectedFamiliarities = familiarity.split(',');

            _.each(ratings, function(rating){
                if(!_.contains(arrayOfSelectedFamiliarities, rating.familiarity.toString())){
                    ratings = _.without(ratings, rating);
                }
            });
        }


        var positiveRatings = _.where(ratings, {ratingType: "positive"}),
            criticalRatings = _.where(ratings, {ratingType: "critical"});

        var proponentsPositiveRatings = [],
            othersPositiveRatings = [],
            proponentsCriticalRatings = [],
            othersCriticalRatings = [];

        _.each(positiveRatings, function(rating) {
            if(_.contains(this, rating.userId)){
                proponentsPositiveRatings.push(rating);
            } else {
                othersPositiveRatings.push(rating);
            }
        }, ideology.proponents);

        _.each(criticalRatings, function(rating) {
            if(_.contains(this, rating.userId)){
                proponentsCriticalRatings.push(rating);
            } else {
                othersCriticalRatings.push(rating);
            }
        }, ideology.proponents);


        ideology.proponentsPositiveWorks = certainSortedRatings(proponentsPositiveRatings, scoreType);
        ideology.othersPositiveWorks = certainSortedRatings(othersPositiveRatings, scoreType);
        ideology.proponentsCriticalWorks = certainSortedRatings(proponentsCriticalRatings, scoreType);
        ideology.othersCriticalWorks = certainSortedRatings(othersCriticalRatings, scoreType);

        return ideology;
    }
};

checkItContainsEverything = function (attr) {
    _.each(attr, function (property) {
        if (!property || property.length < 1) throwError("You must fill in all fields");

        if(_.isArray(property) && !property[0]) throwError("You must fill in all fields");
    });
};




utils_.putPositiveAndCriticalIdeologyRatingsOnUser = function (user, ratings, score) {
    var positiveIdeologiesRatings = [],
        criticalIdeologiesRatings = [],
        positivePoliciesRatings = [],
        criticalPoliciesRatings = [];

    _.each(ratings, function (rating) {
        if (rating.ideologyId) {
            var ideologyId = rating.ideologyId;

            var possibleIdeologyId = _.where(positiveIdeologiesRatings, {ideologyId: ideologyId});
            //duplicate maybe this for the criticalIdeologiesRatings and have an either just below?

            if (possibleIdeologyId[0]) {
            } else {
                var positiveRatings = _.where(ratings, {ideologyId: ideologyId, ratingType: "positive"});
                var criticalRatings = _.where(ratings, {ideologyId: ideologyId, ratingType: "critical"});

                if (positiveRatings[0]) {
                    positiveIdeologiesRatings.push({ideologyId: ideologyId, ratingType: "positive",
                        ratings: positiveRatings});
                }

                if (criticalRatings[0]) {
                    criticalIdeologiesRatings.push({ideologyId: ideologyId, ratingType: "critical",
                        ratings: criticalRatings});
                }
            }
        } else if (rating.policyId) {
            var policyId = rating.policyId;

            var possiblePolicyId = _.where(positivePoliciesRatings, {policyId: policyId});

            if (possiblePolicyId[0]) {
            } else {
                var positiveRatings = _.where(ratings, {policyId: policyId, ratingType: "for"});
                var criticalRatings = _.where(ratings, {policyId: policyId, ratingType: "against"});

                if (positiveRatings[0]) {
                    positivePoliciesRatings.push({policyId: policyId, ratingType: "for",
                        ratings: positiveRatings});
                }

                if (criticalRatings[0]) {
                    criticalPoliciesRatings.push({policyId: policyId, ratingType: "against",
                        ratings: criticalRatings});
                }
            }
        }
    });

    user.positiveRatingsOnIdeology = positiveIdeologiesRatings;
    user.criticalRatingsOnIdeology = criticalIdeologiesRatings;
    user.favorableRatingsOnPolicy = positivePoliciesRatings;
    user.unfavorableRatingsOnPolicy = criticalPoliciesRatings;


    if (user.positiveRatingsOnIdeology) {
        _.each(user.positiveRatingsOnIdeology, function (ratingsOnIdeology) {
            sortRatingsAccordingToTypeOfScore(ratingsOnIdeology, score);
        });
    }

    if (user.criticalRatingsOnIdeology) {
        _.each(user.criticalRatingsOnIdeology, function (ratingsOnIdeology) {
            sortRatingsAccordingToTypeOfScore(ratingsOnIdeology, score);
        });
    }

    if (user.favorableRatingsOnPolicy) {
        _.each(user.favorableRatingsOnPolicy, function (ratingsOnIdeology) {
            sortRatingsAccordingToTypeOfScore(ratingsOnIdeology, score);
        });
    }

    if (user.unfavorableRatingsOnPolicy) {
        _.each(user.unfavorableRatingsOnPolicy, function (ratingsOnIdeology) {
            sortRatingsAccordingToTypeOfScore(ratingsOnIdeology, score);
        });
    }

    user.hasRatingsOn = true;

    return user;
};

throwIfNotNumberOrNotBetween1and100 = function(rating){
    if(isNaN(rating)) throwError("The rating needs to be a number");
    else if(rating < 1 || rating > 100) throwError("The rating needs to be a number between 1 and 100");
};

throwIfVariablesInArrayNotNumbersOrNotBetween1and100 = function(array){
    _.each(array, function(rating){
        if(isNaN(rating)) throwError("The rating needs to be a number");
        else if(rating < 1 || rating > 100) throwError("The rating needs to be a number between 1 and 100");
    });
};



sortRatingsAccordingToTypeOfScore = function(ratings, score){
    switch(score){
        case "convincing-score":
            ratings.ratings.sort(function (a, b) {
                return b.scores.convincingScore - a.scores.convincingScore;
            });
            break;
        case "criticality-score":
            ratings.ratings.sort(function (a, b) {
                return b.scores.criticalityScore - a.scores.criticalityScore;
            });
            break;
            break;
        case "readability-score":
            ratings.ratings.sort(function (a, b) {
                return b.scores.readabilityScore - a.scores.readabilityScore;
            });
            break;
        case "explanation-score":
            ratings.ratings.sort(function (a, b) {
                return b.scores.explanationScore - a.scores.explanationScore;
            });
            break;
        case "completeness-score":
            ratings.ratings.sort(function (a, b) {
                return b.scores.completenessScore - a.scores.completenessScore;
            });
            break;
        case "background-score":
            ratings.ratings.sort(function (a, b) {
                return b.scores.backgroundScore - a.scores.backgroundScore;
            });
            break;
        case "new-info-score":
            ratings.ratings.sort(function (a, b) {
                return b.scores.newInfoScore - a.scores.newInfoScore;
            });
            break;
    }
};





utils_.howManyPercentageOfAllTheWorksHasThisUserRated = function(userId){
    var allWorks = Works.find().fetch(),
        allUserReviews = Ratings.find({userId: userId}).fetch();

    return 0;
};



