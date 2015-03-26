Template.chooseScore.events({
    'change .choose-score-checkbox': function (event) {
        var score = event.currentTarget.id;

        Session.set('scoreView', score);
        uncheckScoreChoosersExceptOwn(score);
    },
    'change .view-type': function(event){
        Session.set('typeView', event.target.id);
        if(event.target.id === "all"){
            _.each(typeOfWork, function(type){
                $('#' + type.htmlName).prop("checked", event.target.checked);
            });
        } else {
            if($('#all').prop('checked')){
                $('#all').prop('checked', false);
            }
        }

        if( $('#all').prop('checked')){
            Session.set('typeView', 'all');
        } else {
            var whatTypesAreChecked = [];
            _.each(typeOfWork, function(type){
                if($('#' + type.htmlName).prop('checked')){
                    whatTypesAreChecked.push(type.clientName);
                }
            });
            if(whatTypesAreChecked.length === 0){
                Session.set('typeView', 'none');
            } else {
                Session.set('typeView', whatTypesAreChecked.toString());
            }
        }
    }
});


uncheckScoreChoosersExceptOwn = function (scoreId) {
    $('#convincing-score').prop('checked', false);
    $('#readability-score').prop('checked', false);

    $('#' + scoreId).prop('checked', true);
};