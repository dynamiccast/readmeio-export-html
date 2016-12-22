var selectPage = function() {
  var hash = location.hash.replace( /^#/, '');

  var target = hash.split('target=')[1];
  $('.doc-page').hide();
  $('#' + target).show();
};

$(window).on('hashchange', selectPage);

selectPage();
hljs.initHighlightingOnLoad();

// Get the modal
var modal = document.getElementById('modal');

// Get the image and insert it inside the modal - use its "alt" text as a caption
var modalImg = document.getElementById("image-modal");
var captionText = document.getElementById("caption");
$('.page-image').click(function(){
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
});

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}
