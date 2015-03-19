Template.discussAPolicy.helpers({
    place: function(){
        return Places.findOne({_id: this.placeId});
    },
    onlyCountry: function(){
        if(this.country && !this.area) return true;
    },
    countryAndArea: function(){
        if(this.country && this.area) return true;
    },
    customArea: function(){
        if(this.area && !this.country) return true;
    }
});

Template.discussAPolicy.events({
    'click .discuss-a-policy .add-policy': function(event){
        if(!this.policyArea) {
            event.preventDefault();
            var attr = {},
                solution = $('.discuss-a-policy .policy-solution').val(),
                summary = $('.discuss-a-policy .policy-summary').val(),
                universalCheckBox = $('.universal').prop('checked');

            if (!solution) throwError("You need to name the policy solution");
            if (summary && summary.length > 600) throwError("Summary is too long, you have written " + (summary.length - 600)
                + " characters too many");
            attr.solution = solution;
            if (summary) attr.summary = summary;
            attr.place = {};

            if (!universalCheckBox) {
                var customPlace = $('.custom-place').val();
                if (customPlace) {
                    attr.place.area = customPlace;
                    attr.place.customPlace = true;
                }
                else {
                    attr.place.country = $('.countries').val();
                    var area = $('.region-city').val();
                    if (area) attr.place.area = area;
                    if (!attr.place.country) throwError("You need to select the country where the debate is centered");
                }
            } else {
                attr.place.universal = true;
            }

            Meteor.call('createPlace', attr.place, function (err, placeId) {
                if (err) throwError(err.reason);
                delete attr.place;
                attr.placeId = placeId;

                Meteor.call('createPolicy', attr, function (err) {
                    if (err) throwError(err.reason);
                    $('.discuss-a-policy .policy-solution').val("");
                });
            });
        } else {
            var policyAreaId = this.policyArea._id,
                policyAreaArea = this.policyArea.area;
            Meteor.call('createPolicy', {
                solution: $('.discuss-a-policy .policy-solution').val(),
                summary: $('.discuss-a-policy .policy-summary').val(),
                placeId: this.place._id
            }, function (err, policyId) {
                if (err) throwError(err.reason);
                Meteor.call('addPolicyToArea', {policyId: policyId, policyAreaId: policyAreaId}, function(err){
                    if (err) throwError(err.reason);
                    else
                        Router.go('policyAreaPage', {area: policyAreaArea, _id: policyAreaId});
                });
            });
        }
    },
    'click .discuss-a-policy .regional': function(){
        var checkbox = $('.regional').prop('checked');
        if(checkbox){
            $('.universal').prop('checked', false);
            $('.regional-choices').show();
        } else {
            $('.universal').prop('checked', true);
            $('.regional-choices').hide();
        }
    },
    'click .discuss-a-policy .universal': function(){
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