var Blaster = (function Blaster(_arg) {

    "use strict";
    var _privateVars = {
    };

    var _defaultOptions = {
        resizeVar: "window.innerHeight",
        definedParam: 1600,
        autoResizeAttach: true,
        autoStyleElem: true,
        styleElemId: "blaster-css"
    };

    // Return the constructor
    return function BlasterConstructor(arg) {

        var _this = this; // Cache the `this` keyword

        _this.merge = function(a, b) {
            for (var p in b) {
                try {
                    if ( b[p].constructor==Object ) {
                        a[p] = _this.mergeRecursive(a[p], b[p]);
                    } else {
                        a[p] = b[p];
                    }
                } catch(e) {

                    a[p] = b[p];
                }
            }
            return a;
        };

        /**
         *  Handlers
         *
         */

        _this.generateHandler = function () {
            var generateOutput = _this.generate();
            //_privateVars.styleElement.innerHTML = "";
            _privateVars.styleElement.innerHTML = generateOutput.cssOutput;
            _this.vars = generateOutput.varsOutput;
            generateOutput = null;

        };

        _this.resizeHandler = function () {
            _this.options.resizeParam = eval(_this.options.resizeVar);
            _privateVars.globalRatio = (_this.options.resizeParam / _this.options.definedParam);
            _this.generateHandler();
        };

        /**
         * Generators
         */

        _this.generate = function() {
            var cssOutput  = "";
            var varsOutput = "";
            var paramArray = [];

            for (var resource in _this.resources) {
                if (_this.resources.hasOwnProperty(resource)) {
                    // property nie zostalo dziedziczone więc luz

                    cssOutput += resource + " {";

                    for (var r in _this.resources[resource]) {
                        cssOutput += r + ": ";

                        if (typeof _this.resources[resource][r][1] === 'string') {
                            cssOutput += _this.resources[resource][r] + "; ";
                        } else if (_this.resources[resource][r][1] != undefined &&
                                _this.resources[resource][r][1] != false &&
                                typeof _this.resources[resource][r][1] !== 'object') {
                            cssOutput += (_this.resources[resource][r][0] *
                                    (_this.resources[resource][r][1] * _privateVars.globalRatio)).toFixed(1);

                            if (_this.resources[resource][r][2] != undefined) {
                                cssOutput += _this.resources[resource][r][2];
                            }

                            cssOutput += "; ";

                        } else if (typeof _this.resources[resource][r][1] === 'object') {
                            paramArray = [];

                            for (var param in _this.resources[resource][r][1]) {

                                if (_this.options.resizeParam <= param) {
                                    if (paramArray[0] != null) {
                                        if (paramArray[0] >= (_this.options.resizeParam - param)) {
                                            paramArray[param] =[_this.options.resizeParam - param, _this.resources[resource][r][1][param]];
                                        }
                                    } else {
                                        paramArray[param] = [_this.options.resizeParam - param, _this.resources[resource][r][1][param]];
                                    }
                                }
                                if (_this.resources[resource][r][1][param][1] != undefined && typeof _this.resources[resource][r][1][param][0] === "number") {
                                    cssOutput += (_this.resources[resource][r][1][param][0] * (_this.resources[resource][r][1][param][1] * _privateVars.globalRatio)).toFixed(1) + _this.resources[resource][r][2] + "; ";
                                } else {
                                    cssOutput += _this.resources[resource][r][1][param][0] + "; ";
                                }

                            }

                        }
                        else {

                            cssOutput += _this.resources[resource][r][0] + "; ";
                        }
                    }

                    cssOutput += "} ";

                    for (var v in resource.vars) {
                        if (_this.resources[resource].vars[r][1] != undefined && _this.resources[resource].vars[r][1] != false) {
                            varsOutput[r][v] = (_this.resources[resource].vars[r][0] * (_this.resources[resource].vars[r][1] * _privateVars.globalRatio)).toFixed(1);
                        } else {
                            varsOutput[r][v] = _this.resources[resource].vars[r][0];
                        }
                    }

                }
            }

            return {
                cssOutput: cssOutput,
                varsOutput: varsOutput
            };
        };

        _this.options = _this.merge(_defaultOptions, arg.options);
        _this.resources = arg.resources;
        _this.vars = {};

        if (_this.options.autoStyleElem == true) {
            _privateVars.styleElement = document.createElement("style");
            _privateVars.styleElement.setAttribute("id", _this.options.styleElemId);
            document.body.appendChild(_privateVars.styleElement);
        }

        _privateVars.styleElement = document.getElementById(_this.options.styleElemId);

        _this.resizeHandler();

        if (_this.options.autoResizeAttach) {
            if(window.attachEvent) {
                window.attachEvent('onresize', function() {
                    _this.resizeHandler();
                });
            } else if(window.addEventListener) {
                window.addEventListener('resize', function() {
                    _this.resizeHandler();
                }, true);
            } else {
                console.warn("Blaster","This browser doesn't support resizing event binding")
            }
        }


    };
}());
