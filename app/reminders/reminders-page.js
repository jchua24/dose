const app = require("tns-core-modules/application");

const RemindersViewModel = require("./reminders-view-model");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new RemindersViewModel();
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
