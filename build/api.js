var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(root, factory) {
  if (root.define && typeof root.define === 'function' && root.define.amd) {
    return define(['sendsay.event-dispatcher', 'jquery'], function(EventDispatcher, $) {
      return factory(root, {}, EventDispatcher, $);
    });
  } else {
    return root.API = factory(root, {}, EventDispatcher, $);
  }
})(this, function(root, API, EventDispatcher, $) {
  API = (function(superClass) {
    var ACTIONS_WITHOUT_SESSION, API_VERSION, MAX_RECALL_COUNT, MAX_REDIRECT_COUNT;

    extend(API, superClass);

    ACTIONS_WITHOUT_SESSION = ['ping', 'login', 'login.agses.challenge'];

    MAX_REDIRECT_COUNT = 10;

    MAX_RECALL_COUNT = 10;

    API_VERSION = 100;

    API.prototype._url = 'https://api.sendsay.ru';

    API.prototype._session = '';

    API.prototype._redirect = '';

    API.prototype._mixins = null;

    API.prototype.setRedirect = function(redirect) {
      return this._redirect = redirect;
    };

    API.prototype.setSession = function(session) {
      return this._session = session;
    };

    API.prototype.setURL = function(url) {
      return this._url = url;
    };

    API.prototype.mixin = function(action, handler) {
      var mixins;
      mixins = this._mixins || (this._mixins = {});
      return mixins[action] = handler;
    };

    function API(options) {
      if (options == null) {
        options = {};
      }
      API.__super__.constructor.apply(this, arguments);
      if (options.url) {
        this._url = options.url;
      }
      if (options.session) {
        this._session = options.session;
      }
      if (options.redirect) {
        this._redirect = options.redirect;
      }
    }

    API.prototype.call = function(request, options) {
      if (options == null) {
        options = {};
      }
      if (this.hasMixin(request.action)) {
        return this._mixins[request.action](request, options);
      } else {
        return $.ajax(this.getAJAXSettings(request, options)).always(function(response, status, xhr) {
          switch (status) {
            case 'success':
              return this.handleAJAXRequestSuccess(response, request, options);
            case 'error':
              return this.handleAJAXRequestError(response, request, options);
            case 'canceled':
              return this.handleAJAXRequestCancel(response, request, options);
          }
        });
      }
    };

    API.prototype.hasMixin = function(action) {
      var mixins;
      mixins = this._mixins || (this._mixins = {});
      return mixins[action];
    };

    API.prototype.getAJAXSettings = function(request, options) {
      return {
        'url': this._url + this._redirect,
        'data': this.getAJAXData(request, options),
        'context': this,
        'dataType': 'jsonp',
        'jsonp': 'jsonp',
        'beforeSend': function(xhr) {
          return this.handleAJAXRequestStart(xhr, request, options);
        },
        'complete': function(xhr, options) {
          return this.handleAJAXRequestComplete(xhr, request, options);
        }
      };
    };

    API.prototype.getAJAXData = function(request, options) {
      return {
        'apiversion': API_VERSION,
        'json': 1,
        'request': this.getAJAXRequestString(request, options),
        'request.id': (new Date()).getTime()
      };
    };

    API.prototype.getAJAXRequestString = function(request, options) {
      if (this._session && ACTIONS_WITHOUT_SESSION.indexOf(request.action === -1)) {
        request.session = this._session;
      }
      return JSON.stringify(request);
    };

    API.prototype.handleAJAXRequestStart = function(xhr, request, options) {
      if (!options.silent) {
        return this.trigger('ajax:start', {
          xhr: xhr,
          request: request,
          options: options
        });
      }
    };

    API.prototype.handleAJAXRequestSuccess = function(response, request, options) {
      if (!options.silent) {
        this.trigger('ajax:success', {
          response: response,
          request: request,
          options: options
        });
      }
      if (response.REDIRECT) {
        return this.handleRequestRedirect(response, request, options);
      } else if (this.responseHasError(response, request)) {
        return this.handleRequestErrors(response, request, options);
      } else {
        return this.handleRequestSuccess(response, request, options);
      }
    };

    API.prototype.handleRequestRedirect = function(response, request, options) {
      var ref;
      if (!options.silent) {
        this.trigger('api:redirect', {
          response: response,
          request: request,
          options: options
        });
      }
      options.redirected = (ref = options.redirected === void 0) != null ? ref : {
        1: ++options.redirected
      };
      if (options.redirected !== MAX_REDIRECT_COUNT) {
        this._redirect = response.REDIRECT;
        return this.call(request, options);
      }
    };

    API.prototype.responseHasError = function(response, request) {
      var i, item, len, ref, temp;
      if (response.errors) {
        return true;
      } else if (response.result && request.action === 'batch') {
        temp = false;
        ref = response.result;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          temp |= this.responseHasError(item);
        }
        return temp;
      }
    };

    API.prototype.handleRequestErrors = function(response, request, options) {
      if (!options.silent) {
        this.trigger('api:error', {
          response: response,
          request: request,
          options: options
        });
      }
      if (options.error) {
        return options.error.call(options.context || this, response, request, options);
      }
    };

    API.prototype.handleRequestSuccess = function(response, request, options) {
      if (!options.silent) {
        this.trigger('api:success', {
          response: response,
          request: request,
          options: options
        });
      }
      if (request.action === 'login') {
        this._session = response.session;
      }
      if (options.success) {
        return options.success.call(options.context || this, response, request, options);
      }
    };

    API.prototype.handleAJAXRequestError = function(xhr, request, options) {
      if (!options.silent) {
        this.trigger('ajax:error', {
          xhr: xhr,
          request: request,
          options: options
        });
      }
      if (options.failed === void 0) {
        options.failed = 1;
      } else {
        options.failed += 1;
      }
      if (options.failed !== MAX_RECALL_COUNT) {
        return this.call(request, options);
      }
    };

    API.prototype.handleAJAXRequestCancel = function(xhr, request, options) {
      if (!options.silent) {
        return this.trigger('ajax:cancel', {
          xhr: xhr,
          request: request,
          options: options
        });
      }
    };

    API.prototype.handleAJAXRequestComplete = function(xhr, request, options) {
      if (!options.silent) {
        return this.trigger('ajax:complete', {
          xhr: xhr,
          request: request,
          options: options
        });
      }
    };

    return API;

  })(EventDispatcher);
  return API;
});
