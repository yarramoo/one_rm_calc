"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const one_rm_calc_js_1 = __importStar(require("./pkg/one_rm_calc.js"));
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
        let one_rm = (0, one_rm_calc_js_1.find_onerm)(reps, weight);
        if (one_rm === undefined) {
            resultStr = "What the heck did you give me??";
        }
        resultElem.innerHTML = resultStr;
    });
}
function init_elements() {
    initCalculateButton();
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let wasm = yield (0, one_rm_calc_js_1.default)();
        init_elements();
    });
}
run();
