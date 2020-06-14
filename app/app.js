const application = require("tns-core-modules/application");
const UserViewModel = require("~/user/user-view-model");
const appSettings = require("tns-core-modules/application-settings");

global.loginNeeded = true;
global.diaryViewModel = null; 
global.rootViewModel = null; 

global.userViewModel = new UserViewModel(); 

var loginToken = appSettings.getString("loginToken"); 
var loginTokenType = appSettings.getString("loginTokenType"); 

if(loginToken != null && loginTokenType != null) {
    global.loginNeeded = false; 
    global.userViewModel.userAccessToken = loginToken; 
    global.userViewModel.userAccessTokenType = loginTokenType; 

    var userFirstName = appSettings.getString("userFirstName");
    var userLastName = appSettings.getString("userLastName");

    if(userFirstName != null) {
        global.userViewModel.firstName = userFirstName; 
    }

    if(userLastName != null) {
        global.userViewModel.lastName = userLastName; 
    }
}

console.log("login token is: " + loginToken); 

application.run({ moduleName: "app-root/app-root" });


/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
