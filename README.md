# Showy

*Showy is an image viewer on the Web for viewing your local files online.*

Showy uses some of the latest features of the web platform such as File API,
Blob URLs, &lt;input type=range&gt;, DnD, CSS Transforms, and others. The
app is almost fully keyboard-driven in addition to usual touch and mouse
controls.

Showy, your flamboyant image viewer on the Web.

## Browser support

Tested with Chrome 24, Firefox 17, Safari 6, and Internet Explorer 10.
May work with earlier versions of Chrome and Firefox, and some other
modern browsers too.

## Backlog

* Blob URL workaround for unsupported browsers
* key bindings for zoom
* scroll thumbnails view to focused element
* test DnD
* make thumbnails square shaped (if image ratios differ)
* load images in batches to display them progressively
* extract and show EXIF metadata using [rawson.js](http://dev.tag.is/rawson.js/)
* [DONE] use Modernizr for all feature detection
* [DONE] polyfill &lt;input type=range&gt;
* [DONE] adjust zooming behavior
* [DONE] move elements with translate() instead of pos:abs top/left ([source](http://paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/))