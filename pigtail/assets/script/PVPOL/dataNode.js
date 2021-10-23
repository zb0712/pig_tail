cc.Class({
    extends: cc.Component,

    properties: {
        id: '123'
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.game.addPersistRootNode(this.node);
    },

    setData(uid) {
        this.id = uid
    },

    getData() {
        return this.id
    }
    // update (dt) {},
});
