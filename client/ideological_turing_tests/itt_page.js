Template.ittPage.helpers({
    firstIdeology: function(){
        if(this.itt){
            return Ideologies.findOne(this.itt.firstIdeologyId);
        }
    },
    secondIdeology: function(){
        if(this.itt){
            return Ideologies.findOne(this.itt.secondIdeologyId);
        }
    },
    openOrClosed: function(){
        if(this.itt){
            return moment(this.itt.date).calendar()
        }
    }
});

Template.ittPage.events({
    'click .answer-questions-for-itt': function(event){
        event.preventDefault();
        var user = Meteor.user();
        if(this.itt){
            if(this.itt.secondQuestions){
                if(_.contains(user.ideologies, this.itt.firstIdeologyId) && _.contains(user.ideologies, this.itt.secondIdeologyId)){
                    alert("Unfortunately, you are a proponent of both ideologies, so you cannot participate in this test.")
                } else if(_.contains(user.ideologies, this.itt.firstIdeologyId) || _.contains(user.ideologies, this.itt.secondIdeologyId)){
                    Router.go('ittAnswerPage', {_id: this.itt._id});
                } else {
                    $("#dialog").dialog();
                }
            }
        }
    }
});

Template.ittPage.rendered = function(){
    $('body').on('keydown',function(e){
        if(e.which === 27){
            $('.ui-dialog-content').dialog('close');
        }
    }).on('click', function(e){
            if(!$(e.target).parents('.ui-dialog').length &&
                $(e.originalEvent.target).attr('class') !== "ui-dialog" &&
                $(e.originalEvent.target).attr('class') !== "answer-questions-for-itt" ||
                $(e.originalEvent.target).attr('class') === "choose-ideology"){
                $('.ui-dialog-content').dialog('close');
            }
        });
};