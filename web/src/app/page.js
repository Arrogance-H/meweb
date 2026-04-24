import Image from 'next/image';
import MediaRow from '../components/MediaRow';

const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8787';

async function fetchLatest() {
  try {
    const res = await fetch(`${API}/api/latest?limit=20`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function fetchMovies() {
  try {
    const res = await fetch(`${API}/api/movies?limit=20`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
}

async function fetchShows() {
  try {
    const res = await fetch(`${API}/api/shows?limit=20`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
}

// Pick the best item for the hero billboard: prefer items with a backdrop image,
// then fall back through available lists.
function selectHeroItem(latest, movies, shows) {
  return (
    latest.find((i) => i.backdrop) ||
    latest[0] ||
    movies[0] ||
    shows[0] ||
    null
  );
}

export default async function HomePage() {
  const [latest, movies, shows] = await Promise.all([
    fetchLatest(),
    fetchMovies(),
    fetchShows(),
  ]);

  const hero = selectHeroItem(latest, movies, shows);

  return (
    <>
      {/* Hero / Billboard */}
      <section className="hero">
        {hero?.backdrop ? (
          <Image
            className="hero-bg"
            src={hero.backdrop}
            alt={hero.name}
            fill
            unoptimized
            style={{ objectFit: 'cover', filter: 'brightness(0.45)' }}
            priority
          />
        ) : (
          <div className="hero-bg-placeholder" />
        )}
        <div className="hero-gradient" />
        {hero && (
          <div className="hero-content">
            <h1 className="hero-title">{hero.name}</h1>
            <p className="hero-meta">
              {hero.year && <span>{hero.year}</span>}
              {hero.rating && <span> · ⭐ {hero.rating}</span>}
              {hero.genres?.length > 0 && <span> · {hero.genres.slice(0, 2).join(' / ')}</span>}
            </p>
            {hero.overview && (
              <p className="hero-overview">{hero.overview}</p>
            )}
          </div>
        )}
      </section>

      {/* Content rows */}
      <div style={{ marginTop: '-60px', position: 'relative', zIndex: 1 }}>
        <MediaRow title="🕐 最新入库" items={latest} />
        <MediaRow title="🎬 电影" items={movies} />
        <MediaRow title="📺 电视剧" items={shows} />
      </div>
    </>
  );
}
