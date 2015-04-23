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
var Greeter = (function () {
    function Greeter() {
    }
    __decorate([bind], Greeter.prototype, "name");
    __decorate([bind], Greeter.prototype, "message");
    __decorate([bind], Greeter.prototype, "left");
    __decorate([bind], Greeter.prototype, "top");
    return Greeter;
})();
function bind(target, name) {
    target.listeners = target.listeners || { changed: [] };
    target.listeners.changed = target.listeners.changed || [];
    target.listeners[name] = target.listeners[name] || [];
    Object.defineProperty(target, name, {
        get: function () {
            return this[("_" + name)];
        },
        set: function (value) {
            var _this = this;
            var old = this[("_" + name)];
            if (old != value) {
                this[("_" + name)] = value;
                if (!this.listeners[name] || this.listeners[name].length == 0) {
                    return;
                }
                else {
                    this.listeners[name].forEach(function (listner) {
                        listner(value);
                    });
                }
                if (!this.listeners.___isChanged && this.listeners.changed && this.listeners.changed.length > 0) {
                    var self = this;
                    window.requestAnimationFrame(function () {
                        _this.listeners.changed.forEach(function (listner) {
                            listner(_this);
                        });
                        self.___isChanged = false;
                    });
                    this.listeners.___isChanged = true;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    return target;
}
function bindInit(bindObject, bindNode) {
    var all = bindNode.querySelectorAll("*");
    var bindList = [];
    for (var i = 0; i < all.length; i++) {
        var element = all[i];
        for (var n = 0; n < element.attributes.length; n++) {
            var attr = element.attributes[n];
            var atValue = attr.value;
            if (atValue.indexOf("{{") >= 0) {
                var bindValue = atValue.slice(atValue.indexOf("{{") + 2, atValue.lastIndexOf("}}"));
                var prefix = atValue.slice(0, atValue.indexOf("{{"));
                var safix = atValue.slice(atValue.lastIndexOf("}}") + 2);
                bindList.push({ ele: element, key: attr.name, bindName: bindValue, prefix: prefix, safix: safix });
            }
        }
    }
    bindList.forEach(function (target) {
        bindObject.listeners[target.bindName].push(function (value) {
            if (target.key == "text") {
                target.ele.innerText = target.prefix + value + target.safix;
            }
            else if (target.key.indexOf("$") == 0) {
                var styleName = target.key.slice(1);
                target.ele.style[target.key.slice(1)] = target.prefix + value + target.safix;
            }
            else {
                target.ele.setAttribute(target.prefix + value + target.safix);
            }
        });
    });
}
