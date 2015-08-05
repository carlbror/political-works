return_ = {};

return_.urlName = function(stringWithSpace){
    stringWithSpace = stringWithSpace.toLowerCase().split(' ').map(function(string){return string+"-"}).join("");
    return stringWithSpace.substring(0, stringWithSpace.length-1);
};

return_.withoutHyphens = function(stringWithHyphens){
    return stringWithHyphens.split('-').map(function(string){return string+" "}).join("").trim();
};

return_.ideologuesFromIdeologyName = function(ideologyName){
    var nameLength = ideologyName.length;
    if(ideologyName.substring(nameLength-7) === "eralism" || ideologyName.substring(nameLength-6) === "canism" ||
        ideologyName.substring(nameLength-6) === "ianism"){
        return ideologyName.substring(0, nameLength-3) + "s";
    } else if(ideologyName.substring(nameLength-5) === "atism") {
        return ideologyName.substring(0, nameLength-2) + "ves";
    } else {
        return ideologyName.substring(0, nameLength-1) + "ts";
    }

};

//-ists
//Minarchism
//Capitalism
//Marxism
//Mutualism
//Leftism
//Environmentalism
//
//-ians
//Libertarianism
//
//
//-s
//Democrats
//Republicanism
//Liberalism
//
//-ives
//Conservatism
