ITT = new Meteor.Collection('itt');

ITT.allow({
    insert: function(userId){
        return !!userId;
    }
});

Meteor.methods({
    createIdeologicalTuringTest: function(object){
        var sanitizedObj = o_.sanitizeObject(_.omit(object, 'firstQuestions', 'secondQuestions')),
            firstIdeologyId = ideologies_.createIdeology(sanitizedObj.firstIdeology),
            secondIdeologyId = ideologies_.createIdeology(sanitizedObj.secondIdeology);

        sanitizedObj.firstQuestions = o_.sanitizeArray(object.firstQuestions);
        sanitizedObj.secondQuestions = o_.sanitizeArray(object.secondQuestions);

        var ittId = ITT.insert({
            admin: get_.userOrThrowError()._id,
            name: sanitizedObj.name,
            type: sanitizedObj.type,
            firstIdeologyId: firstIdeologyId,
            secondIdeologyId: secondIdeologyId,
            firstQuestions: sanitizedObj.firstQuestions
        });

        if(sanitizedObj.lastDateToAnswer) ITT.update(ittId,
            {$set: {lastDateToAnswer: new Date(sanitizedObj.lastDateToAnswer)}});
        if(sanitizedObj.lastDateToGuess) ITT.update(ittId,
            {$set: {lastDateToGuess: new Date(sanitizedObj.lastDateToGuess)}});
        if(sanitizedObj.numberOfContestantsAllowed) ITT.update(ittId,
            {$set: {numberOfContestantsAllowed: sanitizedObj.numberOfContestantsAllowed}});
        if(sanitizedObj.secondQuestions.length>0) ITT.update(ittId,
            {$set: {secondQuestions: sanitizedObj.secondQuestions}});

        return ittId;
    }
});