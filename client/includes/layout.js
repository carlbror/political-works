Template.layout.events({
    'click .updates': function(){

        var obj = getOffset($('.updates')[0]),
            updatesDiv = $('.updates-div');


        if(updatesDiv.is(":visible")){
            updatesDiv.hide();
        } else {
            updatesDiv.offset({ top: obj.top, left: obj.left});
            updatesDiv.show();
            updatesDiv.offset({ top: obj.top, left: obj.left});
        }
    }
});

function getOffset(el){
    el = el.getBoundingClientRect();
    return {
        top: el.bottom + window.scrollY,
        left: el.left + window.scrollX - 290
    }
}

Template.trueHeader.helpers({
    updates: function(){
        return ReactiveMethod.call("getFiveUpdates");
    },
    usernameFromId: function(){
        return Meteor.users.findOne(this.userId, {fields: {username: 1}}).username;
    },
    ideologyNameFromId: function(){
        return Ideologies.findOne(this.ideologyId, {fields: {name: 1}}).name;
    },
    workFromId: function(){
        return Works.findOne(this.worksId, {fields: {_id:1}});
    }
});