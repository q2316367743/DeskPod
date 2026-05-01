# 权限列表

## 对话框

- `dialog:default`
  - `dialog:allow-message`
  - `dialog:allow-save`
  - `dialog:allow-open`
- `dialog:allow-message`
- `dialog:deny-message`
- `dialog:allow-open`
- `dialog:deny-open`
- `dialog:allow-save`
- `dialog:deny-save`

## 日志

- `log:default`
  - `log:allow-log`
- `log:allow-log`
- `log:deny-log`

## 打开器

- `opener:default`
  - `opener:allow-default-urls`
  - `opener:allow-open-path`
  - `opener:allow-reveal-item-in-dir`
- `opener:allow-default-urls`: 这使得可以使用 mailto：、tel：、https:// 和 http:// 的默认应用打开 URL。
- `opener:allow-open-path`
- `opener:deny-open-path`
- `opener:allow-open-url`
- `opener:deny-open-url`
- `opener:allow-reveal-item-in-dir`
- `opener:deny-reveal-item-in-dir`

## sql

- `sql:default`
  - `sql:allow-close`
  - `sql:allow-load`
  - `sql:allow-select`
- `sql:allow-close`
- `sql:deny-close`
- `sql:allow-execute`
- `sql:deny-execute`
- `sql:allow-load`
- `sql:deny-load`
- `sql:allow-select`
- `sql:deny-select`

## Store

- `store:default`
  - `store:allow-load`
  - `store:allow-get-store`
  - `store:allow-set`
  - `store:allow-get`
  - `store:allow-has`
  - `store:allow-delete`
  - `store:allow-clear`
  - `store:allow-reset`
  - `store:allow-keys`
  - `store:allow-values`
  - `store:allow-entries`
  - `store:allow-length`
  - `store:allow-reload`
  - `store:allow-save`
- `store:allow-clear`
- `store:deny-clear`
- `store:allow-delete`
- `store:deny-delete`
- `store:allow-entries`
- `store:deny-entries`
- `store:allow-get`
- `store:deny-get`
- `store:allow-get-store`
- `store:deny-get-store`
- `store:allow-has`
- `store:deny-has`
- `store:allow-keys`
- `store:deny-keys`
- `store:allow-length`
- `store:deny-length`
- `store:allow-load`
- `store:deny-load`
- `store:allow-reload`
- `store:deny-reload`
- `store:allow-reset`
- `store:deny-reset`
- `store:allow-save`
- `store:deny-save`
- `store:allow-set`
- `store:deny-set`
- `store:allow-values`
- `store:deny-values`

## 核心权限

- `core:default`
  - `core:app:default`
  - `core:event:default`
  - `core:image:default`
  - `core:menu:default`
  - `core:path:default`
  - `core:resources:default`
  - `core:tray:default`
  - `core:webview:default`
  - `core:window:default`

### App 权限

- `core:app:default`
  - `core:app:allow-version`
  - `core:app:allow-name`
  - `core:app:allow-tauri-version`
- `core:app:allow-app-hide`  Enables the app_hide command without any pre-configured scope.
- `core:app:deny-app-hide`  Denies the app_hide command without any pre-configured scope.
- `core:app:allow-app-show`  Enables the app_show command without any pre-configured scope.
- `core:app:deny-app-show`  Denies the app_show command without any pre-configured scope.
- `core:app:allow-default-window-icon`  Enables the default_window_icon command without any pre-configured scope.
- `core:app:deny-default-window-icon`  Denies the default_window_icon command without any pre-configured scope.
- `core:app:allow-name`  Enables the name command without any pre-configured scope.
- `core:app:deny-name`  Denies the name command without any pre-configured scope.
- `core:app:allow-set-app-theme`  Enables the set_app_theme command without any pre-configured scope.
- `core:app:deny-set-app-theme`  Denies the set_app_theme command without any pre-configured scope.
- `core:app:allow-tauri-version`  Enables the tauri_version command without any pre-configured scope.
- `core:app:deny-tauri-version`  Denies the tauri_version command without any pre-configured scope.
- `core:app:allow-version`  Enables the version command without any pre-configured scope.
- `core:app:deny-version`  Denies the version command without any pre-configured scope.

### Event

- `core:event:default`
  - `core:event:allow-listen`
  - `core:event:allow-unlisten`
  - `core:event:allow-emit`
  - `core:event:allow-emit-to`
- `core:event:allow-emit`  Enables the emit command without any pre-configured scope.
- `core:event:deny-emit`  Denies the emit command without any pre-configured scope.
- `core:event:allow-emit-to`  Enables the emit_to command without any pre-configured scope.
- `core:event:deny-emit-to`  Denies the emit_to command without any pre-configured scope.
- `core:event:allow-listen`  Enables the listen command without any pre-configured scope.
- `core:event:deny-listen`  Denies the listen command without any pre-configured scope.
- `core:event:allow-unlisten`  Enables the unlisten command without any pre-configured scope.
- `core:event:deny-unlisten`  Denies the unlisten command without any pre-configured scope.

### Path

- `core:path:default`
  - `core:path:allow-resolve-directory`
  - `core:path:allow-resolve`
  - `core:path:allow-normalize`
  - `core:path:allow-join`
  - `core:path:allow-dirname`
  - `core:path:allow-extname`
  - `core:path:allow-basename`
  - `core:path:allow-is-absolute`
- `core:path:allow-basename`  Enables the basename command without any pre-configured scope.
- `core:path:deny-basename`  Denies the basename command without any pre-configured scope.
- `core:path:allow-dirname`  Enables the dirname command without any pre-configured scope.
- `core:path:deny-dirname`  Denies the dirname command without any pre-configured scope.
- `core:path:allow-extname`  Enables the extname command without any pre-configured scope.
- `core:path:deny-extname`  Denies the extname command without any pre-configured scope.
- `core:path:allow-is-absolute`  Enables the is_absolute command without any pre-configured scope.
- `core:path:deny-is-absolute`  Denies the is_absolute command without any pre-configured scope.
- `core:path:allow-join`  Enables the join command without any pre-configured scope.
- `core:path:deny-join`  Denies the join command without any pre-configured scope.
- `core:path:allow-normalize`  Enables the normalize command without any pre-configured scope.
- `core:path:deny-normalize`  Denies the normalize command without any pre-configured scope.
- `core:path:allow-resolve`  Enables the resolve command without any pre-configured scope.
- `core:path:deny-resolve`  Denies the resolve command without any pre-configured scope.
- `core:path:allow-resolve-directory`  Enables the resolve_directory command without any pre-configured scope.
- `core:path:deny-resolve-directory`  Denies the resolve_directory command without any pre-configured scope.

### Webview

- `core:webview:default`
  - `core:webview:allow-get-all-webviews`
  - `core:webview:allow-webview-position`
  - `core:webview:allow-webview-size`
  - `core:webview:allow-internal-toggle-devtools`
- `core:webview:allow-clear-all-browsing-data`	Enables the clear_all_browsing_data command without any pre-configured scope.
- `core:webview:deny-clear-all-browsing-data`	Denies the clear_all_browsing_data command without any pre-configured scope.
- `core:webview:allow-create-webview`	Enables the create_webview command without any pre-configured scope.
- `core:webview:deny-create-webview`	Denies the create_webview command without any pre-configured scope.
- `core:webview:allow-create-webview-window`	Enables the create_webview_window command without any pre-configured scope.
- `core:webview:deny-create-webview-window`	Denies the create_webview_window command without any pre-configured scope.
- `core:webview:allow-get-all-webviews`	Enables the get_all_webviews command without any pre-configured scope.
- `core:webview:deny-get-all-webviews`	Denies the get_all_webviews command without any pre-configured scope.
- `core:webview:allow-internal-toggle-devtools`	Enables the internal_toggle_devtools command without any pre-configured scope.
- `core:webview:deny-internal-toggle-devtools`	Denies the internal_toggle_devtools command without any pre-configured scope.
- `core:webview:allow-print`	Enables the print command without any pre-configured scope.
- `core:webview:deny-print`	Denies the print command without any pre-configured scope.
- `core:webview:allow-reparent`	Enables the reparent command without any pre-configured scope.
- `core:webview:deny-reparent`	Denies the reparent command without any pre-configured scope.
- `core:webview:allow-set-webview-focus`	Enables the set_webview_focus command without any pre-configured scope.
- `core:webview:deny-set-webview-focus`	Denies the set_webview_focus command without any pre-configured scope.
- `core:webview:allow-set-webview-position`	Enables the set_webview_position command without any pre-configured scope.
- `core:webview:deny-set-webview-position`	Denies the set_webview_position command without any pre-configured scope.
- `core:webview:allow-set-webview-size`	Enables the set_webview_size command without any pre-configured scope.
- `core:webview:deny-set-webview-size`	Denies the set_webview_size command without any pre-configured scope.
- `core:webview:allow-set-webview-zoom`	Enables the set_webview_zoom command without any pre-configured scope.
- `core:webview:deny-set-webview-zoom`	Denies the set_webview_zoom command without any pre-configured scope.
- `core:webview:allow-webview-close`	Enables the webview_close command without any pre-configured scope.
- `core:webview:deny-webview-close`	Denies the webview_close command without any pre-configured scope.
- `core:webview:allow-webview-hide`	Enables the webview_hide command without any pre-configured scope.
- `core:webview:deny-webview-hide`	Denies the webview_hide command without any pre-configured scope.
- `core:webview:allow-webview-position`	Enables the webview_position command without any pre-configured scope.
- `core:webview:deny-webview-position`	Denies the webview_position command without any pre-configured scope.
- `core:webview:allow-webview-show`	Enables the webview_show command without any pre-configured scope.
- `core:webview:deny-webview-show`	Denies the webview_show command without any pre-configured scope.
- `core:webview:allow-webview-size`	Enables the webview_size command without any pre-configured scope.
- `core:webview:deny-webview-size`	Denies the webview_size command without any pre-configured scope.


