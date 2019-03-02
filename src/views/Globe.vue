<template>
    <div>
        <h1>Test</h1>
        <div id="loading">Loading...</div>
        <div id="msg"></div>
        <div id="container" class="globe">
            <canvas id="canvas" class="canvas"></canvas>
        </div>
    </div>
</template>

<script>
import * as THREE from 'three';
var OrbitControls = require('three-orbit-controls')(THREE);
import { json } from 'd3-fetch';
import { feature as topojsonFeature } from 'topojson';
import { getCountriesTexture } from '../js/globe/countriesTexture';
import { getEventCenter, geodecoder, getPoint } from '../js/globe/geoHelpers';
import { memoize, getCurrentDimensions } from '../js/utils/utils.js';

const baseSize = 1;
const settings = {
  dataUrl: '/data/world.json',
  earthMapPath: '/img/3d/earthmap.jpg',
  earthBumpPath: '/img/3d/earthbump.jpg',
  galaxyMapPath: '/img/3d/galaxy.png',
  bumpScale: 0.1,
  segments: 122, // number of vertices. Higher = better mouse accuracy
  cameraMoveSpeed: 0.01, // speed at which camera can be dragged around
  cameraDampingFactor: 0.1, // friction on camera rotation speed
  fov: 75,
  cameraZ: baseSize * 2,
  cameraFarClip: baseSize * 5,
  cameraNearClip: baseSize / 5,
  globeRadius: baseSize,
  overlayRadius: baseSize * 1.005,
  galaxyRadius: baseSize * 2.5,
  point: baseSize / 100,
  initialY: -1.5,
  initialX: 0.5
};

let scene, renderer, camera, raycaster;
let geo, countries;
let globeObject, galaxyObject, overlayMesh, globeMesh, countryMesh, starsMesh, currentPointMesh;

//rotation
let targetRotationY = settings.initialY;
let targetRotationOnMouseDownX = 0;
let targetRotationX = settings.initialX;
let targetRotationOnMouseDownY = 0;
let mouseX = 0;
let mouseXOnMouseDown = 0;
let mouseY = 0;
let mouseYOnMouseDown = 0;
let finalRotationY;
let windowHalfX;
let windowHalfY;

export default {
  name: 'Globe',
  data() {
    return {
      container: null,
      canvas: null,
      currentCountry: null,
      animationFrame: null,
      rotation: {
        speedX: -0.0002,
        speedY: -0.005
      }
    };
  },
  mounted: function() {
    this.init();
  },
  methods: {
    init: function() {
      // Get dom elements
      this.container = document.getElementById('container');
      this.canvas = document.getElementById('canvas');

      // Get dimensions of container
      let dimensions = getCurrentDimensions(this.container);

      windowHalfX = dimensions.width / 2;
      windowHalfY = dimensions.height / 2;

      // Create 3d scene camera and renderer
      this.createScene();
      this.createRenderer(dimensions);
      this.createCamera(dimensions);
      this.addLighting();

      // Create objects in scene
      this.createGlobe();
      this.createGalaxy();
      this.createMousePointer();

      // Add raycaster for interactions
      this.addRaycaster();

      // animate scene
      this.animate();

      // Download country geo data
      json(settings.dataUrl)
        .then(this.onDownload)
        .catch(function(err) {
          console.error(err);
        });

      window.rendererStats.domElement.style.position = 'absolute';
      window.rendererStats.domElement.style.left = '0px';
      window.rendererStats.domElement.style.bottom = '0px';
      document.body.appendChild(window.rendererStats.domElement);

      window.rendererStats.update(renderer);
      
      ///
      // Events
      ///
      window.addEventListener('resize', this.onWindowResize, false);
      this.canvas.addEventListener('mousemove', this.onMouseMove);
      this.canvas.addEventListener('mousedown', this.onDocumentMouseDown, false);
      this.canvas.addEventListener('touchstart', this.onDocumentTouchStart, false);
      this.canvas.addEventListener('touchmove', this.onDocumentTouchMove, false);
    },
    ///
    // 3D scene functions
    ///
    animate: function() {
      // spin globe by current rotation speed
      globeObject.rotation.x += this.rotation.speedX;
      globeObject.rotation.y += this.rotation.speedY;

      // stop rotation after a period
      if (globeObject.rotation.y < -8 || globeObject.rotation.x < 0.3) {
        this.rotation.speedY = 0;
        this.rotation.speedX = 0;
      }

      // if not auto rotating: rotate with mouse/touch
      if (this.rotation.speedX === 0 || this.rotation.speedY === 0) {
        //horizontal rotation

        globeObject.rotation.y += (targetRotationY - globeObject.rotation.y) * settings.cameraMoveSpeed;

        //vertical rotation
        finalRotationY = targetRotationX - globeObject.rotation.x;

        if (globeObject.rotation.x <= 1 && globeObject.rotation.x >= -1) {
          globeObject.rotation.x += finalRotationY * settings.cameraMoveSpeed;
        }
        if (globeObject.rotation.x > 1) {
          globeObject.rotation.x = 1;
        }
        if (globeObject.rotation.x < -1) {
          globeObject.rotation.x = -1;
        }
      }

      // render new scene
      renderer.render(scene, camera);

      window.rendererStats.update(renderer);

      // Loop
      this.animationFrame = requestAnimationFrame(this.animate);
    },
    createScene: function() {
      scene = new THREE.Scene();
    },
    createRenderer: function(dimensions) {
      renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true
      });

      renderer.setSize(dimensions.width, dimensions.height);
    },
    createCamera: function(dimensions) {
      // Create perspective based camera
      // vertical field of view, aspect ratio, near clipping plane, far clipping plane
      camera = new THREE.PerspectiveCamera(
        settings.fov,
        dimensions.aspect,
        settings.cameraNearClip,
        settings.cameraFarClip
      );

      // position camera
      camera.position.z = settings.cameraZ;
    },
    addLighting: function() {
      var light1 = new THREE.AmbientLight('#404040', 1);
      let light2 = new THREE.HemisphereLight('#404040', '#111111', 3);
      light2.position.set(1, 600, 1);
      scene.add(light1);
      scene.add(light2);
    },
    createGlobe: function() {
      // base sphere
      let sphere = new THREE.SphereGeometry(settings.globeRadius, settings.segments, settings.segments);

      // material with texture maps
      let earthMaterial = new THREE.MeshPhongMaterial();
      earthMaterial.map = new THREE.TextureLoader().load(settings.earthMapPath);
      earthMaterial.bumpMap = new THREE.TextureLoader().load(settings.earthBumpPath);
      earthMaterial.bumpScale = settings.bumpScale;

      // Create Mesh
      globeMesh = new THREE.Mesh(sphere, earthMaterial);

      // Add mesh to object
      globeObject = new THREE.Object3D();
      globeObject.scale.set(1, 1, 1);
      globeObject.add(globeMesh);
      globeObject.rotation.y = settings.initialY;
      globeObject.rotation.x = settings.initialX;

      // Add object to scene
      scene.add(globeObject);
    },
    createGalaxy: function() {
      // base sphere
      var starsGeometry = new THREE.SphereGeometry(settings.galaxyRadius, 32, 32);

      // create the material, using a texture of starfield
      var starsMaterial = new THREE.MeshBasicMaterial();
      starsMaterial.map = new THREE.TextureLoader().load(settings.galaxyMapPath);
      starsMaterial.side = THREE.BackSide;

      starsMesh = new THREE.Mesh(starsGeometry, starsMaterial);

      // Add mesh to object
      galaxyObject = new THREE.Object3D();
      galaxyObject.add(starsMesh);

      // Add object to scene
      scene.add(galaxyObject);
    },
    addCountryMesh: function(countries) {
      // base sphere
      let sphere = new THREE.SphereGeometry(settings.globeRadius, settings.segments, settings.segments);

      // add base country material with all countries
      let countriesMaterial = new THREE.MeshPhongMaterial();
      countriesMaterial.transparent = true;
      countriesMaterial.map = getCountriesTexture(countries, 'rgba(200,200,200,.01)');

      // Create Mesh from geometry and material
      countryMesh = new THREE.Mesh(sphere, countriesMaterial);

      // Add country mesh to globe object
      globeObject.add(countryMesh);
    },
    addRaycaster: function() {
      raycaster = new THREE.Raycaster();
    },
    createMousePointer: function() {
      // Create mouseover pointer
      let pointGeometry = new THREE.SphereGeometry(settings.point, 32, 32);
      let pointMaterial = new THREE.MeshPhongMaterial({ color: 'red' });
      currentPointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
    },
    ///
    // Events
    ///
    getMousePos: function(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
    },
    onWindowResize: function() {
      let dimensions = getCurrentDimensions(this.container);
      camera.aspect = dimensions.aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(dimensions.width, dimensions.height);
      windowHalfX = dimensions.width / 2;
      windowHalfY = dimensions.height / 2;
    },
    onMouseMove: function(event) {
      // stop rotation of globe
      if (this.rotation.speedX !== 0 || this.rotation.speedY !== 0) {
        this.rotation.speedX = 0;
        this.rotation.speedY = 0;

        targetRotationY = globeObject.rotation.y;
        targetRotationX = globeObject.rotation.x;
      }

      // get canvas dimensions
      let dimensions = getCurrentDimensions(this.container);

      // get mouse position on canvas
      let mouse = this.getMousePos(this.canvas, event);

      let position = {
        x: ((mouse.x - 1) / dimensions.width) * 2 - 1,
        y: -((mouse.y - 1) / dimensions.height) * 2 + 1
      };

      // create a new 3d vector based
      let vector = new THREE.Vector3();
      vector.set(position.x, position.y, 0.5);
      vector.unproject(camera);

      raycaster.ray.set(camera.position, vector.sub(camera.position).normalize());
      let target = raycaster.intersectObjects([globeMesh]);

      if (target.length) {
        // Get point, convert to latitude/longitude
        let latlng = getEventCenter.call(globeMesh, target[0], settings.globeRadius);

        // Look for country at that latitude/longitude
        let country = geo.search(latlng[0], latlng[1]);

        if (currentPointMesh) {
          globeMesh.remove(currentPointMesh);
        }

        currentPointMesh.position.copy(getPoint.call(globeMesh, target[0]));
        globeMesh.add(currentPointMesh);

        // test
        if (country !== null && country.code !== this.currentCountry) {
          // Track the current country displayed
          this.currentCountry = country.code;

          // Update the html
          document.getElementById('msg').innerHTML = country.code;

          // Overlay the selected country
          let map = this.textureCache(country.code, 'rgba(255,255,255,0.3)');

          let material = new THREE.MeshPhongMaterial({
            map: map,
            transparent: true
          });

          if (!overlayMesh) {
            overlayMesh = new THREE.Mesh(new THREE.SphereGeometry(settings.overlayRadius, 40, 40), material);
            globeObject.add(overlayMesh);
          } else {
            overlayMesh.material = material;
          }
        }
      }
    },
    onDownload: function(data) {
      // Setup cache for country textures
      countries = topojsonFeature(data, data.objects.countries);
      geo = geodecoder(countries.features);

      // Create and add Country Mesh to globe object
      this.addCountryMesh(countries);

      this.$root.$emit('route-load');
    },
    onDocumentMouseDown: function(event) {
      event.preventDefault();

      this.canvas.addEventListener('mousemove', this.onDocumentMouseMove, false);
      this.canvas.addEventListener('mouseup', this.onDocumentMouseUp, false);
      this.canvas.addEventListener('mouseout', this.onDocumentMouseOut, false);

      mouseXOnMouseDown = event.clientX - windowHalfX;
      targetRotationOnMouseDownX = targetRotationY;

      mouseYOnMouseDown = event.clientY - windowHalfY;
      targetRotationOnMouseDownY = targetRotationX;
    },
    onDocumentMouseMove: function(event) {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;

      targetRotationX = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * settings.cameraMoveSpeed;
      targetRotationY = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * settings.cameraMoveSpeed;
    },
    onDocumentMouseUp: function(event) {
      this.canvas.removeEventListener('mousemove', this.onDocumentMouseMove, false);
      this.canvas.removeEventListener('mouseup', this.onDocumentMouseUp, false);
      this.canvas.removeEventListener('mouseout', this.onDocumentMouseOut, false);
    },
    onDocumentMouseOut: function(event) {
      this.canvas.removeEventListener('mousemove', this.onDocumentMouseMove, false);
      this.canvas.removeEventListener('mouseup', this.onDocumentMouseUp, false);
      this.canvas.removeEventListener('mouseout', this.onDocumentMouseOut, false);
    },
    onDocumentTouchStart: function(event) {
      if (event.touches.length === 1) {
        event.preventDefault();

        mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
        targetRotationOnMouseDownX = targetRotationY;

        mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
        targetRotationOnMouseDownY = targetRotationX;
      }
    },
    onDocumentTouchMove: function(event) {
      if (event.touches.length === 1) {
        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        targetRotationY = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * settings.cameraMoveSpeed;

        mouseY = event.touches[0].pageY - windowHalfY;
        targetRotationX = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * settings.cameraMoveSpeed;
      }
    },
    ///
    // Utils
    ///
    textureCache: memoize(function(cntryID, color) {
      let country = geo.find(cntryID);
      return getCountriesTexture(country, color);
    })
  },
  beforeDestroy: function() {
    window.cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.onWindowResize);
    this.canvas.removeEventListener('mousemove', this.onMouseMove);

    renderer.forceContextLoss();
    renderer.renderLists.dispose();
    renderer.context = null;
    renderer.domElement = null;
    renderer.dispose();

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
      if (!object.isMesh) return;

      object.geometry.dispose();

      if (object.material.isMaterial) {
        cleanMaterial(object.material);
      } else {
        // an array of materials
        for (const material of object.material) cleanMaterial(material);
      }
    });

    scene = null;
    renderer = null;
    camera = null;
    raycaster = null;

    geo = null;
    countries = null;

    globeObject = null;
    galaxyObject = null;
    overlayMesh = null;
    globeMesh = null;
    countryMesh = null;
    currentPointMesh = null;
    this.canvas = null;
    this.container = null;
  }
};
</script>


<style lang="scss">
@import '../scss/shared/_variables.scss';

.globe {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.canvas {
  width: 100%;
  height: 100%;
  background: $darkGrey;
}

#msg {
  z-index: 10;
  position: fixed;
  color: $altFontColour;
}
</style>
