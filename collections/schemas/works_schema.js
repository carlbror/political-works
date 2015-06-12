Schemas.Works = new SimpleSchema({
    title: {
        type: String
    },
    producers: {
        type: [String]
    },
    url: {
        type: SimpleSchema.RegEx.Url
    },
    discussionUrl: {
        type: SimpleSchema.RegEx.Url
    },
    type: {
        type: String
    },
    date: {
        type: Date
    }
});