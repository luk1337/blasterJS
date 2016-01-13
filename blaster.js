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

            for (var resourceName in _this.resources) {
                if (_this.resources.hasOwnProperty(resourceName)) {
                    var resource = _this.resources[resourceName];
                    
                    // property nie zostalo dziedziczone więc luz
                    cssOutput += resourceName + " {";

                    for (var r in resource) {
                        var currentResource = resource[r];
                        cssOutput += r + ": ";

                        if (typeof currentResource[1] === 'string') {
                            cssOutput += resource[r] + "; ";
                        } else if (currentResource[1] != undefined &&
                                currentResource[1] != false &&
                                typeof currentResource[1] !== 'object') {
                            cssOutput += (currentResource[0] *
                                    (currentResource[1] * _privateVars.globalRatio)).toFixed(1);

                            if (currentResource[2] != undefined) {
                                cssOutput += currentResource[2];
                            }

                            cssOutput += "; ";

                        } else if (typeof currentResource[1] === 'object') {
                            paramArray = [];

                            for (var param in currentResource[1]) {
                                if (_this.options.resizeParam <= param) {
                                    if (paramArray[0] != null) {
                                        if (paramArray[0] >= (_this.options.resizeParam - param)) {
                                            paramArray[param] =[_this.options.resizeParam - param, currentResource[1][param]];
                                        }
                                    } else {
                                        paramArray[param] = [_this.options.resizeParam - param, currentResource[1][param]];
                                    }
                                }

                                if (currentResource[1][param][1] != undefined && typeof currentResource[1][param][0] === "number") {
                                    cssOutput += (currentResource[1][param][0] * (currentResource[1][param][1] * _privateVars.globalRatio)).toFixed(1) + currentResource[2] + "; ";
                                } else {
                                    cssOutput += currentResource[1][param][0] + "; ";
                                }

                            }

                        }
                        else {

                            cssOutput += currentResource[0] + "; ";
                        }
                    }

                    cssOutput += "} ";

                    for (var v in resource.vars) {
                        if (resource.vars[r][1] != undefined && resource.vars[r][1] != false) {
                            varsOutput[r][v] = (resource.vars[r][0] * (resource.vars[r][1] * _privateVars.globalRatio)).toFixed(1);
                        } else {
                            varsOutput[r][v] = resource.vars[r][0];
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
