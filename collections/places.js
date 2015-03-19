Places = new Meteor.Collection('places');

Places.allow({
    insert: function(userId) {
        return !!userId;
    }
});


Meteor.methods({
    createPlace: function(attr){
        get_.userOrThrowError();

        if(attr.universal) {
            var universalPlace = Places.findOne({universal: true});
            if(universalPlace) return universalPlace._id;
            else return Places.insert({universal: true});
        }

        if(attr.customPlace){
            var customPlace = Places.findOne({customPlace: true, area: attr.area});
            if(customPlace) return customPlace._id;
            else return Places.insert({customPlace: true, area: attr.area});
        }

        if(attr.area){
            var areaPlace = Places.findOne({country: attr.country, area: attr.area});
            if(areaPlace) return areaPlace._id;
            else return Places.insert({country: attr.country, area: attr.area});
        }

        if(attr.country){
            var countryPlace = Places.findOne({country: attr.country, area: undefined});
            if(countryPlace) return countryPlace._id;
            else return Places.insert({country: attr.country});
        }
    }
});

