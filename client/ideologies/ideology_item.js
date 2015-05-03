Template.ideologyItem.helpers({
    bestWork: function(){
        if(this._id && this.proponents){
            var ratings = Ratings.find({ideologyId: this._id, ratingType: "positive", userId: {$in: this.proponents}},
                {fields: {worksId:1, scores: 1, url: 1}}).fetch();

            var valuableWorks = certainSortedRatings(ratings, "convincingScore");

            if(this && valuableWorks && valuableWorks.length<1 || !valuableWorks) return "";

            var work = Works.findOne(valuableWorks[0].worksId);

            work.producerNames = get_.producerNamesFromIds(work.producers);

            return work;
        }
    }
});