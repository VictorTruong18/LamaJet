
// Positioning
const lamaOrginY = 640 / 2;
const lamaOrginX = 64;
// Physics
const orginGravity = 0.1;
const originVelocity = 0;
const lift = 3;

// Main playable character
class Lama {
    constructor({ app }) {
        // Load the Pixi object
        this.app = app;
        const ssheet = new PIXI.BaseTexture.from(this.app.loader.resources['character'].url);
        const w = 48;
        const h = 48;

        const playerSheet = {};

        playerSheet["walk"] = [
            new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 0, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(1 * w, 0, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(2 * w, 0, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(3 * w, 0, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(4 * w, 0, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(5 * w, 0, w, h)),
        ];

        this.lama = new PIXI.AnimatedSprite(playerSheet.walk);
        this.lama.animationSpeed = .5;
        this.lama.anchor.set(0.5);
        this.lama.x = lamaOrginX;
        this.lama.y = lamaOrginY;
        this.lama.gravity = orginGravity;
        this.lama.velocity = originVelocity;
        this.lama.lift = lift;
        this.lama.play();
        app.stage.addChild(this.lama);
    }

    update() {
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

    lift() {
        this.lama.velocity -= this.lama.lift;
    }

}