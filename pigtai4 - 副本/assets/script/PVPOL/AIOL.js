//ai类机器人

var AI = {

    opponent_sum: 0, //p1当前手牌
    opponent_handcard: [], //数组，p1当前手牌每种花色的张数
    mysum: 0, // AI当前手牌总数
    myhandcard: [], //AI当前手牌每种花色的张数
    decksum: 0, //牌堆当前总张数
    deckdecor: -1, //牌堆当前牌顶花色
    pokersum: 0, //扑克牌还可以摸的张数
    mydecor: -1, //AI要出的牌的花色
    pokersremain: [], // 数组，扑克牌还可以摸的每种花色的张数
    exceptdeckpokersum: [], //除去牌堆，扑克牌每种花色的张数
    discarddecor: [],//从少到多记录可以摸的扑克牌的花色张数，用来判断当前AI最适合出的牌
    a: [], //临时数组

    //初始化除去牌堆，扑克牌每种花色的张数，13张
    initialize: function () {
        for (let i = 0; i < 4; i++) {
            this.exceptdeckpokersum[i] = 13;
        }
    },

    //从对局中收集信息，给上面定义的参数赋值
    collect: function (thi) {
        for (let i = 0; i < 4; i++) {
            this.opponent_handcard[i] = thi.opponent.handcard[i].length;
            this.myhandcard[i] = thi.me.handcard[i].length;
            this.pokersremain[i] = this.exceptdeckpokersum[i] - this.opponent_handcard[i] - this.myhandcard[i];
        }
        this.mysum = thi.me.sum();
        this.opponent_sum = thi.opponent.sum();
        this.decksum = thi.deck.length;
        let cardStr = thi.deck[this.decksum - 1]
        this.deckdecor = thi.map.get(cardStr[0]);
        this.pokersum = 52 - this.mysum - this.opponent_sum - this.decksum
    },

    //从少到多记录可以摸的扑克牌的花色张数，用来判断当前AI最适合出的牌
    //pokersremain：数组，扑克牌还可以摸的每种花色的张数
    sortdiscarddecor() {
        for (let i = 0; i < 4; i++) {
            this.a[i] = this.pokersremain[i];
        }
        for (let j = 0; j < 4; j++) {
            this.discarddecor[j] = 0;
            for (let i = 1; i < 4; i++) {
                if (this.a[this.discarddecor[j]] < this.a[i])
                    this.discarddecor[j] = i;
            }
            this.a[this.discarddecor[j]] = -1;
        }
        for (let i = 0; i < 4; i++) {
            cc.log(this.discarddecor[i]);
        }
    },

    //记录AI当前想出的牌的花色，并出牌，有动作
    myaction: function (thi) {
        thi.now_decor = this.mydecor;
        thi.putPoker();
    },

    //AI计算，摸牌好还是出那张花色的牌好
    //主要获胜思想：尽量让自己往无论自己摸牌都不会输的情况靠
    AIing: function (thi) {
        //收集对局信息
        this.collect(thi);

        //如果AI手中没牌，当然只能摸牌
        if (this.mysum === 0) {
            thi.touchPoker();
        }
        else {
            //当前情况，不管AI怎么摸牌，都是AI赢
            if (this.mysum + this.pokersum * 2 + this.decksum - 1 < this.opponent_sum) {
                thi.touchPoker();
                return;
            }
            //当P1没有把握怎么摸牌都可以赢的时候，AI尽力吃牌
            if (this.opponent_sum + this.pokersum * 2 - 1 > this.mysum + this.decksum + 1) {
                if (this.deckdecor != -1) {
                    if (this.myhandcard[this.deckdecor] > 0) {
                        this.mydecor = this.deckdecor;
                        this.myaction(thi);
                    }
                    else {
                        for (let i = 0; i < 4; i++) {
                            if (this.myhandcard[i] > 0 && this.opponent_handcard[i] === 0) {
                                this.mydecor = i;
                                this.myaction(thi);
                                return;
                            }
                        }
                        thi.touchPoker();
                    }
                    return;
                }
                else {
                    thi.touchPoker();
                    return;
                }

            }
            this.sortdiscarddecor();
            //当AI牌已经够多了，使绊子让P1吃牌
            if (this.pokersum > 3) {
                for (let i = 3; i >= 0; i--) {
                    if (this.discarddecor[i] != this.deckdecor && this.myhandcard[this.discarddecor[i]] > 0) {
                        this.mydecor = this.discarddecor[i];
                        this.myaction(thi);
                        return;
                    }
                }
            }
            //最后三张时，让P1最有可能吃牌
            else {
                for (let i = 0; i < 4; i++) {
                    if (this.discarddecor[i] != this.deckdecor && this.myhandcard[this.discarddecor[i]] > 0) {
                        this.mydecor = this.discarddecor[i];
                        this.myaction(thi);
                        return;
                    }
                }
            }
            //若上面条件都不满足，说明只能摸牌了
            thi.Touchcards();
        }
    }
}
module.exports = AI;
