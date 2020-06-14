const AppRootViewModel = require("./app-root-view-model");
const platformModule = require("tns-core-modules/platform"); 
const Color = require("tns-core-modules/color").Color; 

function onLoaded(args) {
    const bottomNav = args.object;
    bottomNav.bindingContext = new AppRootViewModel();
    global.rootViewModel = bottomNav.bindingContext; 
    
    console.log(bottomNav);
}

exports.onLoaded = onLoaded;
