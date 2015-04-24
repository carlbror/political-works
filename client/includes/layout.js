Template.layout.events({
    'click .updates': function(){
        Session.set('updates', !Session.get('updates'));
        var obj = getUpdatesOffset($('.updates')[0]),
            updatesDiv = $('.updates-div');


        if(updatesDiv.is(":visible")){
            updatesDiv.hide();
        } else {
            updatesDiv.offset(obj);
            updatesDiv.show();
            updatesDiv.offset(obj);
        }
    },
    "click #login-buttons-logout": function(event){
        Session.set('updates', 'none');
    }
});

function getUpdatesOffset(el){
    el = el.getBoundingClientRect();
    return {
        top: el.bottom + window.scrollY + 19,
        left: el.right + window.scrollX - 290
    }
}

Template.trueHeader.helpers({
    updates: function(){
        var sessionUpdates = Session.get('updates');
        return ReactiveMethod.call("getFiveUpdates", sessionUpdates);
    },
    usernameFromId: function(){
        return Meteor.users.findOne(this.userId, {fields: {username: 1}}).username;
    },
    ideologyNameFromId: function(){
        return Ideologies.findOne(this.ideologyId, {fields: {name: 1}}).name;
    },
    workFromId: function(){
        return Works.findOne(this.worksId, {fields: {_id: 1}});
    },
    understandableDate: function(){
        var date = this.date.toUTCString();

        return date.substring(17, 22) + " - " + date.substring(0, 14);
    }
});

Template.trueHeader.events({
    "click .update-link": function(event){
        if(event.target.id){
            Session.set("updates", !Session.get("updates"));
            Meteor.call('addCheckedRatingToUser', event.target.id, function(err, res){
            });
            $('.updates-div').hide();
        }
    }
});

Template.layout.rendered = function(){
    $('body').on('keydown', function(e){
        if(e.which === 27){
            $('.updates-div').hide();
        }
    });

    $('body').on('click', function(e){
        if(e.target.className !== "updates-div" && e.target.className !== "updates"
            && e.target.className !== "updates-cog fa fa-cog" && e.target.className !== "updates-related updates-intro"
            && e.target.className !== "updates-related"){
            $('.updates-div').hide();
        }
    });

    $(window).resize(function(){
        if(Meteor.userId()){
            var obj = getUpdatesOffset($('.updates')[0]),
                updatesDiv = $('.updates-div');

                updatesDiv.offset(obj);
                updatesDiv.show();
                updatesDiv.offset(obj);
        }
    });
}