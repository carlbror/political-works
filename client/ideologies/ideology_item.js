Template.ideologyItem.helpers({
    bestWork: function(){
        if(this._id && this.proponents){
            var ratings = Ratings.find({ideologyId: this._id, ratingType: "positive", userId: {$in: this.proponents}},
                {fields: {worksId:1, scores: 1}}).fetch();

            var valuableWorks = certainSortedRatings(ratings, "convincingScore");


            this.proponentsPositiveWorks = valuableWorks;

            if(this && this.proponentsPositiveWorks && this.proponentsPositiveWorks.length<1 || !this.proponentsPositiveWorks) return "";

            var work = Works.findOne(this.proponentsPositiveWorks[0].worksId);

            var producerNames = get_.producerNamesFromIds(work.producers);

            return work.title + ", " + producerNames;
        }
    }
});