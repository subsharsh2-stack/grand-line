// ============================================================
// GRAND LINE — Jikan API Client
// Free MyAnimeList API — no key required
// One Piece anime ID = 21 on MAL
// Docs: https://docs.api.jikan.moe/
// ============================================================

const JIKAN_BASE = "https://api.jikan.moe/v4";
const ONE_PIECE_ID = 21;
const RATE_LIMIT_MS = 500; // Jikan allows ~3 req/sec, we stay safe at 2/sec

// Arc mapping: episode ranges → arc data
// Aligned with the arcs in our database
const ARC_EPISODE_MAP: Array<{
  slug: string;
  name: string;
  saga: string;
  start: number;
  end: number;
}> = [
  { slug: "romance_dawn",    name: "Romance Dawn",          saga: "East Blue Saga",           start: 1,    end: 3    },
  { slug: "orange_town",     name: "Orange Town",           saga: "East Blue Saga",           start: 4,    end: 8    },
  { slug: "syrup_village",   name: "Syrup Village",         saga: "East Blue Saga",           start: 9,    end: 18   },
  { slug: "baratie",         name: "Baratie",               saga: "East Blue Saga",           start: 19,   end: 30   },
  { slug: "arlong_park",     name: "Arlong Park",           saga: "East Blue Saga",           start: 31,   end: 44   },
  { slug: "loguetown",       name: "Loguetown",             saga: "East Blue Saga",           start: 45,   end: 53   },
  { slug: "reverse_mountain",name: "Reverse Mountain",      saga: "Alabasta Saga",            start: 54,   end: 61   },
  { slug: "whisky_peak",     name: "Whisky Peak",           saga: "Alabasta Saga",            start: 62,   end: 67   },
  { slug: "little_garden",   name: "Little Garden",         saga: "Alabasta Saga",            start: 70,   end: 77   },
  { slug: "drum_island",     name: "Drum Island",           saga: "Alabasta Saga",            start: 78,   end: 91   },
  { slug: "alabasta",        name: "Alabasta",              saga: "Alabasta Saga",            start: 92,   end: 130  },
  { slug: "jaya",            name: "Jaya",                  saga: "Sky Island Saga",          start: 144,  end: 152  },
  { slug: "skypiea",         name: "Skypiea",               saga: "Sky Island Saga",          start: 153,  end: 195  },
  { slug: "long_ring",       name: "Long Ring Long Land",   saga: "Water 7 Saga",             start: 207,  end: 219  },
  { slug: "water_seven",     name: "Water Seven",           saga: "Water 7 Saga",             start: 220,  end: 263  },
  { slug: "enies_lobby",     name: "Enies Lobby",           saga: "Water 7 Saga",             start: 264,  end: 312  },
  { slug: "post_enies",      name: "Post-Enies Lobby",      saga: "Water 7 Saga",             start: 313,  end: 325  },
  { slug: "thriller_bark",   name: "Thriller Bark",         saga: "Thriller Bark Saga",       start: 326,  end: 384  },
  { slug: "sabaody",         name: "Sabaody Archipelago",   saga: "Summit War Saga",          start: 385,  end: 405  },
  { slug: "amazon_lily",     name: "Amazon Lily",           saga: "Summit War Saga",          start: 408,  end: 417  },
  { slug: "impel_down",      name: "Impel Down",            saga: "Summit War Saga",          start: 422,  end: 458  },
  { slug: "marineford",      name: "Marineford",            saga: "Summit War Saga",          start: 459,  end: 489  },
  { slug: "post_marineford", name: "Post-Marineford",       saga: "Summit War Saga",          start: 490,  end: 516  },
  { slug: "return_sabaody",  name: "Return to Sabaody",     saga: "Fish-Man Island Saga",     start: 517,  end: 522  },
  { slug: "fish_man_island", name: "Fish-Man Island",       saga: "Fish-Man Island Saga",     start: 523,  end: 574  },
  { slug: "punk_hazard",     name: "Punk Hazard",           saga: "Dressrosa Saga",           start: 575,  end: 629  },
  { slug: "dressrosa",       name: "Dressrosa",             saga: "Dressrosa Saga",           start: 630,  end: 746  },
  { slug: "zou",             name: "Zou",                   saga: "Whole Cake Island Saga",   start: 751,  end: 779  },
  { slug: "whole_cake",      name: "Whole Cake Island",     saga: "Whole Cake Island Saga",   start: 783,  end: 877  },
  { slug: "levely",          name: "Levely",                saga: "Wano Saga",                start: 878,  end: 889  },
  { slug: "wano",            name: "Wano",                  saga: "Wano Saga",                start: 890,  end: 1085 },
  { slug: "egghead",         name: "Egghead",               saga: "Final Saga",               start: 1086, end: 9999 },
];

// Filler episode list (canonical)
const FILLER_EPISODES = new Set([
  54,55,56,57,58,59,60,61,131,132,133,134,135,136,137,138,139,140,141,
  142,143,196,197,198,199,200,201,202,203,204,205,206,220,226,227,
  279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,
  296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,
  313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,
  329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,
  346,347,348,349,350,351,352,353,354,355,356,357,358,359,360,361,362,
  363,364,365,366,367,368,369,370,371,372,373,374,375,376,377,378,
  379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,
  396,397,398,399,400,401,402,403,404,405,406,407,408,409,410,411,412,
  413,414,415,416,417,418,419,420,421,422,423,424,425,426,427,428,429,
  430,431,432,433,434,435,436,437,438,439,440,441,442,443,444,445,446,
  447,448,449,450,451,452,453,454,455,456,457,458,514,515,
  575,578,579,
  747,748,749,750,
  780,781,782,
  907,908,
]);

// Key episodes with special importance
const IMPORTANCE_MAP: Record<number, number> = {
  1: 5,    // Episode 1 - Beginning
  15: 4,   // Usopp joins
  45: 4,   // Loguetown
  61: 4,   // Enter Grand Line
  130: 5,  // Alabasta ends
  195: 4,  // Skypiea ends
  248: 5,  // Merry fire
  263: 5,  // Merry funeral
  283: 5,  // Robin's "I want to live!"
  304: 5,  // Straw Hats vs World Government
  312: 5,  // Enies Lobby end
  319: 5,  // Going Merry farewell
  377: 4,  // Luffy vs Moria
  405: 5,  // Straw Hats scattered
  483: 5,  // Ace dies
  516: 4,  // Timeskip
  574: 4,  // Fish-Man Island
  629: 4,  // Punk Hazard ends
  732: 5,  // Doflamingo defeated
  878: 5,  // Levely begins
  1015: 5, // Luffy "dies"
  1071: 5, // GEAR FIVE
  1085: 4, // Wano ends
};

export interface JikanEpisode {
  mal_id: number;
  title: string;
  title_japanese: string | null;
  aired: string | null;
  synopsis: string | null;
  filler: boolean;
  recap: boolean;
  forum_url: string | null;
}

export interface ProcessedEpisode {
  episode_number: number;
  title: string;
  arc_slug: string | null;
  arc_name: string | null;
  synopsis: string | null;
  crunchyroll_url: string;
  is_filler: boolean;
  is_recap: boolean;
  importance_level: number;
  bounty_reward: number;
  bonus_bounty: number;
}

function getArcForEpisode(epNumber: number): { slug: string; name: string } | null {
  const arc = ARC_EPISODE_MAP.find(
    (a) => epNumber >= a.start && epNumber <= a.end
  );
  return arc ? { slug: arc.slug, name: arc.name } : null;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchEpisodesPage(page: number): Promise<{
  episodes: JikanEpisode[];
  hasMore: boolean;
  lastPage: number;
}> {
  const url = `${JIKAN_BASE}/anime/${ONE_PIECE_ID}/episodes?page=${page}`;

  const response = await fetch(url, {
    headers: { "Accept": "application/json" },
    next: { revalidate: 86400 }, // Cache for 24 hours
  });

  if (!response.ok) {
    if (response.status === 429) {
      // Rate limited — wait and retry
      await sleep(2000);
      return fetchEpisodesPage(page);
    }
    throw new Error(`Jikan API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    episodes: data.data || [],
    hasMore: data.pagination?.has_next_page || false,
    lastPage: data.pagination?.last_visible_page || 1,
  };
}

export async function fetchAllEpisodes(
  onProgress?: (fetched: number, total: number) => void
): Promise<ProcessedEpisode[]> {
  const allEpisodes: ProcessedEpisode[] = [];
  let page = 1;
  let hasMore = true;
  let lastPage = 1;

  while (hasMore) {
    const result = await fetchEpisodesPage(page);
    lastPage = result.lastPage;

    for (const ep of result.episodes) {
      const arc = getArcForEpisode(ep.mal_id);
      const isFiller = ep.filler || FILLER_EPISODES.has(ep.mal_id);
      const importance = IMPORTANCE_MAP[ep.mal_id] || (isFiller ? 1 : 2);
      const baseBounty = isFiller ? 20 : (importance >= 5 ? 100 : importance >= 4 ? 75 : 50);

      allEpisodes.push({
        episode_number: ep.mal_id,
        title: ep.title || `Episode ${ep.mal_id}`,
        arc_slug: arc?.slug || null,
        arc_name: arc?.name || null,
        synopsis: ep.synopsis,
        crunchyroll_url: `https://www.crunchyroll.com/series/GRMG8ZQZR/one-piece`,
        is_filler: isFiller,
        is_recap: ep.recap,
        importance_level: importance,
        bounty_reward: baseBounty,
        bonus_bounty: Math.round(baseBounty * 0.5),
      });
    }

    if (onProgress) {
      onProgress(allEpisodes.length, lastPage * 100);
    }

    hasMore = result.hasMore;
    page++;

    if (hasMore) await sleep(RATE_LIMIT_MS);
  }

  return allEpisodes;
}

export async function fetchSingleEpisode(episodeNumber: number): Promise<ProcessedEpisode | null> {
  try {
    const url = `${JIKAN_BASE}/anime/${ONE_PIECE_ID}/episodes/${episodeNumber}`;
    const response = await fetch(url, { next: { revalidate: 86400 } });
    if (!response.ok) return null;

    const { data: ep } = await response.json();
    const arc = getArcForEpisode(episodeNumber);
    const isFiller = ep.filler || FILLER_EPISODES.has(episodeNumber);
    const importance = IMPORTANCE_MAP[episodeNumber] || (isFiller ? 1 : 2);
    const baseBounty = isFiller ? 20 : (importance >= 5 ? 100 : importance >= 4 ? 75 : 50);

    return {
      episode_number: episodeNumber,
      title: ep.title || `Episode ${episodeNumber}`,
      arc_slug: arc?.slug || null,
      arc_name: arc?.name || null,
      synopsis: ep.synopsis,
      crunchyroll_url: `https://www.crunchyroll.com/series/GRMG8ZQZR/one-piece`,
      is_filler: isFiller,
      is_recap: ep.recap,
      importance_level: importance,
      bounty_reward: baseBounty,
      bonus_bounty: Math.round(baseBounty * 0.5),
    };
  } catch {
    return null;
  }
}

// For client-side "check if new episodes exist" calls
export async function getLatestEpisodeCount(): Promise<number> {
  try {
    const url = `${JIKAN_BASE}/anime/${ONE_PIECE_ID}`;
    const response = await fetch(url, { next: { revalidate: 3600 } });
    const { data } = await response.json();
    return data?.episodes || 0;
  } catch {
    return 0;
  }
}
