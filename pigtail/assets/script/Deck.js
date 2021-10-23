let AI=require("AI");
//牌堆：放置区内的牌
class Deck{
    constructor(array)
    {
        //array：牌堆的每张牌组成的数组
        //top：牌堆最上面那张牌所在数组下标
        //topdecor：牌堆最上面那张牌的花色：0,1,2,3
        this.array=array;
        this.top=-1;
        this.topdecor=-1;
    }
    //牌堆增加牌，玩家出牌或摸牌
    add(card)
    {
        //card：单张扑克牌对象，Card类
        this.top++;
        this.array[this.top]=card;
        this.topdecor=card.decor;
    }
    //玩家吃牌
    //turn=1，玩家1，turn=2，玩家2
    //person，详见Person类，传参P1,P2
    eat(turn,person,priority)
    {
        //吃完所有的牌，就没牌，也就没花色了，-1；
        this.topdecor=-1;
        //牌堆的牌，运动到玩家手牌的函数
        this.run(turn,person,priority);
        //牌堆已经没牌了，ai把之前记录牌堆的参数删去
        AI.initialize();
    }

    //判断玩家出的牌或者摸的牌，是否和牌顶的花色相同
    judge()
    {
        //牌堆要有牌的时候才可能相同
        if(this.top>=1)
        {
            if(this.array[this.top].decor===this.array[this.top-1].decor)
            return true;
            else
            {
                return false;
            }
        }
        return false;
    }

    //牌堆的牌，运动到玩家手牌
    run(turn,person,priority)
    {
        //turn=1，玩家1，turn=2，玩家2
        //person，详见Person类，传参P1,P2
        //priority，牌的显示优先级

        //玩家增加手牌的函数
        person.add(this.array[this.top]);

        //如何运动
        let action1=cc.rotateTo(0.2,0);
        let action2;
        let x=40;
        //玩家1
        if(turn===1)
        {
            x=x+120*this.array[this.top].decor;
            action2=cc.moveTo(0.2,x,15);
        }
        //玩家2
        else
        {
            x=x+120*(3-this.array[this.top].decor);
            action2=cc.moveTo(0.2,x,360);
        }
        //平移和旋转的动作，同时进行
        let action=cc.spawn(action1,action2);

        //设置牌的显示优先级，不然可能会被覆盖
        this.array[this.top].card.setSiblingIndex(priority);

        //执行动作
        this.array[this.top].card.runAction(action);

        //执行下一张牌的运动，直到牌堆没有牌为止
        this.top--;
        if(this.top!=-1)
        this.run(turn,person,priority);
    }
}
module.exports=Deck;
