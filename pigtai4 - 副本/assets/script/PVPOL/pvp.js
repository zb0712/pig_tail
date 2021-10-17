let httpUtil = require("./HttpUtils")
cc.Class({
    extends: cc.Component,

    properties: {
        uid: ''
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let uuid = cc.find('dataNode').getComponent('dataNode').getData()
        this.uid = uuid

    },


    testFun() {
        httpUtil.getLast(this.uid).then((response) => {
            cc.log(response)
        })
    },

    testFun2() {
        httpUtil.touchPoker(this.uid).then((response) => {
            cc.log(response)
        })
    },

    testFun3() {
        httpUtil.getGameResult(this.uid).then((response) => {
            cc.log(response)
        })
    },

    start() {

    },

    // update (dt) {},
});
