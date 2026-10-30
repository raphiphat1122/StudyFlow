import { useRef } from 'react';
import { useWindowDimensions } from 'react-native';

export type Tier = 'phone' | 'tablet' | 'desktop';

// คีย์บอร์ดทำให้ความสูงหน้าต่างลดลงเท่านั้น จึงจำความสูงสูงสุดไว้ (รีเซ็ตเมื่อความกว้างเปลี่ยน เช่นหมุนจอ)
// เพื่อไม่ให้เลย์เอาต์สลับขณะพิมพ์
export function useLayout() {
  const { width, height: liveHeight } = useWindowDimensions();
  const base = useRef({ w: width, h: liveHeight });
  if (base.current.w !== width) base.current = { w: width, h: liveHeight };
  else if (liveHeight > base.current.h) base.current.h = liveHeight;

  const height = base.current.h;
  const landscape = width > height;
  const tier: Tier = width < 600 ? 'phone' : width < 1024 ? 'tablet' : 'desktop';
  const twoCol = width >= 800 && landscape;
  return { width, height, liveHeight, landscape, tier, twoCol };
}
