let AI = require("AI");
class Deck {
    constructor(array) {
        this.array = array;
        this.top = -1;
        this.topdecor = -1;
    }
    add(card) {
        this.top++;
        this.array[this.top] = card;
        this.topdecor = card.decor;
    }
    eat(turn, person, priority) {
        this.topdecor = -1;
        this.run(turn, person, priority);
        AI.initialize();
    }
    judge() {
        if (this.top >= 1) {
            if (this.array[this.top].decor === this.array[this.top - 1].decor)
                return true;
            else {
                return false;
            }
        }
        return false;
    }
    run(turn, person, priority) {
        person.add(this.array[this.top]);
        let action1 = cc.rotateTo(0.2, 0);
        let action2;
        let x = 40;
        if (turn === 1) {
            x = x + 120 * this.array[this.top].decor;
            action2 = cc.moveTo(0.2, x, 15);
        }
        else {
            x = x + 120 * (3 - this.array[this.top].decor);
            action2 = cc.moveTo(0.2, x, 360);
        }
        let action = cc.spawn(action1, action2);
        this.array[this.top].card.setSiblingIndex(priority);
        this.array[this.top].card.runAction(action);
        this.top--;
        if (this.top != -1)
            this.run(turn, person, priority);
    }
}
module.exports = Deck;
