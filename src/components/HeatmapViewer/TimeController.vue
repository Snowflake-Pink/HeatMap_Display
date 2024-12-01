<template>
  <div class="time-controller">
    <el-slider
      v-model="localHour"
      :min="0"
      :max="23"
      :step="1"
      :format-tooltip="formatHour"
      show-stops
      @change="handleHourChange"
    />
    <div class="time-controls">
      <el-button @click="playPause" :type="isPlaying ? 'primary' : 'default'">
        <el-icon>
          <component :is="isPlaying ? 'Pause' : 'VideoPlay'" />
        </el-icon>
        {{ isPlaying ? '暂停' : '播放' }}
      </el-button>
      <el-select v-model="playbackSpeed" class="speed-select">
        <el-option
          v-for="speed in speedOptions"
          :key="speed.value"
          :label="speed.label"
          :value="speed.value"
        />
      </el-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { ElButton, ElSelect, ElOption, ElSlider } from 'element-plus'
import { VideoPlay, Pause } from '@element-plus/icons-vue'
import { formatHourString } from '@/utils/timeUtils'

const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const localHour = ref(props.modelValue)
const isPlaying = ref(false)
const playbackSpeed = ref(1)
let playInterval: number | null = null

const speedOptions = [
  { label: '0.5x', value: 0.5 },
  { label: '1x', value: 1 },
  { label: '2x', value: 2 },
  { label: '4x', value: 4 }
]

const formatHour = (val: number) => formatHourString(val)

const handleHourChange = (value: number) => {
  emit('update:modelValue', value)
}

const playPause = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    startPlayback()
  } else {
    stopPlayback()
  }
}

const startPlayback = () => {
  if (playInterval) return
  
  playInterval = window.setInterval(() => {
    localHour.value = (localHour.value + 1) % 24
    emit('update:modelValue', localHour.value)
  }, 1000 / playbackSpeed.value)
}

const stopPlayback = () => {
  if (playInterval) {
    clearInterval(playInterval)
    playInterval = null
  }
}

watch(playbackSpeed, () => {
  if (isPlaying.value) {
    stopPlayback()
    startPlayback()
  }
})

watch(() => props.modelValue, (newVal) => {
  localHour.value = newVal
})

onUnmounted(() => {
  stopPlayback()
})
</script>

<style scoped>
.time-controller {
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.time-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.speed-select {
  width: 100px;
}
</style>
