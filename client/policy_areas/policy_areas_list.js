Template.policyAreasList.helpers({
    producerNames: function(){
        return get_.producerNamesFromIds(this.producers);
    }
});