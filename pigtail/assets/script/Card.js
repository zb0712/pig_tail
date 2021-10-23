//单张扑克牌类
class Card {
    constructor(card,number)
    {
        //card：该扑克牌对应的图像，
        // number：该扑克牌在52张扑克牌的位数
        this.card=card;
        //decor：花色，每13张一次花色，花色分别为0,1,2,3
        this.decor=Math.floor(number/13);
    }
}
module.exports=Card;