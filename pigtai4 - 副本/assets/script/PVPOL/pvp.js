let httpUtil = require("./HttpUtils")
let Player = require("./player.js")
cc.Class({
    extends: cc.Component,

    properties: {
        uid: '',
        isBegin: false,
        is_need_excute: true,
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
        priority: 50,
        me: null,
        opponent: null,
        deck: [],
        map: null,
        angles: 30,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let uuid = cc.find('dataNode').getComponent('dataNode').getData()
        this.uid = uuid
        this.me = new Player("me")
        this.opponent = new Player("opponent")
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
        let callback = function () {
            if (this.isBegin) {
                httpUtil.getLast(this.uid).then((response) => {
                    if (response.code == 200 && response.data.your_turn == true) {
                        cc.find("Canvas/打游戏背景图/摸牌").active = true
                        cc.find("Canvas/打游戏背景图/出牌").active = true
                        if (response.data.last_msg != '对局刚开始') {
                            if (this.is_need_excute) {
                                // 执行对手的UI
                                let last_code = response.data.last_code
                                let arr = last_code.split(" ")
                                let type = arr[1]
                                let cardStr = arr[2]
                                //翻牌
                                if (type == 0) {
                                    //翻牌UI
                                    let index = this.map.get(cardStr[0]) * 13 + this.map.get(cardStr[1]) - 1
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

                                    //逻辑判断是否吃牌
                                }
                                cc.log('对手:' + response.data.last_msg)
                                this.is_need_excute = false
                            }
                        }
                    }
                })
            }
        }
        this.schedule(callback, 2)

    },

    Begin() {
        httpUtil.getLast(this.uid).then((response) => {
            if (response.code == 200) {
                cc.find("Canvas/打游戏背景图/人没齐Label").active = false
                cc.find("Canvas/打游戏背景图/开始").active = false
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

    touchPoker() {
        httpUtil.touchPoker(this.uid).then((response) => {
            if (response.code == 200) {
                cc.find("Canvas/打游戏背景图/摸牌").active = false
                cc.find("Canvas/打游戏背景图/出牌").active = false
                let last_code = response.data.last_code
                let arr = last_code.split(" ")
                let cardStr = arr[2]

                cc.log(cardStr)
                cc.log(response.data.last_msg)

                //执行ui
                let index = this.map.get(cardStr[0]) * 13 + this.map.get(cardStr[1]) - 1
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

                //逻辑判断是否吃牌

                //设置是否需要执行对手的操作UI
                this.is_need_excute = true
                if (response.data.last_msg == '对局刚开始' && response.data.your_turn == false) {
                    this.is_need_excute = false
                }
            }
        })
    },

    start() {

    },

    // update(dt) {},
});
