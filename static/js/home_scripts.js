(function() {
  var h, ids, page, pos, win;

  win = $(window);

  h = [0];

  ids = {};

  $('nav').css('z-index', 100);

  $('.page').each(function(i) {
    return $(this).css('z-index', 99 - i);
  });

  $('footer').css('z-index', $('.page:last').css('z-index') - 10);

  page = function() {
    var ex, lh;
    $('.full').each(function() {
      var ph;
      $(this).height(win.height());
      ph = $(this).height();
      return $(this).children('.pageContent').height(ph - $(this).outerHeight(true) + $(this).height());
    });
    ex = $('.last').outerHeight(true) - $('.last').height();
    $('.last').height(win.height() - ex - $('footer').outerHeight(true));
    lh = $('.last').height();
    return $('.last > .pageContent').height(lh - $(this).outerHeight() + $(this).height());
  };

  page();

  $('.page').each(function(i) {
    h[i + 1] = h[i] + $(this).outerHeight(true);
    if (i !== 0) {
      $(this).css('position', 'fixed').css('top', '0px');
    }
    if ($(this).prop('id')) {
      return ids[$(this).prop('id')] = i;
    }
  });

  $('.pages').height(h[h.length - 1] + $('footer').outerHeight(true));

  win.resize(function() {
    page();
    return $('.page').each(function(i) {
      return h[i + 1] = h[i] + $(this).outerHeight(true);
    });
  });

  $('a[id != "more"]').click(function() {
    var id, u;
    u = $(this).attr('href').match(/\#(.*)/);
    if (u[1]) {
      id = ids[u[1]];
    }
    if (id) {
      return win.scrollTop(h[id]);
    }
  });

  $('#more').click(function() {
    return $('html, body').animate({
      scrollTop: h[1]
    }, 500);
  });

  pos = 0;

  win.scroll(function() {
    var id, o, pg, sc;
    o = function(h_1, h_0, h_n, p) {
      var op, xb, xt;
      xt = h_1 + (h_0 - h_1) * p;
      xb = h_0 - (h_0 - h_1) * p;
      op = 1 - (h_n - xt) / (xt - xb);
      op = Math.min(op, 1);
      return op = Math.max(op, 0);
    };
    sc = win.scrollTop();
    if (sc > h[pos] && pos < h.length) {
      pos += 1;
      pg = $('.page:nth-child(' + pos + ')');
      pg.css('position', 'relative');
    } else {
      if (sc < h[pos - 1]) {
        pg = $('.page:nth-child(' + pos + ')');
        pg.css('position', 'fixed');
        pos -= 1;
        pg = $('.page:nth-child(' + pos + ')');
      }
    }
    if (pg) {
      id = window.location.pathname;
      if (pg.attr('id')) {
        if (pg.attr('id') !== 'top') {
          id += '#' + pg.attr('id');
        }
      }
      return history.replaceState({
        home: id
      }, "page " + pos, id);
    }
  });

  $('#log > a').click(function(e) {
    e.preventDefault();
    return $('#logInOverlay').fadeIn();
  });

  $('.cancel').click(function(e) {
    e.preventDefault();
    return $('#logInOverlay').fadeOut();
  });

}).call(this);
