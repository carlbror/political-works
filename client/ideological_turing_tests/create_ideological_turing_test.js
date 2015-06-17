var ideologyNames;

Template.createIdeologicalTuringTest.events({
    'keydown .ideologies': function(){
        if(this.ideologies && this.ideologies.length > 0){
            if(!ideologyNames){
                ideologyNames = _.pluck(this.ideologies, 'name');
            }
            $(".ideologies").autocomplete({
                source: ideologyNames
            });
            ifReadyToCreateEnableButtonElseDisable();
        }
    },
    'click #first-ideology-group-questions .up': function(){
        $('#first-ideology-group-questions').append('<textarea class="extra-first-question" rows="3" cols="50"></textarea>')
    },
    'click #first-ideology-group-questions .down': function(){
        $('.extra-first-question:last-child').remove();
    },
    'change #reciprocal-test-checkbox': function(){
        Session.set('twoWayTest', !Session.get('twoWayTest'));
        ifReadyToCreateEnableButtonElseDisable();
    },
    'click #second-ideology-group-questions .up': function(){
        $('#second-ideology-group-questions').append('<textarea class="extra-second-question" rows="3" cols="50"></textarea>')
    },
    'click #second-ideology-group-questions .down': function(){
        $('.extra-second-question:last-child').remove();
    },
    'keydown .necessary': function(){
        ifReadyToCreateEnableButtonElseDisable();
    },
    'click .create-test': function(){
        Meteor.call('createIdeologicalTuringTest', {
            type: 1,
            firstIdeology: $('.test-directed-towards').val(),
            secondIdeology: $('.ideology-tested-on').val(),
            firstQuestions: _.map($('#first-ideology-group-questions textarea'), function(element){if(element.value !=="")
            {return element.value}}),
            secondQuestions: _.map($('#second-ideology-group-questions textarea'), function(element){if(element.value !=="")
            {return element.value}}),
            numberOfContestantsAllowed: $('.number-of-allowed-contestants').val(),
            lastDateToAnswer: $('#last-date-to-answer').val(),
            lastDateToGuess: $('#last-date-to-guess').val()
        });
    },
    'keydown #second-ideology-questions-textarea': function(){
        ifReadyToCreateEnableButtonElseDisable();
    }
});

Template.createIdeologicalTuringTest.helpers({
    twoWayTest: function(){
        return Session.get('twoWayTest');
    }
});

Template.createIdeologicalTuringTest.rendered=function(){
    this.$('.datepicker').datepicker();
};

var ifReadyToCreateEnableButtonElseDisable = function(){
    var necessaryElements = $('.necessary').map(function() {
        if(this.value !== "")
            return this.value;
    }).get();
    if(necessaryElements.length === 3){
        if($('#reciprocal-test-checkbox').is(':checked')){
            if(!!$('#second-ideology-questions-textarea').val() === false){
                $('.create-test').prop('disabled', true);
            } else {
                $('.create-test').prop('disabled', false);
            }
        } else {
            $('.create-test').prop('disabled', false);
        }
    } else {
        $('.create-test').prop('disabled', true);
    }
};