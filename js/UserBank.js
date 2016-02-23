
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
