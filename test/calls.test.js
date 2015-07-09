describe("API calls", function () {
    this.timeout(5000);

    it("call request without auth", function (done) {
        var api = new API();

        api.call({
            'action': 'ping'
        }).done(function () {
            done();
        });
    })

    it("call request with auth", function (done) {
        var api = new API();

        api.call({
            'action': 'login',
            'login': 'demo',
            'passwd': 'demo'
        }).done(function () {
            done();
        });
    })

    it("call request with error", function (done) {
        var api = new API();

        api.call({
            'action': 'login',
            'login': 'demo',
            'passwd': 'demo1'
        }).done(function() {
            console.log(arguments);
        }).fail(function () {
            console.log(1);
            done();
        });
    });

    it("call to unexisted url", function (done) {
        var api = new API({
            url: 'http://unexistedurl'
        });

        api.call({
            'action': 'login',
            'login': 'demo1',
            'passwd': 'demo'
        }).fail(function () {
            done();
        });
    });

});