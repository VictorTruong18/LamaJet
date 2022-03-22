
// Positioning
const foodOrginX = 470;
const foodType = ['FRUIT', 'JUNK'];
const junkFoodList = ['DONUT','TACOS'];
const foodSpeed = 1;


class Food {
    constructor({ app }) {
        this.app = app;
        const food = foodType[Math.floor(Math.random() * foodType.length)];
        if (food == "FRUIT") {
            this.food = new PIXI.Sprite.from("../images/ananas.png");
        }
        if (food == "JUNK") {
            const junkFood = junkFoodList[Math.floor(Math.random() * junkFoodList.length)];
            if(junkFood == "DONUT")
                this.food = new PIXI.Sprite.from("../images/donut.png");
            if(junkFood == "TACOS")
                this.food = new PIXI.Sprite.from("../images/tacos.png");

        }
        this.food.x = foodOrginX;
        this.food.y = Math.floor(Math.random() * 640);
        this.food.width = 50;
        this.food.height = 50;
        this.food.type = food;
        this.food.hasBeenCollided = false;
        app.stage.addChild(this.food);
    }

    bounds() {
        return this.food.getBounds();
    }

    update() {
        this.food.x -= foodSpeed;
    }
}