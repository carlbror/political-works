return_ = {};

return_.urlName = function(stringWithSpace){
    stringWithSpace = stringWithSpace.toLowerCase().split(' ').map(function(string){
        return string + "-"
    }).join("");
    return stringWithSpace.substring(0, stringWithSpace.length - 1);
};

return_.withoutHyphens = function(stringWithHyphens){
    return stringWithHyphens.split('-').map(function(string){
        return string + " "
    }).join("").trim();
};

return_.shuffledArray = function(array){
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while(0 !== currentIndex){

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

return_.ideologuesFromIdeologyName = function(ideologyName){
    var nameLength = ideologyName.length;
    if(ideologyName.substring(nameLength - 7) === "eralism" || ideologyName.substring(nameLength - 6) === "canism" ||
        ideologyName.substring(nameLength - 6) === "ianism"){
        return ideologyName.substring(0, nameLength - 3) + "s";
    } else if(ideologyName.substring(nameLength - 5) === "atism"){
        return ideologyName.substring(0, nameLength - 2) + "ves";
    } else {
        return ideologyName.substring(0, nameLength - 1) + "ts";
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
