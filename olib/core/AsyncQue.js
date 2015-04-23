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
