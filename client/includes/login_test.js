Template.loginTest.events({
    'submit #login-form': function(e, t){
        e.preventDefault();
        // retrieve the input field values
        var email = t.find('#login-email').value,
            password = t.find('#login-password').value;

        // Trim and validate your fields here....

        // If validation passes, supply the appropriate fields to the
        // Meteor.loginWithPassword() function.
        Meteor.loginWithPassword(email, password, function(err){
            if(err) throwError(err);
            else
                console.log("jk");
        });
        return false;
    },
    'submit #register-form': function(e, t){
        e.preventDefault();
        var email = t.find('#account-email').value,
            password = t.find('#account-password').value;

        // Trim and validate the input
        email = trimInput(email);

        Accounts.createUser({email: email, password: password}, function(err){
            if(err){
                // Inform the user that account creation failed
            } else {
                // Success. Account has been created and the user
                // has logged in successfully.
            }

        });
        return false;
    }
});




// trim helper
var trimInput = function(val) {
    return val.replace(/^\s*|\s*$/g, "");
}