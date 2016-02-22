
  console.log("test");

  //UserBankModel
  var UserBankModel = Backbone.Model.extend({
    defaults: {
      chips: 100
    },
    initialize: function() {
      console.log("UserBankModel initialize");
      this.on("change:chips", function(model) {
        var chips = model.get("chips"); // 23232
        console.log("Changed my chips to " + chips);
      });
    }
  });

  //UserBankView
  var UserBankView = Backbone.View.extend({
    initialize: function() {
     console.log("UserBankView initialize");
      this.render();
    },
    render: function(value) {
       this.$el.html(value);
    }
  });



  //BitcoinModel
  var BitcoinModel = Backbone.Model.extend({
    defaults: {
      currentValue: 0,
      lockedValue: 0
    },
    initialize: function() {
      console.log("BitcoinModel initialize");
      this.on("change:currentValue", function(model) {
        var currentValue = model.get("currentValue"); // 494
        console.log("Changed my currentValue to " + currentValue);
      });
    },
    getBitcoinValue: function(callback) {     
        function onSuccess(json){
          callback((json.bid + json.ask) / 2);
        }

        Backbone.ajax({
          dataType: 'json',
          url: "https://api.bitcoinaverage.com/ticker/USD",
          crossDomain: true,
          success: onSuccess
        });
          
        //using dummy json if service is down.
        //onSuccess({bid: 320,ask: 444});
    }
  });

  //BitcoinView
  var BitcoinView = Backbone.View.extend({
    initialize: function() {
     console.log("BitcoinView initialize");
      this.render();
    },
    render: function(value) {
       this.$el.html(value);
    }
  });

   

  //GameView
  var GameView = Backbone.View.extend({
    initialize: function() {
     console.log("GameView initialize");
      this.render("default.jpg", "'You will only be sorry you didn’t buy more'");
    },
    render: function(img, message) {
       this.$el.find('.state img').attr("src", "img/"+img);
       this.$el.find('.message').html(message);
    }
  });



  var App = Backbone.Model.extend({
    initialize: function() {
      var that = this;

      this.userBankModel = new UserBankModel();
      this.userBankView = new UserBankView({
        el: $("#bankvalue")
      });

      this.bitcoinModel = new BitcoinModel();
      this.bitcoinView = new BitcoinView({
        el: $("#bitvalue")
      });

      this.gameView = new GameView({
        el: $("#gamestate")
      });      

      setInterval(function() {
        //get val of bitcoin every second
        that.bitcoinModel.getBitcoinValue(function(mediumVal) {
          
          //set bit coin model
          that.bitcoinModel.set({
            currentValue: mediumVal
          });      

          //render the bit coin value
          that.bitcoinView.render(that.bitcoinModel.get("currentValue"));
        });
      }, 1000);


      //render users chips
      this.userBankView.render(this.userBankModel.get("chips"));
    },
    currentBitcoinValue: 0,
    startBet: function(state) {
      console.log("start timer");
      this.state = state;

      //get locked value of bitcoin for the game

      var stashValue = this.bitcoinModel.get("currentValue");

      //set bit coin model with locked value
      
      this.bitcoinModel.set({
        lockedValue: stashValue
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

  var FormView = Backbone.View.extend({
    el: '#wager-form',
    events: {
      "submit": "doMethod"
    },
    doMethod: function(e) {

      e.preventDefault();

      var obj = [];
      this.$el.find('select[name], input[type="radio"]:checked').each(function() {
          obj[this.name] = this.value;
      });

      //start bet
      app.startBet(obj);

    }
  });

  var form = new FormView();

