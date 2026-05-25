export const bookletConfig = {
  "id": "respiratory-system",
  "title": "Respiratory System",
  "cover": {
    "kicker": "human biology booklet",
    "title": "RESPIRATORY SYSTEM",
    "line": "Every breath is a pathway: air is prepared in the nose, guided through tubes, exchanged in the lungs, and connected to oxygen carried by blood.",
    "art": "human-system"
  },
  "theme": {
    "accent": "#2f78b7",
    "secondary": "#7fb7d8",
    "highlight": "#dff2ff"
  },
  "pages": {
    "immersive": {
      "navLabel": "Explore",
      "label": "01 Explore",
      "title": "Explore the Respiratory System",
      "ftue": "Trace the air path, tap a part, and read its job.",
      "status": "loading respiratory system..."
    },
    "gallery": {
      "navLabel": "Path",
      "variant": "pathway",
      "label": "02 Pathway Map",
      "title": "Air Pathway Map",
      "eyebrow": "sequence map",
      "ftue": "Air is prepared, guided, branched, exchanged, and moved by breathing muscles.",
      "body": "Air does not jump straight into the lungs. The nose prepares it, the throat and voice box guide it, the trachea carries it downward, the bronchi divide it into both lungs, and the diaphragm helps pull air in and push air out.",
      "guideTitle": "A Process, Not A List",
      "guideBody": "The order matters because each part prepares the next step. Read the pathway as a cause-and-effect chain, where one organ's work sets up the next organ's job.",
      "detailTitle": "How air reaches blood",
      "detailBody": "The respiratory system is both a pathway and a gas-exchange surface. Oxygen enters the blood in the lungs, and carbon dioxide leaves the blood so it can be exhaled.",
      "tags": [
        "air flow",
        "gas exchange",
        "alveoli",
        "diaphragm"
      ],
      "steps": [
        {
          "id": "nasal-cavity",
          "label": "Nasal Cavity",
          "action": "Filters, warms, and moistens incoming air.",
          "color": "#5aa6d6"
        },
        {
          "id": "pharynx",
          "label": "Pharynx",
          "action": "A shared passage for air and food.",
          "color": "#7aa6c7"
        },
        {
          "id": "larynx",
          "label": "Larynx",
          "action": "Voice box and guarded air passage.",
          "color": "#b28cc2"
        },
        {
          "id": "trachea",
          "label": "Trachea",
          "action": "Windpipe carrying air toward the lungs.",
          "color": "#4f94c4"
        },
        {
          "id": "bronchi-bronchioles",
          "label": "Bronchi & Bronchioles",
          "action": "Branching tubes that distribute air inside the lungs.",
          "color": "#5cae9c"
        },
        {
          "id": "lungs",
          "label": "Lungs",
          "action": "Main organs where gas exchange happens.",
          "color": "#e48f9a"
        },
        {
          "id": "diaphragm",
          "label": "Diaphragm",
          "action": "Breathing muscle shown as a note-only step until a correct diaphragm GLB is available.",
          "color": "#b56f58"
        }
      ]
    },
    "video": {
      "navLabel": "Watch",
      "label": "03 Watch",
      "title": "Watch Respiratory System",
      "ftue": "Short videos connect the model with real movement, labels, and everyday examples.",
      "videos": []
    },
    "flashcards": {
      "navLabel": "Cards",
      "title": "Respiratory System Flash Cards",
      "cards": [
        [
          "What does the nasal cavity do?",
          "It filters, warms, and moistens air before the air travels deeper into the breathing pathway."
        ],
        [
          "What is the trachea?",
          "The trachea is the windpipe, a tube held open by cartilage rings so air can move toward the lungs."
        ],
        [
          "Why do bronchi and bronchioles branch?",
          "They spread air through both lungs so it can reach many tiny air sacs."
        ],
        [
          "Where does gas exchange happen?",
          "Gas exchange happens in the alveoli, where oxygen enters blood and carbon dioxide leaves blood."
        ],
        [
          "What does the diaphragm do?",
          "The diaphragm changes chest volume, helping air move into and out of the lungs."
        ],
        [
          "How are breathing and blood connected?",
          "Breathing brings oxygen to the lungs, and blood carries that oxygen to body cells."
        ]
      ]
    },
    "quiz": {
      "navLabel": "Quiz",
      "title": "Timed Respiratory System Quiz",
      "seconds": 300,
      "help": "A strong answer should name the part, describe its job, and connect it to the pathway. Missed questions are clues about which link in the process needs another look.",
      "cards": [
        {
          "type": "MCQ",
          "question": "Which organ is the windpipe?",
          "options": [
            "Trachea",
            "Larynx",
            "Diaphragm",
            "Pharynx"
          ],
          "answer": "Trachea"
        },
        {
          "type": "FIB",
          "question": "The main organs of breathing are the ____.",
          "answer": "lungs"
        },
        {
          "type": "MCQ",
          "question": "Which part filters, warms, and moistens incoming air?",
          "options": [
            "Nasal cavity",
            "Urethra",
            "Small intestine",
            "Vein"
          ],
          "answer": "Nasal cavity"
        },
        {
          "type": "MCQ",
          "question": "What are alveoli?",
          "options": [
            "Tiny air sacs for gas exchange",
            "Food storage bags",
            "Blood vessel valves",
            "Urine tubes"
          ],
          "answer": "Tiny air sacs for gas exchange"
        },
        {
          "type": "FIB",
          "question": "The dome-shaped muscle below the lungs is the ____.",
          "answer": "diaphragm"
        },
        {
          "type": "MCQ",
          "question": "Which gas moves from the blood into the air sacs to be exhaled?",
          "options": [
            "Carbon dioxide",
            "Oxygen",
            "Glucose",
            "Saliva"
          ],
          "answer": "Carbon dioxide"
        },
        {
          "type": "MCQ",
          "question": "Which part is also called the voice box?",
          "options": [
            "Larynx",
            "Trachea",
            "Kidney",
            "Bladder"
          ],
          "answer": "Larynx"
        },
        {
          "type": "FIB",
          "question": "Tiny hairs that help move mucus in the air passages are called ____.",
          "answer": "cilia"
        },
        {
          "type": "MCQ",
          "question": "What happens when the diaphragm contracts and flattens?",
          "options": [
            "Air is drawn into the lungs",
            "Food enters the stomach",
            "Blood leaves through veins",
            "Urine enters the bladder"
          ],
          "answer": "Air is drawn into the lungs"
        }
      ]
    },
    "extras": {
      "navLabel": "Extras",
      "title": "People Behind The Ideas",
      "subtitle": "Scientific ideas grow through observation, debate, tools, and careful comparison across many generations.",
      "people": [
        {
          "name": "Marcello Malpighi",
          "group": "Global",
          "role": "Observed capillaries and microscopic structures.",
          "initials": "MM",
          "relatedSystems": [
            "circulatory-system",
            "respiratory-system"
          ],
          "detail": "Malpighi used early microscopes to see tiny structures that the naked eye could not show. His observations of capillaries helped explain how arteries and veins connect, and his work on lung tissue helped link breathing with exchange at a microscopic surface."
        },
        {
          "name": "Ibn al-Nafis",
          "group": "Global",
          "role": "Described pulmonary circulation.",
          "initials": "IN",
          "relatedSystems": [
            "circulatory-system",
            "respiratory-system"
          ],
          "detail": "Ibn al-Nafis described blood moving from the heart to the lungs and back toward the heart. This was an important step toward understanding pulmonary circulation, the part of circulation that connects directly with breathing."
        },
        {
          "name": "Charaka Samhita",
          "group": "India",
          "role": "Ancient Indian medical text on body functions and health.",
          "initials": "CS",
          "relatedSystems": [
            "digestive-system",
            "respiratory-system",
            "excretory-system"
          ],
          "detail": "The Charaka Samhita discusses digestion, breathing, body balance, diet, and health in classical Indian medicine. Its importance here is historical: it shows that people were asking systematic questions about body functions, food, air, waste, and wellness across many centuries."
        },
        {
          "name": "Jan Evangelista Purkyne",
          "group": "Global",
          "role": "Studied cells, tissues, and body structures microscopically.",
          "initials": "JP",
          "relatedSystems": [
            "circulatory-system",
            "respiratory-system",
            "excretory-system"
          ],
          "detail": "Purkyne's microscopic studies helped biology move from organ-level description toward tissue and cell-level explanation. This matters because capillaries, alveoli, kidney tubules, and heart conduction all become clearer when tiny structures are studied closely."
        }
      ]
    }
  },
  "model": {
    "assetBase": ".",
    "parts": [
      {
        "id": "nasal-cavity",
        "order": 1,
        "label": "Nasal Cavity",
        "file": "models/2.1 Nasal Cavity.glb",
        "role": "Filters, warms, and moistens incoming air.",
        "color": "#5aa6d6",
        "primary": true,
        "anchor": [
          0.2,
          0.08,
          0.18
        ]
      },
      {
        "id": "pharynx",
        "order": 2,
        "label": "Pharynx",
        "file": "models/2.2 Pharynx.glb",
        "role": "A shared passage for air and food.",
        "color": "#7aa6c7",
        "primary": false,
        "anchor": [
          -0.2,
          0.08,
          0.18
        ],
        "onlyNodes": [
          "Pharynx"
        ]
      },
      {
        "id": "larynx",
        "order": 3,
        "label": "Larynx",
        "file": "models/2.3 Larynx.glb",
        "role": "Voice box and guarded air passage.",
        "color": "#b28cc2",
        "primary": true,
        "anchor": [
          0.2,
          0.08,
          0.18
        ]
      },
      {
        "id": "trachea",
        "order": 4,
        "label": "Trachea",
        "file": "models/2.4 Trachea.glb",
        "role": "Windpipe carrying air toward the lungs.",
        "color": "#4f94c4",
        "primary": true,
        "anchor": [
          -0.2,
          0.08,
          0.18
        ]
      },
      {
        "id": "bronchi-bronchioles",
        "order": 5,
        "label": "Bronchi & Bronchioles",
        "file": "models/2.5 Bronchi & Bronchioles.glb",
        "role": "Branching tubes that distribute air inside the lungs.",
        "color": "#5cae9c",
        "primary": true,
        "anchor": [
          0.2,
          0.08,
          0.18
        ],
        "onlyNodes": [
          "Bronchial_Tree",
          "L_Bronchus",
          "R_Bronchus"
        ]
      },
      {
        "id": "lungs",
        "order": 6,
        "label": "Lungs",
        "file": "models/2.6 Lungs.glb",
        "role": "Main organs where gas exchange happens.",
        "color": "#e48f9a",
        "primary": true,
        "anchor": [
          -0.2,
          0.08,
          0.18
        ],
        "onlyNodes": [
          "L_Lung",
          "R_Lung"
        ]
      },
      {
        "id": "diaphragm",
        "order": 8,
        "label": "Diaphragm",
        "file": "models/2.8 Diaphragm.glb",
        "role": "Breathing muscle shown as a note-only step until a correct diaphragm GLB is available.",
        "color": "#b56f58",
        "primary": true,
        "anchor": [
          0.2,
          0.08,
          0.18
        ],
        "noModel": true
      }
    ],
    "camera": {
      "position": [
        0,
        0,
        5.8
      ],
      "target": [
        0,
        0,
        0
      ],
      "normalizedSize": 3.15,
      "rotation": [
        -0.08,
        0.16,
        0
      ]
    },
    "selectedPartId": "nasal-cavity",
    "primaryPartIds": [
      "nasal-cavity",
      "larynx",
      "trachea",
      "bronchi-bronchioles",
      "lungs",
      "diaphragm"
    ]
  },
  "notes": {
    "overview": {
      "title": "What is breathing?",
      "primary": [
        "nasal-cavity",
        "trachea",
        "bronchi-bronchioles",
        "lungs",
        "diaphragm"
      ],
      "body": "Breathing moves air in and out of the lungs. Oxygen from air enters the blood, while carbon dioxide leaves the body.",
      "secondary": [
        "pharynx",
        "larynx"
      ]
    },
    "partDetails": {
      "nasal-cavity": {
        "body": "The nasal cavity is the first preparation room for air. As air passes through the nose, hairs and sticky mucus trap dust, pollen, and many germs. The moist lining also warms and humidifies the air, which protects the delicate tubes and air sacs deeper inside the body.",
        "fields": {
          "subParts": "Nostrils, nasal hairs, mucus lining, cilia, and blood-rich nasal passages.",
          "action": "Filters, warms, and moistens air before it travels deeper.",
          "keyTerm": "Mucus and cilia.",
          "specialFact": "The rich blood supply in the nasal lining helps warm incoming air quickly.",
          "commonMistake": "The nose is not only for smelling; it is an active part of the breathing pathway."
        }
      },
      "pharynx": {
        "body": "The pharynx is a shared passage behind the nose and mouth. Air passes through it on the way to the larynx, while food passes through it on the way to the oesophagus. Because it is shared, the body needs careful coordination during swallowing.",
        "fields": {
          "subParts": "Nasopharynx, oropharynx, and laryngopharynx.",
          "action": "Directs air and food through a shared throat passage.",
          "keyTerm": "Pharynx: the throat passage.",
          "specialFact": "Swallowing briefly changes the pathway so food is guided away from the airway.",
          "commonMistake": "The pharynx is not only part of digestion or only part of breathing; it is involved in both pathways."
        }
      },
      "larynx": {
        "body": "The larynx is the voice box and a protected doorway to the trachea. It contains vocal cords, which vibrate to produce sound. During swallowing, the epiglottis helps guard the opening so food is less likely to enter the airway.",
        "fields": {
          "subParts": "Vocal cords, epiglottis, cartilage framework, and glottis.",
          "action": "Produces voice and helps protect the airway.",
          "keyTerm": "Epiglottis: a flap that helps guard the airway during swallowing.",
          "specialFact": "Voice changes when the vocal cords vibrate with different tension and airflow.",
          "commonMistake": "The larynx is not the same as the trachea; it sits above the windpipe."
        }
      },
      "trachea": {
        "body": "The trachea, or windpipe, is a strong air tube that runs down the neck into the chest. Ring-like cartilage keeps it open even when you bend your neck or breathe deeply. Its inner lining also helps sweep trapped dust and mucus upward.",
        "fields": {
          "subParts": "C-shaped cartilage rings, ciliated lining, mucus layer, and smooth muscle.",
          "action": "Carries air from the throat toward the lungs.",
          "keyTerm": "Windpipe.",
          "specialFact": "The cartilage rings are incomplete at the back, leaving room for the oesophagus to expand when food passes.",
          "commonMistake": "Food should not enter the trachea; the airway is guarded during swallowing."
        }
      },
      "bronchi-bronchioles": {
        "body": "The bronchi are the two main branches from the trachea. Inside each lung, they divide again and again into smaller bronchioles, like the branches of a tree. This branching pattern spreads air close to millions of tiny air sacs.",
        "fields": {
          "subParts": "Right bronchus, left bronchus, smaller bronchioles, and terminal air passages.",
          "action": "Distributes air through branching tubes inside both lungs.",
          "keyTerm": "Branching air tubes.",
          "specialFact": "The right main bronchus is wider and more vertical than the left, which is one reason inhaled objects more often enter the right side.",
          "commonMistake": "Air does not enter the lungs as one big empty bag; it travels through many branching tubes."
        }
      },
      "lungs": {
        "body": "The lungs are soft, elastic organs filled with branching tubes and tiny air sacs called alveoli. In the alveoli, oxygen moves from air into the blood, while carbon dioxide moves from the blood into the air to be breathed out.",
        "fields": {
          "subParts": "Bronchioles, alveoli, capillaries, elastic tissue, and pleural covering.",
          "action": "Exchange oxygen and carbon dioxide with the blood.",
          "keyTerm": "Alveoli.",
          "specialFact": "Millions of alveoli create a huge surface area, making gas exchange fast enough for everyday activity and exercise.",
          "commonMistake": "Breathing brings gases in and out; cellular respiration is the energy-releasing process inside cells."
        }
      },
      "diaphragm": {
        "body": "The diaphragm is a dome-shaped muscle below the lungs. When it contracts and flattens, the chest cavity becomes larger and air is drawn in. When it relaxes, the chest space becomes smaller and air moves out.",
        "fields": {
          "subParts": "Dome-shaped muscle sheet, central tendon, and attachments to ribs and spine.",
          "action": "Changes chest volume during inhalation and exhalation.",
          "keyTerm": "Breathing muscle.",
          "specialFact": "Hiccups happen when the diaphragm contracts suddenly and the vocal opening snaps shut.",
          "commonMistake": "The lungs do not have their own muscles; breathing depends on surrounding muscles such as the diaphragm."
        }
      }
    }
  }
};
