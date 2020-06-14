const app = require("tns-core-modules/application");
const DrugConfigViewModel = require("./drug-config-view-model");
const { Frame } = require("tns-core-modules/ui/frame");
const dialogsModule = require("tns-core-modules/ui/dialogs");

var page; 
var vm; 

function onNavigatingTo(args) {
    page = args.object;
    page.bindingContext = new DrugConfigViewModel();
    vm = page.bindingContext; 
    
    var navData = page.navigationContext; 
    vm.progressColumns = navData.progressColumns; 
    vm.selectedDrug = navData.selectedDrug; 
    vm.selectedDate = navData.selectedDate;  
    vm.selectedTime = navData.selectedTime;   
    vm.dailyCurrent = navData.dailyCurrent;
    vm.dailyMaximum = navData.dailyMaximum;
    vm.readyToRecord = false;

    setProgressBarColor(vm.dailyCurrent, 0, vm.dailyMaximum); 
    getDrugStrengthOptions(navData.selectedDrug.drugId);   
}

function getDrugStrengthOptions(drugId) {
    vm.getDrugStrengthOptions(drugId);
}

function strengthChosen(args) {
    var selectedStrength = args.object;

    vm.selectedStrengthValue = selectedStrength.value;
    vm.selectedStrengthType = selectedStrength.type;
    vm.selectedPillId = selectedStrength.pillId; 

    var strengthListView = page.getViewById("strengthList");

    for(var i = 0; i < strengthListView.items.length; i++) {
        console.log(strengthListView.items[i]);
        var strengthButton = page.getViewById('strength' + i); 
        strengthButton.className = 'btn-black strength-button';
    }

    selectedStrength.className = "btn-blue-filled"; 

    updateProgressBar(); 
}

function doseChosen(args) {
    var selectedDose = args.object;
    vm.selectedDose = selectedDose.val;

    for(var i = 1; i < 9; i++) {
        var doseButton = page.getViewById('dose' + i); 
        doseButton.className = 'btn-black strength-button';
        var otherButton = page.getViewById('doseOther'); 
        otherButton.className = 'btn-black strength-button';
    } 

    selectedDose.className = "btn-blue-filled"; 

    updateProgressBar(); 
}

function doseTextInput(args) {
    var otherButton = args.object; 

    dialogsModule.prompt({
        title: 'Enter Custom Dosage Amount',
        message: 'Whole or have number increments only!', 
        okButtonText: 'Confirm',
        cancelButtonText: 'Cancel', 
        inputType: dialogsModule.inputType.decimal
    }).then(function(userInput) {
        if(userInput.result) { //user input something 
            var inputNum = Number(userInput.text); 

            if(inputNum % 0.5 == 0) {
                dialogsModule.alert('Dosage of ' + inputNum + ' selected.'); 
                vm.selectedDose = inputNum; 

                otherButton.className = "btn-blue-filled"; 

                for(var i = 1; i < 9; i++) {
                    var doseButton = page.getViewById('dose' + i); 
                    doseButton.className = 'btn-black strength-button';
                } 

                updateProgressBar();

            } else {
                dialogsModule.alert('Please enter a valid dosage amount!'); 
            }
        }
        
    })
}

function updateProgressBar(args) {
    if(vm.selectedStrengthValue != null && vm.selectedDose != null) {
    
        vm.getMorphineEquivalent(vm.selectedPillId, vm.selectedDose).then(function(result) {
            if(result) {
                setProgressBar(vm.morphineEquivalent, vm.dailyCurrent, vm.dailyMaximum); 

                vm.readyToRecord = true; 
            }
        })
    }
}

function setProgressBar(morphineEquivalent, current, maximum) {
    
    var newVal = current + morphineEquivalent; 
    var remaining = maximum - newVal; 
    
    setProgressBarColor(current, morphineEquivalent, maximum); 

    if(morphineEquivalent == 0 || morphineEquivalent == null) {
        vm.warningMessage = "Warning: the selected medication requires medical advice, unable to compute morphine equivalent."; 
        vm.progressBackgroundColor = "red"; 
    }

    vm.progressColumns = newVal + "*, " + remaining + "*";
} 

function setProgressBarColor(current, me, maximum) {
    
    var newVal = current + me; 

    if(current != -1) {
        if(newVal / maximum < 0.75) {
            vm.progressBackgroundColor = "#2BBB9C"; 
        } else if (newVal / maximum < 0.9) {
            vm.progressBackgroundColor = "yellow";
        } else {
            vm.progressBackgroundColor = "red"; 
        } 
    
        if (newVal / maximum > 1.0) {
            vm.warningMessage = "Warning: By adding this medication, you will exceed your daily quota by " + Math.abs(maximum - (current + me)) + " ME."
        } else {
            vm.warningMessage = ""; 
        }
    } else {
        vm.warningMessage = "Warning: Cannot compute morphine equivalent! One of the drugs you have taken requires medical advice.";
        vm.progressBackgroundColor = "red"; 
    }
}


function recordMedication(args) {

    if(vm.selectedPillId != null && vm.selectedDose != null) {
        vm.recordMedication(vm.selectedPillId, vm.selectedDose, vm.selectedDate, vm.selectedTime).then(function(result) {      
            
            console.log("RESULT IS: " + result); 

            if(result != null) {
                if(result && vm.morphineEquivalent != 0) {
                    dialogsModule.alert({
                        title: "Medication Recorded",
                        message: vm.selectedDose + " pills - " + vm.selectedDrug.drugName + " " + vm.selectedStrengthValue + vm.selectedStrengthType,
                        okButtonText: "Ok" 
                    }).then(function() { 
                        Frame.topmost().navigate({
                            moduleName: "diary/diary-page",
                            clearHistory: true, 
                            transition: {
                                name: "fade"
                            }
                        });
                    });
                } else if (result) {
                    dialogsModule.alert({
                        title: "Medication Recorded",
                        message: vm.selectedDose + " pills - " + vm.selectedDrug.drugName + " " + vm.selectedStrengthValue + vm.selectedStrengthType + 
                        "\n (Note: this medication does not have a morphine equivalent)",
                        okButtonText: "Ok" 
                    }).then(function() {   
                        Frame.topmost().navigate({
                            moduleName: "diary/diary-page",
                            clearHistory: true, 
                            transition: {
                                name: "fade"
                            }
                        });
                    });
                } else {
                    dialogsModule.alert({
                        title: "Error",
                        message: "Drug dosage could not be recorded, please try again.",
                        okButtonText: "Ok" 
                    });
                }
            }
        })
    }    
}

exports.onNavigatingTo = onNavigatingTo;
exports.getDrugStrengthOptions = getDrugStrengthOptions; 
exports.strengthChosen = strengthChosen; 
exports.doseChosen = doseChosen; 
exports.doseTextInput = doseTextInput;
exports.updateProgressBar = updateProgressBar; 
exports.setProgressBar = setProgressBar; 
exports.setProgressBarColor = setProgressBarColor; 
exports.recordMedication = recordMedication;




