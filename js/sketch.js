// check the framer branch for a more complex version that trims things

window.onload = function () {
  // Make the paper scope global, by injecting it into window:
  paper.install(window);
  // Setup directly from canvas id:
  paper.setup('myCanvas');

  // Get a reference to the canvas object
  var canvas = document.getElementById('myCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerWidth * (8 / 16);

  paper.view.viewSize = new paper.Size(canvas.width, canvas.height);

  w = paper.view.bounds.width;
  h = paper.view.bounds.height;

  var background = new Shape.Rectangle({
    // strokeWidth: 50,
    // strokeColor: 'rgb(255,0,255)',
    fillColor: 'rgb(155,90,204)',
    point: [0, 0],
    // center: view.center,
    size: [w, h],
  });

  var tl = new TimelineMax({ repeat: -1, yoyo: true })
    // size
    // .to(rectangle.size, 2, { width: 100, height: 50 }, 0)
    // fillColor
    .to(
      background.fillColor,
      8,
      { red: 153 / 255, green: 153 / 255, blue: 104 / 255 },
      0
    );

  const svgUrls = [
    'assets/2022_01.svg',
    'assets/2022_02.svg',
    'assets/2022_03.svg',
    'assets/2022_04.svg',
    'assets/2022_05.svg',
    'assets/2022_06.svg',
    'assets/2022_07.svg',
  ];

  const numberSVGsToLoad = svgUrls.length;
  let numberSVGsLoaded = 0;

  let lastChoice = -1;

  for (var i = 0; i < svgUrls.length; i++) {
    var svgGroup = new paper.Group();

    var svg = project.importSVG(svgUrls[i], {
      expandShapes: true,
      onLoad: function (item) {
        item.visible = false;
        svgGroup.addChild(item);
        numberSVGsLoaded += 1;
      },
      onError: console.log('something went wrong importing'),
    });
  }

  const checkLoadedTimer = setInterval(checkLoaded, 100);

  function checkLoaded() {
    if (numberSVGsLoaded >= numberSVGsToLoad) {
      console.log('Done importing');

      clearInterval(checkLoadedTimer);

      // Randomly choose first item
      var svgChoice = Math.floor(Math.random() * svgGroup.children.length);
      lastChoice = svgChoice;
      svgGroup.children[svgChoice].visible = true;

      // Start Animation
      const animationTimer = setInterval(animationUpdate, 500);
    }
  }

  function animationUpdate() {
    var svgChoice = Math.floor(Math.random() * svgGroup.children.length);
    while (lastChoice === svgChoice) {
      svgChoice = Math.floor(Math.random() * svgGroup.children.length);
    }
    svgGroup.children[lastChoice].visible = false;
    svgGroup.children[svgChoice].visible = true;
    lastChoice = svgChoice;
  }

  // now draw
  paper.view.draw();

  window.addEventListener('resize', resizeCanvas, false);

  // when view is resized...
  function resizeCanvas() {
    // store new view width/height
    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth * (8 / 16);

    paper.view.viewSize = new paper.Size(canvas.width, canvas.height);
    background.point = [0, 0];
    background.size = [canvas.width, canvas.height];

    paper.view.draw();
  }
};

// Helper functions for radians and degrees.
Math.radians = function (degrees) {
  return (degrees * Math.PI) / 180;
};

Math.degrees = function (radians) {
  return (radians * 180) / Math.PI;
};
