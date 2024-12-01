import dayjs from 'dayjs';
import { groupBy } from 'lodash';

export interface RawHeatmapData {
  timestamp: string;
  grid_size: number[];
  counts: Record<string, number>;
}

export type Position = `${number},${number}`;

export class HeatmapDataProcessor {
  // 按小时聚合数据
  static aggregateByHour(rawData: RawHeatmapData[]): Map<number, Record<Position, number>> {
    const hourlyData = new Map();
    
    // 初始化24小时的数据
    for (let i = 0; i < 24; i++) {
      hourlyData.set(i, {});
    }
    
    // 按小时分组
    const groupedData = groupBy(rawData, item => 
      dayjs(item.timestamp).hour()
    );

    // 处理每个小时的数据
    Object.entries(groupedData).forEach(([hour, data]) => {
      const hourCounts: Record<Position, number> = {};
      
      // 合并同一小时内的数据
      data.forEach(item => {
        Object.entries(item.counts).forEach(([pos, count]) => {
          hourCounts[pos as Position] = (hourCounts[pos as Position] || 0) + count;
        });
      });

      hourlyData.set(parseInt(hour), hourCounts);
    });

    return hourlyData;
  }

  // 计算热力值范围
  static calculateValueRange(data: Map<number, Record<Position, number>>): [number, number] {
    let min = Infinity;
    let max = -Infinity;

    data.forEach(hourData => {
      const values = Object.values(hourData);
      if (values.length > 0) {
        min = Math.min(min, Math.min(...values));
        max = Math.max(max, Math.max(...values));
      }
    });

    return [min === Infinity ? 0 : min, max === -Infinity ? 0 : max];
  }

  static generateEmptyGrid(size: number): Record<Position, number> {
    const grid: Record<Position, number> = {};
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        grid[`${i},${j}` as Position] = 0;
      }
    }
    return grid;
  }
}
