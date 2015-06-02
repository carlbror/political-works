Schemas.Ideologies = new SimpleSchema({
    name: {
        type: String,
        max: 1000,
        unique: true
    },
    date: {
        type: Date
    },
    proponents: {
        type: [String],
        optional: true
    }
});