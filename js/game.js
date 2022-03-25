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
let playTheme = true;
let muteButton;
let unmuteButton;
let isAudioMute = false;
let birdCooldown = 100;

var audio = {
    'music': new Audio('./sounds/Musique.mp3'),
    'intro': new Audio('./sounds/PontMusique.mp3'),
    'hittingBird': new Audio('./sounds/HittingBirds.mp3'),
    'bonnet': new Audio('./sounds/BonnetSound.mp3'),
    'jetPack': new Audio('./sounds/Jetpack.mp3'),
    'lamaHurt': new Audio('./sounds/Lama_Hurt.mp3'),
    'endMusic' : new Audio('./sounds/EndMusic.mp3'),
    'endSound' : new Audio('./sounds/EndSound.mp3')
}

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
    app.loader.add("hat_counter", "hatCounter2.png");
    app.loader.add("download", "download.png");
    app.loader.add("appIcon", "iconApp.png");
    app.loader.add("logo", "LamaJetHigh.png");
    app.loader.add("upgrade", "NewUpgrade.png");
    app.loader.add("replay", "replay.png");
    app.loader.add("credits", "credits.png");
    app.loader.add("mute", "mute.png");
    app.loader.add("unmute", "unmute.png");

    // Loading of the app
    // Triggers the function doneLoading at finish
    app.loader.load(doneLoading);
    window.addEventListener("keydown", keysDown);



    const container = new PIXI.Container();
    app.stage.addChild(container);
}

function startIntent(x,y){
    console.log("click " + x + " "+ y);
    console.log(muteButton.x);
    console.log(muteButton.y);
    console.log(muteButton.width);
    console.log(muteButton.height);
    if(x  >= muteButton.x && x <= muteButton.x + muteButton.width && y >= muteButton.y && y <= muteButton.y + muteButton.height){
        return true;
    } else {
        return false;
    }
  
}

function clickHandler(e) {

  
    if (!hasGameStarted && !startIntent(e.x,e.y)) {
        hasGameStarted = true;
        gameStartText.destroy();
        audio['music'].loop = true;
        audio['music'].volume = 0.05;
        audio['music'].play();
        audio['intro'].pause();
    }
    if (!hasGameEnded) {
        lama.lift(isAudioMute);
    }
}

function keysDown(e) {
    if (!hasGameStarted && e.keyCode == 32) {
        hasGameStarted = true;
        gameStartText.destroy();
        console.log('Game has started');
        audio['music'].loop = true;
        audio['music'].volume = 0.05;
        audio['music'].play();

    }
    if (!hasGameEnded && e.keyCode == 32) {
        lama.lift(isAudioMute);
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
    hatCounter.y = -10;
    app.stage.addChild(hatCounter);

    scoreText = new PIXI.Text(score, { fontFamily: 'Berlin Sans FB', fontSize: 24, align: 'center' });
    scoreText.x = (window.innerWidth / 2) - 32;
    scoreText.y = 28;
    app.stage.addChild(scoreText);

    scoreGoalText = new PIXI.Text(SCORE_GOAL, { fontFamily: 'Berlin Sans FB', fontSize: 24, align: 'center' });
    scoreGoalText.x = (window.innerWidth / 2) - 5;
    scoreGoalText.y = 28;
    app.stage.addChild(scoreGoalText);

    // Mute
    unmuteButton = new PIXI.Sprite.from(app.loader.resources['unmute'].url);
    unmuteButton.x = (window.innerWidth - unmuteButton.width) / 2 + 125;
    unmuteButton.y = 20;
    muteButton = new PIXI.Sprite.from(app.loader.resources['mute'].url);
    muteButton.x = (window.innerWidth - muteButton.width) / 2 + 125;
    muteButton.y = 20;
    muteButton.interactive = true;
    muteButton.on('pointerdown', (event) => {
        if (!isAudioMute) {
            isAudioMute = true;
            for (var key in audio) {
                audio[key].volume = 0;
            }
            muteButton.alpha = 0;
        } else {
            isAudioMute = false;
            audio['hittingBird'].volume = 0.2;
            audio['lamaHurt'].volume = 0.2;
            audio['intro'].volume = 0.1;
            audio['bonnet'].volume = 0.1;
            audio['jetPack'].volume = 0.3;
            audio['music'].volume = 0.05;
            audio['endSound'].volume = 0.2;
            audio['endMusic'].volume = 0.05;
            muteButton.alpha = 1;
        }
    });
    app.stage.addChild(unmuteButton);
    app.stage.addChild(muteButton);

    // Download
    appIcon = new PIXI.Sprite.from(app.loader.resources['appIcon'].url);
    appIcon.width = 55;
    appIcon.height = 55;
    appIcon.x = (window.innerWidth - appIcon.width) / 2 - 130;
    appIcon.y = (window.innerHeight - appIcon.height) - 20;
    appIcon.interactive = true;
    appIcon.on('pointerdown', (event) => {
        window.location.href = DOWNLOAD_URL;
    });
    app.stage.addChild(appIcon);

    downloadButton = new PIXI.Sprite.from(app.loader.resources['download'].url);
    downloadButton.width *= 0.3;
    downloadButton.height *= 0.3;
    downloadButton.x = (window.innerWidth - downloadButton.width) / 2 + 35;
    downloadButton.y = (window.innerHeight - downloadButton.height) - 20;
    downloadButton.interactive = true;
    downloadButton.on('pointerdown', (event) => {
        window.location.href = DOWNLOAD_URL;
    });
    app.stage.addChild(downloadButton);
    app.ticker.add(gameLoop);

    if (!isAudioMute) {
        audio['intro'].loop = true;
        audio['intro'].volume = 0.1;
        audio['intro'].play();
    }
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
        unmuteButton.x = (window.innerWidth - unmuteButton.width) / 2 + 125;
        unmuteButton.y = 20;
        muteButton.x = (window.innerWidth - muteButton.width) / 2 + 125;
        muteButton.y = 20;
        if (!hasGameStarted) {
            gameStartText.x = (window.innerWidth - gameStartText.width) / 2
            gameStartText.y = window.innerHeight / 2;
        }
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

function playIntroTheme() {
    if (!isAudioMute) {
        audio['intro'].loop = false;
        audio['intro'].volume = 0.1;
        audio['intro'].play();
        playTheme = false;

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
    for (let i = 0; i < caps.length; i++) {
        if (!caps[i].capWearable.hasPopped) {
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
                if (!isAudioMute) {
                    audio['bonnet'].volume = 0.1;
                    audio['bonnet'].play();
                }
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
                if (!isAudioMute) {
                    audio['hittingBird'].volume = 0.2;
                    audio['hittingBird'].play();
                    audio['lamaHurt'].volume = 0.2;
                    audio['lamaHurt'].play();
                }
            }
        }
        let nbHatsCounter = 0;
        for (let j = 0; j < caps.length; j++) {
            if (!birds[i].bird.hasCollided & !caps[j].capWearable.hasPopped) {
                nbHatsCounter++;
                if (isColliding(birds[i], caps[j])) {
                    caps[j].capWearable.hasPopped = true;
                    var lift = Math.floor(Math.random() * 10);
                    caps[j].capWearable.velocity -= lift;
                    if (!isAudioMute) {
                        audio['lamaHurt'].volume = 0.2;
                        audio['lamaHurt'].play();
                    }
                }
            }
        }
    }

    if (tickCounter % 150 == 0 && hasGameStarted && !hasGameEnded) {
        let flyingCap = new CapFlying({ app });
        flyingCaps.push(flyingCap);
    }

    tickCounter++;

    if (tickCounter % birdCooldown == 0 && hasGameStarted && !hasGameEnded) {
        let bird = new Bird({ app });
        birds.push(bird);
    }

    optimization();    

    if(window.innerWidth < 500){
        birdCooldown = 120;
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

function optimization(){
    // Flying hats optimization
    // They are being removed when :
    // - they have been collided 
    var indexFlyingHatsGarbage = [];
    for(let i = 0; i < flyingCaps.length; i++){
        if(flyingCaps[i].flyingCap.hasCollided){
            indexFlyingHatsGarbage.push(i);
        }
    }
    for(let i =0; i < indexFlyingHatsGarbage.length; i++){
        flyingCaps.splice(indexFlyingHatsGarbage[i], 1);
    }
    
    // Flying eagles optimization
    // They are being removed when :
    // - they have been collided
    // - their x is below 0
    var indexBirdGarbage = [];
    for(let i = 0; i < birds.length; i++){
        if(birds[i].bird.hasCollided && birds[i].bird.x < -10000){
            indexBirdGarbage.push(i);
        }
    }
    for(let i =0; i < indexBirdGarbage.length; i++){
        birds.splice(indexBirdGarbage[i], 1); 
    }

    // Wearable hats optimization
    // They are being removed when :
    // - They have been popped
    // - Their y is below 0
    var indexWearableCaps = [];
    for(let i = 0; i < caps.length; i++){
        if(caps[i].capWearable.hasPopped && caps[i].capWearable.y > window.innerHeight + 1000 ){
            indexWearableCaps.push(i);
        }
    }
    for(let i =0; i < indexWearableCaps.length; i++){
        caps.splice(indexWearableCaps[i], 1); 
    }

}

function displayEndScreen() {
    if (!isAudioMute) {
        audio['endSound'].volume = 0.4;
        audio['endSound'].play();
        audio['endMusic'].loop = true;
        audio['endMusic'].volume = 0.3;
        audio['endMusic'].play();
        audio['music'].pause();
    }

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
        window.location.href = DOWNLOAD_URL;
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
        window.location.href = "credits.html";
    })

    app.stage.addChild(appLogo);
    app.stage.addChild(upgrade);
    app.stage.addChild(appCredits);
    app.stage.addChild(replayButton);
    app.stage.addChild(creditsButton);


}
