class Card {
    constructor(card,number)
    {
        this.card=card;
        this.decor=Math.floor(number/13);
    }
}
module.exports=Card;