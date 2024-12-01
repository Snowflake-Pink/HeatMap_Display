<template>
  <div class="time-controller">
    <div class="current-time">{{ formatCurrentTime }}</div>
    <el-slider
      v-model="localMinute"
      :min="0"
      :max="1439"
      :step="1"
      :format-tooltip="formatMinuteTooltip"
      @change="handleMinuteChange"
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
import { ref, watch, onUnmounted, computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps<{
  modelValue: number
  baseDate: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const localMinute = ref(props.modelValue)
const isPlaying = ref(false)
const playbackSpeed = ref(64)
let playInterval: number | null = null

const speedOptions = [
  { label: '1x', value: 1 },
  { label: '4x', value: 4 },
  { label: '16x', value: 16 },
  { label: '32x', value: 32 },
  { label: '64x', value: 64 },
  { label: '128x', value: 128 },
  { label: '256x', value: 256 }
]

const formatMinuteTooltip = (minute: number) => {
  const hours = Math.floor(minute / 60)
  const minutes = minute % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

const formatCurrentTime = computed(() => {
  const date = dayjs(props.baseDate).add(localMinute.value, 'minute')
  return date.format('YYYY-MM-DD HH:mm')
})

const handleMinuteChange = (value: number) => {
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
    localMinute.value = (localMinute.value + 1) % 1440
    emit('update:modelValue', localMinute.value)
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
  localMinute.value = newVal
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
