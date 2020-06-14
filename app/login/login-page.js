const app = require("tns-core-modules/application");
const LoginViewModel = require("./login-view-model");
const { Frame } = require("tns-core-modules/ui/frame");

var page;  

function pageLoaded(args) {
    page = args.object;

    page.bindingContext = new LoginViewModel();
    page.enableSwipeBackNavigation = false;
}

function attemptLogin(args) {

    page.bindingContext.submit().then(function(outcome) {
        if (outcome) {
            console.log("login successful");

            global.rootViewModel.loginNeeded = false; 
            global.loginNeeded = false; 
        
            page.bindingContext.getUserInfo().then(function() {
                Frame.topmost().navigate({
                    moduleName: "home/home-page",
                    clearHistory: true, 
                    transition: {
                        name: "fade"
                    }
                });
            });
        } else {
            console.log("login not successful");
        }
    });


}


exports.pageLoaded = pageLoaded;
exports.attemptLogin = attemptLogin; 
