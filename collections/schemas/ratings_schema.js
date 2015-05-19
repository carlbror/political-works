var scoresSchema = new SimpleSchema({
    convincingScore: {
        type: Number,
        min: 0,
        max: 100,
        optional: true
    },
    enlighteningScore: {
        type: Number,
        min: 0,
        max: 100,
        optional: true
    },
    readabilityScore: {
        type: Number,
        min: 0,
        max: 100,
        optional: true
    }
});

Schemas.Ratings = new SimpleSchema({
    worksId: {
        type: String
    },
    userId: {
        type: String
    },
    scores: {
        type: scoresSchema,
        optional: true
    },
    familiarity: {
        type: Number
    },
    ratingType: {
        type: String,
        optional: true
    },
    date: {
        type: Date
    },
    policyId: {
        type: String,
        optional: true
    },
    ideologyId: {
        type: String,
        optional: true
    },
    policyAreaId: {
        type: String,
        optional: true
    },
    urlReview: {
        type: String,
        optional: true
    }
});