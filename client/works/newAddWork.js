var entireOwl,
    commandOwl,
    availableTags = [];

Template.newAddWork.rendered = function(){
    entireOwl = $('.owl');

    entireOwl.owlCarousel({
        items: 1,
        singleItem: true,
        mouseDrag: false,
        touchDrag: false,
        transitions: "fade",
        autoHeight: true,

        pagination: false
    });

    $(".owl-dots").remove();
    commandOwl = entireOwl.data('owlCarousel');
};

Template.newAddWork.helpers({
    clickedNextOnce: function(){
        return Session.get('clickedNextOnce');
    },
    showingSelectorsForIdeology: function(){
        return Session.get('showingSelectorsForIdeology');
    }
});

var changedProducers,
    changedUrl,
    changedDiscussionUrl,
    changedTypeOfWork,
    positionReached = 0;

var changedIdeologyPolicyReviewed,
    changedIdeologyPolicyListSelector,
    changedCriticalPositiveForAgainst;

var changedConvincingScore,
    changedReadabilityScore;

function split(val){
    return val.split(/,\s*/);
}

function extractLast(term){
    return split(term).pop();
}

Template.newAddWork.events({
    'keydown .producer': function(event){
        if(this.producers.length > 0){
            availableTags = this.producers;

            if(event.keyCode === $.ui.keyCode.TAB &&
                $(this).autocomplete("instance").menu.active){
                event.preventDefault();
            }


            $('.producer').autocomplete({
                minLength: 0,
                source: function(request, response){
                    response($.ui.autocomplete.filter(
                        availableTags, extractLast(request.term)));
                },
                focus: function(){
                    return false;
                },
                select: function(event, ui){
                    var terms = split(this.value);
                    terms.pop();
                    terms.push(ui.item.value);
                    terms.push("");
                    this.value = terms.join(", ");
                    return false;
                }
            });
        }
    },
    'click .ideology-reviewed': function(){
        Session.set('showingSelectorsForIdeology', true);
        $('.ideology-type').show();
        $('.ideology-selector').show();
        $('.policy-type').hide();
        $('.policy-selector').hide();
    },
    'click .policy-reviewed': function(){
        Session.set('showingSelectorsForIdeology', true);
        $('.policy-type').show();
        $('.policy-selector').show();
        $('.ideology-type').hide();
        $('.ideology-selector').hide();
    },
    'click .next': function(){
        if(commandOwl.currentItem === 0 && $('.title').val() === "") throwError("You need to fill in a title");
        if(commandOwl.currentItem === 1){
            if($('.producer').val() === "" || $('.url').val() === "" ||
                $('.discussion-url').val() === "" || $('.type-of-work').val() === "") throwError('You need to fill in all fields');
            if(!$('.url').val().match(urlRegExp) || !$('.discussion-url').val().match(urlRegExp)){
                throwError('Url need to be of type ftp://..., http://..., or https://...');
            }
        }
        if(commandOwl.currentItem === 2){
            var policyListSelector = $('.policy-list-selector'),
                ideologyListSelector = $('.ideology-list-selector');

            if(policyListSelector.is(":visible")){
                if(policyListSelector.val() === "") throwError('You need to choose a policy');
            }
            if(ideologyListSelector.is(":visible")){
                if(ideologyListSelector.val() === "") throwError("You need to choose an ideology");
            }
        }
        commandOwl.jumpTo(commandOwl.currentItem + 1);
        commandOwl = entireOwl.data('owlCarousel');
        if(positionReached <= commandOwl.currentItem){
            var next = $('.next');
            next.prop('disabled', true);
            $('.alert-error').remove();
            if(positionReached === 3){
                next.hide();
                $('.finish').show();
            }
        }
        Session.set('clickedNextOnce', true);
        makeElementsCorrectlyTabbable(commandOwl.currentItem);
    },
    'click .previous': function(){
        var next = $('.next');
        if(commandOwl.currentItem === 3){
            next.show();
            $('.finish').hide();
        }
        commandOwl.jumpTo(commandOwl.currentItem - 1);

        commandOwl = entireOwl.data('owlCarousel');
        next.prop('disabled', false);
        if(commandOwl.currentItem <= 0){
            Session.set('clickedNextOnce', false);
        }
        makeElementsCorrectlyTabbable(commandOwl.currentItem);
    },
    'click .finish': function(){
        var attr = getValuesFromNewAddWork();
        throwIfVariablesInArrayNotNumbersOrNotBetween1and100(attr.scores);
        checkItContainsEverything(_.omit(attr, 'review'));
        if(attr.urlReview && !attr.urlReview.match(urlRegExp)){
            throwError("The Url for the review need to be of type ftp://..., http://..., or https://...")
        }


        Meteor.call('createWork', _.omit(attr, 'scores'), function(error, worksId){
            if(error) throwError(error.reason);
            attr.worksId = worksId;

            Meteor.call('addNewRatingOrChangeOld', attr, function(error){
                if(error) throwError(error.reason);
                location.reload();
            });
        });
    },
    'keypress .title, paste .title': function(){
        $('.next').prop('disabled', false);
    },
    'keypress .producer, paste .producer': function(){
        changedProducers = true;
        ifSecondSectionAreFilledInEnableNext();
    },
    'keypress .url, paste .url': function(event){
        setTimeout(function(){
            if(!!$('.url').val().match(urlRegExp)){
                changedUrl = true;
                ifSecondSectionAreFilledInEnableNext();
            }
        }, 100);
    },
    'keypress .discussion-url, paste .discussion-url': function(){
        setTimeout(function(){
            if(!!$('.discussion-url').val().match(urlRegExp)){
                changedDiscussionUrl = true;
                ifSecondSectionAreFilledInEnableNext();
            }
        }, 100);
    },
    'change .type-of-work': function(){
        changedTypeOfWork = true;
        ifSecondSectionAreFilledInEnableNext();
    },
    'change .ideology-reviewed, change .policy-reviewed': function(){
        changedIdeologyPolicyReviewed = true;
        ifThirdSectionAreFilledInEnableNext();
    },
    'change .ideology-list-selector, change .policy-list-selector': function(){
        changedIdeologyPolicyListSelector = true;
        ifThirdSectionAreFilledInEnableNext();
    },
    'change .positive, change .critical, change .for, change .against': function(){
        changedCriticalPositiveForAgainst = true;
        ifThirdSectionAreFilledInEnableNext();
    },
    'keypress .convincing-score, paste .convincing-score, change .convincing-score': function(){
        changedConvincingScore = true;
        ifFourthSectionFieldsAreFilledInEnableNext();
    },
    'keypress .readability-score, paste .readability-score, change .readability-score': function(){
        changedReadabilityScore = true;
        ifFourthSectionFieldsAreFilledInEnableNext();
    },
    'change .work-familiarity': function(){
        ifFourthSectionFieldsAreFilledInEnableNext();
    }
});

ifSecondSectionAreFilledInEnableNext = function(){
    if(changedProducers && changedUrl && changedDiscussionUrl && changedTypeOfWork){
        positionReached = 2;
        $('.next').prop('disabled', false);
    }
};

ifThirdSectionAreFilledInEnableNext = function(){
    if(changedIdeologyPolicyReviewed && changedIdeologyPolicyListSelector && changedCriticalPositiveForAgainst){
        $('.next').prop('disabled', false);
        positionReached = 3;
    }
};

ifFourthSectionFieldsAreFilledInEnableNext = function(){
    if(changedConvincingScore && changedReadabilityScore && $('.work-familiarity').val() !== ""){
        $('.finish').prop('disabled', false);
        positionReached = 4;
    }
};

makeElementsCorrectlyTabbable = function(currentItem){
    switch(currentItem){
        case 0:
            makeFirstSectionElementsTabbablreOrNot(0);
            makeSecondSectionElementsTabbableOrNot(-1);
            makeThirdSectionElementsTabbableOrNot(-1);
            makeFourthSectionElementsTabbableOrNot(-1);
            break;
        case 1:
            makeFirstSectionElementsTabbablreOrNot(-1);
            makeSecondSectionElementsTabbableOrNot(0);
            makeThirdSectionElementsTabbableOrNot(-1);
            makeFourthSectionElementsTabbableOrNot(-1);
            break;
        case 2:
            makeFirstSectionElementsTabbablreOrNot(-1);
            makeSecondSectionElementsTabbableOrNot(-1);
            makeThirdSectionElementsTabbableOrNot(0);
            makeFourthSectionElementsTabbableOrNot(-1);
            break;
        case 3:
            makeFirstSectionElementsTabbablreOrNot(-1);
            makeSecondSectionElementsTabbableOrNot(-1);
            makeThirdSectionElementsTabbableOrNot(-1);
            makeFourthSectionElementsTabbableOrNot(0);
            break;
    }
};

makeFirstSectionElementsTabbablreOrNot = function(zeroOrMinus){
    $('.title').prop('tabIndex', zeroOrMinus);
};

makeSecondSectionElementsTabbableOrNot = function(zeroOrMinus){
    $('.producer').prop('tabIndex', zeroOrMinus);
    $('.url').prop('tabIndex', zeroOrMinus);
    $('.discussion-url').prop('tabIndex', zeroOrMinus);
    $('.type-of-work').prop('tabIndex', zeroOrMinus);
};

makeThirdSectionElementsTabbableOrNot = function(zeroOrMinus){
    $('.ideology-reviewed').prop('tabIndex', zeroOrMinus);
    $('.policy-reviewed').prop('tabIndex', zeroOrMinus);
    $('.ideology-list-selector').prop('tabIndex', zeroOrMinus);
    $('.policy-list-selector').prop('tabIndex', zeroOrMinus);
    $('.positive').prop('tabIndex', zeroOrMinus);
    $('.critical').prop('tabIndex', zeroOrMinus);
    $('.for').prop('tabIndex', zeroOrMinus);
    $('.against').prop('tabIndex', zeroOrMinus);
};

makeFourthSectionElementsTabbableOrNot = function(zeroOrMinus){
    $('.convincing-score').prop('tabIndex', zeroOrMinus);
    $('.readability-score').prop('tabIndex', zeroOrMinus);
    $('.review').prop('tabIndex', zeroOrMinus);
    $('.work-familiarity').prop('tabIndex', zeroOrMinus);
};


getValuesFromNewAddWork = function(){
    var attr = {
        title: $('.title').val(),
        url: $('.url').val(),
        discussionUrl: $('.discussion-url').val(),
        scores: {
            convincingScore: parseInt($('.convincing-score').val()),
            readabilityScore: parseInt($('.readability-score').val())
        },
        familiarity: parseInt($('.work-familiarity').val()),
        type: $('.type-of-work').val(),
        producers: []
    };

    var producers = $('.producer').val();

    if(producers.indexOf(',')){
        producers = producers.split(',');
        _.each(producers, function(producer){
            attr.producers.push(producer.trim());
        });
    } else {
        attr.producers.push(producers.trim());
    }


    var urlReview = $('.review').val();
    if(urlReview !== "") attr.urlReview = urlReview;

    var policyListSelector = $('.policy-list-selector'),
        ideologyListSelector = $('.ideology-list-selector');

    if(policyListSelector.is(":visible")){
        if($('.for').prop('checked')){
            attr.ratingType = "for";
        } else if($('.against').prop('checked')){
            attr.ratingType = "against";
        }
        attr.policyId = policyListSelector.val();
    }
    else if(ideologyListSelector.is(":visible")){
        if($('.positive').prop('checked')){
            attr.ratingType = "positive";
        } else if($('.critical').prop('checked')){
            attr.ratingType = "critical";
        }
        attr.ideologyId = ideologyListSelector.val();
    }

    return attr;
};