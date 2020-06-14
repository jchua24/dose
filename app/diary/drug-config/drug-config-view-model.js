const observableModule = require("tns-core-modules/data/observable");
const userService = require("~/services/user-service"); 

function DrugConfigViewModel() {

    const viewModel = observableModule.fromObject({
        drugStrengthOptions: null,
        selectedStrengthValue: null, 
        selectedDose: null, 
        selectedPillId: null, 
        progressColumns: "*, *", 
        morphineEquivalent: 0,  
        warningMessage: "", 
        progressBackgroundColor: "#2BBB9C", 
        readyToRecord: false,
        lastSelectedStrength: "", 
        lastSelectedDose: "", 

        async getDrugStrengthOptions(drugId) {

            var response = await userService.getDrugStrengthOptions(drugId, global.userViewModel.userAccessTokenType, global.userViewModel.userAccessToken); 

            //parse response content
            var responseContent = JSON.parse(response.content); 

            if(userService.checkTokenValidity(response.statusCode)) {
                if(response.statusCode == 200) {

                    var drugStrengths = []; 

                    var counter = 0;

                    responseContent.forEach(function(drug) {
                        var drugValues = {};
                        drugValues['id']= counter; 
                        drugValues['strength'] = drug.strength; 
                        drugValues['unit'] = drug.strengthUnit; 
                        drugValues['pillId'] = drug.pillId; 
                        drugStrengths.push(drugValues);

                        counter += 1;
                    })
        
                    this.drugStrengthOptions = drugStrengths; 

                    return true; 
                } else {
                    return false; 
                } 
            } else {
                return null; 
            }; 
        },  async getMorphineEquivalent(pillId, dose) {

                var requestContent = {}; 

                requestContent["pill"] = {"pillId" : Number(pillId)}; 
                requestContent["dose"] = Number(dose);  

                var response = await userService.getMorphineEquivalent(requestContent, global.userViewModel.userAccessTokenType, global.userViewModel.userAccessToken); 

                if(userService.checkTokenValidity(response.statusCode)) {
                    if(response.statusCode == 200) {

                        //parse response content
                        var responseContent = JSON.parse(response.content); 

                        if(responseContent.morphineEquivelent != null) {
                            this.morphineEquivalent = responseContent.morphineEquivelent; 
                        } else {
                            this.morphineEquivalent = 0;
                        } 

                        return true; 
                    } else {
                        return false; 
                    } 
                } else {
                    return null; 
                }; 



        }, async recordMedication(pillId, dose, date, time) {
                
                var dateObj = new Date(date); 
                var timeObj = new Date(time); 

                dateObj.setHours(timeObj.getHours(), timeObj.getMinutes(), timeObj.getSeconds()); 

                var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
                var localISOTime = (new Date(dateObj - tzoffset)).toISOString().slice(0, -1);

                var requestContent = {}; 
                requestContent["pillId"] = Number(pillId); 
                requestContent["dose"] = Number(dose);  
                requestContent["takenOn"] = localISOTime; 
     
                var response = await userService.recordMedication(requestContent, global.userViewModel.userAccessTokenType, global.userViewModel.userAccessToken);      
    
                if(userService.checkTokenValidity(response.statusCode)) {
                    if(response.statusCode == 200) {
                        return true; 
                    } else {
                        return false; 
                    } 
                } else {
                    return null; 
                }; 
        }
    });

    return viewModel;
}

module.exports = DrugConfigViewModel;
