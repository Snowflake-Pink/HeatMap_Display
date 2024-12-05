# Heatmap Viewer

A Vue.js-based visualization tool for displaying indoor human traffic data as a heatmap. The system shows a 10x10 grid representing different areas, with color intensity indicating the traffic volume.

![image-20241201120907235](https://cdn.snowflake.pink/2024/12/01/fcc4129c8f40b.png)

## Technology Stack

- Vue 3
- TypeScript
- Element Plus UI
- Day.js for time manipulation
- Vite as build tool

## Requirements  

- Node.js (v16 or above)
- npm or yarn
- Docker (optional)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd indoor-heatmap-viewer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Place your data file:
Put your heatmap data JSON file in `public/data/heat_map_data.json`

4. Start development server: (Run on `localhost:8080` )
```bash
npm run dev
# or
yarn dev
```

## Data Format

The system expects JSON data in the following format:
```json
[
  {
    "timestamp": "2024-12-11 20:32:00",
    "grid_size": [10, 10],
    "counts": {
      "0,0": 5,
      "1,2": 3,
      // ... other position counts
    }
  }
  // ... more time entries
]
```

- `timestamp`: Date and time of the data point
- `grid_size`: Size of the grid [width, height]
- `counts`: Object mapping positions to traffic counts

## Configuration

The base date can be modified in `src/App.vue`:
```typescript
const baseDate = ref('2024-11-19')
```

## Development

### Project Structure
```
src/
├── components/
│   └── HeatmapViewer/
│       ├── index.vue        # Main heatmap component
│       ├── TimeController.vue
│       └── Legend.vue
├── utils/
│   ├── timeUtils.ts
│   └── dataProcessor.ts
├── App.vue
└── main.ts
```

### Building for Production
```bash
npm run build
# or
yarn build
```

## License

[MIT License](LICENSE)
