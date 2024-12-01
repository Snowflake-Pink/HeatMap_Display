<template>
  <div class="heatmap-viewer">
    <div class="heatmap-grid" ref="gridContainer">
      <div class="grid-row" v-for="row in 10" :key="row - 1">
        <div 
          v-for="col in 10" 
          :key="col - 1"
          class="grid-cell"
          :style="getCellStyle(row - 1, col - 1)"
        >
          {{ getCellValue(row - 1, col - 1) }}
        </div>
      </div>
    </div>
    
    <Legend :min="valueRange[0]" :max="valueRange[1]" />
    
    <TimeController
      v-model="currentHour"
      @update:modelValue="updateHeatmap"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TimeController from './TimeController.vue'
import Legend from './Legend.vue'
import { HeatmapDataProcessor, type RawHeatmapData } from '@/utils/dataProcessor'

const props = defineProps<{
  data: RawHeatmapData[]
}>()

const currentHour = ref(0)
const gridContainer = ref<HTMLElement | null>(null)

// 处理数据
const hourlyData = computed(() => {
  return HeatmapDataProcessor.aggregateByHour(props.data)
})

// 计算当前显示数据的值范围
const valueRange = computed(() => {
  return HeatmapDataProcessor.calculateValueRange(hourlyData.value)
})

// 获取指定位置的值
const getCellValue = (row: number, col: number): number => {
  const currentData = hourlyData.value.get(currentHour.value) || {}
  const key = `${col},${row}` // 注意：数据中的格式是 "x,y"
  return currentData[key] || 0
}

// 计算单元格的样式（包括背景色）
const getCellStyle = (row: number, col: number) => {
  const value = getCellValue(row, col)
  const [min, max] = valueRange.value
  const intensity = max > min ? (value - min) / (max - min) : 0

  return {
    backgroundColor: `rgba(255, 0, 0, ${intensity})`
  }
}

const updateHeatmap = () => {
  // 可以在这里添加更新时的额外逻辑
}
</script>

<style scoped>
.heatmap-viewer {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  padding: 20px;
}

.heatmap-grid {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background-color: #ddd;
  padding: 1px;
  width: fit-content;
}

.grid-row {
  display: flex;
  gap: 1px;
}

.grid-cell {
  width: 50px;
  height: 50px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #333;
  transition: background-color 0.3s ease;
}
</style>
