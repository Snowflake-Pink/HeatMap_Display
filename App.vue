<template>
  <div class="app-container">
    <el-config-provider :locale="zhCn">
      <div v-if="!loading">
        <HeatmapViewer
          v-if="heatmapData.length"
          :data="heatmapData"
          :base-date="baseDate"
        />
        <el-empty v-else description="暂无数据" />
      </div>
      <div v-else class="loading-state">
        <el-loading>加载数据中...</el-loading>
      </div>
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {ElConfigProvider, ElEmpty} from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import HeatmapViewer from '@/components/HeatmapViewer/index.vue'
import type {RawHeatmapData} from '@/utils/dataProcessor.ts'

const heatmapData = ref<RawHeatmapData[]>([])
const loading = ref(true)
const baseDate = ref('2024-11-19')

const loadHeatmapData = async () => {
  try {
    loading.value = true
    const response = await fetch('/data/heat_map_data.json')
    heatmapData.value = await response.json()
  } catch (error) {
    console.error('Failed to load heatmap data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadHeatmapData()
})
</script>

<style>
.app-container {
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}
</style>
