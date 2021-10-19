class Player {
    constructor(name) {
        this.name = name;
        this.handcard = [];
        for (let i = 0; i < 4; i++) {
            this.handcard[i] = [];
        }
        this.angles = 15;
    }
}
module.exports = Player;