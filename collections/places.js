Places = new Meteor.Collection('places');
Places.attachSchema(Schemas.Places);

Places.allow({
    insert: function(userId) {
        return !!userId;
    }
});


Meteor.methods({
    createPlace: function(attr){
        attr = o_.sanitizeObject(attr);
        get_.userOrThrowError();

        if(attr.universal) {
            var universalPlace = Places.findOne({universal: true});
            if(universalPlace) return universalPlace._id;
            else return Places.insert({universal: true, date: new Date()});
        }

        if(attr.customPlace){
            var customPlace = Places.findOne({customPlace: true, area: attr.area});
            if(customPlace) return customPlace._id;
            else return Places.insert({customPlace: true, area: attr.area, date: new Date()});
        }

        if(attr.area){
            var areaPlace = Places.findOne({country: attr.country, area: attr.area});
            if(areaPlace) return areaPlace._id;
            else return Places.insert({country: attr.country, area: attr.area, date: new Date()});
        }

        if(attr.country){
            var countryPlace = Places.findOne({country: attr.country, area: undefined});
            if(countryPlace) return countryPlace._id;
            else return Places.insert({country: attr.country, date: new Date()});
        }
    }
});

