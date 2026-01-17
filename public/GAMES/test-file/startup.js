// create the room with all its objects
// tweak the positions and styling for specific items
// append to the gamespace

// console.log(jsonToElement(dataReference.screens["main-menu"].graphics, dataReference.screens["main-menu"].data.structure.button1.children.highlight))

dataVarsGlobal.currentScreen = "main-menu";
const screenmainMenu = new gameScreen("main-menu");
screenmainMenu.appendScreen();

// screenmainMenu.children["highlight2"].style.top = "431px";