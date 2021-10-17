class HttpUtil {
    constructor() {
        this.token = "hello"
    }

    /**
     * 登录
     * @param {学号} student_id 
     * @param {密码} password 
     * @returns 
     */
    login(student_id, password) {
        let t = this
        return new Promise((resolve, reject) => {
            let formData = {
                "student_id": student_id,
                "password": password
            }
            let data = []
            for (let key in formData) {
                data.push(''.concat(key, '=', formData[key]))
            }
            formData = data.join('&')
            let xhr = new XMLHttpRequest()
            xhr.open("post", "http://172.17.173.97:8080/api/user/login", true)
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    let jsonObj = JSON.parse(xhr.responseText)
                    t.token = ` Bearer ${jsonObj.data.token}`
                    cc.log(t.token)
                    resolve(xhr.status)
                }
            }
            xhr.send(formData)

        })
    }

    /**
     * 创建对局
     * @param {*} isPrivate 
     * @returns 
     */
    createGame(isPrivate) {
        let t = this
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest()
            let obj = {
                "private": isPrivate
            }

            xhr.open("post", "http://172.17.173.97:9000/api/game/", true)
            xhr.setRequestHeader("Content-Type", "application/json")
            xhr.setRequestHeader("Authorization", t.token)
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    let jsonObj = JSON.parse(xhr.responseText)
                    cc.log(jsonObj.data.uuid)
                    resolve(jsonObj)
                }
            }
            cc.log(JSON.stringify(obj))
            xhr.send(JSON.stringify(obj))
        })

    }

    /**
     * 获取对局列表
     * @param {*} page_size 
     * @param {*} page_num 
     * @returns 
     */
    getGameList(page_size, page_num) {
        let t = this
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest()
            xhr.open("get", `http://172.17.173.97:9000/api/game/index?page_size=${page_size}&page_num=${page_num}`, true)
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
            xhr.setRequestHeader('Authorization', t.token)
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    let jsonObj = JSON.parse(xhr.responseText)
                    resolve(jsonObj)
                }
            }
            xhr.send()
        })
    }

    /**
     * 根据uuid加入对局
     * @param {*}} uuid 
     * @returns 
     */
    joinGame(uuid) {
        let t = this
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest()
            xhr.open("post", `http://172.17.173.97:9000/api/game/${uuid}`, true)
            xhr.setRequestHeader("Authorization", t.token)
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    let jsonObj = JSON.parse(xhr.responseText)
                    cc.log(jsonObj)
                    resolve(jsonObj)
                } else if (xhr.status != 200) {
                    reject(xhr.status)
                }
            }
            xhr.send()
        })
    }

    /**
     * 获取上一步操作
     * @param {*} uuid 
     * @returns 
     */
    getLast(uuid) {
        let t = this
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest()
            xhr.open('get', `http://172.17.173.97:9000/api/game/${uuid}/last`, true)
            xhr.setRequestHeader("Authorization", t.token)
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    let jsonObj = JSON.parse(xhr.responseText)
                    cc.log(jsonObj)
                    resolve(jsonObj)
                } else if (xhr.status != 200) {
                    reject(xhr.status)
                }
            }
            xhr.send()
        })
    }

    touchPoker(uuid) {
        let t = this
        return new Promise((resolve, reject) => {
            let obj = {
                "type": 0,
            }
            let xhr = new XMLHttpRequest()
            xhr.open('put', `http://172.17.173.97:9000/api/game/${uuid}`, true)
            xhr.setRequestHeader("Authorization", t.token)
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    let jsonObj = JSON.parse(xhr.responseText)
                    cc.log(jsonObj)
                    resolve(jsonObj)
                } else if (xhr.status != 200) {
                    reject(xhr.status)
                }
            }
            xhr.send(JSON.stringify(obj))
        })
    }

    putPoker(card, uuid) {
        let t = this
        return new Promise((resolve, reject) => {
            let obj = {
                "type": 1,
                "card": card
            }
            let xhr = new XMLHttpRequest()
            xhr.open('put', `http://172.17.173.97:9000/api/game/${uuid}`, true)
            xhr.setRequestHeader("Authorization", t.token)
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    let jsonObj = JSON.parse(xhr.responseText)
                    cc.log(jsonObj)
                    resolve(jsonObj)
                } else if (xhr.status != 200) {
                    reject(xhr.status)
                }
            }
            xhr.send(JSON.stringify(obj))
        })
    }

    getGameResult(uuid) {
        let t = this
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest()
            xhr.open('get', `http://172.17.173.97:9000/api/game/${uuid}`, true)
            xhr.setRequestHeader("Authorization", t.token)
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    let jsonObj = JSON.parse(xhr.responseText)
                    cc.log(jsonObj)
                    resolve(jsonObj)
                } else if (xhr.status != 200) {
                    reject(xhr.status)
                }
            }
            xhr.send()
        })
    }




}
// const httpUtil = new HttpUtil()
// module.exports=HttpUtil;
module.exports = new HttpUtil();