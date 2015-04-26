function SpecialAlert(){
    this.render = function(dialog){
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

Template.specialAlert.events({
    'click .start-custom-alert': function(){
        Alert.render("no truth");
    },
    'keydown .title': function(event){
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
    'click .add-work-to-ideology': function(event){
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
            ideologyId: this._id,
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

        if($('.positive').prop('checked')){
            attr.ratingType = "positive";
        } else if($('.critical').prop('checked')){
            attr.ratingType = "critical";
        }

        var urlReview = $('.review').val();
        if(urlReview !== "") attr.urlReview = urlReview;


        throwIfVariablesInArrayNotNumbersOrNotBetween1and100(attr.scores);
        checkItContainsEverything(_.omit(attr, 'review'));

        Meteor.call('createWork', _.omit(attr, 'scores'), function(error, worksId){
            if(error) throwError(error.reason);
            attr.worksId = worksId;

            Meteor.call('addNewRatingOrChangeOld', attr, function(error){
                if(error) throwError(error.reason);
                location.reload();
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
    });
};

Template.specialAlert.helpers({
    familiarity: function(){
        return familiarity;
    }
});

function split(val){
    return val.split(/,\s*/);
}

function extractLast(term){
    return split(term).pop();
}