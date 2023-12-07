import init, { find_onerm } from './pkg/one_rm_calc.js'

let wasm = await init();

document.getElementById('calculateButton').addEventListener('click', function() {
    let reps = parseInt(document.getElementById('repsInput').value) || 0;
    let weight = parseFloat(document.getElementById('weightInput').value) || 0;

    // Handle the case where the reps are outside of an acceptable range
    // Reps too low
    if (reps == 0) {

    }

    let one_rm = find_onerm(reps, weight);

    document.getElementById('result').innerHTML = "Result: " + one_rm.toFixed(2);
});