const THREE = require('three');
const geo = new THREE.IcosahedronGeometry(4, 2);
const pos = geo.attributes.position.array;

for (let i = 0; i < pos.length; i += 3) {
  let x = pos[i];
  let y = pos[i+1];
  let z = pos[i+2];
  
  let vec = new THREE.Vector3(x, y, z);
  let vNorm = vec.clone().normalize();
  
  // Ears
  if (vNorm.y > 0.4 && Math.abs(vNorm.x) > 0.4 && vNorm.z > -0.5 && vNorm.z < 0.5) {
     let earCenterX = Math.sign(vNorm.x) * 0.7;
     let earCenterY = 0.7;
     let dist = Math.sqrt(Math.pow(vNorm.x - earCenterX, 2) + Math.pow(vNorm.y - earCenterY, 2));
     if (dist < 0.5) {
        let factor = 1 + (0.5 - dist) * 1.5;
        pos[i] *= factor;
        pos[i+1] *= factor * 1.5;
     }
  }
  
  // Snout
  if (vNorm.z > 0.8 && vNorm.y < 0.2 && vNorm.y > -0.4 && Math.abs(vNorm.x) < 0.4) {
     pos[i+2] *= 1.3;
  }
}
geo.computeVertexNormals();
console.log("Vertices:", pos.length / 3);
