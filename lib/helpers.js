o_.capitaliseFirstLetter = function(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
};

o_.lowerFirstLetter = function(string){
    if(!string) return;
    return string.charAt(0).toLowerCase() + string.slice(1);
};

o_.sanitizeObject = function(object){
    if(Meteor.isServer){
        var sanitizedObject = {};
        _.each(_.pairs(object), function(lonelyArray){
            if(sanitizedObject[0] === "summary"){
                sanitizedObject[lonelyArray[0]] = sanitizeHtml(lonelyArray[1],
                    {allowedTags: ["a"], allowedAttributes: {"a": ["href"]}});
            } else {
                sanitizedObject[lonelyArray[0]] = sanitizeHtml(lonelyArray[1], {allowedTags: [], allowedAttributes: {}});
            }
        });

        return sanitizedObject
    }
};

o_.sanitizeArray = function(array){
    if(Meteor.isServer){
        var sanitizedArray = [];
        _.each(array, function(string){
            sanitizedArray.push(sanitizeHtml(string, {allowedTags: [], allowedAttributes: {}}));
        });

        return sanitizedArray;
    }
};

o_.sanitizeString = function(string){
    if(Meteor.isServer){
        return sanitizeHtml(string, {allowedTags: [], allowedAttributes: {}});
    }
}