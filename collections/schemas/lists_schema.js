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
    necessaryWorks: {
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