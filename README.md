1-we can create a Vue app by calling
var app=new Vue({
    el:'#game',   =>Your html section where vue.js should work! in Project is #game

})

So now we got a Vue app connected to this div,and now the question is with which parts do we wanna start?




2-Attack button:
So the attack button here when pressed should of course, reduce the Monster's health, but at the same time,the monster should then also strike back! i use reduce some randomness.
function getRandomValue(max,min){
    return Math.floor(Math.random()*(max-min)+min);
}
in app.js:
var app=new Vue({
    el:'#game',
    data:{
        playerHealth:100,
        monsterHealth:100,
    },
    computed:{

        },
    methods:{
       attackMonster(){
           const attackValue=getRandomValue(12,5);
           this.monsterHealth-=attackValue;

             //when we attack monster, monsters attack us automatically !
           this.attackPlayer();
         },
      attackPlayer(){

              const attackValue=getRandomValue(15,8);
              this.playerHealth-=attackValue;
              console.log(this.playerHealth);
          }
    }
})



3- Updating the Health Bars: I also wanna make sure that those health bars are updated, when the player and monster healths change.
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

             }
 }

 in html:
Instead of: style, we can use v-bind: style!
   <section id="monster" class="container">
         <h2>Monster Health</h2>
         <div class="healthbar">
           <div class="healthbar__value" :style="monsterStyleBar"></div>
         </div>
       </section>
       <section id="player" class="container">
         <h2>Your Health</h2>
         <div class="healthbar">
           <div class="healthbar__value" :style="playerStyleBar"></div>
         </div>
       </section>



4- Adding a "Special Attack"

I want to do the same as an attack monster, but we should deal more damage. On the other hand and to not make this too powerful, the special attack should therefore not be available all the time,
but only every three rounds.

In the method section of app.js add this function e.g. specialAttackMonster:

    specialAttack(){
         const attackValue=getRandomValue(25,10);
         this.monsterHealth-=attackValue;

         //when we attack monster, monsters attack us automatically !
         this.attackPlayer();
     }
 but it should only be available every three rounds, and when it's not available, this button (special attack) therefore should be disabled.
 we could keep track of the number of rounds the game is already lasting.for that we can add a new data property, and that is: currentRound!



 So therefore, for example, when we attack the monster,I'll set this.currentRound++ :
  attackMonster(){
        this.currentRound++;
        .
        .
        .
      },
and also, i'll set this.currentRound+ in specialAttack() :

 specialAttack(){
         this.currentRound++;
         .
         .
         .

     }

we can only use it every three rounds. with this condition currentRound % 3!==0

therefore add in computed:

 mayUseSpecialAttack() {
                 return this.currentRound % 3 !== 0
             }
in html :
  <button @click="specialAttack()" :disabled="mayUseSpecialAttack">SPECIAL ATTACK</button>


5-Adding a "Heal" Functionality,  With This Button, Player can heal himself,
in methods:
 healPlayer(){
         this.currentRound++;
         //we
         const healValue=getRandomValue(8,20);
         if(healValue<100){
             this.playerHealth=100;
         }
         else{
             this.playerHealth+=healValue;
         }
         //when we heal ourself, monsters attack us automatically !
         this.attackPlayer();
     }

 in html :
  <button @click="healPlayer()">HEAL</button>

6- Adding a "Game Over" Screen: check who won?! and who lost?!
we need to basically check the health values the player and the monster health.
we could check if this player health is smaller than zero, in which case the player lost!
And we could check if maybe all the Monster health is below zero and so on.
But we would have to repeat this check in the special attack monster function and so on.
So repeating the same code in all of these places is not what we want to do because repeating code is never good.
We could add a watcher!

we want to watch two properties, playerHealth and monsterHealth therefore in watch:
  data:{
        playerHealth:100,
        monsterHealth:100,
        currentRound:0,
        winner:null
    },
    .
    .
    .
    ,
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


Html:
      <section class="container" v-if="winner">
        <h2>Game Over!</h2>
        <h3 v-if="winner==='monster'">You lost!</h3>
        <h3 v-else-if="winner==='player'">You won!</h3>
        <h3 v-else>It's a draw!</h3>
      </section>


7- Add button "start new game"
in methods:
   startNewGame() {
            //reset all those parameters
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.currentRound=0;
            this.winner=null

        },
in Html: You add the button in the previous part !

      <section class="container" v-if="winner">
        <h2>Game Over!</h2>
        <h3 v-if="winner==='monster'">You lost!</h3>
        <h3 v-else-if="winner==='player'">You won!</h3>
        <h3 v-else>It's a draw!</h3>
        <button @click="startNewGame()">start new game!</button>
      </section>

8- add Surrender function: if the player surrenders the monster won!
in methods:
  surrender(){
            this.winner='monster';
        }
in html:
<button @click=" surrender()">SURRENDER</button>

9- If we don't have a winner, just view the controls section in HTML:
Just with add v-if!
    <section id="controls" v-if="!winner">
            .
            .
            .
    </section>


10-Adding a Battle Log
This method should take three parameters.
It should take the information, who did something!
Then we want to know what happened! Did we attack? Did we heal?
and we need to know the value, how much damage was dealt. how much damage was dealt? How much did we heal for?
So these are the free parameters that we need in our function (who, what, value):
10-1:in data:
data:{

        logMessages:[]
    },
10-2:and add logMessages=[] in function startNewGame() :
     startNewGame() {
               //reset all those parameters
                .
                .
                .
               this.logMessages=[];

           },
10-3:in methods:
 addLogMessage(who, what, value){
            /*
            unshift basically like push, but where push adds something at the end of the array and
              unshift adds something at the beginning of the array.*/
            this.logMessages.unshift({
                actionBy:who,
                actionType:what,
                actionValue:value
            })
10-4:And now a new log message should be added, when we for example, attack the monster.
so in function attackMonster() :
    attackMonster() {
            .
            .
            .
            this.addLogMessage('player','attack',attackValue);
            //when we attack monster, monsters attack us automatically !
           .
           .
           .
        },
also in attackPlayer():
 attackPlayer() {
            .
            .
            .
            this.addLogMessage('monster','attack',attackValue);
        },
as well in  specialAttack() :
 specialAttack() {
            .
            .
            .
            this.addLogMessage('player','attack',attackValue);
            //when we attack monster, monsters attack us automatically !
            .
            .
            .
        },
and in healPlayer() :

   healPlayer() {
            .
            .
            .
            this.addLogMessage('player','heal',healValue);
            //when we heal ourself, monsters attack us automatically !
           .
           .
           .
        },


10-5: in html, show our logs:
        <ul>
          <li v-for="logMessage in logMessages">
            {{logMessage.actionBy}} - {{logMessage.actionType}} - {{logMessage.actionValue}}
            <br>
          </li>
        </ul>

10-6:make styling more beautiful:
        <ul>
          <li v-for="logMessage in logMessages">
            <span :class="{'log--player':logMessage.actionBy==='player','log--monster':logMessage.actionBy==='monster'}">
              {{logMessage.actionBy==='player'?'player':'monster'}}
            </span>

            <span v-if="logMessage.actionType==='heal'">
              heals himself for  <span class="log--heal">{{logMessage.actionValue}}</span>
            </span>
            <span v-else>
             attacks and deals<span class="log--damage">{{logMessage.actionValue}}</span>
            </span>
          </li>
        </ul>