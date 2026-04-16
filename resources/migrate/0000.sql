CREATE TABLE quick_apps
(
  id         TEXT PRIMARY KEY,               -- 软件生成的 UUID，如 'q-8f7a3b...'
  created_at INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL DEFAULT 0,
  name       TEXT    NOT NULL DEFAULT '',    -- 显示名称，如 'JSON 格式化'，随便什么奇怪字符都行
  icon       TEXT    NOT NULL DEFAULT '',    -- 物理文件名，如 '8f7a3b.html'
  type       TEXT    NOT NULL DEFAULT 'app', -- 类型：独立窗口(app) / 小部件(widget)
  width      INTEGER          DEFAULT 1,     -- 宽度，独立窗口 px，小部件列数
  height     INTEGER          DEFAULT 1      -- 高度，独立窗口 px，小部件行数
);
