const observableModule = require("tns-core-modules/data/observable");

function UserViewModel() {
    const viewModel = observableModule.fromObject({
        firstName: "",
        lastName: "",  
        email: "",
        password: "",
        userAccessToken: "", 
        userAccessTokenType: "", 
    
    
        resetData() { //upon logging out, all data stored for the user is erased
            console.log("reset all user data!");
            this.firstName = ""; 
            this.lastName = "";
            this.email = ""; 
            this.password = ""; 
            this.userAccessToken = ""; 
            this.userAccessTokenType = ""; 
        }
    });

    return viewModel;
}

module.exports = UserViewModel;