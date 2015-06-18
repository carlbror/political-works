Template.ittPage.helpers({
    firstIdeology: function(){
        console.log(this);
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