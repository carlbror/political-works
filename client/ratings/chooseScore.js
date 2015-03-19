Template.chooseScore.helpers({
    functionSessionSet: function () {
        if (Session.get('scoreView') == 'convincing-score') {
            return "checked";
        }
    }
});

Template.chooseScore.events({
    'change .choose-score-checkbox': function (event) {
        var score = event.currentTarget.id;

        Session.set('scoreView', score);
        uncheckScoreChoosersExceptOwn2(score);
    }
});


uncheckScoreChoosersExceptOwn2 = function (scoreId) {
    $('#convincing-score').prop('checked', false);
    $('#readability-score').prop('checked', false);

    $('#' + scoreId).prop('checked', true);
};