Template.listPage.helpers({
    hasRead: function(){
        if(Ratings.findOne({worksId: this._id, userId: Meteor.userId(), familiarity: {$gt: 1}})){
            return true;
        }
    }
});

Template.listPage.events({
    'click .stop-start-subscribing-to-list': function(){
        Meteor.call('toggleSubscriptionToList', this.list._id, this.subscribes, function(err){
            if(err) throwError(err.reason);
        });
    },
    'click .edit-list': function(){

    }
});