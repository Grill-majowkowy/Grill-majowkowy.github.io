<template>
  <div ref="container" class="grill-scene"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const container = ref(null)

let scene
let camera
let renderer
let grill
let controls
let animationId
const smokeParticles = []

function buildGrill() {
  grill = new THREE.Group()

  // ===== BODY =====
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(2.3, 2.7, 1.8, 40),
    new THREE.MeshStandardMaterial({
      color: 0x1f1f1f,
      metalness: 0.8,
      roughness: 0.35
    })
  )
  body.position.y = 0.8
  grill.add(body)

  // ===== GRATE =====
  for (let i = -1.4; i <= 1.4; i += 0.35) {
    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 3.1, 10),
      new THREE.MeshStandardMaterial({
        color: 0xbcbcbc,
        metalness: 1,
        roughness: 0.2
      })
    )

    rod.rotation.z = Math.PI / 2
    rod.position.set(0, 1.75, i)

    grill.add(rod)
  }

  // ===== LEGS =====
  const legPos = [
    [-1.5, -1.1, -1.5],
    [1.5, -1.1, -1.5],
    [-1.5, -1.1, 1.5],
    [1.5, -1.1, 1.5]
  ]

  legPos.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 2.5, 12),
      new THREE.MeshStandardMaterial({
        color: 0x999999,
        metalness: 0.8,
        roughness: 0.3
      })
    )

    leg.position.set(x, y, z)
    grill.add(leg)
  })

  // ===== WHEELS =====
  const wheelGeo = new THREE.TorusGeometry(0.35, 0.09, 16, 32)
  const wheelMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.8
  })

  const wheel1 = new THREE.Mesh(wheelGeo, wheelMat)
  wheel1.rotation.y = Math.PI / 2
  wheel1.position.set(-1.75, -2.1, 1.3)

  const wheel2 = wheel1.clone()
  wheel2.position.z = -1.3

  grill.add(wheel1, wheel2)

  // ===== SIDE TABLE =====
  const table = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.12, 1.2),
    new THREE.MeshStandardMaterial({
      color: 0x444444,
      metalness: 0.5
    })
  )

  table.position.set(3, 1.2, 0)
  grill.add(table)

  // ===== CHARCOAL GLOW =====
  const glowLight = new THREE.PointLight(0xff5500, 5, 8)
  glowLight.position.set(0, 0.5, 0)
  grill.add(glowLight)

  // ===== SAUSAGES (kiełbasy) =====
  const sausageMat = new THREE.MeshStandardMaterial({ color: 0xb5401e, roughness: 0.65, metalness: 0.05 })
  const sausageMarkMat = new THREE.MeshStandardMaterial({ color: 0x2a0a00, roughness: 1 })

  const sausageXPositions = [-1.0, -0.35, 0.35, 1.0]
  sausageXPositions.forEach((x) => {
    const sausageBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.115, 0.115, 1.7, 20),
      sausageMat
    )
    sausageBody.rotation.x = Math.PI / 2
    sausageBody.position.set(x, 1.87, 0)
    grill.add(sausageBody)

    const capGeo = new THREE.SphereGeometry(0.115, 14, 14)
    const cap1 = new THREE.Mesh(capGeo, sausageMat)
    const cap2 = new THREE.Mesh(capGeo, sausageMat)
    cap1.position.set(x, 1.87, 0.85)
    cap2.position.set(x, 1.87, -0.85)
    grill.add(cap1, cap2)

    for (let j = -0.6; j <= 0.6; j += 0.35) {
      const mark = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.12, 0.07),
        sausageMarkMat
      )
      mark.position.set(x, 2.0, j)
      grill.add(mark)
    }
  })

  // ===== STEAKS (mięso) =====
  const steakMat = new THREE.MeshStandardMaterial({ color: 0x8b2d1f, roughness: 0.85 })
  const steakMarkMat = new THREE.MeshStandardMaterial({ color: 0x1e0800, roughness: 1 })

  const steaks = [
    { x: -0.65, z: -0.55, ry: 0.35 },
    { x: 0.72, z: 0.52, ry: -0.45 },
  ]
  steaks.forEach(({ x, z, ry }) => {
    const steak = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.2, 0.78),
      steakMat
    )
    steak.rotation.y = ry
    steak.position.set(x, 1.95, z)
    grill.add(steak)

    for (let j = -0.25; j <= 0.25; j += 0.18) {
      const mark = new THREE.Mesh(
        new THREE.BoxGeometry(0.97, 0.025, 0.075),
        steakMarkMat
      )
      mark.rotation.y = ry
      mark.position.set(x, 2.06, z + j)
      grill.add(mark)
    }
  })

  // ===== SMOKE PARTICLES =====
  const smokeMatBase = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    transparent: true,
    opacity: 0.22,
    roughness: 1,
  })
  for (let i = 0; i < 14; i++) {
    const smoke = new THREE.Mesh(
      new THREE.SphereGeometry(0.14 + Math.random() * 0.22, 8, 8),
      smokeMatBase.clone()
    )
    const angle = Math.random() * Math.PI * 2
    const r = Math.random() * 0.8
    smoke.position.set(
      Math.cos(angle) * r,
      2.7 + Math.random() * 2.5,
      Math.sin(angle) * r
    )
    smoke.userData.speed = 0.011 + Math.random() * 0.013
    smoke.userData.drift = new THREE.Vector3(
      (Math.random() - 0.5) * 0.004,
      0,
      (Math.random() - 0.5) * 0.004
    )
    smokeParticles.push(smoke)
    grill.add(smoke)
  }

  scene.add(grill)
}

function animate() {
  animationId = requestAnimationFrame(animate)

  controls.update()

  smokeParticles.forEach(s => {
    s.position.y += s.userData.speed
    s.position.x += s.userData.drift.x
    s.position.z += s.userData.drift.z
    s.material.opacity = Math.max(0, 0.22 - (s.position.y - 2.7) / 9)
    if (s.position.y > 6.5) {
      const angle = Math.random() * Math.PI * 2
      const r = Math.random() * 0.8
      s.position.set(Math.cos(angle) * r, 2.7, Math.sin(angle) * r)
      s.material.opacity = 0.22
    }
  })

  renderer.render(scene, camera)
}

function resize() {
  if (!container.value) return

  const w = container.value.clientWidth
  const h = container.value.clientHeight

  camera.aspect = w / h
  camera.updateProjectionMatrix()

  renderer.setSize(w, h)
}

onMounted(async () => {
  scene = new THREE.Scene()
  scene.background = new THREE.Color('#f5efe8')

  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  camera.position.set(8, 5, 9)
  camera.lookAt(0, 0.8, 0)

  renderer = new THREE.WebGLRenderer({
    antialias: true
  })

  renderer.setPixelRatio(window.devicePixelRatio)
  container.value.appendChild(renderer.domElement)

  // LIGHTS
  const ambient = new THREE.AmbientLight(0xfff4e0, 1.4)
  scene.add(ambient)

  const dir = new THREE.DirectionalLight(0xfff8f0, 2)
  dir.position.set(8, 10, 6)
  scene.add(dir)

  const fill = new THREE.DirectionalLight(0xff8833, 0.6)
  fill.position.set(-4, 2, -4)
  scene.add(fill)

  // FLOOR
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(10, 60),
    new THREE.MeshStandardMaterial({
      color: 0xe4e4e4
    })
  )

  floor.rotation.x = -Math.PI / 2
  floor.position.y = -2.4
  scene.add(floor)

  buildGrill()

  controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 0.8, 0)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.minPolarAngle = 0.3
  controls.maxPolarAngle = Math.PI / 2
  controls.enablePan = false
  controls.update()

  window.addEventListener('resize', resize)

  await nextTick()
  requestAnimationFrame(() => {
    resize()
    animate()
  })
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resize)
  controls.dispose()
  renderer.dispose()
})
</script>

<style scoped>
.grill-scene {
  width: 100%;
  height: 350px;
  border-radius: 18px;
  overflow: hidden;
}
</style>