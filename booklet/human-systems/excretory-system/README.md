# Configurable Booklet Template

This folder is the shared renderer for topic booklets. A topic copy should keep these files:

- `index.html`: static page shell
- `styles.css`: notebook visual system
- `app.js`: generic renderer and interactions
- `booklet.config.js`: topic data
- `vendor/three/`: offline Three.js runtime

## Configure A Topic

Edit `booklet.config.js`.

Important sections:

- `cover`: title-page text
- `theme`: accent colours
- `model`: 3D files, labels, anchors, and default camera
- `notes`: overview and linked detail text
- `pages.gallery.slides`: optional image carousel
- `pages.video.videos`: YouTube playlist entries
- `pages.flashcards.cards`: revision cards
- `pages.quiz.cards`: scored MCQ/FIB quiz
- `pages.extras.people`: contributor cards

## 3D Model Parts

Each `model.parts` item should look like:

```js
{
  id: "stomach",
  label: "Stomach",
  file: "1.3 Stmoch.glb",
  role: "Churns food and mixes it with digestive juices.",
  color: "#dc746f",
  primary: true,
  anchor: [0.35, 0.35, 0.24]
}
```

Put GLB files inside the topic folder and set `model.assetBase` to that folder.

## Run Locally

From a topic folder:

```sh
python3 -m http.server 8020
```

Then open `http://localhost:8020`.
