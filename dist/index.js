var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import init, { find_onerm } from '../pkg/one_rm_calc.js';
function initCalculateButton() {
    let buttonElem = document.getElementById('calculateButton');
    let repsInputElem = document.getElementById('repsInput');
    let weightInputElem = document.getElementById('wieghtInput');
    let resultElem = document.getElementById('result');
    buttonElem.addEventListener('click', function () {
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
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let wasm = yield init();
        alert("HERE!");
        init_elements();
    });
}
run();
