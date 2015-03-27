describe("API mixins", function() {
  this.timeout(10000);

  var api_instance;

  beforeEach(function() {
  });

  it("add and call mixin", function(done) {
    var api_instance = new API();
    api_instance.mixin('self.ping', function(request, options) {
      request.action = 'ping';
      api_instance.call(request, options);
    });
    api_instance.call({
      'action': 'self.ping'
    }, {
      success: function(response) {
        done();
      }
    })
  })

});