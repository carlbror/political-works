var isEditing;
var isEditingDep = new Deps.Dependency;

var getIsEditing = function () {
    isEditingDep.depend();
    return isEditing;
};

var setIsEditing = function (newValue) {
    isEditing = newValue;
    isEditingDep.changed();
};

Template.listPage.helpers({
    hasRead: function(){
        if(Ratings.findOne({worksId: this._id, userId: Meteor.userId(), familiarity: {$gt: 1}})){
            return true;
        }
    },
    editing: function(){
        return getIsEditing();
    },
    important: function(){
        if(this.importantWork) return "checked";
    },
    essential: function(){
        if(this.essentialWork) return "checked";
    },
    users: function(){
        return Meteor.users.find({subscribers: {$in: Template.parentData().list.subscribers},
            _id: {$nin: Template.parentData().list.coAdmins}}, {sort: {"profile.name": 1}}).fetch();
    }
});

Template.listPage.events({
    'click .stop-start-subscribing-to-list': function(){
        Meteor.call('toggleSubscriptionToList', this.list._id, this.subscribes, function(err){
            if(err) throwError(err.reason);
        });
    },
    'click .edit-list': function(){
        setIsEditing(!getIsEditing());
    },
    'change .important-work': function(event){
        $('#essential-' + event.target.id.split('-')[1]).prop('checked', false);
        Meteor.call('changeListComposition', Template.parentData().list._id, event.target.id.split('-')[1],
            $('#important-' + event.target.id.split('-')[1]).is(":checked"), true, function(err){
            if(err) throwError(err.reason);
        });
    },
    'change .essential-work': function(event){
        $('#important-' + event.target.id.split('-')[1]).prop('checked', false);
        Meteor.call('changeListComposition', Template.parentData().list._id, event.target.id.split('-')[1],
            $('#essential-' + event.target.id.split('-')[1]).is(":checked"), false, function(err){
                if(err) throwError(err.reason);
            });
    },
    'click .add-co-admin': function(event){
        var addAdminsDiv = $('.add-admins-div'),
            overlay = $('.overlay');

        addAdminsDiv.show();
        overlay.show();
    },
    'change .add-admin-checkbox': function(event){
        Meteor.call('addAdmin', Template.parentData().list._id, event.target.id.plit('-')[1], function(err){
            if(err) throwError(err.reason);
        });
    }
});

