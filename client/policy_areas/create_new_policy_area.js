Template.createNewPolicyArea.events({
    'click .add-policy-area': function(event){
        event.preventDefault();
        var attr = {},
            area = $('.policy-area').val(),
            summary = $('.policy-area-summary').val(),
            universalCheckBox = $('.universal').prop('checked');

        if(!area) throwError("You need to name the policy area");
        if(summary && summary.length > 600) throwError("Summary is too long, you have written " + (summary.length - 600)
            + " characters too many");
        attr.area = area;
        if(summary) attr.summary = summary;
        attr.place = {};

        if(!universalCheckBox){
            var customPlace = $('.custom-place').val();
            if(customPlace){
                attr.place.area = customPlace;
                attr.place.customPlace = true;
            }
            else {
                attr.place.country = $('.countries').val();
                var area = $('.region-city').val();
                if(area) attr.place.area = area;
                if(!attr.place.country) throwError("You need to select the country where the debate is centered");
            }
        } else {
            attr.place.universal = true;
        }

        Meteor.call('createPlace', attr.place, function(err, placeId){
            if(err) throwError(err.reason);
            delete attr.place;
            attr.placeId = placeId;

            Meteor.call('createPolicyAra', attr, function(err, policyAreaId){
                if(err) throwError(err.reason);
                $('.policy-area').val("");
                $('.policy-area-summary').val("");
            });
        });


    },
    'click .regional': function(){
        var checkbox = $('.regional').prop('checked');
        if(checkbox){
            $('.universal').prop('checked', false);
            $('.regional-choices').show();
        } else {
            $('.universal').prop('checked', true);
            $('.regional-choices').hide();
        }
    },
    'click .universal': function(){
        var checkbox = $('.universal').prop('checked');
        if(checkbox){
            $('.regional').prop('checked', false);
            $('.regional-choices').hide();
        } else {
            $('.regional').prop('checked', true);
            $('.regional-choices').show();
        }
    }
});