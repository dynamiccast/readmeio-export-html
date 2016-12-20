var selectPage = function() {
  var hash = location.hash.replace( /^#/, '');

  var target = hash.split('target=')[1];
  $('.doc-page').hide();
  $('#' + target).show();
};

$(window).on('hashchange', selectPage);

selectPage();
