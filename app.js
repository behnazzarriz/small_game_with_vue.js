function getRandomValue(max,min){
    return Math.floor(Math.random()*(max-min)+min);
}
var app=new Vue({
    el:'#game',
    data:{
        playerHealth:100,
        monsterHealth:100,
        currentRound:0,
        winner:null,
        logMessages:[]
    },
    computed:{
             monsterStyleBar(){
                 if(this.monsterHealth<=0){
                     return {width: '0%'}
                 }
                 return {width:this.monsterHealth + '%' }
             },

             playerStyleBar(){
                 if(this.playerHealth<=0){
                     return{width:'0%'}
                 }
                 return {width:this.playerHealth + '%' }

             },
        mayUseSpecialAttack() {
            return this.currentRound % 3 !== 0
        }

    },
    watch:{
        playerHealth(value){
            if(value<=0 && this.monsterHealth<=0){
                //a draw
                this.winner='draw';
            }
            else if (value<=0){
                //player lost
                this.winner='monster'
            }
        },
        monsterHealth(value){
            if(value<=0 && this.playerHealth<=0){
              // a draw
              this.winner='draw'
            }
            else if(value<=0){
              //player won
              this.winner='player'
            }
        }


    },
    methods: {
        startNewGame() {
            //reset all those parameters
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.currentRound=0;
            this.winner=null;
            this.logMessages=[];

        },
        attackMonster() {
            this.currentRound++;
            const attackValue = getRandomValue(12, 5);
            this.monsterHealth -= attackValue;

            this.addLogMessage('player','attack',attackValue);
            //when we attack monster, monsters attack us automatically !
            this.attackPlayer();
        },
        attackPlayer() {
            const attackValue = getRandomValue(15, 8);
            this.playerHealth -= attackValue;
            this.addLogMessage('monster','attack',attackValue);
        },
        specialAttack() {
            this.currentRound++;
            const attackValue = getRandomValue(25, 10);
            this.monsterHealth -= attackValue;
            this.addLogMessage('player','attack',attackValue);
            //when we attack monster, monsters attack us automatically !
            this.attackPlayer();
        },
        healPlayer() {
            this.currentRound++;
            const healValue = getRandomValue(8, 20);
            if (healValue < 100) {
                this.playerHealth = 100;
            } else {
                this.playerHealth += healValue;
            }
            this.addLogMessage('player','heal',healValue);
            //when we heal ourself, monsters attack us automatically !
            this.attackPlayer();
        },
        surrender(){
            this.winner='monster';
        },

        addLogMessage(who, what, value){
            /*
            unshift basically like push, but where push adds something at the end of the array and
              unshift adds something at the beginning of the array.*/
            this.logMessages.unshift({
                actionBy:who,
                actionType:what,
                actionValue:value
            });
        }

    }
})