# EmbyFlix (Display-only)

Netflix 风格的 Emby 媒体库展示站：
- 不登录
- 不播放
- 首页：最新入库（电影+剧集混合）、电影行、电视剧行
- 支持 Emby 多个 library 聚合

## 运行

1. 复制环境变量
```bash
cp .env.example .env
```

2. 编辑 `.env`，填写：
- EMBY_URL=http://你的emby:端口
- EMBY_API_KEY=你的API key

3. 启动（Docker）
```bash
docker compose up
```

- 前端：http://localhost:3000
- 后端：http://localhost:8787/api/health
