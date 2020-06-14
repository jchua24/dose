const app = require("tns-core-modules/application");

const CalendarViewModel = require("./calendar-view-model");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new CalendarViewModel();
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
