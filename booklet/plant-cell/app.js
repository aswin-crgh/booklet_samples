import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const organelleNotes = {
  "cell-wall": {
    title: "Cell Wall",
    hint: "The cell wall is the firm outer boundary that helps a plant cell keep its shape.",
    body: "The cell wall is a stiff outer covering found outside the cell membrane. In plants it is mainly made of cellulose fibres. It gives the cell a clear shape, protects the softer living parts inside, and helps plant tissues stay upright instead of collapsing.",
    fields: {
      composition: "Mostly cellulose, a strong carbohydrate fibre.",
      subParts: "Cellulose fibres, middle lamella between neighbouring cells, and tiny channels called plasmodesmata.",
      specialFact: "The middle lamella acts like a natural glue between nearby plant cells.",
      compare: "Animal cells do not have a cell wall, so their outer shape is usually more flexible.",
      everyday: "Fresh vegetables feel crisp partly because water-filled cells press against strong cell walls.",
    },
  },
  "cell-membrane": {
    title: "Cell Membrane",
    hint: "The cell membrane controls what enters and leaves the cell.",
    body: "The cell membrane is a thin living boundary just inside the cell wall. It is selectively permeable, which means it allows some substances through while slowing or stopping others. This helps the cell keep the right balance of water, salts, food molecules, and wastes.",
    fields: {
      role: "Controls exchange between the cell and its surroundings.",
      composition: "Mainly a phospholipid bilayer with proteins embedded in it.",
      subParts: "Lipids, transport proteins, receptor proteins, and carbohydrate markers.",
      specialFact: "Some membrane proteins act like doors or pumps for specific substances.",
      memory: "A gatekeeper is a good memory hook, but the membrane is living and active, not a fixed wall.",
    },
  },
  vacuole: {
    title: "Central Vacuole",
    hint: "The vacuole stores water and helps the cell stay firm.",
    body: "A plant cell usually has one large central vacuole filled with cell sap. It stores water, dissolved sugars, salts, pigments, and some wastes. When the vacuole is full, it pushes the cytoplasm outward against the cell wall, helping the cell remain firm.",
    fields: {
      contents: "Water, salts, sugars, and other dissolved materials.",
      subParts: "Cell sap and the vacuole membrane, called the tonoplast.",
      specialFact: "The outward pressure from a full vacuole is called turgor pressure.",
      compare: "Plant vacuoles are usually much larger than animal-cell vacuoles.",
      everyday: "A full vacuole helps leaves stay crisp; water loss makes leaves wilt.",
    },
  },
  nucleus: {
    title: "Nucleus",
    hint: "The nucleus stores instructions and helps direct cell activities.",
    body: "The nucleus is often called the control centre of the cell because it stores genetic information and helps direct cell activities. Chromosomes carry DNA, which contains instructions for making proteins and passing traits from one generation of cells to the next.",
    fields: {
      role: "Controls many cell activities by using information stored in DNA.",
      inside: "Chromosomes, nucleoplasm, nuclear membrane, nuclear pores, and often a nucleolus.",
      specialFact: "The nucleolus helps make parts of ribosomes, which later help build proteins.",
      compare: "Most mature plant cells keep a nucleus, but its position can be pushed to the side by the large vacuole.",
      memory: "The nucleus is less like a boss shouting orders and more like an information library the cell reads from.",
    },
  },
  chloroplast: {
    title: "Chloroplast",
    hint: "Chloroplasts use sunlight to help plants make food.",
    body: "Chloroplasts are green organelles that contain chlorophyll, the pigment that captures light energy. During photosynthesis, chloroplasts use carbon dioxide and water to make glucose, while oxygen is released. This is why green plant cells are so important for food chains.",
    fields: {
      process: "Photosynthesis makes glucose and oxygen.",
      subParts: "Outer membrane, inner membrane, stroma, thylakoids, and grana.",
      pigment: "Chlorophyll gives many leaves their green colour.",
      specialFact: "Thylakoids are stacked in groups called grana, where light energy is captured.",
      compare: "Root cells and onion bulb cells may have few chloroplasts because they are not usually exposed to sunlight.",
    },
  },
  mitochondrion: {
    title: "Mitochondrion",
    hint: "Mitochondria release usable energy from food.",
    body: "Mitochondria are organelles where glucose is broken down during cellular respiration to release usable energy. Plant cells need mitochondria even though they have chloroplasts, because making food and releasing energy from food are different jobs.",
    fields: {
      role: "Cellular respiration.",
      subParts: "Outer membrane, inner membrane, cristae, and matrix.",
      specialFact: "The inner membrane folds into cristae, creating more surface area for energy-releasing reactions.",
      memory: "Often called the powerhouse of the cell.",
      compare: "Both plant and animal cells have mitochondria.",
    },
  },
  golgi: {
    title: "Golgi Apparatus",
    hint: "The Golgi apparatus packages and sends materials around the cell.",
    body: "The Golgi apparatus modifies, sorts, packages, and sends substances made inside the cell. Materials from the endoplasmic reticulum arrive in small vesicles, are processed in flattened sacs, and then leave in new vesicles for delivery.",
    fields: {
      role: "Packaging, sorting, and transport.",
      subParts: "Flattened sacs called cisternae and small transport vesicles.",
      specialFact: "Golgi bodies can add chemical tags that help send materials to the correct destination.",
      memory: "A packing and delivery counter.",
    },
  },
  "rough-er": {
    title: "Rough ER",
    hint: "Rough ER helps build and move proteins.",
    body: "Rough endoplasmic reticulum is a folded membrane network with ribosomes attached to its surface. The ribosomes make proteins, and the rough ER helps fold and move many of those proteins toward the Golgi apparatus.",
    fields: {
      surface: "Has ribosomes attached.",
      subParts: "Folded membrane channels and attached ribosomes.",
      role: "Protein making, folding, and transport.",
      specialFact: "Proteins made on rough ER are often sent to membranes, vesicles, or outside the cell.",
    },
  },
  "smooth-er": {
    title: "Smooth ER",
    hint: "Smooth ER helps make lipids and move materials.",
    body: "Smooth endoplasmic reticulum has no ribosomes on its surface, so it looks smoother than rough ER. It helps make lipids, move materials, and in many cells helps handle chemicals that need to be changed or broken down.",
    fields: {
      surface: "No ribosomes attached.",
      subParts: "Smooth membrane tubules connected to the wider ER network.",
      role: "Lipid making, transport, and chemical processing.",
      specialFact: "Cells that make many lipids usually have more smooth ER.",
      compare: "Rough ER has ribosomes; smooth ER does not.",
    },
  },
  peroxisome: {
    title: "Peroxisome",
    hint: "Peroxisomes help break down some chemicals inside cells.",
    body: "Peroxisomes are small organelles that help break down certain harmful substances and process fatty acids. They protect the cell by using enzymes to change reactive chemicals into safer substances.",
    fields: {
      role: "Breaks down some chemicals and helps process fats.",
      subParts: "Single membrane and enzyme-rich interior.",
      specialFact: "Peroxisomes often make hydrogen peroxide during reactions, then quickly break it down using enzymes.",
      level: "A useful detail that shows cells have many specialised workers.",
    },
  },
  ribosome: {
    title: "Ribosome",
    hint: "Ribosomes are tiny protein builders.",
    body: "Ribosomes are tiny protein-building structures. They read instructions copied from DNA and join amino acids together to make proteins. Some ribosomes float freely in the cytoplasm, while others sit on rough ER.",
    fields: {
      role: "Protein synthesis.",
      location: "Free in cytoplasm or attached to rough ER.",
      subParts: "Large and small ribosomal subunits.",
      specialFact: "Ribosomes are not surrounded by a membrane, unlike many organelles.",
      connection: "The nucleolus helps make ribosome parts inside the nucleus.",
    },
  },
};

const primaryLabelKeys = new Set(["cell-wall", "cell-membrane", "nucleus", "vacuole", "chloroplast"]);

const labelAnchorOffsets = {
  "cell-wall": new THREE.Vector3(-1.15, 0.75, 0.25),
  "cell-membrane": new THREE.Vector3(1.1, -0.72, 0.25),
  vacuole: new THREE.Vector3(0.1, 0.12, 0.38),
  nucleus: new THREE.Vector3(-0.1, 0.08, 0.42),
  chloroplast: new THREE.Vector3(0.04, 0.08, 0.26),
  mitochondrion: new THREE.Vector3(0.04, 0.08, 0.22),
  golgi: new THREE.Vector3(0.02, -0.02, 0.24),
  "rough-er": new THREE.Vector3(-0.05, 0.08, 0.24),
  "smooth-er": new THREE.Vector3(0.02, 0.08, 0.24),
  peroxisome: new THREE.Vector3(0.02, 0.08, 0.2),
  ribosome: new THREE.Vector3(0.02, 0.08, 0.16),
};

const microscopeSlides = [
  {
    title: "Elodea / Anacharis leaf cells",
    image: "./assets/microscope/anacharis-chloroplasts.jpg",
    note: "Green dots are chloroplasts inside rectangular plant cells.",
    source: "Wikimedia Commons: Anacharis Magnified, Lilyviolet, CC BY 4.0",
    tags: ["cell wall", "chloroplasts"],
  },
  {
    title: "Onion epidermis cells",
    image: "./assets/microscope/onion-epidermis.jpg",
    note: "Onion cells show clear box-like cell walls, but not green chloroplasts.",
    source: "Wikimedia Commons: Onion Epidermis Cells W.M. 40x - 132, loganrickert, CC BY 2.0",
    tags: ["cell wall grid", "cell space"],
  },
  {
    title: "Guard cells around a stoma",
    image: "./assets/microscope/guard-cells.png",
    note: "Guard cells open and close tiny pores that help leaves exchange gases.",
    source: "Wikimedia Commons: Plant stoma guard cells, Alex Costa, CC BY 2.5",
    tags: ["guard cell", "stoma"],
  },
  {
    title: "Tradescantia / Zebrina stomata",
    image: "./assets/microscope/zebrina-stomata.jpeg",
    note: "A leaf surface is made of many cells, with stomata placed like adjustable doorways.",
    source: "Wikimedia Commons: Zebrina stomata, AioftheStorm, CC0",
    tags: ["epidermal cells", "stomata"],
  },
  {
    title: "Onion root tip mitosis",
    image: "./assets/microscope/onion-root-mitosis.jpg",
    note: "Root tips show cells dividing, which helps the plant grow.",
    source: "Wikimedia Commons: Onion Root Tip Cells Mitosis, Catfaster, CC BY-SA 4.0",
    tags: ["dividing cells", "nucleus area"],
  },
  {
    title: "Spirogyra under microscope",
    image: "./assets/microscope/spirogyra.jpg",
    note: "Spirogyra has spiral chloroplasts, a memorable real-life shape for green cells.",
    source: "Wikimedia Commons: Spirogyra algae under microscope, Stefan Thiesen, CC BY-SA 3.0",
    tags: ["spiral chloroplast", "cell wall"],
  },
  {
    title: "Leaf epithelium with stomata",
    image: "./assets/microscope/leaf-epithelium-stomata.jpg",
    note: "A broader leaf-surface view shows how many cells form a living tissue.",
    source: "Wikimedia Commons: Leaf epithelium, stomata, Emilio Ermini, CC BY 4.0",
    tags: ["leaf cells", "stomata"],
  },
];

const videos = [
  {
    id: "EaRowyAq9o4",
    title: "Introduction to the World of Cells",
    source: "BYJU'S",
    thumb: "https://i.ytimg.com/vi/EaRowyAq9o4/hqdefault.jpg",
    note: "A broad first explainer for understanding cells as the basic units of life before zooming into plant parts.",
  },
  {
    id: "WqwOlOZ7eKo",
    title: "Cell Structure and its Function",
    source: "BYJU'S",
    thumb: "https://i.ytimg.com/vi/WqwOlOZ7eKo/hqdefault.jpg",
    note: "Use this with the Explore page: each structure in a cell has a function that supports the whole living system.",
  },
  {
    id: "zCXXMRY4eTs",
    title: "The Discovery of Cell",
    source: "BYJU'S NEET",
    thumb: "https://i.ytimg.com/vi/zCXXMRY4eTs/hqdefault.jpg",
    note: "An optional history bridge for the Extras page: microscopes, Hooke, and the development of cell theory.",
  },
];

const flashCards = [
  ["Why do plant cells have a cell wall?", "The cell wall gives shape, support, and protection. It is mainly made of cellulose and sits outside the cell membrane."],
  ["Which organelle makes food using sunlight?", "The chloroplast. It contains chlorophyll, which captures light energy for photosynthesis."],
  ["Why is the vacuole important?", "The central vacuole stores cell sap and helps keep the plant cell firm by pressing outward."],
  ["What does the nucleus do?", "The nucleus stores genetic information and helps direct many cell activities."],
  ["Which part controls entry and exit?", "The cell membrane is selectively permeable, so it controls what enters and leaves the cell."],
  ["What do ribosomes make?", "Ribosomes make proteins, which cells need for growth, repair, enzymes, and many activities."],
  ["How are chloroplasts and mitochondria different?", "Chloroplasts help make glucose using light. Mitochondria release usable energy from food."],
  ["Why do onion epidermis cells often look colourless?", "Onion bulb cells usually do not have many chloroplasts because they grow underground and do not photosynthesise like green leaves."],
  ["What is the job of the Golgi apparatus?", "The Golgi apparatus modifies, packages, and sends materials to where they are needed."],
  ["Why is rough ER called rough?", "Rough ER has ribosomes attached to its surface, giving it a dotted or rough appearance."],
  ["What does smooth ER help make?", "Smooth ER helps make lipids and helps move materials inside the cell."],
  ["What does a microscope view remind us about cells?", "Real plant tissues are made of many cells arranged together, not just one labelled diagram."],
];

const quizCards = [
  { type: "MCQ", question: "Which organelle helps a plant cell make food using sunlight?", options: ["Chloroplast", "Vacuole", "Cell wall", "Nucleus"], answer: "Chloroplast" },
  { type: "MCQ", question: "The plant cell wall is mainly made of which material?", options: ["Cellulose", "Starch", "Protein", "Oil"], answer: "Cellulose" },
  { type: "FIB", question: "The large storage space in a plant cell is the ____.", answer: "vacuole" },
  { type: "MCQ", question: "Which part is often called the control centre of the cell?", options: ["Nucleus", "Ribosome", "Golgi apparatus", "Cell membrane"], answer: "Nucleus" },
  { type: "FIB", question: "Photosynthesis uses sunlight, water, and carbon dioxide to make ____.", answer: "glucose" },
  { type: "MCQ", question: "Which part controls what enters and leaves the cell?", options: ["Cell membrane", "Cell wall", "Vacuole", "Chloroplast"], answer: "Cell membrane" },
  { type: "MCQ", question: "Which organelle releases usable energy from food?", options: ["Mitochondrion", "Chloroplast", "Nucleolus", "Cell wall"], answer: "Mitochondrion" },
  { type: "FIB", question: "Ribosomes help make ____ for the cell.", answer: "proteins" },
  { type: "MCQ", question: "Which pair is especially useful for identifying many plant cells?", options: ["Cell wall and chloroplasts", "Veins and arteries", "Trachea and lungs", "Ureters and bladder"], answer: "Cell wall and chloroplasts" },
  { type: "MCQ", question: "What does the Golgi apparatus mainly do?", options: ["Packages and sends materials", "Stores urine", "Carries air", "Absorbs water from food"], answer: "Packages and sends materials" },
  { type: "FIB", question: "Rough ER looks rough because ____ are attached to it.", answer: "ribosomes" },
  { type: "MCQ", question: "Which organelle contains chlorophyll?", options: ["Chloroplast", "Mitochondrion", "Golgi apparatus", "Cell membrane"], answer: "Chloroplast" },
  { type: "MCQ", question: "A full vacuole helps a plant cell stay:", options: ["Firm", "Boneless", "Air-filled", "Colourless"], answer: "Firm" },
  { type: "FIB", question: "The thin living boundary just inside the cell wall is the cell ____.", answer: "membrane" },
  { type: "MCQ", question: "Which statement best compares plant and animal cells?", options: ["Plant cells usually have a cell wall; animal cells do not", "Animal cells have chloroplasts; plant cells do not", "Plant cells have no nucleus", "Only animal cells use energy"], answer: "Plant cells usually have a cell wall; animal cells do not" },
  { type: "MCQ", question: "Which structure is often visible as a darker body inside the nucleus?", options: ["Nucleolus", "Ureter", "Bronchus", "Villus"], answer: "Nucleolus" },
];

const people = [
  {
    name: "Robert Hooke",
    role: "Named cells after observing cork.",
    group: "Global",
    initials: "RH",
    detail: "In 1665, Hooke looked at thin slices of cork and used the word cell for the tiny box-like spaces he saw. He was looking at dead cell walls, but his observation gave biology a powerful new word for the small units that build living things.",
  },
  {
    name: "Antonie van Leeuwenhoek",
    role: "Observed living microscopic organisms.",
    group: "Global",
    initials: "AL",
    detail: "Leeuwenhoek made powerful simple microscopes and observed living microorganisms, sperm cells, and blood cells. His work showed that the microscopic world was not empty; it was full of moving, living forms.",
  },
  {
    name: "Matthias Schleiden",
    role: "Proposed that plants are made of cells.",
    group: "Global",
    initials: "MS",
    detail: "Schleiden studied plant tissues and argued that plants are built from cells. His work helped move plant biology away from only describing whole leaves, stems, and roots toward explaining the tiny units inside them.",
  },
  {
    name: "Theodor Schwann",
    role: "Extended cell theory to animals.",
    group: "Global",
    initials: "TS",
    detail: "Schwann helped show that animals are also made of cells. Together with Schleiden's plant work, this helped form cell theory: cells are a shared foundation of living organisms.",
  },
  {
    name: "J. C. Bose",
    role: "Studied plant responses to stimuli.",
    group: "India",
    initials: "JCB",
    detail: "Jagdish Chandra Bose designed sensitive instruments to study plant responses to light, heat, touch, and chemicals. His work showed that plants are active living systems, not passive green objects.",
  },
  {
    name: "Panchanan Maheshwari",
    role: "Advanced plant embryology and tissue culture.",
    group: "India",
    initials: "PM",
    detail: "Panchanan Maheshwari made major contributions to plant embryology and tissue culture in India. His work connects cell division, plant reproduction, and the way a tiny plant embryo can develop into a complete organism.",
  },
  {
    name: "Birbal Sahni",
    role: "Linked plant life with deep history.",
    group: "India",
    initials: "BS",
    detail: "Birbal Sahni studied fossil plants and helped establish palaeobotany in India. His work connects plant structures seen today with the long history of plant life on Earth.",
  },
  {
    name: "Vrikshayurveda",
    role: "Ancient Indian plant-care knowledge.",
    group: "India",
    initials: "VY",
    detail: "Vrikshayurveda reflects careful observation of plant growth, soil, water, seasons, and care in ancient Indian knowledge traditions. It shows that plant study has long depended on patient observation of living plants.",
  },
];

const viewerEl = document.querySelector("#cell-viewer");
const labelLayer = document.querySelector("[data-label-layer]");
const viewerStatus = document.querySelector("[data-viewer-status]");
const notesTitle = document.querySelector("[data-notes-title]");
const notesHint = document.querySelector("[data-notes-hint]");
const detailTitle = document.querySelector("[data-detail-title]");
const detailBody = document.querySelector("[data-detail-body]");
const detailList = document.querySelector("[data-detail-list]");
const viewerActions = document.querySelectorAll("[data-viewer-action]");
const microStage = document.querySelector("[data-micro-stage]");
const microCopy = document.querySelector("[data-micro-copy]");
const videoPlayer = document.querySelector("[data-video-player]");
const videoList = document.querySelector("[data-video-list]");
const videoTitle = document.querySelector("[data-video-title]");
const videoSubtitle = document.querySelector("[data-video-subtitle]");
const videoNotes = document.querySelector("[data-video-notes]");
const flashGrid = document.querySelector("[data-flashcards]");
const quizStack = document.querySelector("[data-quiz-stack]");
const timerEl = document.querySelector("[data-timer]");
const scoreEl = document.querySelector("[data-score]");
const attemptsEl = document.querySelector("[data-attempts]");
const quizStatusEl = document.querySelector("[data-quiz-status]");
const resetQuizButton = document.querySelector("[data-reset-quiz]");
const startQuizButton = document.querySelector("[data-start-quiz]");
const quizPanel = document.querySelector("[data-quiz-panel]");
const peopleGrid = document.querySelector("[data-people-grid]");
const personName = document.querySelector("[data-person-name]");
const personRole = document.querySelector("[data-person-role]");
const personDetail = document.querySelector("[data-person-detail]");
const pageIconTabs = document.querySelectorAll("[data-page-target]");

const viewerState = {
  loaded: false,
  playing: true,
  autoRotate: true,
  labels: true,
  labelDensity: "all",
  isolated: false,
  zoomed: false,
  selectedKey: "nucleus",
  organelles: [],
  visible: new Map(),
};

let scene;
let camera;
let renderer;
let controls;
let rootGroup;
let loader;
let raycaster;
let pointer;
let pointerStart = null;
let microscopeIndex = 0;
let quizSeconds = 300;
let quizActive = false;
let quizStarted = false;
let quizInView = false;
let quizTimerId = null;
let attempts = 0;
let quizScore = new Map();

function getBaseKey(id) {
  return id.replace(/-\d+$/, "");
}

function stopFtue(pageId) {
  document.querySelector(`#${pageId}`)?.classList.remove("ftue-active");
}

function renderDetail(key) {
  const note = organelleNotes[key] || organelleNotes.nucleus;
  notesTitle.textContent = note.title;
  notesHint.textContent = note.hint;
  detailTitle.textContent = note.title;
  detailBody.textContent = note.body;
  detailList.innerHTML = "";
  Object.entries(note.fields).forEach(([term, value]) => {
    const row = document.createElement("div");
    row.innerHTML = `<dt>${term}</dt><dd>${value}</dd>`;
    detailList.appendChild(row);
  });
}

function setSelectedOrganelle(item) {
  const shouldRefreshIsolation = viewerState.isolated && viewerState.selectedKey !== item.baseKey;
  if (shouldRefreshIsolation) {
    viewerState.isolated = false;
    updateOrganelleVisibility();
  }
  viewerState.selectedKey = item.baseKey;
  if (shouldRefreshIsolation) viewerState.isolated = true;
  updateOrganelleVisibility();
  renderDetail(item.baseKey);
  syncViewerControls();
}

function selectOrganelleByKey(key) {
  stopFtue("page-immersive");
  const item = viewerState.organelles.find((organelle) => organelle.baseKey === key);
  if (item) setSelectedOrganelle(item);
  else renderDetail(key);
}

function makeSketchMaterial(material, fallbackColor) {
  const sourceColor = material?.color || new THREE.Color(fallbackColor);
  const colour = sourceColor.clone().lerp(new THREE.Color(0xfffaf0), 0.38);
  return new THREE.MeshToonMaterial({
    color: colour,
    transparent: material?.transparent || material?.opacity < 1,
    opacity: Math.min(material?.opacity ?? 0.84, 0.84),
  });
}

function addSketchOutlines(group) {
  const meshes = [];
  group.traverse((child) => {
    if (child.isMesh) meshes.push(child);
  });
  meshes.forEach((mesh) => {
    const originalOpacity = mesh.material?.opacity ?? 1;
    mesh.material = makeSketchMaterial(mesh.material, mesh.material?.color || 0x88aa66);
    const outline = new THREE.Mesh(
      mesh.geometry,
      new THREE.MeshBasicMaterial({
        color: 0x49638f,
        side: THREE.BackSide,
        transparent: true,
        opacity: originalOpacity < 0.5 ? 0.08 : 0.13,
        depthWrite: false,
      }),
    );
    outline.scale.setScalar(1.035);
    outline.name = `${mesh.name || "mesh"} outline`;
    mesh.add(outline);
  });
}

function applyMeshFocus(mesh, focused, enabled = true) {
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  materials.filter(Boolean).forEach((material) => {
    if (!material.userData.focusBase) {
      material.userData.focusBase = {
        opacity: material.opacity ?? 1,
        transparent: Boolean(material.transparent),
        depthWrite: material.depthWrite,
      };
    }
    const base = material.userData.focusBase;
    material.opacity = enabled ? (focused ? Math.min(1, base.opacity + 0.18) : Math.min(base.opacity, 0.28)) : base.opacity;
    material.transparent = enabled ? (focused ? base.transparent : true) : base.transparent;
    material.depthWrite = enabled ? (focused ? base.depthWrite : false) : base.depthWrite;
    material.emissive?.set(enabled && focused ? 0x2a2200 : 0x000000);
    material.needsUpdate = true;
  });
  mesh.renderOrder = enabled && focused ? 3 : 0;
}

function updateOrganelleVisibility() {
  viewerState.organelles.forEach((item) => {
    const focused = item.baseKey === viewerState.selectedKey;
    const focusEnabled = viewerState.isolated;
    item.group.visible = !viewerState.isolated || focused;
    if (item.baseScale) {
      item.group.scale.copy(item.baseScale).multiplyScalar(focusEnabled && focused ? 1.055 : 1);
    }
    item.group.traverse((child) => {
      if (child.isMesh && child.material) applyMeshFocus(child, focused, focusEnabled);
    });
  });
  updateLabels();
}

function initScene() {
  scene = new THREE.Scene();
  scene.background = null;
  camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 5.8);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  viewerEl.appendChild(renderer.domElement);

  rootGroup = new THREE.Group();
  scene.add(rootGroup);
  scene.add(new THREE.HemisphereLight(0xfffbef, 0xb7c2d8, 2.5));
  const light = new THREE.DirectionalLight(0xffffff, 2.6);
  light.position.set(3, 4, 5);
  scene.add(light);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.85;
  controls.enablePan = true;
  controls.minDistance = 2.6;
  controls.maxDistance = 8;
  controls.addEventListener("change", updateLabels);

  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();
  loader = new GLTFLoader();

  viewerEl.addEventListener("pointerdown", () => stopFtue("page-immersive"), { capture: true });
  renderer.domElement.addEventListener("pointerdown", (event) => {
    stopFtue("page-immersive");
    pointerStart = { x: event.clientX, y: event.clientY, time: performance.now() };
  });
  renderer.domElement.addEventListener("pointerup", onPointerUp);

  new ResizeObserver(resizeRenderer).observe(viewerEl);
}

function resizeRenderer() {
  const { width, height } = viewerEl.getBoundingClientRect();
  if (!width || !height) return;
  renderer.setSize(width, height, true);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  controls.update();
  updateLabels();
}

async function loadPlantCell() {
  const manifest = await fetch("./models/plant-cell/manifest.json").then((response) => response.json());
  const models = await Promise.all(
    manifest.organelles.map(
      (organelle) =>
        new Promise((resolve, reject) => {
          loader.load(organelle.file, (gltf) => resolve({ organelle, gltf }), undefined, reject);
        }),
    ),
  );

  models.forEach(({ organelle, gltf }) => {
    const group = gltf.scene;
    group.position.set(...organelle.position);
    group.scale.setScalar(organelle.scale);
    group.userData.organelleId = organelle.id;
    group.traverse((child) => {
      child.userData.organelleId = organelle.id;
    });
    addSketchOutlines(group);
    rootGroup.add(group);
    const baseKey = getBaseKey(organelle.id);
    viewerState.visible.set(organelle.id, true);
    viewerState.organelles.push({
      id: organelle.id,
      baseKey,
      label: organelle.label,
      group,
      baseScale: group.scale.clone(),
      labelOffset: labelAnchorOffsets[baseKey] || new THREE.Vector3(0, 0.2, 0.2),
    });
  });

  normalizeRoot();
  viewerState.loaded = true;
  viewerStatus.textContent = "tap an organelle";
  const nucleus = viewerState.organelles.find((item) => item.baseKey === "nucleus");
  if (nucleus) setSelectedOrganelle(nucleus);
  syncViewerControls();
}

function normalizeRoot() {
  const box = new THREE.Box3().setFromObject(rootGroup);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  rootGroup.position.sub(center);
  const scale = 3.1 / Math.max(size.x, size.y, size.z);
  rootGroup.scale.setScalar(scale);
  rootGroup.rotation.set(-0.12, 0.2, 0);
}

function findOrganelleFromObject(object) {
  let current = object;
  while (current) {
    if (current.userData?.organelleId) {
      return viewerState.organelles.find((item) => item.id === current.userData.organelleId);
    }
    current = current.parent;
  }
  return null;
}

function onPointerUp(event) {
  if (!pointerStart || !viewerState.loaded) return;
  const moved = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
  const elapsed = performance.now() - pointerStart.time;
  pointerStart = null;
  if (moved > 5 || elapsed > 500) return;

  const bounds = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
  pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  const meshes = [];
  rootGroup.traverse((child) => {
    if (child.isMesh && child.visible) meshes.push(child);
  });
  const [hit] = raycaster.intersectObjects(meshes, true);
  if (!hit) return;
  const item = findOrganelleFromObject(hit.object);
  if (item) setSelectedOrganelle(item);
}

function resetCamera() {
  viewerState.zoomed = false;
  camera.position.set(0, 0, 5.8);
  controls.target.set(0, 0, 0);
  controls.update();
}

function setIsolation() {
  updateOrganelleVisibility();
}

function syncViewerControls() {
  viewerActions.forEach((button) => {
    const action = button.dataset.viewerAction;
    button.classList.toggle(
      "active",
      (action === "play" && viewerState.playing) ||
        (action === "rotate" && viewerState.autoRotate) ||
        (action === "labels" && viewerState.labels) ||
        (action === "zoom" && viewerState.zoomed) ||
        (action === "isolate" && viewerState.isolated),
    );
    if (action === "play") button.textContent = viewerState.playing ? "pause" : "play";
    if (action === "zoom") button.textContent = viewerState.zoomed ? "zoom out" : "zoom";
    if (action === "labels") {
      button.textContent = !viewerState.labels ? "labels off" : viewerState.labelDensity === "all" ? "all labels" : "key labels";
    }
  });
  if (controls) controls.autoRotate = viewerState.playing && viewerState.autoRotate;
  updateLabels();
}

function handleViewerAction(action) {
  if (!viewerState.loaded && action !== "reset") return;
  if (action === "play") viewerState.playing = !viewerState.playing;
  if (action === "rotate") viewerState.autoRotate = !viewerState.autoRotate;
  if (action === "zoom") {
    viewerState.zoomed = !viewerState.zoomed;
    camera.position.set(0, 0, viewerState.zoomed ? 3.5 : 5.8);
    controls.target.set(0, 0, 0);
    controls.update();
  }
  if (action === "labels") {
    if (viewerState.labels && viewerState.labelDensity === "all") viewerState.labelDensity = "key";
    else if (viewerState.labels && viewerState.labelDensity === "key") viewerState.labels = false;
    else {
      viewerState.labels = true;
      viewerState.labelDensity = "all";
    }
  }
  if (action === "isolate") {
    viewerState.isolated = !viewerState.isolated;
    setIsolation();
  }
  if (action === "reset") {
    viewerState.isolated = false;
    setIsolation();
    resetCamera();
  }
  syncViewerControls();
}

function updateLabels() {
  if (!labelLayer || !camera || !viewerState.loaded) return;
  labelLayer.innerHTML = "";
  labelLayer.classList.toggle("hidden", !viewerState.labels);
  if (!viewerState.labels) return;

  const bounds = viewerEl.getBoundingClientRect();
  const used = new Set();
  viewerState.organelles.forEach((item) => {
    if (!item.group.visible || used.has(item.baseKey)) return;
    if (
      viewerState.labelDensity !== "all" &&
      !viewerState.isolated &&
      item.baseKey !== viewerState.selectedKey &&
      !primaryLabelKeys.has(item.baseKey)
    ) {
      return;
    }
    used.add(item.baseKey);
    const position = new THREE.Vector3();
    item.group.getWorldPosition(position);
    position.add(item.labelOffset.clone().multiplyScalar(rootGroup.scale.x));
    position.project(camera);
    if (position.z < -1 || position.z > 1) return;

    const label = document.createElement("button");
    label.className = "model-label";
    label.type = "button";
    label.textContent = item.label;
    label.style.left = `${(position.x * 0.5 + 0.5) * bounds.width}px`;
    label.style.top = `${(-position.y * 0.5 + 0.5) * bounds.height}px`;
    label.classList.toggle("selected", item.baseKey === viewerState.selectedKey);
    label.addEventListener("click", () => setSelectedOrganelle(item));
    labelLayer.appendChild(label);
  });
}

function animate() {
  requestAnimationFrame(animate);
  controls?.update();
  if (renderer && scene && camera) renderer.render(scene, camera);
}

function renderMicroscope() {
  const slide = microscopeSlides[microscopeIndex];
  microStage.innerHTML = `
    <img src="${slide.image}" alt="${slide.title}" draggable="false" />
    <button class="micro-arrow micro-prev" type="button" data-micro-step="-1" aria-label="Previous microscope image">‹</button>
    <button class="micro-arrow micro-next" type="button" data-micro-step="1" aria-label="Next microscope image">›</button>
  `;
  microCopy.innerHTML = `
    <p class="eyebrow">actual microscope view ${String(microscopeIndex + 1).padStart(2, "0")} / ${String(microscopeSlides.length).padStart(2, "0")}</p>
    <h3>${slide.title}</h3>
    <p>${slide.note}</p>
    <div class="micro-tags">${slide.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
    <p>${slide.source}</p>
  `;
  microStage.querySelectorAll("[data-micro-step]").forEach((button) => {
    button.addEventListener("click", () => {
      stopFtue("page-microscope");
      microscopeIndex = (microscopeIndex + Number(button.dataset.microStep) + microscopeSlides.length) % microscopeSlides.length;
      renderMicroscope();
    });
  });
  microStage.querySelector("img")?.addEventListener("dragstart", (event) => event.preventDefault());
}

function renderVideos() {
  videoList.innerHTML = "";
  videos.forEach((video, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.videoId = video.id;
    button.innerHTML = `
      <img src="${video.thumb}" alt="" />
      <span>${String(index + 1).padStart(2, "0")}</span>
      <strong>${video.title}</strong>
    `;
    button.addEventListener("click", () => setVideo(video.id, true));
    videoList.appendChild(button);
  });
  setVideo(videos[0].id);
}

function setVideo(id, userInitiated = false) {
  if (userInitiated) stopFtue("page-video");
  const video = videos.find((item) => item.id === id) || videos[0];
  videoPlayer.src = `https://www.youtube.com/embed/${video.id}`;
  videoTitle.textContent = video.title;
  videoSubtitle.textContent = video.source;
  videoNotes.innerHTML = `<h3>Connected Notes</h3><p>${video.note}</p><p>Important labels become easier to remember when each structure is connected to its job in the living cell.</p>`;
  videoList.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.videoId === id);
  });
}

function renderFlashCards() {
  flashGrid.innerHTML = "";
  flashCards.forEach(([question, answer], index) => {
    const card = document.createElement("button");
    card.className = "flash-card";
    card.type = "button";
    card.innerHTML = `<span class="eyebrow">${String(index + 1).padStart(2, "0")}</span><strong>${question}</strong><em>${answer}</em>`;
    card.addEventListener("click", () => {
      stopFtue("page-flashcards");
      card.classList.toggle("revealed");
    });
    flashGrid.appendChild(card);
  });
}

function updateQuizStats() {
  const correct = [...quizScore.values()].filter(Boolean).length;
  scoreEl.textContent = `${correct} / ${quizCards.length}`;
  attemptsEl.textContent = String(attempts);
  const minutes = Math.floor(quizSeconds / 60);
  const seconds = quizSeconds % 60;
  timerEl.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  quizStatusEl.textContent = quizActive ? "running" : "paused";
}

function renderQuiz() {
  quizStack.innerHTML = "";
  quizScore = new Map();
  attempts = 0;
  quizSeconds = 300;
  quizCards.forEach((card, index) => {
    const node = document.createElement("article");
    node.className = "quiz-card";
    node.innerHTML = `<span class="eyebrow">${String(index + 1).padStart(2, "0")} ${card.type}</span><h3>${card.question}</h3>`;
    if (card.type === "MCQ") {
      const options = document.createElement("div");
      options.className = "quiz-options";
      card.options.forEach((option) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = option;
        button.addEventListener("click", () => {
          attempts += 1;
          const ok = option === card.answer;
          options.querySelectorAll("button").forEach((item) => item.classList.remove("correct", "wrong"));
          button.classList.add(ok ? "correct" : "wrong");
          quizScore.set(index, ok);
          updateQuizStats();
        });
        options.appendChild(button);
      });
      node.appendChild(options);
    } else {
      const row = document.createElement("label");
      row.className = "fib-row";
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "write answer";
      const submit = document.createElement("button");
      submit.type = "button";
      submit.textContent = "check";
      submit.addEventListener("click", () => {
        attempts += 1;
        const ok = input.value.trim().toLowerCase() === card.answer.toLowerCase();
        input.classList.toggle("correct", ok);
        quizScore.set(index, ok);
        updateQuizStats();
      });
      row.append(input, submit);
      node.appendChild(row);
    }
    quizStack.appendChild(node);
  });
  updateQuizStats();
}

function setQuizActive(active) {
  quizActive = Boolean(active && quizStarted);
  clearInterval(quizTimerId);
  if (quizActive) {
    quizTimerId = setInterval(() => {
      if (quizSeconds > 0) quizSeconds -= 1;
      updateQuizStats();
    }, 1000);
  }
  updateQuizStats();
}

function startQuiz() {
  stopFtue("page-quiz");
  quizStarted = true;
  quizPanel.classList.remove("locked");
  setQuizActive(quizInView);
}

function resetQuiz() {
  quizStarted = false;
  quizActive = false;
  clearInterval(quizTimerId);
  quizPanel.classList.add("locked");
  document.querySelector("#page-quiz")?.classList.add("ftue-active");
  renderQuiz();
  updateQuizStats();
}

function renderPeople() {
  peopleGrid.innerHTML = "";
  people.forEach((person, index) => {
    const button = document.createElement("button");
    button.className = "person-card";
    button.type = "button";
    button.dataset.personIndex = String(index);
    button.innerHTML = `<span class="person-thumb">${person.initials}</span><span>${person.group}</span><strong>${person.name}</strong><p>${person.role}</p>`;
    button.addEventListener("click", () => setPerson(index));
    peopleGrid.appendChild(button);
  });
  setPerson(0);
}

function setPerson(index) {
  const person = people[index];
  personName.textContent = person.name;
  personRole.textContent = person.role;
  personDetail.innerHTML = `<h3>${person.group} contribution</h3><p>${person.detail}</p>`;
  peopleGrid.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.personIndex === String(index));
  });
}

document.querySelectorAll("[data-select-organelle]").forEach((button) => {
  button.addEventListener("click", () => selectOrganelleByKey(button.dataset.selectOrganelle));
});

viewerActions.forEach((button) => {
  button.addEventListener("click", () => {
    stopFtue("page-immersive");
    handleViewerAction(button.dataset.viewerAction);
  });
});

resetQuizButton.addEventListener("click", resetQuiz);
startQuizButton.addEventListener("click", startQuiz);

new IntersectionObserver(
  ([entry]) => {
    quizInView = entry.isIntersecting && entry.intersectionRatio > 0.55;
    setQuizActive(quizInView);
  },
  { threshold: [0, 0.55, 1] },
).observe(document.querySelector("#page-quiz"));

const pageObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const id = visible.target.id;
    pageIconTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.pageTarget === id);
    });
  },
  { root: document.querySelector("#booklet"), threshold: [0.35, 0.6, 0.85] },
);

document.querySelectorAll(".booklet-page").forEach((page) => pageObserver.observe(page));

renderDetail("nucleus");
initScene();
animate();
loadPlantCell().catch((error) => {
  console.error(error);
  viewerStatus.textContent = "model failed to load";
});
renderMicroscope();
renderVideos();
renderFlashCards();
renderQuiz();
renderPeople();
