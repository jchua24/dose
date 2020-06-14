const observableModule = require("tns-core-modules/data/observable");

const SelectedPageService = require("../shared/selected-page-service");

function RemindersViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Reminders");

    const viewModel = observableModule.fromObject({
        /* Add your view model properties here */
    });

    return viewModel;
}

module.exports = RemindersViewModel;
