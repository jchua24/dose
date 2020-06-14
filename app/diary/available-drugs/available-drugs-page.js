const app = require("tns-core-modules/application");
const AvailableDrugsViewModel = require("./available-drugs-view-model");
const { Frame } = require("tns-core-modules/ui/frame");

var page; 

function onNavigatingTo(args) {

    page = args.object;
    page.bindingContext = new AvailableDrugsViewModel();

    var navData = page.navigationContext; 
    page.bindingContext.selectedDate = navData.selectedDate;  
    page.bindingContext.selectedTime = navData.selectedTime;   
    page.bindingContext.progressColumns = navData.progressColumns; 
    page.bindingContext.dailyCurrent = navData.dailyCurrent; 
    page.bindingContext.dailyMaximum = navData.dailyMaximum; 

    page.bindingContext.getAvailableDrugs(); 
}

function onItemTap(args) {
    var itemIndex = args.index;
    var selectedDrug = page.bindingContext.drugList[itemIndex]; 

    Frame.topmost().navigate({
        moduleName: "diary/drug-config/drug-config", 
        context: {selectedDrug : selectedDrug, selectedDate: page.bindingContext.selectedDate, selectedTime: page.bindingContext.selectedTime,
        progressColumns : page.bindingContext.progressColumns, dailyCurrent: page.bindingContext.dailyCurrent, dailyMaximum: page.bindingContext.dailyMaximum}, 
        transition: {
            name: "fade"
        }
    });

}

exports.onNavigatingTo = onNavigatingTo;
exports.onItemTap = onItemTap; 

