# Vi setter i gang med ThreeJS!
## Innhold stjålet og trikset med fra følgende kilder:
https://www.youtube.com/watch?v=Q7AOvWpIVHU

https://www.youtube.com/watch?v=pUgWfqWZWmM

[Lenke til ThreeJS docs](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene)

## Før vi begynner
#### Installer følgende:
* Visual Studio Code (eller lignende IDE for å skrive Javascript)
* NodeJS
* Vite (npm i vite)

## Vi sparker i gang
Naviger til mappen for dine prosjekter i kommandolinjen, og kjør *npm init vite*
Kjør *npm i three*
Følg instruksene i kommandolinjen for å starte prosjektet
Slett innholdet i style.css, og slett alt utenom css-importen i main.js

## Linjer med kode å lime inn
i index.html, før style, lager vi et element:
```
<canvas id="bg"></canvas>
```
i style.css plasser vi elementet øverst i vinduet:
```
canvas {
position: fixed;
top: 0;
left: 0;
}
```
i main.js importerer vi biblioteket
```
import * as THREE from 'three'
```
deretter lager vi tre tingene vi trenger for å skape noe i ThreeJS, nemlig en scene, et kamera og en renderer:
```
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
renderer.render(scene, camera)
```
Hvis vi nå har en svart skjema så ligger vi godt an!
Vi trenger nå tre nye ting for å vise frem noe stilig:
```
// et objekt
const geometry = new THREE.DodecahedronGeometry();
// et materiale å dekke det med slik at det er synlig
//wireframe: true
//MeshStandardMaterial
const material = new THREE.MeshBasicMaterial( { color: 0xFF6347, wireframe: true } );
// en mesh, som dekker objektet vårt i materialet vårt
const dodecahedron = new THREE.Mesh( geometry, material );
scene.add( dodecahedron );
```
Vi kan også lage en løkke, slik at scenen vår ikke bare blir tegnet én gang. Vi kan også gjøre en liten endring mellom hver tegning, for å skape litt liv
```
function animate() {
  requestAnimationFrame(animate);
  //dodecahedron.rotation.y += 0.01;
  renderer.render(scene, camera)
}

animate();
```
Vi kan svippe innom dokumentasjonen og se litt på de andre geometries tilgjengelig, og hvor raskt det går å bytte fra en til en annen.
Vi bytter ut det forrige materialet vårt, som ikke reagerte på lys, med et som gjør det (MeshStandardMaterial). Da forsvinner alt fra skjermen, fordi scenen vår er helt mørk.
```
// vi lyser opp scenen vår ved å lage et rødt lys og et blått lys, og flytte de til hver sin side av objektet vårt
const redLight = new THREE.PointLight(0xff0000);
const greenLight = new THREE.PointLight(0x00ff00);
redLight.position.set(-5, 5, 0);
greenLight.position.set(5, -5, 0);
scene.add(redLight, greenLight)
```
Vi kan få litt mer oversikt, og litt mer interaktivitet, ved å importere en kontroller som lar oss flytte på oss.
```
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
...
// vi gir kontrolleren kameraet det skal styre, og en måte å lytte til input vi gir nettleseren
const controls = new OrbitControls(camera, renderer.domElement);
//i animate-funksjonen legger vi til:
controls.update()
```
Det er på tide å importere litt egne textures, og gjøre scenen litt mer unik. Vi slenger inn en bakgrunn:
```
const myTexture = new THREE.TextureLoader().load('bg.jpg')
```
Og vi kan forsøke å gjenskape noe litt mer realistisk, i form av en ball:
```
const ballTexture = new THREE.TextureLoader().load('ball.jpg')
//const normalBallTexture = new THREE.TextureLoader().load('ballnormal.jpg')
const ball = new THREE.Mesh(
  new THREE.SphereGeometry(),
  new THREE.MeshStandardMaterial({
    map: ballTexture,
    //normalMap: normalBallTexture,
    //normalScale: new THREE.Vector2( 5, 5 )
  })
);
scene.add(ball);
```
Vi finner en gratis texture å ta i bruk ved å dra til: https://polyhaven.com/textures

Til slutt vil vi gjenskape den populære effekten man ser mye av i disse dager hvor man scroller, og det påvirker hva man ser på skjermen:
Vi legger til en ny seksjon av nettsiden vår, som gjør at vi kan scrolle, og vi fjerner kontrolleren vi hentet inn tidligere.
```
<div class="container">
  <h1>ECHO</h1>
</div>
<canvas id="bg"></canvas>
<section style="height: 150vh"></section>
```
i css-filen:
```
canvas {
  position: fixed;
  top: 0;
  left: 0;
}

.container {
  height: 100vh;
  display: grid;
  place-items: center;
}

h1 {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 8rem;
  color: white;
  z-index: 9;
}
```
i main.js:
```
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  ball.position.setY(t * -0.001)
}
```
