var olib;
(function (olib) {
    olib.queMap = {};
    olib.queStarted = false;
    olib.count = 0;
    function async(handler, queID) {
        if (queID === void 0) { queID = null; }
        olib.queMap[queID || Date.now() + "_" + olib.count] = {
            handler: handler
        };
        olib.count++;
        if (!olib.queStarted) {
            olib.queStarted = true;
            window.requestAnimationFrame(function () {
                window.requestAnimationFrame(function () {
                    var keys = Object.keys(olib.queMap);
                    keys.forEach(function (key) {
                        olib.queMap[key].handler();
                        delete olib.queMap[key];
                    });
                    olib.queStarted = false;
                });
            });
        }
    }
    olib.async = async;
})(olib || (olib = {}));
///<reference path="AsyncQue.ts" />
var olib;
(function (olib) {
    var Observer = (function () {
        function Observer() {
            this.listeners = {};
        }
        Observer.prototype.getListener = function (type) {
            if (!this.listeners[type])
                this.listeners[type] = [];
            return this.listeners[type];
        };
        Observer.prototype.contain = function (type, handler) {
            return this.getListener(type).indexOf(handler) != -1;
        };
        Observer.prototype.on = function (type, handler) {
            this.getListener(type).push(handler);
        };
        Observer.prototype.off = function (type, handler) {
            if (handler === void 0) { handler = null; }
            if (!handler) {
                this.listeners[type] = [];
                return;
            }
            if (!this.contain(type, handler)) {
                return;
            }
            var list = this.getListener(type);
            for (var i = 0; i < list.length; i++) {
                if (list[i] == handler) {
                    list.splice(i, 1);
                    return;
                }
            }
        };
        Observer.prototype.trigger = function (type, data) {
            if (data === void 0) { data = null; }
            var sender = { type: type, data: data, currentTarget: this };
            this.getListener(type).forEach(function (hanlder) {
                try {
                    hanlder(sender);
                }
                catch (error) {
                    if (window["console"]) {
                        console.error(error.stack);
                    }
                }
            });
            this.calledTrigger(type, data);
        };
        Observer.prototype.calledTrigger = function (type, data) {
        };
        Observer.prototype.lazyTrigger = function (type, data, queID) {
            var _this = this;
            if (data === void 0) { data = null; }
            if (queID === void 0) { queID = null; }
            var now = Date.now();
            olib.async(function () {
                _this.trigger(type, data);
            }, queID);
        };
        return Observer;
    })();
    olib.Observer = Observer;
})(olib || (olib = {}));
var olib;
(function (olib) {
    var Identifier = (function () {
        function Identifier(prefix) {
            this.id = prefix + (new Date().getTime() * Math.random()).toString();
        }
        Identifier.create = function (prefix) {
            if (prefix === void 0) { prefix = null; }
            return new Identifier(prefix || "");
        };
        Identifier.prototype.key = function (str) {
            return this.id + str;
        };
        return Identifier;
    })();
    olib.Identifier = Identifier;
})(olib || (olib = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="Observer.ts" />
///<reference path="Identifier.ts" />
var olib;
(function (olib) {
    var BindableObject = (function (_super) {
        __extends(BindableObject, _super);
        function BindableObject() {
            _super.call(this);
            this.dataSource = {};
            this.changedProperties = {};
            this.identity = olib.Identifier.create("olib.BindableObject");
        }
        BindableObject.prototype.setProperty = function (name, value) {
            if (this.dataSource[name] != value) {
                this.changedProperties[name] = true;
                this.dataSource[name] = value;
                this.lazyTrigger(name, null, this.identity.key("." + name + "_changed"));
                this.lazyTrigger("changed", null, this.identity.key(".change"));
            }
        };
        BindableObject.prototype.calledTrigger = function (type, data) {
            if (type == "changed") {
                this.changedProperties = {};
            }
        };
        BindableObject.prototype.getProperty = function (name) {
            return this.dataSource[name];
        };
        BindableObject.prototype.isChanged = function (name) {
            return this.changedProperties[name] == true;
        };
        return BindableObject;
    })(olib.Observer);
    olib.BindableObject = BindableObject;
    function bind(target, name) {
        Object.defineProperty(target, name, {
            get: function () {
                return this.getProperty(name);
            },
            set: function (value) {
                this.setProperty(name, value);
            },
            enumerable: true,
            configurable: true
        });
        return target;
    }
    olib.bind = bind;
})(olib || (olib = {}));
var __decorate = this.__decorate || function (decorators, target, key, value) {
    var kind = typeof (arguments.length == 2 ? value = target : value);
    for (var i = decorators.length - 1; i >= 0; --i) {
        var decorator = decorators[i];
        switch (kind) {
            case "function": value = decorator(value) || value; break;
            case "number": decorator(target, key, value); break;
            case "undefined": decorator(target, key); break;
            case "object": value = decorator(target, key, value) || value; break;
        }
    }
    return value;
};
///<reference path="olib/core/BindableObject.ts" />
var bind = olib.bind;
var app;
(function (app) {
    var Greeter = (function (_super) {
        __extends(Greeter, _super);
        function Greeter() {
            _super.call(this);
        }
        __decorate([bind], Greeter.prototype, "name");
        __decorate([bind], Greeter.prototype, "message");
        __decorate([bind], Greeter.prototype, "num");
        return Greeter;
    })(olib.BindableObject);
    app.Greeter = Greeter;
})(app || (app = {}));
