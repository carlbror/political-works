var fieldSchema = new SimpleSchema({
    english: {
        type: String,
        optional: true,
        unique: true
    }
});

Schemas.Sciences = new SimpleSchema({
    field: {
        type: fieldSchema
    }
});