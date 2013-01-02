// Set up the yepnope (Modernizr.load) directives.
Modernizr.load([
{
  // Test if <input type="range"> is supported using Modernizr.
  // If not supported, load the fd-slider polyfill.
  test: Modernizr.inputtypes.range,
  nope: [
    'http://www.frequency-decoder.com/demo/fd-slider/css/fd-slider.mhtml.min.css',
    'http://www.frequency-decoder.com/demo/fd-slider/js/fd-slider.js'
  ],
  callback: function(id, test_result) {
    // If the slider file has loaded then fire the onDomReady event.
    if("fdSlider" in window && typeof (fdSlider.onDomReady) != "undefined") {
        try { fdSlider.onDomReady(); } catch(err) {};
    };
  }
}
]);