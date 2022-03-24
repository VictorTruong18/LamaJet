
// Positioning
const lamaOrginY = window.innerHeight / 2;
const lamaOrginX = window.innerWidth *0.15;
let floor = window.innerHeight*0.8 ;
// Physics
const orginGravity = 0.1;
const originVelocity = 0;
const lift = 3;
const playerSheet = {};

        

// Main playable character
class Lama {
    constructor({ app }) {
        // Load the Pixi object
        this.app = app;
        const ssheet = new PIXI.BaseTexture.from(this.app.loader.resources['character'].url);
        
        const w = 80;
        const h = 80;

        playerSheet["walk"] = [
            new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 0, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(1 * w, 0, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(2 * w, 0, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(3 * w, 0, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(4 * w, 0, w, h)),
        ];

        playerSheet["fly"] = [
            new PIXI.Texture(ssheet, new PIXI.Rectangle(0, h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(1 * w, h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(2 * w, h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(3 * w, h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(4 * w, h, w, h)),
        ];

        playerSheet["fly_hat"] = [
            new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 2*h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(1 * w, 2*h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(2 * w, 2*h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(3 * w, 2*h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(4 * w, 2*h, w, h)),
        ];

        playerSheet["fall_hat"] = [
            new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 3*h, w, h)),
        ];

        playerSheet["walk_hat"] = [
            new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 3*h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(1 * w, 3*h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(2 * w, 3*h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(3 * w, 3*h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(4 * w, 3*h, w, h)),
        ];

        this.lama = new PIXI.AnimatedSprite(playerSheet.fall_hat);
        this.lama.anchor.set(0.5);
        this.lama.animationSpeed = .1;

        this.lama.x = lamaOrginX;
        this.lama.y = lamaOrginY;
        this.lama.gravity = orginGravity;
        this.lama.velocity = originVelocity;
        this.lama.lift = lift;
        app.stage.addChild(this.lama);
        this.lama.play();
    }

    bounds() {
        return this.lama.getBounds();
    }
    
    update(){
        this.lama.velocity += this.lama.gravity;
        this.lama.y += this.lama.velocity;
        if (this.lama.y > floor) {
            this.lama.y = floor;
            this.lama.velocity = 0;
        }

        if (this.lama.y < 0) {
            this.lama.y = 0;
            this.lama.velocity = 0;
        }
    
        for(var i = 0; i < caps.length ; i++){
            caps[i].update(this.lama.x, this.lama.y,i);
        }
    }

    lift() {
        this.lama.velocity -= this.lama.lift;
        this.lama.textures = playerSheet.fly;
        this.lama.play();
    }

    resize() {
        this.lama.x = window.innerHeight *0.15;
        floor = window.innerHeight*0.8
    }

}