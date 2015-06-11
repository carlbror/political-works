Template.worksList.helpers({
    producerNames: function(){
        if(this.producers) {
            return get_.producerNamesFromIds(this.producers);
        }
    }
});

Template.worksList.events({
    'click .add-new-work': function(){
        NewWorkAlert.render();
    }
});