# API

JS library for manipulations with Sendsay API

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