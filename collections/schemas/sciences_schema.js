var fieldSchema = new SimpleSchema({
    english: {
        type: String,
        min: 1,
        unique: true
    }
});

Schemas.Sciences = new SimpleSchema({
    field: {
        type: fieldSchema
    }
});