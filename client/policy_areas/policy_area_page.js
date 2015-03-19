Template.policyAreaPage.events({
    'click .add-policy-for-an-area': function(){
        Router.go('discussAPolicyArea', {_id: this._id});
    }
});