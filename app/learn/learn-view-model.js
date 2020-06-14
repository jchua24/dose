const observableModule = require("tns-core-modules/data/observable");

const SelectedPageService = require("../shared/selected-page-service");

function LearnViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Learn");

    const viewModel = observableModule.fromObject({
        /* Add your view model properties here */
    });

    return viewModel;
}

module.exports = LearnViewModel;
