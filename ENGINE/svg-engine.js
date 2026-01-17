// current game and config file
var gameDirectory = "../GAMES/test-file";

// variables
var dataConfig = {};
var dataReference = {};
const elemGamespace = document.getElementById("GAMESPACE");
const dataVarsGlobal = {};
const dataFlags = {};


// engine functions
// function-functions
// converting data specified in the games reference.json into html elements
function jsonToElement(graphicsPath, newData) {
    var newElement = document.createElement(newData.element);
    newElement.style = newData.style;
    newElement.src = `${gameDirectory}/${graphicsPath.root}/${graphicsPath[newData.graphic]}`;

    if (newData.class) newData.class.forEach((newClass) => {
        newElement.classList.add(newClass);
    });

    if (newData.children) Object.keys(newData.children).forEach((newChildKey) => {
        newElement.appendChild(jsonToElement(graphicsPath, newData.children[newChildKey]));
    });
    
    return newElement;
};

// constructors
// game screen object; creates and organizes a scene from a given key in dataReference.screens (reference.json)
function gameScreen(givenScreen) {
    this.children = {};

    this.appendScreen = () => {
        Object.keys(this.children).forEach((newKey) => {
            if (newKey == "background") {
                elemGamespace.style.background = `url("${this.children.background}")`;
                return;
            };

            elemGamespace.appendChild(this.children[newKey]);
        });
    };

    this.removeScreen = () => {
        elemGamespace.style.background = "";
        elemGamespace.innerHTML = "";
    };


    // element construction
    dataPath = dataReference.screens[givenScreen].data.structure;

    Object.keys(dataPath).forEach((newKey) => {
        newElement = jsonToElement(dataReference.screens[givenScreen].graphics, dataPath[newKey]);
        this.children[newKey] = newElement;
    });

    this.children.background = `${gameDirectory}/${dataReference.screens[givenScreen].graphics.background}`;
};


// json data requester
async function requestJson(path) {
    const request = new Request(path);
    const response = await fetch(request);
    return await response.json();
};

// init
async function init() {
    // requests for config and reference files
    dataConfig = await requestJson("config.json");
    gameConfig = await requestJson(`${gameDirectory}/config.json`);
    dataReference = await requestJson(`${gameDirectory}/${gameConfig["reference"]}`);

    // setting up engine for startup
    configChanges = Object.keys(gameConfig);
    configChanges.forEach((modifiedKey) => {dataConfig[modifiedKey] = gameConfig[modifiedKey]});

    elemGamespace.style = `width: ${dataConfig["width"]}px; height: ${dataConfig["height"]}px;`

    newStylesheet = document.createElement('link');
    newStylesheet.rel = "stylesheet";
    newStylesheet.href = `${gameDirectory}/style.css`;
    startupScript = document.createElement('script');
    startupScript.src = `${gameDirectory}/startup.js`;

    document.head.appendChild(newStylesheet);
    document.body.appendChild(startupScript);
};
init();
