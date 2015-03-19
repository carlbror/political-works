producers_ = {};

producers_.createNewProducers = function(arrayOfProducerNames){
    var producerIds = [];

    _.each(arrayOfProducerNames, function(producerName){
        if(producerName){
            var producer = Producers.findOne({name: producerName});
            if(producer){
                producerIds.push(producer._id);
            } else {
                producerIds.push(Producers.insert({
                    name: producerName
                }));
            }
        }
    });

    return producerIds;
};