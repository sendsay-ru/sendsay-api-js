describe("API events", function () {
    this.timeout(10000);

    it("success call events sequence", function (done) {
        var api_instance = new API();
        var result = '';
        api_instance.on('ajax:start', function () {
            console.log('start');
            result += 'ajax:start+';
        });
        api_instance.on('ajax:success', function () {
            result += 'ajax:success+';
        });
        api_instance.on('api:success', function () {
            result += 'api:success+';
        });
        api_instance.on('ajax:complete', function () {
            result += 'ajax:complete';
            expect(result).to.eq('ajax:start+ajax:success+api:success+ajax:complete');
            done();
        });
        api_instance.call({
            action: 'ping'
        });
    })

    it("call with api error events sequence", function (done) {
        var api_instance = new API();
        var result = '';
        api_instance.on('ajax:start', function () {
            result += 'ajax:start+';
        });
        api_instance.on('ajax:success', function () {
            result += 'ajax:success+';
        });
        api_instance.on('api:error', function () {
            result += 'api:error+';
        });
        api_instance.on('ajax:complete', function () {
            result += 'ajax:complete';
            expect(result).to.eq('ajax:start+ajax:success+api:error+ajax:complete');
            done();
        });
        api_instance.call({
            action: 'pong'
        });
    })

    it("call with ajax abort events sequence", function (done) {
        var api_instance = new API();
        var result = '';
        api_instance.on('ajax:start', function (options) {
            result += 'ajax:start+';
            options.xhr.abort();
        });
        api_instance.on('ajax:cancel', function () {
            result += 'ajax:cancel';
            expect(result).to.eq('ajax:start+ajax:cancel');
            done();
        });
        api_instance.call({
            action: 'ping'
        });
    })

    it("call with ajax error count calls", function (done) {
        var api_instance = new API({
            url: 'http://unexistedurl'
        });
        var handler = function () {
            handler.callCount = handler.callCount ? handler.callCount + 1 : 1;
        }
        api_instance.on('ajax:start', handler);
        api_instance.on('ajax:error', function () {
            handler();
            console.log(handler.callCount);
            if (handler.callCount == 20) {
                done();
            }
        });
        api_instance.on('ajax:complete', handler);
        api_instance.call({
            action: 'ping'
        });
    })

});