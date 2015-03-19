var entireOwl, commandOwl, positionReached = 0,

    changedIdeologyPolicyReviewed, changedIdeologyPolicyListSelector, changedCriticalPositiveForAgainst,
    changedConvincingScore, changedReadabilityScore;


Template.worksPage.rendered = function() {
    entireOwl = $('.owl');

    entireOwl.owlCarousel({
        items : 1,
        singleItem : true,
        mouseDrag : false,
        touchDrag : false,
        transitions: "fade",
        autoHeight: true,

        pagination : false
    });


    $(".owl-dots").remove();
    commandOwl = entireOwl.data('owlCarousel');
};

Template.worksPage.helpers({
    'markedProducers': function(){
        if(this.producers) {
            var markedProducers = [];
            _.each(this.producers, function (producerId) {
                markedProducers.push({producerId: producerId, last: producerId == _.last(this)});
            }, this.producers);
            return markedProducers;
        }
    },
    'producer': function(){
        return Producers.findOne(this.producerId);
    },
    ideologies: function() {
        return Ideologies.find({}, {fields: {name: 1}});
    },
    policies: function() {
        return Policies.find({}, {fields: {solution: 1}});
    },
    ratings: function(){
        return Ratings.find({worksId: this._id, userId: Meteor.userId()}).fetch();
    },
    ideology: function(){
        return Ideologies.findOne({_id: this.ideologyId});
    },
    policy: function(){
        return Policies.findOne({_id: this.policyId});
    },
    previousRating: function(){
        var ideologyId = getIdeologyIdFromNameOrThrow($('.works-page .ideology-selector').val());
        var rating = Ratings.findOne({
            userId: Meteor.userId(),
            worksId: this._id,
            ideologyId: ideologyId,
            ratingType: o_.lowerFirstLetter($('.works-page .positive-or-critical').val())
        });

        return rating;
    },
    showOldReviews: function(){
        return Session.get('showOldReviews');
    },
    familiarityInSentence: function(){
        if(this.familiarity === 1) return "Briefly familiar";
        else if (this.familiarity === 4) return "Read/watched it once";
        else if (this.familiarity === 5) return "Read/watched it a few times";
        else if (this.familiarity === 7) return "Know it by heart";
    }
});

Template.worksPage.events({

    'click .show-review' : function() {
        var review = $('#' + this._id),
            reviewButton = $('#click-' + this._id);

        if ($(review).is(":visible")){
            review.hide();
            reviewButton.css('color', 'blue');}
        else{
            review.show();
            reviewButton.css('color', 'black');}
    },


    'click .review': function(){
        $('.review').hide();
        commandOwl.jumpTo(1);
        $('.cancel').show();
        $('.next').show();
        makeElementsAtWorksPageCorrectlyTabbable(1);
    },
    'click .cancel': function(){
        $('.cancel').hide();
        commandOwl.jumpTo(0);
        $('.review').show();
        $('.next').hide();
        $('.previous').hide();
        $('.finish').hide();
        makeElementsAtWorksPageCorrectlyTabbable(0);
    },
    'click .next': function(){
        $('.previous').show();
        $('.next').hide();
        $('.finish').show();
        commandOwl.jumpTo(2);
        makeElementsAtWorksPageCorrectlyTabbable(2);
    },
    'click .previous': function(){
        $('.previous').hide();
        $('.next').show();
        $('.finish').hide();
        commandOwl.jumpTo(1);
        makeElementsAtWorksPageCorrectlyTabbable(1);
    },
    'click .ideology-reviewed': function(){
        $('.space').hide();
        $('.ideology-type').show();
        $('.ideology-selector').show();
        $('.policy-type').hide();
        $('.policy-selector').hide();
    },
    'click .policy-reviewed': function(){
        $('.space').hide();
        $('.policy-type').show();
        $('.policy-selector').show();
        $('.ideology-type').hide();
        $('.ideology-selector').hide();
    },
    'change .ideology-reviewed, change .policy-reviewed': function(){
        changedIdeologyPolicyReviewed = true;
        ifTheFirstSectionIsFilledInEnableNext();
    },
    'change .ideology-list-selector, change .policy-list-selector': function(){
        changedIdeologyPolicyListSelector = true;
        ifTheFirstSectionIsFilledInEnableNext();
    },
    'change .positive, change .critical, change .for, change .against': function(){
        changedCriticalPositiveForAgainst = true;
        ifTheFirstSectionIsFilledInEnableNext();
    },
    'keypress .convincing-score, paste .convincing-score, change .convincing-score': function(){
        changedConvincingScore = true;
        ifTheFourthSectionsAreFilledInEnableNext();
    },
    'keypress .readability-score, paste .readability-score, change .readability-score': function(){
        changedReadabilityScore = true;
        ifTheFourthSectionsAreFilledInEnableNext();
    },
    'change .work-familiarity': function(){
        ifTheFourthSectionsAreFilledInEnableNext();
    },
    'click .finish': function(){
        var attr = {
            worksId: this._id,
            ratingType: o_.lowerFirstLetter($('.positive-or-critical').val()),
            scores: {
                convincingScore: parseInt($('.convincing-score').val()),
                readabilityScore: parseInt($('.readability-score').val())
            },
            familiarity: parseInt($('.work-familiarity').val())
        };

        var urlReview = $('.url-review').val();
        if(urlReview !== "") attr.urlReview = urlReview;

        var policyListSelector = $('.policy-list-selector'),
            ideologyListSelector = $('.ideology-list-selector');

        if(policyListSelector.is(":visible")){
            if($('.for').prop('checked')){
                attr.ratingType = "for";
            } else if ($('.against').prop('checked')) {
                attr.ratingType = "against";
            }
            attr.policyId = policyListSelector.val();
        }
        else if(ideologyListSelector.is(":visible")){
            if($('.positive').prop('checked')){
                attr.ratingType = "positive";
            } else if ($('.critical').prop('checked')) {
                attr.ratingType = "critical";
            }
            attr.ideologyId = ideologyListSelector.val();
        }

        throwIfVariablesInArrayNotNumbersOrNotBetween1and100(attr.scores);
        checkItContainsEverything(_.omit(attr, "introduction"));

        Meteor.call('addNewRatingOrChangeOld', attr, function(err){
            if(err) throwError(err.reason);
            else location.reload();
        });
    },

    'change #add-rating-checkbox': function (event) {
        var checkBox = ($('#add-rating-checkbox').prop('checked'));
        if (checkBox) {
            $('#add-rating-control').show();
        } else {
            $('#add-rating-control').hide();
        }
    },
    'change .works-page .positive-or-critical': function(){
        var ratingType = $('.works-page .positive-or-critical').val(),
            ideology = $('.works-page .ideology-selector').val();
        if(Session.get('showOldReviews')) Session.set('showOldReviews', null);

        if(ratingType && ideology){
            var rating = Ratings.findOne({
                userId: Meteor.userId(),
                worksId: this._id,
                ideologyId:  getIdeologyIdFromNameOrThrow(ideology),
                ratingType: o_.lowerFirstLetter(ratingType)
            });

            if(rating) Session.set("showOldReviews", rating.toString());
        }
        setSelectorsAtWorksPageBackToHowTheUserPutThem(ratingType, ideology);
    },
    'change .works-page .ideology-selector': function(){
        var ratingType = $('.works-page .positive-or-critical').val(),
            ideology = $('.works-page .ideology-selector').val();
        if(Session.get('showOldReviews')) Session.set('showOldReviews', null);

        if(ratingType && ideology){
            var rating = Ratings.findOne({
                userId: Meteor.userId(),
                worksId: this._id,
                ideologyId:  getIdeologyIdFromNameOrThrow(ideology),
                ratingType: o_.lowerFirstLetter(ratingType)
            });

            if(rating) Session.set("showOldReviews", rating.toString());
        }
        setSelectorsAtWorksPageBackToHowTheUserPutThem(ratingType, ideology);
    }
});

setSelectorsAtWorksPageBackToHowTheUserPutThem = function(ratingType, ideology){
    setTimeout(function () {
        $('.works-page .positive-or-critical').val(ratingType);
        $('.works-page .ideology-selector').val(ideology);
    }, 50);
};

throwIfNotNumberOrNotBetween1and100 = function(rating){
   if(isNaN(rating)) throwError("The rating needs to be a number");
   else if(rating < 1 || rating > 100) throwError("The rating needs to be a number between 1 and 100");
};

uncheckEverythingFromWorks = function(){
    $('.works-page .score').val("");
    $('.works-page .positive-or-critical').val("");
    $('.works-page .ideology-selector').val("");
    $('.works-page .work-familiarity').val("");
    $('.works-page .introduction').prop('checked', false);
    $('.works-page .add-rating-checkbox').prop('checked', false);
    $('#add-rating-control').hide();
};


ifTheFirstSectionIsFilledInEnableNext = function(){
    if(changedIdeologyPolicyReviewed && changedIdeologyPolicyListSelector && changedCriticalPositiveForAgainst){
        $('.next').prop('disabled', false);
    }
};

ifTheFourthSectionsAreFilledInEnableNext = function(){
    if(changedConvincingScore && changedReadabilityScore && $('.work-familiarity').val() !== ""){
        $('.finish').prop('disabled', false);
    }
};

makeElementsAtWorksPageCorrectlyTabbable = function(currentItem){
    switch(currentItem) {
        case 0:
            makeThirdSectionElementsTabbableOrNot(-1);
            makeFourthSectionElementsTabbableOrNot(-1);
            break;
        case 1:
            makeThirdSectionElementsTabbableOrNot(0);
            makeFourthSectionElementsTabbableOrNot(-1);
            break;
        case 2:
            makeThirdSectionElementsTabbableOrNot(-1);
            makeFourthSectionElementsTabbableOrNot(0);
            break;
    }
};