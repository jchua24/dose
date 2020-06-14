const app = require("tns-core-modules/application");
const DiaryViewModel = require("./diary-view-model");
const { Frame } = require("tns-core-modules/ui/frame");

var page; 
var vm; 

function onNavigatingTo(args) {
    page = args.object;

    if(global.diaryViewModel == null) {
        global.diaryViewModel = new DiaryViewModel();
        page.bindingContext = global.diaryViewModel;
        vm = page.bindingContext; 
    } else {
        page.bindingContext = global.diaryViewModel; 
        vm = page.bindingContext; 
    }
    
    getDiaryInfo(vm.currentlySelectedDate);
}

function goPrevDate(args) {
    //select history from previous day 
    var currentDay = vm.currentlySelectedDate; 
    var previousDay = new Date(currentDay);

    previousDay.setDate(previousDay.getDate() - 1);
    vm.currentlySelectedDate = previousDay; 

    getDiaryInfo(vm.currentlySelectedDate); 
}

function goNextDate(args) {
    //select history from next day 
    var currentDay = vm.currentlySelectedDate; 
    var nextDay = new Date(currentDay);

    nextDay.setDate(nextDay.getDate() + 1);
    vm.currentlySelectedDate = nextDay; 
   
    getDiaryInfo(vm.currentlySelectedDate); 
}

function onDatePickerClosed(args) {
    getDiaryInfo(vm.currentlySelectedDate); 
}

function getDiaryInfo(chosenDate) {

    if (sameDay(chosenDate)) {
        vm.currentDayChosen = true;
    } else {
        vm.currentDayChosen = false; 
    }
    
    vm.getDailyLimit(vm.currentlySelectedDate).then(function(result) {
        if(result) {
            setProgressBar(vm.dailyCurrent, vm.dailyMaximum); 
        } 
    })

    vm.getRecentlyTaken(vm.currentlySelectedDate);
}

function setProgressBar(current, maximum) {

    console.log("CURR/MAX IS: " + current / maximum); 
    
    if(current != -1) {
        if(current / maximum < 0.75) {
            vm.progressBackgroundColor = "#2BBB9C"; 
        } else if (current / maximum < 0.9) {
            vm.progressBackgroundColor = "yellow";
        } else {
            vm.progressBackgroundColor = "red"; 
        } 
    
        if (current / maximum > 1.0) {
            vm.warningMessage = "Warning: You have exceeded your daily quota by " + Math.abs(maximum - current) + " ME."
        } else {
            vm.warningMessage = ""; 
        }
    } else {
        vm.warningMessage = "Warning: Cannot compute morphine equivalent! One of the drugs you have taken requires medical advice.";
        vm.dailyCurrent = vm.dailyMaximum; 
        current = vm.dailyCurrent;
        vm.progressBackgroundColor = "red"; 
    }
   
    var remaining = maximum - current; 
    vm.progressColumns = current + "*, " + remaining + "*";
} 

function sameDay (date) {

    var firstDate = new Date(date); 
    var secondDate = new Date(); 

    return firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate();
}

function toAvailableDrugs(args) {

    Frame.topmost().navigate({
        moduleName: "diary/available-drugs/available-drugs-page", 
        context: {selectedDate : vm.currentlySelectedDate, selectedTime: vm.currentlySelectedTime,
            progressColumns: vm.progressColumns, dailyCurrent: vm.dailyCurrent, dailyMaximum: vm.dailyMaximum}, 
        transition: {
            name: "fade"
        }
    });
}

exports.onNavigatingTo = onNavigatingTo;
exports.goNextDate = goNextDate; 
exports.goPrevDate = goPrevDate; 
exports.getDiaryInfo = getDiaryInfo; 
exports.onDatePickerClosed = onDatePickerClosed; 
exports.toAvailableDrugs = toAvailableDrugs; 

//formatting functions
//exports.getFormattedDate = getFormattedDate;
exports.sameDay = sameDay; 

