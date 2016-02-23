
  //BitcoinModel
  var BitcoinModel = Backbone.Model.extend({
    defaults: {
      currentValue: 0,
      lockedValue: 0
    },
    initialize: function() {
      console.log("BitcoinModel initialize");
      this.fetchEverySecond();//start getting the bitcoin value each second.
      this.on("change:currentValue", function(model) {
        var currentValue = model.get("currentValue"); // 494
        console.log("Changed my currentValue to " + currentValue);
      });
    },
    fetchEverySecond: function(){
      var that = this;

      setInterval(function() {
        //get val of bitcoin every second
        that.getBitcoinValue(function(mediumVal) {
          
          //set bit coin model
          that.set({
            currentValue: mediumVal
          });
        });
      }, 1000);

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
     console.log("BitcoinView initialize", this.model);
     this.model.on('change', this.render, this);
      //this.render();
    },
    render: function(value) {
       this.$el.html(value);
    }
  });