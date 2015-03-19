function SpecialAlert(){
    this.render = function(dialog){
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var dialogoverlay = document.getElementById('dialogoverlay');
        var dialogbox = document.getElementById('dialogbox');

        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = windowHeight + "px";

        dialogbox.style.left = (windowWidth / 2) - (550 * 0.5) + "px";
        dialogbox.style.top = "100px";
        dialogbox.style.display = "block";
        document.getElementById('dialogboxhead').innerHTML = "Acknowledge This Message";
    }
    this.close = function(){
        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";

    }
};
var Alert = new SpecialAlert();

Template.specialAlert.events({
    'click .start-custom-alert': function(){
        Alert.render("no truth");
    },
    'click .close-custom-alert': function(){
        Alert.close();
    }
});

Template.specialAlert.rendered = function(){
    $('body').on('keydown', function(e){
        if(e.which === 27){
            Alert.close();
        }
    });

    $('body').on('click', function(e){
        if(e.target.id === "dialogoverlay"){
            Alert.close();
        }
    });
}