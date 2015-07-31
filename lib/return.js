return_ = {};

return_.urlName = function(stringWithSpace){
    stringWithSpace = stringWithSpace.toLowerCase().split(' ').map(function(string){return string+"-"}).join("");
    return stringWithSpace.substring(0, stringWithSpace.length-1);
};

return_.withoutHyphens = function(stringWithHyphens){
    return stringWithHyphens.split('-').map(function(string){return string+" "}).join("").trim();
};