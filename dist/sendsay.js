(function () {
  'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var defineProperty = function (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var MAX_REDIRECT_COUNT = 10;
  var VERSION = 100;
  var REQUEST_PREFIX = 'JS';

  function getCookie(name) {
    return (document.cookie.match('(^|; )' + name + '=([^;]*)') || 0)[2];
  }

  var Sendsay = function () {
    createClass(Sendsay, null, [{
      key: 'getLocaleDateISOString',
      value: function getLocaleDateISOString() {
        var now = new Date();
        var offset = now.getTimezoneOffset() * 60000;

        return new Date(now - offset).toISOString();
      }
    }]);

    function Sendsay() {
      var _this = this;

      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$url = _ref.url,
          url = _ref$url === undefined ? 'https://api.sendsay.ru' : _ref$url;

      classCallCheck(this, Sendsay);

      this.catchConnectionErrors = function (err) {
        _this.callErrorHandler(err);
        throw err;
      };

      this.checkStatus = function (res) {
        if (res.status >= 200 && res.status < 300) {
          return res;
        }

        // FIXME: RequestError(code, reason, error)
        var err = new RequestError(res.statusText);

        _this.callErrorHandler(err);
        throw err;
      };

      this.parseResponse = function (res) {
        try {
          return res.json();
        } catch (err) {
          var finalErr = err;

          if (/JSON/.test(err)) {
            finalErr = new RequestError('fetch', 'invalid_json');
          }

          _this.callErrorHandler(finalErr);
          throw finalErr;
        }
      };

      this.checkRedirect = function (req, res) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        if ({}.hasOwnProperty.call(res, 'REDIRECT') && options.redirected < MAX_REDIRECT_COUNT) {
          _this.redirect = res.REDIRECT;
          return _this.request(req, _extends({}, options, { redirected: options.redirected + 1 }));
        }

        return res;
      };

      this.requestNumber = new Date().getTime();
      this.url = url;
    }

    createClass(Sendsay, [{
      key: 'setSession',
      value: function setSession(session) {
        this.session = session;
      }
    }, {
      key: 'setPolicy',
      value: function setPolicy(policy) {
        this.policy = policy;
      }
    }, {
      key: 'setSessionFromCookie',
      value: function setSessionFromCookie() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'sendsay_session';

        this.setSession(getCookie(name));
      }
    }, {
      key: 'setPolicyFromCookie',
      value: function setPolicyFromCookie() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'sendsay_policy';

        this.setPolicy(getCookie(name));
      }
    }, {
      key: 'onError',
      value: function onError(handler) {
        this.errorHandler = handler;
      }
    }, {
      key: 'request',
      value: function request(req) {
        var _this2 = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var nextOptions = _extends({ redirected: 0 }, options);
        var body = this.getRequestBody(req);
        var headers = {
          Accept: 'application/json'
        };

        if (!(body instanceof FormData)) {
          headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
        }

        return fetch('' + this.url + (this.redirect || ''), {
          method: 'POST',
          body: body,
          headers: headers
        }).catch(this.catchConnectionErrors).then(this.checkStatus).then(this.parseResponse).then(function (res) {
          return _this2.checkResponseErrors(req, res, nextOptions);
        }).then(function (res) {
          return _this2.checkRedirect(req, res, nextOptions);
        });
      }
    }, {
      key: 'checkResponseErrors',
      value: function checkResponseErrors(req, res) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        if ('errors' in res && !options.ignoreErrors) {
          var err = res.errors[0];
          err.request = req;

          this.callErrorHandler(err);
          throw err;
        } else if (req.action === 'batch' && res.result && res.result.some(function (subResult) {
          return 'errors' in subResult;
        })) {
          var errornessPart = res.result.find(function (subResult) {
            return 'errors' in subResult;
          });

          var _err = errornessPart.errors[0];
          _err.request = req;

          this.callErrorHandler(_err);
          throw _err;
        } else {
          return res;
        }
      }
    }, {
      key: 'callErrorHandler',
      value: function callErrorHandler(err) {
        if (typeof this.errorHandler === 'function') {
          this.errorHandler(err);
        }
      }
    }, {
      key: 'getRequestBody',
      value: function getRequestBody(req) {
        if (Object.keys(req).some(function (key) {
          return key.match(/^EFS_/);
        })) {
          var formData = new FormData();
          var efsParams = [];
          var reducedRequest = Object.keys(req).reduce(function (memo, key) {
            if (!key.match(/^EFS_/)) {
              return _extends({}, memo, defineProperty({}, key, req[key]));
            }

            efsParams.push(key);

            return memo;
          }, {});

          formData.append('apiversion', VERSION);
          formData.append('json', 1);
          formData.append('request.id', this.getRequestId());
          formData.append('request', this.getRequestData(reducedRequest));

          efsParams.forEach(function (key) {
            formData.append(key, req[key]);
          });

          return formData;
        }

        var requestBody = 'apiversion=' + VERSION + '&json=1';

        requestBody += '&request=' + encodeURIComponent(this.getRequestData(req));
        requestBody += '&request.id=' + encodeURIComponent(this.getRequestId());

        return requestBody;
      }
    }, {
      key: 'getRequestData',
      value: function getRequestData(req) {
        var finalReq = _extends({}, req);

        if (this.session) {
          finalReq.session = this.session;
        }

        if (this.policy) {
          finalReq['lbac.policy'] = this.policy;
        }

        return JSON.stringify(finalReq);
      }
    }, {
      key: 'getRequestId',
      value: function getRequestId() {
        return [REQUEST_PREFIX, this.getUsername().toUpperCase(), typeof window !== 'undefined' && window.location ? window.location.pathname : null, this.requestNumber + 1, Sendsay.getLocaleDateISOString()].filter(function (part) {
          return part;
        }).join('_');
      }
    }, {
      key: 'getUsername',
      value: function getUsername() {
        if (!this.session) {
          return 'unauthorized';
        }

        if (/^(.+?):/.test(this.session)) {
          return RegExp.$1;
        }

        return 'unknown';
      }
    }]);
    return Sendsay;
  }();

  var features = [];

  if (!('Promise' in window)) {
    features.push('Promise');
  }

  if (!('fetch' in window)) {
    features.push('fetch');
  }

  if (features.length) {
    var script = document.createElement('script');

    script.src = 'https://cdn.polyfill.io/v2/polyfill.min.js?features=' + features.join(',');

    document.head.appendChild(script);
  }

  window.Sendsay = Sendsay;

}());
