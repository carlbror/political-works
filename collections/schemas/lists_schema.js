Schemas.Lists = new SimpleSchema({
    name: {
        type: String
    },
    urlName: {
        type: String
    },
    createdBy: {
        type: String,
        autoValue:function(){ return this.userId }
    },
    coAdmins: {
        type: [String]
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