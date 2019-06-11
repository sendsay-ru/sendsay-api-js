const MAX_REDIRECT_COUNT = 10;
const VERSION = 100;
const REQUEST_PREFIX = 'JS';

function getCookie(name) {
  return (document.cookie.match(`(^|; )${name}=([^;]*)`) || 0)[2];
}

const NO_AUTHENTICATION_REQUIRED_ACTIONS = [
  'ping',
  'login',
  'login.agses.challenge',
  'sys.account.create',
];

class Sendsay {
  static getLocaleDateISOString() {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;

    return (new Date(now - offset)).toISOString();
  }

  constructor({ apiKey, apiUrl = 'https://api.sendsay.ru', auth } = {}) {
    this.requestNumber = (new Date()).getTime();
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.auth = auth;
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

  login = ({ login, sublogin, password } = {}) => (
    this.performRequest({
      action: 'login',
      login,
      sublogin,
      passwd: password,
    }).then((res) => {
      this.setSession(res.session);
    })
  )

  request = (req = {}, options = {}) => {
    let seq;

    if (!this.apiKey && !this.session && this.auth && NO_AUTHENTICATION_REQUIRED_ACTIONS.indexOf(req.action) === -1) {
      seq = this.login(this.auth);
    } else {
      seq = Promise.resolve();
    }

    return seq.then(() => this.performRequest(req, options));
  }

  performRequest = (req, options = {}) => {
    const nextOptions = { redirected: 0, ...options };
    const body = this.getRequestBody(req);
    const headers = {
      Accept: 'application/json',
    };

    return fetch(`${this.apiUrl}${this.redirect || ''}`, {
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

    const err = new Error('Network response was not ok.');

    this.callErrorHandler(err);

    throw err;
  }

  parseResponse = (res) => {
    try {
      return res.json();
    } catch (err) {
      this.callErrorHandler(err);

      throw err;
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
    let requestBody = `apiversion=${VERSION}&json=1`;

    requestBody += `&request=${encodeURIComponent(this.getRequestData(req))}`;
    requestBody += `&request.id=${encodeURIComponent(this.getRequestId())}`;

    return requestBody;
  }

  getRequestData(req) {
    const finalReq = { ...req };

    if (this.apiKey) {
      finalReq.apikey = this.apiKey;
    } else if (this.session) {
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
    if (this.apiKey) {
      return 'apikey';
    }

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
