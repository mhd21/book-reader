module.exports = (filepath) => {
  const container = document.getElementById('container');
  container.innerHTML = `
        <div id="area"></div>
        <a id="prev" href="#prev" class="arrow">‹</a>
        <a id="next" href="#next" class="arrow">›</a>
    `;

  const ePub = require('epubjs');

  book = new ePub.default(filepath);
  rendition = book.renderTo('area', {
    width: 800,
    height: 600,
    spread: 'always',
    flow: 'paginated',
  });

  rendition.display();

  book.ready.then(function () {
    var next = document.getElementById('next');

    next.addEventListener(
      'click',
      function (e) {
        book.package.metadata.direction === 'rtl'
          ? rendition.prev()
          : rendition.next();
        e.preventDefault();
      },
      false
    );

    var prev = document.getElementById('prev');
    prev.addEventListener(
      'click',
      function (e) {
        book.package.metadata.direction === 'rtl'
          ? rendition.next()
          : rendition.prev();
        e.preventDefault();
      },
      false
    );

    var keyListener = function (e) {
      // Left Key
      if ((e.keyCode || e.which) == 37) {
        book.package.metadata.direction === 'rtl'
          ? rendition.next()
          : rendition.prev();
      }

      // Right Key
      if ((e.keyCode || e.which) == 39) {
        book.package.metadata.direction === 'rtl'
          ? rendition.prev()
          : rendition.next();
      }
    };

    rendition.on('keyup', keyListener);
    document.addEventListener('keyup', keyListener, false);
  });

  rendition.on('relocated', function (location) {
    console.log(location);

    var next =
      book.package.metadata.direction === 'rtl'
        ? document.getElementById('prev')
        : document.getElementById('next');
    var prev =
      book.package.metadata.direction === 'rtl'
        ? document.getElementById('next')
        : document.getElementById('prev');

    if (location.atEnd) {
      next.style.visibility = 'hidden';
    } else {
      next.style.visibility = 'visible';
    }

    if (location.atStart) {
      prev.style.visibility = 'hidden';
    } else {
      prev.style.visibility = 'visible';
    }
  });
};
