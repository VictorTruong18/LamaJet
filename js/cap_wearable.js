

class CapWearable {
    constructor(app,x,y,color){
        this.app = app;
        this.capWearable;
        if(color == 'GREEN') {
            this.capWearable = new PIXI.Sprite.from(this.app.loader.resources['cap_wearable_green'].url);
        } else if(color == 'RED') {
            this.capWearable = new PIXI.Sprite.from(this.app.loader.resources['cap_wearable_red'].url);
        } else if(color == 'PINK') {
            this.capWearable = new PIXI.Sprite.from(this.app.loader.resources['cap_wearable_pink'].url);
        } else if (color == 'DARKBLUE') {
            this.capWearable = new PIXI.Sprite.from(this.app.loader.resources['cap_wearable_darkblue'].url);
        } else if (color == 'BRIGHTBLUE') {
            this.capWearable = new PIXI.Sprite.from(this.app.loader.resources['cap_wearable_brightblue'].url);
        }
            
        this.capWearable.x = x-10;
        this.capWearable.y = y-30;
        this.capWearable.height = 30;
        this.capWearable.width =  33;
        app.stage.addChild(this.capWearable);
    }

    update(x,y,indice){
        this.capWearable.x = x+5;
        this.capWearable.y = y-43-(indice*8);
    }
}