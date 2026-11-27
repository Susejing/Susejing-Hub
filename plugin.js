// Susejing Hub v0.2.0 — Fase 1.5
// Centro del ecosistema Susejing: rejilla de plugins al estilo "Mis plugins".
// Sin CATALOG//NET.

const CATALOG = [
  {
    repo: "Susejing/AniJing",
    id: "anijing",
    name: "AniJing",
    blurbEs: "Anime en español: muchas fuentes, fichas y episodios.",
    blurbEn: "Anime in Spanish: many sources, details and episodes.",
    category: "video",
  },
  {
    repo: "Susejing/DoramasJing",
    id: "doramasjing",
    name: "DoramasJing",
    blurbEs: "Doramas en latino y subtitulado.",
    blurbEn: "K-dramas in Latin Spanish and subbed.",
    category: "video",
  },
  {
    repo: "Susejing/Bilibili",
    id: "bilibili",
    name: "Bilibili",
    blurbEs: "Videos de Bilibili en Kino.",
    blurbEn: "Bilibili videos in Kino.",
    category: "video",
  },
  {
    repo: "Susejing/Tubekino",
    id: "tubekino",
    name: "Tubekino",
    blurbEs: "YouTube en Kino.",
    blurbEn: "YouTube in Kino.",
    category: "video",
  },
  {
    repo: "Susejing/Loop",
    id: "loop",
    name: "Loop",
    blurbEs: "TikTok en Kino.",
    blurbEn: "TikTok in Kino.",
    category: "video",
  },
  {
    repo: "Susejing/Facetrack",
    id: "facetrack",
    name: "FaceTrack",
    blurbEs: "Videos de Facebook en Kino.",
    blurbEn: "Facebook videos in Kino.",
    category: "video",
  },
  {
    repo: "Susejing/Susejing-Gallery",
    id: "susejing-gallery",
    name: "Gallery",
    blurbEs: "Galería multi-fuente y para temas.",
    blurbEn: "Multi-source gallery and for themes.",
    category: "style",
  },
  {
    repo: "Susejing/Susejing-Themes",
    id: "susejing-themes",
    name: "Themes",
    blurbEs: "Paletas Susejing y guía de temas.",
    blurbEn: "Susejing palettes and theme guide.",
    category: "style",
  },
  {
    repo: "Susejing/kino-mangatrack",
    id: "mangatrack",
    name: "MangaTrack",
    blurbEs: "Manga en español.",
    blurbEn: "Manga in Spanish.",
    category: "read",
  },
  {
    repo: "Susejing/kino-anitrack",
    id: "anitrack",
    name: "AniTrack",
    blurbEs: "Progreso en AniList y MAL.",
    blurbEn: "Progress on AniList and MAL.",
    category: "track",
  },
  {
    repo: "Susejing/kino-flixtrack",
    id: "flixtrack",
    name: "FlixTrack",
    blurbEs: "Historial en Trakt y SIMKL.",
    blurbEn: "History on Trakt and SIMKL.",
    category: "track",
  },
  {
    repo: "Susejing/kino-anifeed",
    id: "anifeed",
    name: "AniFeed",
    blurbEs: "Noticias y calendario de anime.",
    blurbEn: "Anime news and airing calendar.",
    category: "track",
  },
];

const CATEGORIES = [
  { id: "all", labelEs: "Todos", labelEn: "All" },
  { id: "video", labelEs: "Video", labelEn: "Video" },
  { id: "style", labelEs: "Estilo", labelEn: "Style" },
  { id: "read", labelEs: "Lectura", labelEn: "Reading" },
  { id: "track", labelEs: "Tracking", labelEn: "Tracking" },
];

function isEsLang() {
  try {
    const l = String(kino.lang || "es").toLowerCase();
    return l.startsWith("es");
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

function filterChip(cat, active, isEs) {
  const on = active === cat.id;
  return {
    type: "ActionChip",
    key: "cat_" + cat.id,
    labelText: isEs ? cat.labelEs : cat.labelEn,
    selected: on,
    onPressed: { setState: { category: cat.id } },
  };
}

function pluginTile(p, on, isEs, index) {
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
    },
  ];

  if (!on) {
    layers.push({
      type: "Container",
      key: "badge_" + p.id,
      alignment: "bottomCenter",
      padding: 4,
      children: [
        {
          type: "Text",
          text: isEs ? "Instalar" : "Install",
          style: "caption",
          color: "primary",
          textAlign: "center",
        },
      ],
    });
  }

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
    text: on ? (isEs ? "Listo" : "Ready") : (isEs ? "Falta" : "Missing"),
    style: "caption",
    textAlign: "center",
    color: on ? "primary" : "muted",
    maxLines: 1,
  };

  const tile = {
    type: "Column",
    key: "tile_" + p.id,
    gap: 4,
    crossAxisAlignment: "center",
    children: [icon, name, status],
  };

  return {
    type: "Card",
    key: "card_" + p.id,
    variant: "plain",
    flush: true,
    onTap: on
      ? { go: { plugin: { repo: p.repo } } }
      : { go: { installPlugin: { repo: p.repo } } },
    children: [tile],
  };
}

function buildScreen(state, installed) {
  const isEs = isEsLang();
  const category = state && state.category ? state.category : "all";

  const list = CATALOG.filter(function (p) {
    return category === "all" || p.category === category;
  });

  let installedCount = 0;
  for (const p of CATALOG) {
    if (isInstalled(installed, p.repo)) installedCount++;
  }

  const chips = {
    type: "Wrap",
    spacing: 8,
    runSpacing: 8,
    children: CATEGORIES.map(function (c) {
      return filterChip(c, category, isEs);
    }),
  };

  const tiles = list.map(function (p, i) {
    return pluginTile(p, isInstalled(installed, p.repo), isEs, i);
  });

  const grid = {
    type: "GridView",
    key: "hubGrid",
    columns: { compact: 3, medium: 4, expanded: 5 },
    gap: 14,
    children: tiles.length
      ? tiles
      : [
          {
            type: "Text",
            text: isEs ? "Nada en esta categoría." : "Nothing in this category.",
            style: "body",
            color: "muted",
          },
        ],
  };

  const quickRepos = [
    "Susejing/AniJing",
    "Susejing/Susejing-Gallery",
    "Susejing/kino-mangatrack",
  ];
  const quickChildren = [];
  for (const repo of quickRepos) {
    const p = CATALOG.find(function (x) {
      return x.repo === repo;
    });
    if (!p) continue;
    const on = isInstalled(installed, repo);
    quickChildren.push({
      type: "ActionChip",
      key: "q_" + p.id,
      labelText: on ? p.name : (isEs ? "+ " : "+ ") + p.name,
      onPressed: on
        ? { go: { plugin: { repo: p.repo } } }
        : { go: { installPlugin: { repo: p.repo } } },
    });
  }

  const bodyChildren = [
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
          ". Toca un icono para abrir o instalar."
        : installedCount +
          " of " +
          CATALOG.length +
          " installed. Tap an icon to open or install.",
      style: "body",
      color: "muted",
    },
    {
      type: "Text",
      text: isEs ? "Accesos rápidos" : "Quick access",
      style: "caption",
      color: "muted",
    },
    {
      type: "Wrap",
      spacing: 8,
      runSpacing: 8,
      children: quickChildren,
    },
    chips,
    {
      type: "Text",
      text:
        category === "all"
          ? isEs
            ? "Todos los plugins"
            : "All plugins"
          : isEs
            ? CATEGORIES.find(function (c) {
                return c.id === category;
              }).labelEs
            : CATEGORIES.find(function (c) {
                return c.id === category;
              }).labelEn,
      style: "h3",
    },
    grid,
    {
      type: "Text",
      text: isEs
        ? "Tip: el estado Listo usa los 8 del manifiesto recommends. El resto se instala igual."
        : "Tip: Ready status uses the 8 manifest recommends. Others install the same way.",
      style: "caption",
      color: "muted",
    },
  ];

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
  return buildScreen(
    { category: (state && state.category) || "all" },
    installed
  );
}

export async function screenEvent(ctx) {
  const name = ctx && ctx.name;
  const state = (ctx && ctx.state) || {};
  const installed = (ctx && ctx.installed) || null;
  if (name === "open" || name === "state") {
    return {
      state: { category: state.category || "all" },
      screen: buildScreen(
        { category: state.category || "all" },
        installed
      ),
    };
  }
  return null;
}
