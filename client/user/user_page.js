Template.userPage.helpers({
    notSameUser: function(){
        if(Meteor.userId() && Meteor.userId() !== this._id) return true;
    },
    ideologyFromId: function(){
        return Ideologies.findOne(this.toString(), {fields: {name: 1}});
    },
    policyAreaFromPolicyAreaId: function(){
        return PolicyAreas.findOne(this.policyAreaId, {fields: {area: 1}});
    },
    ideologyFromIdeologyId: function(){
        return Ideologies.findOne(this.ideologyId, {fields: {name: 1}});
    },
    policyFromPolicyId: function(){
        return Policies.findOne(this.policyId, {fields: {solution: 1}});
    },
    workFromWorksId: function(){
        return Works.findOne(this.userRating.worksId, {fields: {title: 1}});
    },
    yourFamiliarity: function(){
        return get_.familiarity(this.yourRating.familiarity);
    },
    usersFamiliarity: function(){
        return get_.familiarity(this.userRating.familiarity);
    },
    oneIdeology: function(){
        if(this.ideologies.length == 1) return true;
    },
    hasRatingsOn: function(){
        return Session.get('hasRatingsOn');
    },
    hasPolicyAreaRatingsOn: function(){
        return Session.get('hasPolicyAreaRatingsOn');
    },
    percentEngaged: function(){
        if(this._id){
            var allWorks = Works.find({}, {fields: {_id: 1}}).fetch(),
                allReviewsAtLeastPartakenOnce = Ratings.find({userId: this._id, familiarity: {$gte: 4}},
                    {fields: {worksId: 1}}).fetch();

            if(allWorks.length > 0 && allReviewsAtLeastPartakenOnce.length > 0){
                var arrayOfAllWorksIds = _.pluck(allWorks, "_id"),
                    arrayOfAllReviews = _.uniq(_.pluck(allReviewsAtLeastPartakenOnce, 'worksId'));

                return Math.round((arrayOfAllReviews.length / arrayOfAllWorksIds.length) * 100);
            } else {
                return "zero ";
            }
        }
    },
    percentOfOthersSupportiveWorksForTheirIdeologies: function(){
        if(this._id){
            var user = Meteor.users.findOne(this._id),
                allReviewsAtLeastPartakenOnce = Ratings.find({userId: this._id, familiarity: {$gte: 4}},
                    {fields: {worksId: 1}}).fetch();
            if(user){
                var othersSupportiveRatings;
                if(user.ideologies){
                    othersSupportiveRatings = Ratings.find({ideologyId: {$nin: user.ideologies}, ratingType: "positive"}).fetch();
                } else {
                    othersSupportiveRatings = Ratings.find({ratingType: "positive"}).fetch();
                }

                if(othersSupportiveRatings.length > 0 && allReviewsAtLeastPartakenOnce.length > 0){
                    var othersReviewedWorks = _.uniq(_.pluck(othersSupportiveRatings, 'worksId')),
                        usersRevewedWorksOnOthersIdeologies = _.intersection(othersReviewedWorks,
                            _.uniq(_.pluck(allReviewsAtLeastPartakenOnce, 'worksId')));

                    return Math.round((usersRevewedWorksOnOthersIdeologies.length / othersReviewedWorks.length) * 100);
                } else {
                    return "zero";
                }
            }
        }
    },
    worksYouHaveEncountered: function(){
        var yourRatings = Ratings.find({userId: Meteor.userId(), familiarity: {$gt: 0}}).fetch(),
            usersRatings = Ratings.find({userId: this._id, familiarity: {$gt: 0}}).fetch(),
            bothRatings = [];

        if(yourRatings.length > 0 && usersRatings.length > 0){
            var yourWorks = _.pluck(yourRatings, "worksId"),
                usersWorks = _.pluck(usersRatings, "worksId"),
                bothWorks = _.intersection(yourWorks, usersWorks);

            _.each(bothWorks, function(worksId){
                bothRatings.push({userRating: _.findWhere(usersRatings, {worksId: worksId}),
                    yourRating: _.findWhere(yourRatings, {worksId: worksId})});
            });

            return bothRatings;
        }
    }
});

Template.userPage.events({
    "click .link": function(event){
        var currentAttrValue = event.currentTarget.hash;
        $(currentAttrValue).show().siblings().hide();

        if(currentAttrValue === "#statistics"){
            Session.set('hasRatingsOn', false);
            Session.set('hasPolicyAreaRatingsOn', false);
        } else if($(event.target).attr('class') === 'link policyArea'){
            Session.set('hasRatingsOn', false);
            Session.set('hasPolicyAreaRatingsOn', true);
            if(!Session.get('scoreView') || Session.get('scoreView') === "convincingScore"){
                Session.set('scoreView', 'enlighteningScore');
            }
        } else if(currentAttrValue === "#comparisons"){
            Session.set('hasRatingsOn', false);
            Session.set('hasPolicyAreaRatingsOn', false);
        } else if(currentAttrValue !== "#ideologies"){
            Session.set('hasPolicyAreaRatingsOn', false);
            Session.set('hasRatingsOn', true);
            if(!Session.get('scoreView') || Session.get('scoreView') === "enlighteningScore"){
                Session.set('scoreView', 'convincingScore');
            }
        } else {
            Session.set('hasRatingsOn', false);
            Session.set('hasPolicyAreaRatingsOn', false);
        }

        event.preventDefault();
    }
});

Template.workItemForUserPage.helpers({
    score: function(){
        return this.scores[Session.get('scoreView')];
    },
    workFromWorksId: function(){
        return Works.findOne(this.worksId, {fields: {title: 1}});
    }
});