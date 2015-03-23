describe("Others tests:", function() {
  this.timeout(10000);

  var handler;

  it("create bill without auth", function(done) {
    API.call({
      "action": "pase.bill.create",
      "login": "demo",
      "comment": "create bill without auth",
      "service": [{
        "id": "Sendsay_B25_fee",
        "amount": "1"
      }]
    }, {
      success: function(response) {
        expect(response.id).to.not.eq(undefined);
        expect(response.obj.comment).to.eq("create bill without auth");
        done();
      }
    })
  });

  it("create bill without auth unexisted login", function(done) {
    API.call({
      "action": "pase.bill.create",
      "login": "demounexisted",
      "comment": "create bill without auth unexisted login",
      "service": [{
        "id": "Sendsay_B25_fee",
        "amount": "1"
      }]
    }, {
      error: function(response) {
        expect(response.errors[0].id).to.eq("error/auth/unkaccount");
        done();
      }
    })
  });

  it("create bill with auth without login", function(done) {
    API.call({
      "action": "login",
      "login": "demo",
      "passwd": "demo"
    }, {
      success: function() {
        API.call({
          "action": "pase.bill.create",
          "comment": "create bill with auth without login",
          "service": [{
            "id": "Sendsay_B25_fee",
            "amount": "1"
          }]
        }, {
          success: function(response) {
            expect(response.id).to.not.eq(undefined);
            expect(response.obj.comment).to.eq("create bill with auth without login");
            done();
          }
        })
      }
    })
  });

  it("create bill with auth", function(done) {
    API.call({
      "action": "login",
      "login": "demo",
      "passwd": "demo"
    }, {
      success: function() {
        API.call({
          "action": "pase.bill.create",
          "login": "demo",
          "comment": "create bill with auth",
          "service": [{
            "id": "Sendsay_B25_fee",
            "amount": "1"
          }]
        }, {
          success: function(response) {
            expect(response.id).to.not.eq(undefined);
            expect(response.obj.comment).to.eq("create bill with auth");
            done();
          }
        })
      }
    })
  });

  it("create bill with auth unexisted login", function(done) {
    API.call({
      "action": "login",
      "login": "demo",
      "passwd": "demo"
    }, {
      success: function() {
        API.call({
          "action": "pase.bill.create",
          "comment": "create bill with auth unexisted login",
          "login": "demounexisted",
          "service": [{
            "id": "Sendsay_B25_fee",
            "amount": "1"
          }]
        }, {
          error: function(response) {
            expect(response.errors[0].id).to.eq("error/auth/unkaccount");
            done();
          }
        })
      }
    })
  });

  it("create bill with auth and unexisted different logins", function(done) {
    API.call({
      "action": "login",
      "login": "demo",
      "passwd": "demo"
    }, {
      success: function() {
        API.call({
          "action": "pase.bill.create",
          "comment": "create bill with auth and unexisted different logins",
          "login": "demounexisted",
          "service": [{
            "id": "Sendsay_B25_fee",
            "amount": "1"
          }]
        }, {
          error: function(response) {
            expect(response.errors[0].id).to.eq("error/auth/unkaccount");
            done();
          }
        })
      }
    })
  });

  it("create bill with auth and different logins", function(done) {
    API.call({
      "action": "login",
      "login": "demo",
      "passwd": "demo"
    }, {
      success: function() {
        API.call({
          "action": "pase.bill.create",
          "comment": "create bill with auth and different logins",
          "login": "hac",
          "service": [{
            "id": "Sendsay_B25_fee",
            "amount": "1"
          }]
        }, {
          success: function(response) {
            expect(response.id).to.not.eq(undefined);
            expect(response.obj.comment).to.eq("create bill with auth and different logins");
            done();
          }
        })
      }
    })
  });

});