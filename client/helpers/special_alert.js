function SpecialAlert(){
    this.render = function(dialog, isArea){
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var dialogoverlay = document.getElementById('dialogoverlay');
        var dialogbox = document.getElementById('dialogbox');

        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = windowHeight + "px";

        dialogbox.style.left = (windowWidth / 2) - (550 * 0.5) + "px";
        dialogbox.style.top = "30px";
        dialogbox.style.display = "block";
        document.getElementById('dialogboxhead').innerHTML = "Review work for " + dialog;
    }
    this.close = function(){
        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";

    }
};
Alert = new SpecialAlert();

var works,
    producers,
    currentSelectedWork;

function split(val){
    return val.split(/,\s*/);
}

function extractLast(term){
    return split(term).pop();
}

Template.specialAlert.events({
    'click .start-custom-alert': function(){
        Alert.render("no truth");
    },
    'keydown .title': function(event){
        works = this.works;
        producers = this.producers;
        $(".title").autocomplete({
            source: this.titles
        });
    },
    'keydown .producer': function(event){
        if(this.producerNames && this.producerNames.length > 0){
            availableTags = this.producerNames;

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
    'change .type-of-work': function(event){
        if(event.currentTarget.value === "Wikipedia article"){
            $('.producer').val("Wikipedians");
        }
    },
    'change .work-familiarity': function(event){
        var convincingScore = $('.convincing-score'),
            readabilityScore = $('.readability-score'),
            positive = $('.positive'),
            critical = $('.critical'),
            review = $('.review');

        if(event.currentTarget.value === '' + this.familiarities[this.familiarities.length - 1].number + ''){
            convincingScore.val("");
            readabilityScore.val("");
            review.val("");
            positive.prop('checked', false);
            critical.prop('checked', false);
            convincingScore.prop('disabled', true);
            readabilityScore.prop('disabled', true);
            review.prop('disabled', true);
            positive.prop('disabled', true);
            critical.prop('disabled', true);
        } else {
            convincingScore.prop('disabled', false);
            readabilityScore.prop('disabled', false);
            review.prop('disabled', false);
            positive.prop('disabled', false);
            critical.prop('disabled', false);
        }
    },
    'click .add-work-to-ideology': function(event){
        var attr = {
            title: $('.title').val(),
            url: $('.url').val(),
            discussionUrl: $('.discussion-url').val(),
            familiarity: parseInt($('.work-familiarity').val()),
            type: $('.type-of-work').val(),
            producers: []
        };

        if(attr.familiarity !== 0){
            attr.scores = {
                convincingScore: parseInt($('.convincing-score').val()),
                readabilityScore: parseInt($('.readability-score').val())
            }
            throwIfVariablesInArrayNotNumbersOrNotBetween1and100(attr.scores);
        }

        if(this.name){
            attr.ideologyId = this._id;
            if($('.positive').prop('checked')){
                attr.ratingType = "positive";
            } else if($('.critical').prop('checked')){
                attr.ratingType = "critical";
            }
        } else {
            attr.policyId = this._id;
            if($('.positive').prop('checked')){
                attr.ratingType = "for";
            } else if($('.critical').prop('checked')){
                attr.ratingType = "against";
            }
        }

        var urlReview = $('.review').val();
        if(urlReview !== "") attr.urlReview = urlReview;

        var producers = $('.producer').val();
        if(producers.indexOf(',')){
            producers = producers.split(',');
            _.each(producers, function(producer){
                attr.producers.push(producer.trim());
            });
        } else {
            attr.producers.push(producers.trim());
        }


        if(attr === undefined) throwError("Error code: 601");
        if(attr.title === undefined) throwError("Error code: 602");
        if(attr.url === undefined) throwError("Error code: 603");
        if(attr.discussionUrl === undefined) throwError("Error code: 604");
        if(attr.familiarity === undefined) throwError("Error code: 607");
        if(attr.familiarity !== 0){
            if(attr.scores.readabilityScore === undefined) throwError("Error code: 605");
            if(attr.scores.convincingScore === undefined) throwError("Error code: 606");
            if(attr.ratingType === undefined) throwError("Error code: 611");
        }
        if(attr.type === undefined) throwError("Error code: 608");
        if(attr.producers === undefined) throwError("Error code: 609");
        if(attr.ideologyId === undefined && attr.policyId === undefined) throwError("Error code: 610");

        Meteor.call('createWork', _.omit(attr, 'scores'), function(error, worksId){
            if(error) throwError(error.reason);
            attr.worksId = worksId;

            Meteor.call('addNewRatingOrChangeOld', attr, function(error){
                if(error) throwError(error.reason);


                $('.title').val("");
                $('.url').val("");
                $('.discussion-url').val("");
                $('.convincing-score').val("");
                $('.readability-score').val("");
                $('.work-familiarity').val("");
                $('.type-of-work').val("");
                $('.producer').val("");
                $('.review').val("");
                $('.positive').prop('checked', false);
                $('.critical').prop('checked', false);

                $('.producer').prop('disabled', false);
                $('.url').prop('disabled', false);
                $('.discussion-url').prop('disabled', false);
                $('.type-of-work').prop('disabled', false);
                $('.convincing-score').prop('disabled', false);
                $('.readability-score').prop('disabled', false);
                $('.review').prop('disabled', false);
                $('.positive').prop('disabled', false);
                $('.critical').prop('disabled', false);

                Alert.close();
            });
        });
    },
    'click .close-custom-alert': function(){
        Alert.close();
    }
});

Template.specialAlert.rendered = function(){
    $('body').on('keydown', function(e){
        if(e.which === 27){
            Alert.close();
        }
    });

    $('body').on('click', function(e){
        if(e.target.id === "dialogoverlay"){
            Alert.close();
        }

        if($(e.originalEvent.target).attr('class') === "ui-menu-item"){
            var work = _.findWhere(works, {title: $(e.originalEvent.target)[0].innerHTML}),
                producersOfWork = _.filter(producers, function(producer){return _.contains(work.producers, producer._id)});
            currentSelectedWork = work.title;

            var producerField = $('.producer'),
                urlField = $('.url'),
                urlDiscussionField = $('.discussion-url');

            producerField.val("");
            urlField.val("");
            urlDiscussionField.val("");

            for(var x=0; x<producersOfWork.length; x++){
                var producer = $('.producer');
                if(x === producersOfWork.length-1){
                    $('.producer').val(producer.val() + producersOfWork[x].name);
                } else {
                    $('.producer').val(producer.val() + producersOfWork[x].name + ", ");
                }
            }

            urlField.val(work.url);
            urlDiscussionField.val(work.discussionUrl);

            $(".type-of-work option").filter(function() {
                return $(this).text() == work.type;
            }).prop('selected', true);

            producerField.prop('disabled', true);
            urlField.prop('disabled', true);
            urlDiscussionField.prop('disabled', true);
            $('.type-of-work').prop('disabled', true);
        }
    });

    $('.title').bind('input', function() {
        if(currentSelectedWork && currentSelectedWork !== $('.title').val()){
            var producerField = $('.producer'),
                urlField = $('.url'),
                urlDiscussionField = $('.discussion-url');

            producerField.val("");
            urlField.val("");
            urlDiscussionField.val("");
            $(".type-of-work option").filter(function() {
                return $(this).text() == "";
            }).prop('selected', true);

            producerField.prop('disabled', false);
            urlField.prop('disabled', false);
            urlDiscussionField.prop('disabled', false);
            $('.type-of-work').prop('disabled', false);

            currentSelectedWork = null;
        }
    });
};

Template.specialAlert.helpers({
    familiarity: function(){
        return familiarity;
    }
});

