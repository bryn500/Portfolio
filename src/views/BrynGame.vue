<template>
    <div id="fsCanvas" class="fsCanvas"></div>
</template>

<script>
import * as THREE from 'three';
import { getCurrentDimensions } from '../js/utils/utils.js';

export default {
  name: 'BrynGame',
  data() {
    return {
      container: null,
      camera: null,
      scene: null,
      renderer: null,
      mesh: null
    };
  },
  methods: {
    init: function() {
      // Get Element
      this.container = document.getElementById('fsCanvas');

      // Get container element dimensions
      let dimes = getCurrentDimensions(this.container);

      // create scene
      this.scene = new THREE.Scene();

      // set up perspective based camera
      // vertical field of view, aspect ratio, near clipping plane, far clipping plane
      this.camera = new THREE.PerspectiveCamera(83.2, dimes.aspect, 0.01, 10);

      // set camera position in scene
      this.camera.position.z = 1;

      let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
      let material = new THREE.MeshNormalMaterial();

      this.mesh = new THREE.Mesh(geometry, material);
      this.scene.add(this.mesh);

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(dimes.width, dimes.height);
      this.container.appendChild(this.renderer.domElement);
    },
    animate: function() {
      requestAnimationFrame(this.animate);
      this.mesh.rotation.x += 0.01;
      this.mesh.rotation.y += 0.02;
      this.renderer.render(this.scene, this.camera);
    },
    onWindowResize: function() {
      // Get container element dimensions
      let dimes = getCurrentDimensions(this.container);

      // update camera aspect ratio based off new screen aspect ratio
      this.camera.aspect = dimes.aspect;
      this.camera.updateProjectionMatrix();

      // update renderer size based off new screen size
      this.renderer.setSize(dimes.width, dimes.height);
    }
  },
  mounted() {
    this.init();
    this.animate();

    this.$nextTick(function() {
      window.addEventListener('resize', this.onWindowResize, false);
    });
  }
};
</script>


<style scoped>
.fsCanvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>
