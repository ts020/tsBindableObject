/**
 * Created by uu071639 on 2014/12/03.
 */
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
