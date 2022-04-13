const pdfjs = require('pdfjs-dist');

module.exports = (url) => {
  const container = document.getElementById('container');
  container.innerHTML = `

  <div>
  <button id="prev">Previous</button>
  <button id="next">Next</button>
  &nbsp; &nbsp;
  <span>Page: <span id="page_num"></span> / <span id="page_count"></span></span>
</div>

  <canvas
  id="the-canvas"
  style="border: 1px solid black; direction: ltr;"
></canvas>
  
  `;

  pdfjs.GlobalWorkerOptions.workerSrc =
    './node_modules/pdfjs-dist/build/pdf.worker.js';

  const loadingTask = pdfjs.getDocument(url);

  (async () => {
    let pdfDoc;
    //
    // Fetch the first page
    //

    let pageNum = 1;
    let pageRendering = false;
    let pageNumPending = null;

    function renderPage(num) {
      const scale = 1.5;
      // Support HiDPI-screens.
      const outputScale = window.devicePixelRatio || 1;

      //
      // Prepare canvas using PDF page dimensions
      //
      const canvas = document.getElementById('the-canvas');
      const context = canvas.getContext('2d');

      pageRendering = true;
      // Using promise to fetch the page
      pdfDoc.getPage(num).then(function (page) {
        var viewport = page.getViewport({ scale: scale });
        // Support HiDPI-screens.
        var outputScale = window.devicePixelRatio || 1;

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + 'px';
        canvas.style.height = Math.floor(viewport.height) + 'px';

        var transform =
          outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: context,
          transform: transform,
          viewport: viewport,
        };
        var renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(function () {
          pageRendering = false;
          if (pageNumPending !== null) {
            // New page rendering is pending
            renderPage(pageNumPending);
            pageNumPending = null;
          }
        });
      });

      // Update page counters
      document.getElementById('page_num').textContent = num;
    }

    function queueRenderPage(num) {
      if (pageRendering) {
        pageNumPending = num;
      } else {
        renderPage(num);
      }
    }

    /**
     * Displays previous page.
     */
    function onPrevPage() {
      if (pageNum <= 1) {
        return;
      }
      pageNum--;
      queueRenderPage(pageNum);
    }
    document.getElementById('prev').addEventListener('click', onPrevPage);

    /**
     * Displays next page.
     */
    function onNextPage() {
      if (pageNum >= pdfDoc.numPages) {
        return;
      }
      pageNum++;
      queueRenderPage(pageNum);
    }
    document.getElementById('next').addEventListener('click', onNextPage);

    loadingTask.promise.then(function (pdfDoc_) {
      pdfDoc = pdfDoc_;
      document.getElementById('page_count').textContent = pdfDoc.numPages;

      // Initial/first page rendering
      renderPage(pageNum);
    });
  })();
};
