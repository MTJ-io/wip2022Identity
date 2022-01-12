// check the framer branch for a more complex version that trims things

window.onload = function () {
  // Make the paper scope global, by injecting it into window:
  paper.install(window);
  // Setup directly from canvas id:
  paper.setup('myCanvas');

  // Get a reference to the canvas object
  var canvas = document.getElementById('myCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerWidth * (4 / 16);

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
  let svgs = [];
  for (var i = 0; i < svgUrls.length; i++) {
    var svg2022Group = new paper.Group();

    svgs[i] = project.importSVG(svgUrls[i], {
      expandShapes: true,
      onLoad: function (item) {
        item.visible = false;
        svg2022Group.addChild(item);
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
      var svgChoice = Math.floor(Math.random() * svg2022Group.children.length);
      lastChoice = svgChoice;
      svg2022Group.children[svgChoice].visible = true;
      // svgs[svgChoice].scale(2);

      var groupHeight =
        svg2022Group.bounds.bottomLeft.y - svg2022Group.bounds.topLeft.y;

      var scaleFactor = (paper.view.bounds.height - 40) / groupHeight;

      console.log('groupHeight ', groupHeight);
      console.log('canvas.height ', paper.view.bounds.height);
      console.log('scaleFactor ', scaleFactor);

      // Position and Scale Group
      svg2022Group.scale(scaleFactor, svg2022Group.bounds.topLeft);
      svg2022Group.translate(svg2022Group.localToParent(20, 20));

      // Start Animation
      const animationTimer = setInterval(animationUpdate, 750);
    }
  }

  function animationUpdate() {
    var svgChoice = Math.floor(Math.random() * svg2022Group.children.length);
    while (lastChoice === svgChoice) {
      svgChoice = Math.floor(Math.random() * svg2022Group.children.length);
    }
    svg2022Group.children[lastChoice].visible = false;
    svg2022Group.children[svgChoice].visible = true;
    lastChoice = svgChoice;
  }

  // WIP SVG
  const svgWipUrl = 'assets/WIP.svg';
  var svgWipGroup = new paper.Group();

  const wipSvgs = project.importSVG(svgWipUrl, {
    expandShapes: true,
    onLoad: function (item) {
      item.visible = true;
      svgWipGroup.addChild(item);
    },
    onError: console.log('something went wrong importing'),
  });

  const checkWipSvgLoadedTimer = setInterval(checkWipSvgLoaded, 100);

  function checkWipSvgLoaded() {
    if (svgWipGroup.children.length > 0) {
      console.log('Done importing WiP svg');

      clearInterval(checkWipSvgLoadedTimer);

      var groupHeight =
        svgWipGroup.bounds.bottomLeft.y - svgWipGroup.bounds.topLeft.y;

      var scaleFactor = (paper.view.bounds.height - 40) / groupHeight;

      // Position and Scale Group
      svgWipGroup.scale(scaleFactor, svgWipGroup.bounds.topLeft);
      // svgWipGroup.bounds.topRight = paper.view.bounds.width - 20;
      svgWipGroup.translate(
        svgWipGroup.localToParent(
          paper.view.bounds.width -
            svgWipGroup.bounds.topRight.x -
            svgWipGroup.bounds.topLeft.x -
            40,
          20
        )
      );
    }
  }

  // now draw
  paper.view.draw();

  window.addEventListener('resize', resizeCanvas, false);

  // when view is resized...
  function resizeCanvas() {
    // store new view width/height
    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth * (4 / 16);

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
