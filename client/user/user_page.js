Template.userPage.helpers({
    'checkIfHasDuplicate': function(){
        if(this.profile && !this.profile.mergedWithFacebook){
            var currentUser = Meteor.user(),
                visitedUser;
            if(this.username){
                visitedUser = Meteor.users.findOne({username: this.username});
            } else {
                visitedUser = Meteor.users.findOne({"profile.name": this.profile.name});
            }

            if(currentUser && visitedUser){
                Meteor.call('isSameUser', currentUser._id, visitedUser._id, function(err, result){
                    if(result){
                        Session.set('hasDuplicate', true);
                        Session.set('visitedUserId', visitedUser._id);
                    } else {
                        Session.set('hasDuplicate', false);
                        Session.set('visitedUserId', false);
                    }
                    return "";
                });
            }
        }
    },
    ideologyFromId: function(){
        return Ideologies.findOne(this.toString(), {fields: {name: 1}});
    },
    ideologyFromIdeologyId: function(){
        return Ideologies.findOne(this.ideologyId, {fields: {name: 1}});
    },
    policyFromPolicyId: function(){
        return Policies.findOne(this.policyId, {fields: {solution: 1}});
    },
    workFromWorksId: function(){
        return Works.findOne(this.worksId, {fields: {title: 1}});
    },
    ideology: function(){
        if(this.ideologies){
            return Ideologies.findOne(this.ideologies[0]);
        }
    },
    oneIdeology: function(){
        if(this.ideologies.length == 1) return true;
    },
    score: function(){
        switch(Session.get('scoreView')){
            case "convincing-score":
                return this.scores.convincingScore;
                break;
            case "readability-score":
                return this.scores.readabilityScore;
                break;
        }
    },
    hasRatingsOn: function(){
        return Session.get('hasRatingsOn');
    }
});

Template.userPage.events({
    'click .merge-accounts': function(){
        Meteor.call('mergeAccounts', Meteor.userId(), Session.get('visitedUserId'), function(err){
            if(err) throwError(err.reason);
            Session.set('hasDuplicate', false);
            Session.set('visitedUserId', false);
        });
    },
    "click .link": function(event){
        var currentAttrValue = event.currentTarget.hash;
        $(currentAttrValue).show().siblings().hide();

        if(currentAttrValue !== "#ideologies"){
            Session.set('hasRatingsOn', true);
        } else {
            Session.set('hasRatingsOn', false);
        }

        event.preventDefault();
    }
});