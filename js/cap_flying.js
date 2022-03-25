const capColors = ['GREEN','RED','PINK', 'DARKBLUE', 'BRIGHTBLUE'];


class CapFlying {
    constructor({ app }) {
        this.app = app;
        const color = capColors[Math.floor(Math.random() * capColors.length)];
        let ssheet;
        if(color == 'GREEN'){
             ssheet = new PIXI.BaseTexture.from(this.app.loader.resources['cap_flying_green'].url);
        } else if(color == 'RED'){
             ssheet = new PIXI.BaseTexture.from(this.app.loader.resources['cap_flying_red'].url);
        } else if(color == 'PINK'){ 
             ssheet = new PIXI.BaseTexture.from(this.app.loader.resources['cap_flying_pink'].url);
        } else if (color == 'DARKBLUE'){
            ssheet = new PIXI.BaseTexture.from(this.app.loader.resources['cap_flying_darkblue'].url);
        } else if (color == 'BRIGHTBLUE'){
            ssheet = new PIXI.BaseTexture.from(this.app.loader.resources['cap_flying_brightblue'].url);
        }
        
        
        const w = 80;
        const h = 80;

        const flyingCapSheet = {}; 
        

        flyingCapSheet["fly"] = [
            new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 0, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(1 * w, 0, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(2 * w, 0, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(3 * w, 0, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(4 * w, 0, w, h)),
        ];
        this.flyingCap = new PIXI.AnimatedSprite(flyingCapSheet.fly);
        this.flyingCap.animationSpeed = .3;
        this.flyingCap.x = birdOrginX;
        this.flyingCap.y = Math.floor(Math.random() * (birdOrginY*0.8 - birdOrginY*0.05)) + birdOrginY*0.05;
        this.flyingCap.hasCollided = false;
        this.flyingCap.play();
        this.flyingCap.color = color;
        app.stage.addChild(this.flyingCap);
    }

    update() {
        this.flyingCap.x -= birdSpeed - 1;
    }

    bounds() {
        return this.flyingCap.getBounds();
    }
}