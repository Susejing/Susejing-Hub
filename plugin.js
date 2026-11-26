// Susejing Hub v0.1.0 — Fase 1
// Centro del ecosistema Susejing: catálogo propio, instalar / abrir.
// Inspiración de flujo (solo idea): un panel de control; implementación y estilo propios.

/** @typedef {{ repo: string, id: string, name: string, blurbEs: string, blurbEn: string, category: string, accent: string }} HubPlugin */

/** @type {HubPlugin[]} */
const CATALOG = [
  // —— Video ——
  {
    repo: "Susejing/AniJing",
    id: "anijing",
    name: "AniJing",
    blurbEs: "Anime en español: muchas fuentes, fichas, episodios y extractores.",
    blurbEn: "Anime in Spanish: many sources, details, episodes and extractors.",
    category: "video",
    accent: "#7C5CFF",
  },
  {
    repo: "Susejing/DoramasJing",
    id: "doramasjing",
    name: "DoramasJing",
    blurbEs: "Doramas en latino y subtitulado: búsqueda, catálogo y episodios.",
    blurbEn: "K-dramas in Latin Spanish and subbed: search, catalog and episodes.",
    category: "video",
    accent: "#FF6B9D",
  },
  {
    repo: "Susejing/Bilibili",
    id: "bilibili",
    name: "Bilibili",
    blurbEs: "Busca y explora videos de Bilibili.",
    blurbEn: "Search and browse Bilibili videos.",
    category: "video",
    accent: "#00A1D6",
  },
  {
    repo: "Susejing/Tubekino",
    id: "tubekino",
    name: "Tubekino",
    blurbEs: "YouTube en Kino: búsqueda, calidad y sección propia.",
    blurbEn: "YouTube in Kino: search, quality and its own section.",
    category: "video",
    accent: "#FF0033",
  },
  {
    repo: "Susejing/Loop",
    id: "loop",
    name: "Loop — TikTok",
    blurbEs: "TikTok en Kino: destacados, canales y sin marca de agua.",
    blurbEn: "TikTok in Kino: highlights, channels, no watermark.",
    category: "video",
    accent: "#FE2C55",
  },
  {
    repo: "Susejing/Facetrack",
    id: "facetrack",
    name: "FaceTrack — Facebook",
    blurbEs: "Videos de Facebook en Kino.",
    blurbEn: "Facebook videos in Kino.",
    category: "video",
    accent: "#1877F2",
  },
  {
    repo: "Susejing/catalogo-net",
    id: "catalogo-net",
    name: "CATALOG//NET",
    blurbEs: "Catálogo masivo de películas, series y anime.",
    blurbEn: "Huge catalog of movies, series and anime.",
    category: "video",
    accent: "#2C3E50",
  },
  // —— Imágenes y estilo ——
  {
    repo: "Susejing/Susejing-Gallery",
    id: "susejing-gallery",
    name: "Susejing Gallery",
    blurbEs: "Galería multi-fuente: wallpapers, galgames, Safe y 18+, favoritos y «Para temas».",
    blurbEn: "Multi-source gallery: wallpapers, galgames, Safe & 18+, favorites and «For themes».",
    category: "style",
    accent: "#C77DFF",
  },
  {
    repo: "Susejing/Susejing-Themes",
    id: "susejing-themes",
    name: "Susejing Themes",
    blurbEs: "Paletas de marca Susejing y guía para armar tu tema con Gallery.",
    blurbEn: "Susejing brand palettes and a guide to build your theme with Gallery.",
    category: "style",
    accent: "#7C5CFF",
  },
  // —— Lectura ——
  {
    repo: "Susejing/kino-mangatrack",
    id: "mangatrack",
    name: "MangaTrack",
    blurbEs: "Manga en español en TV o teléfono, con AniList y varias fuentes.",
    blurbEn: "Manga in Spanish on TV or phone, with AniList and several sources.",
    category: "read",
    accent: "#E8722A",
  },
  // —— Tracking y feeds ——
  {
    repo: "Susejing/kino-anitrack",
    id: "anitrack",
    name: "AniTrack",
    blurbEs: "Progreso de anime y manga en AniList y MyAnimeList.",
    blurbEn: "Anime and manga progress on AniList and MyAnimeList.",
    category: "track",
    accent: "#02A9FF",
  },
  {
    repo: "Susejing/kino-flixtrack",
    id: "flixtrack",
    name: "FlixTrack",
    blurbEs: "Historial de películas y series en Trakt y SIMKL.",
    blurbEn: "Movie and series history on Trakt and SIMKL.",
    category: "track",
    accent: "#F59E0B",
  },
  {
    repo: "Susejing/kino-anifeed",
    id: "anifeed",
    name: "AniFeed",
    blurbEs: "Noticias de anime y calendario de emisión semanal.",
    blurbEn: "Anime news and weekly airing calendar.",
    category: "track",
    accent: "#34D399",
  },
];

const CATEGORIES = [
  { id: "all", labelEs: "Todos", labelEn: "All" },
  { id: "video", labelEs: "Video", labelEn: "Video" },
  { id: "style", labelEs: "Imagen y estilo", labelEn: "Image & style" },
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

/** @param {Record<string, unknown>|null|undefined} installed */
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

function filterChip(cat, active, isEs) {
  const on = active === cat.id;
  return {
    type: "ActionChip",
    key: "cat_" + cat.id,
    labelText: isEs ? cat.labelEs : cat.labelEn,
    selected: on,
    onPressed: {
      setState: { category: cat.id },
    },
  };
}

/**
 * @param {HubPlugin} p
 * @param {boolean} on
 * @param {boolean} isEs
 */
function pluginCard(p, on, isEs) {
  const status = on
    ? isEs
      ? "Instalado"
      : "Installed"
    : isEs
      ? "No instalado"
      : "Not installed";

  const action = on
    ? {
        type: "ElevatedButton",
        icon: "open_in_new",
        labelText: isEs ? "Abrir" : "Open",
        labelTextEn: "Open",
        onPressed: {
          go: { plugin: { repo: p.repo } },
        },
      }
    : {
        type: "ElevatedButton",
        icon: "download",
        labelText: isEs ? "Instalar" : "Install",
        labelTextEn: "Install",
        onPressed: {
          go: { installPlugin: { repo: p.repo } },
        },
      };

  return {
    type: "Card",
    key: "plug_" + p.id,
    children: [
      {
        type: "Column",
        padding: 14,
        gap: 8,
        children: [
          {
            type: "Row",
            mainAxisAlignment: "spaceBetween",
            crossAxisAlignment: "center",
            children: [
              {
                type: "Text",
                text: p.name,
                style: "h3",
              },
              {
                type: "Text",
                text: status,
                style: "caption",
                color: on ? "primary" : "muted",
              },
            ],
          },
          {
            type: "Text",
            text: isEs ? p.blurbEs : p.blurbEn,
            style: "body",
            color: "muted",
          },
          {
            type: "Text",
            text: p.repo,
            style: "caption",
            color: "muted",
          },
          action,
        ],
      },
    ],
  };
}

/**
 * @param {{ category?: string }} state
 * @param {Record<string, unknown>|null|undefined} installed
 */
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

  const cards = list.map(function (p) {
    return pluginCard(p, isInstalled(installed, p.repo), isEs);
  });

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
          ". Toca Instalar o Abrir según lo que necesites."
        : installedCount +
          " of " +
          CATALOG.length +
          " installed. Tap Install or Open as needed.",
      style: "body",
      color: "muted",
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
  ].concat(
    cards.length
      ? cards
      : [
          {
            type: "Text",
            text: isEs ? "Nada en esta categoría." : "Nothing in this category.",
            style: "body",
            color: "muted",
          },
        ]
  );

  const quick = ["Susejing/AniJing", "Susejing/Susejing-Gallery", "Susejing/kino-mangatrack"];
  const quickChildren = [];
  for (const repo of quick) {
    const p = CATALOG.find(function (x) {
      return x.repo === repo;
    });
    if (!p) continue;
    const on = isInstalled(installed, repo);
    quickChildren.push({
      type: "ActionChip",
      key: "q_" + p.id,
      labelText: on ? p.name : (isEs ? "Instalar " : "Install ") + p.name,
      onPressed: on
        ? { go: { plugin: { repo: p.repo } } }
        : { go: { installPlugin: { repo: p.repo } } },
    });
  }

  if (quickChildren.length) {
    bodyChildren.splice(2, 0, {
      type: "Text",
      text: isEs ? "Accesos rápidos" : "Quick access",
      style: "caption",
      color: "muted",
    });
    bodyChildren.splice(3, 0, {
      type: "Wrap",
      spacing: 8,
      runSpacing: 8,
      children: quickChildren,
    });
  }

  return {
    type: "Scaffold",
    appBar: {
      type: "AppBar",
      mergeWithKinoBar: true,
      dense: true,
      title: isEs ? "Susejing Hub" : "Susejing Hub",
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

export async function screenEvent(ctx) {
  const name = ctx && ctx.name;
  const state = (ctx && ctx.state) || {};
  const installed = (ctx && ctx.installed) || null;

  if (name === "open" || name === "state") {
    return {
      state: {
        category: state.category || "all",
      },
      screen: buildScreen(
        { category: state.category || "all" },
        installed
      ),
    };
  }

  return null;
}
