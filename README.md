# blasterJS
Blaster is a standalone JavaScript library that keeps your resources properly scaled.
It generates CSS every time window dimensions change according to it's ruleset.
You wish vanilla stylesheets could do that with all that browser support.

* * *

## Main features

- Define any CSS rule
- Make use of fluid values/ratios
- Easy implementation

## Why and when to use it?

- Supporting browsers without viewport units (vw, vh, vmax, vmin) or media queries
- Making interactive, image/video-based websites responsive
- Serving different sized images while maintaining uniformity

## Issues

- Low performance during window changes when using resize event attach

## To-do

- Custom parameters/vars
- Callbacks
- Auto-fit
- Enhanced ratio/param options
- Enhanced breakpoint options
- Examples, Docs, Wiki

## Usage setup

```js
var blaster = new Blaster({
    options: {
        resizeVar: "window.innerHeight", // used to calculate ratio against definedParam
        definedParam: 1600, // 1:1 ratio value
        autoResizeAttach: true, // attach to 'resize' event on init
        autoStyleElem: true, // create the <style> element with id of styleElemId on init
        styleElemId: "blasterCss"
    },
    resources: {
        "#cssElem" : {
            // rule : value
            "display": "block",
            // rule : [value at definedParam, scaling (none when false)]
            "z-index": [1, false],
            // rule : [value at definedParam, scaling, suffix]
            "height": [200, 1, "px"],
            // rule : [value at definedParam, scaling (responsive object), suffix]
            "width": [200, {
                // resizeVar threshold : value
                // 300 : "100px",
                // resizeVar threshold : [value, scaling]
                600 : [100, 1]
            }, "px"]
        }
    }
});
```
