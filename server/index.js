import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import chatRouter from './routes/chat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载环境变量（本地开发用 .env，生产环境用系统环境变量）
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

// 中间件
app.use(cors());
app.use(express.json());

// 生产环境：托管 Vite 构建出的静态文件
if (isProd) {
  const distPath = join(__dirname, '..', 'dist');
  if (existsSync(distPath)) {
    app.use(express.static(distPath));
  }
}

// API 路由
app.use('/api/chat', chatRouter);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '亲孙通后端服务正常运行 ✅',
    apiKeyConfigured: !!process.env.ANTHROPIC_API_KEY,
  });
});

// 生产环境：所有非 API 路由返回 index.html（支持前端路由）
if (isProd) {
  app.get('/{*splat}', (req, res) => {
    res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
  });
}

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n🌟 亲孙通后端服务启动成功！`);
  console.log(`📡 端口: ${PORT}`);
  console.log(`🌍 模式: ${isProd ? '生产环境' : '开发环境'}`);
  console.log(`🔑 API Key: ${process.env.ANTHROPIC_API_KEY ? '已配置 ✅' : '未配置 ❌'}`);
  console.log(`\n等待连接...\n`);
});
