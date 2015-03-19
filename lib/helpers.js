
o_.capitaliseFirstLetter = function(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
};

o_.lowerFirstLetter = function(string){
    if(!string) return;
    return string.charAt(0).toLowerCase() + string.slice(1);
};