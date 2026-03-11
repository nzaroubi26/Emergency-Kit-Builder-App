# 10. Performance Considerations

## Goals

| Metric | Target | Source |
|--------|--------|--------|
| Page load | < 3 seconds | PRD NFR7 |
| Visualizer slot update | < 100ms perceived | PRD NFR2 |
| Time to Interactive | < 4 seconds | |
| First Contentful Paint | < 1.5 seconds | |
| Cumulative Layout Shift | < 0.1 | |

## Design Strategies

**lucide-react — named imports only:**
```typescript
import { Zap, Lightbulb, Radio } from 'lucide-react'; // correct
import * as Icons from 'lucide-react'; // never
```

**Visualizer — purely presentational:**
```typescript
// Correct — all calculation in state layer
const slots = calculateSlotState(selectedSubkits);
return <HousingUnitVisualizer slots={slots} />;
```

**CLS prevention:**
1. QuantitySelector container reserves layout space at all times — only opacity and pointer-events change
2. Card grid uses `items-start` so cards grow independently without shifting adjacent cards

**Item list:** ~30–35 items max — no virtualization needed in MVP.

---
