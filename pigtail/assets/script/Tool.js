//工具类
var Tool= {
    //生成随机数
    getrandom:function (min,max) {
        max=Math.floor(max);
        min=Math.ceil(min);
        return Math.floor(Math.random()*(max-min))+min;
    },
};
module.exports=Tool;