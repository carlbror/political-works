Template.policyList.helpers({
    producerNames: function(){
        return get_.producerNamesFromIds(this.producers);
    }
});