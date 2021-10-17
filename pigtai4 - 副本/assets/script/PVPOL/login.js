let httpUtil = require("./HttpUtils")
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    
    // onLoad () {},

    start () {

    },

    login() {
        let student_id = this.node.getChildByName("bg").getChildByName("输入账号").getComponent(cc.EditBox).string
        let password = this.node.getChildByName("bg").getChildByName("输入密码").getComponent(cc.EditBox).string
        httpUtil.login(student_id,password).then((value) => {
            cc.director.loadScene("roomList")
        },(reason) => {

        })
    }

    // update (dt) {},
});
