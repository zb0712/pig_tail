var AI={
    p1sum:0,
    p1handcard:[],
    mysum:0,
    myhandcard:[],
    decksum:0,
    deckdecor:-1,
    pokersum:0,
    mydecor:-1,
    pokersremain:[],
    exceptdeckpokersum:[],
    discarddecor:[],
    a:[],
    initialize:function()
    {
        for (let i = 0; i < 4; i++) {
            this.exceptdeckpokersum[i]=13;
        }
    },
    collect:function(thi)
    {
        for (let i = 0; i < 4; i++) {
            this.p1handcard[i]=thi.p1.top[i]+1;
            this.myhandcard[i]=thi.p2.top[i]+1;
            this.pokersremain[i]=this.exceptdeckpokersum[i]-this.p1handcard[i]-this.myhandcard[i];
        }
        this.mysum=thi.p2.sum();
        this.p1sum=thi.p1.sum();
        this.decksum=thi.deck.top+1;
        this.deckdecor=thi.deck.topdecor;
        this.pokersum=thi.pokers.number-thi.pokers.pokertouched;
    },
    sortdiscarddecor()
    {
        for (let i = 0; i <4 ; i++) {
            this.a[i]=this.pokersremain[i];
        }
        for(let j=0;j<4;j++)
        {
            this.discarddecor[j]=0;
            for (let i = 1; i < 4; i++) {
                if(this.a[this.discarddecor[j]]<this.a[i])
                    this.discarddecor[j]=i;
            }
            this.a[this.discarddecor[j]]=-1;
        }
        for (let i = 0; i < 4; i++) {
            cc.log(this.discarddecor[i]);
        }
    },
    myaction:function (thi) {
            thi.now_decor=this.mydecor;
            thi.discard();
    },
    AIing:function(thi)
    {
        this.collect(thi);
        if(this.mysum===0)
        {
            thi.Touchcards();
        }
        else
        {
            if(this.mysum+this.pokersum*2+this.decksum-1<this.p1sum)
            {
                thi.Touchcards();
                return;
            }
            if(this.p1sum+this.pokersum*2-1>this.mysum+this.decksum+1)
            {
                    if(this.deckdecor!=-1)
                    {
                        if(this.myhandcard[this.deckdecor]>0)
                        {
                            this.mydecor=this.deckdecor;
                            this.myaction(thi);
                        }
                        else
                            thi.Touchcards();
                        return ;
                    }
                    else
                    {
                        thi.Touchcards();
                        return ;
                    }

            }
            this.sortdiscarddecor();
            if(this.pokersum>5)
            {
                for (let i = 3; i >=0 ; i--) {
                    if(this.discarddecor[i]!=this.deckdecor&&this.myhandcard[this.discarddecor[i]]>0)
                    {
                        this.mydecor=this.discarddecor[i];
                        this.myaction(thi);
                        return;
                    }
                }
            }
            else
            {
                for (let i = 0; i <4 ; i++) {
                    if(this.discarddecor[i]!=this.deckdecor&&this.myhandcard[this.discarddecor[i]]>0)
                    {
                        this.mydecor=this.discarddecor[i];
                        this.myaction(thi);
                        return;
                    }
                }
            }

          thi.Touchcards();
        }
    }
}
module.exports=AI;