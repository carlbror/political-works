o_.capitaliseFirstLetter = function(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
};

o_.lowerFirstLetter = function(string){
    if(!string) return;
    return string.charAt(0).toLowerCase() + string.slice(1);
};

o_.sanitizeObject = function(object){
    var sanitizedObject = {};
    _.each(_.pairs(object), function(lonelyArray){
        if(lonelyArray[0] === "summary"){
            sanitizedObject[lonelyArray[0]] = sanitizeHtml(lonelyArray[1],
                {allowedTags: ["a"], allowedAttributes: {"a": ["href"]}});
        } else {
            sanitizedObject[lonelyArray[0]] = sanitizeHtml(lonelyArray[1], {allowedTags: [], allowedAttributes: {}});
        }
    });

    return sanitizedObject
};

o_.sanitizeArray = function(array){
    var sanitizedArray = [];
    _.each(array, function(string){
        sanitizedArray.push(sanitizeHtml(string, {allowedTags: [], allowedAttributes: {}}));
    });

    return sanitizedArray;
};

o_.sanitizeString = function(string, callback){
    return sanitizeHtml(string, {allowedTags: [], allowedAttributes: {}});
};
