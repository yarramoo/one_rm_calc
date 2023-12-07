import init, { find_onerm } from '../pkg/one_rm_calc.js'

function initCalculateButton() {
    let buttonElem = document.getElementById('calculateButton') as HTMLButtonElement;
    let repsInputElem = document.getElementById('repsInput') as HTMLInputElement;
    let weightInputElem = document.getElementById('weightInput') as HTMLInputElement;
    let resultElem = document.getElementById('result') as HTMLParagraphElement;

    buttonElem.addEventListener('click', function() {
        let reps = parseInt(repsInputElem.value);
        let weight = parseFloat(weightInputElem.value);
        var resultStr = "";

        // Check that the values inputted parsed correctly
        if (Number.isNaN(reps) && Number.isNaN(weight)) {
            resultStr = "Wtf have you given me??";
        } else if (Number.isNaN(reps)) {
            resultStr = "You've done a wild number of reps. For real, that \"number\" is wild. I don't believe that is a number";
        } else if (Number.isNaN(weight)) {
            resultStr = "Unearthly weight my dude. Certainly unparsable. Try again."
        }
        if (resultStr != "") {
            resultElem.innerHTML = resultStr;
            return;
        }
        // Calculate the one RM 
        let one_rm = find_onerm(reps, weight);
        
        if (one_rm === undefined) {
            resultStr = "What the heck did you give me??";
        }else {
            resultStr = one_rm.toFixed(2);
        }
    
        resultElem.innerHTML = resultStr;
        console.log("Updated button");
    });

    console.log("Initted button...");
}

function init_elements() {
    initCalculateButton();
}

async function run() {
    let wasm = await init();


    init_elements();
}

run();