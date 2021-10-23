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
let AI=require("AI");
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
        for (let i = 2; i <10 ; i++) {
            this.buttons[i].node.setSiblingIndex(10000);
        }
        this.surplusdeck();
        AI.initialize();
    },
    start () {

    },
    Touchcards() {
        myreferee.isTouchcards(this);
        if(this.deck.topdecor!=-1)
        {
            AI.exceptdeckpokersum[this.deck.topdecor]--;
        }
    },
    discard()
    {
        this.buttons[6+this.now_decor].node.active=false;
        myreferee.Isdiscard(this);
    },
    activationcard()
    {
        if(this.turn===1)
        {
            this.buttons[0].getComponent(cc.Button).interactable=true;
            this.buttons[1].getComponent(cc.Button).interactable=false;
            for (let i = 0; i <4 ; i++) {
                if (this.p1.top[i] != -1)
                    this.buttons[2+i].getComponent(cc.Button).interactable=true;
                else
                    this.buttons[2+i].getComponent(cc.Button).interactable=false;
            }
        }
    },
    beforeactivationdiscard(event,number)
    {
        this.now_decor=parseInt(number);
        let x=40;
        if(this.turn===1)
        {
            x=x+120*this.now_decor;
            let action=cc.moveTo(0.1,x,40);
            this.p1.handcard[this.now_decor][this.p1.top[this.now_decor]].card.runAction(action);
        }
        this.scheduleOnce(function () {
             this.buttons[6+this.now_decor].node.active=true;
             this.buttons[2+this.now_decor].node.active=false;
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
        this.scheduleOnce(function () {
            this.buttons[6+this.now_decor].node.active=false;
            this.buttons[2+this.now_decor].node.active=true;
            this.activationcard();
        },0.1);
    },
    activationdiscard()
    {
        if(this.turn===1)
        {
            this.buttons[0].getComponent(cc.Button).interactable=false;
            this.buttons[1].getComponent(cc.Button).interactable=true;
            this.buttons[2].getComponent(cc.Button).interactable=false;
            this.buttons[3].getComponent(cc.Button).interactable=false;
            this.buttons[4].getComponent(cc.Button).interactable=false;
            this.buttons[5].getComponent(cc.Button).interactable=false;
        }
    },
    buttonfalse(){
        if(this.turn===1)
        {
            this.buttons[0].node.active=false;
            this.buttons[1].node.active=false;
            this.buttons[2].node.active=false;
            this.buttons[3].node.active=false;
            this.buttons[4].node.active=false;
            this.buttons[5].node.active=false;
        }

    },
    buttontrue(){
        if(this.turn===2)
        {
            this.buttons[0].node.active=true;
            this.buttons[1].node.active=true;
            this.buttons[2].node.active=true;
            this.buttons[3].node.active=true;
            this.buttons[4].node.active=true;
            this.buttons[5].node.active=true;
            this.turn=1;
        }
        else
        {
            this.turn=2;
            this.ai();
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
        myreferee.isgameover(this);
    },
    restart()
    {
        cc.director.resume();
        cc.director.loadScene("Man machine combat");
    },
    ai()
    {
        this.scheduleOnce(function () {
            AI.AIing(this);
        },0.5);
    }
    // update (dt) {},
});
