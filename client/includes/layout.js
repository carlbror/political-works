var updatesData;

Template.layout.events({
    'click .updates': function(){
        Session.set('updates', !Session.get('updates'));
        var obj = getUpdatesOffset($('.updates')[0]),
            updatesDiv = $('.updates-div');

        if(updatesDiv.is(":visible")){
            updatesDiv.hide();
        } else {
            updatesDiv.offset(obj);
            updatesDiv.show();
            updatesDiv.offset(obj);
            var heightOfDiv = 75 + 44 * updatesData.length;
            if(updatesData.length === 0)
                heightOfDiv = 40;

            updatesDiv.height(heightOfDiv);
        }
    },
    "click #login-buttons-logout": function(event){
        Session.set('updates', 'none');
    },
    'click .sign-out a': function(){
        Meteor.logout(function(err){
            if(err)
                throwError(err);
        });
    },
    'click .sign-in': function(){
        var obj = getSignInOffset($('.sign-in')[0]),
            loginDiv = $('.login-div');

        if(loginDiv.is(":visible")){
            loginDiv.hide();
        } else {
            loginDiv.offset(obj);
            loginDiv.show();
            loginDiv.offset(obj);
        }
    },
    'submit #login-form': function(e, t){
        e.preventDefault();
        var usernameOrEmail = t.find('#login-username-or-email').value,
            password = t.find('#login-password').value;

        Meteor.loginWithPassword(usernameOrEmail, password, function(err){
            if(err) throwError(err);
            else {
                var user = Meteor.user();
                if(user){
                    $('#login-username-or-email').val("");
                    $('#login-password').val("");
                    $('.login-div').hide();
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

        if(password !== passwordRepeat) throwError("Passwords don't match.")

        Accounts.createUser({username: username, email: email, password: password, profile: {name: profileName}}, function(err){
            if(err){
                throwError(err.message);
            } else {
                $('#account-name').val("");
                $('#account-username').val("");
                $('#account-email').val("");
                $('#account-password').val("");
                $('#account-password-repeat').val("");
                $('.login-div').hide();
            }
        });
        return false;
    },
//    'submit .sign-in-with-facebook': function(e,t){
//        e.preventDefault();
//        Meteor.loginWithFacebook(function(){
//            $('#login-username-or-email').val("");
//            $('#login-password').val("");
//            $('#account-name').val("");
//            $('#account-username').val("");
//            $('#account-email').val("");
//            $('#account-password').val("");
//            $('#account-password-repeat').val("");
//            $('.login-div').hide();
//        });
//    },
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

function getUpdatesOffset(el){
    el = el.getBoundingClientRect();
    return {
        top: el.bottom + window.scrollY + 19,
        left: el.right + window.scrollX - 290
    }
}

function getSignInOffset(el){
    el = el.getBoundingClientRect();
    return {
        top: el.bottom + window.scrollY + 19,
        left: el.right + window.scrollX - 320
    }
}

Template.trueHeader.helpers({
    updates: function(){
        var sessionUpdates = Session.get('updates');
        updatesData = ReactiveMethod.call("getFiveUpdates", sessionUpdates);
        return updatesData;
    },
    profileNameFromId: function(){
        return Meteor.users.findOne(this.userId, {fields: {"profile.name": 1}}).profile.name;
    },
    ideologyNameFromId: function(){
        return Ideologies.findOne(this.ideologyId, {fields: {name: 1}}).name;
    },
    workFromId: function(){
        return Works.findOne(this.worksId, {fields: {_id: 1}});
    },
    understandableDate: function(){
        var differenceInTime = new Date().getTime() - this.date.getTime();

        switch(true){
            case differenceInTime < 60000:
                return "A few seconds ago";
                break;
            case 60000 <= differenceInTime && differenceInTime < 120000:
                return "One minute ago";
                break;
            case 120000 <= differenceInTime && differenceInTime < 180000:
                return "Two minutes ago";
                break;
            case 180000 <= differenceInTime && differenceInTime < 240000:
                return "Three minutes ago";
                break;
            case 240000 <= differenceInTime && differenceInTime < 300000:
                return "Four minutes ago";
                break;
            case 300000 <= differenceInTime && differenceInTime < 360000:
                return "Five minutes ago";
                break;
            case 360000 <= differenceInTime && differenceInTime < 420000:
                return "Six minutes ago";
                break;
            case 420000 <= differenceInTime && differenceInTime < 480000:
                return "Seven minutes ago";
                break;
            case 480000 <= differenceInTime && differenceInTime < 540000:
                return "Eight minutes ago";
                break;
            case 540000 <= differenceInTime && differenceInTime < 600000:
                return "Nine minutes ago";
                break;
            case 600000 <= differenceInTime && differenceInTime < 660000:
                return "Ten minutes ago";
                break;
            case 660000 <= differenceInTime && differenceInTime < 3600000:
                return Math.round(differenceInTime / 60000) + " minutes ago";
                break;
            case 3600000 <= differenceInTime && differenceInTime < 86400000:
                return Math.round(differenceInTime / 3600000) + " hours ago";
                break;
            case 86400000 <= differenceInTime:
                var date = this.date.toUTCString();

                return date.substring(0, 11) + ", " + date.substring(16, 22);
        }

    }
});

Template.trueHeader.events({
    "click .update-link": function(event){
        if(event.target.id){
            Session.set("updates", !Session.get("updates"));
            Meteor.call('addCheckedRatingToUser', event.target.id, function(err, res){
            });
            $('.updates-div').hide();
        }
    }
});

Template.layout.rendered = function(){
    var loginDiv = $('.login-div');

    $('body').on('keydown', function(e){
        if(e.which === 27){
            $('.updates-div').hide();
            loginDiv.hide();
        }
    });

    $('body').on('click', function(e){
        if(e.target.className !== "updates-div" && e.target.className !== "updates"
            && e.target.className !== "updates-cog fa fa-cog" && e.target.className !== "updates-related updates-intro"
            && e.target.className !== "updates-related"){
            $('.updates-div').hide();
        }

        if(!$(e.target).parents('.login-div').length && e.target.className !== "sign-in"){
            loginDiv.hide();
        }
    });

    $(window).resize(function(){
        if(Meteor.userId() && $('.updates-div').is(":visible")){
            var obj = getUpdatesOffset($('.updates')[0]),
                updatesDiv = $('.updates-div');

            updatesDiv.offset(obj);
            updatesDiv.show();
            updatesDiv.offset(obj);
        }

        if(loginDiv.is(":visible")){
            var obj = getSignInOffset($('.sign-in')[0]);

            loginDiv.offset(obj);
            loginDiv.show();
            loginDiv.offset(obj);
        }
    });
}