// Equipment image mapping for database
// Maps equipment IDs to their actual require() image paths

const equipmentImages: { [key: string]: any } = {
  // Projectors
  'proj-001': require('../../assets/equipment/proj-001.jpg'),
  'proj-002': require('../../assets/equipment/proj-002.jpg'),
  'proj-003': require('../../assets/equipment/proj-003.jpg'),
  'proj-004': require('../../assets/equipment/proj-004.jpg'),
  'proj-005': require('../../assets/equipment/proj-005.jpg'),
  'proj-006': require('../../assets/equipment/proj-006.jpg'),
  'proj-007': require('../../assets/equipment/proj-007.jpg'),
  
  // LED Walls
  'led-001': require('../../assets/equipment/led-001.jpg'),
  'led-002': require('../../assets/equipment/led-002.jpg'),
  'led-003': require('../../assets/equipment/led-003.jpg'),
  'led-004': require('../../assets/equipment/led-004.jpg'),
  'led-005': require('../../assets/equipment/led-005.jpg'),
  'led-006': require('../../assets/equipment/led-006.jpg'),
  'led-007': require('../../assets/equipment/led-007.jpg'),
  
  // Sound Systems
  'sound-001': require('../../assets/equipment/sound-001.jpg'),
  'sound-002': require('../../assets/equipment/sound-002.jpg'),
  'sound-003': require('../../assets/equipment/sound-003.jpg'),
  'sound-004': require('../../assets/equipment/sound-004.jpg'),
  'sound-005': require('../../assets/equipment/sound-005.jpg'),
  'sound-006': require('../../assets/equipment/sound-006.jpg'),
  'sound-007': require('../../assets/equipment/sound-007.jpg'),
  
  // Microphones
  'mic-001': require('../../assets/equipment/mic-001.jpg'),
  'mic-002': require('../../assets/equipment/mic-002.jpg'),
  'mic-003': require('../../assets/equipment/mic-003.jpg'),
  'mic-004': require('../../assets/equipment/mic-004.jpg'),
  'mic-005': require('../../assets/equipment/mic-005.jpg'),
  'mic-006': require('../../assets/equipment/mic-006.jpg'),
  'mic-007': require('../../assets/equipment/mic-007.jpg'),
  'mic-008': require('../../assets/equipment/mic-008.jpg'),
  
  // DJ Equipment
  'dj-001': require('../../assets/equipment/dj-001.jpg'),
  'dj-002': require('../../assets/equipment/dj-002.jpg'),
  'dj-003': require('../../assets/equipment/dj-003.jpg'),
  'dj-004': require('../../assets/equipment/dj-004.jpg'),
  'dj-005': require('../../assets/equipment/dj-005.jpg'),
  'dj-006': require('../../assets/equipment/dj-006.jpg'),
  
  // Lighting
  'light-001': require('../../assets/equipment/light-001.jpg'),
  'light-002': require('../../assets/equipment/light-002.jpg'),
  'light-003': require('../../assets/equipment/light-003.jpg'),
  'light-004': require('../../assets/equipment/light-004.jpg'),
  'light-005': require('../../assets/equipment/light-005.jpg'),
  'light-006': require('../../assets/equipment/light-006.jpg'),
  
  // Video Recording
  'video-001': require('../../assets/equipment/video-001.jpg'),
  'video-002': require('../../assets/equipment/video-002.jpg'),
  'video-003': require('../../assets/equipment/video-003.jpg'),
  'video-004': require('../../assets/equipment/video-004.jpg'),
  
  // Screens
  'screen-001': require('../../assets/equipment/screen-001.jpg'),
  'screen-002': require('../../assets/equipment/screen-002.jpg'),
  'screen-003': require('../../assets/equipment/screen-003.jpg'),
  'screen-004': require('../../assets/equipment/screen-004.jpg'),
  'screen-005': require('../../assets/equipment/screen-005.jpg'),
  'screen-006': require('../../assets/equipment/screen-006.jpg'),
  
  // LED TVs
  'tv-001': require('../../assets/equipment/tv-001.jpg'),
  'tv-002': require('../../assets/equipment/tv-002.jpg'),
  'tv-003': require('../../assets/equipment/tv-003.jpg'),
  'tv-004': require('../../assets/equipment/tv-004.jpg'),
  'tv-005': require('../../assets/equipment/tv-005.jpg'),
  'tv-006': require('../../assets/equipment/tv-006.jpg'),
  
  // Cables & Accessories
  'cable-001': require('../../assets/equipment/cable-001.jpg'),
  'cable-002': require('../../assets/equipment/cable-002.jpg'),
  'cable-003': require('../../assets/equipment/cable-003.jpg'),
  'cable-004': require('../../assets/equipment/cable-004.jpg'),
  'cable-005': require('../../assets/equipment/cable-005.jpg'),
  'cable-006': require('../../assets/equipment/cable-006.jpg'),
  'cable-007': require('../../assets/equipment/cable-007.jpg'),
  'cable-008': require('../../assets/equipment/cable-008.jpg'),
};

// Category fallback images (use first item of each category)
const categoryFallbackImages: { [key: string]: any } = {
  'projectors': equipmentImages['proj-001'],
  'led-walls': equipmentImages['led-001'],
  'sound-systems': equipmentImages['sound-001'],
  'microphones': equipmentImages['mic-001'],
  'dj-equipment': equipmentImages['dj-001'],
  'lighting': equipmentImages['light-001'],
  'video-recording': equipmentImages['video-001'],
  'screens': equipmentImages['screen-001'],
  'led-tvs': equipmentImages['tv-001'],
  'cables-accessories': equipmentImages['cable-001'],
};

// Helper function to get equipment image
export function getEquipmentImage(id: string, category: string): any {
  // Try to get exact image
  if (equipmentImages[id]) {
    return equipmentImages[id];
  }
  
  // For generated items, create a hash-based selection to avoid repeats
  if (id.includes('-gen-')) {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const categoryItems = Object.keys(equipmentImages).filter(key => key.startsWith(category.substring(0, 4)));
    if (categoryItems.length > 0) {
      const index = hash % categoryItems.length;
      return equipmentImages[categoryItems[index]];
    }
  }
  
  // Fallback to category image
  return categoryFallbackImages[category] || equipmentImages['proj-001'];
}

export { equipmentImages, categoryFallbackImages };
