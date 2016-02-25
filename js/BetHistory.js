
  //BetHistoryModel
  var BetHistoryModel = Backbone.Model.extend({
    defaults: {
      history: []
    },
    update: function(newVal) {
      var newHistory = this.get("history");
      newHistory.push(newVal);

      //set history model
      this.set({
        history: newHistory
      });
    },
    initialize: function() {
      console.log("BetHistoryModel initialize");
      this.on("change:history", function(model) {
        var previousBets = model.get("history"); // 23232
        console.log("Changed my history to " + history);
        this.render(history);
      });
    }
  });

  //BetHistoryView
  var BetHistoryView = Backbone.View.extend({
    initialize: function() {
     console.log("BetHistoryView initialize");
      this.render();
    },
    render: function(history) {
      var that = this;
      that.$el.empty();

      _.each(history, function(item) {
        console.log("item", item);
        that.$el.append("<li>"+item.result+"</li>");
      });
    }
  });