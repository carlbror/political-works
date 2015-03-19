Template.ideologyPage.helpers({
    sortedProponentsPositiveWorks: function () {
        if (this.proponentsPositiveWorks) {
            this.proponentsPositiveWorks.sort(function (a, b) {
                return b.totalRating - a.totalRating;
            });
            return this.proponentsPositiveWorks;
        }
        else return null;
    },
    sortedOthersPositiveWorks: function () {
        if (this.othersPositiveWorks) {
            this.othersPositiveWorks.sort(function (a, b) {
                return b.totalRating - a.totalRating;
            });
            return this.othersPositiveWorks;
        }
        else return null;
    },
    sortedOthersCriticalWorks: function(){
        if (this.othersCriticalWorks) {
            this.othersCriticalWorks.sort(function (a, b) {
                return b.totalRating - a.totalRating;
            });
            return this.othersCriticalWorks;
        }
        else return null;
    },
    sortedProponentsCriticalWorks: function(){
        if (this.proponentsCriticalWorks) {
            this.proponentsCriticalWorks.sort(function (a, b) {
                return b.totalRating - a.totalRating;
            });
            return this.proponentsCriticalWorks;
        }
        else return null;
    },
    criticalLiterature: function () {
        if (this.criticalWorks) {
            this.criticalWorks.sort(function (a, b) {
                return b.users.length - a.users.length;
            });
            return this.criticalWorks;
        } else return null;
    },
    noOfSupporters: function () {
        if (this.worksId) {
            var work = Works.findOne(this.worksId);
            if (work && this.users && this.users.length > 0) return "-" + this.users.length;
            else if (work && this.users && this.users.length === 0)
                return "-";
        }
    }
});

Template.listItemForIdeologyPage.helpers({
    work: function(){
        return Works.findOne(this.worksId);
    },
    totalRatingSubString: function(){
        var totalRatingString = this.totalRating.toString();
        return totalRatingString.substring(0,2);
    }
});