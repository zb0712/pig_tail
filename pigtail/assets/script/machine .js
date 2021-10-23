// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

//Pokers：一副扑克牌类
let Pokers=require("Pokers");
//Person：玩家类
let Person=require("Person");
//Deck：牌堆类
let Deck=require("Deck");
//Card：一张扑克牌类
let Card=require("Card");
//Tool：工具对象
let Tool=require("Tool");
//myreferee：裁判对象
let myreferee=require("myReferee");
//AI：ai对象
let AI=require("AI");
cc.Class({
    extends: cc.Component,

    properties: {
        image:{
            default:[],
            type:cc.Prefab,
            //每张牌的预制体，便于生成
            //下标0-12为方块，13-25为梅花，26到38为红心，39-51为黑桃
        },
        buttons:{
            default:[],
            type: cc.Button,
            //按钮
            //buttons[0]：p1摸牌
            //buttons[1]：p1出牌
            //其他按钮为选中花色和取消花色
        },
        label:{
            default:[],
            type:cc.Label,
        },
        pokers:null,//一副扑克牌对象
        pokersorder:null,//扑克牌洗牌后的顺序
        p1:null,//玩家1对象
        p2:null,//玩家2对象
        turn:1,//turn=1，此时为玩家1操作，turn=2，此时为玩家2操作
        angles:30,//卡牌运动的角度，让UI效果好一点点
        deck:null,//牌堆对象
        priority:50,//优先级，用于扑克牌的显示优先级（后出的覆盖之前出的）
        now_decor:5,//当前选中的花色，用于出牌
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //生成52张扑克牌
        this.pokers=new Pokers(52);
        //洗牌
        this.pokersorder=this.pokers.Pokerorder();
        //生成玩家1、2
        this.p1=new Person("p1");
        this.p2=new Person("p2");
        let array=[];
        //生成牌堆对象
        this.deck=new Deck(array);
        //buttons[0]：p1摸牌
        //buttons[1]：p1出牌
        this.buttons[0].node.on("click",this.Touchcards,this);
        this.buttons[1].node.on("click",this.discard,this);
        //每个玩家选中花色的按钮的优先级是最高的
        for (let i = 2; i <10 ; i++) {
            this.buttons[i].node.setSiblingIndex(10000);
        }
        //生成扑克牌还剩余几张的图像
        this.surplusdeck();
        //AI初始化
        AI.initialize();
    },
    start () {

    },
    //摸牌
    Touchcards() {
        myreferee.isTouchcards(this);
        if(this.deck.topdecor!=-1)
        {
            AI.exceptdeckpokersum[this.deck.topdecor]--;
        }
    },
    //出牌
    discard()
    {
        this.buttons[6+this.now_decor].node.active=false;
        myreferee.Isdiscard(this);
    },
    //判断有无手牌，使选中花色的按钮交互性
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


    //点击某种花色按钮，让出牌的交互性生效
    beforeactivationdiscard(event,number)
    {
        //告诉你现在选中什么花色
        this.now_decor=parseInt(number);
        let x=40;
        //让选中的手牌向上运动，意思是选中
        if(this.turn===1)
        {
            x=x+120*this.now_decor;
            let action=cc.moveTo(0.1,x,40);
            this.p1.handcard[this.now_decor][this.p1.top[this.now_decor]].card.runAction(action);
        }
        this.scheduleOnce(function () {
            //禁用选中花色的按钮，启用取消选中花色的按钮
             this.buttons[6+this.now_decor].node.active=true;
             this.buttons[2+this.now_decor].node.active=false;
            this.activationdiscard();
        },0.1);
    },

    //取消出牌，让出牌的交互性失效
    canceldiscard()
    {
        let x=40;
        //让取消选中的手牌向下运动，意思是取消选中
        if(this.turn===1)
        {
            x=x+120*this.now_decor;
            let action=cc.moveTo(0.1,x,15);
            this.p1.handcard[this.now_decor][this.p1.top[this.now_decor]].card.runAction(action);
        }
        this.scheduleOnce(function () {
            //禁用取消选中花色的按钮，启用选中花色的按钮
            this.buttons[6+this.now_decor].node.active=false;
            this.buttons[2+this.now_decor].node.active=true;
            this.activationcard();
        },0.1);
    },

    //让出牌按钮可以被交互，一旦被交互，摸牌和选牌就禁用了
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

    //自己的回合结束后，让自己的按钮消失
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

    //AI的回合结束后，让自己的按钮显现
    //如果是自己的回合结束，则进行AI算法
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

    //手牌剩下几张的显示
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

    //显示可以被摸扑克牌还剩余几张
    surplusdeck()
    {
        this.label[8].node.getComponent(cc.Label).string=this.pokers.number-this.pokers.pokertouched;
        this.label[9].node.getComponent(cc.Label).string=this.pokers.number-this.pokers.pokertouched;
    },

    //游戏结束
    gameover()
    {
        cc.director.pause();
        this.buttons[0].getComponent(cc.Button).interactable=false;
        myreferee.isgameover(this);
    },

    //再次进行游戏，”再来一局“的按钮绑定
    restart()
    {
        cc.director.resume();
        cc.director.loadScene("Man machine combat");
    },


    //ai算法，为了更好的UI效果，延迟0.5秒
    ai()
    {
        this.scheduleOnce(function () {
            AI.AIing(this);
        },0.5);
    },

    //返回主菜单
    tomain()
    {
        cc.director.loadScene("Main");
    },
    // update (dt) {},
});
