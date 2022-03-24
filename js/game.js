// All the objects that need to be accessible from everywhere
const SCORE_GOAL = 1;
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
let hasGameStarted = false;
let hasGameEnded = false;
let gameStartText;
let caps = [];
let flyingCaps = [];
let appWidth;
let appHeight;
let hatCounter;
let downloadButton;
let appIcon;
let appLogo;
let appCredits;

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
    app.loader.add("hat_counter", "hatCounter.png");
    app.loader.add("download", "download.png");
    app.loader.add("appIcon", "iconApp.png");
    app.loader.add("logo", "logo.png");


    // Loading of the app
    // Triggers the function doneLoading at finish
    app.loader.load(doneLoading);


    app.ticker.add(gameLoop);

    const container = new PIXI.Container();
    app.stage.addChild(container);
}

function clickHandler() {
    if (!hasGameStarted) {
        hasGameStarted = true;
        gameStartText.destroy();
        console.log('Game has started');
    }
    if (!hasGameEnded) {
        lama.lift();
    }
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

    // Game Starter
    gameStartText = new PIXI.Text("CLICK TO PLAY!", { fontFamily: 'Berlin Sans FB, sans-serif;', fontSize: 24, align: 'center' });
    gameStartText.x = (window.innerWidth - gameStartText.width) / 2
    gameStartText.y = window.innerHeight / 2;
    app.stage.addChild(gameStartText);

    // Score
    hatCounter = new PIXI.Sprite.from(app.loader.resources['hat_counter'].url);
    hatCounter.x = (window.innerWidth - hatCounter.width) / 2;
    hatCounter.y = 0;
    app.stage.addChild(hatCounter);

    scoreText = new PIXI.Text(score, { fontFamily: 'Berlin Sans FB', fontSize: 24, align: 'center' });
    scoreText.x = (window.innerWidth / 2) - 32;
    scoreText.y = 28;
    app.stage.addChild(scoreText);

    scoreGoalText = new PIXI.Text(SCORE_GOAL, { fontFamily: 'Berlin Sans FB', fontSize: 24, align: 'center' });
    scoreGoalText.x = (window.innerWidth / 2) - 5;
    scoreGoalText.y = 28;
    app.stage.addChild(scoreGoalText);

    // Download
    appIcon = new PIXI.Sprite.from(app.loader.resources['appIcon'].url);
    appIcon.width = 55;
    appIcon.height = 55;
    appIcon.x = (window.innerWidth - appIcon.width) / 2 - 130;
    appIcon.y = (window.innerHeight - appIcon.height) - 20;
    appIcon.interactive = true;
    appIcon.on('pointerdown', (event) => {
        window.open('https://en.wikipedia.org/wiki/Llama', '_blank');
    });
    app.stage.addChild(appIcon);

    downloadButton = new PIXI.Sprite.from(app.loader.resources['download'].url);
    downloadButton.width *= 0.3;
    downloadButton.height *= 0.3;
    downloadButton.x = (window.innerWidth - downloadButton.width) / 2 + 35;
    downloadButton.y = (window.innerHeight - downloadButton.height) - 20;
    downloadButton.interactive = true;
    downloadButton.on('pointerdown', (event) => {
        window.open('https://en.wikipedia.org/wiki/Llama', '_blank');
    });
    app.stage.addChild(downloadButton);


    app.ticker.add(gameLoop);
}


function isColliding(a, b) {
    if (!a || !b) { return false; }
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
        appIcon.x = (window.innerWidth - appIcon.width) / 2 - 130;
        appIcon.y = (window.innerHeight - appIcon.height) - 20;
        downloadButton.x = (window.innerWidth - downloadButton.width) / 2 + 35;
        downloadButton.y = (window.innerHeight - downloadButton.height) - 20;
        hatCounter.x = (window.innerWidth - hatCounter.width) / 2;
        scoreText.x = (window.innerWidth / 2) - 32;
        scoreGoalText.x = (window.innerWidth / 2) - 5;
    }
}

function gameLoop() {
    app.width = window.innerWidth;
    app.height = window.innerHeight;
    app.renderer.resize(window.innerWidth, window.innerHeight);

    updateBackground();

    resizeScreen();

    if (lama) { lama.update(); }



    for (let i = 0; i < birds.length; i++) {
        birds[i].update();
        if (isColliding(birds[i], lama) && score > 0 && !hasGameEnded) {
            if (!birds[i].bird.hasCollided) {
                birds[i].bird.hasCollided = true;
                score -= 1;
                scoreText.text = score;
            }
        }
    }

    for (let i = 0; i < flyingCaps.length; i++) {
        flyingCaps[i].update();
        if (isColliding(flyingCaps[i], lama) && !hasGameEnded) {
            if (!flyingCaps[i].flyingCap.hasCollided) {
                flyingCaps[i].flyingCap.hasCollided = true;
                flyingCaps[i].flyingCap.x = null;
                flyingCaps[i].flyingCap.y = null;
                score += 1;
                scoreText.text = score;
                if (score === SCORE_GOAL) {
                    hasGameEnded = true;
                    displayEndScreen();
                }
                let cap = new CapWearable(app, lama.lama.x, lama.lama.y, flyingCaps[i].flyingCap.color);
                caps.push(cap);
            }
        }
    }
    if (tickCounter % 150 == 0 && hasGameStarted && !hasGameEnded) {
        let flyingCap = new CapFlying({ app });
        flyingCaps.push(flyingCap);
    }

    tickCounter++;

    if (tickCounter % 100 == 0 && hasGameStarted && !hasGameEnded) {
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
    if (bgFront && bgMiddle && bgBack) {
        bgX = (bgX + bgSpeed);
        bgFront.tilePosition.x = bgX;
        bgMiddle.tilePosition.x = bgX / 2;
        bgBack.tilePosition.x = bgX / 4;
    }
}

function displayEndScreen() {
    appLogo = new PIXI.Sprite.from(app.loader.resources['logo'].url);
    const originalWidth = appLogo.width;
    appLogo.width = (window.innerWidth - 80);
    appLogo.height = ((window.innerWidth - 80) * appLogo.height / originalWidth);
    appLogo.x = (window.innerWidth - appLogo.width) / 2;
    appLogo.y = 25;

    appCredits = new PIXI.Text("CONGRATS!", { fontFamily: 'Berlin Sans FB, sans-serif;', fontSize: 24, align: 'center' });
    appCredits.x = (window.innerWidth - appCredits.width) / 2;
    appCredits.y = 25 + appLogo.height;

    app.stage.addChild(appLogo);
    app.stage.addChild(appCredits);
}