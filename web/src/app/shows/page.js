import MediaCard from '../../components/MediaCard';

const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8787';

async function fetchShows(page = 1) {
  try {
    const res = await fetch(`${API}/api/shows?limit=40&page=${page}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return { items: [], total: 0 };
    return res.json();
  } catch {
    return { items: [], total: 0 };
  }
}

export default async function ShowsPage({ searchParams }) {
  const page = Math.max(parseInt((await searchParams)?.page, 10) || 1, 1);
  const data = await fetchShows(page);
  const items = data.items || [];
  const total = data.total || 0;
  const totalPages = Math.ceil(total / 40);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">📺 电视剧</h1>
        <p className="page-subtitle">共 {total} 部剧集</p>
      </div>

      {items.length === 0 ? (
        <p className="empty-row">暂无电视剧内容</p>
      ) : (
        <div className="media-grid">
          {items.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <a href={page > 1 ? `/shows?page=${page - 1}` : undefined}>
            <button disabled={page <= 1}>上一页</button>
          </a>
          <span>第 {page} / {totalPages} 页</span>
          <a href={page < totalPages ? `/shows?page=${page + 1}` : undefined}>
            <button disabled={page >= totalPages}>下一页</button>
          </a>
        </div>
      )}
    </>
  );
}
