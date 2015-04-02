var scoresSchema = new SimpleSchema({
    convincingScore: {
        type: Number,
        min: 0,
        max: 100
    },
    readabilityScore: {
        type: Number,
        min: 0,
        max: 100
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
        type: scoresSchema
    },
    familiarity: {
        type: String
    },
    ratingType: {
        type: String
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
    urlReview: {
        type: String,
        optional: true
    }
});