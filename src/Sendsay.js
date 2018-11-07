const MAX_REDIRECT_COUNT = 10;
const VERSION = 100;
const REQUEST_PREFIX = 'JS';

function getCookie(name){
  return (document.cookie.match('(^|; )' + name + '=([^;]*)') || 0)[2];
}

class Sendsay {
  static getLocaleDateISOString() {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;

    return (new Date(now - offset)).toISOString();
  }

  constructor({ url = 'https://api.sendsay.ru' } = {}) {
    this.requestNumber = (new Date()).getTime();
    this.url = url;
  }

  setSession(session) {
    this.session = session;
  }

  setPolicy(policy) {
    this.policy = policy;
  }

  setSessionFromCookie(name = 'sendsay_session') {
    this.setSession(getCookie(name));
  }

  setPolicyFromCookie(name = 'sendsay_policy') {
    this.setPolicy(getCookie(name));
  }

  onError(handler) {
    this.errorHandler = handler;
  }

  request(req, options = {}) {
    const nextOptions = { redirected: 0, ...options };
    const body = this.getRequestBody(req);
    const headers = {
      Accept: 'application/json',
    };

    if (!(body instanceof FormData)) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
    }

    return fetch(`${this.url}${this.redirect || ''}`, {
      method: 'POST',
      body,
      headers,
    })
    .catch(this.catchConnectionErrors)
    .then(this.checkStatus)
    .then(this.parseResponse)
    .then(res => this.checkResponseErrors(req, res, nextOptions))
    .then(res => this.checkRedirect(req, res, nextOptions));
  }

  catchConnectionErrors = (err) => {
    this.callErrorHandler(err);
    throw err;
  }

  checkStatus = (res) => {
    if (res.status >= 200 && res.status < 300) {
      return res;
    }

    // FIXME: RequestError(code, reason, error)
    const err = new RequestError(res.statusText);

    this.callErrorHandler(err);
    throw err;
  }

  parseResponse = (res) => {
    try {
      return res.json();
    } catch (err) {
      let finalErr = err;

      if (/JSON/.test(err)) {
        finalErr = new RequestError('fetch', 'invalid_json');
      }

      this.callErrorHandler(finalErr);
      throw finalErr;
    }
  }

  checkResponseErrors(req, res, options = {}) {
    if ('errors' in res && !options.ignoreErrors) {
      const err = res.errors[0];
      err.request = req;

      this.callErrorHandler(err);
      throw err;
    } else if (req.action === 'batch' && res.result && res.result.some(subResult => ('errors' in subResult))) {
      const errornessPart = res.result.find(subResult => ('errors' in subResult));

      const err = errornessPart.errors[0];
      err.request = req;

      this.callErrorHandler(err);
      throw err;
    } else {
      return res;
    }
  }

  checkRedirect = (req, res, options = {}) => {
    if ({}.hasOwnProperty.call(res, 'REDIRECT') && options.redirected < MAX_REDIRECT_COUNT) {
      this.redirect = res.REDIRECT;
      return this.request(req, { ...options, redirected: options.redirected + 1 });
    }

    return res;
  }

  callErrorHandler(err) {
    if (typeof this.errorHandler === 'function') {
      this.errorHandler(err);
    }
  }

  getRequestBody(req) {
    if (Object.keys(req).some(key => key.match(/^EFS_/))) {
      const formData = new FormData();
      const efsParams = [];
      const reducedRequest = Object.keys(req).reduce((memo, key) => {
        if (!key.match(/^EFS_/)) {
          return { ...memo, [key]: req[key] };
        }

        efsParams.push(key);

        return memo;
      }, {});

      formData.append('apiversion', VERSION);
      formData.append('json', 1);
      formData.append('request.id', this.getRequestId());
      formData.append('request', this.getRequestData(reducedRequest));

      efsParams.forEach((key) => {
        formData.append(key, req[key]);
      });

      return formData;
    }

    let requestBody = `apiversion=${VERSION}&json=1`;

    requestBody += `&request=${encodeURIComponent(this.getRequestData(req))}`;
    requestBody += `&request.id=${encodeURIComponent(this.getRequestId())}`;

    return requestBody;
  }

  getRequestData(req) {
    const finalReq = { ...req };

    if (this.session) {
      finalReq.session = this.session;
    }

    if (this.policy) {
      finalReq['lbac.policy'] = this.policy;
    }

    return JSON.stringify(finalReq);
  }

  getRequestId() {
    return [
      REQUEST_PREFIX,
      this.getUsername().toUpperCase(),
      (typeof window !== 'undefined' && window.location) ? window.location.pathname : null,
      this.requestNumber + 1,
      Sendsay.getLocaleDateISOString(),
    ].filter(part => part).join('_');
  }

  getUsername() {
    if (!this.session) {
      return 'unauthorized';
    }

    if (/^(.+?):/.test(this.session)) {
      return RegExp.$1;
    }

    return 'unknown';
  }
}

export default Sendsay;
