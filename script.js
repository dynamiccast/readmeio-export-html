$(window).on('hashchange', function(e){
  var hash = location.hash.replace( /^#/, '');

  var target = hash.split('target=')[1];
  $('.doc-page').hide();
  $('#' + target).show();
});
