let httpUtil = require("./HttpUtils")
let Player = require("./player.js")
let ai = require("./AIOL.js")
cc.Class({
    extends: cc.Component,

    properties: {
        uid: '',
        isBegin: false, //判断游戏是否开始
        is_need_excute: true, //判断是否需要执行对手的UI
        image: {
            default: [],
            type: cc.Prefab,
        },
        buttons: {
            default: [],
            type: cc.Button,
        },
        label: {
            default: [],
            type: cc.Label,
        },
        callback: function () { },
        priority: 50, //ui显示优先级
        me: null, //玩家对象
        opponent: null, //玩家对象
        deck: [],//牌堆 储存 cardStr 如'S8'
        map: null, //花色映射、点数映射
        angles: 30,
        cardNodes: [], //deck对应节点
        last_ui_excute: true, // 判断最后一步的ui是否需要执行
        over: false,
        now_decor: 5, //当前选中花色
        myHandCardNodes: [],//手牌对应节点
        opponentHandCardNodes: [],//对手手牌对应节点
        collocation: 0, //为1托管，0不托管
        ai: 0 //1为AI进行 0为玩家进行


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //获取uuid
        let uuid = cc.find('dataNode').getComponent('dataNode').getData()
        this.uid = uuid
        cc.find("Canvas/打游戏背景图/uuidLabel").getComponent(cc.Label).string = uuid

        this.me = new Player("me")
        this.opponent = new Player("opponent")
        //初始化映射关系
        this.map = new Map()
        this.map.set('D', 0)
        this.map.set('C', 1)
        this.map.set('H', 2)
        this.map.set('S', 3)
        this.map.set('1', 1)
        this.map.set('2', 2)
        this.map.set('3', 3)
        this.map.set('4', 4)
        this.map.set('5', 5)
        this.map.set('6', 6)
        this.map.set('7', 7)
        this.map.set('8', 8)
        this.map.set('9', 9)
        this.map.set('10', 10)
        this.map.set('J', 11)
        this.map.set('Q', 12)
        this.map.set('K', 13)
        //初始化节点数组
        for (let i = 0; i < 4; i++) {
            this.myHandCardNodes[i] = []
            this.opponentHandCardNodes[i] = []
        }
        //初始化按钮优先级
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].node.setSiblingIndex(10000);
        }
        //轮询函数
        this.callback = function () {
            if (this.isBegin) {
                httpUtil.getLast(this.uid).then((response) => {
                    //如果到你的回合 执行对手的ui
                    if (response.code == 200 && response.data.your_turn == true) {
                        if (response.data.last_msg != '对局刚开始') {
                            //如果需要执行ui
                            if (this.is_need_excute) {
                                // 执行对手的UI
                                let last_code = response.data.last_code
                                let arr = last_code.split(" ")
                                let type = arr[1]
                                let cardStr = arr[2]
                                //翻牌
                                if (type == 0) {
                                    //翻牌UI
                                    let index
                                    if (cardStr.length == 3) {
                                        index = this.map.get(cardStr[0]) * 13 + 10 - 1
                                    } else {
                                        index = this.map.get(cardStr[0]) * 13 + this.map.get(cardStr[1]) - 1
                                    }
                                    let cardNode = cc.instantiate(this.image[index])
                                    cardNode.setSiblingIndex(this.priority)
                                    this.priority++
                                    let touchcards = this.node.getChildByName("打游戏背景图");
                                    touchcards.addChild(cardNode);
                                    cardNode.x = 500;
                                    cardNode.y = 200;
                                    let action1 = cc.rotateTo(1, this.angles);
                                    if (this.angles === 90) {
                                        this.angles = -60;
                                    }
                                    this.angles += 30;
                                    let action2 = cc.moveTo(1, 250, 200);
                                    let action = cc.spawn(action1, action2);
                                    cardNode.runAction(action)
                                    this.label[8].getComponent(cc.Label).string -= 1
                                    this.cardNodes.push(cardNode)

                                    //逻辑判断是否吃牌
                                    if (this.deck.length == 0) {
                                        this.deck.push(cardStr)
                                    } else {
                                        let topCard = this.deck[this.deck.length - 1]
                                        if (topCard[0] == cardStr[0]) {
                                            this.deck.push(cardStr)
                                            this.scheduleOnce(function () {
                                                //将放置区中的牌放入手牌
                                                for (let i = this.deck.length - 1; i >= 0; i--) {
                                                    this.opponent.add(this.deck[i], this.map)
                                                    let action1 = cc.rotateTo(0.2, 0);
                                                    let action2;
                                                    let x = 40;
                                                    let index = this.map.get(this.deck[i][0])
                                                    x = x + 120 * (3 - index);
                                                    action2 = cc.moveTo(0.2, x, 360);
                                                    let action = cc.spawn(action1, action2);
                                                    this.cardNodes[i].setSiblingIndex(this.priority++)
                                                    this.cardNodes[i].runAction(action)
                                                    let decor = this.map.get(this.deck[i][0])

                                                    this.opponentHandCardNodes[decor].push(this.cardNodes[i])

                                                    this.deck.pop()
                                                    this.cardNodes.pop()

                                                    this.surplusOpponentLabel()
                                                }
                                            }, 1)


                                        } else { //如果与顶部牌花色不同则直接放入放置区
                                            this.deck.push(cardStr)
                                        }
                                    }
                                } else {  // 出牌
                                    //获取出牌的花色
                                    let decor = this.map.get(cardStr[0])
                                    //获取出的牌
                                    let index = this.opponent.handcard[decor].length - 1
                                    let card = this.opponent.handcard[decor][index]
                                    if (card == cardStr) {
                                        cc.log("Right")
                                    }
                                    //逻辑出牌
                                    this.opponent.handcard[decor].pop()

                                    //出牌ui
                                    index = this.opponentHandCardNodes[decor].length - 1
                                    let cardNode = this.opponentHandCardNodes[decor][index]
                                    this.opponentHandCardNodes[decor].pop()
                                    this.cardNodes.push(cardNode)
                                    let action1 = cc.rotateTo(0.5, this.opponent.angles);
                                    if (this.opponent.angles === 75) {
                                        this.opponent.angles = -75;
                                    }
                                    this.opponent.angles += 30;
                                    let action2 = cc.moveTo(0.5, 250, 200);
                                    let action = cc.spawn(action1, action2);
                                    cardNode.setSiblingIndex(this.priority)
                                    this.priority++
                                    cardNode.runAction(action)

                                    //更新对手剩余牌数
                                    this.surplusOpponentLabel()
                                    //逻辑判断是否吃牌
                                    if (this.deck.length == 0) {
                                        this.deck.push(cardStr)
                                    } else {
                                        let topCard = this.deck[this.deck.length - 1]
                                        if (topCard[0] == cardStr[0]) {
                                            this.deck.push(cardStr)
                                            this.scheduleOnce(function () {
                                                //将放置区中的牌放入手牌
                                                for (let i = this.deck.length - 1; i >= 0; i--) {
                                                    this.opponent.add(this.deck[i], this.map)
                                                    let action1 = cc.rotateTo(0.2, 0);
                                                    let action2;
                                                    let x = 40;
                                                    let index = this.map.get(this.deck[i][0])
                                                    x = x + 120 * (3 - index);
                                                    action2 = cc.moveTo(0.2, x, 360);
                                                    let action = cc.spawn(action1, action2);
                                                    this.cardNodes[i].setSiblingIndex(this.priority++)
                                                    this.cardNodes[i].runAction(action)
                                                    let decor = this.map.get(this.deck[i][0])

                                                    this.opponentHandCardNodes[decor].push(this.cardNodes[i])

                                                    this.deck.pop()
                                                    this.cardNodes.pop()

                                                    this.surplusOpponentLabel()
                                                }
                                            }, 1)
                                        } else {    //与顶部牌花色不同则直接放入放置区
                                            this.deck.push(cardStr)
                                        }
                                    }

                                }

                                this.is_need_excute = false
                                //调整按钮的交互性
                                this.scheduleOnce(function () {
                                    if (this.collocation == 0) { //如果不是托管状态
                                        cc.find("Canvas/打游戏背景图/摸牌").active = true
                                        cc.find("Canvas/打游戏背景图/出牌").active = true
                                        cc.find("Canvas/打游戏背景图/出牌").getComponent(cc.Button).interactable = false
                                    }

                                }, 1)
                            }
                        }
                        //托管则自动执行操作
                        if (this.collocation == 1) {
                            cc.find("Canvas/打游戏背景图/摸牌").active = false
                            cc.find("Canvas/打游戏背景图/出牌").active = false
                            for (let i = 0; i < 4; i++) {
                                this.buttons[i].getComponent(cc.Button).interactable = false;
                            }
                            let func = this.touchPoker
                            this.scheduleOnce(func, 1)
                        }
                    }
                    //如果对局已经结束 判断执行最后一步操作对应ui 显示结果
                    if (response.code == 400) {
                        httpUtil.getGameResult(this.uid).then((response) => {
                            this.over = true
                            let last = response.data.last
                            let arr = last.split(" ")
                            //如果是对面执行了最后一步则执行UI
                            if (arr[0] != this.me.p) {
                                let type = arr[1]
                                let cardStr = arr[2]
                                if (type == 0) {
                                    //翻牌UI
                                    let index
                                    if (cardStr.length == 3) {
                                        index = this.map.get(cardStr[0]) * 13 + 10 - 1
                                    } else {
                                        index = this.map.get(cardStr[0]) * 13 + this.map.get(cardStr[1]) - 1
                                    }
                                    let cardNode = cc.instantiate(this.image[index])
                                    cardNode.setSiblingIndex(this.priority)
                                    this.priority++
                                    let touchcards = this.node.getChildByName("打游戏背景图");
                                    touchcards.addChild(cardNode);
                                    cardNode.x = 500;
                                    cardNode.y = 200;
                                    let action1 = cc.rotateTo(1, this.angles);
                                    if (this.angles === 90) {
                                        this.angles = -60;
                                    }
                                    this.angles += 30;
                                    let action2 = cc.moveTo(1, 250, 200);
                                    let action = cc.spawn(action1, action2);
                                    cardNode.runAction(action)
                                    this.label[8].getComponent(cc.Label).string -= 1
                                    this.cardNodes.push(cardNode)

                                    //逻辑判断是否吃牌
                                    if (this.deck.length == 0) {
                                        this.deck.push(cardStr)
                                    } else {
                                        let topCard = this.deck[this.deck.length - 1]
                                        if (topCard[0] == cardStr[0]) {
                                            this.deck.push(cardStr)
                                            this.scheduleOnce(function () {

                                                for (let i = this.deck.length - 1; i >= 0; i--) {
                                                    this.opponent.add(this.deck[i], this.map)
                                                    let action1 = cc.rotateTo(0.2, 0);
                                                    let action2;
                                                    let x = 40;
                                                    let index = this.map.get(this.deck[i][0])
                                                    x = x + 120 * (3 - index);
                                                    action2 = cc.moveTo(0.2, x, 360);
                                                    let action = cc.spawn(action1, action2);
                                                    this.cardNodes[i].setSiblingIndex(this.priority++)
                                                    this.cardNodes[i].runAction(action)
                                                    let decor = this.map.get(this.deck[i][0])

                                                    this.opponentHandCardNodes[decor].push(this.cardNodes[i])

                                                    this.deck.pop()
                                                    this.cardNodes.pop()

                                                    this.surplusOpponentLabel()
                                                }
                                            }, 1)


                                        } else {
                                            this.deck.push(cardStr)
                                        }
                                    }
                                } else {  // 出牌
                                    //获取出牌的花色
                                    let decor = this.map.get(cardStr[0])
                                    //获取出的牌
                                    let index = this.opponent.handcard[decor].length - 1
                                    //逻辑出牌
                                    this.opponent.handcard[decor].pop()

                                    index = this.opponentHandCardNodes[decor].length - 1
                                    let cardNode = this.opponentHandCardNodes[decor][index]
                                    this.opponentHandCardNodes[decor].pop()
                                    this.cardNodes.push(cardNode)
                                    let action1 = cc.rotateTo(0.5, this.opponent.angles);
                                    if (this.opponent.angles === 75) {
                                        this.opponent.angles = -75;
                                    }
                                    this.opponent.angles += 30;
                                    let action2 = cc.moveTo(0.5, 250, 200);
                                    let action = cc.spawn(action1, action2);
                                    cardNode.setSiblingIndex(this.priority)
                                    this.priority++
                                    cardNode.runAction(action)

                                    //更新对手剩余牌数
                                    this.surplusOpponentLabel()
                                    //逻辑判断是否吃牌
                                    if (this.deck.length == 0) {
                                        this.deck.push(cardStr)
                                    } else {
                                        let topCard = this.deck[this.deck.length - 1]
                                        if (topCard[0] == cardStr[0]) {
                                            this.deck.push(cardStr)
                                            this.scheduleOnce(function () {
                                                for (let i = this.deck.length - 1; i >= 0; i--) {
                                                    this.opponent.add(this.deck[i], this.map)
                                                    let action1 = cc.rotateTo(0.2, 0);
                                                    let action2;
                                                    let x = 40;
                                                    let index = this.map.get(this.deck[i][0])
                                                    x = x + 120 * (3 - index);
                                                    action2 = cc.moveTo(0.2, x, 360);
                                                    let action = cc.spawn(action1, action2);
                                                    this.cardNodes[i].setSiblingIndex(this.priority++)
                                                    this.cardNodes[i].runAction(action)
                                                    let decor = this.map.get(this.deck[i][0])

                                                    this.opponentHandCardNodes[decor].push(this.cardNodes[i])

                                                    this.deck.pop()
                                                    this.cardNodes.pop()

                                                    this.surplusOpponentLabel()
                                                }
                                            }, 1)
                                        } else {
                                            this.deck.push(cardStr)
                                        }
                                    }

                                }
                            }
                            //取消轮询
                            this.unschedule(this.callback);
                            //显示结果
                            this.scheduleOnce(function () {
                                cc.find("Canvas/result").active = true
                                cc.find("Canvas/打游戏背景图/摸牌").active = false
                                cc.find("Canvas/打游戏背景图/出牌").active = false
                                this.buttons[0].getComponent(cc.Button).interactable = false;
                                this.buttons[1].getComponent(cc.Button).interactable = false;
                                this.buttons[2].getComponent(cc.Button).interactable = false;
                                this.buttons[3].getComponent(cc.Button).interactable = false;
                                cc.find("Canvas/result/你的剩余手牌").getComponent(cc.Label).string += this.me.sum()
                                cc.find("Canvas/result/对方剩余手牌").getComponent(cc.Label).string += this.opponent.sum()
                                if (this.me.sum() < this.opponent.sum()) {
                                    cc.find("Canvas/result/胜利").getComponent(cc.Label).string = "你输了QAQ"
                                } else if (this.me.sum() == this.opponent.sum()) {
                                    cc.find("Canvas/result/胜利").getComponent(cc.Label).string = "平局！"
                                } else {
                                    cc.find("Canvas/result/胜利").getComponent(cc.Label).string = "你赢了 O(∩_∩)O"
                                }
                            }, 1)
                        })
                    }
                })
            }
        }

        //每2s轮询一次接口
        this.schedule(this.callback, 2)

    },

    //开始按钮点击事件
    Begin() {
        httpUtil.getLast(this.uid).then((response) => {
            if (response.code == 200) {
                if (response.data.last_msg == '对局刚开始' && response.data.your_turn == true) {
                    this.me.p = 0
                    this.opponent.p = 1
                    this.is_need_excute = false
                    cc.find("Canvas/打游戏背景图/摸牌").active = true
                    cc.find("Canvas/打游戏背景图/出牌").active = true
                    cc.find("Canvas/打游戏背景图/托管").active = true
                    cc.find("Canvas/打游戏背景图/出牌").getComponent(cc.Button).interactable = false
                } else if (response.data.last_msg == '对局刚开始' && response.data.your_turn == false) {
                    this.me.p = 1
                    this.opponent.p = 0
                }
                cc.find("Canvas/打游戏背景图/人没齐Label").active = false
                cc.find("Canvas/打游戏背景图/开始").active = false
                cc.find("Canvas/打游戏背景图/托管").active = true
                this.isBegin = true
            }
            if (response.code == 403) {
                cc.find("Canvas/打游戏背景图/人没齐Label").active = true
                setTimeout(function () {
                    cc.find("Canvas/打游戏背景图/人没齐Label").active = false
                }, 2000)
            }
        })
    },

    //摸牌按钮点击事件
    touchPoker() {
        //暂停轮询
        this.unschedule(this.callback)
        //调整按钮交互性
        cc.find("Canvas/打游戏背景图/摸牌").active = false
        cc.find("Canvas/打游戏背景图/出牌").active = false

        httpUtil.touchPoker(this.uid).then((response) => {
            if (response.code == 200) {

                let last_code = response.data.last_code
                let arr = last_code.split(" ")
                let cardStr = arr[2]

                //执行ui
                let index
                if (cardStr.length == 3) {
                    index = this.map.get(cardStr[0]) * 13 + 10 - 1
                } else {
                    index = this.map.get(cardStr[0]) * 13 + this.map.get(cardStr[1]) - 1
                }
                let cardNode = cc.instantiate(this.image[index])
                cardNode.setSiblingIndex(this.priority)
                this.priority++
                let touchcards = this.node.getChildByName("打游戏背景图");
                touchcards.addChild(cardNode);
                cardNode.x = 500;
                cardNode.y = 200;
                let action1 = cc.rotateTo(1, this.angles);
                if (this.angles === 90) {
                    this.angles = -60;
                }
                this.angles += 30;
                let action2 = cc.moveTo(1, 250, 200);
                let action = cc.spawn(action1, action2);
                cardNode.runAction(action)
                this.label[8].getComponent(cc.Label).string -= 1
                this.cardNodes.push(cardNode)

                //逻辑判断是否吃牌
                if (this.deck.length == 0) {
                    this.deck.push(cardStr)
                } else {
                    let topCard = this.deck[this.deck.length - 1]
                    if (topCard[0] == cardStr[0]) {
                        this.deck.push(cardStr)
                        this.scheduleOnce(function () {
                            //将放置区的牌放入手牌
                            for (let i = this.deck.length - 1; i >= 0; i--) {
                                this.me.add(this.deck[i], this.map)
                                let action1 = cc.rotateTo(0.2, 0);
                                let action2;
                                let x = 40;
                                let index = this.map.get(this.deck[i][0])
                                x = x + 120 * index;
                                action2 = cc.moveTo(0.2, x, 15);
                                let action = cc.spawn(action1, action2);
                                this.cardNodes[i].setSiblingIndex(this.priority++)
                                this.cardNodes[i].runAction(action)
                                let decor = this.map.get(this.deck[i][0])

                                this.myHandCardNodes[decor].push(this.cardNodes[i])

                                this.deck.pop()
                                this.cardNodes.pop()

                                //更新剩余手牌数
                                this.surplusLabel()
                                //更新按钮状态
                                this.activationcard()
                            }
                        }, 1)
                    } else {
                        this.deck.push(cardStr)
                    }
                }

                //设置是否需要执行对手的操作UI
                this.is_need_excute = true
                if (response.data.last_msg == '对局刚开始' && response.data.your_turn == false) {
                    this.is_need_excute = false
                }
                //重新开启轮询
                this.schedule(this.callback, 2)
            }
        })
    },

    //激活按钮
    activationcard() {
        cc.find("Canvas/打游戏背景图/摸牌").getComponent(cc.Button).interactable = true
        cc.find("Canvas/打游戏背景图/出牌").getComponent(cc.Button).interactable = false
        for (let i = 0; i < 4; i++) {
            if (this.me.handcard[i].length > 0) {
                this.buttons[i].getComponent(cc.Button).interactable = true;
            } else {
                this.buttons[i].getComponent(cc.Button).interactable = false;
            }
        }
    },

    //点击手牌的点击事件
    beforeactivationdiscard(event, number) {
        // 选中牌的ui效果
        this.now_decor = parseInt(number);
        let x = 40;
        x = x + 120 * this.now_decor;
        let action = cc.moveTo(0.1, x, 40);
        let index = this.myHandCardNodes[this.now_decor].length - 1
        this.myHandCardNodes[this.now_decor][index].runAction(action);

        this.scheduleOnce(function () {
            this.buttons[4 + this.now_decor].node.active = true;
            this.buttons[this.now_decor].node.active = false;
            this.activationdiscard();
        }, 0.1);
    },

    //使按钮失效
    activationdiscard() {
        cc.find("Canvas/打游戏背景图/摸牌").getComponent(cc.Button).interactable = false
        cc.find("Canvas/打游戏背景图/出牌").getComponent(cc.Button).interactable = true
        this.buttons[0].getComponent(cc.Button).interactable = false;
        this.buttons[1].getComponent(cc.Button).interactable = false;
        this.buttons[2].getComponent(cc.Button).interactable = false;
        this.buttons[3].getComponent(cc.Button).interactable = false;
    },

    //取消选中的手牌
    canceldiscard() {
        //ui效果
        let x = 40;
        x = x + 120 * this.now_decor;
        let action = cc.moveTo(0.1, x, 15);
        let index = this.myHandCardNodes[this.now_decor].length - 1
        this.myHandCardNodes[this.now_decor][index].runAction(action);

        this.scheduleOnce(function () {
            this.buttons[4 + this.now_decor].node.active = false;
            this.buttons[this.now_decor].node.active = true;
            this.activationcard();
        }, 0.1);
    },

    //出牌按钮点击事件
    putPoker() {
        //暂停轮询
        this.unschedule(this.callback)

        //调整按钮的交互性
        cc.find("Canvas/打游戏背景图/摸牌").active = false
        cc.find("Canvas/打游戏背景图/出牌").active = false
        this.buttons[4 + this.now_decor].node.active = false;
        this.buttons[0].node.active = false;
        this.buttons[1].node.active = false;
        this.buttons[2].node.active = false;
        this.buttons[3].node.active = false;
        cc.find("Canvas/打游戏背景图/出牌").getComponent(cc.Button).interactable = false

        //逻辑出牌
        let cardStr = this.me.handcard[this.now_decor][this.me.handcard[this.now_decor].length - 1]
        httpUtil.putPoker(cardStr, this.uid).then((response) => {
            cc.log(response)
            if (response.code == 200) {
                this.me.handcard[this.now_decor].pop()
                //出牌UI
                let index = this.myHandCardNodes[this.now_decor].length - 1
                let cardNode = this.myHandCardNodes[this.now_decor][index]
                this.myHandCardNodes[this.now_decor].pop()
                this.cardNodes.push(cardNode)
                let action1 = cc.rotateTo(0.5, this.me.angles);
                if (this.me.angles === 75) {
                    this.me.angles = -75;
                }
                this.me.angles += 30;
                let action2 = cc.moveTo(0.5, 250, 200);
                let action = cc.spawn(action1, action2);
                cardNode.setSiblingIndex(this.priority)
                this.priority++
                cardNode.runAction(action)

                //更新剩余手牌数
                this.surplusLabel()

                //逻辑判断是否吃牌
                if (this.deck.length == 0) {
                    this.deck.push(cardStr)
                } else {
                    let topCard = this.deck[this.deck.length - 1]
                    if (topCard[0] == cardStr[0]) {
                        this.deck.push(cardStr)
                        this.scheduleOnce(function () {
                            //将放置区的牌置入手牌
                            for (let i = this.deck.length - 1; i >= 0; i--) {
                                this.me.add(this.deck[i], this.map)

                                //ui效果
                                let action1 = cc.rotateTo(0.2, 0);
                                let action2;
                                let x = 40;
                                let index = this.map.get(this.deck[i][0])
                                x = x + 120 * index;
                                action2 = cc.moveTo(0.2, x, 15);
                                let action = cc.spawn(action1, action2);
                                this.cardNodes[i].setSiblingIndex(this.priority++)
                                this.cardNodes[i].runAction(action)

                                let decor = this.map.get(this.deck[i][0])
                                this.myHandCardNodes[decor].push(this.cardNodes[i])

                                this.deck.pop()
                                this.cardNodes.pop()
                                //更新剩余手牌数
                                this.surplusLabel()
                                //更新按钮状态
                                this.activationcard()
                            }
                        }, 1)
                    } else {
                        this.deck.push(cardStr)
                    }
                }

                //设置是否需要执行对手UI
                this.is_need_excute = true
                //重新开启轮询
                this.schedule(this.callback, 2)
                //调整按钮交互性
                this.activationcard()
                this.buttons[0].node.active = true;
                this.buttons[1].node.active = true;
                this.buttons[2].node.active = true;
                this.buttons[3].node.active = true;
            }
        })


    },

    //更新手牌剩余数量
    surplusLabel() {
        for (let i = 0; i < 4; i++) {
            if (this.me.handcard[i].length > 0) {
                this.label[i].node.getComponent(cc.Label).string = this.me.handcard[i].length;
                this.label[i].node.active = true;
            }
            else {
                this.label[i].node.active = false;
            }
        }
    },

    //更新对手手牌剩余数量
    surplusOpponentLabel() {
        for (let i = 4; i < 8; i++) {
            if (this.opponent.handcard[i - 4].length > 0) {
                this.label[i].node.getComponent(cc.Label).string = this.opponent.handcard[i - 4].length;
                this.label[i].node.active = true;
            }
            else {
                this.label[i].node.active = false;
            }
        }
    },


    start() {

    },

    //返回房间列表
    turnback() {
        cc.director.loadScene("roomList")
    },

    //托管按钮的点击事件
    AIcollocation() {
        this.unschedule(this.callback)
        if (this.collocation == 0) {
            cc.find("Canvas/打游戏背景图/摸牌").active = false
            cc.find("Canvas/打游戏背景图/出牌").active = false
            for (let i = 0; i < 4; i++) {
                this.buttons[i].getComponent(cc.Button).interactable = false;
            }
            cc.find("Canvas/打游戏背景图/托管/Background/Label").getComponent(cc.Label).string = '取消托管'
            this.collocation = 1
        } else {
            this.activationcard()
            this.collocation = 0
            cc.find("Canvas/打游戏背景图/托管/Background/Label").getComponent(cc.Label).string = '托管'
        }
        this.schedule(this.callback, 2)

    },

    // update(dt) {},
});
