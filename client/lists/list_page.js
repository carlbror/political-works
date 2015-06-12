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

    }
});

