Meteor.publish('ideologies', function() {
    return Ideologies.find();
});

Meteor.publish('works', function() {
    return Works.find();
});


Meteor.publish('ratings', function(){
    return Ratings.find();
});

Meteor.publish('producers', function(){
    return Producers.find();
});

Meteor.publish('policies', function(){
    return Policies.find();
});

Meteor.publish('policyAreas', function(){
    return PolicyAreas.find();
});

Meteor.publish('places', function(){
    return Places.find();
});

Meteor.publish('sciences', function(){
    return Sciences.find();
});

Meteor.publish('lists', function(){
    return Lists.find();
});

Meteor.publish('ittData', function(){
    return ITT.find({}, {fields: {name:1, firstIdeologyId:1, secondIdeologyId:1, firstQuestions:1, secondQuestions: 2}});
});

Meteor.publish("userData", function () {
    return Meteor.users.find({},
        {fields: {
            username: 1,
            ideologies: 1,
            valuableWorks: 1,
            criticalWorks: 1,
            "services.ratings": 1,
            "profile.name": 1,
            "profile.mergedWithFacebook": 1,
            "updates.checked": 1
        }});
});

