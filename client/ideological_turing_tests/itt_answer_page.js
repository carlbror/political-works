Template.ittAnswerPage.helpers({
    wrongIdeologue: function(){
        var user = Meteor.user();
        if(this.itt){
            if(this.itt.secondQuestions){
                if(_.contains(user.ideologies, this.itt.firstIdeologyId) && _.contains(user.ideologies, this.itt.secondIdeologyId)){
                    return true;
                } else if(_.contains(user.ideologies, this.itt.firstIdeologyId) || _.contains(user.ideologies, this.itt.secondIdeologyId)){
                    return false;
                } else {
                    return true;
                }
            } else if(_.contains(user.ideologies, this.itt.firstIdeologyId)){
                return false;
            } else {
                return true;
            }
        }
    },
    wrongIdeologueMessage: function(){
        if(this.itt){
            if(this.itt.secondQuestions){
                if(_.contains(Meteor.user().ideologies, this.itt.firstIdeologyId) && _.contains(user.ideologies, this.itt.secondIdeologyId)){
                    return "Unfortunately, you are a proponent of both ideologies, so you cannot participate in this test.";
                } else {
                    return "Unfortunately, only proponents of either ideology can participate in this test. If you are one and want to " +
                        "take the test, enter which ideology you think is best <a href='/../../choose-ideology'>here</a>.";
                }
            } else {
                return "Unfortunately, only proponents of either ideology can participate in this test. If you are one and want to " +
                    "take the test, enter which ideology you think is best <a href='/../../choose-ideology'>here</a>.";
            }
        }
    },
    firstTypeOrYourself: function(){
        var user = Meteor.user();
        if(this.itt && user){
            if(_.contains(user.ideologies, this.itt.secondIdeologyId)){
                return "as how you interpret " + get_.ideologyNameFromId(this.itt.secondIdeologyId) + "."
            } else {
                return "as if you thought " + get_.ideologyNameFromId(this.itt.secondIdeologyId) + " was correct."
            }
        }
    },
    secondTypeOrYourself: function(){
        var user = Meteor.user();
        if(this.itt && user){
            if(_.contains(user.ideologies, this.itt.firstIdeologyId)){
                return "as how you interpret " + get_.ideologyNameFromId(this.itt.firstIdeologyId) + "."
            } else {
                return "as if you thought " + get_.ideologyNameFromId(this.itt.firstIdeologyId) + " was correct."
            }
        }
    }
})
;

Template.ittAnswerPage.events({
    'submit #itt-answer-form': function(event){
        event.preventDefault();
        if(this.itt){
            var answersToFirstQuestions = [],
                answersToSecondQuestions = [];

            for(x = 0; x < this.itt.firstQuestions.length; x++){
                answersToFirstQuestions.push({
                    ittQuestionId: this.itt.firstQuestions[x].question,
                    answer: event.currentTarget[x].value
                });
            }

            if(this.itt.secondQuestions){
                for(x = this.itt.firstQuestions.length; x < this.itt.firstQuestions.length + this.itt.secondQuestions.length; x++){
                    answersToSecondQuestions.push({
                        ittQuestionId: this.itt.secondQuestions[x - this.itt.firstQuestions.length].question,
                        answer: event.currentTarget[x].value
                    });
                }
            }
            Meteor.call('submitAnswerToITT', answersToFirstQuestions, answersToSecondQuestions, this.itt._id, function(err, ittId){
                if(err) throwError(err.reason);
                else Router.go('ittPage', {_id: ittId});
            });
        }
    }
});