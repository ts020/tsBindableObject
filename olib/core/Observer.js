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
            olib.async(function () {
                _this.trigger(type, data);
            }, queID);
        };
        return Observer;
    })();
    olib.Observer = Observer;
})(olib || (olib = {}));
