Template.addNewScience.events({
    'click .add-new-science': function(event){
        Meteor.call('addNewScience', $('.field').val(), function(err){
            if(err) throwError(err.message);
            $('field').val("");
        });
    }
});