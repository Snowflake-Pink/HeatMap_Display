export const formatHourString = (hour: number): string => {
  return `${hour.toString().padStart(2, '0')}:00`
}

export const formatTimeRange = (hour: number): string => {
  const start = formatHourString(hour)
  const end = formatHourString((hour + 1) % 24)
  return `${start} - ${end}`
}
