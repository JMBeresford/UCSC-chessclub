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
  CameraHelper,
  PCFSoftShadowMap,
} from '../../three/build/three.module.js';
import { OrbitControls } from '../../three/OrbitControls.js';

const board = Vue.component('board', {
  props: {
    zoominto: Boolean,
    debug: Boolean,
  },
  data() {
    return {
      scene: null,
      camera: null,
      lights: {
        directional: null,
        ambient: null,
      },
      raycaster: null,
      renderer: null,
      boardID: null,
      camTarget: null,
      debugGui: null,
      frame: null,
      interactive: false,
      boardSize: 8,
      squareSize: 0.25,
      mouse: null,
      texturePaths: {
        normalMapLight: 'maps/light/normal.png',
        normalMapDark: 'maps/dark/normal.png',
        albedoMapLight: 'maps/light/albedo.png',
      },
      colors: {
        darkSquare: '#A97C50',
        bg: '#FFF9F0',
      },
      geos: {
        square: null,
      },
      mats: {
        lightSquare: null,
        darkSquare: null,
        invis: null,
      },
      meshes: {
        lightMesh: null,
        darkMesh: null,
        invisMesh: null,
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
    };
  },
  methods: {
    handleResize: function () {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    handleMouseMove: function (e) {
      // translate window's mouse coordinates to those of the three.js canvas
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    },
    doLifts: function (intersects) {
      // triggers the lift animation of squares that are hovered over
      for (const intersect of intersects) {
        let square = intersect.object;

        if (square.userData.aniState == 'idle') {
          // only animate idle squares, not those already animating

          // square is an invisible mesh overlaying the visible square,
          // the visible square is accessible as the first child of the invis mesh
          let toAnimate = square.children[0];

          gsap.to(toAnimate.position, {
            // func + params to call on start
            onStart: this.markAnimation,
            onStartParams: [square],

            // element of position object to transition
            z: -0.1,
            duration: 0.5,

            // on complete function + params
            onComplete: this.markWaiting,
            onCompleteParams: [square],
          });
        }
      }
    },
    doDescents: function (intersects, board) {
      // triggers the out animation of squares that were hovering but are
      // no longer intersected by the cursor
      for (const square of board.children) {
        if (!intersects.find((intersect) => intersect.object === square)) {
          // only trigger on squares that are *not* being intersected
          if (square.userData.aniState === 'waiting') {
            // only trigger on squares that have *finished* the lift animation

            // square is an invisible mesh overlaying the visible square,
            // the visible square is accessible as the first child of the invis mesh
            let toAnimate = square.children[0];

            gsap.to(toAnimate.position, {
              onStart: this.markAnimation,
              onStartParams: [square],
              z: 0,
              duration: 0.5,
              onComplete: this.markAnimated,
              onCompleteParams: [square],
            });
          }
        }
      }
    },
    markAnimation: function (square) {
      // state transition, cursor has intersected an idle square
      // this is called by the gsap animation defined above
      square.userData.aniState = 'animating';

      // square is an invisible mesh overlaying the visible square,
      // the visible square is accessible as the first child of the invis mesh
      // we want hovering squares to cast shadows
      square.children[0].castShadow = true;
    },
    markWaiting: function (square) {
      // square is hovering, waiting for cursor to stop intersecting it
      square.userData.aniState = 'waiting';
    },
    markAnimated: function (square) {
      square.userData.aniState = 'idle';

      // we keep squares from casting shadows when they are not lifted for
      // performance reasons, no need to add them to shadowMap if they aren't
      // to be seen
      square.children[0].castShadow = false;
    },
    initScene: function () {
      this.scene = new Scene();
      this.scene.background = new Color(this.colors.bg);

      this.mouse = new Vector2();
      this.raycaster = new Raycaster();

      if (!this.debug) {
        this.scene.fog = new FogExp2(this.colors.bg, 1.2);
      }
    },
    createBoard: function () {
      let square, invisSquare;
      let board = new Group();

      let texLoader = new TextureLoader();

      // Maps
      // albedo map == color map, just fancier
      this.maps.albedo.light = texLoader.load(this.texturePaths.albedoMapLight);
      this.maps.normal.light = texLoader.load(this.texturePaths.normalMapLight);
      this.maps.normal.dark = texLoader.load(this.texturePaths.normalMapDark);

      // geometry

      this.geos.square = new BoxBufferGeometry(
        this.squareSize,
        this.squareSize,
        0.005
      );

      // materials

      this.mats.lightSquare = new MeshStandardMaterial({
        map: this.maps.albedo.light,
        normalMap: this.maps.normal.light,
        roughness: 0.5,
        metalness: 1,
      });

      this.mats.darkSquare = new MeshStandardMaterial({
        color: new Color(this.colors.darkSquare),
        normalMap: this.maps.normal.dark,
        roughness: 0.475,
        metalness: 1,
      });

      this.mats.invis = new MeshBasicMaterial({
        transparent: true,
        opacity: 0,
      });

      // meshes

      this.meshes.lightMesh = new Mesh(this.geos.square, this.mats.lightSquare);
      this.meshes.invisMesh = new Mesh(this.geos.square, this.mats.invis);
      this.meshes.darkMesh = new Mesh(this.geos.square, this.mats.darkSquare);

      for (var i = 0; i < this.boardSize; i++) {
        if (i % 2 === 0) {
          // even rows

          for (var j = 0; j < this.boardSize; j++) {
            if (j % 2 === 0) {
              square = this.meshes.lightMesh.clone();
            } else {
              square = this.meshes.darkMesh.clone();
            }
            invisSquare = this.meshes.invisMesh.clone();
            invisSquare.position.set(
              (j - Math.floor(this.boardSize / 2)) * this.squareSize,
              0,
              i * this.squareSize
            );
            invisSquare.rotateX(Math.PI / 2);
            square.receiveShadow = true;
            invisSquare.add(square);
            invisSquare.userData.aniState = 'idle';
            board.add(invisSquare);
          }
        } else {
          // odd rows
          for (var j = 0; j < this.boardSize; j++) {
            if (j % 2 === 0) {
              square = this.meshes.darkMesh.clone();
            } else {
              square = this.meshes.lightMesh.clone();
            }
            invisSquare = this.meshes.invisMesh.clone();
            invisSquare.position.set(
              (j - Math.floor(this.boardSize / 2)) * this.squareSize,
              0,
              i * this.squareSize
            );
            invisSquare.rotateX(Math.PI / 2);
            square.receiveShadow = true;
            invisSquare.add(square);
            invisSquare.userData.aniState = 'idle';
            board.add(invisSquare);
          }
        }
      }

      board.receiveShadow = true;
      board.translateX(this.squareSize / 2);
      board.translateZ(-2.8 * this.squareSize - this.squareSize);

      this.boardID = board.id;
      this.scene.add(board);
    },
    initCamera: function () {
      this.camTarget = new Mesh(this.geos.square, this.mats.invis);
      this.camTarget.position.set(0, 0.25, 0);
      this.scene.add(this.camTarget);

      let fov = 60;
      let aspect = window.innerWidth / window.innerHeight;
      let near = 0.01;
      let far = 10;

      this.camera = new PerspectiveCamera(fov, aspect, near, far);

      this.camera.position.set(0, 3.5, 0);
      this.camera.lookAt(this.camTarget.position);
      this.scene.add(this.camera);
    },
    initLights: function () {
      this.lights.ambient = new AmbientLight(0xffffff, 0.8);
      this.lights.directional = new DirectionalLight(0xffffff, 0.8);
      this.lights.directional.castShadow = true;
      this.lights.directional.position.set(0.5, 4, -2);
      this.lights.directional.shadow.camera.updateProjectionMatrix();

      // directional light shadow config
      this.lights.directional.shadow.mapSize.width = 1024;
      this.lights.directional.shadow.mapSize.height = 1024;
      this.lights.directional.shadow.camera.near = 3.7;
      this.lights.directional.shadow.camera.far = 5.2;
      this.lights.directional.shadow.camera.left = -1.2;
      this.lights.directional.shadow.camera.right = 1.2;
      this.lights.directional.shadow.camera.bottom = -1.2;
      this.lights.directional.shadow.camera.top = 1.2;
      this.lights.directional.shadow.radius = 5;

      this.scene.add(this.lights.directional, this.lights.ambient);
    },
    initRenderer: function () {
      this.renderer = new WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = PCFSoftShadowMap;

      this.container.append(this.renderer.domElement);
    },
    setInteractive: function () {
      this.interactive = true;
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
    render: function () {
      let board = this.scene.getObjectById(this.boardID);
      this.raycaster.setFromCamera(this.mouse, this.camera);
      let intersects = this.raycaster.intersectObjects(board.children);

      if (this.interactive) {
        this.doLifts(intersects);
        this.doDescents(intersects, board);
      }

      this.renderer.render(this.scene, this.camera);
      this.frame = requestAnimationFrame(this.render);
    },
  },
  mounted: function () {
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('mousemove', this.handleMouseMove);
    this.container = document.querySelector('#_threejs_container');

    this.initScene();
    this.createBoard();

    // lights...
    this.initLights();

    // camera...
    this.initCamera();

    // ACTION!
    this.initRenderer();
    this.render();

    if (this.zoominto && !this.debug) {
      this.zoom();
    } else {
      this.camTarget.position.set(0, 0.25, -1);
      this.camera.position.set(0, 0.25, 3 * this.squareSize);
      this.camera.lookAt(this.camTarget.position);
      this.camera.updateProjectionMatrix();
      window.setTimeout(this.setInteractive, 1500);
    }
  },
  beforeDestroy: function () {
    let board = this.scene.getObjectById(this.boardID);

    for (const square of board.children) {
      square.children[0].dispose();
      square.dispose();
    }

    board.dispose();

    this.geos.square.dispose();

    for (const material of this.mats) {
      material.dispose();
    }

    for (const mesh of this.meshes) {
      mesh.dispose();
    }
  },
  template: `
  <div id="_threejs_container" style="position: absolute; width: 100%; height: 100%;"></div>
  `,
});

export default board;
