(function () {

function q() { return document.querySelector.apply(document, arguments); }
function qa() { return document.querySelectorAll.apply(document, arguments); }

var body = q('body'),
    input = q('input[type=file]'),
    thumbnails = q('#thumbnails'),
    preview = q('#preview'),
    range = q('input[type=range]'),
    metadata = q('#metadata'),
    info = q('#info'),
    dropzone = q('#dropzone'),
    prev_button = q('#prev'),
    next_button = q('#next'),
    back_button = q('#back');

// Only WebKit is currently prefixing CSS features we're interested in.
// getCSS() returns a prefixed version for WebKit and unprefixed for others.
function getCSS(unprefixed) {
  if (unprefixed in document.documentElement.style) {
    return unprefixed;
  } else {
    var webkitPrefixed = 'webkit' + unprefixed.slice(0,1).toUpperCase() + unprefixed.slice(1);
    return (webkitPrefixed in document.documentElement.style) ? webkitPrefixed : unprefixed;
  }
}

function addImages(files) {
  var i, img;
  
  setTimeout(function() {
    for (i = 0; i < files.length; i++) {
      img = getImage(files[i]);
      img = setMetadata(img, files[i], getMaxIndex());
      thumbnails.appendChild(img);

      img.onclick = function () {
        if (preview.hidden) {
          showPreview(this);
        }
      };
    }
    info.hidden = true;
    info.textContent = '';
  }, 0);

  showThumbnails();
  
}

function showThumbnails() {
  input.hidden = false;
  preview.hidden = true;
  metadata.hidden = true;
  range.hidden = true;
  thumbnails.hidden = false;
  prev_button.hidden = true;
  next_button.hidden = true;
  back_button.hidden = true;
  
  resetBodyDimensions();
  addThumbnailsKeyBindings();

  if (q('#preview > img')) {
    var focused_index = q('#preview > img').dataset.index;
    minimizeImage(q('#preview > img'));
    setFocus(qa('#thumbnails > img')[focused_index]);
    info.hidden = true;
  } else {
    setTimeout(function() {
      setFocus(qa('#thumbnails > img')[0]);
    }, 1000);
  }
}

function showPreview(img) {
  input.hidden = true;
  metadata.hidden = false;
  range.hidden = false;
  thumbnails.hidden = true;
  info.hidden = false;
  prev_button.hidden = false;
  next_button.hidden = false;
  back_button.hidden = false;

  enlargeImage(img);
  preview.hidden = false;
  setResolution(img);
  setImageSizeToFitScreen(img);

  initRange(img);
  initPrevNext();
  initBack();

  addPreviewKeyBindings();

  metadata.textContent = getMetadata(img);
}

function getMaxIndex() {
  return parseInt(qa('#thumbnails > img').length, 10);
}

function enlargeImage(img) {
  img.style.width = '25%';
  img.style.opacity = 0.75;

  preview.appendChild(img);
}

function minimizeImage(img) {
  if (!img) return false;
  
  var next_img = q('img[data-index="' + (parseInt(img.dataset.index, 10) + 1) + '"]');
  
  var prop = getCSS('transform');
  img.style[prop] = 'scale(1)';
  img.style.width = '25%';
  img.style.height = '';
  img.style.marginLeft = '';
  img.style.marginTop = '';
  
  thumbnails.insertBefore(img, next_img);
}

function setFocus(img) {
  if (img) {
    img.style.opacity = 0.25;
    img.dataset.focused = true;
  }
}

function unsetFocus(img) {
  if (img) {
    img.style.opacity = 1;
    img.dataset.focused = false;
  }
}

function getFocused() {
  return q('img[data-focused="true"]');
}

function initBack() {
  back_button.onclick = function () {
    showThumbnails();
  };
}

function initRange(img) {
  
  function supported() {
    var elem = document.createElement('input');
    elem.type = 'range';
    return (elem.type !== 'text');
  }
  
  if (!supported()) {
    range.hidden = true;
    console.info('<input type="range"> not supported, zoom disabled.');
  }

  img.style.width = '100%';

  range.min = 10;
  range.value = 100;
  range.max = 200;

  info.textContent = '';
}

function setImageSizeToFitScreen(img) {
  var screen_width = window.innerWidth,
      screen_height = window.innerHeight - 40;
  
  setTimeout(function() {
    img.style.width = '100%';
    img.style.opacity = 1;
  }, 0);

  if (((img.dataset.height / img.dataset.width) * screen_width) > screen_height) {
    setTimeout(function() {
      img.style.width = '';
      img.style.height = screen_height + 'px';
    }, 0);
  }
}

function setResolution(img) {
  img.style.width = '';
  if (!img.dataset.width) {
    img.dataset.width = img.offsetWidth;
  }
  
  if (!img.dataset.height) {
    img.dataset.height = img.offsetHeight;
  }
  return img;
}

function initPrevNext() {
  var max_index = getMaxIndex(),
      current_index = parseInt(q('#preview > img').dataset.index, 10);
  
  prev_button.disabled = false;
  next_button.disabled = false;
  
  if (max_index === 0) {
    prev_button.disabled = true;
    next_button.disabled = true;
  }
    
  if (current_index === 0) prev_button.disabled = true;
  if (current_index === max_index) next_button.disabled = true;
}

function setMetadata(img, file, num) {
  img.dataset.index = num;
  img.dataset.modified = file.lastModifiedDate;
  img.dataset.name = file.name;
  img.dataset.size = file.size;
  return img;
}

function getMetadata(image) {
  return (parseInt(image.dataset.index, 10) + 1) + '/' + (getMaxIndex() + 1) + ' ' + image.dataset.name +
         ' (' + image.dataset.width + 'x' + image.dataset.height +
         ', ' + (Math.round(image.dataset.size/100000))/10 + ' MB)';
}

function getImage(file) {
  if (!window.URL) {
    // FIXME
    alert('Blob URLs not supported, bailing out.');
    return false;
  }
  
  var imgURL = URL.createObjectURL(file),
      img = document.createElement('img');

  img.onload = function() {
    URL.revokeObjectURL(imgURL);
  };
  
  img.src = imgURL;
  return img;
}

function showPrevImage() {
  var current = q('#preview > img'),
      prev = q('img[data-index="' + (parseInt(current.dataset.index, 10) - 1) + '"]');
      
  var prev_index = (prev !== null) ? (parseInt(prev.dataset.index, 10)) : 0;
  
  if (current && prev) {
    minimizeImage(current);
    enlargeImage(prev);
    range.value = 100;
    info.textContent = '';
  }

  if (prev) {
    next_button.disabled = false;
    prev_button.disabled = (prev_index === 0) ? true : false;
    setResolution(prev);
    setImageSizeToFitScreen(prev);
    metadata.textContent = getMetadata(prev);
  }

}

function showNextImage() {
  var current = q('#preview > img'),
      next = q('img[data-index="' + (parseInt(current.dataset.index, 10) + 1) + '"]');
      
  var next_index = (next !== null) ? (parseInt(next.dataset.index, 10)) : 0;
  
  if (current && next) {
    minimizeImage(current);
    enlargeImage(next);
    range.value = 100;
    info.textContent = '';
  }
  
  if (next) {
    prev_button.disabled = false;
    next_button.disabled = (next_index === getMaxIndex()) ? true : false;
    setResolution(next);
    setImageSizeToFitScreen(next);
    metadata.textContent = getMetadata(next);
  }
  
}

function resetBodyDimensions() {
  body.style.paddingBottom = '0px';
  body.style.width = '100%';
  body.style.overflowX = 'hidden';
}

function addPreviewKeyBindings() {
  document.onkeydown = function (e) {
    switch (e.keyCode) {
      case 13: // return/back
        e.preventDefault();
        showThumbnails();
        break;
      case 37: // <-
        e.preventDefault();
        showPrevImage();
        break;
      case 38: // up/back
        e.preventDefault();
        showThumbnails();
        break;
      case 39: // ->
        e.preventDefault();
        showNextImage();
        break;
    }
  };
}

function addThumbnailsKeyBindings() {  
  document.onkeydown = function (e) {
    switch (e.keyCode) {
      case 13: // return
        var focused = getFocused();
        e.preventDefault();
        showPreview(focused);
        break;
      case 37: // <-
        e.preventDefault();
        var focused = getFocused();
        if (focused && focused.previousSibling === null) return;
        setFocus(focused.previousSibling);
        unsetFocus(focused);
        break;
      case 38: // up
        e.preventDefault();
        var focused = getFocused();
        var above_index = parseInt(focused.dataset.index, 10) - 4;
        if (above_index < 0) return;
        var above_img = q('#thumbnails > img[data-index="' + above_index + '"]');
        setFocus(above_img);
        unsetFocus(focused);
        break;
      case 39: // ->
        e.preventDefault();
        var focused = getFocused();
        if (focused && focused.nextSibling === null) return;
        setFocus(focused.nextSibling);
        unsetFocus(focused);
        break;
      case 40: // down
        e.preventDefault();
        var focused = getFocused();
        var below_index = parseInt(focused.dataset.index, 10) + 4;
        if (below_index >= getMaxIndex()) return;
        var below_img = q('#thumbnails > img[data-index="' + below_index + '"]');
        setFocus(below_img);
        unsetFocus(focused);
        break;
    }
  };
}

function enterFullscreen(el) {
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.webkitRequestFullScreen) {
    el.webkitRequestFullScreen();
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen();
  }
}

range.onchange = function () {
  var img = q('#preview > img'),
      screen_width = window.innerWidth,
      screen_height = window.innerHeight,
      img_ratio = (img.dataset.width / img.dataset.height),
      screen_ratio = screen_width / screen_height,
      zoom_ratio = range.value / 100,
      img_width = img.dataset.width,
      img_height = img.dataset.height;
      
  var fit_to_width = (img_width < screen_width);
  var fit_to_height = (img_height < screen_height);
  
  // TODO - test all corner cases, factor out reusable parts
  if (fit_to_width && fit_to_height) {
    if (screen_ratio < img_ratio) {
      var img_current_width = screen_width * zoom_ratio;
      var img_current_height = img_current_width / img_ratio;
    } else {
      var img_current_height = screen_height * zoom_ratio;
      var img_current_width = img_current_height * img_ratio;
    }
  } else if (!fit_to_width && !fit_to_height) {
    var img_current_width = (screen_ratio > img_ratio) ? (screen_width * img_ratio * zoom_ratio) : (screen_width * zoom_ratio);
    var img_current_height = (screen_ratio > img_ratio) ? (screen_width * zoom_ratio) : (img_current_width / img_ratio);
  } else if (fit_to_width && !fit_to_height) {
    var img_current_height = (screen_ratio > img_ratio) ? (screen_width * zoom_ratio) : (img_current_width / img_ratio);
    var img_current_width = img_current_height * img_ratio;
  } else if (!fit_to_width && fit_to_height) {
    var img_current_width = screen_width * zoom_ratio;
    var img_current_height = img_height * zoom_ratio;
  }

  var transform = getCSS('transform');
  var transformOriginX = getCSS('transformOriginX');
  var transformOriginY = getCSS('transformOriginY');

  info.textContent = this.value + ' % (' + Math.round(img_current_width, 10) + 'x' + Math.round(img_current_height, 10) + ')';
  img.dataset.scale = range.value / 100;

  img.style[transformOriginX] = (img_current_width > screen_width) ? '0' : '50%';
  img.style[transformOriginY] = (img_current_height > screen_height) ? '0' : '50%';
  img.style[transform] = 'scale(' + zoom_ratio + ')';

  body.style.overflowX = (img_current_width > screen_width) ? 'scroll' : 'hidden';
  body.style.overflowY = (img_current_height > screen_height - 50) ? 'scroll' : 'hidden';
};

dropzone.ondragover = function () {
  return false;
};

dropzone.ondragend = function () {
  return false;
};
  
dropzone.ondrop = function (e) {
  e.preventDefault();
  addImages(e.dataTransfer.files);
  return false;
};

input.onchange = function () {
  info.hidden = false;
  info.textContent = 'Loading images ...';
  addImages(input.files);
};

input.onclick = function () {
  enterFullscreen(document.documentElement);
};

prev_button.onclick = function () {
  showPrevImage();
};

next_button.onclick = function () {
  showNextImage();
};

// FIXME - dropzone disabled
//dropzone.style.width = window.innerWidth + 'px';
//dropzone.style.height = document.body.scrollHeight + 'px';

}());