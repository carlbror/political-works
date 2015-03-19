Template.worksList.helpers({
    producerNames: function(){
        if(this.producers) {
            return get_.producerNamesFromIds(this.producers);
        }
    }
});