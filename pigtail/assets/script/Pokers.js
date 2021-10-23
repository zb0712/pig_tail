let Tool=require("Tool");

//一副扑克牌类
class Pokers{
    constructor(number)
    {
        //number：扑克牌总张数
        //pokertouched：扑克牌已经被摸的张数
        this.number=number;
        this.pokertouched=0;
    };

    //生成52个0-51的随机数，相当于洗牌
    Pokerorder()
    {
        let orderset=new Set();
        orderset.clear();
        while(1)
        {
            if(orderset.size==this.number)
            {
                return [...orderset];
            }
            let random=Tool.getrandom(0,this.number);
            orderset.add(random);
        }
    }
};
module.exports=Pokers;