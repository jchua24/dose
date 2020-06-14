const observableModule = require("tns-core-modules/data/observable");
const SelectedPageService = require("../shared/selected-page-service");

function AppRootViewModel() {
    const viewModel = observableModule.fromObject({
        selectedPage: "", 
        firstPage: global.loginNeeded ? "login/login-page" : "home/home-page", 
        diaryTab: "diary/diary-page", 
        calendarTab: "calendar/calendar-page",
        learnTab: "learn/learn-page", 
        remindersTab: "reminders/reminders-page", 
        loginNeeded: global.loginNeeded
    });

    SelectedPageService.getInstance().selectedPage$
    .subscribe((selectedPage) => { viewModel.selectedPage = selectedPage; });

    return viewModel;
}

module.exports = AppRootViewModel;

