const { ipcRenderer } = require('electron');

let book;
let rendition;

ipcRenderer.on('open-file', function (event, filepath) {
  console.log(filepath);
  const splits = filepath.split('\\');
  const ext = splits[splits.length - 1].split('.')[1];

  if (ext === 'epub') {
    const epub = require('./epub');
    epub(filepath);
  } else if (ext === 'pdf') {
    const pdf = require('./pdf');
    pdf(filepath);
  }
});

var title = document.getElementById('title');

// rendition.on("rendered", function(section){
//   var current = book.navigation && book.navigation.get(section.href);

//   if (current) {
//     var $select = document.getElementById("toc");
//     var $selected = $select.querySelector("option[selected]");
//     if ($selected) {
//       $selected.removeAttribute("selected");
//     }

//     var $options = $select.querySelectorAll("option");
//     for (var i = 0; i < $options.length; ++i) {
//       let selected = $options[i].getAttribute("ref") === current.href;
//       if (selected) {
//         $options[i].setAttribute("selected", "");
//       }
//     }
//   }

// });

// rendition.on("layout", function(layout) {
//   let viewer = document.getElementById("viewer");

//   if (layout.spread) {
//     viewer.classList.remove('single');
//   } else {
//     viewer.classList.add('single');
//   }
// });

// window.addEventListener("unload", function () {
//   console.log("unloading");
//   this.book.destroy();
// });

// book.loaded.navigation.then(function(toc){
// 		var $select = document.getElementById("toc"),
// 				docfrag = document.createDocumentFragment();

// 		toc.forEach(function(chapter) {
// 			var option = document.createElement("option");
// 			option.textContent = chapter.label;
// 			option.setAttribute("ref", chapter.href);

// 			docfrag.appendChild(option);
// 		});

// 		$select.appendChild(docfrag);

// 		$select.onchange = function(){
// 				var index = $select.selectedIndex,
// 						url = $select.options[index].getAttribute("ref");
// 				rendition.display(url);
// 				return false;
// 		};

// 	});
