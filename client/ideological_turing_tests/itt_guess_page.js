Template.ittGuessPage.helpers({
    firstIdeologyName: function(){
        return get_.ideologyNameFromId(this.firstIdeologyId);
    },
    secondIdeologyName: function(){
        return get_.ideologyNameFromId(this.secondIdeologyId);
    },
    firstIdeologues: function(){
        return return_.ideologuesFromIdeologyName(get_.ideologyNameFromId(Template.parentData().itt.firstIdeologyId)).toLowerCase();
    },
    secondIdeologues: function(){
        return return_.ideologuesFromIdeologyName(get_.ideologyNameFromId(Template.parentData().itt.secondIdeologyId)).toLowerCase();
    }
});

Template.ittGuessPage.events({
    'change .guess-ideology-selector': function(){
        console.log(1)
    },
    'submit #itt-submit-guess-form': function(event){
        event.preventDefault();
        if(this.itt){
            var guesses = [],
                explanations = [],
                guessesBelongingToFirstQuestions,
                guessesBelongingToSecondQuestions;

            for(x = 0; x < this.itt.firstQuestions.length; x++){
                var memory;
                for(y = 0; y < this.itt.firstQuestions[x].answers.length*2; y++){
                    if(event.currentTarget[y].type === "select-one" && event.currentTarget.value) {
                        
                    }

                }
                answersToFirstQuestions.push({
                    question: this.itt.firstQuestions[x].question,
                    answer: event.currentTarget[x].value
                });
                if(!event.currentTarget[x].value){throwError("You need to fill in every form.")}
            }

            _.each(event.currentTarget, function(target){
                if(target.type === "submit"){
                } else if(target.type === "select-one"){
                    if(!target.value) throwError("You need to guess the ideology for every answer.");
                    else {
                        guesses.push({answer: target.name, guess: target.value});
                    }
                } else if(target.type === "textarea" && target.value){
                    explanations.push({answer: target.name, explanation: target.value});
                }
            });

            Meteor.call('submitGuessesToITT', guesses, this.itt._id, function(err, ittId){
                if(err) throwError(err.reason);
                else Router.go('ittPage', {_id: ittId});
            })
        }
    }
});

//answers : {
//    userId: "klk",
//    answer: "k.k.ll"
//    guesses: [
//        {
//            userId: "sdf",
//            guess: "ideologyId"
//        }
//    ]
//}