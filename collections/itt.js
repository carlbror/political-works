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
            var doesIttExist = ITT.findOne({_id: ittId, "firstQuestions.answers.userId": user._id});
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
            var fullItt = ITT.findOne(ittId),
                user = get_.userOrThrowError(),
                firstAnswers = [],
                secondAnswers = [],
                fieldProjection;

            _.each(fullItt.firstQuestions, function(firstQuestion){
                firstAnswers.push(_.findWhere(firstQuestion.answers, {userId: user._id}));
            });

            if(!fullItt.secondQuestions){
                fieldProjection = {"firstQuestions.answers.userId": 0};
            } else {
                _.each(fullItt.secondQuestions, function(secondQuestion){
                    secondAnswers.push(_.findWhere(secondQuestion.answers, {userId: user._id}));
                });
                fieldProjection = {"firstQuestions.answers.userId": 0, "secondQuestions.answers.userId": 0};
            }

            var ittWithOutUserId = ITT.findOne({_id: ittId}, {fields: fieldProjection});


            if(!!firstAnswers[0]){
                for(x = 0; x < ittWithOutUserId.firstQuestions.length; x++){
                    ittWithOutUserId.firstQuestions[x].answers = _.reject(ittWithOutUserId.firstQuestions[x].answers,
                        function(obj){
                            return obj.answer === firstAnswers[x].answer;
                        });
                }

                ittWithOutUserId.firstQuestions = return_.shuffledArray(ittWithOutUserId.firstQuestions);
                for(x = 0; x < ittWithOutUserId.firstQuestions.length; x++){
                    ittWithOutUserId.firstQuestions[x].answers = return_.shuffledArray(ittWithOutUserId.firstQuestions[x].answers);
                }
                if(fullItt.secondQuestions){
                    for(x = 0; x < ittWithOutUserId.secondQuestions.length; x++){
                        ittWithOutUserId.secondQuestions[x].answers = _.reject(ittWithOutUserId.secondQuestions[x].answers,
                            function(obj){
                                return obj.answer === secondAnswers[x].answer;
                            });
                    }

                    ittWithOutUserId.secondQuestions = return_.shuffledArray(ittWithOutUserId.secondQuestions);
                    for(x = 0; x < ittWithOutUserId.secondQuestions.length; x++){
                        ittWithOutUserId.secondQuestions[x].answers = return_.shuffledArray(ittWithOutUserId.secondQuestions[x].answers);
                    }
                }
            }

            return ittWithOutUserId;
        }
    }
});
