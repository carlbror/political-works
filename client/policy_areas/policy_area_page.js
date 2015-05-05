Template.policyAreaPage.events({
    'click .add-policy-for-an-area': function(){
        Router.go('discussAPolicyArea', {_id: this._id});
    },
    'click .add-work-on-area': function(){
        AreaAlert.render(this.area);
    }
});

Template.policyAreaPage.helpers({
    workFromWorksId: function(){
        if(this.worksId){
            return Works.findOne(this.worksId, {fields: {title: 1}});
        }
    }
})