Template.layout.events({
    'click .updates': function(){
        console.log("hj");
        console.log(getOffset($('.updates')[0]));

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