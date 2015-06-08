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

            updatesDiv[0].style.height = "" + heightOfDiv + "px";
        }
    },
    "click #login-buttons-logout": function(event){
        Session.set('updates', 'none');
    }
});

function getUpdatesOffset(el){
    el = el.getBoundingClientRect();
    return {
        top: el.bottom + window.scrollY + 19,
        left: el.right + window.scrollX - 290
    }
}

Template.trueHeader.helpers({
    updates: function(){
        var sessionUpdates = Session.get('updates');
        updatesData = ReactiveMethod.call("getFiveUpdates", sessionUpdates);
        return updatesData;
    },
    usernameFromId: function(){
        return Meteor.users.findOne(this.userId, {fields: {username: 1}}).username;
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
    $('body').on('keydown', function(e){
        if(e.which === 27){
            $('.updates-div').hide();
        }
    });

    $('body').on('click', function(e){
        if(e.target.className !== "updates-div" && e.target.className !== "updates"
            && e.target.className !== "updates-cog fa fa-cog" && e.target.className !== "updates-related updates-intro"
            && e.target.className !== "updates-related"){
            $('.updates-div').hide();
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
    });
}