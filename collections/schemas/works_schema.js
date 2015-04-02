Schemas.Works = new SimpleSchema({
    title: {
        type: String
    },
    producers: {
        type: [String]
    },
    url: {
        type: String
    },
    discussionUrl: {
        type: String
    },
    type: {
        type: String
    },
    date: {
        type: Date
    }
});