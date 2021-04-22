import {
  Scene,
  Vector2,
  Mesh,
  SphereBufferGeometry,
  MeshStandardMaterial,
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
} from '../../../../vendor/three/build/three.module';

const board = Vue.component('board', {
  data() {
    return {
      boardSize,
      squareSize,
      animating: [],
      camera,
      cameraOpts: {
        fov,
        aspect,
        near,
        far,
      },
      scene,
      raycaster,
      board,
      container,
      mouse,
      intersects,
      camTarget,
      colors: {
        darkSquare,
        bg,
      },
      maps: {
        normal: {
          dark,
          light,
        },
        albedo: {
          light,
        }
      },
      lights: {
        ambient,
        directional,
      },
      lightOpts: {
        directional: {
          shadowOpts: {
            mapWidth = 1024,
            mapHeight = 1024,
            camFar = 10,
            camLeft = -1.5,
            camRight = 1.5,
            camBottom = -1.5,
            camTop: 1.5
          }
        }
      },
      mats: {
        lightSquare,
        darkSquare
      },
      renderer
    };
  },
  methods: {
    resize: function() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    handleMouseMove: function(e) {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }
  },
  mounted: function () {

    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', handleMouseMove);
  },
  template: `
  <div id="_threejs_container"></div>
  `,
});

export default board;
