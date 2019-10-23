//<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

var imported = document.createElement("script");
imported.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js";
document.getElementsByTagName("head")[0].appendChild(imported);


var stateMaxPermitCount, cityMaxPermitCountByState, zipMaxPermitCountByCity;

function getStateMaxCount() {
    return (typeof (stateMaxPermitCount) != 'undefined') ? stateMaxPermitCount : "0";
}
function getCityMaxCount() {
    return (typeof (cityMaxPermitCountByState) != 'undefined') ? cityMaxPermitCountByState : "0";
}
function getZipMaxCount() {
    return (typeof (zipMaxPermitCountByCity) != 'undefined') ? zipMaxPermitCountByCity : "0";
}

function loadJson(typeLocation, stateName, cityName) {

    //include the   'async':false   parameter or the object data won't get captured when loading
    var json = $.getJSON({ 'url': "PermitData1.json", 'async': false });  //PermitData1.json  replace the url 


    //The next line of code will filter out all the unwanted data from the object.
    obj1 = JSON.parse(json.responseText);

    //You can now access the json variable's object data like this obj
   // var filterOption = "state"; //displayRadioValue();

    if (typeLocation == "state") {

        var result = obj1.reduce(function (res, obj) {
            if (!(obj.state in res))
                res.__array.push(res[obj.state] = obj);
            else {
                // res[obj.state].zip_code += obj.zip_code;
                res[obj.state].CountOfPermit += parseInt(obj.CountOfPermit);
            }
            return res;
        }, { __array: [] }).__array
            .sort(function (a, b) { return b.CountOfPermit - a.CountOfPermit; });

        //  console.log(result);

        var xxx = [];
        for (x in result) {
            xxx[x] = result[x].CountOfPermit;  // xxx[x] = result[x].state; -->to collect all states
        }
        // console.log(xxx);
        xxx.sort(function (a, b) { return a - b });
        // console.log(xxx[xxx.length-1]);  //Returns Max
        stateMaxPermitCount = xxx[xxx.length - 1];

        return result;
    }
    else if (typeLocation == "county") {

        var result = obj1.reduce(function (res, obj) {
            if (obj.state.toLowerCase() == stateName.toLowerCase()) //additional filter on state level to avoid conflict of county name across state
            {
                if (!(obj.county in res)) {
                    res.__array.push(res[obj.county] = obj);
                }
                else {
                    //  res[obj.state].zip_code += obj.zip_code;
                    res[obj.county].CountOfPermit += parseInt(obj.CountOfPermit);
                }
            }
            return res;
        }, { __array: [] }).__array
            .sort(function (a, b) { return b.CountOfPermit - a.CountOfPermit; });

        return result;
    }
    else if (typeLocation == "city") {

        var result = obj1.reduce(function (res, obj) {
            if (obj.state.toLowerCase() == stateName.toLowerCase()) //additional filter on state level to avoid conflict of county name across state
            {
                if (!(obj.city in res)) {
                    res.__array.push(res[obj.city] = obj);
                }
                else {
                    //  res[obj.state].zip_code += obj.zip_code;
                    res[obj.city].CountOfPermit += parseInt(obj.CountOfPermit);
                }
            }
            return res;
        }, { __array: [] }).__array
            .sort(function (a, b) { return b.CountOfPermit - a.CountOfPermit; });

        console.log(result);
        var xxx=[];
        for (x in result) {
            xxx[x] = result[x].CountOfPermit;
        }
       // console.log(xxx);
        xxx.sort(function(a, b){return a-b});
        // console.log(xxx[xxx.length-1]);  //Returns Max
        cityMaxPermitCountByState=xxx[xxx.length-1];
        return result;
    }
    else {
        var result = obj1.reduce(function (res, obj) {
            if (obj.state.toLowerCase() == stateName.toLowerCase()) //additional filter on state level to avoid conflict of county name across state
            {
                if (obj.city.toLowerCase() == cityName.toLowerCase()) //additional filter on state level to avoid conflict of county name across state
                {
                    if (!(obj.zip_code in res))
                        res.__array.push(res[obj.zip_code] = obj);
                    else {
                        // res[obj.state].zip_code += obj.zip_code;
                        res[obj.zip_code].CountOfPermit += parseInt(obj.CountOfPermit);
                    }
                }
            }
            return res;
        }, { __array: [] }).__array
            .sort(function (a, b) { return b.CountOfPermit - a.CountOfPermit; });

            console.log(result);
        var xxx = [];
        for (x in result) {
            xxx[x] = result[x].CountOfPermit;
        }
        // console.log(xxx);
        xxx.sort(function (a, b) { return a - b });
        // console.log(xxx[xxx.length-1]);  //Returns Max
        zipMaxPermitCountByCity = xxx[xxx.length - 1];

      //  let sum = xxx.reduce((previous, current) => current += previous);  //Average finding
      //  let avg = sum / xxx.length;
      //  zipMaxPermitCountByCity=avg;

        return result;
    }
    return null;

}

function getDataByLocation(locationStr, locationsArray, typeLoc) { //By Passing string Statename it retrives the record.
   //   filterOption1 = 'state';
   // zipCodes = loadJson();
    if (typeLoc == 'state') { 
        for (var i = 0; i < locationsArray.length; i++) {
            if (locationsArray[i].state.toLowerCase() == locationStr) {
                return locationsArray[i];
            }
        }
    }
    else if (typeLoc == 'county') {
        for (var i = 0; i < locationsArray.length; i++) {
            if (locationsArray[i].county  == locationStr.toUpperCase()) {
                return locationsArray[i];
            }
        }
    }
    else if (typeLoc == 'city') {
        for (var i = 0; i < locationsArray.length; i++) {
            if (locationsArray[i].city.toUpperCase() == locationStr.toUpperCase()) {
                return locationsArray[i];
            }
        }
    }
    else {
        for (var i = 0; i < locationsArray.length; i++) {
            if (locationsArray[i].zip_code == locationStr) {
                return locationsArray[i];
            }
        }
    }
}



function loadCityJsonFile(StateName, StateCode) {

    //include the   'async':false   parameter or the object data won't get captured when loading
    var All_Cities = $.getJSON({ 'url': "US_City.json", 'async': false });  //PermitData1.json  replace the url 

    //The next line of code will filter out all the unwanted data from the object.
    var All_Cities_JS = JSON.parse(All_Cities.responseText);

    var citylist = [];

    if (All_Cities_JS[StateName].length > 0) {

        for (var i = 0; i <= All_Cities_JS[StateName].length; i++) {
            citylist.push(All_Cities_JS[StateName][i] + ', ' + StateCode +', USA');
        }
    }

    return citylist;

}