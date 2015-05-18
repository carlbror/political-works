Template.addNewScience.events({
    'click .add-new-science': function(event){
        console.log($('.field').val());
        Meteor.call('addNewScience', $('.field').val());
    }
});