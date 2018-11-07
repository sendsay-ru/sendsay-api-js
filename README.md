let sendsay = new Sendsay();

sendsay.request({ action: 'login', login: 'demo', passw: 'secret' }).then((res) => {
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


