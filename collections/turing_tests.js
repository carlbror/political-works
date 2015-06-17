TuringTests = new Meteor.Collection('turing_tests');

TuringTests.allow({
    insert: function(userId){
        return !!userId;
    }
});

Meteor.methods({
    createIdeologicalTuringTest: function(object){
        var sanitizedObj = o_.sanitizeObject(object),
            firstIdeologyId = ideologies_.createIdeology(sanitizedObj.firstIdeology),
            secondIdeologyId = ideologies_.createIdeology(sanitizedObj.secondIdeology);

        var ittId = TuringTests.insert({
            admin: get_.userOrThrowError()._id,
            type: sanitizedObj.type,
            firstIdeologyId: firstIdeologyId,
            secondIdeology: secondIdeologyId,
            firstQuestions: sanitizedObj.firstQuestions
        });

        if(sanitizedObj.lastDateToAnswer) TuringTests.update(ittId,
            {$set: {lastDateToAnswer: new Date(sanitizedObj.lastDateToAnswer)}});
        if(sanitizedObj.lastDateToGuess) TuringTests.update(ittId,
            {$set: {lastDateToGuess: new Date(sanitizedObj.lastDateToGuess)}});
        if(sanitizedObj.numberOfContestantsAllowed) TuringTests.update(ittId,
            {$set: {numberOfContestantsAllowed: sanitizedObj.numberOfContestantsAllowed}});
        if(sanitizedObj.secondQuestions.length>0) TuringTests.update(ittId, {$set: {secondQuestions: sanitizedObj.secondQuestions}});

        return ittId;
    }
});