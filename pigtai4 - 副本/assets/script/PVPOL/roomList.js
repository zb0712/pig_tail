let httpUtil = require("./HttpUtils")
cc.Class({
    extends: cc.Component,

    properties: {
        buttons: {
            default: [],
            type: cc.Button,
        },
        page_size: 5,
        page_num: 1,
        total_num: 0,
        uuids: [],
        interactables: [],

    },



    onLoad() {
        cc.game.addPersistRootNode()
        httpUtil.getGameList(this.page_size, this.page_num).then((response) => {
            this.total_num = response.data.total_page_num
            for (let i = 0; i < response.data.games.length; i++) {
                this.buttons[i].node.active = true
                let no = i + 1
                this.buttons[i].node.getChildByName("Background").getChildByName("Label").getComponent(cc.Label).string = `房间${no}:${response.data.games[i].uuid}`
                this.uuids[i] = response.data.games[i].uuid
                if (response.data.games[i].client_id != 0) {
                    this.buttons[i].interactable = false
                    this.interactables[i] = false
                } else {
                    this.buttons[i].interactable = true
                    this.interactables[i] = true
                }
            }
            if (response.data.games.length < this.page_size) {
                for (let i = response.data.games.length; i < this.page_size; i++) {
                    this.buttons[i].node.active = false
                }
            }

            if (this.page_num == 1) {
                this.buttons[7].interactable = false
                this.interactables[7] = false
            } else {
                this.buttons[7].interactable = true
                this.interactables[7] = true
            }

            if (this.page_num == response.data.total_page_num) {
                this.buttons[8].interactable = false
                this.interactables[8] = false
            } else {
                this.buttons[8].interactable = true
                this.interactables[8] = true
            }
            this.node.getChildByName("bg").getChildByName("页码").getComponent(cc.RichText).string = `<color=#00ff00>${this.page_num}</c>/<color=#0fffff>${this.total_num}</color>`
        }, (reason) => {
        })
    },

    /**
     * 上一页
     */
    prePage() {
        this.page_num--
        cc.log(this.page_num)
        httpUtil.getGameList(this.page_size, this.page_num).then((response) => {
            this.total_num = response.data.total_page_num
            for (let i = 0; i < response.data.games.length; i++) {
                this.buttons[i].node.active = true
                let no = i + 1
                this.buttons[i].node.getChildByName("Background").getChildByName("Label").getComponent(cc.Label).string = `房间${no}:${response.data.games[i].uuid}`
                this.uuids[i] = response.data.games[i].uuid
                if (response.data.games[i].client_id != 0) {
                    this.buttons[i].interactable = false
                    this.interactables[i] = false
                } else {
                    this.buttons[i].interactable = true
                    this.interactables[i] = true
                }
            }
            if (response.data.games.length < this.page_size) {
                for (let i = response.data.games.length; i < this.page_size; i++) {
                    this.buttons[i].node.active = false
                }
            }

            if (this.page_num == 1) {
                this.buttons[7].interactable = false
                this.interactables[7] = false
            } else {
                this.buttons[7].interactable = true
                this.interactables[7] = true
            }

            if (this.page_num == response.data.total_page_num) {
                this.buttons[8].interactable = false
                this.interactables[8] = false
            } else {
                this.buttons[8].interactable = true
                this.interactables[8] = true
            }
            this.node.getChildByName("bg").getChildByName("页码").getComponent(cc.RichText).string = `<color=#00ff00>${this.page_num}</c>/<color=#0fffff>${this.total_num}</color>`
        }, (reason) => {
        })
    },

    /**
     * 下一页
     */
    nextPage() {
        this.page_num++
        cc.log(this.page_num)
        httpUtil.getGameList(this.page_size, this.page_num).then((response) => {
            this.total_num = response.data.total_page_num
            for (let i = 0; i < response.data.games.length; i++) {
                this.buttons[i].node.active = true
                let no = i + 1
                this.buttons[i].node.getChildByName("Background").getChildByName("Label").getComponent(cc.Label).string = `房间${no}:${response.data.games[i].uuid}`
                this.uuids[i] = response.data.games[i].uuid
                if (response.data.games[i].client_id != 0) {
                    this.buttons[i].interactable = false
                    this.interactables[i] = false
                } else {
                    this.buttons[i].interactable = true
                    this.interactables[i] = true
                }
            }
            if (response.data.games.length < this.page_size) {
                for (let i = response.data.games.length; i < this.page_size; i++) {
                    this.buttons[i].node.active = false
                }
            }

            if (this.page_num == 1) {
                this.buttons[7].interactable = false
                this.interactables[7] = false
            } else {
                this.buttons[7].interactable = true
                this.interactables[7] = true
            }

            if (this.page_num == response.data.total_page_num) {
                this.buttons[8].interactable = false
                this.interactables[8] = false
            } else {
                this.buttons[8].interactable = true
                this.interactables[8] = true
            }
            this.node.getChildByName("bg").getChildByName("页码").getComponent(cc.RichText).string = `<color=#00ff00>${this.page_num}</c>/<color=#0fffff>${this.total_num}</color>`
        }, (reason) => {
        })
    },

    /**
     * 设置创建对局的表单的可见性
     * @param {*} event 
     * @param {*} isVisible 
     */
    setCreatRoomVisible(event, isVisible) {
        this.node.getChildByName("创建房间表单").active = isVisible
        if (isVisible) {
            for (let i = 0; i < this.buttons.length; i++) {
                this.buttons[i].interactable = false
            }
            cc.find("Canvas/bg/jump").active = false
        } else {
            for (let i = 0; i < this.page_size; i++) {
                this.buttons[i].interactable = this.interactables[i]
            }
            for (let i = this.page_size; i < this.buttons.length; i++) {
                this.buttons[i].interactable = true
            }
            cc.find("Canvas/bg/jump").active = true
        }
    },

    /**
     * 设置加入房间表单的可见性
     * @param {*} event 
     * @param {*} isVisible 
     */
    setJoinRoomVisible(event, isVisible) {
        this.node.getChildByName("加入房间表单").active = isVisible
        // if (isVisible) {
        //     for (let i = 0; i < this.buttons.length; i++) {
        //         this.buttons[i].interactable = false
        //     }
        //     cc.find("Canvas/bg/jump").active = false
        // } else {
        //     for (let i = 0; i < this.buttons.length; i++) {
        //         this.buttons[i].interactable = true
        //     }
        //     cc.find("Canvas/bg/jump").active = true
        // }
        if (isVisible) {
            for (let i = 0; i < this.buttons.length; i++) {
                this.buttons[i].interactable = false
            }
            cc.find("Canvas/bg/jump").active = false
        } else {
            for (let i = 0; i < this.page_size; i++) {
                this.buttons[i].interactable = this.interactables[i]
            }
            for (let i = this.page_size; i < this.buttons.length; i++) {
                this.buttons[i].interactable = true
            }
            cc.find("Canvas/bg/jump").active = true
        }
    },

    /**
     * 创建对局
     */
    creatRoom() {
        let isPrivate = cc.find("Canvas/创建房间表单/isPublic").getComponent(cc.Toggle).isChecked
        cc.log(isPrivate)
        httpUtil.createGame(isPrivate).then((response) => {
            // this.node.getChildByName("创建房间表单").active = false
            let uuid = response.data.uuid
            cc.find('dataNode').getComponent('dataNode').setData(uuid)
            cc.director.loadScene("pvp")

        }, (reason) => {

        })

    },

    /**
     * 点击对局列表中的对局后加入对局
     * @param {*} event 
     * @param {*} num 
     */
    joinRoomByList(event, num) {
        cc.log(this.uuids[num])
        let uuid = this.uuids[num]
        httpUtil.joinGame(this.uuids[num]).then((response) => {
            // cc.log(response.code)
            // cc.log(response.data.err_msg)
            // cc.log(response.msg)
            if (response.code == 200) {
                cc.find('dataNode').getComponent('dataNode').setData(uuid)
                cc.director.loadScene("pvp")
            }
        }, (reason) => {

        })
    },

    /**
     * 用户通过输入uuid加入对局
     */
    joinRoomByuuid() {
        let uuid = this.node.getChildByName("加入房间表单").getChildByName("uuid_input").getComponent(cc.EditBox).string
        httpUtil.joinGame(uuid).then((response) => {
            if (response.code == 200) {
                cc.find('dataNode').getComponent('dataNode').setData(uuid)
                cc.director.loadScene("pvp")
            }
            if (response.code == 403) {
                cc.find("Canvas/提示信息").active = true
            }
            if (response.code == 404) {
                cc.find("Canvas/房间不存在提示信息").active = true
            }
        })
    },

    closeMessage() {
        cc.find("Canvas/提示信息").active = false
        cc.find("Canvas/房间不存在提示信息").active = false
    },

    /**
     * 跳转到指定的页码
     */
    jump() {
        let pageNum = cc.find("Canvas/bg/jump").getComponent(cc.EditBox).string
        if (pageNum > this.total_num) {
            pageNum = this.total_num
        } else if (pageNum < 1) {
            pageNum = 1
        }
        this.page_num = pageNum
        httpUtil.getGameList(this.page_size, this.page_num).then((response) => {
            this.total_num = response.data.total_page_num
            for (let i = 0; i < response.data.games.length; i++) {
                this.buttons[i].node.active = true
                let no = i + 1
                this.buttons[i].node.getChildByName("Background").getChildByName("Label").getComponent(cc.Label).string = `房间${no}:${response.data.games[i].uuid}`
                this.uuids[i] = response.data.games[i].uuid
                if (response.data.games[i].client_id != 0) {
                    this.buttons[i].interactable = false
                    this.interactables[i] = false
                } else {
                    this.buttons[i].interactable = true
                    this.interactables[i] = true
                }
            }
            if (response.data.games.length < this.page_size) {
                for (let i = response.data.games.length; i < this.page_size; i++) {
                    this.buttons[i].node.active = false
                }
            }

            if (this.page_num == 1) {
                this.buttons[7].interactable = false
                this.interactables[7] = false
            } else {
                this.buttons[7].interactable = true
                this.interactables[7] = true
            }

            if (this.page_num == response.data.total_page_num) {
                this.buttons[8].interactable = false
                this.interactables[8] = false
            } else {
                this.buttons[8].interactable = true
                this.interactables[8] = true
            }
            this.node.getChildByName("bg").getChildByName("页码").getComponent(cc.RichText).string = `<color=#00ff00>${this.page_num}</c>/<color=#0fffff>${this.total_num}</color>`
        }, (reason) => {
        })

    }




    // update (dt) {},
});
