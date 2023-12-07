import init, { find_onerm } from '../pkg/one_rm_calc.js'

function initCalculateButton() {
    let buttonElem = document.getElementById('calculateButton') as HTMLButtonElement;
    let repsInputElem = document.getElementById('repsInput') as HTMLInputElement;
    let weightInputElem = document.getElementById('wieghtInput') as HTMLInputElement;
    let resultElem = document.getElementById('result') as HTMLParagraphElement;

    buttonElem.addEventListener('click', function() {
        let reps = parseInt(repsInputElem.value);
        let weight = parseFloat(weightInputElem.value);
        var resultStr = "";
    
        // Do some error handling on the inputted values
        // Reps too low
        if (reps == 0) {
    
        }
    
        let one_rm = find_onerm(reps, weight);

        if (one_rm === undefined) {
            resultStr = "What the heck did you give me??";
        }
    
        resultElem.innerHTML = resultStr;
    });

    console.log("Initted button...");
}

function init_elements() {
    initCalculateButton();
}

async function run() {
    let wasm = await init();

    alert("HERE!");

    init_elements();
}

run();