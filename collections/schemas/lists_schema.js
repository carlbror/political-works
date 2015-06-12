Schemas.Lists = new SimpleSchema({
    name: {
        type: String
    },
    createdBy: {
        type: String,
        autoValue:function(){ return this.userId }
    },
    coCreators: {
        type: [String],
        optional: true
    },
    essentialWorks: {
        type: [String],
        optional: true
    },
    importantWorks: {
        type: [String],
        optional: true
    },
    subscribers: {
        type: [String],
        optional: true
    },
    date: {
        type: Date()
    }
});