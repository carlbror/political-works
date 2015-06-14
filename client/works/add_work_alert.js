function WorkAlert(){
    this.render = function(dialog){
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var dialogoverlay = document.getElementById('workDialogoverlay');
        var dialogbox = document.getElementById('workDialogbox');

        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = windowHeight + "px";

        dialogbox.style.left = (windowWidth / 2) - (600 * 0.5) + "px";
        dialogbox.style.top = "60px";
        dialogbox.style.display = "block";
    }
    this.close = function(){
        document.getElementById('workDialogbox').style.display = "none";
        document.getElementById('workDialogoverlay').style.display = "none";

    }
};
NewWorkAlert = new WorkAlert();

function split(val){
    return val.split(/,\s*/);
}

function extractLast(term){
    return split(term).pop();
}

var works,
    producers,
    currentSelectedWork,
    titles;

Template.addWorkAlert.events({
    'keydown .title': function(event){
        if(this.works.length > 0 && !titles){
            titles = _.pluck(this.works, 'title');
        }
        works = this.works;
        producers = this.producers;
        $(".title").autocomplete({
            source: titles
        });
    },
    'keydown .producer': function(event){
        if(this.producers && this.producers.length > 0){
            availableTags = _.pluck(this.producers, 'name');

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
    'click .add-work': function(event){
        var attr = {
            title: $('.title').val(),
            url: $('.url').val(),
            discussionUrl: $('.discussion-url').val(),
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

        if(attr === undefined) throwError("Error code: 601");
        if(attr.title === undefined) throwError("Error code: 602");
        if(attr.url === undefined) throwError("Error code: 603");
        if(attr.discussionUrl === undefined) throwError("Error code: 604");
        if(attr.type === undefined) throwError("Error code: 608");
        if(attr.producers === undefined) throwError("Error code: 609");

        Meteor.call('createWork', _.omit(attr, 'scores'), function(error, worksId){
            if(error) throwError(error.reason);

            $('.title').val("");
            $('.url').val("");
            $('.discussion-url').val("");
            $('.type-of-work').val("");
            $('.producer').val("");

            $('.producer').prop('disabled', false);
            $('.url').prop('disabled', false);
            $('.discussion-url').prop('disabled', false);
            $('.type-of-work').prop('disabled', false);

            NewWorkAlert.close();
        });
    },
    'click .close-custom-alert': function(){
        NewWorkAlert.close();
    }
});

Template.addWorkAlert.rendered = function(){
    $('body').on('keydown',function(e){
        if(e.which === 27){
            NewWorkAlert.close();
        }
    }).on('click', function(e){
            if(e.target.id === "workDialogoverlay"){
                NewWorkAlert.close();
            }

            if($(e.originalEvent.target).attr('class') === "ui-menu-item" &&
                $(e.originalEvent.target).parents('.producer').length){
                var work = _.findWhere(works, {title: $(e.originalEvent.target)[0].innerHTML}),
                    producersOfWork = _.filter(producers, function(producer){
                        return _.contains(work.producers, producer._id)
                    });
                currentSelectedWork = work.title;

                var producerField = $('.producer'),
                    urlField = $('.url'),
                    urlDiscussionField = $('.discussion-url');

                producerField.val("");
                urlField.val("");
                urlDiscussionField.val("");

                for(var x = 0; x < producersOfWork.length; x++){
                    var producer = $('.producer');
                    if(x === producersOfWork.length - 1){
                        $('.producer').val(producer.val() + producersOfWork[x].name);
                    } else {
                        $('.producer').val(producer.val() + producersOfWork[x].name + ", ");
                    }
                }

                urlField.val(work.url);
                urlDiscussionField.val(work.discussionUrl);

                $(".type-of-work option").filter(function(){
                    return $(this).text() == work.type;
                }).prop('selected', true);

                producerField.prop('disabled', true);
                urlField.prop('disabled', true);
                urlDiscussionField.prop('disabled', true);
                $('.type-of-work').prop('disabled', true);
            }
        });

    $('.title').bind('input', function(){
        if(currentSelectedWork && currentSelectedWork !== $('.title').val()){
            var producerField = $('.producer'),
                urlField = $('.url'),
                urlDiscussionField = $('.discussion-url');

            producerField.val("");
            urlField.val("");
            urlDiscussionField.val("");
            $(".type-of-work option").filter(function(){
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

Template.addWorkAlert.helpers({
    familiarity: function(){
        return familiarity;
    },
    typeOfWork: function(){
        return typeOfWork;
    }
});
