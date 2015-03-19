/***
 * This creates a local collection that only the client can read. The collection is used to display error messages.
 */

Errors = new Meteor.Collection(null);

// Local (client-only)
collectionErrors = new Meteor.Collection(null);

throwError = function (message) {
    Errors.insert({message: message, seen: false});
    throw new Meteor.Error();
};

clearErrors = function () {
    Errors.remove({seen: true});
};

