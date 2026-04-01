'use client';
import Image from 'next/image';

export default function MediaCard({ item }) {
  const typeLabel = item.type === 'Movie' ? '电影' : '剧集';
  const year = item.year ? ` · ${item.year}` : '';
  const rating = item.rating ? ` · ⭐ ${item.rating}` : '';

  return (
    <div className="media-card">
      {item.type && (
        <span className="card-type-badge">{typeLabel}</span>
      )}

      {item.poster ? (
        <Image
          className="card-poster"
          src={item.poster}
          alt={item.name}
          width={160}
          height={240}
          unoptimized
          style={{ objectFit: 'cover', height: '240px', width: '160px' }}
        />
      ) : (
        <div className="card-poster-placeholder">
          <span className="placeholder-icon">{item.type === 'Movie' ? '🎬' : '📺'}</span>
          <span>{item.name}</span>
        </div>
      )}

      <div className="card-overlay">
        <div className="card-name" title={item.name}>{item.name}</div>
        <div className="card-meta">{year}{rating}</div>
      </div>
    </div>
  );
}
