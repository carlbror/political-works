var requireLoginFilter = function(){
    if (!Meteor.userId()){
        Router.go('logIn');
        this.stop();
    }
    this.next();
};

Router.before(requireLoginFilter, {only: ['chooseIdeology', 'addIdeology', 'discussAPolicy',
'discussAPolicyArea', 'createNewPolicyArea', 'newAddWork']});