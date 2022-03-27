
// Positioning
const lamaOrginY = window.innerHeight / 2;
const lamaOrginX = window.innerWidth * 0.15;
let floor = window.innerHeight * 0.8;
// Physics
const orginGravity = 0.1;
const originVelocity = 0;
const lift = 2;
const playerSheet = {};



// Main playable character
class Lama {
    constructor({ app }) {
        // Load the Pixi object
        this.app = app;
        const ssheet = new PIXI.BaseTexture.from(this.app.loader.resources['character'].url);
        const stunnedsheet = new PIXI.BaseTexture.from(this.app.loader.resources['character_stunned'].url);
        const w = 80;
        const h = 80;

        playerSheet["fly_hat"] = [
            new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 2 * h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(1 * w, 2 * h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(2 * w, 2 * h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(3 * w, 2 * h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(4 * w, 2 * h, w, h)),
        ];

        playerSheet["walk_hat"] = [
            new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 3 * h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(1 * w, 3 * h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(2 * w, 3 * h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(3 * w, 3 * h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(4 * w, 3 * h, w, h)),
        ];

        playerSheet["stunned"] = [
            new PIXI.Texture(stunnedsheet, new PIXI.Rectangle(0, 0, w, h)),
            new PIXI.Texture(stunnedsheet, new PIXI.Rectangle(5 * w, 0, w, h)),
            new PIXI.Texture(stunnedsheet, new PIXI.Rectangle(1 * w, 0, w, h)),
            new PIXI.Texture(stunnedsheet, new PIXI.Rectangle(5 * w, 0, w, h)),
            new PIXI.Texture(stunnedsheet, new PIXI.Rectangle(2 * w, 0, w, h)),
            new PIXI.Texture(stunnedsheet, new PIXI.Rectangle(5 * w, 0, w, h)),
            new PIXI.Texture(stunnedsheet, new PIXI.Rectangle(3 * w, 0, w, h)),
            new PIXI.Texture(stunnedsheet, new PIXI.Rectangle(5 * w, 0, w, h)),
            new PIXI.Texture(stunnedsheet, new PIXI.Rectangle(4 * w, 0, w, h)),
            new PIXI.Texture(stunnedsheet, new PIXI.Rectangle(5 * w, 0, w, h)),
        ];

        this.lama = new PIXI.AnimatedSprite(playerSheet.walk_hat);
        this.lama.anchor.set(0.5);
        this.lama.animationSpeed = .1;
        this.lama.stunnedCooldown = 0;
        this.lama.isStunned = false;

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

    update() {
        this.lama.velocity += this.lama.gravity;
        this.lama.y += this.lama.velocity;
        if (this.lama.y > floor) {
            if (!isAudioMute && !running) {
                audio['running'].loop = true;
                audio['running'].volume = 0.6;
                audio['running'].play();
                running = true;
        
            }
            this.lama.y = floor;
            this.lama.velocity = 0;

        }
        if (this.lama.isStunned) {
            this.lama.stunnedCooldown += 1;
        }

        if (this.lama.stunnedCooldown > 150 && this.lama.isStunned) {
            this.lama.isStunned = false;
        }

        if (this.lama.y < 0) {
            this.lama.y = 0;
            this.lama.velocity = 0;
        }

        var index = 0;
        for (var i = 0; i < caps.length; i++) {
            if (!caps[i].capWearable.hasPopped) {
                caps[i].update(this.lama.x, this.lama.y, index);
                index++;
            } else {

                caps[i].capWearable.velocity += caps[i].capWearable.gravity;
                caps[i].capWearable.y += caps[i].capWearable.velocity;
            }
        }
    }

    lift(isAudioMute) {
        if (this.lama.stunnedCooldown > 150 || !this.lama.isStunned) {
            this.lama.velocity -= this.lama.lift;
            this.lama.textures = playerSheet.fly_hat;
            this.lama.play();
            if (!isAudioMute) {
                audio['jetPack'].volume = 0.3;
                audio['jetPack'].play();
                audio['running'].pause();
                running = false;
            }

        } else {
            this.lama.velocity -= this.lama.lift;


        }

    }

    resize() {
        this.lama.x = window.innerHeight * 0.15;
        floor = window.innerHeight * 0.8
    }

    stunned() {
        this.lama.isStunned = true;
        this.lama.stunnedCooldown = 0;
        var found = false;

        for (let i = 0; i < caps.length; i++) {
            if (!caps[i].capWearable.hasPopped && !found) {
                caps[i].capWearable.hasPopped = true;
                caps[i].capWearable.velocity -= lift;
                found = true;
            }
        }
        this.lama.textures = playerSheet.stunned;
        this.lama.play();
    }

}