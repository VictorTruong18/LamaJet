
// Positioning
const foodOrginX = 470;
const foodType = ['FRUIT', 'JUNK'];
const foodSpeed = 1;


class Food {
    constructor({app}) {
        this.app = app;
        const food = foodType[Math.floor(Math.random() * foodType.length)];
        if(food == "FRUIT"){
            this.food = new PIXI.Sprite.from("../images/fruit.png");
        }
        if(food == "JUNK"){
            this.food = new PIXI.Sprite.from("../images/junk.png");
        }
        this.food.x = foodOrginX;
        this.food.y = Math.floor(Math.random() * 640)
        this.food.type = food;
        app.stage.addChild(this.food);
    }

    bounds() {
        return this.food.getBounds();
    }

    update(){
        this.food.x -= foodSpeed ;
    }
}