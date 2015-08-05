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
                explanations = [];

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

            Meteor.call('')
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