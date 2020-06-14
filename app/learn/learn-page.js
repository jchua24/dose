const app = require("tns-core-modules/application");

const LearnViewModel = require("./learn-view-model");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new LearnViewModel();
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
