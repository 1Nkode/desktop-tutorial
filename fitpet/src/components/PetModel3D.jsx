import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/*
  PetModel3D — animated 3D character (three.js).
  - `src` is the GLB to load (gender). Falls back to default.glb if missing.
  - plays a static idle by default (upright); `anim` plays a dance clip.
  - `color` tints the materials (ropa/estilo). Reports clip names via onList.
*/
export default function PetModel3D({ src, anim = null, color = null, onList }) {
  const mountRef = useRef(null);
  const actionsRef = useRef({});
  const currentRef = useRef(null);
  const mixerRef = useRef(null);
  const meshesRef = useRef([]);
  const baseColorRef = useRef(new Map());
  const DEFAULT = `${import.meta.env.BASE_URL}model/default.glb`;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let w = mount.clientWidth || 200, h = mount.clientHeight || 240;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, w / h, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x445, 1.15));
    const dir = new THREE.DirectionalLight(0xffffff, 1.4);
    dir.position.set(3, 8, 6); scene.add(dir);

    const clock = new THREE.Clock();
    let raf, pivot;

    const addModel = (gltf) => {
      const model = gltf.scene;
      meshesRef.current = [];
      baseColorRef.current = new Map();
      model.traverse((c) => {
        if (c.isMesh) {
          meshesRef.current.push(c);
          const mats = Array.isArray(c.material) ? c.material : [c.material];
          mats.forEach(m => { if (m?.color) baseColorRef.current.set(m, m.color.clone()); });
        }
      });

      // IMPORTANT: update world matrices before measuring, or the box is wrong
      model.updateMatrixWorld(true);
      let box = new THREE.Box3().setFromObject(model);
      let size = box.getSize(new THREE.Vector3());

      // normalize the model to a known height so framing is reliable
      const TARGET_H = 1.8;
      const s = size.y > 0.0001 ? TARGET_H / size.y : 1;
      model.scale.multiplyScalar(s);
      model.updateMatrixWorld(true);

      // re-measure after scaling, then center at origin
      box = new THREE.Box3().setFromObject(model);
      size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);

      pivot = new THREE.Group(); pivot.add(model); scene.add(pivot);

      // fixed camera distance tuned to TARGET_H, framing height & width
      const fov = camera.fov * (Math.PI / 180);
      const fitH = (size.y / 2) / Math.tan(fov / 2);
      const fitW = (size.x / 2) / Math.tan(fov / 2) / camera.aspect;
      const dist = Math.max(fitH, fitW) * 1.55 + 0.4;
      camera.position.set(0, 0, dist);
      camera.near = 0.05; camera.far = dist * 100;
      camera.updateProjectionMatrix();
      camera.lookAt(0, 0, 0);

      // animations
      const mixer = new THREE.AnimationMixer(model);
      mixerRef.current = mixer;
      actionsRef.current = {};
      const names = [];
      gltf.animations.forEach((clip) => { names.push(clip.name); actionsRef.current[clip.name] = mixer.clipAction(clip); });
      onList?.(names);

      // default to an idle/standing clip if there is one (upright); else static
      const idle = gltf.animations.find(c => /idle|stand|pose|breath|t-?pose/i.test(c.name));
      if (idle) { const a = actionsRef.current[idle.name]; a.play(); currentRef.current = a; }
    };

    const loader = new GLTFLoader();
    loader.load(src || DEFAULT, addModel, undefined, () => {
      if ((src || DEFAULT) !== DEFAULT) loader.load(DEFAULT, addModel);
    });

    function loop() {
      raf = requestAnimationFrame(loop);
      mixerRef.current?.update(clock.getDelta());
      if (pivot) pivot.rotation.y += 0.004;
      renderer.render(scene, camera);
    }
    loop();

    const ro = new ResizeObserver(() => {
      w = mount.clientWidth || w; h = mount.clientHeight || h;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [src]);

  // play selected dance (or return to idle/static)
  useEffect(() => {
    const actions = actionsRef.current;
    const cur = currentRef.current;
    if (anim && actions[anim]) {
      const next = actions[anim];
      if (cur === next) return;
      next.reset().fadeIn(0.3).play();
      cur?.fadeOut(0.3);
      currentRef.current = next;
    }
  }, [anim]);

  // tint materials (ropa / color)
  useEffect(() => {
    meshesRef.current.forEach((c) => {
      const mats = Array.isArray(c.material) ? c.material : [c.material];
      mats.forEach((m) => {
        if (!m?.color) return;
        const base = baseColorRef.current.get(m);
        if (!base) return;
        if (color) m.color.set(color); else m.color.copy(base);
      });
    });
  }, [color]);

  return <div ref={mountRef} className="pet3d" />;
}
