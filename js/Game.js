
  //GameView
  var GameView = Backbone.View.extend({
    initialize: function() {
     console.log("GameView initialize");
      this.render("default.jpg", "'You will only be sorry you didn’t buy more'");
    },
    render: function(img, message) {
       this.$el.find('.picture').attr("src", "img/"+img);
       this.$el.find('.message').html(message);
    }
  });