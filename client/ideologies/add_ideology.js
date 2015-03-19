Template.addIdeology.events({
    'click .add-ideology': function (event) {
        event.preventDefault();
        var ideology = $('.ideology-text').val();
        if (!ideology) return;

        Meteor.call('createIdeology', ideology, function (error, ideologyId) {
            if (error) {
                throwError(error.reason);
            }
            else {
                $('.ideology-text').val("");
                Session.set('createdIdeology', ideologyId);
            }
        });
    }
});