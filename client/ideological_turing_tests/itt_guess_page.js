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