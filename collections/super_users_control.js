Meteor.methods({
    'setDiscussionUrl': function(password, url, title){
        if(Meteor.isServer){
            if(password === secrets.discussionUrlPassword){
                Works.update({title: title}, {$set: {discussionUrl: url}});
            }
        }
    },
    'setUrl': function(password, url, title){
        if(Meteor.isServer){
            if(password === secrets.discussionUrlPassword){
                Works.update({title: title}, {$set: {url: url}});
            }
        }
    }
});