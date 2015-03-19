Template.logIn.events({
    'click .register-login': function(){
        var password2 = $('.password-2'),
            login = $('.log-in'),
            createAccount = $('.create-account'),
            registerLink = $('.register-link'),
            loginLink = $('.login-link');

        if(password2.is(':visible')){
            password2.hide();
            login.show();
            createAccount.hide();
            registerLink.show();
            loginLink.hide();}
        else{
            password2.show();
            login.hide();
            createAccount.show();
            registerLink.hide();
            loginLink.show();}
    },
    'keyup .password-2, paste .password-2, keyup .password-1, paste .password-1': function(){
        if($('.password-2').val().length <6){
            $('.create-account').prop('disabled', true);}
        else{
            if($('.password-1').val() === $('.password-2').val()){
                $('.create-account').prop('disabled', false);}
            else
                $('.create-account').prop('disabled', true);}

    },
    'click .log-in': function(){
        Meteor.loginWithPassword($('.username').val(), $('.password-1').val(), function(err){
            if(err) throwError(err.reason);
            else
                Router.go('frontPage');
        });
    },
    'click .create-account': function(){
        Accounts.createUser({username: $('.username').val(), password: $('.password-2').val()}, function(err){
            if(err) throwError(err.reason);
            else
                Router.go('frontPage');
        });
    },
    'click .log-out': function(){
        Meteor.logout(function(err){
            if(err) throwError(err.reason);
            else
                location.reload();
        });
    }
});