import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { bookletConfig as config } from "./booklet.config.js";

const pageMeta = [
  { id: "cover", label: "Cover", icon: "book" },
  { id: "page-immersive", label: "Explore", icon: "model" },
  { id: "page-gallery", label: "Gallery", icon: "scope" },
  { id: "page-video", label: "Watch", icon: "video" },
  { id: "page-flashcards", label: "Cards", icon: "cards" },
  { id: "page-quiz", label: "Quiz", icon: "quiz" },
  { id: "page-extras", label: "Extras", icon: "people" },
];

const iconPaths = {
  book: `<path d="M9 13c7-7 23-7 30 0v25c-7-5-23-5-30 0z"/><path d="M15 17h18M15 23h12"/>`,
  model: `<ellipse cx="24" cy="25" rx="17" ry="12"/><circle cx="20" cy="24" r="5"/><path d="M32 18l5-5M35 28l6 2M13 30l-5 4"/>`,
  scope: `<path d="M18 8h9v9l-5 6"/><path d="M17 31c7 4 16 1 20-6"/><path d="M12 39h24M19 39v-7M29 39v-9"/><circle cx="18" cy="27" r="4"/>`,
  video: `<rect x="8" y="13" width="32" height="22" rx="5"/><path d="M21 19l10 5-10 6z"/>`,
  cards: `<rect x="12" y="10" width="24" height="28" rx="4"/><path d="M17 18h14M17 24h10M17 30h13"/>`,
  quiz: `<circle cx="24" cy="24" r="16"/><path d="M19 20c1-5 10-5 10 1 0 4-5 4-5 8M24 35h.1"/>`,
  people: `<circle cx="17" cy="17" r="6"/><circle cx="31" cy="18" r="5"/><path d="M8 37c2-8 16-8 18 0M23 37c2-7 14-7 17 0"/>`,
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const viewerEl = $("#cell-viewer");
const labelLayer = $("[data-label-layer]");
const viewerStatus = $("[data-viewer-status]");
const viewerActions = $$("[data-viewer-action]");
const notesTitle = $("[data-notes-title]");
const notesHint = $("[data-notes-hint]");
const detailTitle = $("[data-detail-title]");
const detailBody = $("[data-detail-body]");
const detailList = $("[data-detail-list]");
const galleryStage = $("[data-gallery-stage]");
const galleryCopy = $("[data-gallery-copy]");
const videoPlayer = $("[data-video-player]");
const videoList = $("[data-video-list]");
const videoTitle = $("[data-video-title]");
const videoSubtitle = $("[data-video-subtitle]");
const videoNotes = $("[data-video-notes]");
const flashGrid = $("[data-flashcards]");
const quizStack = $("[data-quiz-stack]");
const timerEl = $("[data-timer]");
const scoreEl = $("[data-score]");
const attemptsEl = $("[data-attempts]");
const quizStatusEl = $("[data-quiz-status]");
const resetQuizButton = $("[data-reset-quiz]");
const startQuizButton = $("[data-start-quiz]");
const quizPanel = $("[data-quiz-panel]");
const peopleGrid = $("[data-people-grid]");
const personName = $("[data-person-name]");
const personRole = $("[data-person-role]");
const personDetail = $("[data-person-detail]");

const partDetails = config.notes?.partDetails || {};
const modelConfig = config.model || {};
const modelParts = modelConfig.parts || [];
const primaryPartIds = new Set(modelConfig.primaryPartIds || modelParts.filter((part) => part.primary).map((part) => part.id));
const gallerySlides = config.pages?.gallery?.slides || [];
const videos = config.pages?.video?.videos || [];
const flashCards = config.pages?.flashcards?.cards || [];
const quizCards = config.pages?.quiz?.cards || [];
const people = config.pages?.extras?.people || [];

const viewerState = {
  loaded: false,
  playing: true,
  autoRotate: true,
  labels: true,
  labelDensity: "all",
  isolated: false,
  zoomed: false,
  selectedKey: modelConfig.selectedPartId || modelParts[0]?.id || null,
  parts: [],
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
let galleryIndex = 0;
let quizSeconds = config.pages?.quiz?.seconds || 300;
let quizActive = false;
let quizStarted = false;
let quizInView = false;
let quizTimerId = null;
let attempts = 0;
let quizScore = new Map();

function setText(selector, text) {
  const node = typeof selector === "string" ? $(selector) : selector;
  if (node) node.textContent = text || "";
}

function stopFtue(pageId) {
  document.querySelector(`#${pageId}`)?.classList.remove("ftue-active");
}

function assetUrl(file) {
  if (!file) return "";
  if (/^(https?:|\.\/|\/)/.test(file)) return file;
  const base = modelConfig.assetBase || ".";
  return `${base.replace(/\/$/, "")}/${file}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function makeMark(partId) {
  const part = modelParts.find((item) => item.id === partId);
  if (!part) return "";
  return `<button type="button" class="mark" style="--mark-color:${part.color || "var(--green)"}" data-select-part="${part.id}">${escapeHtml(part.label)}</button>`;
}

function renderChrome() {
  document.title = config.title || "Digital Booklet";
  document.documentElement.style.setProperty("--blue", config.theme?.accent || "#173a92");
  document.documentElement.style.setProperty("--green", config.theme?.secondary || "#4c8f5d");
  document.documentElement.style.setProperty("--yellow", config.theme?.highlight || "#f4dc72");
  const galleryPageLabel = config.pages?.gallery?.label || "02 Gallery";
  const galleryNavLabel = config.pages?.gallery?.navLabel || galleryPageLabel.replace(/^\d+\s*/, "") || "Gallery";

  setText("[data-cover-kicker]", config.cover?.kicker || "interactive science booklet");
  setText("[data-cover-title]", config.cover?.title || config.title || "BOOKLET");
  setText("[data-cover-line]", config.cover?.line || config.subtitle || "");
  renderCoverArt();
  setText("[data-immersive-label]", config.pages?.immersive?.label || "01 Explore");
  setText("[data-immersive-title]", config.pages?.immersive?.title || `Explore ${config.title || ""}`);
  setText("[data-immersive-ftue]", config.pages?.immersive?.ftue || modelConfig.ftue);
  setText(viewerStatus, config.pages?.immersive?.status || "loading model...");
  setText("[data-gallery-label]", galleryPageLabel);
  setText("[data-gallery-ftue]", config.pages?.gallery?.ftue);
  setText("[data-gallery-title]", config.pages?.gallery?.title);
  setText("[data-gallery-eyebrow]", config.pages?.gallery?.eyebrow);
  setText("[data-gallery-body]", config.pages?.gallery?.body);
  setText("[data-video-label]", config.pages?.video?.label || "03 Watch");
  setText("[data-video-page-title]", config.pages?.video?.title || "Watch");
  setText("[data-video-ftue]", config.pages?.video?.ftue);
  setText("[data-flashcards-title]", config.pages?.flashcards?.title || "Flash Card Desk");
  setText("[data-quiz-title]", config.pages?.quiz?.title || "Timed Quiz");
  setText("[data-quiz-help]", config.pages?.quiz?.help);
  setText("[data-extras-title]", config.pages?.extras?.title || "People Behind The Ideas");
  setText("[data-extras-subtitle]", config.pages?.extras?.subtitle);
  $("#page-gallery")?.setAttribute("data-page-label", galleryPageLabel);
  $$('a[href="#page-gallery"]').forEach((link) => {
    const direction = link.classList.contains("up") ? "previous" : "next";
    link.textContent = `${direction} - ${galleryNavLabel}`;
  });

  const guide = $("[data-gallery-guide]");
  if (guide) {
    guide.innerHTML = `<h3>${escapeHtml(config.pages?.gallery?.guideTitle || "Tags To Notice")}</h3><p>${escapeHtml(config.pages?.gallery?.guideBody || "")}</p>`;
  }

  const rail = $("[data-page-rail]");
  rail.innerHTML = "";
  pageMeta.forEach((page) => {
    const dynamicLabels = {
      "page-immersive": config.pages?.immersive?.navLabel || "Explore",
      "page-gallery": config.pages?.gallery?.navLabel || "Map",
      "page-video": config.pages?.video?.navLabel || "Watch",
      "page-flashcards": config.pages?.flashcards?.navLabel || "Cards",
      "page-quiz": config.pages?.quiz?.navLabel || "Quiz",
      "page-extras": config.pages?.extras?.navLabel || "Extras",
    };
    const label = dynamicLabels[page.id] || page.label;
    const link = document.createElement("a");
    link.className = `page-icon-tab${page.id === "cover" ? " active" : ""}`;
    link.href = `#${page.id}`;
    link.dataset.pageTarget = page.id;
    link.ariaLabel = label;
    link.innerHTML = `<svg viewBox="0 0 48 48" role="img" aria-hidden="true">${iconPaths[page.icon]}</svg><span>${label}</span>`;
    rail.appendChild(link);
  });
}

function renderCoverArt() {
  const art = $("[data-cover-art]");
  if (!art) return;
  if (config.cover?.art === "human-system") {
    const parts = modelParts.slice(0, 6);
    art.className = "cover-system";
    art.innerHTML = `
      <span class="system-torso"></span>
      <span class="system-spine"></span>
      ${parts
        .map(
          (part, index) => `
            <span class="system-node n${index + 1}" style="--node-color:${part.color || "var(--green)"}">
              <i></i><b>${escapeHtml(part.label)}</b>
            </span>
          `,
        )
        .join("")}
    `;
    return;
  }
  art.className = "cover-cell";
}

function renderOverview() {
  const overview = config.notes?.overview || {};
  setText("[data-overview-title]", overview.title || `What is ${config.title}?`);
  const primary = overview.primary || modelParts.filter((part) => part.primary).map((part) => part.id);
  const secondary = overview.secondary || modelParts.filter((part) => !part.primary).map((part) => part.id);
  const primaryLine = primary.map(makeMark).filter(Boolean).join(", ");
  const secondaryLine = secondary.map(makeMark).filter(Boolean).join(", ");
  $("[data-overview-primary]").innerHTML = `${escapeHtml(overview.body || "")} ${primaryLine} Tap every highlighted word here, and all labels in the 3D simulation on the left, to explore detailed information.`;
  $("[data-overview-secondary]").innerHTML = secondaryLine ? `Other useful parts: ${secondaryLine}.` : "";
  $$("[data-select-part]").forEach((button) => {
    button.addEventListener("click", () => selectPartByKey(button.dataset.selectPart));
  });
}

function detailForPart(key) {
  const part = modelParts.find((item) => item.id === key) || modelParts[0];
  const detail = partDetails[key] || {};
  return {
    title: part?.label || "Select a part",
    hint: part?.role || "",
    body: detail.body || part?.role || "",
    fields: detail.fields || {
      role: part?.role || "Topic-specific detail goes here.",
      examIdea: detail.examIdea || "",
      didYouKnow: detail.didYouKnow || "",
    },
  };
}

function renderDetail(key) {
  const detail = detailForPart(key);
  setText(notesTitle, detail.title);
  setText(notesHint, detail.hint);
  setText(detailTitle, detail.title);
  setText(detailBody, detail.body);
  detailList.innerHTML = "";
  Object.entries(detail.fields).forEach(([term, value]) => {
    if (!value) return;
    const row = document.createElement("div");
    row.innerHTML = `<dt>${escapeHtml(term)}</dt><dd>${escapeHtml(value)}</dd>`;
    detailList.appendChild(row);
  });
}

function makeSketchMaterial(material, fallbackColor) {
  const sourceColor = fallbackColor ? new THREE.Color(fallbackColor) : material?.color || new THREE.Color(0x88aa66);
  const colour = sourceColor.clone().lerp(new THREE.Color(0xfffaf0), 0.58);
  return new THREE.MeshToonMaterial({
    color: colour,
    transparent: material?.transparent || material?.opacity < 1,
    opacity: Math.min(material?.opacity ?? 0.9, 0.9),
  });
}

function addSketchOutlines(group, color) {
  const meshes = [];
  group.traverse((child) => {
    if (child.isMesh) meshes.push(child);
  });
  meshes.forEach((mesh) => {
    const originalOpacity = mesh.material?.opacity ?? 1;
    mesh.material = makeSketchMaterial(mesh.material, color);
    const outline = new THREE.Mesh(
      mesh.geometry,
      new THREE.MeshBasicMaterial({
        color: 0x49638f,
        side: THREE.BackSide,
        transparent: true,
        opacity: originalOpacity < 0.5 ? 0.1 : 0.18,
        depthWrite: false,
      }),
    );
    outline.scale.setScalar(1.045);
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

function updatePartVisibility() {
  viewerState.parts.forEach((item) => {
    const focused = item.id === viewerState.selectedKey;
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
  camera.position.fromArray(modelConfig.camera?.position || [0, 0, 5.8]);
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
  controls.target.fromArray(modelConfig.camera?.target || [0, 0, 0]);
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

async function getModelParts() {
  if (modelConfig.manifest) {
    const manifest = await fetch(modelConfig.manifest).then((response) => response.json());
    return manifest.parts || manifest.organelles || [];
  }
  return modelParts.filter((part) => !part.noModel);
}

function applyNodeFilter(group, part) {
  if (!part.onlyNodes?.length) return;
  const keep = new Set(part.onlyNodes);
  const topLevel = [...group.children];
  topLevel.forEach((child) => {
    if (!keep.has(child.name)) group.remove(child);
  });
}

async function loadModels() {
  const parts = await getModelParts();
  if (!parts.length) {
    viewerStatus.textContent = "no model parts configured";
    return;
  }
  const loaded = await Promise.all(
    parts.map(
      (part) =>
        new Promise((resolve, reject) => {
          loader.load(assetUrl(part.file), (gltf) => resolve({ part, gltf }), undefined, reject);
        }),
    ),
  );

  loaded.forEach(({ part, gltf }) => {
    const group = gltf.scene;
    applyNodeFilter(group, part);
    if (part.position) group.position.fromArray(part.position);
    if (part.scale) group.scale.setScalar(part.scale);
    group.userData.partId = part.id;
    group.traverse((child) => {
      child.userData.partId = part.id;
    });
    addSketchOutlines(group, part.color);
    rootGroup.add(group);
    const partBox = new THREE.Box3().setFromObject(group);
    const partCenter = partBox.getCenter(new THREE.Vector3());
    const labelPosition = rootGroup.worldToLocal(partCenter.clone());
    viewerState.parts.push({
      id: part.id,
      label: part.label,
      role: part.role,
      group,
      baseScale: group.scale.clone(),
      labelPosition,
      labelOffset: new THREE.Vector3(...(part.anchor || [0, 0.2, 0.2])),
    });
  });

  normalizeRoot();
  viewerState.loaded = true;
  viewerStatus.textContent = "tap a part";
  const selected = viewerState.parts.find((part) => part.id === viewerState.selectedKey) || viewerState.parts[0];
  if (selected) setSelectedPart(selected);
  syncViewerControls();
}

function normalizeRoot() {
  const box = new THREE.Box3().setFromObject(rootGroup);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxSize = Math.max(size.x, size.y, size.z) || 1;
  rootGroup.children.forEach((child) => child.position.sub(center));
  viewerState.parts.forEach((part) => part.labelPosition?.sub(center));
  rootGroup.position.set(0, 0, 0);
  rootGroup.scale.setScalar((modelConfig.camera?.normalizedSize || 3.1) / maxSize);
  rootGroup.rotation.fromArray(modelConfig.camera?.rotation || [-0.12, 0.2, 0]);
}

function setSelectedPart(item) {
  const shouldRefreshIsolation = viewerState.isolated && viewerState.selectedKey !== item.id;
  if (shouldRefreshIsolation) {
    viewerState.isolated = false;
    updatePartVisibility();
  }
  viewerState.selectedKey = item.id;
  if (shouldRefreshIsolation) viewerState.isolated = true;
  updatePartVisibility();
  renderDetail(item.id);
  syncViewerControls();
}

function selectPartByKey(key) {
  stopFtue("page-immersive");
  const item = viewerState.parts.find((part) => part.id === key);
  if (item) setSelectedPart(item);
  else renderDetail(key);
}

function findPartFromObject(object) {
  let current = object;
  while (current) {
    if (current.userData?.partId) return viewerState.parts.find((item) => item.id === current.userData.partId);
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
  const item = hit ? findPartFromObject(hit.object) : null;
  if (item) setSelectedPart(item);
}

function resetCamera() {
  viewerState.zoomed = false;
  camera.position.fromArray(modelConfig.camera?.position || [0, 0, 5.8]);
  controls.target.fromArray(modelConfig.camera?.target || [0, 0, 0]);
  controls.update();
}

function setIsolation() {
  updatePartVisibility();
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
    if (action === "labels") button.textContent = !viewerState.labels ? "labels off" : viewerState.labelDensity === "all" ? "all labels" : "key labels";
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
    const z = viewerState.zoomed ? 3.5 : (modelConfig.camera?.position?.[2] || 5.8);
    camera.position.set(0, 0, z);
    controls.target.fromArray(modelConfig.camera?.target || [0, 0, 0]);
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
  viewerState.parts.forEach((item) => {
    if (!item.group.visible) return;
    if (viewerState.labelDensity !== "all" && !viewerState.isolated && item.id !== viewerState.selectedKey && !primaryPartIds.has(item.id)) return;
    const position = (item.labelPosition || new THREE.Vector3())
      .clone()
      .add(item.labelOffset)
      .applyMatrix4(rootGroup.matrixWorld);
    position.project(camera);
    if (position.z < -1 || position.z > 1) return;
    const label = document.createElement("button");
    label.className = "model-label";
    label.type = "button";
    label.textContent = item.label;
    label.style.left = `${(position.x * 0.5 + 0.5) * bounds.width}px`;
    label.style.top = `${(-position.y * 0.5 + 0.5) * bounds.height}px`;
    label.classList.toggle("selected", item.id === viewerState.selectedKey);
    label.addEventListener("click", () => setSelectedPart(item));
    labelLayer.appendChild(label);
  });
}

function animate() {
  requestAnimationFrame(animate);
  controls?.update();
  if (renderer && scene && camera) renderer.render(scene, camera);
}

function renderGallery() {
  const page = config.pages?.gallery || {};
  if (page.variant === "pathway") {
    const steps = page.steps || modelParts;
    galleryStage.classList.add("pathway-stage");
    galleryStage.innerHTML = `
      <div class="pathway-thread" aria-hidden="true"></div>
      <div class="pathway-list">
        ${steps
          .map(
            (step, index) => `
              <button class="pathway-step" type="button" style="--step-color:${step.color || "var(--green)"}" data-pathway-part="${step.id || ""}">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <strong>${escapeHtml(step.label || step.title)}</strong>
                <em>${escapeHtml(step.action || step.role || "")}</em>
              </button>
            `,
          )
          .join("")}
      </div>
    `;
    galleryCopy.innerHTML = `
      <p class="eyebrow">${escapeHtml(page.detailEyebrow || "pathway notes")}</p>
      <h3>${escapeHtml(page.detailTitle || "How to read the pathway")}</h3>
      <p>${escapeHtml(page.detailBody || "Follow the numbered steps. Tap a step to connect it back to the 3D model.")}</p>
      <div class="micro-tags">${(page.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
    `;
    galleryStage.querySelectorAll("[data-pathway-part]").forEach((button) => {
      button.addEventListener("click", () => {
        stopFtue("page-gallery");
        const partId = button.dataset.pathwayPart;
        if (partId) selectPartByKey(partId);
        $("#page-immersive")?.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", "#page-immersive");
      });
    });
    return;
  }
  galleryStage.classList.remove("pathway-stage");
  if (!gallerySlides.length) {
    galleryStage.innerHTML = `<div class="viewer-status">diagram view</div>`;
    galleryCopy.innerHTML = `<h3>Look For Patterns</h3><p>The model and labels show how the parts connect. Notice which structures come before and after the selected part.</p>`;
    return;
  }
  const slide = gallerySlides[galleryIndex];
  galleryStage.innerHTML = `
    <img src="${slide.image}" alt="${escapeHtml(slide.title)}" draggable="false" />
    <button class="micro-arrow micro-prev" type="button" data-gallery-step="-1" aria-label="Previous image">‹</button>
    <button class="micro-arrow micro-next" type="button" data-gallery-step="1" aria-label="Next image">›</button>
  `;
  galleryCopy.innerHTML = `
    <p class="eyebrow">view ${String(galleryIndex + 1).padStart(2, "0")} / ${String(gallerySlides.length).padStart(2, "0")}</p>
    <h3>${escapeHtml(slide.title)}</h3>
    <p>${escapeHtml(slide.note || "")}</p>
    <div class="micro-tags">${(slide.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
    <p>${escapeHtml(slide.source || "")}</p>
  `;
  galleryStage.querySelectorAll("[data-gallery-step]").forEach((button) => {
    button.addEventListener("click", () => {
      stopFtue("page-gallery");
      galleryIndex = (galleryIndex + Number(button.dataset.galleryStep) + gallerySlides.length) % gallerySlides.length;
      renderGallery();
    });
  });
  galleryStage.querySelector("img")?.addEventListener("dragstart", (event) => event.preventDefault());
}

function renderVideos() {
  videoList.innerHTML = "";
  if (!videos.length) {
    videoTitle.textContent = "Watch The System In Your Mind";
    videoSubtitle.textContent = "Model-based review";
    videoNotes.innerHTML = "<h3>Build A Mental Movie</h3><p>Imagine the pathway as a moving sequence. Name each part, say what enters it, describe what changes there, and then explain what moves to the next part.</p>";
    return;
  }
  videos.forEach((video, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.videoId = video.id;
    button.innerHTML = `
      <img src="${video.thumb || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}" alt="" />
      <span>${String(index + 1).padStart(2, "0")}</span>
      <strong>${escapeHtml(video.title)}</strong>
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
  videoSubtitle.textContent = video.source || "Concept video";
  videoNotes.innerHTML = `<h3>Connected Notes</h3><p>${escapeHtml(video.note || "")}</p>`;
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
    card.innerHTML = `<span class="eyebrow">${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(question)}</strong><em>${escapeHtml(answer)}</em>`;
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
  quizSeconds = config.pages?.quiz?.seconds || 300;
  quizCards.forEach((card, index) => {
    const node = document.createElement("article");
    node.className = "quiz-card";
    node.innerHTML = `<span class="eyebrow">${String(index + 1).padStart(2, "0")} ${escapeHtml(card.type)}</span><h3>${escapeHtml(card.question)}</h3>`;
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
        const ok = input.value.trim().toLowerCase() === String(card.answer).toLowerCase();
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
  $("#page-quiz")?.classList.add("ftue-active");
  renderQuiz();
}

function renderPeople() {
  peopleGrid.innerHTML = "";
  if (!people.length) {
    personName.textContent = "Science Grows Through Evidence";
    personRole.textContent = "";
    personDetail.innerHTML = "<h3>Observation Matters</h3><p>Body systems became clearer as people compared anatomy, used better tools, and tested explanations against evidence.</p>";
    return;
  }
  people.forEach((person, index) => {
    const button = document.createElement("button");
    button.className = "person-card";
    button.type = "button";
    button.dataset.personIndex = String(index);
    button.innerHTML = `<span class="person-thumb">${escapeHtml(person.initials || "?")}</span><span>${escapeHtml(person.group || "")}</span><strong>${escapeHtml(person.name)}</strong><p>${escapeHtml(person.role || "")}</p>`;
    button.addEventListener("click", () => setPerson(index));
    peopleGrid.appendChild(button);
  });
  setPerson(0);
}

function setPerson(index) {
  const person = people[index];
  personName.textContent = person.name;
  personRole.textContent = person.role || "";
  personDetail.innerHTML = `<h3>${escapeHtml(person.group || "Contribution")} contribution</h3><p>${escapeHtml(person.detail || "")}</p>`;
  peopleGrid.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.personIndex === String(index));
  });
}

function setupEvents() {
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
  ).observe($("#page-quiz"));

  const pageObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.id;
      $$("[data-page-target]").forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.pageTarget === id);
      });
    },
    { root: $("#booklet"), threshold: [0.35, 0.6, 0.85] },
  );
  $$(".booklet-page").forEach((page) => pageObserver.observe(page));
}

renderChrome();
renderOverview();
renderDetail(viewerState.selectedKey);
initScene();
animate();
loadModels().catch((error) => {
  console.error(error);
  viewerStatus.textContent = "model failed to load";
});
renderGallery();
renderVideos();
renderFlashCards();
renderQuiz();
renderPeople();
setupEvents();
