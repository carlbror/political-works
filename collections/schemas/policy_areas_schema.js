Schemas.PolicyAreas = new SimpleSchema({
    area: {
        type: String
    },
    areaRaiser: {
        type: String
    },
    summary: {
        type: String
    },
    placeId: {
        type: String
    },
    date: {
        type: Date
    },
    policyIds: {
        type: [String],
        optional: true
    }
});