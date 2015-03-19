Template.placePage.helpers({
    policies: function(){
        return Policies.find({placeId: this._id}).fetch();
    }
});