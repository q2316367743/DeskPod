CREATE TABLE quick_app
(
  id         TEXT PRIMARY KEY,                  -- 软件生成的 UUID，如 'q-8f7a3b...'
  created_at INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL DEFAULT 0,
  name       TEXT    NOT NULL DEFAULT '',       -- 显示名称，如 'JSON 格式化'，随便什么奇怪字符都行
  root       TEXT    NOT NULL DEFAULT '',       -- 根目录
  entry      TEXT    NOT NULL DEFAULT '',       -- 入口文件
  icon       TEXT    NOT NULL DEFAULT '',       -- 图标文件
  `from`     TEXT    NOT NULL DEFAULT 'ai',     -- 来源
  type       TEXT    NOT NULL DEFAULT 'window', -- 类型：独立窗口(window) / 小部件(widget)
  width      INTEGER          DEFAULT 1,        -- 宽度，独立窗口 px，小部件列数
  height     INTEGER          DEFAULT 1         -- 高度，独立窗口 px，小部件行数1
);

CREATE TABLE plugin_develop
(
  id         TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL DEFAULT 0,

  name       TEXT    NOT NULL DEFAULT '',
  path       TEXT    NOT NULL DEFAULT ''
);
