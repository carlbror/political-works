Template.login.events({
    'submit #logout-form': function(e,t){
        e.preventDefault();
        Meteor.logout(function(err){
                if(err) throwError(err.reason);
        });
    },
    'submit #login-form': function(e, t){
        e.preventDefault();
        var usernameOrEmail = t.find('#login-username-or-email').value,
            password = t.find('#login-password').value;

        Meteor.loginWithPassword(usernameOrEmail, password, function(err){
            if(err) throwError(err);
            else{
                var user = Meteor.user();
                if(user){
                    window.history.back();
                }
            }
        });
        return false;
    },
    'submit #register-form': function(e, t){
        e.preventDefault();
        var profileName = t.find('#account-name').value,
            username = t.find('#account-username').value,
            email = t.find('#account-email').value,
            password = t.find('#account-password').value,
            passwordRepeat = t.find('#account-password-repeat').value;

        email = trimInput(email);
        if(password !== passwordRepeat) throwError("Passwords don't match.")

        Accounts.createUser({username: username, email: email, password: password, profile: {name: profileName}}, function(err){
            if(err){
                throwError(err.message);
            } else {
                window.history.back();
            }
        });
        return false;
    },
    'click .register-login': function(){
        var login = $('.login-test'),
            register = $('.register');
        if(login.is(':visible')){
            login.hide();
            register.show();
        } else if(register.is(':visible')){
            register.hide();
            login.show();
        }
    }
});




// trim helper
var trimInput = function(val) {
    return val.replace(/^\s*|\s*$/g, "");
};