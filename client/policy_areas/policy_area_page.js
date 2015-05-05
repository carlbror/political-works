Template.policyAreaPage.events({
    'click .add-policy-for-an-area': function(){
        Router.go('discussAPolicyArea', {_id: this._id});
    },
    'click .add-work-on-area': function(){
        AreaAlert.render(this.area);
    }
});