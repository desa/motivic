(function() {
  var b, m;

  $('.dropdown').each(function() {
    var label, list;
    label = $(this).children(".label");
    list = $(this).children(".dropdownList");
    return label.click(function() {
      return list.toggle();
    });
  });

  b = $('.blockContent');

  m = Math.max(($(window).width() - $('.sidebar').outerWidth(true) - $('.blockNav').outerWidth(true) - b.outerWidth(true)) / 2, 0);

  b.css('margin-left', m);

  b.css('margin-right', m);

  $(window).resize(function() {
    m = Math.max(($(window).width() - $('.sidebar').outerWidth(true) - $('.blockNav').outerWidth(true) - b.outerWidth(true)) / 2, 0);
    b.css('margin-left', m);
    return b.css('margin-right', m);
  });

}).call(this);
