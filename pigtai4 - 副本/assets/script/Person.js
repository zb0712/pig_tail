class Person{
    constructor(name)
    {
        this.name=name;
        this.handcard=[];
        this.top=[];
        for (let i = 0; i < 4; i++) {
            this.handcard[i] = [];
            this.top[i]=-1;
        }
        this.angles=15;

    }
    add(card)
    {
        this.top[card.decor]++;
        this.handcard[card.decor][this.top[card.decor]]=card;
    }


    sum()
    {
        return this.top[0]+this.top[1]+this.top[2]+this.top[3]+4;
    }


    delete(decor,deck,priority)
    {
        let action1=cc.rotateTo(0.5,this.angles);
        if(this.angles===75)
        {
            this.angles=-75;
        }
        this.angles+=30;
        let action2=cc.moveTo(0.5,250,200);
        let action=cc.spawn(action1,action2);
        this.handcard[decor][this.top[decor]].card.setSiblingIndex(priority);
        this.handcard[decor][this.top[decor]].card.runAction(action);
        deck.add(this.handcard[decor][this.top[decor]]);
        this.top[decor]--;
    }

    labels(thi)
    {
        cc.log("hhhhhhhhhh");
        for (let i = 0;i <4; i++) {
            if(this.top[i]===-1)
            {
                cc.log("wocao"+(i+(thi.turn-1)*4));
                thi.label[i+(thi.turn-1)*4].node.ative=false;
            }
            else
            {
                cc.log("woqu"+(i+(thi.turn-1)*4));
                thi.label[i+(thi.turn-1)*4].node.getComponent(cc.Label).string=this.top[i]+1;
                thi.label[i+(thi.turn-1)*4].node.ative=true;
                thi.buttons[0].node.active=false;
                thi.buttons[2].node.active=false;
            }
        }
    }
};
module.exports=Person;