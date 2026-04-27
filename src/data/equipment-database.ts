// Comprehensive AV Equipment Database with Pricing (INR)
// All prices are per day rental rates

export { equipmentImages, categoryFallbackImages, getEquipmentImage } from './equipment-images';

export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  basePrice: number;
  minPrice: number;
  maxPrice: number;
  priceUnit: 'hour' | 'day' | 'event';
  image: string;
  specs: string[];
  tags: string[];
  popular?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  subcategories: string[];
}

export const categories: Category[] = [
  { id: 'projectors', name: 'Projectors', icon: 'Projector', description: 'High-quality projectors for events, presentations, and screenings', subcategories: ['Standard Projectors', 'HD Projectors', '4K Projectors', 'Short Throw', 'Ultra Short Throw', 'Large Venue'] },
  { id: 'led-walls', name: 'LED Walls', icon: 'LayoutGrid', description: 'Stunning LED video walls for impactful visual displays', subcategories: ['Indoor LED P2', 'Indoor LED P3', 'Indoor LED P4', 'Outdoor LED', 'Curved LED', 'Transparent LED'] },
  { id: 'led-tvs', name: 'LED TVs', icon: 'Tv', description: 'Professional LED TVs for any occasion', subcategories: ['32 inch', '43 inch', '50 inch', '55 inch', '65 inch', '75 inch', '85 inch'] },
  { id: 'sound-systems', name: 'Sound Systems', icon: 'Speaker', description: 'Professional audio equipment for crystal clear sound', subcategories: ['PA Systems', 'Line Array', 'DJ Systems', 'Portable Speakers', 'Subwoofers', 'Stage Monitors'] },
  { id: 'microphones', name: 'Microphones', icon: 'Mic', description: 'Wired and wireless microphones for every need', subcategories: ['Wireless Handheld', 'Wireless Lapel', 'Wired Mics', 'Headset Mics', 'Conference Mics', 'Karaoke Mics'] },
  { id: 'dj-equipment', name: 'DJ Equipment', icon: 'Music', description: 'Complete DJ setups for parties and events', subcategories: ['DJ Controllers', 'DJ Mixers', 'Turntables', 'CDJs', 'DJ Packages'] },
  { id: 'cables-accessories', name: 'Cables & Accessories', icon: 'Cable', description: 'All cables, adapters, and AV accessories', subcategories: ['HDMI Cables', 'VGA Cables', 'Audio Cables', 'Power Cables', 'Adapters', 'Stands', 'Mounts'] },
  { id: 'lighting', name: 'Stage Lighting', icon: 'Lightbulb', description: 'Professional lighting for events and stages', subcategories: ['PAR Lights', 'Moving Heads', 'Uplights', 'Follow Spots', 'Laser Lights', 'Fog Machines'] },
  { id: 'screens', name: 'Projection Screens', icon: 'Monitor', description: 'Tripod, fast-fold, and motorized screens', subcategories: ['Tripod Screens', 'Fast Fold Screens', 'Motorized Screens', 'Rear Projection', 'Inflatable Screens'] },
  { id: 'video-recording', name: 'Video Recording', icon: 'Video', description: 'Cameras and recording equipment', subcategories: ['4K Cameras', 'HD Cameras', 'Video Switchers', 'Live Streaming', 'Recording Packages'] },
];

import { getEquipmentImage as getImg } from './equipment-images';

export const equipmentDatabase: EquipmentItem[] = [
  // PROJECTORS
  { id: 'proj-001', name: 'Epson EB-E01 3300 Lumens Projector', category: 'projectors', subcategory: 'Standard Projectors', description: 'Reliable 3300 lumens XGA projector perfect for small to medium meetings and presentations', basePrice: 1200, minPrice: 800, maxPrice: 1500, priceUnit: 'day', image: getImg('proj-001', 'projectors'), specs: ['3300 Lumens', 'XGA 1024x768', '15000:1 Contrast', 'HDMI/VGA Input'], tags: ['projector', 'epson', '3300 lumens', 'xga', 'office', 'presentation'] },
  { id: 'proj-002', name: 'Epson EB-FH52 4000 Lumens Full HD', category: 'projectors', subcategory: 'HD Projectors', description: 'Full HD 1080p projector with 4000 lumens brightness for clear, vibrant images', basePrice: 2500, minPrice: 1800, maxPrice: 3200, priceUnit: 'day', image: getImg('proj-002', 'projectors'), specs: ['4000 Lumens', 'Full HD 1080p', '16000:1 Contrast', 'Built-in Speaker'], tags: ['projector', 'epson', '4000 lumens', 'full hd', '1080p', 'home theater'], popular: true },
  { id: 'proj-003', name: 'BenQ TK700STi 4K HDR Gaming Projector', category: 'projectors', subcategory: '4K Projectors', description: 'True 4K UHD HDR projector with 3000 lumens and low input lag for gaming and movies', basePrice: 4500, minPrice: 3500, maxPrice: 6000, priceUnit: 'day', image: getImg('proj-003', 'projectors'), specs: ['3000 Lumens', '4K UHD 3840x2160', 'HDR10 Support', 'Android TV Built-in'], tags: ['projector', 'benq', '4k', 'uhd', 'hdr', 'gaming', 'home theater'], popular: true },
  { id: 'proj-004', name: 'Epson EB-L530U 5200 Lumens Laser', category: 'projectors', subcategory: 'Large Venue', description: 'High-brightness WUXGA laser projector for large venues and events', basePrice: 8000, minPrice: 6000, maxPrice: 10000, priceUnit: 'day', image: getImg('proj-004', 'projectors'), specs: ['5200 Lumens', 'WUXGA 1920x1200', 'Laser Light Source', '20000 Hours Life'], tags: ['projector', 'epson', '5200 lumens', 'laser', 'wuxga', 'large venue'] },
  { id: 'proj-005', name: 'ViewSonic PS501X Short Throw', category: 'projectors', subcategory: 'Short Throw', description: 'Short throw projector perfect for small rooms and classrooms', basePrice: 2000, minPrice: 1500, maxPrice: 2800, priceUnit: 'day', image: getImg('proj-005', 'projectors'), specs: ['3500 Lumens', 'XGA 1024x768', '0.61 Short Throw', '3D Ready'], tags: ['projector', 'viewsonic', 'short throw', '3500 lumens', 'classroom'] },
  { id: 'proj-006', name: 'Epson EB-700U Ultra Short Throw', category: 'projectors', subcategory: 'Ultra Short Throw', description: 'Ultra short throw laser projector with interactive features', basePrice: 5500, minPrice: 4000, maxPrice: 7000, priceUnit: 'day', image: getImg('proj-006', 'projectors'), specs: ['4000 Lumens', 'WUXGA', 'Ultra Short Throw', 'Interactive Pen'], tags: ['projector', 'epson', 'ultra short throw', 'laser', 'interactive'] },
  { id: 'proj-007', name: 'Panasonic PT-RZ990 9400 Lumens Laser', category: 'projectors', subcategory: 'Large Venue', description: 'Professional large venue laser projector with stunning brightness', basePrice: 15000, minPrice: 12000, maxPrice: 20000, priceUnit: 'day', image: getImg('proj-007', 'projectors'), specs: ['9400 Lumens', 'WUXGA', 'Laser 20000h', '4K Signal Input'], tags: ['projector', 'panasonic', '9400 lumens', 'laser', 'large venue', 'concert'] },
  // LED WALLS
  { id: 'led-001', name: 'P2.5 Indoor LED Wall (1sqm)', category: 'led-walls', subcategory: 'Indoor LED P2', description: 'High-resolution P2.5 LED wall perfect for indoor events and conferences', basePrice: 3500, minPrice: 2500, maxPrice: 5000, priceUnit: 'day', image: getImg('led-001', 'led-walls'), specs: ['P2.5 Pixel Pitch', '3840Hz Refresh', '160000 dots/sqm', '5000 nits'], tags: ['led wall', 'p2.5', 'indoor', 'high resolution', 'conference'], popular: true },
  { id: 'led-002', name: 'P3 Indoor LED Wall (1sqm)', category: 'led-walls', subcategory: 'Indoor LED P3', description: 'Versatile P3 LED wall for indoor events with excellent clarity', basePrice: 2800, minPrice: 2000, maxPrice: 4000, priceUnit: 'day', image: getImg('led-002', 'led-walls'), specs: ['P3 Pixel Pitch', '3840Hz Refresh', '111111 dots/sqm', '4500 nits'], tags: ['led wall', 'p3', 'indoor', 'event', 'stage'] },
  { id: 'led-003', name: 'P4 Indoor LED Wall (1sqm)', category: 'led-walls', subcategory: 'Indoor LED P4', description: 'Cost-effective P4 LED wall for indoor advertising and events', basePrice: 2000, minPrice: 1500, maxPrice: 3000, priceUnit: 'day', image: getImg('led-003', 'led-walls'), specs: ['P4 Pixel Pitch', '1920Hz Refresh', '62500 dots/sqm', '4000 nits'], tags: ['led wall', 'p4', 'indoor', 'advertising', 'budget'] },
  { id: 'led-004', name: 'P3.91 Outdoor LED Wall (1sqm)', category: 'led-walls', subcategory: 'Outdoor LED', description: 'Weatherproof outdoor LED wall for concerts and outdoor events', basePrice: 4500, minPrice: 3500, maxPrice: 6000, priceUnit: 'day', image: getImg('led-004', 'led-walls'), specs: ['P3.91 Pixel Pitch', 'IP65 Waterproof', '5500 nits', '500x500mm Panels'], tags: ['led wall', 'p3.91', 'outdoor', 'waterproof', 'concert'], popular: true },
  { id: 'led-005', name: 'P4.81 Outdoor LED Wall (1sqm)', category: 'led-walls', subcategory: 'Outdoor LED', description: 'Rugged outdoor LED wall for festivals and large outdoor gatherings', basePrice: 3500, minPrice: 2800, maxPrice: 5000, priceUnit: 'day', image: getImg('led-005', 'led-walls'), specs: ['P4.81 Pixel Pitch', 'IP65 Waterproof', '6000 nits', '500x500mm Panels'], tags: ['led wall', 'p4.81', 'outdoor', 'festival', 'waterproof'] },
  { id: 'led-006', name: 'Curved LED Wall P2.9 (Flexible)', category: 'led-walls', subcategory: 'Curved LED', description: 'Flexible curved LED wall for creative stage designs', basePrice: 5000, minPrice: 4000, maxPrice: 7000, priceUnit: 'day', image: getImg('led-006', 'led-walls'), specs: ['P2.9 Pixel Pitch', 'Curved ±15°', '3840Hz Refresh', 'Magnetic Modules'], tags: ['led wall', 'p2.9', 'curved', 'flexible', 'creative'] },
  { id: 'led-007', name: 'Transparent LED Wall P3.9', category: 'led-walls', subcategory: 'Transparent LED', description: 'See-through LED wall for retail and creative installations', basePrice: 8000, minPrice: 6000, maxPrice: 12000, priceUnit: 'day', image: getImg('led-007', 'led-walls'), specs: ['P3.9 Pixel Pitch', '70% Transparency', '4500 nits', 'Lightweight'], tags: ['led wall', 'p3.9', 'transparent', 'retail', 'creative'] },
  // LED TVs
  { id: 'tv-001', name: '32 inch LED TV', category: 'led-tvs', subcategory: '32 inch', description: 'Compact 32 inch LED TV for small presentations and displays', basePrice: 800, minPrice: 600, maxPrice: 1200, priceUnit: 'day', image: getImg('tv-001', 'led-tvs'), specs: ['32 inch Display', 'Full HD', 'HDMI/USB', 'Wall Mountable'], tags: ['led tv', '32 inch', 'small', 'presentation'] },
  { id: 'tv-002', name: '43 inch LED TV', category: 'led-tvs', subcategory: '43 inch', description: 'Versatile 43 inch LED TV for medium-sized events', basePrice: 1200, minPrice: 900, maxPrice: 1800, priceUnit: 'day', image: getImg('tv-002', 'led-tvs'), specs: ['43 inch Display', '4K UHD', 'Smart TV', 'Multiple HDMI'], tags: ['led tv', '43 inch', '4k', 'medium'] },
  { id: 'tv-003', name: '55 inch LED TV', category: 'led-tvs', subcategory: '55 inch', description: 'Large 55 inch 4K TV perfect for conferences and exhibitions', basePrice: 2000, minPrice: 1500, maxPrice: 3000, priceUnit: 'day', image: getImg('tv-003', 'led-tvs'), specs: ['55 inch Display', '4K UHD', 'HDR Support', 'Smart Features'], tags: ['led tv', '55 inch', '4k', 'conference', 'exhibition'], popular: true },
  { id: 'tv-004', name: '65 inch LED TV', category: 'led-tvs', subcategory: '65 inch', description: 'Impressive 65 inch 4K TV for impactful presentations', basePrice: 3500, minPrice: 2800, maxPrice: 5000, priceUnit: 'day', image: getImg('tv-004', 'led-tvs'), specs: ['65 inch Display', '4K UHD', 'HDR10+', '120Hz Refresh'], tags: ['led tv', '65 inch', '4k', 'large', 'presentation'] },
  { id: 'tv-005', name: '75 inch LED TV', category: 'led-tvs', subcategory: '75 inch', description: 'Massive 75 inch 4K TV for large venues and events', basePrice: 6000, minPrice: 4500, maxPrice: 8000, priceUnit: 'day', image: getImg('tv-005', 'led-tvs'), specs: ['75 inch Display', '4K UHD', 'QLED Panel', 'Smart Hub'], tags: ['led tv', '75 inch', '4k', 'qled', 'large venue'] },
  { id: 'tv-006', name: '85 inch LED TV', category: 'led-tvs', subcategory: '85 inch', description: 'Giant 85 inch 4K TV for maximum visual impact', basePrice: 10000, minPrice: 8000, maxPrice: 15000, priceUnit: 'day', image: getImg('tv-006', 'led-tvs'), specs: ['85 inch Display', '4K UHD', 'Mini LED', 'Gaming Mode'], tags: ['led tv', '85 inch', '4k', 'mini led', 'giant'] },
  // SOUND SYSTEMS
  { id: 'sound-001', name: 'Basic PA System (100W)', category: 'sound-systems', subcategory: 'PA Systems', description: 'Compact PA system for small meetings and announcements', basePrice: 1500, minPrice: 1000, maxPrice: 2500, priceUnit: 'day', image: getImg('sound-001', 'sound-systems'), specs: ['100W Output', '2 Speakers', 'Wired Mic', 'Bluetooth'], tags: ['pa system', '100w', 'small', 'meeting', 'basic'] },
  { id: 'sound-002', name: 'Standard PA System (500W)', category: 'sound-systems', subcategory: 'PA Systems', description: 'Powerful 500W PA system for medium events', basePrice: 3500, minPrice: 2500, maxPrice: 5000, priceUnit: 'day', image: getImg('sound-002', 'sound-systems'), specs: ['500W Output', '2 Speakers', '2 Wireless Mics', 'Mixer'], tags: ['pa system', '500w', 'medium', 'event', 'wireless mic'], popular: true },
  { id: 'sound-003', name: 'Professional PA System (1000W)', category: 'sound-systems', subcategory: 'PA Systems', description: 'High-power 1000W system for large events and concerts', basePrice: 8000, minPrice: 6000, maxPrice: 12000, priceUnit: 'day', image: getImg('sound-003', 'sound-systems'), specs: ['1000W Output', '4 Speakers', '4 Wireless Mics', 'Digital Mixer'], tags: ['pa system', '1000w', 'large', 'concert', 'professional'] },
  { id: 'sound-004', name: 'Line Array System (2000W)', category: 'sound-systems', subcategory: 'Line Array', description: 'Concert-grade line array system for outdoor events', basePrice: 15000, minPrice: 12000, maxPrice: 25000, priceUnit: 'day', image: getImg('sound-004', 'sound-systems'), specs: ['2000W Output', '8 Line Array Speakers', 'Subwoofers', 'Digital Processor'], tags: ['line array', '2000w', 'concert', 'outdoor', 'professional'] },
  { id: 'sound-005', name: 'JBL EON615 Portable Speaker Pair', category: 'sound-systems', subcategory: 'Portable Speakers', description: 'Premium portable speakers with built-in amplifiers', basePrice: 3000, minPrice: 2200, maxPrice: 4500, priceUnit: 'day', image: getImg('sound-005', 'sound-systems'), specs: ['1000W Peak', '15 inch Woofer', 'Bluetooth', 'DSP'], tags: ['speaker', 'jbl', 'portable', '1000w', 'bluetooth'], popular: true },
  { id: 'sound-006', name: 'Dual 18 inch Subwoofer', category: 'sound-systems', subcategory: 'Subwoofers', description: 'Powerful subwoofer for deep bass at events', basePrice: 4000, minPrice: 3000, maxPrice: 6000, priceUnit: 'day', image: getImg('sound-006', 'sound-systems'), specs: ['2000W Peak', 'Dual 18 inch', 'Active Powered', 'Pole Mount'], tags: ['subwoofer', '18 inch', 'bass', '2000w', 'active'] },
  { id: 'sound-007', name: 'Stage Monitor Wedge (12 inch)', category: 'sound-systems', subcategory: 'Stage Monitors', description: 'Floor monitor for performers on stage', basePrice: 1500, minPrice: 1000, maxPrice: 2500, priceUnit: 'day', image: getImg('sound-007', 'sound-systems'), specs: ['500W Peak', '12 inch Woofer', 'Active', 'Angled Design'], tags: ['monitor', 'stage', '12 inch', 'wedge', 'performer'] },
  // MICROPHONES
  { id: 'mic-001', name: 'Shure SM58 Wireless Handheld', category: 'microphones', subcategory: 'Wireless Handheld', description: 'Industry-standard wireless vocal microphone', basePrice: 1200, minPrice: 800, maxPrice: 2000, priceUnit: 'day', image: getImg('mic-001', 'microphones'), specs: ['UHF Wireless', 'Cardioid Pattern', '8h Battery', '100m Range'], tags: ['microphone', 'shure', 'sm58', 'wireless', 'vocal'], popular: true },
  { id: 'mic-002', name: 'Sennheiser EW 135 G4 Wireless', category: 'microphones', subcategory: 'Wireless Handheld', description: 'Professional German wireless microphone system', basePrice: 2000, minPrice: 1500, maxPrice: 3000, priceUnit: 'day', image: getImg('mic-002', 'microphones'), specs: ['True Diversity', '1680 Frequencies', '8h Battery', 'Professional'], tags: ['microphone', 'sennheiser', 'wireless', 'professional', 'german'] },
  { id: 'mic-003', name: 'Shure BLX14 Wireless Lapel Mic', category: 'microphones', subcategory: 'Wireless Lapel', description: 'Discreet lapel microphone for presentations', basePrice: 1500, minPrice: 1000, maxPrice: 2500, priceUnit: 'day', image: getImg('mic-003', 'microphones'), specs: ['Lapel Clip-on', '14h Battery', '300ft Range', 'Clear Audio'], tags: ['microphone', 'shure', 'lapel', 'wireless', 'presentation'] },
  { id: 'mic-004', name: 'AKG C417 L Professional Lapel', category: 'microphones', subcategory: 'Wireless Lapel', description: 'Broadcast-quality lapel microphone', basePrice: 1800, minPrice: 1200, maxPrice: 2800, priceUnit: 'day', image: getImg('mic-004', 'microphones'), specs: ['Omnidirectional', 'Condenser', 'Low Profile', 'Broadcast Quality'], tags: ['microphone', 'akg', 'lapel', 'broadcast', 'professional'] },
  { id: 'mic-005', name: 'Shure SM58 Wired Microphone', category: 'microphones', subcategory: 'Wired Mics', description: 'Legendary wired vocal microphone', basePrice: 500, minPrice: 300, maxPrice: 800, priceUnit: 'day', image: getImg('mic-005', 'microphones'), specs: ['Cardioid', 'XLR Connection', 'Durable', 'Industry Standard'], tags: ['microphone', 'shure', 'sm58', 'wired', 'vocal'] },
  { id: 'mic-006', name: 'Shure SM57 Instrument Mic', category: 'microphones', subcategory: 'Wired Mics', description: 'Versatile microphone for instruments and amps', basePrice: 500, minPrice: 300, maxPrice: 800, priceUnit: 'day', image: getImg('mic-006', 'microphones'), specs: ['Cardioid', 'Instrument Focused', 'XLR', 'Rugged'], tags: ['microphone', 'shure', 'sm57', 'instrument', 'wired'] },
  { id: 'mic-007', name: 'Conference Microphone System (4 mics)', category: 'microphones', subcategory: 'Conference Mics', description: 'Complete conference room microphone setup', basePrice: 4000, minPrice: 3000, maxPrice: 6000, priceUnit: 'day', image: getImg('mic-007', 'microphones'), specs: ['4 Gooseneck Mics', 'Central Hub', 'Mute Buttons', 'Clear Audio'], tags: ['microphone', 'conference', 'gooseneck', 'meeting', 'system'] },
  { id: 'mic-008', name: 'Karaoke Microphone Set (2 Wireless)', category: 'microphones', subcategory: 'Karaoke Mics', description: 'Fun karaoke microphone pair for parties', basePrice: 1500, minPrice: 1000, maxPrice: 2500, priceUnit: 'day', image: getImg('mic-008', 'microphones'), specs: ['2 Wireless Mics', 'Echo Effect', '6h Battery', 'Colorful LEDs'], tags: ['microphone', 'karaoke', 'wireless', 'party', 'echo'], popular: true },
  // DJ EQUIPMENT
  { id: 'dj-001', name: 'Pioneer DDJ-FLX4 DJ Controller', category: 'dj-equipment', subcategory: 'DJ Controllers', description: 'Entry-level Pioneer DJ controller with rekordbox', basePrice: 2500, minPrice: 1800, maxPrice: 3500, priceUnit: 'day', image: getImg('dj-001', 'dj-equipment'), specs: ['2 Channels', 'rekordbox/Serato', 'USB Powered', 'Beginner Friendly'], tags: ['dj', 'controller', 'pioneer', 'ddj-flx4', 'beginner'], popular: true },
  { id: 'dj-002', name: 'Pioneer DDJ-1000 DJ Controller', category: 'dj-equipment', subcategory: 'DJ Controllers', description: 'Professional 4-channel DJ controller with full-size jog wheels', basePrice: 5000, minPrice: 4000, maxPrice: 7000, priceUnit: 'day', image: getImg('dj-002', 'dj-equipment'), specs: ['4 Channels', 'Full Size Jogs', 'rekordbox', 'Club Standard'], tags: ['dj', 'controller', 'pioneer', 'ddj-1000', 'professional'] },
  { id: 'dj-003', name: 'Pioneer DJM-900NXS2 Mixer', category: 'dj-equipment', subcategory: 'DJ Mixers', description: 'Industry-standard club mixer with effects', basePrice: 6000, minPrice: 4500, maxPrice: 8000, priceUnit: 'day', image: getImg('dj-003', 'dj-equipment'), specs: ['4 Channels', '64-bit Processing', 'Built-in FX', 'Sound Color FX'], tags: ['dj', 'mixer', 'pioneer', 'djm-900nxs2', 'club'] },
  { id: 'dj-004', name: 'Pioneer CDJ-3000 Media Player', category: 'dj-equipment', subcategory: 'CDJs', description: 'Latest generation professional media player', basePrice: 8000, minPrice: 6000, maxPrice: 12000, priceUnit: 'day', image: getImg('dj-004', 'dj-equipment'), specs: ['MP3/WAV/AIFF', '9 inch Touchscreen', 'Pro DJ Link', 'Key Shift'], tags: ['dj', 'cdj', 'pioneer', 'cdj-3000', 'professional'] },
  { id: 'dj-005', name: 'Technics SL-1200MK7 Turntable', category: 'dj-equipment', subcategory: 'Turntables', description: 'Legendary direct-drive turntable for vinyl DJs', basePrice: 4000, minPrice: 3000, maxPrice: 6000, priceUnit: 'day', image: getImg('dj-005', 'dj-equipment'), specs: ['Direct Drive', 'Pitch Control', 'Reverse Play', 'Legendary'], tags: ['dj', 'turntable', 'technics', 'sl-1200', 'vinyl'] },
  { id: 'dj-006', name: 'Complete DJ Package (Controller + Speakers)', category: 'dj-equipment', subcategory: 'DJ Packages', description: 'Everything needed for a DJ event', basePrice: 8000, minPrice: 6000, maxPrice: 12000, priceUnit: 'day', image: getImg('dj-006', 'dj-equipment'), specs: ['DJ Controller', '2 Speakers', 'Stands', 'Cables', 'Microphone'], tags: ['dj', 'package', 'complete', 'event', 'party'], popular: true },
  // CABLES & ACCESSORIES
  { id: 'cable-001', name: 'HDMI Cable (3 meters)', category: 'cables-accessories', subcategory: 'HDMI Cables', description: 'High-speed HDMI cable for video connections', basePrice: 200, minPrice: 100, maxPrice: 400, priceUnit: 'day', image: getImg('cable-001', 'cables-accessories'), specs: ['3 Meters', '4K Supported', 'Gold Plated', 'High Speed'], tags: ['cable', 'hdmi', '3m', '4k', 'video'] },
  { id: 'cable-002', name: 'HDMI Cable (10 meters)', category: 'cables-accessories', subcategory: 'HDMI Cables', description: 'Long HDMI cable for extended reach', basePrice: 400, minPrice: 250, maxPrice: 700, priceUnit: 'day', image: getImg('cable-002', 'cables-accessories'), specs: ['10 Meters', '4K Supported', 'Signal Booster', 'Heavy Duty'], tags: ['cable', 'hdmi', '10m', 'long', '4k'] },
  { id: 'cable-003', name: 'VGA Cable (5 meters)', category: 'cables-accessories', subcategory: 'VGA Cables', description: 'VGA cable for older projectors and displays', basePrice: 200, minPrice: 100, maxPrice: 350, priceUnit: 'day', image: getImg('cable-003', 'cables-accessories'), specs: ['5 Meters', '15-pin', 'Ferrite Cores', 'Projector Ready'], tags: ['cable', 'vga', '5m', 'projector', 'legacy'] },
  { id: 'cable-004', name: 'XLR Microphone Cable (5 meters)', category: 'cables-accessories', subcategory: 'Audio Cables', description: 'Professional XLR cable for microphones', basePrice: 150, minPrice: 80, maxPrice: 300, priceUnit: 'day', image: getImg('cable-004', 'cables-accessories'), specs: ['5 Meters', 'Balanced', 'Gold Contacts', 'Noise Free'], tags: ['cable', 'xlr', 'microphone', 'balanced', 'audio'] },
  { id: 'cable-005', name: 'Power Extension (15 meters)', category: 'cables-accessories', subcategory: 'Power Cables', description: 'Heavy-duty power extension for events', basePrice: 300, minPrice: 200, maxPrice: 500, priceUnit: 'day', image: getImg('cable-005', 'cables-accessories'), specs: ['15 Meters', 'Multiple Outlets', 'Surge Protected', 'Heavy Duty'], tags: ['cable', 'power', 'extension', '15m', 'surge'] },
  { id: 'cable-006', name: 'HDMI to VGA Adapter', category: 'cables-accessories', subcategory: 'Adapters', description: 'Convert HDMI output to VGA input', basePrice: 200, minPrice: 100, maxPrice: 400, priceUnit: 'day', image: getImg('cable-006', 'cables-accessories'), specs: ['HDMI to VGA', 'Audio Support', 'Plug & Play', 'Compact'], tags: ['adapter', 'hdmi', 'vga', 'converter', 'legacy'] },
  { id: 'cable-007', name: 'Projector Tripod Stand', category: 'cables-accessories', subcategory: 'Stands', description: 'Adjustable tripod stand for projectors', basePrice: 500, minPrice: 300, maxPrice: 800, priceUnit: 'day', image: getImg('cable-007', 'cables-accessories'), specs: ['Adjustable Height', 'Universal Mount', 'Stable Base', 'Portable'], tags: ['stand', 'tripod', 'projector', 'adjustable', 'portable'] },
  { id: 'cable-008', name: 'Speaker Stand (Pair)', category: 'cables-accessories', subcategory: 'Stands', description: 'Professional speaker stands with carry bag', basePrice: 800, minPrice: 500, maxPrice: 1200, priceUnit: 'day', image: getImg('cable-008', 'cables-accessories'), specs: ['Pair', 'Adjustable', '35mm Pole', 'Carry Bag'], tags: ['stand', 'speaker', 'pair', 'adjustable', 'professional'] },
  // LIGHTING
  { id: 'light-001', name: 'LED PAR Can (RGBW)', category: 'lighting', subcategory: 'PAR Lights', description: 'Colorful LED PAR light for stage washing', basePrice: 800, minPrice: 500, maxPrice: 1200, priceUnit: 'day', image: getImg('light-001', 'lighting'), specs: ['RGBW Colors', 'DMX Control', 'Auto Programs', 'Quiet Fan'], tags: ['light', 'par', 'led', 'rgbw', 'stage'] },
  { id: 'light-002', name: 'Moving Head Beam 7R', category: 'lighting', subcategory: 'Moving Heads', description: 'Powerful moving head light for dynamic effects', basePrice: 3000, minPrice: 2000, maxPrice: 4500, priceUnit: 'day', image: getImg('light-002', 'lighting'), specs: ['230W Lamp', 'DMX512', 'Gobo Wheel', 'Prism Effects'], tags: ['light', 'moving head', 'beam', '7r', 'dynamic'] },
  { id: 'light-003', name: 'LED Uplight (Wireless)', category: 'lighting', subcategory: 'Uplights', description: 'Battery-powered uplight for venue decoration', basePrice: 1000, minPrice: 700, maxPrice: 1500, priceUnit: 'day', image: getImg('light-003', 'lighting'), specs: ['Battery Powered', 'RGB Colors', 'Wireless DMX', '8h Runtime'], tags: ['light', 'uplight', 'wireless', 'battery', 'decoration'], popular: true },
  { id: 'light-004', name: 'Follow Spot 1200W', category: 'lighting', subcategory: 'Follow Spots', description: 'Professional follow spot for highlighting performers', basePrice: 4000, minPrice: 3000, maxPrice: 6000, priceUnit: 'day', image: getImg('light-004', 'lighting'), specs: ['1200W Lamp', 'Iris Control', 'Color Filters', 'Long Throw'], tags: ['light', 'follow spot', '1200w', 'performer', 'highlight'] },
  { id: 'light-005', name: 'Laser Light RGB 1W', category: 'lighting', subcategory: 'Laser Lights', description: 'Eye-catching laser effects for parties', basePrice: 2500, minPrice: 1800, maxPrice: 4000, priceUnit: 'day', image: getImg('light-005', 'lighting'), specs: ['1W RGB Laser', 'Pattern Effects', 'DMX/Auto', 'Safety Certified'], tags: ['light', 'laser', 'rgb', 'party', 'effect'] },
  { id: 'light-006', name: 'Fog Machine 1500W', category: 'lighting', subcategory: 'Fog Machines', description: 'Create atmospheric fog effects for lighting', basePrice: 1500, minPrice: 1000, maxPrice: 2500, priceUnit: 'day', image: getImg('light-006', 'lighting'), specs: ['1500W Heater', 'Wireless Remote', 'Fast Heat', 'Durable Pump'], tags: ['fog', 'machine', '1500w', 'atmosphere', 'effect'] },
  // SCREENS
  { id: 'screen-001', name: 'Tripod Projection Screen 6x4 feet', category: 'screens', subcategory: 'Tripod Screens', description: 'Portable tripod screen for small presentations', basePrice: 800, minPrice: 500, maxPrice: 1200, priceUnit: 'day', image: getImg('screen-001', 'screens'), specs: ['6x4 feet', 'Matte White', 'Tripod Stand', 'Easy Setup'], tags: ['screen', 'tripod', '6x4', 'portable', 'presentation'] },
  { id: 'screen-002', name: 'Tripod Projection Screen 8x6 feet', category: 'screens', subcategory: 'Tripod Screens', description: 'Larger tripod screen for medium audiences', basePrice: 1200, minPrice: 800, maxPrice: 1800, priceUnit: 'day', image: getImg('screen-002', 'screens'), specs: ['8x6 feet', 'Matte White', 'Adjustable Height', 'Carry Case'], tags: ['screen', 'tripod', '8x6', 'medium', 'adjustable'] },
  { id: 'screen-003', name: 'Fast Fold Screen 10x8 feet', category: 'screens', subcategory: 'Fast Fold Screens', description: 'Professional fast-fold screen for events', basePrice: 2500, minPrice: 1800, maxPrice: 3500, priceUnit: 'day', image: getImg('screen-003', 'screens'), specs: ['10x8 feet', 'Front/Rear', 'Aluminum Frame', 'Quick Setup'], tags: ['screen', 'fast fold', '10x8', 'professional', 'event'] },
  { id: 'screen-004', name: 'Fast Fold Screen 14x10 feet', category: 'screens', subcategory: 'Fast Fold Screens', description: 'Large fast-fold screen for big events', basePrice: 4000, minPrice: 3000, maxPrice: 6000, priceUnit: 'day', image: getImg('screen-004', 'screens'), specs: ['14x10 feet', 'Front Projection', 'Heavy Duty Frame', 'Carry Cases'], tags: ['screen', 'fast fold', '14x10', 'large', 'event'] },
  { id: 'screen-005', name: 'Motorized Screen 120 inch', category: 'screens', subcategory: 'Motorized Screens', description: 'Electric motorized screen with remote control', basePrice: 3000, minPrice: 2200, maxPrice: 4500, priceUnit: 'day', image: getImg('screen-005', 'screens'), specs: ['120 inch', '16:9 Aspect', 'Remote Control', 'Wall/Ceiling Mount'], tags: ['screen', 'motorized', '120 inch', 'electric', 'remote'] },
  { id: 'screen-006', name: 'Inflatable Outdoor Screen 20 feet', category: 'screens', subcategory: 'Inflatable Screens', description: 'Giant inflatable screen for outdoor movie nights', basePrice: 8000, minPrice: 6000, maxPrice: 12000, priceUnit: 'day', image: getImg('screen-006', 'screens'), specs: ['20 feet Diagonal', 'Outdoor Rated', 'Blower Included', 'Front/Rear'], tags: ['screen', 'inflatable', '20 feet', 'outdoor', 'movie'] },
  // VIDEO RECORDING
  { id: 'video-001', name: 'Sony A7 IV 4K Camera', category: 'video-recording', subcategory: '4K Cameras', description: 'Professional mirrorless 4K camera for event recording', basePrice: 5000, minPrice: 4000, maxPrice: 7000, priceUnit: 'day', image: getImg('video-001', 'video-recording'), specs: ['33MP Full Frame', '4K 60fps', '5-axis Stabilization', 'Professional'], tags: ['camera', 'sony', 'a7 iv', '4k', 'mirrorless'], popular: true },
  { id: 'video-002', name: 'Canon XA75 Professional Camcorder', category: 'video-recording', subcategory: 'HD Cameras', description: 'Broadcast-quality camcorder for event coverage', basePrice: 4500, minPrice: 3500, maxPrice: 6000, priceUnit: 'day', image: getImg('video-002', 'video-recording'), specs: ['4K UHD', '15x Zoom', 'Dual XLR', 'Professional'], tags: ['camera', 'canon', 'xa75', 'camcorder', 'broadcast'] },
  { id: 'video-003', name: 'Blackmagic ATEM Mini Pro Switcher', category: 'video-recording', subcategory: 'Video Switchers', description: 'Live streaming switcher with 4 HDMI inputs', basePrice: 3000, minPrice: 2200, maxPrice: 4500, priceUnit: 'day', image: getImg('video-003', 'video-recording'), specs: ['4 HDMI Inputs', 'Live Streaming', 'Recording', 'Multiview'], tags: ['switcher', 'blackmagic', 'atem mini', 'live', 'streaming'], popular: true },
  { id: 'video-004', name: 'Live Streaming Package (Camera + Switcher)', category: 'video-recording', subcategory: 'Recording Packages', description: 'Complete live streaming setup for events', basePrice: 10000, minPrice: 8000, maxPrice: 15000, priceUnit: 'day', image: getImg('video-004', 'video-recording'), specs: ['4K Camera', 'Switcher', 'Microphone', 'Encoding', 'Setup'], tags: ['package', 'live streaming', 'camera', 'switcher', 'complete'] },
];

// Import generated equipment database
import { generatedEquipmentDatabase } from './equipment-generator';

const manualIds = new Set(equipmentDatabase.map(item => item.id));
const uniqueGeneratedItems = generatedEquipmentDatabase.filter(item => !manualIds.has(item.id));

export const fullEquipmentDatabase: EquipmentItem[] = [
  ...equipmentDatabase,
  ...uniqueGeneratedItems,
];

// Helper functions
export function getEquipmentByCategory(categoryId: string): EquipmentItem[] {
  return fullEquipmentDatabase.filter(item => item.category === categoryId);
}

export function getEquipmentById(id: string): EquipmentItem | undefined {
  return fullEquipmentDatabase.find(item => item.id === id);
}

export function searchEquipment(query: string): EquipmentItem[] {
  const q = query.toLowerCase();
  return fullEquipmentDatabase.filter(item =>
    item.name.toLowerCase().includes(q) ||
    item.tags.some(tag => tag.toLowerCase().includes(q)) ||
    item.category.toLowerCase().includes(q) ||
    item.subcategory.toLowerCase().includes(q)
  );
}

export function getPopularEquipment(): EquipmentItem[] {
  return fullEquipmentDatabase.filter(item => item.popular);
}

export function getPriceRange(categoryId?: string): { min: number; max: number } {
  const items = categoryId ? getEquipmentByCategory(categoryId) : fullEquipmentDatabase;
  const prices = items.flatMap(item => [item.minPrice, item.maxPrice]);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function getEquipmentByBrand(brand: string): EquipmentItem[] {
  const b = brand.toLowerCase();
  return fullEquipmentDatabase.filter(item =>
    item.name.toLowerCase().includes(b) || item.tags.some(tag => tag.toLowerCase().includes(b))
  );
}

export function getEquipmentByPriceRange(minPrice: number, maxPrice: number): EquipmentItem[] {
  return fullEquipmentDatabase.filter(item => item.basePrice >= minPrice && item.basePrice <= maxPrice);
}

export function getRandomEquipment(count: number = 10, category?: string): EquipmentItem[] {
  const source = category ? fullEquipmentDatabase.filter(item => item.category === category) : fullEquipmentDatabase;
  const shuffled = [...source].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getTotalEquipmentCount(): number {
  return fullEquipmentDatabase.length;
}

export function getCategoryStats(): { category: string; count: number; avgPrice: number }[] {
  const stats: { [key: string]: { count: number; totalPrice: number } } = {};
  fullEquipmentDatabase.forEach(item => {
    if (!stats[item.category]) stats[item.category] = { count: 0, totalPrice: 0 };
    stats[item.category].count++;
    stats[item.category].totalPrice += item.basePrice;
  });
  return Object.entries(stats).map(([category, data]) => ({
    category,
    count: data.count,
    avgPrice: Math.round(data.totalPrice / data.count),
  }));
}