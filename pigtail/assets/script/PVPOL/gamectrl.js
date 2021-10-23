class GameCtrl{
    constructor() {
        this.httpUtil = require("./HttpUtils")
        this.res=false
    }
    login(student_id,password) {
        let t = this
        let p = this.httpUtil.login(student_id,password)
        let a = "nihao"
        p.then((value)=> {
            cc.log(123456789)
            cc.log(this.res)
        })
        
    }
}
module.exports=GameCtrl;