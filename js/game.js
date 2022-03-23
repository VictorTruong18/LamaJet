// All the objects that need to be accessible from everywhere
let lama;
let tickCounter = 0;
let birds = [];

// Initialization function triggered on the loading 
// of the page
window.onload = function () {
    app = new PIXI.Application(
        {
            width: window.innerWidth  > window.innerWidth / 2 ? window.innerHeight / 2 : window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0xAAAAA
        }
    );
    app.renderer.view.style.position = 'absolute';
    document.body.appendChild(app.view);

    document.querySelector("#container-canvas").appendChild(app.view);
    app.stage.interactive = true;
    document.querySelector("#container-canvas").addEventListener("pointerdown", clickHandler);

    app.loader.add("character", "images/lama_sprite.png");
    app.loader.add("enemy","images/bird-sprite.png");
    // Loading of the app
    // Triggers the function doneLoading at finish
    app.loader.load(doneLoading);

    // Create the Lama Object 
    lama = new Lama({ app });

    app.ticker.add(gameLoop);

    const container = new PIXI.Container();
    app.stage.addChild(container);
}

function clickHandler() {
    lama.lift();
}


// Starts the gameLoop
function doneLoading() {
    app.ticker.add(gameLoop);
}


function isColliding(a, b) {
    let aBox = a.bounds();
    let bBox = b.bounds();

    return aBox.x + aBox.width > bBox.x &&
        aBox.x < bBox.x + bBox.width &&
        aBox.y + aBox.height > bBox.y &&
        aBox.y < bBox.y + bBox.height;
}

function gameLoop() {
    app.width = window.innerWidth;
    app.height = window.innerHeight;
    app.renderer.resize(window.innerWidth, window.innerHeight);

    lama.update();
    for(let i =0; i < birds.length; i++){
        birds[i].update();

    }
    
    tickCounter++;

    if(tickCounter % 100 == 0){
        let bird = new Bird({app});
        birds.push(bird);
    } 
}