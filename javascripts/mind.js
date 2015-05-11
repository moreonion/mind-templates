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
    if (!/[\S]/.test($('#eaerrors').html())) {
      $('#eaerrors').show();
    }
  });

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

});
