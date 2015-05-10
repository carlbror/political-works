Template.userPage.helpers({
    ideologyFromId: function(){
        return Ideologies.findOne(this.toString(), {fields: {name: 1}});
    },
    policyAreaFromPolicyAreaId: function(){
        return PolicyAreas.findOne(this.policyAreaId, {fields: {area:1}});
    },
    ideologyFromIdeologyId: function(){
        return Ideologies.findOne(this.ideologyId, {fields: {name: 1}});
    },
    policyFromPolicyId: function(){
        return Policies.findOne(this.policyId, {fields: {solution: 1}});
    },
    ideology: function(){
        if(this.ideologies){
            return Ideologies.findOne(this.ideologies[0]);
        }
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