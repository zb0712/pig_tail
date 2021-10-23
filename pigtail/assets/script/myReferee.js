let Card = require("Card");

//裁判对象
var myreferee = {

    //判断游戏是否结束
    isgameover: function (thi) {
        //结束便生成对局计算的图
        let resultnode = cc.find("Canvas/result");
        let p1node = resultnode.getChildByName("p1剩余手牌");
        let p2node = resultnode.getChildByName("p2剩余手牌");
        let vnode = resultnode.getChildByName("胜利");

        //显示双方各剩下几张牌
        p1node.getComponent(cc.Label).string += thi.p1.sum();
        p2node.getComponent(cc.Label).string += thi.p2.sum();

        //胜利对比
        if (thi.p1.sum() > thi.p2.sum()) {
            vnode.getComponent(cc.Label).string = "p2胜利！";
        }
        else if (thi.p1.sum() < thi.p2.sum()) {
            vnode.getComponent(cc.Label).string = "p1胜利！";
        }
        else {
            vnode.getComponent(cc.Label).string = "平局！！";
        }
        resultnode.active = true;
    },

    //出牌2，被出牌1调用的动作
    isdicard: function (thi) {
        if (thi.turn === 1) {
            thi.p1.delete(thi.now_decor, thi.deck, thi.priority);
        }
        else {
            cc.log(thi.now_decor);
            thi.p2.delete(thi.now_decor, thi.deck, thi.priority);
        }
        thi.priority++;
    },

    //摸牌
    isTouchcards: function (thi) {
        thi.buttonfalse();

        //生成摸出来的牌；--按洗牌后给的序列
        let touchcards = thi.node.getChildByName("打游戏背景图");
        let card = cc.instantiate(thi.image[thi.pokersorder[thi.pokers.pokertouched]]);

        //牌的显示优先级，可以让他覆盖以前出的牌
        card.setSiblingIndex(thi.priority);
        thi.priority++;
        touchcards.addChild(card);

        //生成的牌的位置
        card.x = 500;
        card.y = 200;
        let newcard = new Card(card, thi.pokersorder[thi.pokers.pokertouched]);

        //牌堆加牌
        thi.deck.add(newcard);

        //摸牌+1
        thi.pokers.pokertouched++;
        thi.surplusdeck();

        //判断是否摸的最后一张牌
        if (thi.pokers.pokertouched === thi.pokers.number) {
            let pokerback = cc.find("Canvas/背面");
            pokerback.active = false;
        }

        //牌的运动
        let action1 = cc.rotateTo(0.7, thi.angles);
        if (thi.angles === 90) {
            thi.angles = -60;
        }
        thi.angles += 30;
        let action2 = cc.moveTo(0.7, 250, 200);
        let action = cc.spawn(action1, action2);
        card.runAction(action);
        thi.scheduleOnce(function () {
            let flag = 0;
            //判断当前牌和牌顶是否花色相同
            if (thi.deck.judge()) {
                if (thi.turn === 1)
                    thi.deck.eat(thi.turn, thi.p1, thi.priority);
                else
                    thi.deck.eat(thi.turn, thi.p2, thi.priority);
                thi.priority++;
                thi.activationcard();
                flag = 1;
                thi.surpluslabel();
            }
            if (thi.pokers.pokertouched === thi.pokers.number) {
                if (flag === 1)
                    thi.scheduleOnce(function () {
                        thi.gameover();
                    }, 0.3);
                else
                    thi.gameover();
            }
            thi.buttontrue();

        }, 0.8)
    },

    //出牌1
    Isdiscard: function (thi) {
        thi.buttonfalse();
        cc.log(thi.now_decor);
        this.isdicard(thi);
        thi.surpluslabel();
        thi.scheduleOnce(function () {
            //判断出的牌是否和牌堆顶的花色相同
            if (thi.deck.judge()) {
                if (thi.turn === 1) {
                    thi.deck.eat(thi.turn, thi.p1, thi.priority);
                }
                else {
                    thi.deck.eat(thi.turn, thi.p2, thi.priority);
                }
                thi.priority++;
                thi.surpluslabel();
            }
            thi.activationcard();
            thi.buttontrue();
        }, 0.6)
    },
}
module.exports = myreferee;