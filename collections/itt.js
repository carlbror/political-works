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

        var firstQuestions = [],
            secondQuestions = [];

        _.each(sanitizedObj.firstQuestions, function(question){
            firstQuestions.push({
                question: question
            });
        });

        var ittId = ITT.insert({
            admin: get_.userOrThrowError()._id,
            name: sanitizedObj.name,
            type: sanitizedObj.type,
            firstIdeologyId: firstIdeologyId,
            secondIdeologyId: secondIdeologyId,
            firstQuestions: firstQuestions
        });

        if(sanitizedObj.lastDateToAnswer) ITT.update(ittId,
            {$set: {lastDateToAnswer: new Date(sanitizedObj.lastDateToAnswer)}});
        if(sanitizedObj.lastDateToGuess) ITT.update(ittId,
            {$set: {lastDateToGuess: new Date(sanitizedObj.lastDateToGuess)}});
        if(sanitizedObj.numberOfContestantsAllowed) ITT.update(ittId,
            {$set: {numberOfContestantsAllowed: sanitizedObj.numberOfContestantsAllowed}});
        if(sanitizedObj.secondQuestions.length > 0){
            _.each(sanitizedObj.secondQuestions, function(question){
                secondQuestions.push({
                    question: question
                });
            });

            ITT.update(ittId, {$set: {secondQuestions: secondQuestions}});
        }

        return ittId;
    },
    submitAnswerToITT: function(answersToFirstQuestions, answersToSecondQuestions, ittId){
        if(Meteor.isServer){
            answersToFirstQuestions = o_.sanitizeArrayWithObjectsInside(answersToFirstQuestions);
            if(answersToSecondQuestions) answersToSecondQuestions = o_.sanitizeArrayWithObjectsInside(answersToSecondQuestions);
            ittId = o_.sanitizeString(ittId);

            var user = get_.userOrThrowError();
            var doesIttExist = ITT.findOne({_id: ittId, "answers.userId": user._id});
            if(doesIttExist) throw new Meteor.Error(401, 'You have already answered this ideological turing test');

            _.each(answersToFirstQuestions, function(answerObj){
                ITT.update({_id: ittId, "firstQuestions.question": answerObj.question},
                    {$push: {"firstQuestions.$.answers": {userId: user._id, answer: answerObj.answer}}});
            });

            if(answersToSecondQuestions){
                _.each(answersToSecondQuestions, function(answerObj){
                    ITT.update({_id: ittId, "secondQuestions.question": answerObj.question},
                        {$push: {"secondQuestions.$.answers": {userId: user._id, answer: answerObj.answer}}});
                });
            }

            return ittId;
        }
    },
    getITTWithoutUsersAnswers: function(ittId){
        if(Meteor.isServer){
            var fullItt =  ITT.findOne(ittId),
                user = get_.userOrThrowError(),
                usersAnswers = _.findWhere(fullItt.answers, {userId: user._id});
            var ittWithOutUserId =  ITT.findOne({_id: ittId}, {fields: {"answers.userId":0}});

            if(fullItt.secondQuestions){
                ittWithOutUserId.answers = _.reject(ittWithOutUserId.answers, function(obj){
                    return obj.answersToFirstQuestions[0].answer === usersAnswers.answersToFirstQuestions[0].answer &&
                        obj.answersToSecondQuestions[0].answer === usersAnswers.answersToSecondQuestions[0].answer});
            } else {
                ittWithOutUserId.answers = _.reject(ittWithOutUserId.answers, function(obj){
                    return obj.answersToFirstQuestions[0].answer === usersAnswers.answersToFirstQuestions[0].answer});
            }

            return ittWithOutUserId;
        }
    }
});
