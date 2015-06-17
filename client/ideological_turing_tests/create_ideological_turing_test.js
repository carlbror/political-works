var ideologyNames;

Template.createIdeologicalTuringTest.s({
    'keydown .ideologies': function(){
        if(this.ideologies && this.ideologies.length > 0){
            if(!ideologyNames){
                ideologyNames = _.pluck(this.ideologies, 'name');
            }
            $(".ideologies").autocomplete({
                source: ideologyNames
            });
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
    },
    'click #second-ideology-group-questions .up': function(){
        $('#second-ideology-group-questions').append('<textarea class="extra-second-question" rows="3" cols="50"></textarea>')
    },
    'click #second-ideology-group-questions .down': function(){
        $('.extra-second-question:last-child').remove();
    },
    'keydown .necessary': function(){
        console.log(2)
        var necessaryElements = $('.necessary').map(function() {
            if(this.val() !== "")
                return 1;
        }).get();
        console.log(necessaryElements);
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
