Template.layout.events({
    'click .updates': function(){

        var obj = getOffset($('.updates')[0]),
            updatesDiv = $('.updates-div');


        if(updatesDiv.is(":visible")){
            updatesDiv.hide();
        } else {
            updatesDiv.offset({ top: obj.top, left: obj.left});
            updatesDiv.show();
            updatesDiv.offset({ top: obj.top, left: obj.left});
        }
    }
});

function getOffset(el){
    el = el.getBoundingClientRect();
    return {
        top: el.bottom + window.scrollY,
        left: el.left + window.scrollX - 230
    }
}

Template.trueHeader.helpers({
    updates: function(){
        console.log("jk");
        Meteor.call('getFiveUpdates', function(err, fiveRatings){
            console.log(fiveRatings);
            return fiveRatings;
        });
    }
});