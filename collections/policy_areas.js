PolicyAreas = new Meteor.Collection('policy_areas');
PolicyAreas.attachSchema(Schemas.PolicyAreas);

PolicyAreas.allow({
    insert: function(userId) {
        return !!userId;
    }
});

Meteor.methods({
    'createPolicyAra': function(attr){
        attr = o_.sanitizeObject(attr);

        var user = get_.userOrThrowError();
        attr.area = o_.capitaliseFirstLetter(attr.area);

        var policy = PolicyAreas.findOne({area: attr.area, placeId: attr.placeId});

        if (policy) {
            return policy._id;
        } else {
            return PolicyAreas.insert({
                area: attr.area,
                areaRaiser: user._id,
                summary: attr.summary,
                placeId: attr.placeId,
                date: new Date()
            });
        }
    },
    'addPolicyToArea': function(attr){
        attr = o_.sanitizeObject(attr);

        PolicyAreas.update(attr.policyAreaId, {$addToSet: {policyIds: attr.policyId}});
    }
});