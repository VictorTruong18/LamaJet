

class CapWearable {
    constructor(app,x,y){
        this.app = app;
        this.capWearable = new PIXI.Sprite.from("../images/cap_wearable_1.png");
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