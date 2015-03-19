o_.throwIfUserAlreadySubscribesToThisIdeology = function(user, ideologyId){
    if(user.ideologies && _.contains(user.ideologies, ideologyId)) {
        throw new Meteor.Error(600, "You have already subscribed to this ideology");
    }
};

o_.throwIfIdeologyAlreadyHasUserAsAdherent = function(ideology, userId){
    if(ideology.proponents && _.contains(ideology.proponents, userId)){
        throw new Meteor.Error(600, "You are already subscribing to this ideology");
    }
};