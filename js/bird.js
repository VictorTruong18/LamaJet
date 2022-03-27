
// Positioning
let birdOrginX = window.innerWidth;
let birdOrginY = window.innerHeight;
const birdSpeed = 4;


class Bird {
    constructor({ app }) {
        this.app = app;
        const ssheet = new PIXI.BaseTexture.from(this.app.loader.resources['enemy'].url);
        
        const w = 80;
        const h = 64;

        const enemySheet = {};

        enemySheet["fly"] = [
            new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 0, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(1 * w, 0, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(2 * w, 0, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(3 * w, 0, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(4 * w, 0, w, h)),
        ];
        this.bird = new PIXI.AnimatedSprite(enemySheet.fly);
        this.bird.animationSpeed = .3;
        this.bird.x = birdOrginX;
        this.bird.y = Math.floor(Math.random() * (birdOrginY*0.8 - birdOrginY*0.05)) + birdOrginY*0.05;
        this.bird.hasCollided = false;
        this.bird.play();
        app.stage.addChild(this.bird);
    }

    bounds() {
        return this.bird.getBounds();
    }

    update() {
        this.bird.x -= birdSpeed;
    }

}