// this page is for working with API's and back-end user data 
const httpModule = require("tns-core-modules/http"); 
const { Frame } = require("tns-core-modules/ui/frame");
const app = require("tns-core-modules/application");
const appSettings = require("tns-core-modules/application-settings");

exports.getLoginToken = async function(user, pass) {
    //requires client_id, client_secret, grant_type, username and password
    var client_id = "opioids-mobile-app"; 
    var client_secret = "secret123"; 
    var grant_type = "password"; 

    var data = {'username': user, 'password': pass, 'client_id': client_id, 'client_secret': client_secret, 'grant_type': grant_type}; 
    var queryString = generateQueryString(data); 

    return httpModule.request({
        url: "https://opioids-api-dev.azurewebsites.net/connect/token", 
        method: "POST", 
        headers: {"Content-Type" : "application/x-www-form-urlencoded"}, 
        content: queryString
    }).then((response) =>   {
        return response; 
    }, (e) => {
        console.log("ERROR RETRIEVING LOGIN TOKEN: " + e); 
    }); 
}

exports.getUserInfo = async function(tokenType, token) {

    return httpModule.request({
        url: "https://opioids-api-dev.azurewebsites.net/connect/userinfo",
        method: "GET", 
        headers: {"Authorization" : tokenType + " " + token}
    }).then((response) => {
        // Content property of the response is HttpContent
        // The toString method allows you to get the response body as string.
        return response; 

    }, (e) => {
        console.log("ERROR RETRIEVING USER INFO: " + e); 
    });
}

exports.getDailyLimit = async function(date, tokenType, token) {

    var endingString = "?date=" + date; 

    return httpModule.request({
        url: "https://opioids-api-dev.azurewebsites.net/api/drugs/me/daily-limit" + endingString,
        method: "GET", 
        headers: {"Authorization" : tokenType + " " + token}
    }).then((response) => {
        // Content property of the response is HttpContent
        // The toString method allows you to get the response body as string.
        return response; 

    }, (e) => {
        console.log("ERROR RETRIEVING USER INFO: " + e); 
    });
}

exports.getRecentlyTaken = async function(date, tokenType, token) {

    var endingString = "?date=" + date; 

    return httpModule.request({
        url: "https://opioids-api-dev.azurewebsites.net/api/drugs/me/history" + endingString,
        method: "GET", 
        headers: {"Authorization" : tokenType + " " + token}
    }).then((response) => {
        // Content property of the response is HttpContent
        // The toString method allows you to get the response body as string.
        return response; 
    }, (e) => {
        console.log("ERROR RETRIEVING USER INFO: " + e); 
    });
}

exports.getAvailableDrugs = async function(tokenType, token) {
    return httpModule.request({
        url: "https://opioids-api-dev.azurewebsites.net/api/drugs",
        method: "GET", 
        headers: {"Authorization" : tokenType + " " + token}
    }).then((response) => {
        // Content property of the response is HttpContent
        // The toString method allows you to get the response body as string.
        return response; 
    }, (e) => {
        console.log("ERROR RETRIEVING USER INFO: " + e); 
    });
}

exports.getDrugStrengthOptions = async function(drugId, tokenType, token) {
    return httpModule.request({
        url: "https://opioids-api-dev.azurewebsites.net/api/drugs/" + drugId + "/pills",
        method: "GET", 
        headers: {"Authorization" : tokenType + " " + token, }
    }).then((response) => {
        // Content property of the response is HttpContent
        // The toString method allows you to get the response body as string.
        return response; 
    }, (e) => {
        console.log("ERROR RETRIEVING USER INFO: " + e); 
    });
}


exports.getMorphineEquivalent = async function(requestContent, tokenType, token) {
    return httpModule.request({
        url: "https://opioids-api-dev.azurewebsites.net/api/drugs/calculate-morphine-equivelent",
        method: "POST", 
        headers: {"Authorization" : tokenType + " " + token, "Content-Type" : "application/json" }, 
        content: JSON.stringify([requestContent])
    }).then((response) => {
        // Content property of the response is HttpContent
        // The toString method allows you to get the response body as string.
        return response; 
    }, (e) => {
        console.log("ERROR RETRIEVING USER INFO: " + e); 
    });
}

exports.recordMedication = async function(requestContent, tokenType, token) {

    console.log("about to record medication!");

    return httpModule.request({
        url: "https://opioids-api-dev.azurewebsites.net/api/drugs/me/history",
        method: "POST", 
        headers: {"Authorization" : tokenType + " " + token, "Content-Type" : "application/json" }, 
        content: JSON.stringify([requestContent])
    }).then((response) => {
        // Content property of the response is HttpContent
        // The toString method allows you to get the response body as string.
        return response; 
    }, (e) => {
        console.log("ERROR RETRIEVING USER INFO: " + e); 
    });
}

exports.checkTokenValidity = function(statusCode) {

    if (statusCode == 401) { //need to log the user out, login token is invalid 
        exports.logOut(); 
        return false; 
    } else {
        return true; 
    }
}

exports.logOut = function() {
    global.userViewModel.resetData(); 

    global.loginNeeded = true;
    global.rootViewModel.loginNeeded = true; 
    
    appSettings.remove("loginToken"); 
    appSettings.remove("loginTokenType"); 

    appSettings.remove("userFirstName"); 
    appSettings.remove("userLastName"); 
    
    //global.rootViewModel.resetNavigationTabs(); 

    const bottomNavigation = app.getRootView();
    bottomNavigation.selectedIndex = "0"; 

    // console.log(bottomNavigation.items[1]); 
    // var diaryFrame = bottomNavigation.items[1].getViewById("diaryPage");
    // console.log(diaryFrame); 
    //diaryFrame.defaultPage = "reminders/reminders-page"; 

    Frame.topmost().navigate({
        moduleName: "login/login-page",
        clearHistory: true, 
        transition: {
            name: "fade"
        }
    });
}


//for generating querystrings
function generateQueryString(parameters) {
    let qs = "";
    for (const key in parameters) {
        if (parameters.hasOwnProperty(key)) {
            const value = parameters[key];
            qs +=
                encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
        }
    }
    if (qs.length > 0) {
        qs = qs.substring(0, qs.length - 1); //chop off last "&"
    }
    return qs; 
}





