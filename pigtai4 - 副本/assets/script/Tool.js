var Tool= {
    getrandom:function (min,max) {
        max=Math.floor(max);
        min=Math.ceil(min);
        return Math.floor(Math.random()*(max-min))+min;
    },
};
module.exports=Tool;