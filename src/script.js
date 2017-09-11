function test() {
  var $ = jQuery;

  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function (e) {
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
    if (target.length) {
      $('html, body').animate({
        scrollTop: (target.offset().top - 48)
      }, 1000, "easeInOutExpo");
      return false;
    }
  });

  $('.js-scroll-trigger').click(function () {
    $('.navbar-collapse').collapse('hide');
  });

  $('body').scrollspy({
    target: '#mainNav',
    offset: 54
  });

  $(window).scroll(function () {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  });
}
