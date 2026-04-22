<template>
  <t-image :src="icon" :alt="alt" class="icon-image">
    <template #error>
      <div class="icon-placeholder">
        <span class="icon-letter">{{ alt.charAt(0).toUpperCase() }}</span>
      </div>
    </template>
  </t-image>
</template>
<script lang="ts" setup>
const fileIcons = import.meta.glob<{ default: string }>('@/assets/icon/file/*.svg', { eager: true })

/** 文件扩展名到图标文件名的映射 */
const extToIcon: Record<string, string> = {
  pdf: 'PDF.svg',
  txt: 'TXT.svg',
  ppt: 'PPT.svg',
  pptx: 'PPT.svg',
  xls: 'excel.svg',
  xlsx: 'excel.svg',
  csv: 'excel.svg',
  doc: 'word.svg',
  docx: 'word.svg',
  html: 'wangye.svg',
  htm: 'wangye.svg',
  jpg: 'tupian.svg',
  jpeg: 'tupian.svg',
  png: 'tupian.svg',
  gif: 'tupian.svg',
  bmp: 'tupian.svg',
  svg: 'tupian.svg',
  webp: 'tupian.svg',
  ico: 'tupian.svg',
  mp4: 'shipin.svg',
  avi: 'shipin.svg',
  mov: 'shipin.svg',
  wmv: 'shipin.svg',
  flv: 'shipin.svg',
  mkv: 'shipin.svg',
  webm: 'shipin.svg',
  mp3: 'yinpin.svg',
  wav: 'yinpin.svg',
  flac: 'yinpin.svg',
  aac: 'yinpin.svg',
  ogg: 'yinpin.svg',
  wma: 'yinpin.svg',
  zip: 'yasuobao.svg',
  rar: 'yasuobao.svg',
  '7z': 'yasuobao.svg',
  tar: 'yasuobao.svg',
  gz: 'yasuobao.svg',
  db: 'shujuku.svg',
  sql: 'shujuku.svg',
  sqlite: 'shujuku.svg',
  mdb: 'shujuku.svg',
  js: 'jiaoben.svg',
  ts: 'jiaoben.svg',
  py: 'jiaoben.svg',
  rb: 'jiaoben.svg',
  php: 'jiaoben.svg',
  sh: 'jiaoben.svg',
  bat: 'jiaoben.svg',
  ps1: 'jiaoben.svg',
  vbs: 'jiaoben.svg',
  psd: 'ps.svg',
  ai: 'ai.svg',
  prproj: 'pr.svg',
  aep: 'ae.svg',
  fl: 'an.svg',
  au: 'au.svg',
  pt: 'pt.svg',
  blend: 'blennd.svg',
  c4d: 'c4d.svg',
  dwg: 'cad.svg',
  dxf: 'cad.svg',
  ma: 'maya.svg',
  mb: 'maya.svg',
  max: 'max.svg',
  hip: 'houdini.svg',
  hipnc: 'houdini.svg',
  ztl: 'zbrush.svg',
  zbp: 'zbrush.svg',
  nk: 'nk.svg',
  arnold: 'Arnold.svg',
  ass: 'Arnold.svg',
  mari: 'Mari.svg',
  redshift: 'Redshift.svg',
  '3ds': 'a-3D.svg',
  obj: 'a-3D.svg',
  fbx: 'a-3D.svg',
  stl: 'a-3D.svg',
  harmony: 'a-ToonBoomHarmony.svg',
  har: 'a-ToonBoomHarmony.svg',
  uasset: 'a-UnrealEngine.svg',
  uproject: 'a-UnrealEngine.svg'
}

function resolveFileIcon(ext: string): string {
  const iconFile = extToIcon[ext.toLowerCase()]
  const target = iconFile ? `/src/assets/icon/file/${iconFile}` : `/src/assets/icon/file/weizhi.svg`
  const matched = Object.entries(fileIcons).find(([p]) => p === target)
  if (matched) {
    return matched[1].default
  }
  console.log(fileIcons['/src/assets/icon/file/weizhi.svg'])
  return fileIcons['/src/assets/icon/file/weizhi.svg'].default
}

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  }
})

const icon = computed(() => {
  if (props.icon === 'directory') {
    return fileIcons['/src/assets/icon/file/wenjianjia.svg'].default
  }
  return resolveFileIcon(props.icon)
})
</script>
<style scoped lang="less">
.icon-image {
  background: transparent !important;
}
</style>
