<template>
  <div class="heatmap-legend">
    <div class="legend-gradient"></div>
    <div class="legend-labels">
      <span>{{ formatValue(min) }}</span>
      <span>{{ formatValue(max) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  min: number
  max: number
}>()

const formatValue = (value: number) => {
  return Math.round(value).toString()
}
</script>

<style scoped>
.heatmap-legend {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.legend-gradient {
  height: 20px;
  width: 200px;
  background: linear-gradient(to right, 
    rgb(255, 255, 255),
    rgb(255, 200, 200),
    rgb(255, 100, 100),
    rgb(255, 0, 0)
  );
  border: 1px solid #ddd;
  border-radius: 2px;
}

.legend-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}
</style>
