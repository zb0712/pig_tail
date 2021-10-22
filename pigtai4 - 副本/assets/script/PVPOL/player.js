class Player {
    constructor(name) {
        this.p = -1
        this.name = name;
        this.handcard = [];
        for (let i = 0; i < 4; i++) {
            this.handcard[i] = [];
        }
        this.angles = 15;
        this.haveHandCard = false

    }
    add(card, map) {
        let index = map.get(card[0])
        this.handcard[index].push(card)
        this.haveHandCard = true
    }
    sum() {
        let num = 0
        for (let i = 0; i < 4; i++) {
            num += this.handcard[i].length
        }
        return num
    }
}
module.exports = Player;