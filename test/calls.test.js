describe("API calls", function() {
  this.timeout(10000);

  beforeEach(function() {
    API.setURL('https://api.sendsay.ru');
    API.setSession('');
    API.off('ajax:start ajax:success api:redirect api:error api:success ajax:error ajax:cancel ajax:complete');
  });

  var handler;

  it("call request without auth", function(done) {
    API.call({
      "action": "ping"
    }, {
      success: function() {
        done();
      }
    })
  })

  it("call request with auth", function(done) {
    API.call({
      "action": "login",
      "login": "demo",
      "passwd": "demo"
    }, {
      success: function() {
        API.call({
          "action": "ping"
        }, {
          success: function() {
            done();
          }
        })
      }
    })
  });

  it("call batch request", function(done) {
    API.call({
      "action": "login",
      "login": "demo",
      "passwd": "demo"
    }, {
      success: function() {
        API.call({
          "action": "batch",
          "do": [{
            "action": "pong"
          }, {
            "action": "pong"
          }]
        }, {
          success: function() {
            done();
          }
        })
      }
    })
  });

  it("call batch request with error", function(done) {
    API.call({
      "action": "login",
      "login": "demo",
      "passwd": "demo"
    }, {
      success: function() {
        API.call({
          "action": "batch",
          "do": [{
            "action": "ping"
          }, {
            "action": "ping"
          }]
        }, {
          error: function() {
            done();
          }
        })
      }
    })
  });

});