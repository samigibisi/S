
const container = document.getElementById("heart-container");

// SAHNE
const scene = new THREE.Scene();

// KAMERA
const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);

camera.position.z = 9;

// RENDER
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setSize(
    container.clientWidth,
    container.clientHeight
);

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement);

// IŞIKLAR
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const redLight = new THREE.PointLight(0xff003c, 3, 30);
redLight.position.set(3, 3, 5);
scene.add(redLight);

const pinkLight = new THREE.PointLight(0xff6688, 2, 30);
pinkLight.position.set(-3, -2, 4);
scene.add(pinkLight);

// 3D KALP ŞEKLİ
const heartShape = new THREE.Shape();

heartShape.moveTo(0, -1.2);

heartShape.bezierCurveTo(-0.5, -0.5, -2.1, 0.5, -1.6, 1.6);
heartShape.bezierCurveTo(-1.2, 2.5, -0.2, 2.3, 0, 1.5);

heartShape.bezierCurveTo(0.2, 2.3, 1.2, 2.5, 1.6, 1.6);
heartShape.bezierCurveTo(2.1, 0.5, 0.5, -0.5, 0, -1.2);

const heartGeometry = new THREE.ExtrudeGeometry(
    heartShape,
    {
        depth: 0.7,
        bevelEnabled: true,
        bevelSegments: 8,
        steps: 2,
        bevelSize: 0.12,
        bevelThickness: 0.12
    }
);

heartGeometry.center();

const heartMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xe60035,
    metalness: 0.25,
    roughness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    emissive: 0x500010,
    emissiveIntensity: 0.7
});

const heart = new THREE.Mesh(heartGeometry, heartMaterial);
heart.scale.set(1.2, 1.2, 1.2);
scene.add(heart);

// DİLLER
const languages = [
    "I Miss You ❤️",
    "Seni Özledim ❤️",
    "Je m'ennuie de toi ❤️",
    "Te extraño ❤️",
    "Ich vermisse dich ❤️",
    "Mi manchi ❤️",
    "Sinto sua falta ❤️",
    "Я скучаю по тебе ❤️",
    "我想你 ❤️",
    "会いたい ❤️",
    "보고 싶어 ❤️",
    "اشتقت إليك ❤️",
    "أفتقدك ❤️",
    "मुझे तुम्हारी याद आती है ❤️",
    "أفتقد وجودك ❤️",
    "Ik mis je ❤️",
    "Jag saknar dig ❤️",
    "Jeg savner deg ❤️",
    "Jeg savner dig ❤️",
    "Tęsknię za tobą ❤️",
    "Chybíš mi ❤️",
    "Missä olet? ❤️",
    "Më mungon ❤️",
    "Saknar dig ❤️",
    "Tôi nhớ bạn ❤️",
    "ฉันคิดถึงคุณ ❤️",
    "Aku merindukanmu ❤️",
    "Eu sinto sua falta ❤️",
    "Ég sakna þín ❤️",
    "Ek is lief vir jou ❤️"
];

let currentLanguage = 0;

const messageElement = document.getElementById("language-message");

function changeLanguage() {
    messageElement.style.opacity = 0;

    setTimeout(() => {
        currentLanguage = (currentLanguage + 1) % languages.length;
        messageElement.textContent = languages[currentLanguage];
        messageElement.style.opacity = 1;
    }, 400);
}

setInterval(changeLanguage, 2200);

// KALBİN ÇEVRESİNDE DÖNEN MESAJLAR
const orbitMessages = [];

languages.forEach((message, index) => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 100;

    const context = canvas.getContext("2d");
    context.font = "bold 34px Arial";
    context.textAlign = "center";
    context.fillStyle = "#ffb6c8";
    context.shadowColor = "#ff1744";
    context.shadowBlur = 15;
    context.fillText(message, 256, 60);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false
    });

    const sprite = new THREE.Sprite(material);

    const angle = (index / languages.length) * Math.PI * 2;

    sprite.position.set(
        Math.cos(angle) * 3.3,
        Math.sin(angle) * 2.4,
        -0.5
    );

    sprite.scale.set(1.8, 0.35, 1);

    scene.add(sprite);
    orbitMessages.push(sprite);
});

// YILDIZ PARÇACIKLARI
const starGeometry = new THREE.BufferGeometry();
const starPositions = [];

for (let i = 0; i < 700; i++) {
    starPositions.push(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8
    );
}

starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starPositions, 3)
);

const starMaterial = new THREE.PointsMaterial({
    color: 0xff8da8,
    size: 0.035,
    transparent: true,
    opacity: 0.8
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// ANİMASYON
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Kalp atışı
    const beat = 1 + 0.07 * Math.pow(
        Math.max(0, Math.sin(time * 3.5)),
        12
    );

    heart.scale.set(
        1.2 * beat,
        1.2 * beat,
        1.2 * beat
    );

    // Kalbin dönüşü
    heart.rotation.y = Math.sin(time * 0.7) * 0.25;
    heart.rotation.x = Math.sin(time * 0.5) * 0.08;

    // Mesajların yörüngesi
    orbitMessages.forEach((sprite, index) => {
        const angle =
            (index / orbitMessages.length) * Math.PI * 2
            + time * 0.18;

        sprite.position.x = Math.cos(angle) * 3.3;
        sprite.position.y = Math.sin(angle) * 2.4;
    });

    stars.rotation.y = time * 0.025;

    redLight.intensity = 2.5 + Math.sin(time * 3) * 0.7;

    renderer.render(scene, camera);
}

animate();

// EKRAN BOYUTU
window.addEventListener("resize", () => {
    camera.aspect =
        container.clientWidth / container.clientHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );
});
