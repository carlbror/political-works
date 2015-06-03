Template.policyPage.helpers({
    work: function(){
        return Works.findOne(this.worksId);
    },
    totalRatingSubString: function(){
        var totalRatingString = this.totalRating.toString();
        return totalRatingString.substring(0,2);
    },
    truePlaceName: function(){
        if(this){
            return get_.truePlace(this);
        }
    },
    place: function(){
        return Places.findOne(this.placeId);
    }
});

Template.policyPage.events({
    'click .addWork': function(){
        Alert.render(this.solution);
    }
});