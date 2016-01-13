var Blaster = (function Blaster() {
    "use strict";

    var _privateVars = { };
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

        _this.mergeOptions = function(oldOptions, newOptions) {
            for (var option in newOptions) {
                try {
                    if (newOptions[p].constructor == Object) {
                        oldOptions[option] = _this.mergeRecursive(oldOptions[option], newOptions[option]);
                    } else {
                        oldOptions[option] = newOptions[option];
                    }
                } catch(exception) {
                    oldOptions[option] = newOptions[option];
                }
            }

            return oldOptions;
        };

        /**
         * Handlers
         */

        _this.generateHandler = function () {
            var generateOutput = _this.generate();
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

                    cssOutput += resourceName + " { ";

                    for (var resourceId in resource) {
                        var currentResource = resource[resourceId];
                        cssOutput += resourceId + ": ";

                        if (typeof currentResource[1] === 'string') {
                            cssOutput += resource[resourceId] + "; ";
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
                                    paramArray[param] = [_this.options.resizeParam - param, currentResource[1][param]];
                                }

                                if (currentResource[1][param][1] != undefined &&
                                    typeof currentResource[1][param][0] === "number") {
                                    cssOutput += (currentResource[1][param][0] *
                                        (currentResource[1][param][1] * _privateVars.globalRatio)).toFixed(1) +
                                        currentResource[2] + "; ";
                                } else {
                                    cssOutput += currentResource[1][param][0] + "; ";
                                }
                            }
                        } else {
                            cssOutput += currentResource[0] + "; ";
                        }
                    }

                    cssOutput += "} ";

                    for (var variable in resource.vars) {
                        if (resource.vars[resourceId][1] != undefined && resource.vars[resourceId][1] != false) {
                            varsOutput[resourceId][variable] = (resource.vars[resourceId][0] *
                                (resource.vars[resourceId][1] * _privateVars.globalRatio)).toFixed(1);
                        } else {
                            varsOutput[resourceId][variable] = resource.vars[resourceId][0];
                        }
                    }

                }
            }

            return {
                cssOutput: cssOutput,
                varsOutput: varsOutput
            };
        };

        _this.options = _this.mergeOptions(_defaultOptions, arg.options);
        _this.resources = arg.resources;
        _this.vars = {};

        if (_this.options.autoStyleElem) {
            _privateVars.styleElement = document.createElement("style");
            _privateVars.styleElement.setAttribute("id", _this.options.styleElemId);

            document.body.appendChild(_privateVars.styleElement);
        }

        _privateVars.styleElement = document.getElementById(_this.options.styleElemId);

        _this.resizeHandler();

        if (_this.options.autoResizeAttach) {
            if(window.attachEvent) {
                window.attachEvent('onresize', _this.resizeHandler);
            } else if(window.addEventListener) {
                window.addEventListener('resize', _this.resizeHandler, true);
            } else {
                console.warn("Blaster", "This browser doesn't support resizing event binding");
            }
        }
    };
}());