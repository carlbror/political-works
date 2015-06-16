var isEditing;
var isEditingDep = new Deps.Dependency;

var getIsEditing = function(){
    isEditingDep.depend();
    return isEditing;
};

var setIsEditing = function(newValue){
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
        if(this.list){
            return Meteor.users.find({_id: {$in: this.list.subscribers, $nin: this.list.coAdmins}},
                {sort: {"profile.name": 1}}).fetch();
        }
    }
});


var addAdminsDiv,
    overlay;

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
        if(!addAdminsDiv){
            addAdminsDiv = $('.add-admins-div');
            overlay = $('.overlay');
        }

        addAdminsDiv.show();
        overlay.show();
    },
    'change .add-admin-checkbox': function(event){
        var checkedValues = $('input:checkbox:checked').map(function() {
            return this.id.split('-')[1];
        }).get();
        if(checkedValues.length > 0){
            $('.add-these-admins').prop('disabled', false);
        } else {
            $('.add-these-admins').prop('disabled', true);
        }
    },
    'click .add-admins-div .admins-div-header span:last-child': function(event){
        addAdminsDiv.hide();
        overlay.hide();
    },
    'click .add-these-admins': function(event){
        var checkedValues = $('input:checkbox:checked').map(function() {
            return this.id.split('-')[1];
        }).get();

        Meteor.call('addAdmins', Template.parentData().list._id, checkedValues, function(err){
            if(err) throwError(err.reason);
        });
    }
});


Template.listPage.rendered = function(){
    $('body').on('keydown',function(e){
        if(e.which === 27){
            if(addAdminsDiv.is(':visible')){
                addAdminsDiv.hide();
                overlay.hide();
            }
        }
    }).on('click', function(e){
            if(!addAdminsDiv){
                addAdminsDiv = $('.add-admins-div');
                overlay = $('.overlay');
            }
            if(!$(e.target).parents('.add-admins-div').length &&
                !($(e.originalEvent.target).attr('class') === "btn btn-primary add-co-admin") &&
                !($(e.originalEvent.target).attr('class') === "add-admins-div on-overlay")){
                addAdminsDiv.hide();
                overlay.hide();
            }
        }
    );
};
