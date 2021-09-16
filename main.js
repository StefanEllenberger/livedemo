import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// en scene til å holde alle elementene våre - objekter, lys, kamera, osv
const scene = new THREE.Scene();

// et kamera til å gi oss et perspektiv for å se det vi lager
// vi oppgir argumentene field-of-view, aspect ratio, synlighetsgrenser for nære og langt unna
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// noe som kan konvertere 3d-objekter, lys og farge til noe synlig på en 2d skjerm (sånn ca, ikke siter meg på den definisjonen)
// vi oppgir #bg som stedet hvor resultatet skal vises
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
// fullskjerm, og vi rygger kamera litt for å få oversikt
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(3);

// et objekt
const geometry = new THREE.DodecahedronGeometry();
// et materiale å dekke det med slik at det er synlig
//wireframe: true
//MeshStandardMaterial
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347 } ); 
// en mesh, som dekker objektet vårt i materialet vårt
const dodecahedron = new THREE.Mesh( geometry, material );
//scene.add( dodecahedron );

// vi lyser opp scenen vår ved å lage et rødt lys og et blått lys, og flytte de til hver sin side av objektet vårt
const redLight = new THREE.PointLight(0xffffff);
const greenLight = new THREE.PointLight(0xffffff);
redLight.position.set(-5, 5, 5);
greenLight.position.set(5, -5, 0);
scene.add(redLight, greenLight)

//const controls = new OrbitControls(camera, renderer.domElement);

const myTexture = new THREE.TextureLoader().load('bg.jpg')
scene.background = myTexture;

const ballTexture = new THREE.TextureLoader().load('ball.jpg')
const normalBallTexture = new THREE.TextureLoader().load('ballnormal.jpg')
const ball = new THREE.Mesh(
  new THREE.SphereGeometry(),
  new THREE.MeshStandardMaterial({
    map: ballTexture,
    normalMap: normalBallTexture,
    normalScale: new THREE.Vector2( 5, 5 )
  })
);
scene.add(ball);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  ball.position.setY(t * -0.001)
}

document.body.onscroll = moveCamera;

function animate() {
  requestAnimationFrame(animate);
  ball.rotation.y += 0.01;
  //controls.update()
  renderer.render(scene, camera)
}

animate();

