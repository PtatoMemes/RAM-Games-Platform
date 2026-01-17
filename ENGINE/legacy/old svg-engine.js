// game path
const dataCurrentGame = "../GAMES/test-file";

// initial config settings for the engine
const dataGameSettings = {
    "width": "800",
    "height": "600",
    "framerate": "60",

    "fonts": [
        "30px Arial"
    ]
};

// variables
const dataRenderList = [];
const dataGlobalVariables = {};
const dataFlags = {};
var runtimeInterval;

const elemCanvas = document.getElementById("CANVAS");
const elemCtx = elemCanvas.getContext("2d");


// classes/object constructors?
// generic parent class
class gameObjectGeneric {
    constructor(id, visible) {
        this.id = id;
        this.children = [];
        this.visible = visible;
    };

    // draw function to be filled in by extended classes
    // called every game loop to define how the object should be drawn on the canvas
    draw() { return };
};

// screen image or background
class gameScreen extends gameObjectGeneric {
    constructor(id, background) {
        super(id, true);
        this.background = new Image();
        this.background.src = `${dataCurrentGame}/${background}`;
    };

    // draw itself and then call draw on all children
    draw() {
        if (!this.visible) return;

        elemCtx.drawImage(this.background, 0, 0);
        this.children.forEach((newChild) => { newChild.draw() });
    };
};

// generic item with modify-able x/y positions
class gameItem extends gameObjectGeneric {
    constructor(id, posX, posY) {
        super(id, true);
        this.posX = posX;
        this.posY = posY;
    };
};

// image item
class gameItemImage extends gameItem {
    constructor(id, background, posX, posY) {
        super(id, posX, posY);
        this.background = new Image();
        this.background.src = `${dataCurrentGame}/${background}`;
    };

    // draws itself at the given position
    draw() {
        if (!this.visible) return;
        elemCtx.drawImage(this.background, this.posX, this.posY);
    };
};

// text item
class gameItemText extends gameItem {
    constructor(id, text, posX, posY) {
        super(id, posX, posY);
        this.text = text;
        this.color = "white";
    };

    // draws text at the given position
    draw() {
        if (!this.visible) return;
        
        elemCtx.fillStyle = this.color;
        elemCtx.font = dataGameSettings["fonts"][0];
        elemCtx.fillText(this.text, this.posX, this.posY);
    };
};


// functions
// render scene
function dataGameRender() {
    elemCtx.fillStyle = "black";
    elemCtx.fillRect(0,0, dataGameSettings["width"], dataGameSettings["height"]);

    dataRenderList.forEach((newObject) => {
        newObject.draw();
    });
};

// init
async function init() {
    // json request
    const request = new Request(`${dataCurrentGame}/config.json`);
    const response = await fetch(request);
    const dataConfig = await response.json();

    // changing to modified entries in the config file
    for (let i=0;i<Object.keys(dataConfig).length;i++) {
        setKey = Object.keys(dataConfig)[i]; 
        dataGameSettings[setKey] = dataConfig[setKey];
    };

    // canvas setup
    elemCanvas.width = `${dataGameSettings["width"]}`;
    elemCanvas.height = `${dataGameSettings["height"]}`;
    // elemCanvas.style = `width: ${dataGameSettings["width"]}px; height: ${dataGameSettings["height"]}px`;
    runtimeInterval = setInterval(() => {dataGameRender()}, 1000 / dataGameSettings["framerate"]);

    // startup script
    scriptStartup = document.createElement("script");
    scriptStartup.src = `${dataCurrentGame}/startup.js`;
    document.body.appendChild(scriptStartup);
};
init();




