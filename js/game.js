// All the objects that need to be accessible from everywhere
let lama;
let foodsArray = [];
let tickCounter = 0;

// Initialization function triggered on the loading 
// of the page
window.onload = function() {
    app = new PIXI.Application (
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

    // Loading of the app
    // Triggers the function doneLoading at finish
    app.loader.load(doneLoading);

    // Create the Lama Object 
    lama = new Lama({app});
 
    app.ticker.add(gameLoop);
}

function clickHandler(){
    lama.lift();
}


// Starts the gameLoop
function doneLoading(){
    app.ticker.add(gameLoop);
}

function isColliding(a,b){
    let aBox = a.bounds();
    let bBox = b.bounds();

    return aBox.x + aBox.width > bBox.x &&
                   aBox.x < bBox.x + bBox.width &&
                   aBox.y + aBox.height > bBox.y &&
                   aBox.y < bBox.y + bBox.height;
}

function gameLoop(){
    lama.update();
    for(let i=0; i < foodsArray.length ; i++){
        foodsArray[i].update();
        //THERE IS COLLISION
        if(isColliding(foodsArray[i],lama)){
           
        }
    }
    tickCounter++;
    if(tickCounter % 100 == 0){
        let food = new Food({app});
        foodsArray.push(food);
    }

    

}