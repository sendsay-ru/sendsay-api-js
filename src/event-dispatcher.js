var slice = [].slice;

(function(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = factory(root, {});
    } else if (root.define && typeof root.define == 'function' && root.define.amd) {
        define([], function () {
            return factory(root, {});
        });
    } else {
        root.EventDispatcher = factory(root, {});
    }
})(this, function(root, EventDispatcher) {
  return EventDispatcher = (function() {
    function EventDispatcher(options) {
      if (options == null) {
        options = {};
      }
      this._handlers = {};
      this._splitter = options.splitter || /[\s,]+/;
    }

    EventDispatcher.prototype.once = function(name, callback, ctx) {
      var i, len, names, results;
      if (name == null) {
        name = '';
      }
      if (ctx == null) {
        ctx = this;
      }
      names = name.split(this._splitter);
      results = [];
      for (i = 0, len = names.length; i < len; i++) {
        name = names[i];
        results.push((function(_this) {
          return function(name) {
            var temp;
            temp = function() {
              var args;
              args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
              callback.call.apply(callback, [ctx].concat(slice.call(args)));
              return this.off(name, temp);
            };
            return _this.on(name, temp);
          };
        })(this)(name));
      }
      return results;
    };

    EventDispatcher.prototype.on = function(name, callback, ctx) {
      var handlers, i, len, names;
      if (name == null) {
        name = '';
      }
      if (ctx == null) {
        ctx = this;
      }
      names = name.split(this._splitter);
      for (i = 0, len = names.length; i < len; i++) {
        name = names[i];
        handlers = this._handlers[name] || (this._handlers[name] = []);
        handlers.push({
          callback: callback,
          ctx: ctx
        });
      }
      return this;
    };

    EventDispatcher.prototype.off = function(name, callback, ctx) {
      var handler, handlers, i, j, len, len1, names, remaining;
      if (name == null) {
        name = '';
      }
      if (ctx == null) {
        ctx = this;
      }
      names = name.split(this._splitter);
      for (i = 0, len = names.length; i < len; i++) {
        name = names[i];
        handlers = this._handlers[name] || (this._handlers[name] = []);
        remaining = [];
        for (j = 0, len1 = handlers.length; j < len1; j++) {
          handler = handlers[j];
          if (callback && handler.callback !== callback || ctx && handler.ctx !== ctx) {
            remaining.push(handler);
          }
        }
        if (remaining.length) {
          this._handlers[name] = remaining;
        } else {
          delete this._handlers[name];
        }
      }
      return this;
    };

    EventDispatcher.prototype.trigger = function() {
      var args, handler, handlers, i, j, len, len1, name, names, ref;
      name = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      names = name.split(this._splitter);
      for (i = 0, len = names.length; i < len; i++) {
        name = names[i];
        handlers = this._handlers[name] || (this._handlers[name] = []);
        for (j = 0, len1 = handlers.length; j < len1; j++) {
          handler = handlers[j];
          if (handler.callback) {
            (ref = handler.callback).call.apply(ref, [handler.ctx].concat(slice.call(args)));
          }
        }
      }
      return this;
    };

    return EventDispatcher;

  })();
});
