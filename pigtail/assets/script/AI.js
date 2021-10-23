//ai类机器人

var AI = {

    p1sum: 0,//p1sum：p1当前手牌
    p1handcard: [],//p1handcard：数组，p1当前手牌每种花色的张数
    mysum: 0,//mysum：AI当前手牌总数
    myhandcard: [],//myhandcard：AI当前手牌每种花色的张数
    decksum: 0,//decksum：牌堆当前总张数
    deckdecor: -1,//deckdecor：牌堆当前牌顶花色
    pokersum: 0,//pokersum：扑克牌还可以摸的张数
    mydecor: -1, //mydecor：AI要出的牌的花色
    pokersremain: [], //pokersremain：数组，扑克牌还可以摸的每种花色的张数
    exceptdeckpokersum: [],//exceptdeckpokersum：除去牌堆，扑克牌每种花色的张数
    discarddecor: [],//discarddecor：从少到多记录可以摸的扑克牌的花色张数，用来判断当前AI最适合出的牌
    a: [],//a：临时数组

    //初始化除去牌堆，扑克牌每种花色的张数，13张
    initialize: function () {
        for (let i = 0; i < 4; i++) {
            this.exceptdeckpokersum[i] = 13;
        }
    },

    //从对局中收集信息，给上面定义的参数赋值
    collect: function (thi) {
        for (let i = 0; i < 4; i++) {
            this.p1handcard[i] = thi.p1.top[i] + 1;
            this.myhandcard[i] = thi.p2.top[i] + 1;
            this.pokersremain[i] = this.exceptdeckpokersum[i] - this.p1handcard[i] - this.myhandcard[i];
        }
        this.mysum = thi.p2.sum();
        this.p1sum = thi.p1.sum();
        this.decksum = thi.deck.top + 1;
        this.deckdecor = thi.deck.topdecor;
        this.pokersum = thi.pokers.number - thi.pokers.pokertouched;
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
        thi.discard();
    },

    //AI计算，摸牌好还是出那张花色的牌好
    //主要获胜思想：尽量让自己往无论自己摸牌都不会输的情况靠


    //该情况为，我算吃了你出的和扑克牌剩余张数的牌，我也能赢
    AIing: function (thi) {
        //收集对局信息
        this.collect(thi);

        //如果AI手中没牌，当然只能摸牌
        if (this.mysum === 0) {
            thi.Touchcards();
        }
        else {
            //当前情况，不管AI怎么摸牌，都是AI赢
            if (this.mysum + this.pokersum * 2 + this.decksum - 1 < this.p1sum) {
                thi.Touchcards();
                return;
            }

            //看看如果吃完后是自己手牌多，还是剩余扑克牌多
            let x = 0;
            if (this.mysum + this.decksum > this.pokersum)
                x = this.pokersum;
            else
                x = this.mysum + this.decksum;
            //当P1没有把握怎么摸牌都可以赢的时候，AI尽力吃牌,但前提是还有很多扑克牌没被摸
            if (this.pokersum > 4)
                if (this.p1sum + this.pokersum + x - 1 > this.mysum + this.decksum + 1) {
                    //吃牌
                    if (this.deckdecor != -1) {
                        if (this.myhandcard[this.deckdecor] > 0) {
                            this.mydecor = this.deckdecor;
                            this.myaction(thi);
                        }
                        else {
                            //自己无法吃牌，打出对面没有的花色，让对面不能吃牌
                            if (this.p1sum > 0)
                                for (let i = 0; i < 4; i++) {
                                    if (this.myhandcard[i] > 0 && this.p1handcard[i] === 0) {
                                        this.mydecor = i;
                                        this.myaction(thi);
                                        return;
                                    }
                                }
                            thi.Touchcards();
                        }
                        return;
                    }
                    else {
                        thi.Touchcards();
                        return;
                    }

                }
            this.sortdiscarddecor();
            //当AI牌已经够多了，使绊子让P1吃牌
            if (this.pokersum > 2) {
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