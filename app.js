import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const artifactTriggers = document.querySelectorAll("[data-artifact]");
const artifactTabs = document.querySelectorAll(".artifact-tab");
const artifactCards = document.querySelectorAll("[data-artifact-card]");
const contentTabs = document.querySelectorAll("[data-panel]");
const panelSections = document.querySelectorAll(".panel-section");
const highlightSelectors = document.querySelectorAll("[data-select-organelle]");
const pageSteps = document.querySelectorAll(".page-step");
const workspaceTitle = document.querySelector("#workspace-title");
const notesTitle = document.querySelector("[data-notes-title]");
const responseHint = document.querySelector("[data-response-hint]");
const viewerActions = document.querySelectorAll("[data-viewer-action]");
const detailTitle = document.querySelector("[data-detail-title]");
const detailBody = document.querySelector("[data-detail-body]");
const detailList = document.querySelector("[data-detail-list]");
const quizStack = document.querySelector("[data-quiz-stack]");
const flipGallery = document.querySelector("[data-flip-gallery]");
const scoreOutput = document.querySelector("[data-score-output]");
const scientistStack = document.querySelector("[data-scientist-stack]");
const visualPage = document.querySelector(".visual-page");
const microscopeGallery = document.querySelector("[data-microscope-gallery]");
const watchGallery = document.querySelector("[data-watch-gallery]");
const videoFrame = document.querySelector("[data-video-frame]");
const videoList = document.querySelector("[data-video-list]");
const videoNote = document.querySelector("[data-video-note]");

const viewerEl = document.querySelector("#cell-viewer");
const labelLayer = document.querySelector("[data-label-layer]");
const viewerStatus = document.querySelector("[data-viewer-status]");

const organelleNotes = {
  "cell-wall": {
    title: "Cell Wall Notes",
    hint: "The cell wall is the firm outer boundary that helps a plant cell keep its shape.",
    name: "Cell Wall",
    body: "The cell wall is a stiff outer covering found outside the cell membrane. In plants, it is mainly made of cellulose. It gives the cell a fixed shape, protects the softer parts inside, and helps the plant stand upright.",
    fields: {
      Factoid: "Plant cells have a cell wall; animal cells do not.",
      Composition: "Mostly cellulose, a strong natural fibre.",
      "Sub-parts": "Cellulose fibres, middle lamella between neighbouring cells, and tiny channels called plasmodesmata.",
      "Special fact": "The middle lamella acts like a natural glue that helps neighbouring plant cells stay connected.",
      "Did you know": "The crispness of fresh vegetables is partly because plant cells stay firm.",
    },
  },
  "cell-membrane": {
    title: "Cell Membrane Notes",
    hint: "The cell membrane controls what enters and leaves the cell.",
    name: "Cell Membrane",
    body: "The cell membrane is a thin living boundary around the cell. It is selectively permeable, which means it allows some substances to pass through while stopping others.",
    fields: {
      Factoid: "It separates the cell from its surroundings and controls exchange.",
      Composition: "Mainly lipids and proteins.",
      "Sub-parts": "Phospholipid bilayer, transport proteins, receptor proteins, and carbohydrate markers.",
      "Special fact": "Some membrane proteins act like selective doors or pumps for particular substances.",
      "Did you know": "It behaves more like a careful gatekeeper than a solid wall.",
    },
  },
  vacuole: {
    title: "Vacuole Notes",
    hint: "The vacuole stores water and helps the cell stay firm.",
    name: "Central Vacuole",
    body: "A plant cell usually has a large central vacuole filled with cell sap. It stores water, dissolved substances, and waste materials. When full, it presses outward and helps the cell remain firm.",
    fields: {
      Factoid: "Plant cells often have larger vacuoles than animal cells.",
      Contents: "Cell sap: water, salts, sugars, and other dissolved materials.",
      "Sub-parts": "Cell sap and the vacuole membrane, called the tonoplast.",
      "Special fact": "A full vacuole creates turgor pressure, which helps the cell press firmly against its wall.",
      "Did you know": "A full vacuole helps leaves and stems stay crisp.",
    },
  },
  nucleus: {
    title: "Nucleus Notes",
    hint: "The nucleus stores instructions and helps direct cell activities.",
    name: "Nucleus",
    body: "The nucleus is usually called the control centre of the cell. It contains chromosomes, which carry genetic information. This information helps decide how the cell grows, repairs itself, and makes new cells.",
    fields: {
      Factoid: "The nucleus controls cell activities and contains genetic material.",
      Inside: "Chromosomes, nucleoplasm, and often a nucleolus.",
      "Sub-parts": "Nuclear membrane, nuclear pores, chromosomes, nucleoplasm, and nucleolus.",
      "Special fact": "The nucleolus helps make ribosome parts, linking the nucleus to protein production.",
      "Did you know": "It is like the instruction notebook of the cell.",
    },
  },
  chloroplast: {
    title: "Chloroplast Notes",
    hint: "Chloroplasts use sunlight to help plants make food.",
    name: "Chloroplast",
    body: "Chloroplasts are green plastids found in many plant cells. They contain chlorophyll, a green pigment that captures light energy for photosynthesis. This is how green plants make food.",
    fields: {
      Factoid: "Chlorophyll in chloroplasts helps plants prepare food.",
      Process: "Photosynthesis: carbon dioxide + water + sunlight makes glucose and oxygen.",
      "Sub-parts": "Outer membrane, inner membrane, stroma, thylakoids, and grana.",
      "Special fact": "Thylakoids are stacked in grana, where light energy is captured.",
      "Did you know": "Chlorophyll gives many leaves their green colour.",
    },
  },
  mitochondrion: {
    title: "Mitochondrion Notes",
    hint: "Mitochondria release usable energy from food.",
    name: "Mitochondrion",
    body: "Mitochondria are small organelles where food is broken down to release energy. Cells use this energy for growth, repair, movement of materials, and other life processes.",
    fields: {
      Factoid: "Mitochondria are often called the powerhouse of the cell.",
      Process: "Cellular respiration releases energy from food.",
      "Sub-parts": "Outer membrane, inner membrane, cristae, and matrix.",
      "Special fact": "Cristae are folds that increase surface area for energy-releasing reactions.",
      "Did you know": "Both plant and animal cells have mitochondria.",
    },
  },
  golgi: {
    title: "Golgi Notes",
    hint: "The Golgi apparatus packages and sends materials around the cell.",
    name: "Golgi Apparatus",
    body: "The Golgi apparatus modifies, packs, and sends substances made inside the cell. You can think of it as a packing and delivery counter.",
    fields: {
      Factoid: "Cells have organelles that perform special jobs.",
      Job: "Packaging and transport of materials.",
      "Sub-parts": "Flattened sacs called cisternae and small transport vesicles.",
      "Special fact": "Golgi bodies can add chemical tags that help send materials to the correct destination.",
      "Did you know": "Golgi can be remembered as a goods counter.",
    },
  },
  "rough-er": {
    title: "Rough ER Notes",
    hint: "Rough ER helps build and move proteins.",
    name: "Rough ER",
    body: "Rough endoplasmic reticulum has ribosomes attached to it, which makes it look rough. It helps make and move proteins inside the cell.",
    fields: {
      Factoid: "Cell parts work together to make and transport materials.",
      Surface: "Ribosomes attached.",
      Job: "Protein making and transport.",
      "Sub-parts": "Folded membrane channels and attached ribosomes.",
      "Special fact": "Proteins made on rough ER often move next to the Golgi apparatus for packaging.",
    },
  },
  "smooth-er": {
    title: "Smooth ER Notes",
    hint: "Smooth ER helps make lipids and move materials.",
    name: "Smooth ER",
    body: "Smooth endoplasmic reticulum does not have ribosomes on its surface. It helps make lipids and move materials through the cell.",
    fields: {
      Surface: "No ribosomes attached.",
      Job: "Lipid making and transport.",
      "Sub-parts": "Smooth membrane tubules connected to the wider ER network.",
      "Special fact": "Cells that make many lipids usually contain more smooth ER.",
      Compare: "Rough ER has ribosomes; smooth ER does not.",
    },
  },
  peroxisome: {
    title: "Peroxisome Notes",
    hint: "Peroxisomes help break down some chemicals inside cells.",
    name: "Peroxisome",
    body: "Peroxisomes are small organelles that help break down certain harmful substances. They are not always introduced in early school diagrams, but they show that cells have many specialised workers.",
    fields: {
      Job: "Breaks down some chemicals.",
      "Sub-parts": "Single membrane and enzyme-rich interior.",
      "Special fact": "Peroxisomes can make hydrogen peroxide during reactions and then quickly break it down.",
      Level: "Extra detail beyond the basic middle-school diagram.",
    },
  },
  ribosome: {
    title: "Ribosome Notes",
    hint: "Ribosomes are tiny protein builders.",
    name: "Ribosome",
    body: "Ribosomes are very small structures that help make proteins. Proteins are needed for growth, repair, and many cell activities.",
    fields: {
      Job: "Protein synthesis.",
      Location: "Free in cytoplasm or attached to rough ER.",
      "Sub-parts": "Large and small ribosomal subunits.",
      "Special fact": "Ribosomes are not surrounded by a membrane, unlike many organelles.",
      "Memory hook": "Ribosomes build proteins.",
    },
  },
};

const quizCards = [
  {
    type: "MCQ",
    tag: "organelles",
    question: "Which organelle helps a plant cell make food using sunlight?",
    options: ["Chloroplast", "Vacuole", "Cell Wall", "Nucleus"],
    answer: "Chloroplast",
  },
  {
    type: "MCQ",
    tag: "composition",
    question: "The plant cell wall is mainly made of which material?",
    options: ["Cellulose", "Starch", "Protein", "Oil"],
    answer: "Cellulose",
  },
  {
    type: "FIB",
    tag: "organelles",
    question: "The large storage space in a plant cell is the ____.",
    answer: "vacuole",
  },
  {
    type: "MCQ",
    tag: "function",
    question: "Which part is often called the control centre of the cell?",
    options: ["Nucleus", "Ribosome", "Golgi apparatus", "Cell membrane"],
    answer: "Nucleus",
  },
  {
    type: "FIB",
    tag: "process",
    question: "Photosynthesis uses sunlight, water, and carbon dioxide to make ____.",
    answer: "glucose",
  },
  {
    type: "MCQ",
    tag: "function",
    question: "Which part controls what enters and leaves the cell?",
    options: ["Cell membrane", "Cell wall", "Vacuole", "Chloroplast"],
    answer: "Cell membrane",
  },
  {
    type: "MCQ",
    tag: "energy",
    question: "Which organelle releases usable energy from food?",
    options: ["Mitochondrion", "Chloroplast", "Nucleolus", "Cell wall"],
    answer: "Mitochondrion",
  },
  {
    type: "FIB",
    tag: "labels",
    question: "Ribosomes help make ____ for the cell.",
    answer: "proteins",
  },
  {
    type: "MCQ",
    tag: "comparison",
    question: "Which pair is especially useful for identifying many plant cells?",
    options: ["Cell wall and chloroplasts", "Arteries and veins", "Trachea and bronchi", "Ureters and urethra"],
    answer: "Cell wall and chloroplasts",
  },
  {
    type: "MCQ",
    tag: "transport",
    question: "What does the Golgi apparatus mainly do?",
    options: ["Packages and sends materials", "Stores urine", "Moves air", "Pumps blood"],
    answer: "Packages and sends materials",
  },
  {
    type: "FIB",
    tag: "structure",
    question: "Rough ER looks rough because ____ are attached to it.",
    answer: "ribosomes",
  },
  {
    type: "MCQ",
    tag: "photosynthesis",
    question: "Which organelle contains chlorophyll?",
    options: ["Chloroplast", "Mitochondrion", "Golgi apparatus", "Cell membrane"],
    answer: "Chloroplast",
  },
  {
    type: "MCQ",
    tag: "vacuole",
    question: "A full central vacuole helps a plant cell stay:",
    options: ["Firm", "Boneless", "Air-filled", "Colourless"],
    answer: "Firm",
  },
  {
    type: "FIB",
    tag: "boundary",
    question: "The thin living boundary just inside the cell wall is the cell ____.",
    answer: "membrane",
  },
];

const flipCards = [
  {
    tag: "comparison",
    question: "Which two parts are especially useful for telling a plant cell from an animal cell?",
    answer: "Cell wall and chloroplasts. Plant cells also often have a large central vacuole.",
  },
  {
    tag: "memory",
    question: "Why does a full vacuole help a plant look fresh?",
    answer: "It presses outward and helps cells stay firm, a condition called turgidity.",
  },
  {
    tag: "process",
    question: "Why do chloroplasts matter so much to life on Earth?",
    answer: "They help plants make food and release oxygen during photosynthesis.",
  },
  {
    tag: "analogy",
    question: "If the cell were a school, what would the nucleus be?",
    answer: "The principal's office or instruction room, because it stores information and directs activities.",
  },
  {
    tag: "boundary",
    question: "How are the cell wall and cell membrane different?",
    answer: "The cell wall is a firm outer support. The cell membrane is a living boundary that controls movement in and out.",
  },
  {
    tag: "energy",
    question: "Why do plant cells need mitochondria if they already have chloroplasts?",
    answer: "Chloroplasts make glucose using light. Mitochondria release usable energy from glucose for cell work.",
  },
  {
    tag: "microscope",
    question: "Why might onion cells show clear cell walls but few green chloroplasts?",
    answer: "Onion bulb cells grow underground and usually do not photosynthesise like green leaf cells.",
  },
  {
    tag: "transport",
    question: "What do rough ER and Golgi apparatus have in common?",
    answer: "Both help with materials made inside the cell. Rough ER helps make and move proteins; Golgi modifies and packages them.",
  },
  {
    tag: "detail",
    question: "What is the nucleolus?",
    answer: "It is a darker body inside the nucleus that helps make ribosome parts.",
  },
];

const scientistSections = [
  {
    title: "Discovery of Cells",
    items: [
      {
        name: "Robert Hooke",
        contribution: "In 1665, he looked at thin cork slices and used the word cell for the small box-like spaces he saw. He was mostly seeing dead cell walls, but the word became central to biology.",
      },
      {
        name: "Antonie van Leeuwenhoek",
        contribution: "Improved simple microscopes and observed living microscopic organisms, sperm cells, and blood cells, showing that the hidden microscopic world was full of life.",
      },
      {
        name: "Matthias Schleiden",
        contribution: "Proposed that plants are made of cells, helping biology explain leaves, stems, and roots through the smaller units inside them.",
      },
      {
        name: "Theodor Schwann",
        contribution: "Extended the idea to animals, helping form cell theory: plants and animals share cells as a basic unit of structure.",
      },
      {
        name: "Rudolf Virchow",
        contribution: "Popularised the idea that new cells arise from pre-existing cells, connecting growth and repair with cell division.",
      },
    ],
  },
  {
    title: "Contributions from India",
    items: [
      {
        name: "J. C. Bose",
        contribution: "Designed sensitive instruments to study plant responses to light, heat, touch, and chemicals. His work showed that plants are active living systems.",
      },
      {
        name: "Panchanan Maheshwari",
        contribution: "Made major contributions to plant embryology and tissue culture in India, connecting cell growth with the development of whole plants.",
      },
      {
        name: "Birbal Sahni",
        contribution: "Studied fossil plants and helped build palaeobotany in India, connecting plant life today with plant history.",
      },
      {
        name: "Vrikshayurveda tradition",
        contribution: "Ancient Indian plant-care knowledge that records careful observation of plant growth, soil, water, seasons, and care.",
      },
    ],
  },
];

const videoLessons = [
  {
    id: "EaRowyAq9o4",
    title: "Introduction to the World of Cells",
    source: "BYJU'S",
    level: "Class 6-10",
    transcriptStatus: "English auto-caption track detected; direct timedtext pull needs review.",
    notes: [
      "Cells are introduced as the basic units that make up living organisms.",
      "The lesson connects cell parts with everyday functions like taking in food, releasing energy, and removing waste.",
      "Every visible part has a job, and the 3D cell model makes those jobs easier to connect.",
    ],
  },
  {
    id: "WqwOlOZ7eKo",
    title: "Cell Structure and its Function",
    source: "BYJU'S",
    level: "Middle-school bridge",
    transcriptStatus: "English auto-caption track detected; direct timedtext pull needs review.",
    notes: [
      "Focuses on how cell structures are linked to their functions.",
      "Useful alongside the highlighted notebook terms: cell membrane, nucleus, vacuole, chloroplast, and cell wall.",
      "Pause after each organelle and ask: what does this part do for the whole cell?",
    ],
  },
  {
    id: "zCXXMRY4eTs",
    title: "The Discovery of Cell",
    source: "BYJU'S NEET",
    level: "Advanced reference",
    transcriptStatus: "English auto-caption track detected; direct timedtext pull needs review.",
    notes: [
      "Covers the historical discovery of cells and the growth of cell theory.",
      "Useful for the Scientists tab: Hooke, Leeuwenhoek, Schleiden, Schwann, and Virchow.",
      "For middle school, treat this as an optional history clip rather than the main explainer.",
    ],
  },
];

const microscopeSlides = [
  {
    title: "Elodea / Anacharis leaf cells",
    image: "./assets/microscope/anacharis-chloroplasts.jpg",
    source: "Wikimedia Commons: Anacharis Magnified, Lilyviolet, CC BY 4.0",
    note: "Green dots are chloroplasts inside rectangular plant cells.",
    labels: [
      { text: "cell wall", x: 18, y: 24, tone: "green" },
      { text: "chloroplasts", x: 58, y: 38, tone: "yellow" },
    ],
  },
  {
    title: "Onion epidermis cells",
    image: "./assets/microscope/onion-epidermis.jpg",
    source: "Wikimedia Commons: Onion Epidermis Cells W.M. 40x - 132, loganrickert, CC BY 2.0",
    note: "Onion cells show clear box-like cell walls; they do not show green chloroplasts.",
    labels: [
      { text: "cell wall grid", x: 28, y: 28, tone: "blue" },
      { text: "cell space", x: 62, y: 66, tone: "red" },
    ],
  },
  {
    title: "Guard cells around a stoma",
    image: "./assets/microscope/guard-cells.png",
    source: "Wikimedia Commons: Plant stoma guard cells, Alex Costa, CC BY 2.5",
    note: "Guard cells open and close tiny pores that help leaves exchange gases.",
    labels: [
      { text: "stoma opening", x: 49, y: 47, tone: "blue" },
      { text: "guard cell", x: 22, y: 32, tone: "green" },
    ],
  },
  {
    title: "Tradescantia / Zebrina stomata",
    image: "./assets/microscope/zebrina-stomata.jpeg",
    source: "Wikimedia Commons: Zebrina stomata, AioftheStorm, CC0",
    note: "A leaf surface is made of many cells, with stomata placed like adjustable doorways.",
    labels: [
      { text: "epidermal cells", x: 20, y: 58, tone: "green" },
      { text: "stoma", x: 61, y: 36, tone: "red" },
    ],
  },
  {
    title: "Onion root tip mitosis",
    image: "./assets/microscope/onion-root-mitosis.jpg",
    source: "Wikimedia Commons: Onion Root Tip Cells Mitosis, Catfaster, CC BY-SA 4.0",
    note: "Root tips show cells dividing, which helps the plant grow.",
    labels: [
      { text: "dividing cell", x: 34, y: 46, tone: "red" },
      { text: "nucleus area", x: 63, y: 26, tone: "blue" },
    ],
  },
  {
    title: "Spirogyra under microscope",
    image: "./assets/microscope/spirogyra.jpg",
    source: "Wikimedia Commons: Spirogyra algae under microscope, Stefan Thiesen, CC BY-SA 3.0",
    note: "Spirogyra has spiral chloroplasts, a memorable real-life shape for green cells.",
    labels: [
      { text: "spiral chloroplast", x: 51, y: 40, tone: "yellow" },
      { text: "cell wall", x: 27, y: 69, tone: "green" },
    ],
  },
  {
    title: "Leaf epithelium with stomata",
    image: "./assets/microscope/leaf-epithelium-stomata.jpg",
    source: "Wikimedia Commons: Leaf epithelium, stomata, Emilio Ermini, CC BY 4.0",
    note: "A broader leaf-surface view shows how many cells form a living tissue.",
    labels: [
      { text: "leaf cells", x: 28, y: 34, tone: "green" },
      { text: "stomata", x: 64, y: 62, tone: "blue" },
    ],
  },
];

let microscopeIndex = 0;

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

const primaryLabelKeys = new Set(["cell-wall", "cell-membrane", "nucleus", "vacuole", "chloroplast"]);

const artifactCopy = {
  cell3d: {
    title: "Explore the Cell",
    notes: "Nucleus Notes",
    hint: "This page enriches the 3D cell explorer on the left.",
  },
  applet: {
    title: "Under the Microscope",
    notes: "Microscope Notes",
    hint: "Real plant cell views sit on the left; use the tags to connect them back to the diagram.",
  },
  watch: {
    title: "Watch the Cell",
    notes: "Watch Notes",
    hint: "Video can play on the left while notes, quiz, or facts stay here.",
  },
};

const viewerState = {
  loaded: false,
  artifact: "cell3d",
  playing: true,
  autoRotate: true,
  labels: true,
  labelDensity: "all",
  isolated: false,
  zoomed: false,
  selectedId: "nucleus",
  selectedKey: "nucleus",
  visible: new Map(),
  organelles: [],
};

let scene;
let camera;
let renderer;
let controls;
let rootGroup;
let raycaster;
let pointer;
let loader;
let resizeObserver;
let pointerStart = null;

function setArtifact(artifact) {
  const copy = artifactCopy[artifact] || artifactCopy.cell3d;
  viewerState.artifact = artifact;
  if (visualPage) {
    visualPage.dataset.activeArtifact = artifact;
  }

  artifactTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.artifact === artifact);
  });

  artifactCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.artifactCard === artifact);
  });

  workspaceTitle.textContent = copy.title;
  notesTitle.textContent = copy.notes;
  responseHint.textContent = copy.hint;

  if (artifact === "cell3d") {
    viewerState.labels = true;
    syncViewerControls();
  }
  updateLabels();
}

function setActiveVideo(videoId) {
  const lesson = videoLessons.find((video) => video.id === videoId) || videoLessons[0];
  if (!lesson) return;

  if (videoFrame) {
    videoFrame.src = `https://www.youtube.com/embed/${lesson.id}`;
    videoFrame.title = lesson.title;
  }

  if (videoList) {
    videoList.querySelectorAll("[data-video-id]").forEach((button) => {
      button.classList.toggle("active", button.dataset.videoId === lesson.id);
    });
  }

  if (videoNote) {
    videoNote.innerHTML = `
      <p class="section-label">transcript notes</p>
      <h3>${lesson.title}</h3>
      <p><strong>${lesson.source}</strong> · ${lesson.level}</p>
      <ul>
        ${lesson.notes.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <p class="transcript-status">${lesson.transcriptStatus}</p>
    `;
  }
}

function renderWatchGallery() {
  if (!videoList) return;
  videoList.innerHTML = "";

  videoLessons.forEach((lesson, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "video-thumb";
    button.dataset.videoId = lesson.id;
    button.innerHTML = `
      <img src="https://i.ytimg.com/vi/${lesson.id}/hqdefault.jpg" alt="" />
      <span>${String(index + 1).padStart(2, "0")}</span>
      <strong>${lesson.title}</strong>
      <em>${lesson.source}</em>
    `;
    button.addEventListener("click", () => setActiveVideo(lesson.id));
    videoList.appendChild(button);
  });

  setActiveVideo(videoLessons[0]?.id);
}

function renderMicroscopeGallery() {
  if (!microscopeGallery) return;
  const slide = microscopeSlides[microscopeIndex];
  if (!slide) return;

  microscopeGallery.innerHTML = `
    <article class="micro-stage">
      <img src="${slide.image}" alt="${slide.title}" />
      <button class="micro-arrow micro-prev" type="button" data-micro-step="-1" aria-label="Previous microscope image">‹</button>
      <button class="micro-arrow micro-next" type="button" data-micro-step="1" aria-label="Next microscope image">›</button>
      <div class="micro-copy">
        <p class="section-label">actual microscope view ${String(microscopeIndex + 1).padStart(2, "0")} / ${String(microscopeSlides.length).padStart(2, "0")}</p>
        <h3>${slide.title}</h3>
        <p>${slide.note}</p>
        <div class="micro-tags">
          ${slide.labels.map((label) => `<span class="${label.tone}">${label.text}</span>`).join("")}
        </div>
        <small>${slide.source}</small>
      </div>
    </article>
  `;

  microscopeGallery.querySelectorAll("[data-micro-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const step = Number(button.dataset.microStep);
      microscopeIndex = (microscopeIndex + step + microscopeSlides.length) % microscopeSlides.length;
      renderMicroscopeGallery();
    });
  });
}

function setRightPanel(panelId) {
  contentTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.panel === panelId);
  });

  panelSections.forEach((panel) => {
    panel.classList.toggle("active-panel", panel.id === panelId);
  });
}

function getBaseKey(id) {
  return id.replace(/-\d+$/, "");
}

function setSelectedOrganelle(organelle) {
  const shouldRefreshIsolation = viewerState.isolated && viewerState.selectedKey !== organelle.baseKey;
  if (shouldRefreshIsolation) {
    viewerState.isolated = false;
    setVisibilityForIsolation();
  }
  viewerState.selectedId = organelle.id;
  viewerState.selectedKey = organelle.baseKey;
  if (shouldRefreshIsolation) viewerState.isolated = true;

  viewerState.organelles.forEach((item) => {
    const selected = item.baseKey === organelle.baseKey;
    item.group.userData.selected = selected;
    item.group.traverse((child) => {
      if (child.isLineSegments) {
        child.material.color.set(selected ? 0xb1443d : 0x49638f);
        child.material.opacity = selected ? 0.58 : 0.2;
      }
    });
  });

  const note = organelleNotes[organelle.baseKey] || {
    title: `${organelle.label} Notes`,
    hint: `${organelle.label} is selected in the explorer.`,
  };
  notesTitle.textContent = note.title;
  responseHint.textContent = note.hint;
  renderDetail(organelle.baseKey);
  setRightPanel("notes-panel");
  setVisibilityForIsolation();
  syncViewerControls();
}

function selectOrganelleByKey(key, options = {}) {
  const organelle = viewerState.organelles.find((item) => item.baseKey === key);
  const note = organelleNotes[key];
  if (organelle) {
    setSelectedOrganelle(organelle);
  } else if (note) {
    notesTitle.textContent = note.title;
    responseHint.textContent = note.hint;
    renderDetail(key);
    setRightPanel("notes-panel");
  }

  void options;
}

function renderDetail(key) {
  const note = organelleNotes[key];
  if (!note || !detailTitle || !detailBody || !detailList) return;

  detailTitle.textContent = note.name || note.title.replace(" Notes", "");
  detailBody.textContent = note.body || note.hint;
  detailList.innerHTML = "";

  Object.entries(note.fields || {}).forEach(([term, value]) => {
    const wrapper = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = term;
    dd.textContent = value;
    wrapper.append(dt, dd);
    detailList.appendChild(wrapper);
  });
}

function renderQuiz() {
  if (!quizStack) return;
  quizStack.innerHTML = "";
  const scoreState = new Map();
  const updateScore = () => {
    const correct = [...scoreState.values()].filter(Boolean).length;
    if (scoreOutput) scoreOutput.value = `${correct} / ${quizCards.length}`;
  };
  updateScore();

  quizCards.forEach((card, index) => {
    const article = document.createElement("article");
    article.className = `quiz-card quiz-card-${card.type.toLowerCase()}`;
    article.dataset.quizType = card.type;
    article.dataset.topicTag = card.tag;

    const meta = document.createElement("div");
    meta.className = "quiz-meta";
    meta.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><span>${card.type}</span><span>${card.tag}</span>`;

    const question = document.createElement("h3");
    question.textContent = card.question;

    article.append(meta, question);

    if (card.type === "MCQ") {
      const options = document.createElement("div");
      options.className = "quiz-options";
      card.options.forEach((option) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = option;
        button.addEventListener("click", () => {
          const ok = option === card.answer;
          options.querySelectorAll("button").forEach((item) => item.classList.remove("selected", "correct", "wrong"));
          button.classList.add("selected", ok ? "correct" : "wrong");
          scoreState.set(index, ok);
          updateScore();
          feedback.textContent = ok ? "Correct." : `Try again. Hint: ${card.answer}.`;
        });
        options.appendChild(button);
      });
      article.appendChild(options);
    }

    if (card.type === "FIB") {
      const fib = document.createElement("label");
      fib.className = "fib-row";
      fib.innerHTML = `<span>Answer</span>`;
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "write here";
      input.addEventListener("input", () => {
        input.classList.remove("correct");
      });
      const submit = document.createElement("button");
      submit.className = "fib-submit";
      submit.type = "button";
      submit.textContent = "check";
      submit.addEventListener("click", () => {
        const ok = input.value.trim().toLowerCase() === card.answer.toLowerCase();
        input.classList.toggle("correct", ok);
        scoreState.set(index, ok);
        updateScore();
        feedback.textContent = ok ? "Correct." : "Fill the blank from the notebook clue.";
      });
      fib.appendChild(input);
      fib.appendChild(submit);
      article.appendChild(fib);
    }

    const feedback = document.createElement("p");
    feedback.className = "quiz-feedback";
    feedback.textContent = " ";
    article.appendChild(feedback);
    quizStack.appendChild(article);
  });
}

function renderFlipCards() {
  if (!flipGallery) return;
  flipGallery.innerHTML = "";

  flipCards.forEach((card) => {
    const flip = document.createElement("button");
    flip.className = "flip-study-card";
    flip.type = "button";
    flip.dataset.topicTag = card.tag;
    flip.innerHTML = `
      <span>${card.tag}</span>
      <strong>${card.question}</strong>
      <em>${card.answer}</em>
    `;
    flip.addEventListener("click", () => {
      flip.classList.toggle("revealed");
    });
    flipGallery.appendChild(flip);
  });
}

function renderScientists() {
  if (!scientistStack) return;
  scientistStack.innerHTML = "";

  scientistSections.forEach((section) => {
    const card = document.createElement("article");
    card.className = "note-card scientist-card";
    const heading = document.createElement("h3");
    heading.textContent = section.title;
    const list = document.createElement("div");
    list.className = "scientist-list";
    section.items.forEach((item) => {
      const row = document.createElement("section");
      row.innerHTML = `<h4>${item.name}</h4><p>${item.contribution}</p>`;
      list.appendChild(row);
    });
    card.append(heading, list);
    scientistStack.appendChild(card);
  });
}

function setVisibilityForIsolation() {
  viewerState.organelles.forEach((item) => {
    const focused = item.baseKey === viewerState.selectedKey;
    const focusEnabled = viewerState.isolated;
    const shouldShow = !viewerState.isolated || item.baseKey === viewerState.selectedKey;
    item.group.visible = shouldShow && viewerState.visible.get(item.id) !== false;
    if (item.baseScale) {
      item.group.scale.copy(item.baseScale).multiplyScalar(focusEnabled && focused ? 1.055 : 1);
    }
    item.group.traverse((child) => {
      if (child.isMesh && child.material) applyMeshFocus(child, focused, focusEnabled);
    });
  });
  updateLabels();
}

function resetCamera() {
  viewerState.zoomed = false;
  camera.position.set(0, 0, 5.8);
  controls.target.set(0, 0, 0);
  controls.update();
}

function toggleZoom() {
  viewerState.zoomed = !viewerState.zoomed;
  const distance = viewerState.zoomed ? 3.5 : 5.8;
  camera.position.set(0, 0, distance);
  controls.target.set(0, 0, 0);
  controls.update();
}

function syncViewerControls() {
  viewerActions.forEach((button) => {
    const action = button.dataset.viewerAction;
    const active =
      (action === "play" && viewerState.playing) ||
      (action === "rotate" && viewerState.autoRotate) ||
      (action === "label-density" && viewerState.labels) ||
      (action === "zoom" && viewerState.zoomed) ||
      (action === "isolate" && viewerState.isolated);
    button.classList.toggle("active", active);
    if (action === "play") button.textContent = viewerState.playing ? "pause" : "play";
    if (action === "zoom") button.textContent = viewerState.zoomed ? "zoom out" : "zoom";
    if (action === "label-density") {
      button.textContent = !viewerState.labels
        ? "labels off"
        : viewerState.labelDensity === "all"
          ? "all labels"
          : "key labels";
    }
  });
  if (controls) controls.autoRotate = viewerState.playing && viewerState.autoRotate;
  updateLabels();
}

function onViewerAction(action) {
  if (!viewerState.loaded && action !== "reset") return;

  if (action === "play") {
    viewerState.playing = !viewerState.playing;
  }

  if (action === "rotate") {
    viewerState.autoRotate = !viewerState.autoRotate;
  }

  if (action === "label-density") {
    if (viewerState.labels && viewerState.labelDensity === "all") {
      viewerState.labelDensity = "key";
    } else if (viewerState.labels && viewerState.labelDensity === "key") {
      viewerState.labels = false;
      viewerState.labelDensity = "key";
    } else {
      viewerState.labels = true;
      viewerState.labelDensity = "all";
    }
  }

  if (action === "isolate") {
    viewerState.isolated = !viewerState.isolated;
    setVisibilityForIsolation();
  }

  if (action === "zoom") {
    toggleZoom();
  }

  if (action === "reset") {
    viewerState.isolated = false;
    setVisibilityForIsolation();
    resetCamera();
  }

  syncViewerControls();
}

function makeSketchMaterial(sourceMaterial, fallbackColor) {
  const sourceColor = sourceMaterial?.color || new THREE.Color(fallbackColor);
  const paperMixed = sourceColor.clone().lerp(new THREE.Color(0xfffaf0), 0.38);
  return new THREE.MeshToonMaterial({
    color: paperMixed,
    transparent: sourceMaterial?.transparent || sourceMaterial?.opacity < 1,
    opacity: Math.min(sourceMaterial?.opacity ?? 0.82, 0.82),
  });
}

function addSketchOutlines(group) {
  const meshes = [];
  group.traverse((child) => {
    if (child.isMesh) meshes.push(child);
  });

  meshes.forEach((child) => {
    const originalOpacity = child.material?.opacity ?? 1;
    child.material = makeSketchMaterial(child.material, child.material?.color || 0x88aa66);
    child.castShadow = true;
    child.receiveShadow = true;

    const outlineShell = new THREE.Mesh(
      child.geometry,
      new THREE.MeshBasicMaterial({
        color: 0x49638f,
        side: THREE.BackSide,
        transparent: true,
        opacity: originalOpacity < 0.5 ? 0.08 : 0.13,
        depthWrite: false,
      }),
    );
    outlineShell.name = `${child.name || "mesh"} notebook outline shell`;
    outlineShell.scale.setScalar(1.035);
    outlineShell.renderOrder = 0;

    const scratchShell = new THREE.Mesh(
      child.geometry,
      new THREE.MeshBasicMaterial({
        color: 0xb66a5e,
        side: THREE.BackSide,
        transparent: true,
        opacity: originalOpacity < 0.5 ? 0.045 : 0.075,
        depthWrite: false,
      }),
    );
    scratchShell.name = `${child.name || "mesh"} notebook scratch shell`;
    scratchShell.position.set(0.018, -0.014, 0.01);
    scratchShell.scale.setScalar(1.055);
    scratchShell.renderOrder = 0;

    const edges = new THREE.EdgesGeometry(child.geometry, 22);
    const primaryLine = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({
        color: 0x49638f,
        transparent: true,
        opacity: 0.24,
      }),
    );
    primaryLine.name = `${child.name || "mesh"} ink outline`;
    primaryLine.renderOrder = 2;

    const scratchLine = new THREE.LineSegments(
      edges.clone(),
      new THREE.LineBasicMaterial({
        color: 0xb66a5e,
        transparent: true,
        opacity: 0.12,
      }),
    );
    scratchLine.name = `${child.name || "mesh"} scratch outline`;
    scratchLine.position.set(0.012, -0.01, 0.008);
    scratchLine.scale.setScalar(1.018);
    scratchLine.renderOrder = 3;

    child.add(outlineShell);
    child.add(scratchShell);
    child.add(primaryLine);
    child.add(scratchLine);
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

function normalizeScene(group) {
  group.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(group);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  const maxAxis = Math.max(size.x, size.y, size.z) || 1;
  const scale = 3.25 / maxAxis;
  group.scale.setScalar(scale);
  group.position.copy(center).multiplyScalar(-scale);
  group.updateMatrixWorld(true);
}

async function loadPlantCell() {
  const response = await fetch("./models/plant-cell/manifest.json");
  const manifest = await response.json();
  const loadJobs = manifest.organelles.map(loadOrganelle);
  await Promise.all(loadJobs);

  normalizeScene(rootGroup);
  const nucleus = viewerState.organelles.find((item) => item.baseKey === "nucleus");
  if (nucleus) setSelectedOrganelle(nucleus);

  viewerState.loaded = true;
  viewerStatus.textContent = "tap an organelle";
  resetCamera();
  syncViewerControls();
}

async function loadOrganelle(item) {
  const gltf = await loader.loadAsync(item.file);
  const group = new THREE.Group();
  group.name = item.label;
  group.userData.organelleId = item.id;
  group.userData.baseKey = getBaseKey(item.id);
  group.userData.label = item.label;

  const model = gltf.scene;
  addSketchOutlines(model);
  group.add(model);
  group.position.set(...item.position);
  group.scale.setScalar(item.scale);
  rootGroup.add(group);

  viewerState.visible.set(item.id, true);
  viewerState.organelles.push({
    id: item.id,
    baseKey: getBaseKey(item.id),
    label: item.label,
    group,
    baseScale: group.scale.clone(),
    labelOffset: labelAnchorOffsets[getBaseKey(item.id)] || new THREE.Vector3(0, 0.08, 0.22),
  });
}

function initScene() {
  scene = new THREE.Scene();
  scene.background = null;

  camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 5.8);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  viewerEl.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.75;
  controls.minDistance = 2.8;
  controls.maxDistance = 9;
  controls.enablePan = true;

  rootGroup = new THREE.Group();
  scene.add(rootGroup);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xf2e4c6, 3.4));
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
  keyLight.position.set(3, 5, 4);
  keyLight.castShadow = true;
  scene.add(keyLight);

  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();
  loader = new GLTFLoader();

  resizeObserver = new ResizeObserver(resizeRenderer);
  resizeObserver.observe(viewerEl);
  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("pointerup", onPointerUp);
  controls.addEventListener("change", updateLabels);
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

function onPointerDown(event) {
  pointerStart = {
    x: event.clientX,
    y: event.clientY,
    time: performance.now(),
  };
}

function onPointerUp(event) {
  if (!pointerStart) return;
  const distance = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
  const elapsed = performance.now() - pointerStart.time;
  pointerStart = null;

  if (distance > 5 || elapsed > 500) return;

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
  const organelle = findOrganelleFromObject(hit.object);
  if (organelle) setSelectedOrganelle(organelle);
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
  if (controls) controls.update();
  if (renderer && scene && camera) renderer.render(scene, camera);
}

artifactTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    setArtifact(trigger.dataset.artifact);
  });
});

contentTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setRightPanel(tab.dataset.panel);
  });
});

highlightSelectors.forEach((button) => {
  button.addEventListener("click", () => {
    selectOrganelleByKey(button.dataset.selectOrganelle);
  });
});

pageSteps.forEach((step) => {
  step.addEventListener("click", () => {
    pageSteps.forEach((item) => item.classList.toggle("active", item === step));
  });
});

viewerActions.forEach((button) => {
  button.addEventListener("click", () => onViewerAction(button.dataset.viewerAction));
});

initScene();
animate();
loadPlantCell().catch((error) => {
  console.error(error);
  viewerStatus.textContent = "model failed to load";
});

setArtifact("cell3d");
setRightPanel("notes-panel");

try {
  renderQuiz();
  renderFlipCards();
  renderScientists();
  renderMicroscopeGallery();
  renderWatchGallery();
  selectOrganelleByKey("nucleus");
} catch (error) {
  console.error("Notebook content failed to render", error);
}
