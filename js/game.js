// All the objects that need to be accessible from everywhere
let lama;
let tickCounter = 0;
let birds = [];
let bgBack;
let bgMiddle;
let bgFront;
let bgX = 0;
let bgSpeed = -1;
let basicText;
let score = 0;
let caps = [];

let appWidth;
let appHeight;

// Initialization function triggered on the loading 
// of the page
window.onload = function () {
    app = new PIXI.Application(
        {
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0xAAAAA
        }
    );
    appWidth = window.innerWidth;
    appHeight = window.innerHeight;
    app.renderer.view.style.position = 'absolute';
    document.body.appendChild(app.view);

    document.querySelector("#container-canvas").appendChild(app.view);
    app.stage.interactive = true;
    document.querySelector("#container-canvas").addEventListener("pointerdown", clickHandler);

    app.loader.baseUrl = "images";
    app.loader.add("character", "lama_sprite.png");
    app.loader.add("enemy", "bird-sprite.png");
    app.loader.add("bgBack", "sky.png");
    app.loader.add("bgMiddle", "clouds.png");
    app.loader.add("bgFront", "rocks.png");


    // Loading of the app
    // Triggers the function doneLoading at finish
    app.loader.load(doneLoading);

    
    app.ticker.add(gameLoop);

    const container = new PIXI.Container();
    app.stage.addChild(container);
}

function clickHandler() {
    lama.lift();
}


// Starts the gameLoop
function doneLoading() {
    bgBack = createBg(app.loader.resources["bgBack"].texture);
    bgMiddle = createBg(app.loader.resources["bgMiddle"].texture);
    bgFront = createBg(app.loader.resources["bgFront"].texture);

    // Create the Lama Object 
    lama = new Lama({ app });
    for(var i=0; i < 15; i++){
        let cap = new CapWearable(app, lama.lama.x, lama.lama.y);
        caps.push(cap);
    }
    basicText = new PIXI.Text(score);
    basicText.x = window.innerWidth / 2;
    basicText.y = window.innerHeight * 0.10;
    app.stage.addChild(basicText);
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

function resizeScreen(){
    if(appWidth != window.innerWidth || appHeight != window.innerHeight  ){
       lama.resize();
       appWidth = window.innerWidth;
       appHeight = window.innerHeight;
       app.renderer.resize(window.innerWidth, window.innerHeight);
    }
}

function gameLoop() {
    app.width = window.innerWidth;
    app.height = window.innerHeight;
    app.renderer.resize(window.innerWidth, window.innerHeight);

    updateBackground();

    resizeScreen();

    lama.update();

    

    for (let i = 0; i < birds.length; i++) {
        birds[i].update();
        if (isColliding(birds[i], lama)) {
            if (!birds[i].bird.hasCollided) {
                birds[i].bird.hasCollided = true;
                lama.lama.lift += .1;
                score += 1;
                basicText.text = score;
            }
        }
    }

    tickCounter++;

    if (tickCounter % 100 == 0) {
        let bird = new Bird({ app });
        birds.push(bird);
    }
}

function createBg(texture) {
    let tilling = new PIXI.TilingSprite(texture, window.innerWidth, window.innerHeight);
    
    tilling.position.set(0, 0);
    app.stage.addChild(tilling);

    return tilling;
}

function updateBackground() {
    bgX = (bgX + bgSpeed);
    bgFront.tilePosition.x = bgX;
    bgMiddle.tilePosition.x = bgX / 2;
    bgBack.tilePosition.x = bgX / 4;
}