const observableModule = require("tns-core-modules/data/observable");
const dialogsModule = require("tns-core-modules/ui/dialogs");
const { Frame } = require("tns-core-modules/ui/frame");

const appSettings = require("tns-core-modules/application-settings");

const userService = require("~/services/user-service"); 

function LoginViewModel() {
    const viewModel = observableModule.fromObject({
        email: "jsmith@medsoftgroup.com",
        password: "abcd1234",
        confirmPassword: "",
        isLoggingIn: true,
        processing: false,

        toggleForm() {
            dialogsModule.alert("User wants to sign-up! To be implemented later."); 
            //this.isLoggingIn = !this.isLoggingIn;
        },
        async submit() {
            //form validation
            if (this.email.trim() === "" || this.password.trim() === "") {
                alert("Please provide both an email address and password.");
                return false;
            } 
            this.set("processing", true);

            if (this.isLoggingIn) {
                
                var response = await userService.getLoginToken(this.email, this.password); 

                var responseContent = JSON.parse(response.content); 
            
                //check for errors in response 
                if ("error" in responseContent) {        
                    this.set("processing", false);
                    dialogsModule.alert(response.content.error_description); 
                    return false;
                } else if ("access_token" in responseContent){
                    //page navigation to homescreen 
                    this.set("processing", false);
                    
                    global.userViewModel.userAccessToken = responseContent.access_token; 
                    global.userViewModel.userAccessTokenType = responseContent.token_type; 

                    appSettings.setString("loginToken", responseContent.access_token); 
                    appSettings.setString("loginTokenType", responseContent.token_type); 
                    
                    return true; 
                }
            } else {
                return false; 
                //registration logic goes here
                //return this.register();
            }
        },
        async getUserInfo() {
            var response = await userService.getUserInfo(global.userViewModel.userAccessTokenType, global.userViewModel.userAccessToken); 

            //parse response content
            var responseContent = JSON.parse(response.content); 
            var name = responseContent.name.split(" "); 

            global.userViewModel.firstName = name[0]; 
            global.userViewModel.lastName = name[1];

            appSettings.setString("userFirstName", name[0]); 
            appSettings.setString("userLastName", name[1]); 

            return response;
        }, 
        register() {
            dialogsModule.alert("User wants to register! To be implemented later."); 

            // if (this.password != this.confirmPassword) {
            //     alert("Your passwords do not match.");
            //     return;
            // }
            // userService.register({
            //     email: this.email,
            //     password: this.password
            // }).then(() => {
            //     this.set("processing", false);
            //     alert("Your account was successfully created. You can now login.");
            //     this.isLoggingIn = true;
            // })
            //     .catch(() => {
            //         this.set("processing", false);
            //         alert("Unfortunately we were unable to create your account.");
            //     });
        },

        forgotPassword() {
            dialogsModule.alert("Forgot Password! To be implemented later."); 

            // dialogsModule.prompt({
            //     title: "Forgot Password",
            //     message: "Enter the email address you used to register for APP NAME to reset your password.",
            //     inputType: "email",
            //     defaultText: "",
            //     okButtonText: "Ok",
            //     cancelButtonText: "Cancel"
            // }).then((data) => {
            //     if (data.result) {
            //         userService.resetPassword(data.text.trim())
            //             .then(() => {
            //                 alert("Your password was successfully reset. Please check your email for instructions on choosing a new password.");
            //             }).catch(() => {
            //                 alert("Unfortunately, an error occurred resetting your password.");
            //             });
            //     }
            // });
        }
    });

    return viewModel;
}

module.exports = LoginViewModel;




