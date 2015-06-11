get_ = {};

get_.producerNamesFromIds = function (arrayOfProducerIds) {
    var producerNames = "";
    _.each(arrayOfProducerIds, function (producerId) {
        var producer = Producers.findOne(producerId);
        if (!producer) return null;
        if (producerId == _.last(this)) {
            producerNames += producer.name;
        } else {
            producerNames += producer.name + ", ";
        }
    }, arrayOfProducerIds);
    return producerNames;
};


get_.userOrThrowError = function () {
    var user = Meteor.user();
    if (user) {
        return user;
    } else {
        throw new Meteor.Error(401, "You need to login");
    }
};

get_.ideologyOrThrowError = function (ideologyId) {
    var ideology = Ideologies.findOne(ideologyId);
    if (ideology) {
        return ideology;
    } else {
        throw new Meteor.Error(600, "Ideology not found");
    }
};



get_.pointsFromScore = function (score) {
    if (score < 25)
        return 0;
    else if (score < 49)
        return 0.1;
    else if (score < 70)
        return 0.5;
    else if (score < 80)
        return 1;
    else if (score < 90)
        return 2;
    else if (score <= 100)
        return 5;
    else if (score > 100)
        throwError("Score cannot be over 100");
};

get_.badgesFromPoints = function (points) {
    if (points < 5)
        return false;
    else if (points < 15)
        return ["bronze"];
    else if (points < 50)
        return ["bronze", "silver"];
    else
        return ["bronze", "silver", "gold"];
};

get_.badgesForReviewedIdeologies = function (userId) {
    var badges = [],
        arrayOfAllIdeologiesReviewedByUser = get_.arrayOfAllIdeologiesReviewedByUser(userId);

    if (arrayOfAllIdeologiesReviewedByUser) {
        _.each(arrayOfAllIdeologiesReviewedByUser, function (ideologyId) {
            var workIdsForIdeology = get_.arrayOfAllWorkIdsUserHasReviewedForIdeology(userId, ideologyId),
                pointsForIdeology = 0;

            _.each(workIdsForIdeology, function (worksId) {
                pointsForIdeology += get_.popularPointsFromWorkForThisIdeology(worksId, ideologyId);
            });

            if (pointsForIdeology >= 5) {
                var ideology = Ideologies.findOne(ideologyId, {fields: {name: 1}}),
                    ideologyNameLowerCase = ideology.name.toLowerCase(),
                    pushToBadges = {};

                if (pointsForIdeology >= 50){
                    pushToBadges.bronze = 'bronze.png';
                    pushToBadges.silver = 'silver.png';
                    pushToBadges.gold = 'gold.png';}
                else if (pointsForIdeology >= 15){
                    pushToBadges.bronze = 'bronze.png';
                    pushToBadges.silver = 'silver.png';}
                else if (pointsForIdeology >= 5)
                    pushToBadges.bronze = 'bronze.png';
                pushToBadges.ideology = ideology;
                pushToBadges.points = pointsForIdeology;

                badges.push(pushToBadges);
            }
        });
        return badges;
    }
};

get_.popularPointsFromWorkForThisIdeology = function (worksId, ideologyId) {
    var ideology = Ideologies.findOne(ideologyId);
    if(ideology && ideology.proponents){
        var ratingsOnIdeology = Ratings.find({ideologyId: ideologyId, userId: {$in: ideology.proponents}}).fetch();

        if (ratingsOnIdeology.length > 0) {
            var ratingsOnWork = _.where(ratingsOnIdeology, {worksId: worksId}),
                score = 0;

            _.each(ratingsOnWork, function (rating) {
                score += rating.scores.convincingScore;
            });

            return get_.pointsFromScore(Math.round(score / ratingsOnWork.length));
        }
    }
};

get_.arrayOfAllWorkIdsUserHasReviewedForIdeology = function (userId, ideologyId) {
    var ratingsOnIdeology = Ratings.find({ideologyId: ideologyId, userId: userId}).fetch();

    if (ratingsOnIdeology.length > 0) {
        return _.uniq(_.pluck(ratingsOnIdeology, 'worksId'));
    }
};


get_.arrayOfAllIdeologiesReviewedByUser = function (userId) {
    var allRatingsByUser = Ratings.find({userId: userId}).fetch();

    if (allRatingsByUser.length > 0) {
        return _.uniq(_.pluck(allRatingsByUser, 'ideologyId'));
    }
};

get_.truePlace = function(place){
    if(place.country && !place.area) {
        return place.country;
    } else if(place.country && place.area) {
        return place.country + ", " + place.area;
    } else if (place.area && !place.country) {
        return place.area;
    } else if(place.universal){
        return "Everywhere";
    }
};

get_.familiarity = function(number){
    return _.findWhere(familiarity, {number: number}).clientName;
};