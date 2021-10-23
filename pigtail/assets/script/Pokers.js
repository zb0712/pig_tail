let Tool=require("Tool");
class Pokers{
    constructor(number)
    {
        this.number=number;
        this.pokertouched=0;
    };
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