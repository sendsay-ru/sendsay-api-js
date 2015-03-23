describe("API events", function() {
  this.timeout(10000);

  beforeEach(function() {
    API.setURL('https://api.sendsay.ru');
    API.setSession('');
    API.off('ajax:start ajax:success api:redirect api:error api:success ajax:error ajax:cancel ajax:complete');
  });

  var handler;

  it("success call events sequence", function(done) {
    var result = '';
    API.on('ajax:start', function() {
      result += 'ajax:start+';
    });
    API.on('ajax:success', function() {
      result += 'ajax:success+';
    });
    API.on('api:success', function() {
      result += 'api:success+';
    });
    API.on('ajax:complete', function() {
      result += 'ajax:complete';
      expect(result).to.eq('ajax:start+ajax:success+api:success+ajax:complete');
      done();
    });
    API.call({
      action: 'ping'
    });
  })

  it("call with api error events sequence", function(done) {
    var result = '';
    API.on('ajax:start', function() {
      result += 'ajax:start+';
    });
    API.on('ajax:success', function() {
      result += 'ajax:success+';
    });
    API.on('api:error', function() {
      result += 'api:error+';
    });
    API.on('ajax:complete', function() {
      result += 'ajax:complete';
      expect(result).to.eq('ajax:start+ajax:success+api:error+ajax:complete');
      done();
    });
    API.call({
      action: 'pong'
    });
  })

  it("call with ajax abort events sequence", function(done) {
    var result = '';
    API.on('ajax:start', function(options) {
      result += 'ajax:start+';
      options.xhr.abort();
    });
    API.on('ajax:cancel', function() {
      result += 'ajax:cancel';
      expect(result).to.eq('ajax:start+ajax:cancel');
      done();
    });
    API.call({
      action: 'ping'
    });
  })

  it("call with ajax error events sequence", function(done) {
    API.setURL('htps://api.sendsay.ru');
    var result = '';
    API.on('ajax:start', function(options) {
      result += 'ajax:start+';
    });
    API.on('ajax:error', function(options) {
      result += 'ajax:error';
      expect(result).to.eq('ajax:start+ajax:error');
      done();
    });
    API.call({
      action: 'ping'
    });
  })

  it("call with ajax error events sequence", function(done) {
    API.setURL('htps://api.sendsay.ru');
    handler = function() {
      handler.callCount = handler.callCount ? handler.callCount + 1 : 1;
    }
    API.on('ajax:start', handler);
    API.on('ajax:error', function() {
      handler();
      if (handler.callCount == 20) {
        done();
      }
    });
    API.on('ajax:complete', handler);
    API.call({
      action: 'ping'
    });
  })

});