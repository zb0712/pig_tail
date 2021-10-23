class Person{
    constructor(name)
    {
        //name:玩家名
        //handcard：玩家手牌，4个数组，对应四个花色
        //top：玩家手牌，4个数组，对应每个花色的张数
        //angles：每次运动到牌堆（放置区）的角度，让UI效果变得好看一点点
        this.name=name;
        this.handcard=[];
        this.top=[];
        //初始化
        for (let i = 0; i < 4; i++) {
            this.handcard[i] = [];
            this.top[i]=-1;
        }
        this.angles=15;

    }

    //玩家吃牌
    //card：为某张扑克牌，详见：Card类
    add(card)
    {
        //玩家该花色手牌张数+1
        this.top[card.decor]++;
        //玩家该花色对应数组加入card
        this.handcard[card.decor][this.top[card.decor]]=card;
    }

    //玩家手牌总数，因为是从-1开始，所以最后要+4
    sum()
    {
        return this.top[0]+this.top[1]+this.top[2]+this.top[3]+4;
    }


    //玩家出牌
    delete(decor,deck,priority)
    {
        //decor：玩家要出的牌的花色
        //deck：玩家出的牌到的牌堆处：Deck类
        //priority：出的牌的显示优先级


        //出牌动作
        let action1=cc.rotateTo(0.5,this.angles);
        if(this.angles===75)
        {
            this.angles=-75;
        }
        this.angles+=30;
        let action2=cc.moveTo(0.5,250,200);
        let action=cc.spawn(action1,action2);
        //设置牌的优先级
        this.handcard[decor][this.top[decor]].card.setSiblingIndex(priority);

        //执行动作
        this.handcard[decor][this.top[decor]].card.runAction(action);

        //牌堆增加张数
        deck.add(this.handcard[decor][this.top[decor]]);

        //玩家对应花色手牌-1
        this.top[decor]--;
    }

    //UI效果，玩家手牌旁边的lables（也就是显示剩余几张的数字）
    labels(thi)
    {
        for (let i = 0;i <4; i++) {
            //0张的时候不显示
            if(this.top[i]===-1)
            {
                cc.log("wocao"+(i+(thi.turn-1)*4));
                thi.label[i+(thi.turn-1)*4].node.ative=false;
            }
            //大于0张，显示
            else
            {
                //数字为对应手牌张数+1，因为top是从-1开始的
                thi.label[i+(thi.turn-1)*4].node.getComponent(cc.Label).string=this.top[i]+1;
                thi.label[i+(thi.turn-1)*4].node.ative=true;
                thi.buttons[0].node.active=false;
                thi.buttons[2].node.active=false;
            }
        }
    }
};
module.exports=Person;