let httpUtil = require("./HttpUtils")
cc.Class({
    extends: cc.Component,

    properties: {

    },


    onLoad() {

    },

    start() {

    },

    login() {
        let student_id = this.node.getChildByName("bg").getChildByName("输入账号").getComponent(cc.EditBox).string
        let password = this.node.getChildByName("bg").getChildByName("输入密码").getComponent(cc.EditBox).string
        httpUtil.login(student_id, password).then((response) => {
            if (response.status == 200) {
                cc.director.loadScene("roomList")
            }
            else {
                cc.find("Canvas/bg/错误提示").active = true
                setTimeout(function () {
                    cc.find("Canvas/bg/错误提示").active = false
                }, 2000)
            }
        }, (reason) => {

        })
    },
    tomain()
    {
        cc.director.loadScene("Main");
    }

    // update (dt) {},
});
