// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let Pokers=require("Pokers");
let Person=require("Person");
let Deck=require("Deck");
let Card=require("Card");
let Tool=require("Tool");
let myreferee=require("myReferee");
cc.Class({
    extends: cc.Component,
    properties: {
        image:{
            default:[],
            type:cc.Prefab,
        },
        buttons:{
            default:[],
            type: cc.Button,
        },
        label:{
            default:[],
            type:cc.Label,
        },
        pokers:null,
        pokersorder:null,
        p1:null,
        p2:null,
        turn:1,
        angles:30,
        deck:null,
        priority:50,
        now_decor:5,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.pokers=new Pokers(52);
        this.pokersorder=this.pokers.Pokerorder();
        this.p1=new Person("p1");
        this.p2=new Person("p2");
        let array=[];
        this.deck=new Deck(array);
        this.buttons[0].node.on("click",this.Touchcards,this);
        this.buttons[1].node.on("click",this.discard,this);
        this.buttons[2].node.on("click",this.Touchcards,this);
        this.buttons[3].node.on("click",this.discard,this);
        for (let i = 4; i < 20; i++) {
            this.buttons[i].node.setSiblingIndex(10000);
        }
        this.surplusdeck();
    },

    start () {
    },
    Touchcards() {
        myreferee.isTouchcards(this);
        // this.buttonfalse();
        // let touchcards = this.node.getChildByName("打游戏背景图");
        // let card = cc.instantiate(this.image[this.pokersorder[this.pokers.pokertouched]]);
        // card.setSiblingIndex(this.priority);
        // this.priority++;
        // touchcards.addChild(card);
        // card.x = 500;
        // card.y = 200;
        // let newcard=new Card(card,this.pokersorder[this.pokers.pokertouched]);
        // this.deck.add(newcard);
        // this.pokers.pokertouched++;
        // this.surplusdeck();
        // let action1=cc.rotateTo(1,this.angles);
        // if(this.angles===90)
        // {
        //     this.angles=-60;
        // }
        // this.angles+=30;
        // let action2=cc.moveTo(1,250,200);
        // let action=cc.spawn(action1,action2);
        // card.runAction(action);
        // this.scheduleOnce(function () {
        //     let flag=0;
        //     if(this.deck.judge())
        //     {
        //         if(this.turn===1)
        //             this.deck.eat(this.turn,this.p1,this.priority);
        //         else
        //             this.deck.eat(this.turn,this.p2,this.priority);
        //         this.priority++;
        //         this.activationcard();
        //         flag=1;
        //         this.surpluslabel();
        //     }
        //     if(this.pokers.pokertouched===this.pokers.number)
        //     {
        //         if(flag===1)
        //         this.scheduleOnce(function () {
        //             this.gameover();
        //         },0.2);
        //         else
        //             this.gameover();
        //     }
        //     this.buttontrue();
        // },1)
    },
    discard()
    {
        this.buttons[12+(this.turn-1)*4+this.now_decor].node.active=false;
        myreferee.Isdiscard(this);
        // this.buttonfalse();
        // cc.log(this.now_decor);
        // myreferee.isdicard(this);
        // this.surpluslabel();
        // this.scheduleOnce(function () {
        //     if(this.deck.judge())
        //     {
        //         if(this.turn===1)
        //         {
        //             this.deck.eat(this.turn,this.p1,this.priority);
        //         }
        //         else
        //         {
        //             this.deck.eat(this.turn,this.p2,this.priority);
        //         }
        //         this.priority++;
        //         this.surpluslabel();
        //     }
        //     this.activationcard();
        //     this.buttontrue();
        // },0.5)
    },
    activationcard()
    {
       if(this.turn===1)
       {
           this.buttons[0].getComponent(cc.Button).interactable=true;
           this.buttons[1].getComponent(cc.Button).interactable=false;
           for (let i = 0; i <4 ; i++) {
               cc.log(this.p1.top[i]);
               if (this.p1.top[i] != -1)
                   this.buttons[4+i].getComponent(cc.Button).interactable=true;
               else
                   this.buttons[4+i].getComponent(cc.Button).interactable=false;
           }
       }
       else
       {
           this.buttons[3].getComponent(cc.Button).interactable=false;
           this.buttons[2].getComponent(cc.Button).interactable=true;
           for (let i = 0; i <4 ; i++) {
               cc.log(this.p2.top[i]);
               if (this.p2.top[i] != -1)
                   this.buttons[8+i].getComponent(cc.Button).interactable=true;
               else
                   this.buttons[8+i].getComponent(cc.Button).interactable=false;
           }
       }
    },
    beforeactivationdiscard(event,number)
    {
        this.now_decor=parseInt(number);
        cc.log(12+(this.turn-1)*4+this.now_decor);
        let x=40;
        if(this.turn===1)
        {
            x=x+120*this.now_decor;
            let action=cc.moveTo(0.1,x,40);
            this.p1.handcard[this.now_decor][this.p1.top[this.now_decor]].card.runAction(action);
        }
        else
        {
            x=x+120*(3-this.now_decor);
            let action=cc.moveTo(0.1,x,335);
            this.p2.handcard[this.now_decor][this.p2.top[this.now_decor]].card.runAction(action);

        }
        this.scheduleOnce(function () {
            this.buttons[12+(this.turn-1)*4+this.now_decor].node.active=true;
            this.buttons[4+(this.turn-1)*4+this.now_decor].node.active=false;
            this.activationdiscard();
        },0.1);
    },
    canceldiscard()
    {
        let x=40;
        if(this.turn===1)
        {
            x=x+120*this.now_decor;
            let action=cc.moveTo(0.1,x,15);
            this.p1.handcard[this.now_decor][this.p1.top[this.now_decor]].card.runAction(action);
        }
        else
        {
            x=x+120*(3-this.now_decor);
            let action=cc.moveTo(0.1,x,360);
            this.p2.handcard[this.now_decor][this.p2.top[this.now_decor]].card.runAction(action);

        }
        this.scheduleOnce(function () {
            this.buttons[12+(this.turn-1)*4+this.now_decor].node.active=false;
            this.buttons[4+(this.turn-1)*4+this.now_decor].node.active=true;
            this.activationcard();
        },0.1);
    },
    activationdiscard()
    {
       if(this.turn===1)
       {
           this.buttons[0].getComponent(cc.Button).interactable=false;
           this.buttons[1].getComponent(cc.Button).interactable=true;
           this.buttons[4].getComponent(cc.Button).interactable=false;
           this.buttons[5].getComponent(cc.Button).interactable=false;
           this.buttons[6].getComponent(cc.Button).interactable=false;
           this.buttons[7].getComponent(cc.Button).interactable=false;
       }
       else
       {
           this.buttons[2].getComponent(cc.Button).interactable=false;
           this.buttons[3].getComponent(cc.Button).interactable=true;
           this.buttons[8].getComponent(cc.Button).interactable=false;
           this.buttons[9].getComponent(cc.Button).interactable=false;
           this.buttons[10].getComponent(cc.Button).interactable=false;
           this.buttons[11].getComponent(cc.Button).interactable=false;
       }
    },
    buttontrue()
    {
        if(this.turn===1)
        {
            this.buttons[2].node.active=true;
            this.buttons[3].node.active=true;
            this.buttons[8].node.active=true;
            this.buttons[9].node.active=true;
            this.buttons[10].node.active=true;
            this.buttons[11].node.active=true;
            this.turn=2;
        }
        else
        {
            this.buttons[1].node.active=true;
            this.buttons[0].node.active=true;
            this.buttons[4].node.active=true;
            this.buttons[5].node.active=true;
            this.buttons[6].node.active=true;
            this.buttons[7].node.active=true;
            this.turn=1;
        }
    },
    buttonfalse()
    {
        cc.log("???????");
        if(this.turn===1)
        {
            this.buttons[0].node.active=false;
            this.buttons[1].node.active=false;
            this.buttons[4].node.active=false;
            this.buttons[5].node.active=false;
            this.buttons[6].node.active=false;
            this.buttons[7].node.active=false;
        }
        else
        {
            this.buttons[2].node.active=false;
            this.buttons[3].node.active=false;
            this.buttons[8].node.active=false;
            this.buttons[9].node.active=false;
            this.buttons[10].node.active=false;
            this.buttons[11].node.active=false;
        }
    },
    surpluslabel()
    {
        if(this.turn===1)
        {
            for (let i = 0; i < 4; i++) {
                if(this.p1.top[i]===-1)
                    this.label[i].node.active=false;
                else
                {
                    this.label[i].node.getComponent(cc.Label).string=this.p1.top[i]+1;
                    this.label[i].node.active=true;
                }
            }
        }
        else
        {
            for (let i = 0; i < 4; i++) {
                if(this.p2.top[i]===-1)
                    this.label[i+4].node.active=false;
                else
                {
                    this.label[i+4].node.getComponent(cc.Label).string=this.p2.top[i]+1;
                    this.label[i+4].node.active=true;
                }
            }
        }
    },
    surplusdeck()
    {
        this.label[8].node.getComponent(cc.Label).string=this.pokers.number-this.pokers.pokertouched;
        this.label[9].node.getComponent(cc.Label).string=this.pokers.number-this.pokers.pokertouched;
    },
    gameover()
    {
        cc.director.pause();
        this.buttons[0].getComponent(cc.Button).interactable=false;
        this.buttons[2].getComponent(cc.Button).interactable=false;
        myreferee.isgameover(this);
    },
    restart()
    {
        cc.director.resume();
        cc.director.loadScene("Man combat");
    }
    // update (dt) {},
});
