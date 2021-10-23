let Card=require("Card");
var myreferee={
    isgameover:function(thi)
    {
        let resultnode = cc.find("Canvas/result");
        let p1node = resultnode.getChildByName("p1剩余手牌");
        let p2node = resultnode.getChildByName("p2剩余手牌");
        let vnode  = resultnode.getChildByName("胜利");
        p1node.getComponent(cc.Label).string+=thi.p1.sum();
        p2node.getComponent(cc.Label).string+=thi.p2.sum();
        if(thi.p1.sum()>thi.p2.sum())
        {
            vnode.getComponent(cc.Label).string="p2胜利！";
        }
        else if(thi.p1.sum()<thi.p2.sum())
        {
            vnode.getComponent(cc.Label).string="p1胜利！";
        }
        else
        {
            vnode.getComponent(cc.Label).string="平局！！";
        }
        resultnode.active=true;
    },
    isdicard:function (thi) {
        if(thi.turn===1)
        {
            thi.p1.delete(thi.now_decor,thi.deck,thi.priority);
        }
        else
        {
            cc.log(thi.now_decor);
            thi.p2.delete(thi.now_decor,thi.deck,thi.priority);
        }
        thi.priority++;
    },
    isTouchcards:function(thi)
    {
        thi.buttonfalse();
        let touchcards = thi.node.getChildByName("打游戏背景图");
        let card = cc.instantiate(thi.image[thi.pokersorder[thi.pokers.pokertouched]]);
        card.setSiblingIndex(thi.priority);
        thi.priority++;
        touchcards.addChild(card);
        card.x = 500;
        card.y = 200;
        let newcard=new Card(card,thi.pokersorder[thi.pokers.pokertouched]);
        thi.deck.add(newcard);
        thi.pokers.pokertouched++;
        thi.surplusdeck();
        if(thi.pokers.pokertouched===thi.pokers.number)
        {
                let pokerback=cc.find("Canvas/背面");
                pokerback.active=false;
        }
        let action1=cc.rotateTo(1,thi.angles);
        if(thi.angles===90)
        {
            thi.angles=-60;
        }
        thi.angles+=30;
        let action2=cc.moveTo(1,250,200);
        let action=cc.spawn(action1,action2);
        card.runAction(action);
        thi.scheduleOnce(function () {
            let flag=0;
            if(thi.deck.judge())
            {
                if(thi.turn===1)
                    thi.deck.eat(thi.turn,thi.p1,thi.priority);
                else
                    thi.deck.eat(thi.turn,thi.p2,thi.priority);
                thi.priority++;
                thi.activationcard();
                flag=1;
                thi.surpluslabel();
            }
            if(thi.pokers.pokertouched===thi.pokers.number)
            {
                if(flag===1)
                    thi.scheduleOnce(function () {
                        thi.gameover();
                    },0.2);
                else
                    thi.gameover();
            }
            thi.buttontrue();
        },1)
    },
    Isdiscard:function(thi)
    {
        thi.buttonfalse();
        cc.log(thi.now_decor);
        this.isdicard(thi);
        thi.surpluslabel();
        thi.scheduleOnce(function () {
            if(thi.deck.judge())
            {
                if(thi.turn===1)
                {
                    thi.deck.eat(thi.turn,thi.p1,thi.priority);
                }
                else
                {
                    thi.deck.eat(thi.turn,thi.p2,thi.priority);
                }
                thi.priority++;
                thi.surpluslabel();
            }
            thi.activationcard();
            thi.buttontrue();
        },0.5)
    },
}
module.exports=myreferee;