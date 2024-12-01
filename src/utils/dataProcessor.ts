import dayjs from 'dayjs';

export interface RawHeatmapData {
  timestamp: string;
  grid_size: number[];
  counts: Record<Position, number>;
}

export type Position = `${number},${number}`;

export class HeatmapDataProcessor {
  static getMinuteFromTimestamp(timestamp: string): number {
    const date = dayjs(timestamp);
    return date.hour() * 60 + date.minute();
  }

  // 获取指定分钟及其前60分钟的累计数据
  static getAggregatedDataForMinute(
    data: RawHeatmapData[],
    targetMinute: number,
    baseDate: string
  ): Record<Position, number> {
    const targetTime = dayjs(baseDate).add(targetMinute, 'minute');
    const startTime = targetTime.subtract(60, 'minute');
    
    // 初始化网格数据
    const aggregatedData: Record<Position, number> = {};
    
    // 筛选并累加时间范围内的数据
    data.forEach(entry => {
      const entryTime = dayjs(entry.timestamp);
      if (entryTime.isAfter(startTime) && entryTime.isBefore(targetTime) || entryTime.isSame(targetTime)) {
        Object.entries(entry.counts).forEach(([pos, count]) => {
          aggregatedData[pos as Position] = (aggregatedData[pos as Position] || 0) + count;
        });
      }
    });
    
    return aggregatedData;
  }

  static calculateValueRange(data: Record<Position, number>): [number, number] {
    const values = Object.values(data);
    if (values.length === 0) return [0, 0];
    
    return [
      Math.min(...values),
      Math.max(...values)
    ];
  }
}
