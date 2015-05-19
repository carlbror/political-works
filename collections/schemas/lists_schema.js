Schemas.Lists = new SimpleSchema({
    name: {
        type: String
    },
    createdBy: {
        type: String,
        autoValue:function(){ return this.userId }
    },
    essentialWorks: {
        type: [String],
        optional: true
    },
    nonEssentialWorks: {
        type: [String],
        optional: true
    },
    trackers: {
        type: [String],
        optional: true
    }
});