// All the objects that need to be accessible from everywhere
let lama;
let tickCounter = 0;
let birds = [];
let bgBack;
let bgMiddle;
let bgFront;
let bgGround;
let bgX = 0;
let bgSpeed = -1;
let scoreText;
let scoreGoalText;
let score = 0;
let caps = [];
let flyingCaps = [];
let appWidth;
let appHeight;
let hatCounter;

// Initialization function triggered on the loading 
// of the page
window.onload = function () {
    app = new PIXI.Application(
        {
            width: window.innerWidth,
            height: window.innerHeight,
            resizeTo: window,
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
    app.loader.add("cap_flying_pink", "flying_cap_pink.png")
    app.loader.add("cap_flying_red", "cap_flying_red.png")
    app.loader.add("cap_flying_green", "cap_flying_green.png")

    app.loader.add("cap_wearable_pink", "cap_wearable_pink.png")
    app.loader.add("cap_wearable_green", "cap_wearable_green.png")
    app.loader.add("cap_wearable_red", "cap_wearable_red.png")
    app.loader.add("character", "lama_sprite.png");
    app.loader.add("enemy", "bird-sprite.png");
    app.loader.add("bgBack", "sky.png");
    app.loader.add("bgMiddle", "clouds.png");
    app.loader.add("bgFront", "rocks.png");
    app.loader.add("bgGround", "ground.png");
    app.loader.add("hat_counter", "hatCounter.png")


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

    bgFront = new PIXI.TilingSprite(app.loader.resources["bgFront"].texture, window.innerWidth, window.innerHeight);
    bgFront.position.set(0, window.innerHeight * 0.003);
    app.stage.addChild(bgFront);


    // Create the Lama Object 
    lama = new Lama({ app });
    hatCounter = new PIXI.Sprite.from(app.loader.resources['hat_counter'].url);
    hatCounter.x = (window.innerWidth - hatCounter.width) / 2;
    hatCounter.y = 0;
    app.stage.addChild(hatCounter);


    scoreText = new PIXI.Text(score, { fontFamily: 'Berlin Sans FB', fontSize: 24, align: 'center' });
    scoreText.x = (window.innerWidth / 2) - 32;
    scoreText.y = 28;
    app.stage.addChild(scoreText);


    scoreGoalText = new PIXI.Text('15', { fontFamily: 'Berlin Sans FB', fontSize: 24, align: 'center' });
    scoreGoalText.x = (window.innerWidth / 2) - 5;
    scoreGoalText.y = 28;
    app.stage.addChild(scoreGoalText);
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

function resizeScreen() {
    if (appWidth != window.innerWidth || appHeight != window.innerHeight) {
        lama.resize();
        appWidth = window.innerWidth;
        appHeight = window.innerHeight;
        app.renderer.resize(window.innerWidth, window.innerHeight);
        bgBack.width = window.innerWidth;
        bgBack.height = window.innerHeight;
        bgMiddle.width = window.innerWidth;
        bgMiddle.height = window.innerHeight;
        bgFront.width = window.innerWidth;
        bgFront.height = window.innerHeight;
        birdOrginX = window.innerWidth;
        birdOrginY = window.innerHeight;
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
                score -= 1;
                scoreText.text = score;
            }
        }
    }

    for (let i = 0; i < flyingCaps.length; i++) {
        flyingCaps[i].update();
        if (isColliding(flyingCaps[i], lama)) {
            if (!flyingCaps[i].flyingCap.hasCollided) {
                flyingCaps[i].flyingCap.hasCollided = true;
                flyingCaps[i].flyingCap.x = null;
                flyingCaps[i].flyingCap.y = null;
                score += 1;
                scoreText.text = score;
                let cap = new CapWearable(app, lama.lama.x, lama.lama.y, flyingCaps[i].flyingCap.color);
                caps.push(cap);
            }
        }
    }
    if (tickCounter % 150 == 0) {
        let flyingCap = new CapFlying({ app });
        flyingCaps.push(flyingCap);
    }

    tickCounter++;

    if (tickCounter % 100 == 0) {
        let bird = new Bird({ app });
        birds.push(bird);

    }
}

function createBg(texture) {
    let tilling = new PIXI.TilingSprite(texture, app.view.width, app.view.height);

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