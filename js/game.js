// All the objects that need to be accessible from everywhere
let lama;

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

function gameLoop(){
    lama.update();

}