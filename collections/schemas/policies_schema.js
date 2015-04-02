Schemas.Policies = new SimpleSchema({
    solution: {
        type: String
    },
    summary: {
        type: String,
        max: 600
    },
    placeId: {
        type: String
    },
    date: {
        type: Date
    }
});
