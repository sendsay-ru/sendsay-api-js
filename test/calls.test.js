describe("API calls", function() {
  this.timeout(10000);

  it("call request without auth", function(done) {
    var api_instance = new API();
    api_instance.call({
      "action": "ping"
    }, {
      success: function() {
        done();
      }
    })
  })

  it("call request with auth", function(done) {
    var api_instance = new API();
    api_instance.call({
      "action": "login",
      "login": "demo",
      "passwd": "demo"
    }, {
      success: function() {
        api_instance.call({
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
    var api_instance = new API();
    api_instance.call({
      "action": "login",
      "login": "demo",
      "passwd": "demo"
    }, {
      success: function() {
        api_instance.call({
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
    var api_instance = new API();
    api_instance.call({
      "action": "login",
      "login": "demo",
      "passwd": "demo"
    }, {
      success: function() {
        api_instance.call({
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

  it("call request with one time auth", function(done) {
    var api_instance = new API();

    api_instance.call({
      "action": "pong",
      "one_time_auth": {
        "action": "login",
        "login": "demo",
        "passwd": "demo"
      }
    }, {
      success: function() {
        done();
      }
    })
  })

  it("call request with one time auth when authed", function(done) {
    var api_instance = new API();
    api_instance.call({
      "action": "login",
      "login": "demo",
      "passwd": "demo"
    }, {
      success: function() {
        api_instance.call({
          "action": "pong",
          "one_time_auth": {
            "action": "login",
            "login": "demo",
            "passwd": "demo"
          }
        }, {
          success: function() {
            done();
          }
        })
      }
    })
  });

});