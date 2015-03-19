
Template.chooseIdeology.helpers({
    allIdeologies: function() {
        var ideologies = Ideologies.find({}, {fields: {name: 1}}).fetch();
        if(ideologies) {
            ideologies.sort(function (a, b) {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });

            return ideologies;
        }
    },
    usersIdeologies: function(){
        var user = Meteor.user();
        if(user && user.ideologies) return user.ideologies;
    },
    ideology: function(){
        var user = Meteor.user();
        var lastIdeology = _.last(user.ideologies);
        var currentIdeology = this.toString();
        if(currentIdeology == lastIdeology){
            var ideology = Ideologies.findOne(currentIdeology);
            ideology.last = true;
            return ideology;
        }
        return Ideologies.findOne(currentIdeology);
    }
});

Template.chooseIdeology.events({
    'click #add-ideology': function (event) {
        event.preventDefault();
        var ideology = $('#ideology-text').val();
        if(!ideology) return;

        Meteor.call('createIdeology', ideology, function(error, ideologyId) {
            if (error) {throwError(error.reason);}
            else {
                Meteor.call('addAdherent', ideologyId, function(error){
                   if(error) throwError(error.reason);
                    else $('#ideology-text').val("");
                });
            }
        });
    },
    'click #select-ideology': function(event) {
        event.preventDefault();
        var ideologyName = $('#ideology-selector').val();
        if(!ideologyName) return;
        var ideology = Ideologies.findOne({name: ideologyName});

        Meteor.call('addAdherent', ideology._id, function(error) {
            if (error) {throwError(error.reason)}
            else {}
        });
    },
    'click #reject-ideology': function(event){
        event.preventDefault();
        var ideologyName = $('.choose-ideology .reject-ideology-selector').val();
        if(!ideologyName) return;


        Meteor.call('stopSubscribingToIdeology', ideologyName, function(err){
            if(err) throwError(error.reason);
        });
    }
});


