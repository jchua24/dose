const app = require("tns-core-modules/application");
const { Frame } = require("tns-core-modules/ui/frame");
const dialogsModule = require("tns-core-modules/ui/dialogs");
const HomeViewModel = require("./home-view-model");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new HomeViewModel();
    page.enableSwipeBackNavigation = false;    
}

function onTileTapped(args) {
    const tile = args.object; 

    const bottomNavigation = app.getRootView();
   

    console.log(tile.pageName + " tile was tapped!"); 

    switch(tile.pageName) {
        case "diary":
            bottomNavigation.selectedIndex = "1"; 
        break;
        case "calendar":
            bottomNavigation.selectedIndex = "2"; 
        break;
        case "learn":
            bottomNavigation.selectedIndex = "3"; 
        break;
        case "reminders":
            bottomNavigation.selectedIndex = "4"; 
        break;
        case "reports":
            dialogsModule.alert("Reports page. To be implemented later!"); 
        break;
        case "scan":
            dialogsModule.alert("Scan page. To be implemented later!"); 
        break;
        
    }
    
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

function onSettingsButtonTap(args) {
    Frame.topmost().navigate({
        moduleName: "settings/settings-page",
        transition: {
            name: "fade"
        }
    });
}



exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.onSettingsButtonTap = onSettingsButtonTap;
exports.onTileTapped = onTileTapped; 
