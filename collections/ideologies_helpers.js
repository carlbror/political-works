
ideologies_.createIdeology = function(name){
    name = o_.capitaliseFirstLetter(name);

    var ideology = Ideologies.findOne({name: name});

    if(ideology){
        return ideology._id;
    } else {
        var ideologyId = Ideologies.insert({
            name: name,
            date: new Date()
        });
        return ideologyId;
    }
};