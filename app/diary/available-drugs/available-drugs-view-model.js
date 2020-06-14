const observableModule = require("tns-core-modules/data/observable");
const userService = require("~/services/user-service"); 

function AvailableDrugsViewModel() {

    const viewModel = observableModule.fromObject({
        drugList : null, 

        async getAvailableDrugs() {
            
            var response = await userService.getAvailableDrugs(global.userViewModel.userAccessTokenType, global.userViewModel.userAccessToken); 

            //parse response content
            var responseContent = JSON.parse(response.content); 
            this.drugList = responseContent; 
            return true; 
        }
    });

    return viewModel;
}

module.exports = AvailableDrugsViewModel;
