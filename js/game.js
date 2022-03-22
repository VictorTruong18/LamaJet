// All the objects that need to be accessible from everywhere
let lama;
let foodsArray = [];
let tickCounter = 0;

// Initialization function triggered on the loading 
// of the page
window.onload = function () {
    app = new PIXI.Application(
        {
            width: 480,
            height: 640,
            backgroundColor: 0xAAAAA
        }
    );
    document.body.appendChild(app.view);

    document.querySelector("#gameDiv").appendChild(app.view);
    app.stage.interactive = true;
    document.querySelector("#gameDiv").addEventListener("pointerdown", clickHandler);

    app.loader.add("character", "images/lama-sprite.png");
    // Loading of the app
    // Triggers the function doneLoading at finish
    app.loader.load(doneLoading);

    // Create the Lama Object 
    lama = new Lama({ app });

    app.ticker.add(gameLoop);
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
    lama.update();
    console.log(lama.lama.lift);
    for (let i = 0; i < foodsArray.length; i++) {
        foodsArray[i].update();
        //THERE IS COLLISION
        if (isColliding(foodsArray[i], lama)) {
            if (foodsArray[i].food.type === 'FRUIT') {
                if (!foodsArray[i].food.hasBeenCollided) {
                    foodsArray[i].food.hasBeenCollided = true;
                    lama.lama.lift += .1;
                } else {
                    foodsArray[i].food.weight = 0;
                    foodsArray[i].food.height = 0;
                }
            } else {
                if (!foodsArray[i].food.hasBeenCollided) {
                    foodsArray[i].food.hasBeenCollided = true;
                    lama.lama.lift -= .1;
                }else {
                    foodsArray[i].food.weight = 0;
                    foodsArray[i].food.height = 0;
                }
            }
        }
    }
    tickCounter++;
    if (tickCounter % 100 == 0) {
        let food = new Food({ app });
        foodsArray.push(food);
    }
}