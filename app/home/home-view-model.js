const observableModule = require("tns-core-modules/data/observable");

const SelectedPageService = require("../shared/selected-page-service");

function HomeViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Home");

    const viewModel = observableModule.fromObject({
        greetingText: "Welcome " + global.userViewModel.firstName
    });

    return viewModel;
}

module.exports = HomeViewModel;
