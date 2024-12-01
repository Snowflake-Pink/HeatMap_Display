// types/heatmap.ts

// 原始数据接口
interface RawHeatmapData {
  timestamp: string;
  grid_size: number[];
  counts: Record<string, number>;
}

// 处理后的小时数据接口
interface HourlyHeatmapData {
  hour: number;
  gridData: {
    position: [number, number];
    value: number;
  }[];
  maxValue: number;
}

// 位置类型
type Position = `${number},${number}`;
