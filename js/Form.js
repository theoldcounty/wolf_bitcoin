
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

      //avoid stack up bets
      if(!app.betInProcess){
        //start bet
        app.startBet(obj);
      }

    }
  });

  var form = new FormView();