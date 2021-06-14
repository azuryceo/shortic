// Copy Function
function copy(value) {
  var tempInput = document.createElement("input");
  tempInput.style = "position: absolute; left: -1000px; top: -1000px";
  tempInput.value = value;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
}

// Preloader
$(document).ready(function hidePreloader(){
  $('.loader-oa2dik').fadeOut(1000);
  $('.app-7hx5g9').css('display','flex');
});

// Cookie Notice
$(".btn-tjx5g4").click(function hideCookieNotice(){
  $(".cookieNotice-xrj9n7").fadeOut();
});

$(document).ready(function showCookieNotice() {
  var isshow = localStorage.getItem('cookienotice');
  if (isshow== null) {
    localStorage.setItem('cookienotice', 1);
      $('.cookieNotice-xrj9n7').show();
    }
});

// Tips
tippy('.input-o90v7m', {
  content: 'Paste the long link here in',
  animation: 'shift-toward-extreme',
  theme: 'darken',
});

tippy('.link-sp0l5y', {
  content: 'Copied',
  animation: 'shift-toward-extreme',
  theme: 'darken',
  trigger: 'click',
});

tippy('.fa-copy', {
  content: 'Copy this',
  animation: 'shift-toward-extreme',
  theme: 'darken',
});

tippy('.fa-share', {
  content: 'Check this out',
  animation: 'shift-toward-extreme',
  theme: 'darken',
});