# Sendsay Javascript Client

The Sendsay Javascript Client provides convenient access to the Sendsay API from applications written in JavaScript.

[Official Sendsay API Documentation (Russian)](https://sendsay.ru/api/api.html)

NOTE!

Node.js incompatible. Polyfills required:

- Fetch
- FormData
- Blob 

## Installation

### Web

If you're using Sendsay on a web page, you can install the library via:

#### Yarn (or NPM)

You can use any NPM-compatible package manager, including NPM itself and Yarn.

```bash
yarn add sendsay
```

Then:

```javascript
import Sendsay from 'sensdsay';
```

Or, if you're not using ES6 modules:

```javascript
const Sendsay = require('sendsay');
```

#### CDN

Minified:

```html
<script type="text/javascript" src="https://image.sendsay.ru/app/js/v1/sendsay.min.js"></script>
```

Unminified:

```html
<script type="text/javascript" src="https://image.sendsay.ru/app/js/v1/sendsay.js"></script>
```

## Usage

#### Authentication

```javascript
var sendsay = new Sendsay();

sendsay.request({ action: 'login', login: 'demo',  passw: 'secret' }).then(function(res) {
  sendsay.setSession(res.session);

  // The requests below will be authenticated.
 
  sendsay.request(res.session).then(function(res) {
    console.log(res.list['about.id']);
  })
}); 
````

#### Retrieve the session from cookies

```javascript
sendsay.setSessionFromCookie(); // By default it looks up for 'sendsay_session'.
```

```javascript
sendsay.setSessionFromCookie('custom_cookie_name'); 
```

#### Simple request

```
var req = sendsay.request({
  action: 'sys.settings.get',

  list: [
    'about.confirm',
    'about.id',
    'about.label.member',
    'about.name',
    'about.open.dt',
    'about.open.visitor',
    'about.owner.email',
    'about.tarif',
    'about.user',
    'anketa.id.base',
    'anketa.id.custom',
    'interface.type',
    'interface.type.user',
    'issue.email.sender.moderation',
    'issue.pte.datakey',
    'lbac.inuse',
    'lbac.on',
    'member.hard.limit',
    'member.hard.rest',
    'member.noconfirm.limit',
    'member.noconfirm.rest',
    'pase.autopayment',
    'pase.destination',
    'pase.left',
    'pase.state',
    'about.chat.on',
  ],
});

req.then(function(res) {
  var settings = res.list;

  console.log(settings);
});
```


