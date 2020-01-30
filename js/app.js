$(window).ready(function() {
  // console.log('ready')
  // let the battle begin

  var currentPage = $('[current-page]');
  var faceCount = $('[face-count]');
  var masker = $('[face-count]');
  var review = $('[review]');
  var allDone = $('[all-done]');

  var processCanvasBtn = $('.process-canvas-btn');
  var processCaptionBtn = $('.process-caption-btn');
  var processDoneBtn = $('.process-done-btn');
  var input = $('.caption-input');
  var editor = $('.editor');

  window.setPage = function(val) {
    // currentPage.attr('current-page', val);
    window.location.hash = val;
  }
  var setFaceCount = function(val, val2) {
    faceCount.attr('face-count', val);
    masker.attr('masker', val2);
  }
  var setReview = function(val) {
    review.attr('review', val);
  }
  var setDone = function(val) {
    review.attr('all-done', val);
    if (parseInt(val) === 1) {
      window.location.hash = 'done';
    }
  }

  $('[target-page]').on('click', function(e) {
    if ($(this).hasClass('disabled')) return;
    var targetPage = $(this).attr('target-page');

    setPage(targetPage);
    cancelAnimationFrame(repeatOften);
  });

  $('[face]').on('click', function(e) {
    if ($(this).hasClass('disabled')) return;
    var face = $(this).attr('face');
    var mask = $(this).attr('mask');
    setFaceCount(face, mask);
  });

  $('[is-review]').on('click', function(e) {
    if ($(this).hasClass('disabled')) return;
    var isReview = $(this).attr('is-review');

    // setReview(isReview);
  });

  $('[is-done]').on('click', function(e) {
    if ($(this).hasClass('disabled')) return;
    var isDone = $(this).attr('is-done');

    // setDone(isDone);
  });

  $('.yes-btn').on('click', function(e) {
    if ($(this).hasClass('disabled')) return;
    setPage('choose');
  });


  var resizeInput = function() {
    var val = $(this).val();
    var valLen = val.length;
    if (valLen === 0) {
      processCaptionBtn.addClass('disabled');
    } else {
      processCaptionBtn.removeClass('disabled');
    }

    if (valLen >= 11) {
      editor.addClass('expand');
    } else {
      editor.removeClass('expand');
    }
    fixInput();
  }

  var onkeydown = function(e) {
    if (e.keyCode === 13) {
      processCaptionBtn.click();
      e.preventDefault();
    }

  };

  var onkeyup = function(e) {
    var trimInput = input.val();
    if (trimInput.length >= 10) {
      input.val(trimInput.substr(0, 10));
    }
    // resizeInput();
  };

  input.keydown(onkeydown).keyup(resizeInput).each(resizeInput);


  processCanvasBtn.on('click', function() {
    if ($(this).hasClass('disabled')) return;
    $('.uploader').addClass('hide-tool');
    createSplitCanvas();
    cancelAnimationFrame(repeatOften);
    $('.clear-btn').addClass('disabled');
  });

  processCaptionBtn.on('click', function() {
    if (input.val().length === 0) return;
    
    var txt = 'I am the first ' + input.val() + ' to summit!';
    var faceCountValue = parseInt(faceCount.attr('face-count'));
    if (faceCountValue === 2) {
      txt = 'We are the first ' + input.val() + ' to summit!';
    }
    DESCRIPTION = txt;
    // $('.caption-text p').text(txt);

    var div = $('<div/>');
    div.attr('class', 'cap-embed');
    var p = $('<p/>');
    p.text(txt);

    div.append(p);
    // $('.savable').append(div);
    $('.cap-embed').remove();
    $('.downloadable-box-2').append(div);
    // div.css('width', $('.savable canvas').width());

    // fontSize = (window.innerWidth <= 800 ? 30 : 35);
    fontSize = 40;
    requestAnimationFrame(checkCapEmbed);

    updateDownloadableBox(function(canvas) {
      setPage('review');
      $('.savable').empty();
      $('.savable').append(canvas);
    });

  });

  $('.skip-btn').on('click', function() {
    $('.cap-embed').remove();
    // $('.downloadable-box').append(div);

    // fontSize = (window.innerWidth <= 800 ? 30 : 35);
    fontSize = 40;
    requestAnimationFrame(checkCapEmbed);

    updateDownloadableBox(function(canvas) {
      setPage('review');
      setReview(1);
      $('.savable').empty();
      $('.savable').append(canvas);
    });

  });

  var fontSize = 40;
  var checkCapEmbed = function() {
    var limitH = (window.innerWidth <= 800 ? 150 : 180);
    if ($('.downloadable-box-2 .cap-embed').length && $('.downloadable-box-2 .cap-embed')[0].getBoundingClientRect().height > limitH) {
      fontSize -= 0.5;
      $('.downloadable-box-2 .cap-embed p').css('font-size', fontSize + 'px');
      requestAnimationFrame(checkCapEmbed);
    } else {
      cancelAnimationFrame(checkCapEmbed);
    }
  };

  processDoneBtn.on('click', function() {
    if ($(this).hasClass('disabled')) return;
    cancelAnimationFrame(checkCapEmbed);
    createFinalCanvas();
  });

  $('.clear-btn').on('click', function() {
    if ($(this).hasClass('disabled')) return;
    resetUpload();
    $('.clear-btn').addClass('disabled');
  });
  $('.edit-btn, .again-btn').on('click', function() {
    if ($(this).hasClass('disabled')) return;
    resetUpload();
  });

  var resetInputCaption = function() {
    DESCRIPTION = '';
    input.val('');
    $('.process-caption-btn').addClass('disabled');
    $('.cap-embed').remove();
  };
  var resetInputFile = function() {
    $('.preview-input, .preview-input2').value = '';
    $('.preview-input, .preview-input2').attr('type', 'text');
    setTimeout(function() {
      $('.preview-input, .preview-input2').attr('type', 'file');
    }, 100);
    resetInputCaption();
  };
  resetInputFile();

  var resetUpload = function() {
    $('.uploader').removeClass('hide-tool');
    $('.box').attr('has-upload', 0);
    image.attr('src', '');
    image2.attr('src', '');

    image.removeAttr('style');
    image2.removeAttr('style');
    box.removeAttr('style');
    box2.removeAttr('style');
    
    $('.tw-link').removeAttr('href');
    $('.fb-link').removeAttr('href');
    
    $('.social').addClass('disabled');
    processCanvasBtn.addClass('disabled');
    resetInputFile();
  };

  $('.social-ig').on('click', function(e) {
    if (!isFinalCanvasReady) return;

    if (!Platform.isIOS)  {
      var canvas = downloadableCanvas;
      if (canvas.msToBlob) {
        canvasData = canvas.msToBlob();
        window.navigator.msSaveBlob(canvasData, 'thetopofmounteverest.png');
      } else {
        canvasData = canvas.toDataURL('image/png');
        canvas.toBlob(function(blob) {
          saveAs(blob, "thetopofmounteverest.png");
        });
      }

      e.preventDefault();
      return false;
    }

  });


  var image = $('.image.scalable');
  var image2 = $('.image2.scalable');
  var box = $('.select-box');
  var box2 = $('.select-box2');
  var repeatOften = function() {
    image.attr('style', box.attr('style'));
    image2.attr('style', box2.attr('style'));
    requestAnimationFrame(repeatOften);
  }

  var startTicker = function() {
    var uploadCount = $('[has-upload="1"]').length;
    var faceCountValue = parseInt(faceCount.attr('face-count'));
    requestAnimationFrame(repeatOften);

    if (uploadCount >= faceCountValue) {
      processCanvasBtn.removeClass('disabled');
    }
  }


  var createTool = function(dx, dy) {
    image = $('.image.scalable');
    box = $('.select-box');

    var imgW = image.width();
    var imgH = image.height();

    box.width(imgW);
    box.height(imgH);

    window.tool1 = App.create(
      document.querySelector('.select-box'),
      document.querySelector('.dom1'),
      document.querySelector('#svg-tool'),
      { x: dx, y: dy }
    );

    startTicker();
  }

  var createTool2 = function(dx, dy) {
    image2 = $('.image2.scalable');
    box2 = $('.select-box2');

    var imgW2 = image2.width();
    var imgH2 = image2.height();

    box2.width(imgW2);
    box2.height(imgH2);

    window.tool2 = App.create(
      document.querySelector('.select-box2'),
      document.querySelector('.dom2'),
      document.querySelector('#svg-tool2'),
      { x: dx, y: dy }
    );

    startTicker();
  }

  window.previewFile = function(f) {
    $('.dom1').remove();
    $('.box1').append('<div id="dom" class="dom dom1"><img class="image scalable" src=""><div class="masked-bg masked1"></div><div class="select-box selector"></div><svg id="svg-tool" xmlns="http://www.w3.org/2000/svg"></svg></div>');

    var $target = $(f);
    var $parent = $target.parent();
    var $preview = $parent.find('.image');
    var dom = $('.dom1');
    canvasResize(f.files[0], {
      width: 1000,
      height: 1000,
      crop: false,
      quality: 100,
      //rotate: 90,
      callback: function(data, width, height) {
        // console.log(data, width, height) 
          // $(img).attr('src', data);
        var sc = (dom.width() / 2) / width;
        $preview.attr('src', data);
        $preview.css({ width: width * sc, height: height * sc });
        $parent.attr('has-upload', 1);

        var dx = dom.width()/2 - width*sc/2;
        var dy = dom.height()/2 - height*sc/2;
        createTool(dx, dy);
        $('.clear-btn').removeClass('disabled');
      }
    });

  }

  window.previewFile2 = function(f) {
    $('.dom2').remove();
    $('.box2').append('<div id="dom2" class="dom dom2"><img class="image2 scalable" src=""><div class="masked-bg masked2"></div><div class="select-box2 selector"></div><svg id="svg-tool2" xmlns="http://www.w3.org/2000/svg"></svg></div>');

    var $target = $(f);
    var $parent = $target.parent();
    var $preview = $parent.find('.image2');
    var dom = $('.dom2');
    canvasResize(f.files[0], {
      width: 1000,
      height: 1000,
      crop: false,
      quality: 100,
      //rotate: 90,
      callback: function(data, width, height) {
        // console.log(data, width, height)
          // $(img).attr('src', data);
        var sc = (dom.width() / 2) / width;
        $preview.attr('src', data);
        $preview.css({ width: width * sc, height: height * sc });
        $parent.attr('has-upload', 1);

        var dx = dom.width()/2 - width*sc/2;
        var dy = dom.height()/2 - height*sc/2;
        createTool2(dx, dy);
        $('.clear-btn').removeClass('disabled');
      }
    });

  }


  var downloadableCanvas;
  var createSplitCanvas = function() {
    var dw = $('.dom1').width();
    var dh = $('.dom1').height();
    $('.downloadable-box, .side-a, .side-b').width(dw);
    $('.downloadable-box, .side-a, .side-b').height(dw);
    $('.side-a, .side-b').empty();

    $('.dom1').clone().appendTo('.side-a');
    $('.dom2').clone().appendTo('.side-b');
    // var img = $('<img/>');
    // img.attr('src', 'img/masker1.png');
    // $('.downloadable-box').append(img);

    $('.dom1 .selector').remove();
    $('.dom1 svg').remove();
    $('.dom2 .selector').remove();
    $('.dom2 svg').remove();

    var sc = Math.max(1, 1000 / dw);
    // $('.downloadable-box').css('transform', 'scale(' + sc + ')');
    // $('.downloadable-box').css('transform-origin', 'top left');

    $('.downloadable-box-2').empty();
    $('.side-a').clone().appendTo('.downloadable-box-2');
    $('.side-b').clone().appendTo('.downloadable-box-2');
    $('.downloadable-box-2 .side-a').css('transform', 'scale(' + sc + ')');
    $('.downloadable-box-2 .side-a').css('transform-origin', 'top left');

    $('.downloadable-box-2 .side-b').css('transform', 'scale(' + sc + ')');
    $('.downloadable-box-2 .side-b').css('transform-origin', 'top left');

    $('.downloadable-box-2 .side-a .dom').removeAttr('id');

    var m = $('[masker]').attr('masker');
    var img = $('<img/>');
    img.attr('src', 'img/masker' + m + '.png');
    img.addClass('top-masker');
    $('.downloadable-box-2').append(img);



    updateDownloadableBox(function(canvas) {
      fixInput();
      setPage('caption');
      $('.savable').empty();
      $('.savable').append(canvas);
    });
  };

  var initialW = 0;
  window.updateDownloadableBox = function(cb, initialW) {
    $('body').addClass('loading');
    html2canvas(
        document.querySelector('.downloadable-box-2'),
        { backgroundColor: 'ff00ff' }
      ).then(function(canvas) {
        downloadableCanvas = canvas;
        $('body').removeClass('loading');
        cb(canvas);
      });

    return;


    html2canvas(
        document.querySelector('.main'),
        { backgroundColor: 'ff00ff' }
      ).then(function(canvas) {
        // downloadableCanvas = canvas;

        // creating dummy view
        $('body').append(canvas);
        $('body').addClass('loading');
        $(canvas).addClass('canvas-loading');
        $(canvas).css({
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
        })


        // magic for hi res
        if (!initialW) {
          initialW = $('.uploader .dom1').width();
        }
        var dw = initialW;
        var sc = Math.max(1, 1000 / dw);

        $('.main').css('transform', 'scale(' + sc + ')');
        $('.main').css('transform-origin', 'top left');

        html2canvas(
            document.querySelector('.downloadable-box-2'),
            { backgroundColor: 'ff00ff' }
          ).then(function(canvas) {
            $('.canvas-loading').remove();
            $('body').removeClass('loading');
            downloadableCanvas = canvas;
            $('body').append(canvas);
            $('.main').removeAttr('style');
            cb(canvas);
          });

      });
  };


  var createFinalCanvas = function() {
    var tick;
    html2canvas(
        document.querySelector('.savable'),
        { backgroundColor: 'ff00ff' }
      ).then(function(canvas) {
        postCanvas(canvas);

      });

    if (Platform.isIOS)  {
      updateDownloadableBox(function(canvas) {
        setPage('done');
        postCanvasForDownload(canvas);
      });
    } else {
      setPage('done');
      isFinalCanvasReady = true;
      $('.social-ig').removeClass('disabled');
    }
  };

  /*
  * S3 SAVING 
  */
  var TITLE = 'The Top of Mount Everest';
  var REDIRECT = 'https://www.thetopofmounteverest.com/';
  var DESCRIPTION = 'Do You Want To Climb Mt. Everest';
  var api_id = "169212603119083";
  var isFinalCanvasReady = false;
  var postCanvas = function(canvas) {
    var s3_url =
      "https://s3.us-west-2.amazonaws.com/dev.thetopofmounteverest.com/";
    var share_url = "https://api.thetopofmounteverest.com/share.php?";
    // var canvas = document.getElementById("canvas");

    var canvasData = canvas.toDataURL("image/png");
    var postData = "file=" + canvasData;

    var ajax = new XMLHttpRequest();

    // Setup our listener to process completed requests
    ajax.onload = function() {
      // Process our return data
      if (ajax.status >= 200 && ajax.status < 300) {
        // Runs when the request is successful
        res = JSON.parse(ajax.responseText);

        //upload to FB and Twitter here
        var s3UploadedFile = s3_url + res.file_name;

        var share =
          share_url +
          "image=" +
          res.file_name +
          "&title=" +
          encodeURIComponent(TITLE) +
          "&redirect=" +
          REDIRECT +
          "&description=" +
          encodeURIComponent(DESCRIPTION + ' ');
        var url = encodeURIComponent(share);

        // twitter sharer
        var twURL = "https://twitter.com/intent/tweet?text=" + url;
        // var win = window.open(URL, "_blank", strWindowFeatures);

        $('.tw-link').attr('href', twURL);


        // fb sharer
        var fbURL =
          "https://www.facebook.com/dialog/share?app_id=" +
          api_id +
          "&display=popup&href=" +
          url +
          "&scrape=true";

        $('.fb-link').attr('href', fbURL);
        // var win = window.open(URL, "_blank", strWindowFeatures);

        $('.social-fb, .social-tw').removeClass('disabled');

      }
      // }
    };

    // ajax.open("POST", "https://api.thetopofmounteverest.com/upload.php", true);
    ajax.open("POST", "https://api.thetopofmounteverest.com/upload.php", true);

    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    ajax.send(postData);
    // console.log(ajax.responseText);
  }


  var postCanvasForDownload = function(canvas) {
    var s3_url =
      "https://s3.us-west-2.amazonaws.com/assets.thetopofmounteverest.com/";
    var share_url = "https://api.thetopofmounteverest.com/share.php?";
    // var canvas = document.getElementById("canvas");


    var canvasData = canvas.toDataURL("image/png");
    var postData = "file=" + canvasData;

    var ajax = new XMLHttpRequest();

    // Setup our listener to process completed requests
    ajax.onload = function() {
      // Process our return data
      if (ajax.status >= 200 && ajax.status < 300) {
        // Runs when the request is successful
        res = JSON.parse(ajax.responseText);

        // var s3UploadedFile = s3_url + res.file_name;
        $('.dl-link').attr('href', s3_url + res.file_name);
        $('.dl-link').attr('download', 'thetopofmounteverest.png');

        isFinalCanvasReady = true;
        $('.social-ig').removeClass('disabled');
      }
    };

    // ajax.open("POST", "https://api.thetopofmounteverest.com/upload.php", true);
    ajax.open("POST", "https://api.thetopofmounteverest.com/upload.php", true);

    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    ajax.send(postData);
  }

  // autosize.update(input[0]);
  autosize(input);


  onResize();


  window.location.hash = 'home';
  resetInputCaption();
});

var hashes = ['#choose', '#upload', '#caption', '#review', '#done'];
window.onhashchange = function() {
  var hash = window.location.hash;

  var currentPage = $('[current-page]');
  var faceCount = $('[face-count]');
  var masker = $('[face-count]');
  var review = $('[review]');
  var allDone = $('[all-done]');

  if (hashes.indexOf(hash) === -1) {
    hash = '#home';
    window.location.hash = 'home'
    currentPage.attr('current-page', 'home');
  }

  if (hash === '#home' || hash === '#choose' || hash === '#upload' || hash === '#caption') {
    currentPage.attr('current-page', hash.split('#')[1]);
    allDone.attr('all-done', 0);
    review.attr('review', 0);
  }
  if (hash === '#choose') {
    grecaptcha.execute('6LcSBqsUAAAAAK6dSBxcXQipLbp5VpQlBxaF6gf9', { action: 'upload' });
  }
  if (hash === '#caption') {
    fixInput();
  }
  if (hash === '#review') {
    currentPage.attr('current-page', 'review');
    allDone.attr('all-done', 0);
    review.attr('review', 1);
  }
  if (hash === '#done') {
    currentPage.attr('current-page', 'review');
    allDone.attr('all-done', 1);
  }
};
var fixInput = function() {
  if (window.innerWidth <= 720 && window.innerHeight > window.innerWidth) {
    $('.process-caption-btn').css('top', $('.editor')[0].getBoundingClientRect().bottom + 50);
    $('.skip-btn').css('top', $('.editor')[0].getBoundingClientRect().bottom + 50);
  } else {
    $('.process-caption-btn, .skip-btn').removeAttr('style');
  }
}

var onResize = function() {
  fixInput();

  if ($('body').hasClass('cookie-banner')) {
    try {
      var close = document.querySelector('.optanon-alert-box-wrapper .optanon-alert-box-corner-close');
      var alertH = document.querySelector('.optanon-alert-box-wrapper').offsetHeight;

      if (window.innerWidth <= 752) {
        close.style.marginTop = (-7) + 'px';
        close.style.right = (0) + 'px';
      } else {
        close.style.marginTop = (alertH / 2 - 22) + 'px';
        close.style.right = (10) + 'px';
      }

      // var links = document.querySelector('.links');
      // links.style.bottom = (alertH + 10) + 'px';
      $('.main').css('height', window.innerHeight - alertH);
    } catch(e) {}
  } else {
    $('.main').removeAttr('style');
  }
};

$(window).resize(onResize);



var settings = {
  maxLen: 60,
}

var input = document.querySelector('.caption-input');
input.addEventListener('keydown', function(e) {
  input.value = input.value.replace(/\r\n|\r|\n/g, '');
  if (e.keyCode === 13) {
    e.preventDefault();
  }
});
input.addEventListener('keyup', function(e) {
  input.value = input.value.replace(/\r\n|\r|\n/g, '');
  if (input.value.length >= settings.maxLen) {
    input.value = input.value.substr(0, settings.maxLen);
    autosize.update(input);
  }
});

window.trimInputs = function(e) {
  setTimeout(function() {
    input.value = input.value.replace(/\r\n|\r|\n/g, '');
    if (input.value.length >= settings.maxLen) {
      input.value = input.value.substr(0, settings.maxLen);
      autosize.update(input);
    }
  }, 10);
}
var keys = {
    'backspace': 8,
    'shift': 16,
    'ctrl': 17,
    'alt': 18,
    'delete': 46,
    // 'cmd':
    'leftArrow': 37,
    'upArrow': 38,
    'rightArrow': 39,
    'downArrow': 40,
  }

var utils = {
    special: {},
    navigational: {},
    isSpecial: function (e) {
      return typeof this.special[e.keyCode] !== 'undefined';
    },
    isNavigational: function(e) {
      return typeof this.navigational[e.keyCode] !== 'undefined';
    }
  }

  utils.special[keys['backspace']] = true;
  utils.special[keys['shift']] = true;
  utils.special[keys['ctrl']] = true;
  utils.special[keys['alt']] = true;
  utils.special[keys['delete']] = true;

  utils.navigational[keys['upArrow']] = true;
  utils.navigational[keys['downArrow']] = true;
  utils.navigational[keys['leftArrow']] = true;
  utils.navigational[keys['rightArrow']] = true;

  input.addEventListener('keydown', function(event) {
    // var len = event.target.innerText.trim().length;
    var len = event.target.value.length;
    var hasSelection = false;
    var selection = window.getSelection();
    var isSpecial = utils.isSpecial(event);
    var isNavigational = utils.isNavigational(event);
    
    if (selection) {
      hasSelection = !!selection.toString();
    }
    
    if (isSpecial || isNavigational) {
      return true;
    }
    
    if (len >= settings.maxLen && !hasSelection) {
      event.preventDefault();
      return false;
    }
    
  });
