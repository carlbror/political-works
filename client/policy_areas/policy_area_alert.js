function PolicyAreaAlert(){
    this.render = function(dialog){
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var dialogoverlay = document.getElementById('areaDialogoverlay');
        var dialogbox = document.getElementById('areaDialogbox');

        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = windowHeight + "px";

        dialogbox.style.left = (windowWidth / 2) - (550 * 0.5) + "px";
        dialogbox.style.top = "30px";
        dialogbox.style.display = "block";
        document.getElementById('areaDialogboxhead').innerHTML = "Add an enlightening work on " + dialog;
    }
    this.close = function(){
        document.getElementById('areaDialogbox').style.display = "none";
        document.getElementById('areaDialogoverlay').style.display = "none";

    }
};
AreaAlert = new PolicyAreaAlert();

function split(val){
    return val.split(/,\s*/);
}

function extractLast(term){
    return split(term).pop();
}




Template.policyAreaAlert.events({
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
    'click .add-work-to-area': function(event){
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

        console.log(this);

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
        if(attr.scores.readabilityScore === undefined) throwError("Error code: 605");
        if(attr.scores.convincingScore === undefined) throwError("Error code: 606");
        if(attr.familiarity === undefined) throwError("Error code: 607");
        if(attr.type === undefined) throwError("Error code: 608");
        if(attr.producers === undefined) throwError("Error code: 609");
        if(attr.ideologyId === undefined && attr.policyId === undefined) throwError("Error code: 610");
        if(attr.ratingType === undefined) throwError("Error code: 611");



        Meteor.call('createWork', _.omit(attr, 'scores'), function(error, worksId){
            if(error) throwError(error.reason);
            attr.worksId = worksId;

            if(attr.ideologyId){
                Meteor.call('addNewRatingOrChangeOld', attr, function(error){
                    if(error) throwError(error.reason);
                    location.reload();
                });
            } else {
                Meteor.call('addNewPolicyRatingOrChangeOld', attr, function(error){
                    if(error) throwError(error.reason);
                    location.reload();
                });
            }
        });
    },
    'click .close-custom-alert': function(){
        Alert.close();
    }
});

Template.policyAreaAlert.rendered = function(){
    $('body').on('keydown', function(e){
        if(e.which === 27){
            AreaAlert.close();
        }
    });

    $('body').on('click', function(e){
        if(e.target.id === "areaDialogoverlay"){
            AreaAlert.close();
        }
    });
};

Template.policyAreaAlert.helpers({
    familiarity: function(){
        return familiarity;
    }
});
