import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { organSystemBooklets, sharedHumanSystemsExtras } from "./data/human-organ-systems.js";

const here = dirname(fileURLToPath(import.meta.url));
const templateDir = join(here, "..", "booklet_template");

const extraDetails = {
  "digestive-system": {
    mouth: {
      body: "The mouth is where digestion becomes visible. Teeth cut and grind food into smaller pieces, the tongue moves food around and shapes it into a soft bolus, and salivary glands release saliva. Saliva moistens food and contains salivary amylase, an enzyme that begins breaking starch into simpler sugars.",
      fields: {
        subParts: "Teeth, tongue, salivary glands, saliva, gums, and the oral cavity.",
        action: "Starts mechanical digestion by chewing and starts chemical digestion with saliva.",
        keyTerm: "Bolus: the soft ball of chewed food ready to be swallowed.",
        specialFact: "Saliva also helps protect the mouth because it washes surfaces and contains substances that slow the growth of some microbes.",
        commonMistake: "Digestion does not wait for the stomach; it begins in the mouth.",
      },
    },
    oesophagus: {
      body: "The oesophagus is a muscular food pipe connecting the mouth region to the stomach. Food does not simply fall through it. Rings of muscle squeeze in a wave called peristalsis, pushing the bolus downward even if a person is lying down.",
      fields: {
        subParts: "Muscular wall, inner lining, and lower sphincter near the stomach.",
        action: "Transports swallowed food from the throat to the stomach.",
        keyTerm: "Peristalsis: wave-like muscular movement.",
        specialFact: "A sphincter at the lower end helps stop acidic stomach contents from moving back upward.",
        commonMistake: "The oesophagus mainly transports food; it is not a major site of digestion.",
      },
    },
    stomach: {
      body: "The stomach is a muscular sac that stores food for a while, churns it, and mixes it with gastric juice. Hydrochloric acid helps kill many microbes and creates the right conditions for pepsin, an enzyme that begins protein digestion. The mixture formed in the stomach is called chyme.",
      fields: {
        subParts: "Muscular wall, gastric glands, mucus lining, and sphincters at the entrance and exit.",
        action: "Stores, churns, acidifies, and begins protein digestion.",
        keyTerm: "Chyme: the semi-liquid mixture leaving the stomach.",
        specialFact: "The stomach lining makes mucus so the acid and enzymes do not digest the stomach wall itself.",
        commonMistake: "Most nutrient absorption does not happen in the stomach; it happens in the small intestine.",
      },
    },
    "accessory-organs": {
      body: "Accessory organs help digestion even though food does not travel through all of them. The liver makes bile, the gall bladder stores and releases bile, and the pancreas releases digestive enzymes into the small intestine. Together they make chemical digestion much more effective.",
      fields: {
        subParts: "Liver, gall bladder, pancreas, bile duct, and pancreatic duct.",
        action: "Adds bile and enzymes that help break down fats, proteins, and carbohydrates.",
        keyTerm: "Bile emulsifies fat, breaking large fat drops into smaller droplets.",
        specialFact: "The pancreas also has a hormone role because it helps control blood sugar with insulin and glucagon.",
        commonMistake: "Accessory organs are not unimportant; they are essential helpers in digestion.",
      },
    },
    "small-intestine": {
      body: "The small intestine is the main site of final digestion and nutrient absorption. Enzymes finish breaking food into small molecules, and villi absorb those nutrients into blood and lymph. Its long, folded surface gives a very large area for absorption.",
      fields: {
        subParts: "Duodenum, jejunum, ileum, villi, microvilli, and intestinal glands.",
        action: "Completes digestion and absorbs digested nutrients.",
        keyTerm: "Villi: tiny finger-like projections that increase surface area.",
        specialFact: "The small intestine is called small because it is narrower than the large intestine, not because it is short.",
        commonMistake: "Absorption is not just food entering the stomach; absorbed nutrients cross the intestinal wall.",
      },
    },
    "large-intestine": {
      body: "The large intestine receives leftover material after most nutrients have been absorbed. It absorbs water and salts, houses helpful bacteria, and changes the remaining material into faeces. This helps the body conserve water while removing undigested waste.",
      fields: {
        subParts: "Caecum, colon, rectum connection, helpful bacteria, and mucus-secreting lining.",
        action: "Absorbs water and salts and forms faeces.",
        keyTerm: "Colon: the major part of the large intestine.",
        specialFact: "Helpful gut bacteria can make some vitamins and also help protect the gut environment.",
        commonMistake: "The large intestine does not absorb most nutrients; its main job is water recovery and waste formation.",
      },
    },
    rectum: {
      body: "The rectum is the final storage area for faeces before removal from the body. Stretch receptors in the rectal wall signal when it is filling, and muscles around the anus help control release.",
      fields: {
        subParts: "Rectal wall, anal canal, internal sphincter, and external sphincter.",
        action: "Stores solid waste briefly and helps coordinate its release.",
        keyTerm: "Egestion: removal of undigested solid waste from the digestive tract.",
        specialFact: "Egestion is different from excretion; egestion removes undigested food waste, while excretion removes metabolic wastes made by cells.",
        commonMistake: "The rectum stores waste; it does not digest food.",
      },
    },
  },
  "respiratory-system": {
    "nasal-cavity": {
      body: "The nasal cavity is the first preparation room for air. As air passes through the nose, hairs and sticky mucus trap dust, pollen, and many germs. The moist lining also warms and humidifies the air, which protects the delicate tubes and air sacs deeper inside the body.",
      fields: {
        subParts: "Nostrils, nasal hairs, mucus lining, cilia, and blood-rich nasal passages.",
        action: "Filters, warms, and moistens air before it travels deeper.",
        keyTerm: "Mucus and cilia.",
        specialFact: "The rich blood supply in the nasal lining helps warm incoming air quickly.",
        commonMistake: "The nose is not only for smelling; it is an active part of the breathing pathway.",
      },
    },
    pharynx: {
      body: "The pharynx is a shared passage behind the nose and mouth. Air passes through it on the way to the larynx, while food passes through it on the way to the oesophagus. Because it is shared, the body needs careful coordination during swallowing.",
      fields: {
        subParts: "Nasopharynx, oropharynx, and laryngopharynx.",
        action: "Directs air and food through a shared throat passage.",
        keyTerm: "Pharynx: the throat passage.",
        specialFact: "Swallowing briefly changes the pathway so food is guided away from the airway.",
        commonMistake: "The pharynx is not only part of digestion or only part of breathing; it is involved in both pathways.",
      },
    },
    larynx: {
      body: "The larynx is the voice box and a protected doorway to the trachea. It contains vocal cords, which vibrate to produce sound. During swallowing, the epiglottis helps guard the opening so food is less likely to enter the airway.",
      fields: {
        subParts: "Vocal cords, epiglottis, cartilage framework, and glottis.",
        action: "Produces voice and helps protect the airway.",
        keyTerm: "Epiglottis: a flap that helps guard the airway during swallowing.",
        specialFact: "Voice changes when the vocal cords vibrate with different tension and airflow.",
        commonMistake: "The larynx is not the same as the trachea; it sits above the windpipe.",
      },
    },
    trachea: {
      body: "The trachea, or windpipe, is a strong air tube that runs down the neck into the chest. Ring-like cartilage keeps it open even when you bend your neck or breathe deeply. Its inner lining also helps sweep trapped dust and mucus upward.",
      fields: {
        subParts: "C-shaped cartilage rings, ciliated lining, mucus layer, and smooth muscle.",
        action: "Carries air from the throat toward the lungs.",
        keyTerm: "Windpipe.",
        specialFact: "The cartilage rings are incomplete at the back, leaving room for the oesophagus to expand when food passes.",
        commonMistake: "Food should not enter the trachea; the airway is guarded during swallowing.",
      },
    },
    "bronchi-bronchioles": {
      body: "The bronchi are the two main branches from the trachea. Inside each lung, they divide again and again into smaller bronchioles, like the branches of a tree. This branching pattern spreads air close to millions of tiny air sacs.",
      fields: {
        subParts: "Right bronchus, left bronchus, smaller bronchioles, and terminal air passages.",
        action: "Distributes air through branching tubes inside both lungs.",
        keyTerm: "Branching air tubes.",
        specialFact: "The right main bronchus is wider and more vertical than the left, which is one reason inhaled objects more often enter the right side.",
        commonMistake: "Air does not enter the lungs as one big empty bag; it travels through many branching tubes.",
      },
    },
    lungs: {
      body: "The lungs are soft, elastic organs filled with branching tubes and tiny air sacs called alveoli. In the alveoli, oxygen moves from air into the blood, while carbon dioxide moves from the blood into the air to be breathed out.",
      fields: {
        subParts: "Bronchioles, alveoli, capillaries, elastic tissue, and pleural covering.",
        action: "Exchange oxygen and carbon dioxide with the blood.",
        keyTerm: "Alveoli.",
        specialFact: "Millions of alveoli create a huge surface area, making gas exchange fast enough for everyday activity and exercise.",
        commonMistake: "Breathing brings gases in and out; cellular respiration is the energy-releasing process inside cells.",
      },
    },
    diaphragm: {
      body: "The diaphragm is a dome-shaped muscle below the lungs. When it contracts and flattens, the chest cavity becomes larger and air is drawn in. When it relaxes, the chest space becomes smaller and air moves out.",
      fields: {
        subParts: "Dome-shaped muscle sheet, central tendon, and attachments to ribs and spine.",
        action: "Changes chest volume during inhalation and exhalation.",
        keyTerm: "Breathing muscle.",
        specialFact: "Hiccups happen when the diaphragm contracts suddenly and the vocal opening snaps shut.",
        commonMistake: "The lungs do not have their own muscles; breathing depends on surrounding muscles such as the diaphragm.",
      },
    },
  },
  "circulatory-system": {
    heart: {
      body: "The heart is a muscular pump that works without stopping. Each heartbeat pushes blood through vessels so oxygen, nutrients, hormones, and heat can reach body cells. At the same time, blood carries carbon dioxide and other wastes away from tissues.",
      fields: {
        subParts: "Atria, ventricles, valves, septum, and major blood vessels.",
        action: "Pumps blood through the body in a repeating cycle.",
        keyTerm: "Heartbeat and chambers.",
        specialFact: "Heart valves keep blood moving in one direction, which is why a heartbeat has a rhythmic lub-dub sound.",
        commonMistake: "The heart does not clean blood; its main job is to keep blood moving.",
      },
    },
    arteries: {
      body: "Arteries carry blood away from the heart. Because blood leaves the heart under pressure, artery walls are thick, elastic, and strong. Most arteries carry oxygen-rich blood, but the definition of an artery is based on direction of flow.",
      fields: {
        subParts: "Thick muscular wall, elastic fibres, smooth inner lining, and branching arterioles.",
        action: "Carry blood away from the heart under pressure.",
        keyTerm: "High-pressure vessels.",
        specialFact: "You can feel a pulse in some arteries because each heartbeat sends a pressure wave through them.",
        commonMistake: "Arteries are defined by direction, not only by oxygen level.",
      },
    },
    veins: {
      body: "Veins carry blood back toward the heart. Blood pressure is lower in veins, so many veins have valves that help stop backward flow. Muscles around veins also help squeeze blood along as the body moves.",
      fields: {
        subParts: "Thin wall, wider lumen, valves, and branching venules.",
        action: "Return blood to the heart at lower pressure.",
        keyTerm: "Valves.",
        specialFact: "Leg muscles help squeeze veins during movement, which helps blood return upward toward the heart.",
        commonMistake: "Veins are not weak arteries; they are built for a different direction and pressure.",
      },
    },
  },
  "excretory-system": {
    kidneys: {
      body: "The kidneys are two bean-shaped organs that filter the blood many times a day. They remove urea and other wastes, balance water and salts, and help form urine. This filtering keeps the internal environment of the body steady.",
      fields: {
        subParts: "Cortex, medulla, pelvis, nephrons, glomeruli, and tubules.",
        action: "Filter blood and help balance water and salts.",
        keyTerm: "Nephrons.",
        specialFact: "Each kidney contains about a million nephrons, the tiny filtering units that clean and adjust the fluid from blood.",
        commonMistake: "Kidneys filter blood, not food; digestion and excretion are different processes.",
      },
    },
    ureters: {
      body: "The ureters are two narrow tubes, one from each kidney. They carry urine down to the urinary bladder by gentle wave-like muscle contractions, so urine moves even when you are lying down.",
      fields: {
        subParts: "Muscular tube wall, inner lining, and connection from kidney pelvis to bladder.",
        action: "Carry urine from the kidneys to the bladder.",
        keyTerm: "Urine transport tubes.",
        specialFact: "Ureters use peristalsis, a wave-like muscle action also seen in the digestive tract.",
        commonMistake: "Ureters and urethra are different parts.",
      },
    },
    "urinary-bladder": {
      body: "The urinary bladder is a stretchable muscular sac. It stores urine for a while so the body does not have to release it continuously. As it fills, stretch signals help you sense when it is time to urinate.",
      fields: {
        subParts: "Stretchy muscular wall, inner lining, and sphincter control at the outlet.",
        action: "Stores urine temporarily before release.",
        keyTerm: "Storage organ.",
        specialFact: "The bladder lining folds when empty and stretches as urine collects.",
        commonMistake: "The bladder stores urine; the kidneys make urine.",
      },
    },
    urethra: {
      body: "The urethra is the final tube of the urinary pathway. It carries urine from the bladder to the outside of the body. Muscles around the bladder opening help control when urine is released.",
      fields: {
        subParts: "Urethral tube, sphincter muscles, and outlet opening.",
        action: "Carries urine out of the body.",
        keyTerm: "Exit tube.",
        specialFact: "Sphincter muscles help control the timing of urination.",
        commonMistake: "The urethra does not connect kidneys directly to the bladder.",
      },
    },
  },
};

const systemVideos = {};

const coverLines = {
  "digestive-system": "Food does not become useful all at once. It is chewed, pushed, churned, chemically broken down, absorbed, and finally cleared as waste.",
  "respiratory-system": "Every breath is a pathway: air is prepared in the nose, guided through tubes, exchanged in the lungs, and connected to oxygen carried by blood.",
  "circulatory-system": "Blood is the body's moving transport system, carrying useful materials to cells and carrying wastes away through a loop powered by the heart.",
  "excretory-system": "The urinary system protects the body by filtering blood, balancing water and salts, storing urine, and releasing liquid waste.",
};

const pathwayCopy = {
  "digestive-system": {
    title: "Food Pathway Map",
    ftue: "Each stop changes food in a different way, from chewing to absorption to waste removal.",
    body: "Digestion is a coordinated journey. The mouth begins mechanical and chemical breakdown, the oesophagus moves food by muscle waves, the stomach churns and mixes, the accessory organs add helpful juices, the small intestine absorbs nutrients, and the large intestine recovers water.",
    detailTitle: "How food becomes useful",
    detailBody: "The digestive system is a team of organs, not one tube doing a single job. Food is gradually changed into small molecules that can cross into the blood and travel to body cells.",
    tags: ["mechanical digestion", "chemical digestion", "absorption", "water recovery"],
  },
  "respiratory-system": {
    title: "Air Pathway Map",
    ftue: "Air is prepared, guided, branched, exchanged, and moved by breathing muscles.",
    body: "Air does not jump straight into the lungs. The nose prepares it, the throat and voice box guide it, the trachea carries it downward, the bronchi divide it into both lungs, and the diaphragm helps pull air in and push air out.",
    detailTitle: "How air reaches blood",
    detailBody: "The respiratory system is both a pathway and a gas-exchange surface. Oxygen enters the blood in the lungs, and carbon dioxide leaves the blood so it can be exhaled.",
    tags: ["air flow", "gas exchange", "alveoli", "diaphragm"],
  },
  "circulatory-system": {
    title: "Blood Flow Map",
    ftue: "Blood flow is a loop powered by the heart and guided by vessels.",
    body: "Circulation is a repeating loop. The heart creates pressure, arteries carry blood away to body tissues, tiny vessels allow exchange with cells, and veins return blood toward the heart for the next round.",
    detailTitle: "How transport works",
    detailBody: "The circulatory system is the body's delivery and collection network. It moves oxygen and nutrients toward cells, carries hormones as messages, helps spread heat, and transports wastes away.",
    tags: ["pump", "away from heart", "back to heart", "transport"],
  },
  "excretory-system": {
    title: "Urine Pathway Map",
    ftue: "Urine follows a clear path: filter, carry, store, and release.",
    body: "Excretion through the urinary system begins with filtration in the kidneys. Urine then travels through the ureters, waits in the bladder, and leaves through the urethra when the body is ready.",
    detailTitle: "How liquid waste leaves",
    detailBody: "The urinary pathway removes nitrogenous wastes while also helping control water and salt levels. This balance matters because cells work best when the fluid around them stays steady.",
    tags: ["filtration", "urine", "storage", "release"],
  },
};

const quizAdditions = {
  "digestive-system": [
    { type: "FIB", question: "The food pipe is also called the ____.", answer: "oesophagus" },
    { type: "MCQ", question: "Which part stores solid waste before it leaves the body?", options: ["Rectum", "Nasal cavity", "Artery", "Ureter"], answer: "Rectum" },
    { type: "MCQ", question: "Which process is chemical digestion?", options: ["Enzymes breaking large food molecules into smaller ones", "Teeth cutting food into pieces", "Water leaving the body as sweat", "Air moving through the trachea"], answer: "Enzymes breaking large food molecules into smaller ones" },
  ],
  "respiratory-system": [
    { type: "MCQ", question: "Which part is also called the voice box?", options: ["Larynx", "Trachea", "Kidney", "Bladder"], answer: "Larynx" },
    { type: "FIB", question: "Tiny hairs that help move mucus in the air passages are called ____.", answer: "cilia" },
    { type: "MCQ", question: "What happens when the diaphragm contracts and flattens?", options: ["Air is drawn into the lungs", "Food enters the stomach", "Blood leaves through veins", "Urine enters the bladder"], answer: "Air is drawn into the lungs" },
  ],
  "circulatory-system": [
    { type: "FIB", question: "Blood vessels that carry blood away from the heart are ____.", answer: "arteries" },
    { type: "MCQ", question: "What do valves in many veins help prevent?", options: ["Backward flow of blood", "Digestion of starch", "Air entering lungs", "Formation of urine"], answer: "Backward flow of blood" },
    { type: "MCQ", question: "Which waste gas is carried by blood toward the lungs?", options: ["Carbon dioxide", "Oxygen", "Cellulose", "Bile"], answer: "Carbon dioxide" },
  ],
  "excretory-system": [
    { type: "FIB", question: "The kidneys filter ____.", answer: "blood" },
    { type: "MCQ", question: "Which waste product from protein breakdown is removed in urine?", options: ["Urea", "Oxygen", "Cellulose", "Chlorophyll"], answer: "Urea" },
    { type: "MCQ", question: "Which sequence is correct?", options: ["Kidneys, ureters, bladder, urethra", "Bladder, kidneys, urethra, ureters", "Lungs, trachea, bronchi, kidneys", "Heart, arteries, stomach, rectum"], answer: "Kidneys, ureters, bladder, urethra" },
  ],
};

function peopleFor(systemId) {
  return sharedHumanSystemsExtras.scientists.filter((person) => person.relatedSystems.includes(systemId));
}

function normalizeSystem(system) {
  const details = {
    ...(system.notes.partDetails || {}),
    ...(extraDetails[system.id] || {}),
  };
  const parts = system.model.parts.map((part, index) => ({
    ...part,
    file: `models/${part.file}`,
    anchor: [index % 2 === 0 ? 0.2 : -0.2, 0.08, 0.18],
  }));
  if (system.id === "respiratory-system") {
    const pharynx = parts.find((part) => part.id === "pharynx");
    if (pharynx) pharynx.onlyNodes = ["Pharynx"];
    const bronchi = parts.find((part) => part.id === "bronchi-bronchioles");
    if (bronchi) bronchi.onlyNodes = ["Bronchial_Tree", "L_Bronchus", "R_Bronchus"];
    const lungs = parts.find((part) => part.id === "lungs");
    if (lungs) lungs.onlyNodes = ["L_Lung", "R_Lung"];
    const diaphragm = parts.find((part) => part.id === "diaphragm");
    if (diaphragm) {
      diaphragm.noModel = true;
      diaphragm.role = "Breathing muscle shown as a note-only step until a correct diaphragm GLB is available.";
    }
  }
  const selectedPartId = parts[0]?.id;
  return {
    id: system.id,
    title: system.title,
    cover: {
      kicker: "human biology booklet",
      title: system.title.toUpperCase(),
      line: coverLines[system.id] || system.subtitle,
      art: "human-system",
    },
    theme: system.theme,
    pages: {
      immersive: {
        navLabel: "Explore",
        label: "01 Explore",
        title: `Explore the ${system.title}`,
        ftue: system.model.ftue,
        status: `loading ${system.title.toLowerCase()}...`,
      },
      gallery: {
        navLabel: "Path",
        variant: "pathway",
        label: "02 Pathway Map",
        title: pathwayCopy[system.id].title,
        eyebrow: "sequence map",
        ftue: pathwayCopy[system.id].ftue,
        body: pathwayCopy[system.id].body,
        guideTitle: "A Process, Not A List",
        guideBody: "The order matters because each part prepares the next step. Read the pathway as a cause-and-effect chain, where one organ's work sets up the next organ's job.",
        detailTitle: pathwayCopy[system.id].detailTitle,
        detailBody: pathwayCopy[system.id].detailBody,
        tags: pathwayCopy[system.id].tags,
        steps: parts.map((part) => ({
          id: part.id,
          label: part.label,
          action: part.role,
          color: part.color,
        })),
      },
      video: {
        navLabel: "Watch",
        label: "03 Watch",
        title: `Watch ${system.title}`,
        ftue: "Short videos connect the model with real movement, labels, and everyday examples.",
        videos: systemVideos[system.id] || [],
      },
      flashcards: {
        navLabel: "Cards",
        title: `${system.title} Flash Cards`,
        cards: system.flashCards,
      },
      quiz: {
        navLabel: "Quiz",
        title: `Timed ${system.title} Quiz`,
        seconds: 300,
        help: "A strong answer should name the part, describe its job, and connect it to the pathway. Missed questions are clues about which link in the process needs another look.",
        cards: [...system.quiz, ...(quizAdditions[system.id] || [])],
      },
      extras: {
        navLabel: "Extras",
        title: "People Behind The Ideas",
        subtitle: "Scientific ideas grow through observation, debate, tools, and careful comparison across many generations.",
        people: peopleFor(system.id),
      },
    },
    model: {
      assetBase: ".",
      parts,
      camera: {
        position: [0, 0, 5.8],
        target: [0, 0, 0],
        normalizedSize: 3.15,
        rotation: [-0.08, 0.16, 0],
      },
      selectedPartId,
      primaryPartIds: parts.filter((part) => part.primary).map((part) => part.id),
    },
    notes: {
      overview: system.notes.overview,
      partDetails: details,
    },
  };
}

for (const system of Object.values(organSystemBooklets)) {
  const targetDir = join(here, system.id);
  await rm(targetDir, { recursive: true, force: true });
  await cp(templateDir, targetDir, { recursive: true });
  await rm(join(targetDir, "booklet.config.js"), { force: true });
  await mkdir(join(targetDir, "models"), { recursive: true });
  await cp(system.assetFolder, join(targetDir, "models"), { recursive: true });
  const config = normalizeSystem(system);
  const galleryPageLabel = config.pages.gallery.label;
  const galleryNavLabel = config.pages.gallery.navLabel || galleryPageLabel.replace(/^\d+\s*/, "");
  const indexPath = join(targetDir, "index.html");
  const indexHtml = await readFile(indexPath, "utf8");
  await writeFile(
    indexPath,
    indexHtml
      .replaceAll('next - Gallery', `next - ${galleryNavLabel}`)
      .replaceAll('previous - Gallery', `previous - ${galleryNavLabel}`)
      .replaceAll('data-page-label="02 Gallery"', `data-page-label="${galleryPageLabel}"`),
  );
  await writeFile(
    join(targetDir, "booklet.config.js"),
    `export const bookletConfig = ${JSON.stringify(config, null, 2)};\n`,
  );
}
