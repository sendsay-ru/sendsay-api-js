do (root = this, factory = (root, API, EventDispatcher, $) ->

  class API extends EventDispatcher

    ACTIONS_WITHOUT_SESSION = [
      'ping'
      'login'
      'login.agses.challenge'
    ]

    MAX_REDIRECT_COUNT = 10
    MAX_RECALL_COUNT = 10
    API_VERSION = 100

    _url = 'https://api.sendsay.ru'
    _session = ''
    _redirect = ''

    _instance = null

    setRedirect: (redirect) ->
      _redirect = redirect

    setSession: (session) ->
      _session = session

    setURL: (url) ->
      _url = url

    constructor: (options = {}) ->
      if _instance
        return _instance
      else
        _instance = this
      super
      _url = options.url if options.url
      _session = options.session if options.session
      _redirect = options.redirect if options.redirect

    call: (request, options = {}) ->
      $.ajax @getAJAXSettings request, options
        .always (response, status, xhr) ->
          switch status
            when 'success' then @handleAJAXRequestSuccess response, request, options
            when 'error' then @handleAJAXRequestError response, request, options
            when 'canceled' then @handleAJAXRequestCancel response, request, options

    getAJAXSettings: (request, options) ->
      'url': _url + _redirect,
      'data': @getAJAXData request, options
      'context': this,
      'dataType': 'jsonp',
      'jsonp': 'jsonp',
      'beforeSend': (xhr) ->
        @handleAJAXRequestStart xhr, request, options
      'complete': (xhr, options) ->
        @handleAJAXRequestComplete xhr, request, options

    getAJAXData: (request, options) ->
      'apiversion': API_VERSION,
      'json': 1,
      'request': @getAJAXRequestString request, options
      'request.id': (new Date()).getTime()

    getAJAXRequestString: (request, options) ->
      if _session && ACTIONS_WITHOUT_SESSION.indexOf request.action == -1
        request.session = _session;
      JSON.stringify(request)

    handleAJAXRequestStart: (xhr, request, options) ->
      if not options.silent
        @trigger 'ajax:start',
          xhr: xhr,
          request: request,
          options: options

    handleAJAXRequestSuccess: (response, request, options) ->
      if not options.silent
        @trigger 'ajax:success',
          response: response,
          request: request,
          options: options
      if response.REDIRECT
        @handleRequestRedirect response, request, options
      else if @responseHasError response, request
        @handleRequestErrors response, request, options
      else
        @handleRequestSuccess response, request, options

    handleRequestRedirect: (response, request, options) ->
      if not options.silent
        @trigger 'api:redirect',
          response: response,
          request: request,
          options: options
      options.redirected = options.redirected == undefined ? 1 : ++options.redirected;
      if options.redirected != MAX_REDIRECT_COUNT
        _redirect = response.REDIRECT;
        @call request, options

    responseHasError: (response, request) ->
      if response.errors
        return true
      else if response.result && request.action == 'batch'
        temp = false
        temp |= @responseHasError item for item in response.result
        temp

    handleRequestErrors: (response, request, options) ->
      if not options.silent
        @trigger 'api:error',
          response: response,
          request: request,
          options: options
      if options.error
        options.error.call options.context || this, response, request, options

    handleRequestSuccess: (response, request, options) ->
      if not options.silent
        @trigger 'api:success',
          response: response,
          request: request,
          options: options
      _session = response.session if request.action == 'login'
      if options.success
        options.success.call options.context || this, response, request, options

    handleAJAXRequestError: (xhr, request, options) ->
      if not options.silent
        @trigger 'ajax:error',
          xhr: xhr,
          request: request,
          options: options
      options.failed = options.failed == undefined ? 1 : ++options.failed;
      @call request, options if options.failed != MAX_RECALL_COUNT

    handleAJAXRequestCancel: (xhr, request, options) ->
      if not options.silent
        @trigger 'ajax:cancel',
          xhr: xhr,
          request: request,
          options: options

    handleAJAXRequestComplete: (xhr, request, options) ->
      if not options.silent
        @trigger 'ajax:complete',
          xhr: xhr,
          request: request,
          options: options

  return new API

) ->

  if root.define && root.define instanceof 'function' and root.define.amd
    define ['sendsay.event-dispatcher', 'jquery'], (EventDispatcher, $) ->
      factory root, {}, EventDispatcher, $
  else
    root.API = factory root, {}, EventDispatcher, $