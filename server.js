const http = require("node:http");
const { createReadStream, existsSync, statSync } = require("node:fs");
const { extname, join, normalize, relative } = require("node:path");

const root = __dirname;
const port = Number(process.env.PORT || 8031);

const aliases = new Map([
  ["/digestive-system", "booklet/human-systems/digestive-system"],
  ["/respiratory-system", "booklet/human-systems/respiratory-system"],
  ["/circulatory-system", "booklet/human-systems/circulatory-system"],
  ["/excretory-system", "booklet/human-systems/excretory-system"],
  ["/plant-cell", "booklet/plant-cell"],
]);

const bookletLinks = [
  {
    href: "/plant-cell/",
    kicker: "Cell Biology",
    title: "Plant Cell",
    body: "Explore the parts of a plant cell, compare microscope views, review flash cards, and practise with a quiz.",
  },
  {
    href: "/digestive-system/",
    kicker: "Human Biology",
    title: "Digestive System",
    body: "Trace how food is chewed, moved, churned, chemically broken down, absorbed, and cleared as waste.",
  },
  {
    href: "/respiratory-system/",
    kicker: "Human Biology",
    title: "Respiratory System",
    body: "Follow air from the nose to the lungs and connect breathing with gas exchange in the blood.",
  },
  {
    href: "/circulatory-system/",
    kicker: "Human Biology",
    title: "Circulatory System",
    body: "See how the heart, arteries, and veins keep blood moving through the body.",
  },
  {
    href: "/excretory-system/",
    kicker: "Human Biology",
    title: "Excretory System",
    body: "Follow the urinary pathway from blood filtration to urine storage and release.",
  },
];

const types = {
  ".css": "text/css; charset=utf-8",
  ".glb": "model/gltf-binary",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
};

function renderIndex() {
  const cards = bookletLinks
    .map(
      (item) => `
        <a class="card" href="${item.href}">
          <span>${item.kicker}</span>
          <strong>${item.title}</strong>
          <p>${item.body}</p>
        </a>
      `,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Available Science Booklets</title>
    <style>
      :root {
        color: #24304a;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f7f3ea;
      }
      body {
        margin: 0;
      }
      main {
        margin: 0 auto;
        max-width: 1120px;
        padding: 40px 22px 56px;
      }
      header {
        border-bottom: 2px solid rgba(36, 48, 74, 0.16);
        margin-bottom: 28px;
        padding-bottom: 22px;
      }
      h1 {
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(2.2rem, 7vw, 5rem);
        line-height: 0.94;
        margin: 0 0 12px;
      }
      header p {
        font-size: 1.05rem;
        line-height: 1.6;
        margin: 0;
        max-width: 720px;
      }
      .grid {
        display: grid;
        gap: 14px;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      }
      .card {
        background: rgba(255, 255, 255, 0.58);
        border: 1px solid rgba(36, 48, 74, 0.18);
        border-radius: 8px;
        color: inherit;
        display: grid;
        gap: 10px;
        min-height: 170px;
        padding: 18px;
        text-decoration: none;
      }
      .card:hover,
      .card:focus-visible {
        border-color: #b8413e;
        box-shadow: 0 12px 30px rgba(36, 48, 74, 0.12);
        outline: none;
        transform: translateY(-2px);
      }
      .card span {
        color: #6f63a8;
        font-size: 0.78rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .card strong {
        font-family: Georgia, "Times New Roman", serif;
        font-size: 1.55rem;
      }
      .card p {
        line-height: 1.5;
        margin: 0;
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <h1>Science Booklets</h1>
        <p>Choose a booklet to explore a model, read connected notes, revise with cards, and practise key ideas.</p>
      </header>
      <section class="grid" aria-label="Available booklets">
        ${cards}
      </section>
    </main>
  </body>
</html>`;
}

function resolveRequest(url) {
  const requestUrl = new URL(url, `http://localhost:${port}`);
  const pathname = decodeURIComponent(requestUrl.pathname).replace(/\/+$/, "") || "/";

  for (const [alias, target] of aliases) {
    if (pathname === alias || pathname.startsWith(`${alias}/`)) {
      const rest = pathname.slice(alias.length).replace(/^\/+/, "");
      return join(root, target, rest || "index.html");
    }
  }

  return join(root, pathname === "/" ? "index.html" : pathname);
}

function isInsideRoot(filePath) {
  const rel = relative(root, normalize(filePath));
  return rel && !rel.startsWith("..") && !rel.includes("..");
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url || "/", `http://localhost:${port}`);
  const pathname = decodeURIComponent(requestUrl.pathname).replace(/\/+$/, "") || "/";
  if (pathname === "/") {
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    });
    res.end(renderIndex());
    return;
  }

  if (aliases.has(pathname) && requestUrl.pathname !== `${pathname}/`) {
    res.writeHead(302, { Location: `${pathname}/${requestUrl.search}` });
    res.end();
    return;
  }

  let filePath = resolveRequest(req.url || "/");
  if (!isInsideRoot(filePath)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, "index.html");
  }

  if (!existsSync(filePath)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  res.writeHead(200, {
    "Content-Type": types[extname(filePath).toLowerCase()] || "application/octet-stream",
    "Cache-Control": "no-store",
  });
  createReadStream(filePath).pipe(res);
});

server.listen(port, () => {
  console.log(`Serving booklets at http://localhost:${port}`);
});
