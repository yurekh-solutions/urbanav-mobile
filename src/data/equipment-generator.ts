import type { EquipmentItem } from './equipment-database';
import { getEquipmentImage } from './equipment-images';

// Generate additional equipment items programmatically
function generateItems(
  category: string,
  subcategory: string,
  baseName: string,
  idPrefix: string,
  startIndex: number,
  count: number,
  basePriceRange: [number, number],
  specs: string[],
  tags: string[]
): EquipmentItem[] {
  const items: EquipmentItem[] = [];
  for (let i = 0; i < count; i++) {
    const idx = startIndex + i;
    const priceMultiplier = 1 + (i * 0.15);
    const basePrice = Math.round(basePriceRange[0] + (basePriceRange[1] - basePriceRange[0]) * (i / Math.max(count - 1, 1)));
    const id = `${idPrefix}-gen-${String(idx).padStart(3, '0')}`;
    items.push({
      id,
      name: `${baseName} Model ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) > 0 ? Math.floor(i / 26) + 1 : ''}`,
      category,
      subcategory,
      description: `Professional ${baseName.toLowerCase()} for events and installations`,
      basePrice: Math.round(basePrice * priceMultiplier),
      minPrice: Math.round(basePrice * 0.7),
      maxPrice: Math.round(basePrice * 1.5),
      priceUnit: 'day',
      image: getEquipmentImage(id, category),
      specs,
      tags,
    });
  }
  return items;
}

export const generatedEquipmentDatabase: EquipmentItem[] = [
  ...generateItems('projectors', 'Standard Projectors', 'Standard Projector', 'proj', 100, 30, [1000, 3000], ['3000+ Lumens', 'XGA/WXGA', 'HDMI', 'Portable'], ['projector', 'standard', 'presentation']),
  ...generateItems('projectors', 'HD Projectors', 'HD Projector', 'proj', 200, 25, [2000, 5000], ['Full HD 1080p', '4000+ Lumens', 'HDMI/VGA', 'Wireless'], ['projector', 'hd', '1080p']),
  ...generateItems('projectors', '4K Projectors', '4K UHD Projector', 'proj', 300, 20, [4000, 12000], ['4K UHD', 'HDR10', '3000+ Lumens', 'Smart Features'], ['projector', '4k', 'uhd']),
  ...generateItems('led-walls', 'Indoor LED P2', 'Indoor LED P2 Panel', 'led', 100, 30, [3000, 6000], ['P2-P2.5', 'High Refresh', 'Indoor Rated', 'Modular'], ['led wall', 'indoor', 'p2']),
  ...generateItems('led-walls', 'Outdoor LED', 'Outdoor LED Panel', 'led', 200, 25, [4000, 8000], ['P3.91-P4.81', 'IP65', '5000+ nits', 'Weatherproof'], ['led wall', 'outdoor', 'waterproof']),
  ...generateItems('led-tvs', '55 inch', 'LED TV Display', 'tv', 100, 20, [1500, 5000], ['4K UHD', 'Smart TV', 'HDR', 'Multiple HDMI'], ['led tv', '4k', 'display']),
  ...generateItems('led-tvs', '65 inch', 'Large LED TV', 'tv', 200, 20, [3000, 8000], ['65-75 inch', '4K UHD', 'HDR10+', 'Premium'], ['led tv', 'large', '4k']),
  ...generateItems('sound-systems', 'PA Systems', 'PA System', 'sound', 100, 30, [1500, 10000], ['Powered', 'Multiple Speakers', 'Wireless Mics', 'Mixer'], ['pa system', 'sound', 'event']),
  ...generateItems('sound-systems', 'Line Array', 'Line Array System', 'sound', 200, 20, [10000, 30000], ['Line Array', 'Subwoofers', 'Digital Processing', 'Concert Grade'], ['line array', 'concert', 'professional']),
  ...generateItems('sound-systems', 'Portable Speakers', 'Portable Speaker', 'sound', 300, 25, [1000, 5000], ['Powered', 'Bluetooth', 'Portable', 'Built-in DSP'], ['speaker', 'portable', 'bluetooth']),
  ...generateItems('microphones', 'Wireless Handheld', 'Wireless Microphone', 'mic', 100, 30, [800, 3000], ['UHF Wireless', 'Cardioid', 'Long Battery', 'Clear Audio'], ['microphone', 'wireless', 'handheld']),
  ...generateItems('microphones', 'Wireless Lapel', 'Lapel Microphone', 'mic', 200, 25, [1000, 3000], ['Lapel Clip', 'Wireless', 'Discreet', 'Presentation'], ['microphone', 'lapel', 'wireless']),
  ...generateItems('microphones', 'Wired Mics', 'Wired Microphone', 'mic', 300, 20, [300, 1500], ['XLR', 'Cardioid', 'Durable', 'Professional'], ['microphone', 'wired', 'xlr']),
  ...generateItems('dj-equipment', 'DJ Controllers', 'DJ Controller', 'dj', 100, 20, [2000, 8000], ['Multi-Channel', 'Jog Wheels', 'Software Compatible', 'Effects'], ['dj', 'controller']),
  ...generateItems('dj-equipment', 'DJ Packages', 'DJ Package', 'dj', 200, 15, [5000, 15000], ['Controller', 'Speakers', 'Stands', 'Cables', 'Mic'], ['dj', 'package', 'complete']),
  ...generateItems('cables-accessories', 'HDMI Cables', 'HDMI Cable', 'cable', 100, 20, [150, 600], ['4K Support', 'Gold Plated', 'High Speed', 'Various Lengths'], ['cable', 'hdmi']),
  ...generateItems('cables-accessories', 'Audio Cables', 'Audio Cable', 'cable', 200, 20, [100, 500], ['XLR/TRS', 'Balanced', 'Pro Grade', 'Various Lengths'], ['cable', 'audio']),
  ...generateItems('cables-accessories', 'Stands', 'Equipment Stand', 'cable', 300, 20, [300, 1500], ['Adjustable', 'Portable', 'Sturdy', 'Universal Mount'], ['stand', 'mount', 'adjustable']),
  ...generateItems('lighting', 'PAR Lights', 'LED PAR Light', 'light', 100, 25, [500, 2000], ['RGBW', 'DMX', 'Auto Programs', 'Stage Wash'], ['light', 'par', 'led']),
  ...generateItems('lighting', 'Moving Heads', 'Moving Head Light', 'light', 200, 20, [2000, 6000], ['DMX512', 'Gobos', 'Prism', 'Pan/Tilt'], ['light', 'moving head', 'beam']),
  ...generateItems('lighting', 'Uplights', 'LED Uplight', 'light', 300, 20, [700, 2000], ['Battery Powered', 'RGB', 'Wireless DMX', 'Decoration'], ['light', 'uplight', 'wireless']),
  ...generateItems('screens', 'Tripod Screens', 'Tripod Screen', 'screen', 100, 15, [600, 2000], ['Matte White', 'Portable', 'Easy Setup', 'Various Sizes'], ['screen', 'tripod', 'portable']),
  ...generateItems('screens', 'Fast Fold Screens', 'Fast Fold Screen', 'screen', 200, 15, [2000, 8000], ['Quick Setup', 'Front/Rear', 'Aluminum Frame', 'Professional'], ['screen', 'fast fold']),
  ...generateItems('video-recording', '4K Cameras', 'Professional Camera', 'video', 100, 15, [4000, 10000], ['4K Recording', 'Interchangeable Lens', 'Stabilization', 'Professional'], ['camera', '4k', 'professional']),
  ...generateItems('video-recording', 'Live Streaming', 'Streaming Setup', 'video', 200, 10, [5000, 15000], ['Multi-Camera', 'Encoding', 'Switching', 'Complete Setup'], ['streaming', 'live', 'package']),
];