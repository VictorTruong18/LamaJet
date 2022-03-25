// All the objects that need to be accessible from everywhere
const SCORE_GOAL = 10;
const DOWNLOAD_URL = "https://en.wikipedia.org/wiki/Llama";
const CREDITS_URL = "https://epita.fr";
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
let upgrade;
let replayButton;
let creditsButton;
let trueEnding = false;

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
    app.loader.add("cap_flying_brightblue", "cap_flying_brightblue.png")
    app.loader.add("character_stunned", "stunned_sprite.png")
    app.loader.add("cap_flying_darkblue", "cap_flying_darkblue.png")
    app.loader.add("cap_wearable_pink", "cap_wearable_pink.png")
    app.loader.add("cap_wearable_green", "cap_wearable_green.png")
    app.loader.add("cap_wearable_red", "cap_wearable_red.png")
    app.loader.add("cap_wearable_brightblue", "cap_wearable_brightblue.png")
    app.loader.add("cap_wearable_darkblue", "cap_wearable_darkblue.png")
    app.loader.add("character", "lama_sprite.png");
    app.loader.add("enemy", "bird-sprite.png");
    app.loader.add("bgBack", "sky.png");
    app.loader.add("bgMiddle", "clouds.png");
    app.loader.add("bgFront", "rocks.png");
    app.loader.add("bgGround", "ground.png");
    app.loader.add("hat_counter", "hatCounter.png");
    app.loader.add("download", "download.png");
    app.loader.add("appIcon", "iconApp.png");
    app.loader.add("logo", "LamaJetHigh.png");
    app.loader.add("upgrade", "NewUpgrade.png");
    app.loader.add("replay", "replay.png");
    app.loader.add("credits", "credits.png");


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
        window.open(DOWNLOAD_URL, '_blank');
    });
    app.stage.addChild(appIcon);

    downloadButton = new PIXI.Sprite.from(app.loader.resources['download'].url);
    downloadButton.width *= 0.3;
    downloadButton.height *= 0.3;
    downloadButton.x = (window.innerWidth - downloadButton.width) / 2 + 35;
    downloadButton.y = (window.innerHeight - downloadButton.height) - 20;
    downloadButton.interactive = true;
    downloadButton.on('pointerdown', (event) => {
        window.open(DOWNLOAD_URL, '_blank');
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
        if (hasGameEnded) {
            appLogo.x = (window.innerWidth - appLogo.width) / 2;
            appLogo.y = 25;
            appCredits.x = (window.innerWidth - appCredits.width) / 2;
            appCredits.y = 30 + appLogo.height;
            upgrade.x = (window.innerWidth - upgrade.width) / 2;
            upgrade.y = 30 + appLogo.height + appCredits.height;
            replayButton.x = (window.innerWidth - replayButton.width) / 2 - 80;
            replayButton.y = 30 + appLogo.height + appCredits.height + upgrade.height;
            creditsButton.x = (window.innerWidth - creditsButton.width) / 2 + 80;
            creditsButton.y = 30 + appLogo.height + appCredits.height + upgrade.height;
        }
    }
}

function gameLoop() {
    app.width = window.innerWidth;
    app.height = window.innerHeight;
    app.renderer.resize(window.innerWidth, window.innerHeight);

    updateBackground();

    resizeScreen();

    if (lama) { lama.update(); }

    let counter = 0;
    for(let i = 0; i < caps.length; i++){
        if(!caps[i].capWearable.hasPopped){
            counter++;
        }
    }
    if (score === SCORE_GOAL && !trueEnding) {
        hasGameEnded = true;
        trueEnding = true;
        displayEndScreen();
    }
    score = counter;
    scoreText.text = score;
    for (let i = 0; i < flyingCaps.length; i++) {
        flyingCaps[i].update();
        if (isColliding(flyingCaps[i], lama) && !hasGameEnded) {
            if (!flyingCaps[i].flyingCap.hasCollided) {
                flyingCaps[i].flyingCap.hasCollided = true;
                flyingCaps[i].flyingCap.x = null;
                flyingCaps[i].flyingCap.y = 50000;
                
                let cap = new CapWearable(app, lama.lama.x, lama.lama.y, flyingCaps[i].flyingCap.color);
                caps.push(cap);
            }
        }
    }

    for (let i = 0; i < birds.length; i++) {
        birds[i].update();
        if (isColliding(birds[i], lama)) {
            if (!birds[i].bird.hasCollided) {
                birds[i].bird.hasCollided = true;
                lama.stunned();
                
            }
        }
        let nbHatsCounter = 0;
        for(let j = 0; j < caps.length; j++){
            if (!birds[i].bird.hasCollided & !caps[j].capWearable.hasPopped) {
                nbHatsCounter++;
                if (isColliding(birds[i], caps[j])) {
                    caps[j].capWearable.hasPopped = true;
                    var lift = Math.floor(Math.random() * 10);
                    caps[j].capWearable.velocity -= lift;
                    
                }
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
    appLogo.x = (window.innerWidth - appLogo.width) / 2;
    appLogo.y = 25;
    appLogo.interactive = true;
    appLogo.on('pointerdown', (event) => {
        window.open(DOWNLOAD_URL, '_blank');
    });

    appCredits = new PIXI.Text("CONGRATS!", { fontFamily: 'Berlin Sans FB, sans-serif;', fontSize: 24, align: 'center' });
    appCredits.x = (window.innerWidth - appCredits.width) / 2;
    appCredits.y = 30 + appLogo.height;

    upgrade = new PIXI.Sprite.from(app.loader.resources['upgrade'].url);
    upgrade.x = (window.innerWidth - upgrade.width) / 2;
    upgrade.y = 30 + appLogo.height + appCredits.height;
    upgrade.interactive = true;
    upgrade.on('pointerdown', (event) => {
        window.open(DOWNLOAD_URL, '_blank');
    });

    replayButton = new PIXI.Sprite.from(app.loader.resources['replay'].url);
    replayButton.x = (window.innerWidth - replayButton.width) / 2 - 80;
    replayButton.y = 30 + appLogo.height + appCredits.height + upgrade.height;
    replayButton.interactive = true;
    replayButton.on('pointerdown', (event) => {
        document.location.reload(true);
    });

    creditsButton = new PIXI.Sprite.from(app.loader.resources['credits'].url);
    creditsButton.x = (window.innerWidth - creditsButton.width) / 2 + 80;
    creditsButton.y = 30 + appLogo.height + appCredits.height + upgrade.height;
    creditsButton.interactive = true;
    creditsButton.on('pointerdown', (event) => {
        window.open('credits.html');
    })

    app.stage.addChild(appLogo);
    app.stage.addChild(upgrade);
    app.stage.addChild(appCredits);
    app.stage.addChild(replayButton);
    app.stage.addChild(creditsButton);
}