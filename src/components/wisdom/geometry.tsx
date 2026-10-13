import { useEffect, useRef } from 'react';
import * as THREE from 'three';
export default function Geometry({ turn = 0, variant = 'Rotation' }: { turn?: number; variant?: string }) {
 const host = useRef<HTMLDivElement>(null);
 useEffect(() => {
  const element = host.current; if (!element) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100); camera.position.set(5, 3.8, 7); camera.lookAt(0, 0, 0);
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); renderer.shadowMap.enabled = true; renderer.setClearColor(0, 0);
  element.appendChild(renderer.domElement);
  const root = new THREE.Group(); scene.add(root);
  const css = getComputedStyle(element);
  const colors = ['--ochre', '--terracotta', '--primary', '--forest'].map(token => new THREE.Color(css.getPropertyValue(token).trim().startsWith('oklch') ? ({'--ochre':'#B57424','--terracotta':'#B84E26','--primary':'#0E2235','--forest':'#1F4A34'}[token] ?? '#B57424') : css.getPropertyValue(token).trim()));
  const materials = colors.map(color => new THREE.MeshStandardMaterial({ color, roughness: .55, metalness: .08 }));
  const offsets: [number, number, number][] = variant === 'Symmetry' ? [[-1,0,0],[1,0,0],[0,1,0],[0,-1,0]] : [[-.6,0,0],[.6,0,0],[0,1,0],[0,0,1.2]];
  offsets.forEach((position, index) => { const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), materials[index]); mesh.position.set(position[0], position[1], position[2]); mesh.castShadow = true; root.add(mesh); });
  root.rotation.y = turn * Math.PI/2; root.rotation.z = -.15;
  scene.add(new THREE.HemisphereLight(0xffffff, 0xc4ad92, 2.5)); const light = new THREE.DirectionalLight(0xffefda, 4); light.position.set(3,6,4); scene.add(light);
  const resize = () => { const width = element.clientWidth, height = element.clientHeight; renderer.setSize(width, height); camera.aspect = width/height; camera.updateProjectionMatrix(); renderer.render(scene, camera); };
  const observer = new ResizeObserver(resize); observer.observe(element); resize();
  return () => { observer.disconnect(); root.children.forEach(child => { if (child instanceof THREE.Mesh) child.geometry.dispose(); }); materials.forEach(material=>material.dispose()); renderer.dispose(); renderer.domElement.remove(); };
 }, [turn, variant]);
 return <div ref={host} className="geometry-canvas" role="img" aria-label={`Four interlocking cubes viewed after ${turn} quarter turns. ${variant === 'Symmetry' ? 'The arrangement has matching left and right halves.' : 'Rotating changes their direction, not the arrangement.'}`} />;
}
