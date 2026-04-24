'use client';
import MediaCard from './MediaCard';

export default function MediaRow({ title, items }) {
  if (!items || items.length === 0) {
    return (
      <section className="row-section">
        <h2 className="row-title">{title}</h2>
        <p className="empty-row">暂无内容</p>
      </section>
    );
  }

  return (
    <section className="row-section">
      <h2 className="row-title">{title}</h2>
      <div className="row-scroll">
        {items.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
