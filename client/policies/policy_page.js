Template.policyPage.helpers({
    work: function(){
        return Works.findOne(this.worksId);
    },
    totalRatingSubString: function(){
        var totalRatingString = this.totalRating.toString();
        return totalRatingString.substring(0,2);
    },
    truePlaceName: function(){
        if(this) {
            if (this.country && !this.area) {
                return this.country;
            } else if (this.country && this.area) {
                return this.area + ", " + this.country;
            } else if (this.area && !this.country) {
                return this.area;
            }
        }
    },
    place: function(){
        return Places.findOne(this.placeId);
    }
});