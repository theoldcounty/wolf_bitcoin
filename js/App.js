

  var App = Backbone.Model.extend({
    betInProcess: false,
    initialize: function() {
      var that = this;

      this.userBankModel = new UserBankModel();
      this.userBankView = new UserBankView({
        el: $("#bankvalue"),
        model: this.userBankModel
      });

      this.bitcoinModel = new BitcoinModel();
      this.bitcoinView = new BitcoinView({
        el: $("#bitvalue"),
        model: this.bitcoinModel
      });

      this.gameView = new GameView({
        el: $("#gamestate")
      });      

      //render users chips
      this.userBankView.render(this.userBankModel.get("chips"));
    },
    currentBitcoinValue: 0,
    startBet: function(state) {
      console.log("start timer");
      this.state = state;
      this.betInProcess = true;

      //set bit coin model with locked value      
      this.bitcoinModel.set({
        lockedValue: this.bitcoinModel.get("currentValue")//get locked value of bitcoin for the game
      });

      var initialTimer = 5;

      var Timer = {
        i: initialTimer,
        onTimer: function() {
          var that = this;
          document.getElementById('timer').innerHTML = Timer.i;
          Timer.i--;
          if (Timer.i < 0) {
            app.gameResult();
            Timer.i = initialTimer; //reset
            app.betInProcess = false; //reset
          } else {
            setTimeout(Timer.onTimer, 1000);
          }
        }
      };

      Timer.onTimer();
    },
    gameResult: function() {
      console.log("whats the result then");

      console.log("this.state", this.state);

      var lockedValue = this.bitcoinModel.get("lockedValue");
      var currentValue = this.bitcoinModel.get("currentValue");

      console.log("lockedValue>>", lockedValue);
      console.log("currentValue>>", currentValue);


      var result = "loss";//lose by default

      var resultImg = "lost.jpg";
      var resultMsg = "You lose";


      //locked value was higher
      if (
        (lockedValue > currentValue) && (this.state["bet"] == "low") ||
        (lockedValue < currentValue) && (this.state["bet"] == "high")
      ) {
        result = "win";//win if conditions are met
        resultImg = "won.jpg";
        resultMsg = "You won";
      }

      //get current value of user chips
      var newVal = parseInt(this.userBankModel.get("chips"), 10);
      if (result == "win") {
        console.log("WIN -- you get chips");
        newVal += parseInt(this.state["wager"], 10);

      } else {
        console.log("LOSS -- you loose chips");
        newVal -= parseInt(this.state["wager"], 10);
      }

      //won or lost chips -- set new chip value
      this.userBankModel.set({
        chips: newVal
      });

      //render new user chips
      this.userBankView.render(this.userBankModel.get("chips"));

      //render game state
      this.gameView.render(resultImg, resultMsg);
    }
  });

  var app = new App();
