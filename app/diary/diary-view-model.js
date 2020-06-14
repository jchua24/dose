const observableModule = require("tns-core-modules/data/observable");
const userService = require("~/services/user-service"); 
const SelectedPageService = require("../shared/selected-page-service");

function DiaryViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Diary");

    const viewModel = observableModule.fromObject({
        currentlySelectedDate: Date(Date.now()), 
        currentlySelectedTime: Date(Date.now()), 
        calendarMinDate: "2020/01/01",
        calendarMaxDate: new Date(Date.now()), 
        dailyCurrent: null, 
        dailyMaximum: null,
        currentDayChosen: true,
        recentlyTaken: [],
        progressColumns: "*, *", 
        progressBackgroundColor: "#2BBB9C", 
        warningMessage: "", 

        async getDailyLimit(date) {

            var formattedDate = this.getFormattedDate(new Date(date)); 
            console.log("inside recently taken: " + formattedDate);

            var response = await userService.getDailyLimit(formattedDate, global.userViewModel.userAccessTokenType, global.userViewModel.userAccessToken); 

            if(userService.checkTokenValidity(response.statusCode)) {
                if(response.statusCode == 200) {

                    var responseContent = JSON.parse(response.content); 

                    this.dailyCurrent = responseContent.current; 
                    this.dailyMaximum = responseContent.maximum; 
                    
                    return true; 
                } else {
                    return false; 
                } 
            } else {
                return null; 
            }; 

        }, 

        async getRecentlyTaken(date) {

            var formattedDate = this.getFormattedDate(new Date(date)); 

            var response = await userService.getRecentlyTaken(formattedDate, global.userViewModel.userAccessTokenType, global.userViewModel.userAccessToken); 

            if(userService.checkTokenValidity(response.statusCode)) {
                if(response.statusCode == 200) {
                    //parse response content
                    var responseContent = JSON.parse(response.content); 

                    if(Object.keys(responseContent).length === 0) {
                        console.log("RECENTLY TAKEN RESPONSE IS EMPTY"); 
                        this.recentlyTaken = []; 
                    } else {
                        responseContent.forEach(function(drugTaken) {
                            
                            var timeString = drugTaken.takenOn.split('T')[1];
                            var H = timeString.substr(0, 2);
                            var h = H % 12 || 12;
                            var ampm = (H < 12 || H === 24) ? "AM" : "PM";
                            timeString = h + timeString.substr(2, 3) + ampm;
                           
                            drugTaken.formattedTime = timeString;  
                        })

                        this.recentlyTaken = responseContent;
                    }
                    
                    return true; 
                } else {
                    return false; 
                } 
            } else {
                return null; 
            }; 

        }, 
        
        getFormattedDate(date) {
            const d = date.getDate();
            const m = date.getMonth() + 1;
            const y = date.getFullYear();
            return y + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d;
        }
    });

    return viewModel;
}

module.exports = DiaryViewModel;
