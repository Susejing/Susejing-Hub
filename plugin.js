// Susejing Hub v0.3.0 — Inicio + Mis plugins
// Banner, secciones Video / Manga / Imágenes, rejilla de plugins.

const BANNER =
  "https://raw.githubusercontent.com/Susejing/Susejing-Hub/main/banner.jpg";

const CATALOG = [
  { repo: "Susejing/AniJing", id: "anijing", name: "AniJing", category: "video" },
  { repo: "Susejing/DoramasJing", id: "doramasjing", name: "DoramasJing", category: "video" },
  { repo: "Susejing/Bilibili", id: "bilibili", name: "Bilibili", category: "video" },
  { repo: "Susejing/Tubekino", id: "tubekino", name: "Tubekino", category: "video" },
  { repo: "Susejing/Loop", id: "loop", name: "Loop", category: "video" },
  { repo: "Susejing/Facetrack", id: "facetrack", name: "FaceTrack", category: "video" },
  { repo: "Susejing/Susejing-Gallery", id: "susejing-gallery", name: "Gallery", category: "image" },
  { repo: "Susejing/Susejing-Themes", id: "susejing-themes", name: "Themes", category: "image" },
  { repo: "Susejing/kino-mangatrack", id: "mangatrack", name: "MangaTrack", category: "manga" },
  { repo: "Susejing/kino-anitrack", id: "anitrack", name: "AniTrack", category: "track" },
  { repo: "Susejing/kino-flixtrack", id: "flixtrack", name: "FlixTrack", category: "track" },
  { repo: "Susejing/kino-anifeed", id: "anifeed", name: "AniFeed", category: "track" },
];

function isEsLang() {
  try {
    return String(kino.lang || "es").toLowerCase().startsWith("es");
  } catch (_) {
    return true;
  }
}

function isInstalled(installed, repo) {
  if (!installed || typeof installed !== "object") return false;
  if (installed[repo] === true) return true;
  const short = repo.split("/").pop() || "";
  for (const k of Object.keys(installed)) {
    if (installed[k] !== true) continue;
    if (k === repo || k === short) return true;
    if (String(k).toLowerCase() === repo.toLowerCase()) return true;
  }
  return false;
}

function iconUrl(repo) {
  return "https://raw.githubusercontent.com/" + repo + "/HEAD/icon.png";
}

function pluginTile(p, on, isEs) {
  const layers = [
    {
      type: "Image",
      key: "icon_" + p.id,
      url: iconUrl(p.repo),
      w: 88,
      h: 88,
      radius: "large",
      fit: "cover",
      ...(on ? {} : { opacity: 0.55 }),
      fallback: {
        type: "Stack",
        background: "surfaceVariant",
        children: [
          {
            type: "Text",
            text: (p.name || "?")[0],
            style: "h2",
            textAlign: "center",
          },
        ],
      },
    },
  ];
  const icon = {
    type: "Stack",
    key: "stack_" + p.id,
    w: 88,
    h: 88,
    children: layers,
  };
  const name = {
    type: "Text",
    key: "name_" + p.id,
    text: p.name,
    style: "caption",
    textAlign: "center",
    maxLines: 1,
    ...(on ? {} : { color: "muted" }),
  };
  const status = {
    type: "Text",
    key: "st_" + p.id,
    text: on ? (isEs ? "Listo" : "Ready") : isEs ? "Falta" : "Missing",
    style: "caption",
    textAlign: "center",
    color: on ? "primary" : "muted",
    maxLines: 1,
  };
  return {
    type: "Card",
    key: "card_" + p.id,
    variant: "plain",
    flush: true,
    onTap: on
      ? { go: { plugin: { repo: p.repo } } }
      : { go: { installPlugin: { repo: p.repo } } },
    children: [
      {
        type: "Column",
        key: "tile_" + p.id,
        gap: 4,
        crossAxisAlignment: "center",
        children: [icon, name, status],
      },
    ],
  };
}

function sectionGrid(titleEs, titleEn, plugins, installed, isEs) {
  if (!plugins.length) return null;
  const tiles = plugins.map(function (p) {
    return pluginTile(p, isInstalled(installed, p.repo), isEs);
  });
  return {
    type: "Column",
    key: "sec_" + plugins[0].category,
    gap: 10,
    children: [
      {
        type: "Text",
        text: isEs ? titleEs : titleEn,
        style: "h3",
      },
      {
        type: "GridView",
        key: "grid_" + plugins[0].category,
        columns: { compact: 3, medium: 4, expanded: 5 },
        gap: 12,
        children: tiles,
      },
    ],
  };
}

function buildHome(installed, isEs) {
  let installedCount = 0;
  for (const p of CATALOG) {
    if (isInstalled(installed, p.repo)) installedCount++;
  }

  const video = CATALOG.filter(function (p) {
    return p.category === "video";
  });
  const manga = CATALOG.filter(function (p) {
    return p.category === "manga";
  });
  const image = CATALOG.filter(function (p) {
    return p.category === "image";
  });
  const track = CATALOG.filter(function (p) {
    return p.category === "track";
  });

  const children = [
    {
      type: "Image",
      key: "banner",
      url: BANNER,
      aspect: "1:1",
      radius: "large",
      fit: "cover",
      alt: "Susejing",
    },
    {
      type: "Text",
      text: isEs ? "Ecosistema Susejing" : "Susejing ecosystem",
      style: "title",
    },
    {
      type: "Text",
      text: isEs
        ? "Instalados " +
          installedCount +
          " de " +
          CATALOG.length +
          ". Elige una sección o ve a Mis plugins."
        : installedCount +
          " of " +
          CATALOG.length +
          " installed. Pick a section or open My plugins.",
      style: "body",
      color: "muted",
    },
    {
      type: "heroCard",
      key: "heroHub",
      title: isEs ? "Tu centro Susejing" : "Your Susejing hub",
      text: isEs
        ? "Video, manga e imágenes en un solo lugar. Instala lo que falte y abre con un toque."
        : "Video, manga and images in one place. Install what's missing and open with a tap.",
      image: BANNER,
      buttons: [
        {
          type: "ElevatedButton",
          key: "goMine",
          labelText: isEs ? "Mis plugins" : "My plugins",
          labelTextEn: "My plugins",
          icon: "apps",
          onPressed: { setState: { tab: "mine" } },
        },
        {
          type: "TextButton",
          key: "goGallery",
          labelText: isEs ? "Gallery" : "Gallery",
          labelTextEn: "Gallery",
          onPressed: isInstalled(installed, "Susejing/Susejing-Gallery")
            ? { go: { plugin: { repo: "Susejing/Susejing-Gallery" } } }
            : { go: { installPlugin: { repo: "Susejing/Susejing-Gallery" } } },
        },
      ],
    },
  ];

  const v = sectionGrid("Video", "Video", video, installed, isEs);
  const m = sectionGrid("Manga", "Manga", manga, installed, isEs);
  const i = sectionGrid("Imágenes y estilo", "Images & style", image, installed, isEs);
  const t = sectionGrid("Tracking", "Tracking", track, installed, isEs);
  if (v) children.push(v);
  if (m) children.push(m);
  if (i) children.push(i);
  if (t) children.push(t);

  children.push({
    type: "Text",
    text: isEs
      ? "Próximo: un catálogo de títulos unificado (estilo Contido). Por ahora el Hub organiza tus plugins."
      : "Next: a unified title catalog (Contido style). For now the Hub organizes your plugins.",
    style: "caption",
    color: "muted",
  });

  return children;
}

function buildMine(installed, isEs) {
  let installedCount = 0;
  for (const p of CATALOG) {
    if (isInstalled(installed, p.repo)) installedCount++;
  }
  const tiles = CATALOG.map(function (p) {
    return pluginTile(p, isInstalled(installed, p.repo), isEs);
  });
  return [
    {
      type: "Text",
      text: isEs ? "Mis plugins" : "My plugins",
      style: "title",
    },
    {
      type: "Text",
      text: isEs
        ? "Instalados " +
          installedCount +
          " de " +
          CATALOG.length +
          ". Toca un icono para abrir o instalar."
        : installedCount +
          " of " +
          CATALOG.length +
          " installed. Tap an icon to open or install.",
      style: "body",
      color: "muted",
    },
    {
      type: "GridView",
      key: "mineGrid",
      columns: { compact: 3, medium: 4, expanded: 5 },
      gap: 14,
      children: tiles,
    },
  ];
}

function buildScreen(state, installed) {
  const isEs = isEsLang();
  const tab = state && state.tab === "mine" ? "mine" : "home";

  const bodyChildren = [
    {
      type: "TabBar",
      key: "hubTabs",
      divider: false,
      value: tab,
      onChanged: "hubTab",
      tabs: [
        {
          value: "home",
          label: isEs ? "Inicio" : "Home",
          labelEn: "Home",
        },
        {
          value: "mine",
          label: isEs ? "Mis plugins" : "My plugins",
          labelEn: "My plugins",
        },
      ],
    },
  ].concat(tab === "mine" ? buildMine(installed, isEs) : buildHome(installed, isEs));

  return {
    type: "Scaffold",
    appBar: {
      type: "AppBar",
      mergeWithKinoBar: true,
      dense: true,
      title: "Susejing Hub",
      leading: {
        type: "IconButton",
        icon: "close",
        labelText: isEs ? "Cerrar" : "Close",
        labelTextEn: "Close",
        onPressed: { close: true },
      },
    },
    body: {
      type: "SingleChildScrollView",
      children: [
        {
          type: "Column",
          padding: 16,
          gap: 12,
          children: bodyChildren,
        },
      ],
    },
  };
}

export async function screen(ctx) {
  const installed = (ctx && ctx.installed) || null;
  const state = (ctx && ctx.state) || {};
  return buildScreen({ tab: state.tab || "home" }, installed);
}

export async function screenEvent(ctx) {
  const name = ctx && ctx.name;
  const state = (ctx && ctx.state) || {};
  const installed = (ctx && ctx.installed) || null;

  if (name === "hubTab") {
    const raw = ctx && (ctx.value != null ? ctx.value : ctx.arg);
    const tab = raw === "mine" ? "mine" : "home";
    return {
      state: { tab: tab },
      screen: buildScreen({ tab: tab }, installed),
    };
  }

  if (name === "open" || name === "state") {
    const tab = state.tab === "mine" ? "mine" : "home";
    return {
      state: { tab: tab },
      screen: buildScreen({ tab: tab }, installed),
    };
  }

  return null;
}
