const observableModule = require("tns-core-modules/data/observable");

const SelectedPageService = require("../shared/selected-page-service");

function SettingsViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Settings");

    const viewModel = observableModule.fromObject({
        listItems: [
            { title: "First Name: " + global.userViewModel.firstName, id:"firstName", arrow:"collapse" },
            { title: "Last Name: " + global.userViewModel.lastName, id:"lastName", arrow:"collapse"},
            { title: "Change Email", id:"changeEmail", arrow:"visible" },
            { title: "Change Password", id:"changePassword", arrow:"visible" },
            { title: "Participating Programs", id:"participatingPrograms", arrow:"collapse" },
            { title: "Log Out", id:"logout", arrow:"collapse" }
        ]
    });

    return viewModel;
}

module.exports = SettingsViewModel;
