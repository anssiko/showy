# Showy

*Showy is an image viewer on the Web for viewing your local files online.*

Showy uses some of the latest features of the web platform such as File API,
Blob URLs, &lt;input type=range&gt;, DnD, CSS Tranforms, and others. It has been
developed with Chrome 24, and it may not work well in other browsers yet. The
app is almost fully keyboard-driven in addition to usual touch and mouse
controls.

Showy, your flamboyant image viewer on the Web.

## Backlog

* test with other browsers than Chrome
* Blob URL workaround for unsupported browsers
* key bindings for zoom
* scroll thumbnails view to focused element
* test DnD
* make thumbnails square shaped (if image ratios differ)
* load images in batches to display them progressively
* extract and show EXIF metadata
* use Modernizr for all feature detection
* [DONE] polyfill &lt;input type=range&gt;
* [DONE] adjust zooming behavior
* [DONE] move elements with translate() instead of pos:abs top/left ([source](http://paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/))