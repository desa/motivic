(function() {
  var h, ids, page, pos, win;

  win = $(window);

  h = [0];

  ids = {};

  page = function() {
    return $('.full').each(function() {
      $(this).height(win.height(), -$(this).outerHeight(), +$(this).height());
      return $(this).children('.pageContent').height($(this).height(), -$(this).outerHeight(true), +$(this).height());
    });
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

  $('.pages').height(h[h.length - 1]);

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
      console.log('u:' + u + '  id:' + id);
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

}).call(this);
