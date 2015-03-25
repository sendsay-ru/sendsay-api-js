# API

JS library for manipulations with Sendsay API


## Methods

### call(request, options)
Initiate API request with `request` parameters and specific `options`

#### request
Request parameters relevant documentation (https://sendsay.ru/api/api.html)

#### options

##### `silent:false`
If you pass `silent:false` into the options hash, API call request with triggering request events
If you pass `silent:true` into the options hash, API call request without triggering request events
##### `success:callback`
Called upon successful API request. The callback has the form `success(response, request, options)`.
##### `error:callback`
Called upon a error from API. The callback has the form `error(response, request, options)`.
##### `context:this`
Context for `success` and `error' callbacks.

### setRedirect(redirect)
Set `redirect` as API redirect

#### redirect
API redirect

### setSession(session)
Set `session` as API session

#### session
API session

### setURL(url)
Set `url` as API url

#### url
API url

## Events
### `ajax:start`
### `ajax:success`
### `api:redirect`
### `api:error`
### `api:success`
### `ajax:error`
### `ajax:cancel`
### `ajax:complete`

## Examples

### Call action

```js
API.call({
  action: 'ping'  
}, {
  success: function(response) {
    console.log("handle success action");
  }
})
```

### Call action with api errors handling

```js
API.call({
  action: 'ping'  
}, {
  success: function(response) {
    console.log("handle success action");
  },
  error: function(response) {
    console.log("handle api errors");
  }
})
```

### Call action without triggering events

```js
API.call({
  action: 'ping'  
}, {
  silent: true
})
```

### Listen events

```js
API.on('ajax:start', function(event) {
  console.log("handle start of action");
});
```

### Listen multiplie events

```js
API.on('api:success api:error', function(event) {
  console.log("handle end of action");
});
```