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
