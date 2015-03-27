describe("API mixins", function() {
  this.timeout(10000);

  beforeEach(function() {
    API.setURL('https://api.sendsay.ru');
    API.setSession('');
    API.off('ajax:start ajax:success api:redirect api:error api:success ajax:error ajax:cancel ajax:complete');
  });

  var handler;

  it("add and call mixin", function(done) {
    API.mixin('self.ping', function(request, options) {
      request.action = 'ping';
      API.call(request, options);
    });
    API.call({
      'action': 'self.ping'
    }, {
      success: function(response) {
        done();
      }
    })
  })

});