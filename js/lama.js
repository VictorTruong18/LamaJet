
// Positioning
const lamaOrginY = 640/2;
const lamaOrginX = 64;
// Physics
const orginGravity = 0.1;
const originVelocity = 0;
const lift = 3;

// Main playable character
class Lama {
    constructor({app}) {
        // Load the Pixi object
        this.app = app;
        this.lama = new PIXI.Sprite.from("../images/lama.png");
        this.lama.anchor.set(0.5);
        this.lama.x = lamaOrginX;
        this.lama.y = lamaOrginY;
        this.lama.gravity = orginGravity;
        this.lama.velocity = originVelocity;
        this.lama.lift = lift;
        app.stage.addChild(this.lama);
    }
    
    update(){
        this.lama.velocity += this.lama.gravity;
        this.lama.y += this.lama.velocity;
        if (this.lama.y > 540) {
            this.lama.y = 540;
            this.lama.velocity = 0;
          }
      
          if (this.lama.y < 0) {
            this.lama.y = 0;
            this.lama.velocity = 0;
          }
    }

    lift(){
        this.lama.velocity -= this.lama.lift;
    }
}