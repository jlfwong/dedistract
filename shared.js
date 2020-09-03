var addUnblockButton = function(selector) {
  function getContent() {
    return $(selector).first();
  }

  var msg = [
    "Better things to do on your birthday:",
    "- Go to `jamieis${adjective}${age}.${tld}` and click the *right* link",
    "- Enter 'burning man' for the password"
  ].join("<br>");

  var holdLength = 5000;
  var intervalLength = 100;
  var heldTime = 0;

  var shrinkTimeout = null;

  var fontSize = 20;

  var shrink = function() {
    heldTime += intervalLength;
    $showButton.css('font-size',
                    fontSize * ((holdLength - heldTime) / holdLength));
    if (heldTime >= holdLength) {
      getContent().css({display: "block", visibility: "visible"})
      $showButton.hide();
    } else {
      shrinkTimeout = setTimeout(shrink, intervalLength);
    }
  };

  var $showButton = $("<div>")
    .addClass("dedistract-header")
    .css({
      'font-family': 'monospace',
      'font-color': 'red',
      'font-size': fontSize,
      'min-height': fontSize * 1.5,
      'line-height': fontSize * 1.5 + "px",
      'text-align': 'left',
      'margin-left': 30
    })
    .html(msg)
    .mousedown(function(evt) {
      if (evt.button === 0) {
        shrinkTimeout = setTimeout(shrink, intervalLength);
      }
    })
    .mouseout(function() {
      clearTimeout(shrinkTimeout);
    })
    .mouseup(function() {
      clearTimeout(shrinkTimeout);
    });

  var tries = 0;

  (function addButton() {
    if (tries++ > 5) return;
    var $content = getContent()
    if ($content.length > 0) {
      $content.before($showButton);
    } else {
      setTimeout(addButton, 1000)
    }
  })()
};
