var extend = function (child, parent) {
    for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
    }

    function ctor() {
        this.constructor = child;
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
}
hasProp = {}.hasOwnProperty;

(function (root, factory) {

    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = factory(root, {}, require('jquery'), require('./event-dispatcher'));
    } else if (root.define && typeof root.define == 'function' && root.define.amd) {
        define(['jquery', './event-dispatcher'], function ($, EventDispatcher) {
            return factory(root, {}, $, EventDispatcher);
        });
    } else {
        root.API = factory(root, {}, $, EventDispatcher);
    }

})(this, function (root, API, $, EventDispatcher) {

    API = (function (parent) {

        extend(API, parent);

        var ACTIONS_WITHOUT_SESSION = [
            'ping',
            'login',
            'login.agses.challenge'
        ];

        var MAX_REDIRECT_COUNT = 10;

        var MAX_RECALL_COUNT = 10;

        var API_VERSION = 100;

        function API(options) {
            API.__super__.constructor.apply(this, arguments);

            options = options || {};

            this._requestNumber = (new Date()).getTime();
            this._requestIdPrefix = options.requestIdPrefix || 'APP_';
            this._url = options.url || 'https://api.sendsay.ru';
            this._session = options.session;
            this._policy = options.policy;
        }

        API.prototype.call = function (request, options) {
            var self = this,
                options = options || {},
                AJAXSettings = this._getAJAXSettings(request, options);

            var ajax = $.ajax(AJAXSettings).pipe(function (response, status, xhr) {
                self._handleAJAXSuccess(response, request, options);
                if (response.errors) {
                    return self._handleErrorCall(response, request, options);
                } else if (response.REDIRECT) {
                    return self._handleRedirectCall(response, request, options);
                }
                return self._handleSuccessCall(response, request, options);
            }, function (xhr, status) {
                if (status === 'canceled') {
                    return self._handleAJAXCancel(xhr, request, options);
                } else if (status === 'error') {
                    return self._handleAJAXError(xhr, request, options);
                }
            });

            return ajax;
        }

        API.prototype._getAJAXSettings = function (request, options) {

            var self = this,
                global = !(options.silent || false);

            return {
                type: 'POST',
                data: this._getAJAXData(request, options),
                url: this._url + (this._redirect || ''),
                dataType: 'json',
                global: global,
                beforeSend: function (xhr) {
                    self._handleAJAXStart(xhr, request, options);
                },
                complete: function (xhr) {
                    self._handleAJAXComplete(xhr, request, options);
                }
            };
        }

        API.prototype._getAJAXData = function (request, options) {
            return {
                'apiversion': API_VERSION,
                'json': 1,
                'request': this._getAJAXRequest(request, options),
                'request.id': this._getAJAXRequestId()
            };
        }

        API.prototype._getAJAXRequest = function (request, options) {
            if (ACTIONS_WITHOUT_SESSION.indexOf(request.action) === -1 && request['one_time_auth'] === undefined) {
                request.session = this._session;
            }

            if (this._policy) {
                request['lbac.policy'] = this._policy;
            }

            return JSON.stringify(request);
        }

        API.prototype._getAJAXRequestId = function () {
            var requestId = this._requestIdPrefix,
                now = new Date();

            if (this._session) {
                requestId += this._getLogin() + '_';
            }

            requestId += (this._requestNumber++) + '_';

            requestId += (new Date(now - now.getTimezoneOffset() * 60000)).toISOString().slice(0, -5);

            return requestId;
        }

        API.prototype._getLogin = function () {
            var login = this._session.match(/(.+?):/)[1];

            if (login) {
                login = login.slice((login.length / 2).toFixed(0));
            }

            return login.toUpperCase() || 'UNKNOWN';
        }

        API.prototype._handleErrorCall = function (response, request, options) {
            this.trigger('api:error', {
                response: response,
                request: request,
                options: options
            });
            if (options.resolveAPIErrors) {
                return $.Deferred().resolve(response, request, options).promise();
            } else {
                return $.Deferred().reject(response, request, options).promise();
            }
        }

        API.prototype._handleRedirectCall = function (response, request, options) {
            this.trigger('api:redirect', {
                response: response,
                request: request,
                options: options
            });
            options.redirected = options.redirected == undefined ? 1 : ++options.redirected;
            if (options.redirected < MAX_REDIRECT_COUNT) {
                this._redirect = response.REDIRECT;
                return this.call(request, options);
            }
        }

        API.prototype._handleSuccessCall = function (response, request, options) {
            this.trigger('api:success', {
                response: response,
                request: request,
                options: options
            });
            return $.Deferred().resolve(response, request, options).promise();
        }


        API.prototype._handleAJAXStart = function (xhr, request, options) {
            this.trigger('ajax:start', {
                xhr: xhr,
                request: request,
                options: options
            });
        }

        API.prototype._handleAJAXSuccess = function (response, request, options) {
            this.trigger('ajax:success', {
                response: response,
                request: request,
                options: options
            });
        }

        API.prototype._handleAJAXError = function (xhr, request, options) {
            this.trigger('ajax:error', {
                xhr: xhr,
                request: request,
                options: options
            });
            options.failed = options.failed ? ++options.failed : 1;
            if (options.failed < MAX_RECALL_COUNT) {
                return this.call(request, options);
            }
            return $.Deferred().reject(xhr, request, options).promise();
        }

        API.prototype._handleAJAXCancel = function (xhr, request, options) {
            this.trigger('ajax:cancel', {
                xhr: xhr,
                request: request,
                options: options
            });
            return $.Deferred().reject(xhr, request, options).promise();
        }

        API.prototype._handleAJAXComplete = function (xhr, request, options) {
            this.trigger('ajax:complete', {
                xhr: xhr,
                request: request,
                options: options
            });
        }

        return API;

    })(EventDispatcher);

    return API;

});
