Template.userPage.helpers({
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