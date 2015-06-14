Template.addAdminsPopup.helpers({
    users: function(){
        return Meteor.users.find({_id: {$not: Meteor.userId()}}, {sort: {"profile.name": 1}}).fetch();
    }
});

function generalAlert(){
    this.render = function(dialog){
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var dialogoverlay = document.getElementById('generalDialogoverlay');
        var dialogbox = document.getElementById('generalDialogbox');

        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = windowHeight + "px";

        dialogbox.style.left = (windowWidth / 2) - (600 * 0.5) + "px";
        dialogbox.style.top = "60px";
        dialogbox.style.display = "block";
//        document.getElementById('generalDialogboxhead').innerHTML = dialog;
    }
    this.close = function(){
        document.getElementById('generalDialogbox').style.display = "none";
        document.getElementById('generalDialogoverlay').style.display = "none";
    }
};
NewGeneralAlert = new generalAlert();


Template.addAdminsPopup.rendered = function(){
    $('body').on('keydown',function(e){
        if(e.which === 27){
            GeneralAlert.close();
        }
    }).on('click', function(e){
            if(e.target.id === "generalDialogoverlay"){
                NewGeneralAlert.close();
            }

            if(!$(e.target).parents('.general-alert').length){
                NewGeneralAlert.close();
            }
        }
    );
};
