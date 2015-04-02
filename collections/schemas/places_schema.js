Schemas.Places = new SimpleSchema({
    date: {
        type: Date
    },
    universal: {
        type: Boolean,
        optional: true
    },
    customPlace: {
        type: Boolean,
        optional: true
    },
    area: {
        type: String,
        optional: true
    },
    country: {
        type: String,
        optional: true
    }
});