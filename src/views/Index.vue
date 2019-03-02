<template>
    <div>        
        <div class="under">Testing Text Is Here</div>
        <div id="fsCanvas" class="fsCanvas"></div>
        <div class="over">Testing Text Is Here</div>
    </div>
</template>

<script>
import * as THREE from 'three';
import { getCurrentDimensions } from '../js/utils/utils.js';

let radius = 50,
  lines = 15,
  dots = 25;

let camera, scene, renderer, group;

export default {
  name: 'Index',
  data() {
    return {
      container: null,
      animationFrame: null
    };
  },
  methods: {
    updateDots: function(a) {
      var i, j, line, vector, y;
      for (i = 0; i < lines; i++) {
        line = group.children[i];

        for (j = 0; j < dots; j++) {
          vector = line.geometry.vertices[j];
          var ratio = 1 - (line.radius - Math.abs(vector.x)) / line.radius;
          y = Math.sin(a / line.speed + j * 0.15) * 12 * ratio;
          vector.y = y;
        }

        line.geometry.verticesNeedUpdate = true;
      }
    },
    init: function() {
      // Get Element
      this.container = document.getElementById('fsCanvas');

      // Get container element dimensions
      let dimes = getCurrentDimensions(this.container);

      // create scene
      scene = new THREE.Scene();

      // set up perspective based camera
      // vertical field of view, aspect ratio, near clipping plane, far clipping plane
      camera = new THREE.PerspectiveCamera(75, dimes.aspect, 1, 150);

      // set camera position in scene
      camera.position.set(0, 0, 100);

      // set renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(dimes.width, dimes.height);
      renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
      renderer.gammaInput = true;
      renderer.gammaOutput = true;

      this.container.appendChild(renderer.domElement);

      var light1 = new THREE.AmbientLight('#ffffff', 0.1);
      //scene.add(light1);

      let light2 = new THREE.HemisphereLight('#ffffff', '#111111', 1);
      light2.position.set(1, 10, 1);
      scene.add(light2);

      // Add objects to scene
      group = new THREE.Group();
      scene.add(group);

      var geometry = new THREE.SphereGeometry(10, 32, 32);
      var material =   new THREE.MeshPhongMaterial({
        color: 0x996633,
        specular: 0x050505,
        shininess: 100
      });
      var sphere = new THREE.Mesh(geometry, material);

      group.add(sphere);

      var mat1 = new THREE.LineBasicMaterial({
        color: 0x4a4a4a
      });
      var mat2 = new THREE.LineBasicMaterial({
        color: 0x3f51b5
      });

      for (var i = 0; i < lines; i++) {
        var geometry = new THREE.Geometry();
        var line = new THREE.Line(geometry, Math.random() > 0.2 ? mat1 : mat2);
        line.speed = Math.random() * 300 + 250;
        line.wave = Math.random();
        line.radius = Math.floor(radius + (Math.random() - 0.5) * (radius * 0.2));
        for (var j = 0; j < dots; j++) {
          var x = (j / dots) * line.radius * 2 - line.radius;
          var vector = new THREE.Vector3(x, 0, 0);
          geometry.vertices.push(vector);
        }
        line.rotation.x = Math.random() * Math.PI;
        line.rotation.y = Math.random() * Math.PI;
        line.rotation.z = Math.random() * Math.PI;
        group.add(line);
      }

      window.rendererStats.domElement.style.position = 'absolute';
      window.rendererStats.domElement.style.left = '0px';
      window.rendererStats.domElement.style.bottom = '0px';
      document.body.appendChild(window.rendererStats.domElement);

      window.rendererStats.update(renderer);

      // animate
      this.animate();
    },
    animate: function(a) {
      this.updateDots(a);
      //   group.rotation.y = a * 0.0001;
      //   group.rotation.x = -a * 0.0001;

      renderer.render(scene, camera);

      window.rendererStats.update(renderer);

      // loop
      this.animationFrame = requestAnimationFrame(this.animate);
    },
    onWindowResize: function() {
      // Get container element dimensions
      let dimes = getCurrentDimensions(this.container);

      // update camera aspect ratio based off new screen aspect ratio
      camera.aspect = dimes.aspect;
      camera.updateProjectionMatrix();

      // update renderer size based off new screen size
      renderer.setSize(dimes.width, dimes.height);
    }
  },
  mounted() {
    this.init();

    this.$nextTick(function() {
      window.addEventListener('resize', this.onWindowResize, false);
    });
  },
  beforeDestroy: function() {
    window.cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.onWindowResize);

    renderer.forceContextLoss();
    renderer.renderLists.dispose();
    renderer.context = null;
    renderer.domElement = null;
    renderer.dispose();
    //cameraControls.dispose();

    const cleanMaterial = material => {
      material.dispose();

      // dispose textures
      for (const key of Object.keys(material)) {
        const value = material[key];
        if (value && typeof value === 'object' && 'minFilter' in value) {
          value.dispose();
        }
      }
    };

    scene.traverse(object => {
      if (object.isMesh) {
        object.geometry.dispose();

        if (object.material.isMaterial) {
          cleanMaterial(object.material);
        } else {
          // an array of materials
          for (const material of object.material) cleanMaterial(material);
        }
      } else {
        object = null;
      }
    });

    scene = null;
    renderer = null;
    camera = null;
    //cameraControls = null;
    this.container = null;
    group = null;
  }
};
</script>


<style lang="scss">
@import '../scss/shared/_variables.scss';

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
  background: $darkGrey;
}

.over, .under {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: inline-block;
    padding: 1rem;
    background: #333;
    color: $altFontColour;
}

.under {
    top:45%;
}

/* .over {
    top:54%;
} */
</style>
