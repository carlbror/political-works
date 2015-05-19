Template.sciencePage.events({
    'click .add-work-on-science': function(){
        SciencyAlert.render(this.field.english);
    }
});



Template.sciencePage.helpers({
    workFromWorksId: function(){
        if(this.worksId){
            return Works.findOne(this.worksId, {fields: {title: 1}});
        }
    }
});