ServiceConfiguration.configurations.remove({
    service: 'facebook'
});

ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: "1393782600864351",
    secret: "23f3a3b35103099da77beeeea8af7d97"
});


Accounts.onCreateUser(function(options, user){
    if(options.profile){
        user.profile = options.profile;
        if(options.profile.name && !options.username){
            var splitName = user.profile.name.split(" "),
                functionalUsername = (splitName[0] + "." + splitName[1]).toLowerCase(),
                anyUserWithSameUsername = Meteor.users.findOne({username: functionalUsername});

            if(anyUserWithSameUsername){
                user.username = functionalUsername + "." + Random.id();
            } else {
                user.username = functionalUsername;
            }
        }
    }
    return user;
});