import { Dir } from 'fs';
import init, { find_onerm, InitOutput, Tetris, Cell, Direction } from '../pkg/one_rm_calc.js'

// 500 -> 501 THOR + EDDIE 


function initCalculateButton(wasm: InitOutput) {
    let buttonElem = document.getElementById('calculateButton') as HTMLButtonElement;
    let repsInputElem = document.getElementById('repsInput') as HTMLInputElement;
    let weightInputElem = document.getElementById('weightInput') as HTMLInputElement;
    let resultElem = document.getElementById('result') as HTMLParagraphElement;

    let gruntCounter = 0;

    buttonElem.addEventListener('click', function() {
        // clearScreen();
        let reps = parseInt(repsInputElem.value);
        let weight = parseFloat(weightInputElem.value);
        var resultStr = "";

        // Check that the inputs are actually numbers
        if (!Number.isNaN(reps) && !Number.isNaN(weight)) {
            // Some initial checks of the input values...
            if (reps === 127 && weight === 202) {
                resultStr = "You Spineless Tagless G-machine";
            } else if (reps === 0) {
                playVideo("../assets/videos/zero.mp4");
                return;
            } else if (true) {
                resultStr = "Now why would you ask me to approximate your one rep max based on data indicating the performance of your type I muscle fibers? Do you know how cursed approximating that would be? One rep maxes use FAST TWITCH fibers (type II) predominantly. What good is your " + reps + " reps to me? Read a book. Try again with less than 12 reps";
            }
            if (resultStr !== "") {
                resultElem.innerHTML = resultStr;
                return;
            }
            // Calculate the one RM 
            let one_rm = find_onerm(reps, weight);
            // Output based on one RM calculation
            if (one_rm === undefined) {
                resultStr = "What the heck did you give me??";
            } else if (Math.abs(one_rm - 30.0) < 0.001) {
                resultStr = "But just give me a few, okay. Now, just have to groan into your camera. Your camera. I feel like i can feel the odor in that one. All right, so if you got this, you guys Okay. Oh my god. Some all right. All right together. All right." 
            } else if (one_rm > 140) {
                resultStr = "You're pretty big bro.... ORM: " + one_rm.toFixed(2);

                let imageElem = document.getElementById("image") as HTMLImageElement;
                imageElem.src = "../assets/images/un_hombre_musculoso.jpg";
                imageElem.width /= 2;
                imageElem.style.display = 'block';

                gruntCounter++;
                let audioElem = document.getElementById("audio") as HTMLAudioElement;
                if (gruntCounter % 4 == 0) {
                    audioElem.src = "../assets/audio/tom_grunt.wav";
                } else {
                    audioElem.src = "../assets/audio/mitch_grunt.wav";
                }
                audioElem.play();
            } else {
                resultStr = one_rm.toFixed(2);
            }
            // Set result value and exit
            resultElem.innerHTML = resultStr;
            return;
        } else {
            // We were given some non-number input
            if (repsInputElem.value === "tetris") {
                playTetris(wasm);
            }
        }

        // Else 

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

        
    
        resultElem.innerHTML = resultStr;
    });
}

function init_elements(wasm: InitOutput) {
    initCalculateButton(wasm);
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function playTetris(wasm: InitOutput) {
    console.log("Initting tetris");
    const CELL_SIZE = 30; // px
    const GRID_COLOR = "#CCCCCC";
    const DEAD_COLOR = "#FFFFFF";
    const ALIVE_COLOR = "#000000";
    const width = 10;
    const height = 20;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.height = (CELL_SIZE + 1) * height + 1;
    canvas.width = (CELL_SIZE + 1) * width + 1;
    let tetris = Tetris.new(width, height + 4);


    function getIndex(row: number, col: number): number {
        return row * width + col;
    }

    function handleKeyPress(event: KeyboardEvent) {
        switch (event.key) {
            case "ArrowLeft":
                tetris.handle_move(Direction.Left);
                break;
            case "ArrowRight":
                tetris.handle_move(Direction.Right);
                break;
            case "ArrowDown":
                tetris.handle_move(Direction.Down);
                break;
        }
        drawGrid(ctx);
        drawCells(wasm);
    }

    async function renderLoop() {
        drawGrid(ctx);
        drawCells(wasm);
        tetris.handle_move(Direction.Down);
        await sleep(200);
        renderLoop();
    }

    const drawGrid = (ctx: CanvasRenderingContext2D) => {
        ctx.beginPath();
        ctx.strokeStyle = GRID_COLOR;
      
        // Vertical lines.
        for (let i = 0; i <= width; i++) {
          ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
          ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
        }
      
        // Horizontal lines.
        for (let j = 0; j <= height; j++) {
          ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
          ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
        }
      
        ctx.stroke();
      };

    const drawCells = (wasm: InitOutput) => {
        const cellsPtr = tetris.grid();
        const cells = new Uint8Array(wasm.memory.buffer, cellsPtr, width * height);

        ctx.beginPath();

        // Alive cells.
        ctx.fillStyle = ALIVE_COLOR;
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                const idx = getIndex(row, col);
                if (cells[idx] !== Cell.Taken) {
                    continue;
                }

                ctx.fillRect(
                    col * (CELL_SIZE + 1) + 1,
                    row * (CELL_SIZE + 1) + 1,
                    CELL_SIZE,
                    CELL_SIZE
                );
            }
        }

        // Dead cells.
        ctx.fillStyle = DEAD_COLOR;
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                const idx = getIndex(row, col);
                if (cells[idx] !== Cell.Free) {
                    continue;
                }

                ctx.fillRect(
                    col * (CELL_SIZE + 1) + 1,
                    row * (CELL_SIZE + 1) + 1,
                    CELL_SIZE,
                    CELL_SIZE
                );
            }
        }
        ctx.stroke();
    }
    document.addEventListener("keydown", handleKeyPress);

    renderLoop();
}

function playVideo(path: string) {
    var videoElement = document.getElementById('video') as HTMLVideoElement;

    videoElement.src = path;
    videoElement.style.display = 'block';
    
    // Play the video
    videoElement.play();

    // Wait for metadata to be loaded
    var metadataLoaded = new Promise<void>(function(resolve) {
        if (videoElement.readyState >= 2) {
            resolve();
        } else {
            videoElement.addEventListener('loadedmetadata', function() {
                resolve();
            });
        }
    });

    metadataLoaded.then(function() {
        // Pause and hide the video after its duration
        setTimeout(function() {
            videoElement.pause();
            videoElement.style.display = 'none';
        }, videoElement.duration * 1000); // Convert duration from seconds to milliseconds
    });
}

async function run() {
    let wasm = await init();

    init_elements(wasm);
}

run();