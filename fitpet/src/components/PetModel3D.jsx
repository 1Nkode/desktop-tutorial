import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/*
  PetModel3D — renders the animated 3D character (default.glb) with three.js.
  - plays the GLB's animation clips (idle by default; switchable via `anim`)
  - `color` tints the character's materials (style / "ropa")
  - transparent background so the scene behind shows through
  - reports the available animation names via onList(names)
*/
export default function PetModel3D({ anim = null, color = null, onList }) {
  const mountRef = useRef(null);
  const actionsRef = useRef({});
  const currentRef = useRef(null);
  const mixerRef = useRef(null);
  const meshesRef = useRef([]);
  const baseColorRef = useRef(new Map());

  // one-time setup
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let w = mount.clientWidth || 160;
    let h = mount.clientHeight || 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, w / h, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x444466, 1.1));
    const dir = new THREE.DirectionalLight(0xffffff, 1.4);
    dir.position.set(3, 8, 6);
    scene.add(dir);

    const clock = new THREE.Clock();
    let raf, model, pivot;

    const loader = new GLTFLoader();
    loader.load(`${import.meta.env.BASE_URL}model/default.glb`, (gltf) => {
      model = gltf.scene;

      // collect meshes + remember base colors (for tinting)
      model.traverse((c) => {
        if (c.isMesh) {
          c.castShadow = false;
          meshesRef.current.push(c);
          const mats = Array.isArray(c.material) ? c.material : [c.material];
          mats.forEach(m => { if (m?.color) baseColorRef.current.set(m, m.color.clone()); });
        }
      });

      // center the model inside a pivot (so it rotates in place)
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3(); box.getSize(size);
      const center = new THREE.Vector3(); box.getCenter(center);
      model.position.sub(center);
      pivot = new THREE.Group();
      pivot.add(model);
      scene.add(pivot);

      // auto-fit the camera so the WHOLE body fits in the box
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const fov = camera.fov * (Math.PI / 180);
      const dist = (maxDim / 2) / Math.tan(fov / 2) * 1.9; // margin for arm swing + rotation
      camera.position.set(0, 0, dist);
      camera.near = dist / 100;
      camera.far = dist * 100;
      camera.updateProjectionMatrix();
      camera.lookAt(0, 0, 0);

      // animations
      const mixer = new THREE.AnimationMixer(model);
      mixerRef.current = mixer;
      const names = [];
      gltf.animations.forEach((clip) => {
        names.push(clip.name);
        actionsRef.current[clip.name] = mixer.clipAction(clip);
      });
      onList?.(names);
      // play the first (idle) clip
      const first = gltf.animations[0];
      if (first) {
        const a = actionsRef.current[first.name];
        a.play();
        currentRef.current = a;
      }
    });

    function loop() {
      raf = requestAnimationFrame(loop);
      const d = clock.getDelta();
      mixerRef.current?.update(d);
      if (pivot) pivot.rotation.y += d * 0.25; // gentle turntable
      renderer.render(scene, camera);
    }
    loop();

    const ro = new ResizeObserver(() => {
      w = mount.clientWidth || w; h = mount.clientHeight || h;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  // switch animation
  useEffect(() => {
    const actions = actionsRef.current;
    if (!anim || !actions[anim]) return;
    const next = actions[anim];
    const cur = currentRef.current;
    if (cur === next) return;
    next.reset().fadeIn(0.3).play();
    cur?.fadeOut(0.3);
    currentRef.current = next;
  }, [anim]);

  // tint materials for style/clothes
  useEffect(() => {
    meshesRef.current.forEach((c) => {
      const mats = Array.isArray(c.material) ? c.material : [c.material];
      mats.forEach((m) => {
        if (!m?.color) return;
        const base = baseColorRef.current.get(m);
        if (!base) return;
        if (color) m.color.set(color);
        else m.color.copy(base);
      });
    });
  }, [color]);

  return <div ref={mountRef} className="pet3d" />;
}
