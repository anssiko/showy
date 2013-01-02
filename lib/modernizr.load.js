Modernizr.addTest('dataset', function () {
    var elem = document.createElement('div');
    return !!elem.dataset;
});

Modernizr.addTest('hidden', function () {
    var elem = document.createElement('div');
    return !!elem.hidden;
});

Modernizr.load([
{
  test: Modernizr.inputtypes.range,
  nope: [
    'http://anssiko.github.com/showy/lib/fd-slider.mhtml.min.css',
    'http://anssiko.github.com/showy/lib/fd-slider.js'
  ],
  callback: function(id, test_result) {
    // If the slider file has loaded then fire the onDomReady event.
    if("fdSlider" in window && typeof (fdSlider.onDomReady) != "undefined") {
        try { fdSlider.onDomReady(); } catch(err) {};
    };
  }
},
{
  test: Modernizr.dataset,
  nope: [
    'http://anssiko.github.com/showy/lib/html5-dataset.js'
  ]
},
  {
    test: Modernizr.hidden,
    nope: [
      'http://anssiko.github.com/showy/lib/html5-hidden-attr.js'
    ]
  }
]);