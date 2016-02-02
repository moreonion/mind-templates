$(window).load(function(){

  // two column layout
  if ($('.eaRightColumnContent').length && $('.eaLeftColumnContent').length) {
    sortTwoColumn();
    $('body').addClass('twocolumn');

    // if form in right column:
    // * move submit button to right column
    // * put right column before left column
    if ($('.eaRightColumnContent .eaFormField').length) {
      $('.eaSubmitResetButtonGroup').appendTo($('.en_right_wrapper').last());
      $('.en_left_wrapper').each(function(){
        var id = $(this).attr('id').match(/[0-9]+$/);
        $(this).before($('#right_wrapper' + id[0]));
      });
    } else {
      $('.eaSubmitResetButtonGroup').appendTo($('.en_left_wrapper').last());
    }
  }

  // enable Picker and Selector
  // see http://www.benplum.com/formstone/
  if (typeof $.fn.selecter == 'function') {
    $('select').selecter();
  }
  if (typeof $.fn.picker == 'function') {
    $('input[type=radio], input[type=checkbox]').picker();
  }

  // consolidate markup:
  // * add missing div around textareas to apply wobbles
  // * move all mandatory field marker inside the label
  $('textarea').each(function() {
    var $parents = $('.eaFormField, .eaSwitchSubjectContainer, .eaMessageContentContainer, .eaQuestionTextareaFormFieldContainer, .textarea-wrapper');
    if (!$(this).parent($parents)) {
      $(this).wrap("<div class='textarea-wrapper'></div>");
    }
  });
  $('label + .eaMandatoryFieldMarker').each(function() {
    $(this).prev('label').append($(this));
  });

  // move validation icon next to label
  // and the error message below the label
  $('.eaErrorMessage').each(function() {
    var self = $(this);
    var label = self.siblings('.eaFormElementLabel');
    var field = self.siblings('.eaFormField');
    var icon = $('.eaValidationIcon', label.parent());
    icon.appendTo(label);
    self.appendTo(field);
  });

  // add class to field where error occured
  // and show error message container
  $(window).on('DOMSubtreeModified', '.eaErrorMessage', function(e) {
    var self = $(e.target);
    if (!self.is(':empty')) {
      self.closest('.eaFormField').addClass('validationError');
    }
    if (/[\S]/.test($('#eaerrors').html())) {
      $('#eaerrors').show();
    }
  });

  // mark first copybox of a column
  $('.eaLeftColumnContent').first().addClass('first');
  $('.eaRightColumnContent').first().addClass('first');
  $('.eaFullWidthContent').first().addClass('first');

  // add "read more" link functionality
  $('.background-info-hidden').hide();
  $('.info-toggle').css('display', 'block');
  $('.info-toggle').on('click', function(e) {
    var $toggle = $(this);
    var $target = $('#background-info');
    if ($target.length > 0) {
      $target.slideDown('fast', function(){
        $toggle.hide();
      });
    }
    e.preventDefault();
    return false;
  });

  // function to read and return the pgbar config
  function thermoConfig(el) {
    var campaignId = $('input[name="ea.campaign.id"]').val();
    if (!campaignId) {
      return null;
    }
    var storageKey = 'pgbar-config-' + campaignId;
    var storedConfig = JSON.parse(sessionStorage.getItem(storageKey))
    var config = {};
    var defaults = {
      campaignId: campaignId, // reload on every page, not saved
      '$el': $(el), // reload on every page, not saved
      start: 0, // overridable by config copy block
      target: 250, // overridable by config copy block
      service: 'EaEmailAOTarget' // overridable by config copy block
    };
    if (storedConfig) {
      config = $.extend(defaults, storedConfig);
    } else {
      config = $.extend(defaults, {});
      var dataTarget = config['$el'].data('target');
      if (typeof dataTarget !== 'undefined') {
        var parsedTarget = parseInt(dataTarget, 10);
        if (!isNaN(parsedTarget) && parsedTarget > 0) {
          config['target'] = parsedTarget;
        }
      }
      var dataStart = config['$el'].data('start');
      if (typeof dataStart !== 'undefined') {
        var parsedStart = parseInt(dataStart, 10);
        if (!isNaN(parsedStart) && parsedStart > 0) {
          config['start'] = parsedTarget;
        }
      }
      var dataService = config['$el'].data('service');
      if (typeof dataService !== 'undefined') {
        if (dataService == 'NetDonor' || dataService == 'EaEmailAOTarget') {
          config['service'] = dataService;
        }
      }

      // check for config copy block
      var copyBlockConfig = {};
      if ($('input[name="pgbar-config-target"]').length > 0) {
        copyBlockConfig['target'] = $('input[name="pgbar-config-target"]').val();
      }
      if ($('input[name="pgbar-config-start"]').length > 0) {
        copyBlockConfig['start'] = $('input[name="pgbar-config-start"]').val();
      }
      if ($('input[name="pgbar-config-service"]').length > 0) {
        copyBlockConfig['service'] = $('input[name="pgbar-config-service"]').val();
      }
      $.extend(config, copyBlockConfig);

      // do not store el and campaignId
      // these have to be fresh
      // whitelist: start, target, service
      var configToStore = {
        start: config['start'],
        target: config['target'],
        service: config['service']
      }
      sessionStorage.setItem(storageKey, JSON.stringify(configToStore))
    }

    return config;
  }

  // get pgbar config, initialize it
  var thConfig = thermoConfig('#pgbar .thermometer');
  thConfig['$el'].eActivistThermometer({
    token: "c5ffb7dd-de95-4ed2-9371-55e11b7db1e0",
    campaignId: thConfig['campaignId'],
    target: parseInt(thConfig['target'], 10),
    initialValue: parseInt(thConfig['start'], 10),
    service: thConfig['service'],
    targetDataColumn: 'participatingSupporters'
  });

  // update/get/set functions for sessionStorage use with Leadpanel
  function getLpPrefillStorage() {
    var saved = JSON.parse(sessionStorage.getItem('leadpanel_prefill'));
    if (saved === null) {
      saved = {};
    }
    return saved;
  }
  function setLpPrefillStorage(newValues) {
    var savedValues = JSON.parse(sessionStorage.getItem('leadpanel_prefill'));
    if (savedValues === null) {
      savedValues = {}
    }
    if (Object.keys(savedValues).length > 0) {
      for (prop in newValues) {
        savedValues[prop] = newValues[prop];
      }
    } else {
      savedValues = newValues;
    }
    sessionStorage.setItem('leadpanel_prefill', JSON.stringify(savedValues));
  }
  function updateLpPrefillStorage(key, value) {
    if (typeof key === 'undefined' || typeof value === 'undefined') {
      throw new TypeError('Not enough arguments for updateLpPrefillStorage');
    }
    if (key === null) {
      throw new TypeError('Key cannot be null for updateLpPrefillStorage');
    }
    var saved = getLpPrefillStorage();
    saved[key + ''] = value + '';
    setLpPrefillStorage(saved);
  }

  // initialize storage pre-checked checkboxes
  $('input[type=checkbox]:checked').each(function(e) {
    var v = $(this).val();
    var name = $(this).attr('name');
    if (typeof name === 'undefined' || name.length < 1) {
      return;
    }
    updateLpPrefillStorage(name, v);
  });

  // on value changes update the storage
  $('input, select, textarea').on('change', function(e) {
    var v = $(this).val();
    var name = $(this).attr('name');
    if (typeof name === 'undefined' || name.length < 1) {
      return;
    }
    if ($(this).attr('type') === 'checkbox' && !$(this).prop('checked')) {
      v = ''; // unset value if unchecked, the html elements value for a
              // checkbox stays the same, regardless the checked state
    }
    updateLpPrefillStorage(name, v);
  });
});
