import './globals.css';

export const metadata = {
  title: 'EmbyFlix',
  description: 'Netflix-style Emby media browser',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body>
        <header className="site-header">
          <div className="header-inner">
            <a href="/" className="logo">EmbyFlix</a>
            <nav className="header-nav">
              <a href="/">首页</a>
              <a href="/movies">电影</a>
              <a href="/shows">电视剧</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p>EmbyFlix · 仅供展示，无需登录</p>
        </footer>
      </body>
    </html>
  );
}
