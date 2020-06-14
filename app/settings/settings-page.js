const SettingsViewModel = require("./settings-view-model");
const userService = require("~/services/user-service"); 

var page; 

function onNavigatingTo(args) {
    page = args.object;
    page.bindingContext = new SettingsViewModel();
}

function onListViewLoaded(args) {
    const listView = args.object;
}

function arrowNeeded(args) {
    var item = args.view.bindingContext;
    if (item.title.includes("Change")) {
        return "Visible";
    } else  {
        return "Collapse";
    }
}

function onItemTap(args) {
    var item = args.view.bindingContext; 

    console.log("ITEM IS : " + item.title);

    if(item.title == "Log Out") {
       userService.logOut(); 
    }
}




exports.onNavigatingTo = onNavigatingTo;
exports.onListViewLoaded = onListViewLoaded;
exports.onItemTap = onItemTap;
exports.arrowNeeded = arrowNeeded; 
