let httpUtil = require("./HttpUtils")
cc.Class({
    extends: cc.Component,

    properties: {
        buttons: {
            default: [],
            type: cc.Button,
        },
        page_size: 5, //一页显示的房间数量
        page_num: 1,//当前页码
        total_num: 0, // 总页码
        uuids: [],// 房间id
        interactables: [], //储存按钮的交互性 true or false

    },



    onLoad() {
        //添加常驻节点用于传递数据
        cc.game.addPersistRootNode()
        //获取房间列表
        httpUtil.getGameList(this.page_size, this.page_num).then((response) => {
            this.total_num = response.data.total_page_num
            for (let i = 0; i < response.data.games.length; i++) {
                this.buttons[i].node.active = true
                let no = i + 1
                this.buttons[i].node.getChildByName("Background").getChildByName("Label").getComponent(cc.Label).string = `房间${no}:${response.data.games[i].uuid}`
                //将uuid存入数组
                this.uuids[i] = response.data.games[i].uuid
                //根据房间是否已满设置按钮的交互性 若满人则无法点击
                if (response.data.games[i].client_id != 0) {
                    this.buttons[i].interactable = false
                    this.interactables[i] = false
                } else {
                    this.buttons[i].interactable = true
                    this.interactables[i] = true
                }
            }
            //如果查到的房间数小于一页的最大值 则只显示查到的
            if (response.data.games.length < this.page_size) {
                for (let i = response.data.games.length; i < this.page_size; i++) {
                    this.buttons[i].node.active = false
                }
            }
            //根据页码设置按钮交互性
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
            //更新页码文本数据
            this.node.getChildByName("bg").getChildByName("页码").getComponent(cc.RichText).string = `<color=#00ff00>${this.page_num}</c>/<color=#0fffff>${this.total_num}</color>`
        }, (reason) => {
        })
    },

    /**
     * 上一页
     */
    prePage() {
        //当前页码减一
        this.page_num--

        httpUtil.getGameList(this.page_size, this.page_num).then((response) => {
            this.total_num = response.data.total_page_num
            for (let i = 0; i < response.data.games.length; i++) {
                this.buttons[i].node.active = true
                let no = i + 1
                this.buttons[i].node.getChildByName("Background").getChildByName("Label").getComponent(cc.Label).string = `房间${no}:${response.data.games[i].uuid}`
                //将房间uuid存入数组
                this.uuids[i] = response.data.games[i].uuid
                //根据是否满人设置按钮交互性
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
            // 根据页码设置按钮交互性
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
            //更新页码文本数据
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
                //将uuid存入数组
                this.uuids[i] = response.data.games[i].uuid
                //根据是否人满设置按钮交互性
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
            // 根据当前页码设置按钮交互性
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
            //更新页码文本数据
            this.node.getChildByName("bg").getChildByName("页码").getComponent(cc.RichText).string = `<color=#00ff00>${this.page_num}</c>/<color=#0fffff>${this.total_num}</color>`
        }, (reason) => {
        })
    },

    /**
     * 设置创建对局的表单的可见性 点击创建房间时触发
     * @param {*} event 
     * @param {*} isVisible 
     */
    setCreatRoomVisible(event, isVisible) {
        //根据可见性设置表单是否显示
        this.node.getChildByName("创建房间表单").active = isVisible
        //根据可见性设置按钮交互性，若表单显示则其他按钮失效反之生效
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
     * 设置加入房间表单的可见性 点击加入房间时触发
     * @param {*} event 
     * @param {*} isVisible 
     */
    setJoinRoomVisible(event, isVisible) {
        //根据可见性设置表单是否显示
        this.node.getChildByName("加入房间表单").active = isVisible
        //根据可见性设置按钮交互性，若表单显示则其他按钮失效反之生效
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
        //获取是否私有房间
        let isPrivate = cc.find("Canvas/创建房间表单/isPublic").getComponent(cc.Toggle).isChecked

        httpUtil.createGame(isPrivate).then((response) => {
            let uuid = response.data.uuid
            //将uuid放入常驻节点供游戏场景使用
            cc.find('dataNode').getComponent('dataNode').setData(uuid)
            //跳转到游戏场景
            cc.director.loadScene("pvp")
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
            if (response.code == 200) {
                //将uuid放入常驻节点
                cc.find('dataNode').getComponent('dataNode').setData(uuid)
                //跳转到游戏场景
                cc.director.loadScene("pvp")
            }
        }, (reason) => {

        })
    },

    /**
     * 用户通过输入uuid加入对局
     */
    joinRoomByuuid() {
        //获取输入的uuid
        let uuid = this.node.getChildByName("加入房间表单").getChildByName("uuid_input").getComponent(cc.EditBox).string
        //加入对局
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

    /**
     * 关闭按钮的点击事件
     */
    closeMessage() {
        cc.find("Canvas/提示信息").active = false
        cc.find("Canvas/房间不存在提示信息").active = false
    },

    /**
     * 跳转到指定的页码
     */
    jump() {
        let pageNum = cc.find("Canvas/bg/jump").getComponent(cc.EditBox).string
        //输入的值过大则跳转到最大页码 过小则跳转到第一页
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
                //将uuid存入数组
                this.uuids[i] = response.data.games[i].uuid
                //根据是否满人设置按钮交互性
                if (response.data.games[i].client_id != 0) {
                    this.buttons[i].interactable = false
                    this.interactables[i] = false
                } else {
                    this.buttons[i].interactable = true
                    this.interactables[i] = true
                }
            }
            //查询到的数量小于显示的最大值则只显示查询到的
            if (response.data.games.length < this.page_size) {
                for (let i = response.data.games.length; i < this.page_size; i++) {
                    this.buttons[i].node.active = false
                }
            }
            //根据当前页码设置按钮交互性
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
            //更新当前页码文本数据
            this.node.getChildByName("bg").getChildByName("页码").getComponent(cc.RichText).string = `<color=#00ff00>${this.page_num}</c>/<color=#0fffff>${this.total_num}</color>`
        }, (reason) => {
        })

    }




    // update (dt) {},
});
