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
                    $( "#dialog" ).dialog();
                }
            }
        }
    },
    'click a': function(e){
        console.log($(e.originalEvent.target).attr('class'))
        if($(e.originalEvent.target).attr('class') !== "answer-questions-for-itt"){
            console.log(2);
            $('.ui-dialog-content').dialog('close');
        }
    }
});