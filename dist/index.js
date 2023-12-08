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
// 500 -> 501 THOR + EDDIE 
function initCalculateButton() {
    let buttonElem = document.getElementById('calculateButton');
    let repsInputElem = document.getElementById('repsInput');
    let weightInputElem = document.getElementById('weightInput');
    let resultElem = document.getElementById('result');
    buttonElem.addEventListener('click', function () {
        // clearScreen();
        let reps = parseInt(repsInputElem.value);
        let weight = parseFloat(weightInputElem.value);
        var resultStr = "";
        // Check that the values inputted parsed correctly
        if (Number.isNaN(reps) && Number.isNaN(weight)) {
            resultStr = "Wtf have you given me??";
        }
        else if (Number.isNaN(reps)) {
            resultStr = "You've done a wild number of reps. For real, that \"number\" is wild. I don't believe that is a number";
        }
        else if (Number.isNaN(weight)) {
            resultStr = "Unearthly weight my dude. Certainly unparsable. Try again.";
        }
        else if (reps === 127 && weight === 202) {
            resultStr = "You Spineless Tagless G-machine";
        }
        if (resultStr != "") {
            resultElem.innerHTML = resultStr;
            return;
        }
        // Check that the number of reps is sensible
        if (reps === 0) {
            playVideo("../assets/videos/zero.mp4");
            return;
        }
        // Calculate the one RM 
        let one_rm = find_onerm(reps, weight);
        if (one_rm === undefined) {
            resultStr = "What the heck did you give me??";
        }
        else if (Math.abs(one_rm - 30.0) < 0.001) {
            resultStr = "But just give me a few, okay. Now, just have to groan into your camera. Your camera. I feel like i can feel the odor in that one. All right, so if you got this, you guys Okay. Oh my god. Some all right. All right together. All right.";
        }
        else if (one_rm > 200) {
            resultStr = "You're pretty big bro.... ORM: " + one_rm;
            let imageElem = document.getElementById("image");
            imageElem.src = "../assets/images/un_hombre_musculoso.jpg";
        }
        else {
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
function playVideo(path) {
    var videoElement = document.getElementById('video');
    videoElement.src = path;
    videoElement.style.display = 'block';
    // Play the video
    videoElement.play();
    // Wait for metadata to be loaded
    var metadataLoaded = new Promise(function (resolve) {
        if (videoElement.readyState >= 2) {
            resolve();
        }
        else {
            videoElement.addEventListener('loadedmetadata', function () {
                resolve();
            });
        }
    });
    metadataLoaded.then(function () {
        // Pause and hide the video after its duration
        setTimeout(function () {
            videoElement.pause();
            videoElement.style.display = 'none';
        }, videoElement.duration * 1000); // Convert duration from seconds to milliseconds
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let wasm = yield init();
        init_elements();
    });
}
run();
