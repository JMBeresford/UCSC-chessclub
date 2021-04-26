import {
  Scene,
  Vector2,
  Mesh,
  SphereBufferGeometry,
  MeshStandardMaterial,
  MeshBasicMaterial,
  Color,
  Group,
  Raycaster,
  TextureLoader,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  BoxBufferGeometry,
  FogExp2,
  WebGLRenderer,
} from '../../three/build/three.module.js';

const board = Vue.component('board', {
  props: { zoominto: Boolean },
  data() {
    return {
      gui: null,
      interactive: false,
      boardSize: null,
      squareSize: null,
      animating: {
        in: [],
        waiting: [],
        out: [],
      },
      camera: null,
      cameraOpts: {
        fov: null,
        aspect: null,
        near: null,
        far: null,
      },
      scene: null,
      raycaster: null,
      board: null,
      hoverBoard: null,
      container: null,
      mouse: null,
      intersects: null,
      camTarget: null,
      colors: {
        darkSquare: null,
        bg: null,
      },
      textures: {
        normalMapLight: 'maps/light/normal.png',
        normalMapDark: 'maps/dark/normal.png',
        albedoMapLight: 'maps/light/albedo.png',
      },
      maps: {
        normal: {
          dark: null,
          light: null,
        },
        albedo: {
          light: null,
        },
      },
      lights: {
        ambient: null,
        directional: null,
      },
      lightOpts: {
        directional: {
          shadowOpts: {
            mapWidth: 1024,
            mapHeight: 1024,
            camFar: 10,
            camLeft: -1.5,
            camRight: 1.5,
            camBottom: -1.5,
            camTop: 1.5,
          },
        },
      },
      geos: {
        square: null,
      },
      mats: {
        lightSquare: null,
        darkSquare: null,
        invis: null,
      },
      renderer: null,
      frame: null,
      flipFrame: null,
    };
  },
  methods: {
    resize: function () {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    handleMouseMove: function (e) {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    },
    markAnimation: function (point) {
      point.userData.aniState = 'animating';
      point.children[0].castShadow = true;
    },
    markWaiting: function (point) {
      point.userData.aniState = 'waiting';
    },
    markAnimated: function (point) {
      point.userData.aniState = 'idle';
      let square = point.children[0];
      square.castShadow = false;
    },
    doLifts: function () {
      for (var intersection of this.intersects) {
        var point = intersection.object;
        if (point.userData.aniState == 'idle') {
          var square = point.children[0];

          gsap.to(square.position, {
            onStart: this.markAnimation,
            onStartParams: [point],
            z: -0.1,
            duration: 0.5,
            onComplete: this.markWaiting,
            onCompleteParams: [point],
          });
        }
      }
    },
    doDescents: function () {
      for (var point of this.board.children) {
        if (!this.intersects.find((el) => el.object === point)) {
          if (point.userData.aniState == 'waiting') {
            let square = point.children[0];

            gsap.to(square.position, {
              onStart: this.markAnimation,
              onStartParams: [point],
              z: 0,
              duration: 0.5,
              onComplete: this.markAnimated,
              onCompleteParams: [point],
            });
          }
        }
      }
    },
    createBoard: function () {
      let square, hoverSquare;
      for (var i = 0; i < this.boardSize; i++) {
        if (i % 2 === 0) {
          // even rows
          for (var j = 0; j < this.boardSize; j++) {
            if (j % 2 === 0) {
              square = new Mesh(this.geos.square, this.mats.lightSquare);
            } else {
              square = new Mesh(this.geos.square, this.mats.darkSquare);
            }
            hoverSquare = new Mesh(this.geos.square, this.mats.invis);
            hoverSquare.position.set(
              (j - Math.floor(this.boardSize / 2)) * this.squareSize,
              0,
              i * this.squareSize
            );
            hoverSquare.rotateX(Math.PI / 2);
            square.receiveShadow = true;
            hoverSquare.receiveShadow = true;
            square.castShadow = false;
            hoverSquare.add(square);
            hoverSquare.userData.aniState = 'idle';
            this.board.add(hoverSquare);
          }
        } else {
          // odd rows
          for (var j = 0; j < this.boardSize; j++) {
            if (j % 2 === 0) {
              square = new Mesh(this.geos.square, this.mats.darkSquare);
            } else {
              square = new Mesh(this.geos.square, this.mats.lightSquare);
            }
            hoverSquare = new Mesh(this.geos.square, this.mats.invis);
            hoverSquare.position.set(
              (j - Math.floor(this.boardSize / 2)) * this.squareSize,
              0,
              i * this.squareSize
            );
            hoverSquare.rotateX(Math.PI / 2);
            square.receiveShadow = true;
            hoverSquare.receiveShadow = true;
            square.castShadow = false;
            hoverSquare.add(square);
            hoverSquare.userData.aniState = 'idle';
            this.board.add(hoverSquare);
          }
        }
      }
    },
    render: function () {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      this.intersects = this.raycaster.intersectObjects(this.board.children);

      if (this.interactive) {
        this.doLifts();
        this.doDescents();
      }

      this.renderer.render(this.scene, this.camera);
      this.frame = requestAnimationFrame(this.render);
    },
    zoom: function () {
      gsap.to(this.camera.position, {
        y: 0.25,
        duration: 5,
      });
      gsap.to(this.camTarget.position, {
        z: -1,
        duration: 3,
        delay: 3,
        callbackScope: this,
        onUpdate: function () {
          this.camera.lookAt(this.camTarget.position);
          this.camera.updateProjectionMatrix();
        },
      });
      gsap.to(this.camera.position, {
        z: 3 * this.squareSize,
        duration: 3,
        delay: 3,
        callbackScope: this,
        onComplete: function () {
          this.interactive = true;
        },
      });
    },
    setInteractive: function () {
      this.interactive = true;
    },
  },
  mounted: function () {
    // for debug ONLY
    //this.gui = new dat.GUI({ name: 'Debug Tools' });

    // add listeners and query document
    window.addEventListener('resize', this.resize);
    document.addEventListener('mousemove', this.handleMouseMove);
    this.container = document.querySelector('#_threejs_container');

    // colors
    this.colors.darkSquare = new Color('#A97C50');
    this.colors.bg = new Color('#FFF9F0');

    // textures and maps
    this.maps.normal.light = new TextureLoader().load('maps/light/normal.png');
    this.maps.normal.dark = new TextureLoader().load(
      this.textures.normalMapDark
    );
    this.maps.albedo.light = new TextureLoader().load(
      this.textures.albedoMapLight
    );

    // materials
    this.mats.lightSquare = new MeshStandardMaterial({
      map: this.maps.albedo.light,
      normalMap: this.maps.normal.light,
      roughness: 0.5,
      metalness: 1.0,
    });
    this.mats.darkSquare = new MeshStandardMaterial({
      color: this.colors.darkSquare,
      normalMap: this.maps.normal.dark,
      roughness: 0.475,
      metalness: 1.0,
    });
    this.mats.invis = new MeshBasicMaterial({
      transparent: true,
      opacity: 0,
    });

    // internals
    this.scene = new Scene();
    this.scene.background = this.colors.bg;
    this.mouse = new Vector2();
    this.camTarget = new Mesh(new SphereBufferGeometry(0.1), this.mats.invis);
    this.scene.add(this.camTarget);
    this.camTarget.position.set(0, 0.25, 0);
    this.raycaster = new Raycaster();
    this.board = new Group();
    this.board.receiveShadow = true;
    this.boardSize = 8;
    this.squareSize = 0.25;
    this.scene.fog = new FogExp2(this.colors.bg, 1.2);

    // camera config
    this.cameraOpts.fov = 60;
    this.cameraOpts.aspect = window.innerWidth / window.innerHeight;
    this.cameraOpts.near = 0.01;
    this.cameraOpts.far = 20;

    this.camera = new PerspectiveCamera(
      this.cameraOpts.fov,
      this.cameraOpts.aspect,
      this.cameraOpts.near,
      this.cameraOpts.far
    );

    this.camera.position.set(0, 3.5, 0);
    this.camera.lookAt(this.camTarget.position);

    // lighting
    this.lights.ambient = new AmbientLight(0xffffff, 0.8);
    this.lights.directional = new DirectionalLight(0xffffff, 0.8);
    this.lights.directional.castShadow = true;
    this.lights.directional.position.set(0.5, 4, -2);
    this.lights.directional.shadow.camera.updateProjectionMatrix();

    // directional light shadow camera config
    this.lights.directional.shadow.mapSize.width = 1024;
    this.lights.directional.shadow.mapSize.height = 1024;
    this.lights.directional.shadow.camera.far = 10;
    this.lights.directional.shadow.camera.left = -1.5;
    this.lights.directional.shadow.camera.right = 1.5;
    this.lights.directional.shadow.camera.bottom = -1.5;
    this.lights.directional.shadow.camera.top = 1.5;

    // geometries
    this.geos.square = new BoxBufferGeometry(
      this.squareSize,
      this.squareSize,
      0.005
    );

    // board creation
    this.createBoard();
    this.board.translateX(this.squareSize / 2); // translate board to be cenetered at origin
    this.board.translateZ(-2.8 * this.squareSize - this.squareSize);

    // scene additions and extras
    this.scene.add(this.board, this.lights.ambient, this.lights.directional);
    this.scene.fog = new FogExp2(this.colors.bg, 1.2);

    // renderer
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;

    this.container.append(this.renderer.domElement);
    this.renderer.render(this.scene, this.camera);

    this.render();
    if (this.zoominto) {
      this.zoom();
    } else {
      this.camTarget.position.set(0, 0.25, -1);
      this.camera.position.set(0, 0.25, 3 * this.squareSize);
      this.camera.lookAt(this.camTarget.position);
      this.camera.updateProjectionMatrix();
      window.setTimeout(this.setInteractive, 1500);
    }
  },
  template: `
  <div id="_threejs_container" style="position: absolute; width: 100%; height: 100%;"></div>
  `,
});

export default board;
