function ScienceAlert(){
    this.render = function(dialog){
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var dialogoverlay = document.getElementById('scienceDialogoverlay');
        var dialogbox = document.getElementById('scienceDialogbox');

        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = windowHeight + "px";

        dialogbox.style.left = (windowWidth / 2) - (550 * 0.5) + "px";
        dialogbox.style.top = "30px";
        dialogbox.style.display = "block";
        document.getElementById('scienceDialogboxhead').innerHTML = "Add an enlightening work on " + dialog;
    }
    this.close = function(){
        document.getElementById('scienceDialogbox').style.display = "none";
        document.getElementById('scienceDialogoverlay').style.display = "none";

    }
};
SciencyAlert = new ScienceAlert();

function split(val){
    return val.split(/,\s*/);
}

function extractLast(term){
    return split(term).pop();
}

var works,
    producers,
    currentSelectedWork;

Template.addWorkToScienceAlert.events({
    'keydown .title': function(event){
        works = this.works;
        producers = this.producers;
        $(".title").autocomplete({
            source: this.titles
        });
    },
    'keydown .producer': function(event){
        if(this.producers && this.producers.length > 0){
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
    'change .type-of-work': function(event){
        if(event.currentTarget.value === "Wikipedia article"){
            $('.producer').val("Wikipedians");
        }
    },
    'change .work-familiarity': function(event){
        var enlighteningScore = $('.enlightening-score'),
            readabilityScore = $('.readability-score'),
            review = $('.review');

        if(event.currentTarget.value === '' + this.familiarities[this.familiarities.length - 1].number + ''){
            enlighteningScore.val("");
            readabilityScore.val("");
            review.val("");
            enlighteningScore.prop('disabled', true);
            readabilityScore.prop('disabled', true);
            review.prop('disabled', true);
        } else {
            enlighteningScore.prop('disabled', false);
            readabilityScore.prop('disabled', false);
            review.prop('disabled', false);
        }
    },
    'click .add-work-to-science': function(event){
        var attr = {
            title: $('.title').val(),
            url: $('.url').val(),
            discussionUrl: $('.discussion-url').val(),
            familiarity: parseInt($('.work-familiarity').val()),
            type: $('.type-of-work').val(),
            producers: [],
            scienceId: this._id
        };

        if(attr.familiarity !== 0){
            attr.scores = {
                enlighteningScore: parseInt($('.enlightening-score').val()),
                readabilityScore: parseInt($('.readability-score').val())
            }
            throwIfVariablesInArrayNotNumbersOrNotBetween1and100(attr.scores);
        }

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


        if(attr === undefined) throwError("Error code: 601");
        if(attr.title === undefined) throwError("Error code: 602");
        if(attr.url === undefined) throwError("Error code: 603");
        if(attr.discussionUrl === undefined) throwError("Error code: 604");
        if(attr.familiarity === undefined) throwError("Error code: 607");
        if(attr.familiarity !== 0){
            if(attr.scores.readabilityScore === undefined) throwError("Error code: 605");
            if(attr.scores.enlighteningScore === undefined) throwError("Error code: 606");
        }
        if(attr.type === undefined) throwError("Error code: 608");
        if(attr.producers === undefined) throwError("Error code: 609");
        if(attr.scienceId === undefined) throwError("Error code: 610");
        if(attr.ratingType !== undefined) throwError("Error code: 611");

        Meteor.call('createWork', _.omit(attr, 'scores'), function(error, worksId){
            if(error) throwError(error.reason);
            attr.worksId = worksId;

            Meteor.call('addNewRatingOrChangeOld', attr, function(error){
                if(error) throwError(error.reason);

                $('.title').val("");
                $('.url').val("");
                $('.discussion-url').val("");
                $('.enlightening-score').val("");
                $('.readability-score').val("");
                $('.work-familiarity').val("");
                $('.type-of-work').val("");
                $('.producer').val("");
                $('.review').val("");


                $('.producer').prop('disabled', false);
                $('.url').prop('disabled', false);
                $('.discussion-url').prop('disabled', false);
                $('.type-of-work').prop('disabled', false);
                $('.enlightening-score').prop('disabled', false);
                $('.readability-score').prop('disabled', false);
                $('.review').prop('disabled', false);

                SciencyAlert.close();
            });
        });
    },
    'click .close-custom-alert': function(){
        SciencyAlert.close();
    }
});

Template.addWorkToScienceAlert.rendered = function(){
    $('body').on('keydown', function(e){
        if(e.which === 27){
            SciencyAlert.close();
        }
    }).on('click', function(e){
        if(e.target.id === "scienceDialogoverlay"){
            SciencyAlert.close();
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

Template.addWorkToScienceAlert.helpers({
    familiarity: function(){
        return familiarity;
    },
    typeOfWork: function(){
        return typeOfWork;
    }
});
