Template.chooseScore.helpers({
    familiaritiesChecked: function(){
        var arrayOfViews = Session.get('familiarityView').split(',');
        if(_.contains(arrayOfViews, this.number.toString())){
            return "checked";
        } else if(_.contains(arrayOfViews, 'any')){
            return "checked";
        }
    },
    scoreConvincingChecked: function(){
        if(Session.get('scoreView') === 'convincingScore'){
            return 'checked';
        }
    },
    scoreReadabilityChecked: function(){
        if(Session.get('scoreView') === 'readabilityScore'){
            return 'checked';
        }
    }
});

Template.chooseScore.events({
    'change .choose-score-checkbox': function (event) {
        Session.set('scoreView', event.currentTarget.id);
    },
    'change .view-type': function(event){
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
    },
    'change .show-familiarity': function(event){
        if(event.target.id === "any"){
            _.each(familiarityReveresed, function(type){
                $('#' + type.number).prop("checked", event.target.checked);
            });
        } else {
            if($('#any').prop('checked')){
                $('#any').prop('checked', false);
            }
        }

        if( $('#any').prop('checked')){
            if(Router.current().route._path === "/user/:username"){
                Session.set('familiarityView', "7,6,5,4,3,2,1");
            } else {
                Session.set('familiarityView', "7,6,5,4,3,2,1,0");
            }
        } else {
            var whatFamiliaritiesAreChecked = [];
            _.each(familiarityReveresed, function(type){
                if($('#' + type.number).prop('checked')){
                    whatFamiliaritiesAreChecked.push(type.number);
                }
            });
            if(whatFamiliaritiesAreChecked.length === 0){
                Session.set('familiarityView', 'none');
            } else {
                Session.set('familiarityView', whatFamiliaritiesAreChecked.toString());
                if(whatFamiliaritiesAreChecked.length === familiarityReveresed.length){
                    $('#any').prop('checked', true);
                }
            }
        }
    }
});