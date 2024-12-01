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
      v-model="currentMinute"
      :base-date="baseDate"
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
  baseDate: string
}>()

const currentMinute = ref(0)
const gridContainer = ref<HTMLElement | null>(null)

const currentData = computed(() => {
  return HeatmapDataProcessor.getAggregatedDataForMinute(
    props.data,
    currentMinute.value,
    props.baseDate
  )
})

const valueRange = computed(() => {
  return HeatmapDataProcessor.calculateValueRange(currentData.value)
})

const getCellValue = (row: number, col: number): number => {
  const key = `${row},${col}`
  return currentData.value[key] || 0
}

const calculateColorIntensity = (value: number, min: number, max: number): number => {
  if (value === 0) return 0
  
  const baseIntensity = 0.3
  
  if (max === min) return baseIntensity
  
  const normalizedValue = (value - min) / (max - min)
  const additionalIntensity = 0.7 * normalizedValue
  
  return baseIntensity + additionalIntensity
}

const getCellStyle = (row: number, col: number) => {
  const value = getCellValue(row, col)
  const [min, max] = valueRange.value
  const intensity = calculateColorIntensity(value, min, max)

  if (value === 0) {
    return {
      backgroundColor: '#f7c8cf',
      color: '#333'
    }
  }

  return {
    backgroundColor: `rgb(255, ${Math.round((1 - intensity) * 200)}, ${Math.round((1 - intensity) * 200)})`,
    color: intensity > 0.5 ? '#fff' : '#333',
    fontWeight: 'bold'
  }
}

const updateHeatmap = () => {
  // 更新逻辑如果需要
}
</script>

<style scoped>
.heatmap-viewer {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
}

.heatmap-grid {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background-color: #ddd;
  padding: 1px;
  width: fit-content;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
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
  transition: background-color 0.3s ease;
}

.grid-cell:hover {
  transform: scale(1.05);
  z-index: 1;
}
</style>
