# Sendsay.API

JS library for manipulations with Sendsay API


## Methods

#### call
Initiates API request with `request` parameters and specific `options`
###### Parameters
* `request` - request parameters ([API Documentaion](https://sendsay.ru/api/api.html))
* `options` - request options 
  * `silent` - on/off triggering events
  * `success` - callback function that called when request has been finished without API errors
  * `error` -  callback function that called when request has been finished with API errors
  * `context` - context for callback functions

----
#### mixin
Adds mixin for API action
###### Parameters
* `name` - name of mixin
* `handler` - handler that called when mixin action is called

----
#### setRedirect
Set `redirect` as API redirect
###### Parameters
* `redirect` - API redirect

----
#### setSession
Set `session` as API session
###### Parameters
* `session` - API session

----
#### setURL
Set `url` as API url
###### Parameters
* `url` - API url

## Events
### ajax:start
###### Event object properties:
* `xhr` - xhr object of API request
* `request` - parameters of API request
* `options` - options of API request

----
### ajax:success
###### Event object properties:
* `response` - response of API request
* `request` - parameters of API request
* `options` - options of API request

----
### api:redirect
###### Event object properties:
* `response` - response of API request
* `request` - parameters of API request
* `options` - options of API request

----
### api:error
###### Event object properties:
* `response` - response of API request
* `request` - parameters of API request
* `options` - options of API request

----
### api:success
###### Event object properties:
* `response` - response of API request
* `request` - parameters of API request
* `options` - options of API request

----
### ajax:error
###### Event object properties:
* `xhr` - xhr object of API request
* `request` - parameters of API request
* `options` - options of API request

----
### ajax:cancel
###### Event object properties:
* `xhr` - xhr object of API request
* `request` - parameters of API request
* `options` - options of API request

----
### ajax:complete
###### Event object properties:
* `xhr` - xhr object of API request
* `request` - parameters of API request
* `options` - options of API request

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