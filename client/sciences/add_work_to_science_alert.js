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
    producers;

Template.addWorkToScienceAlert.events({
    'keydown .title': function(event){
        works = this.works;
        producers = this.producers;
        $(".title").autocomplete({
            source: this.titles
        });
    },
    'click .ui-menu-item': function(event){
        console.log("hi");
        console.log(event);
    },
    'click .ui-state-focus': function(event){
        console.log("ho");
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
            $('.producer').val("Wikpedians");
        }
    },
    'change .work-familiarity': function(event){
        var enlighteningScore = $('.enlightening-score'),
            readabilityScore = $('.readability-score');

        if(event.currentTarget.value === '' + this.familiarities[this.familiarities.length - 1].number + ''){
            enlighteningScore.val("");
            readabilityScore.val("");
            enlighteningScore.prop('disabled', true);
            readabilityScore.prop('disabled', true);
        } else {
            enlighteningScore.prop('disabled', false);
            readabilityScore.prop('disabled', false);
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

        if(familiarity !== 0){
            attr.scores = {
                enlighteningScore: parseInt($('.enlightening-score').val()),
                readabilityScore: parseInt($('.readability-score').val())
            }
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


        throwIfVariablesInArrayNotNumbersOrNotBetween1and100(attr.scores);

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
    });

    $('body').on('click', function(e){
        if(e.target.id === "scienceDialogoverlay"){
            SciencyAlert.close();
        }

        if(e.originalEvent.explicitOriginalTarget.className === "ui-menu-item" ||
            $(e.originalEvent.target).attr('class') === "ui-menu-item"){

            console.log($(e.originalEvent.target)[0].innerHTML);
            console.log(e.originalEvent.explicitOriginalTarget.innerHTML);

            var work = _.where(works, {title: $(e.originalEvent.target)[0].innerHTML}),
                producers = _.filter(producers, function(producer){_.contains(work.producers, producer._id)});

            console.log(work);
            console.log(producers);
//            var work = Works.findOne({title: e.originalEvent.explicitOriginalTarget.innerHTML}),
//                producers = Producers.find({_id: {$in: work.producers}}).fetch();

//            console.log(work);
//            console.log(producers);

            for(var x=0; x<producers.length; x++){
                var producer = $('.producer');
                if(x === producers.length-1){
                    $('.producer').val(producer.val() + producers[x].name);
                } else {
                    $('.producer').val(producer.val() + producers[x].name + ", ");
                }
            }


//            console.log(e.originalEvent.explicitOriginalTarget.innerHTML);
//            console.log(Template.instance());
//            console.log(this.works);
//            console.log(Template.parentData(1));
//            console.log(Template.parentData(2));
//            console.log(_.where(this.works, {title: e.originalEvent.explicitOriginalTarget.innerHTML}));
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

