import { Character, WorldLocation, ClueItem, WorldEvent, WorldState } from '../world/types';

export type AspectRatio = '1:1' | '16:9' | '4:3' | '3:4' | '9:16';

export type ImageStylePreset = 
  | 'cinematic-concept'
  | 'cinematic-noir'
  | 'tactical-blueprint'
  | 'cyber-anime'
  | 'oil-classic'
  | 'retro-scifi'
  | 'photorealistic'
  | 'forensic-photo';

export interface StylePresetOption {
  id: ImageStylePreset;
  label: string;
  description: string;
  icon: string;
}

export const STYLE_PRESETS: StylePresetOption[] = [
  {
    id: 'cinematic-concept',
    label: 'Cinematic Concept',
    description: 'Volumetric Unreal Engine 5 aesthetic with epic mood & keyframe lighting',
    icon: 'Sparkles',
  },
  {
    id: 'cinematic-noir',
    label: 'Neo-Noir Chiaroscuro',
    description: 'High-contrast shadows, moody neon rain reflections, and detective atmosphere',
    icon: 'Moon',
  },
  {
    id: 'tactical-blueprint',
    label: 'Tactical Blueprint',
    description: 'Holographic schematic overlays, CAD vectors, and topographical contours',
    icon: 'Compass',
  },
  {
    id: 'photorealistic',
    label: 'Photorealistic Studio',
    description: '8k raw documentary photo with Hasselblad optics & rich micro-textures',
    icon: 'Camera',
  },
  {
    id: 'forensic-photo',
    label: 'Forensic Evidence',
    description: 'Numbered case markers, macro evidentiary lighting, investigative detail',
    icon: 'Search',
  },
  {
    id: 'cyber-anime',
    label: 'Cyber Anime',
    description: 'Crisp linework, vibrant neon gradients, and emotive character stylization',
    icon: 'Zap',
  },
  {
    id: 'oil-classic',
    label: 'Classical Baroque',
    description: 'Rich oil brushwork, deep pigments, and museum fine-art drama',
    icon: 'Palette',
  },
  {
    id: 'retro-scifi',
    label: 'Retro Sci-Fi',
    description: '70s/80s analog grain book-cover space opera style',
    icon: 'Radio',
  },
];

export interface ImageGenerationOptions {
  prompt: string;
  aspectRatio?: AspectRatio;
  stylePreset?: ImageStylePreset;
  entityType?: 'character' | 'location' | 'evidence' | 'event' | 'freeform';
  entityId?: string;
  entityTitle?: string;
  worldContext?: {
    name?: string;
    genre?: string;
    atmosphere?: string;
    premise?: string;
  };
  model?: 'gemini-3.1-flash-lite-image' | 'gemini-3.1-flash-image';
}

export interface GeneratedImageRecord {
  id: string;
  imageUrl: string;
  prompt: string;
  rawPrompt: string;
  aspectRatio: AspectRatio;
  stylePreset: ImageStylePreset;
  entityType: 'character' | 'location' | 'evidence' | 'event' | 'freeform';
  entityId?: string;
  entityTitle?: string;
  isAiGenerated: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'headconan_image_gallery_v1';

export class ImageService {
  /**
   * Request image generation from backend
   */
  static async generate(options: ImageGenerationOptions): Promise<GeneratedImageRecord> {
    const response = await fetch('/api/image/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate image: ${response.statusText}`);
    }

    const data = await response.json();
    const record: GeneratedImageRecord = {
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      imageUrl: data.imageUrl,
      prompt: data.prompt || options.prompt,
      rawPrompt: data.rawPrompt || options.prompt,
      aspectRatio: data.aspectRatio || options.aspectRatio || '1:1',
      stylePreset: data.stylePreset || options.stylePreset || 'cinematic-concept',
      entityType: data.entityType || options.entityType || 'freeform',
      entityId: options.entityId,
      entityTitle: options.entityTitle,
      isAiGenerated: data.isAiGenerated ?? true,
      timestamp: data.timestamp || new Date().toISOString(),
    };

    // Save to local image gallery history
    this.saveToGallery(record);

    return record;
  }

  /**
   * Retrieve all saved images from gallery
   */
  static getGallery(): GeneratedImageRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /**
   * Save a single record into gallery history
   */
  static saveToGallery(record: GeneratedImageRecord) {
    try {
      const gallery = this.getGallery();
      // Keep most recent 50 images
      const updated = [record, ...gallery.filter(item => item.id !== record.id)].slice(0, 50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save image to localStorage gallery:', e);
    }
  }

  /**
   * Delete an image from gallery
   */
  static deleteFromGallery(id: string) {
    try {
      const gallery = this.getGallery().filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gallery));
    } catch (e) {
      console.warn('Failed to delete image from localStorage:', e);
    }
  }

  // --- Entity Prompt Builders ---

  static buildCharacterPrompt(character: Character, world?: WorldState): string {
    const worldAtmosphere = world ? `${world.genre}, atmosphere of ${world.atmosphere}` : 'speculative sci-fi';
    const roleDetails = character.role ? `Role: ${character.role}` : '';
    const faction = character.faction ? `Affiliation: ${character.faction}` : '';
    const summary = character.summary ? `Visual features & description: ${character.summary}` : '';

    return `Portrait bust of ${character.name}. ${roleDetails}. ${faction}. ${summary}. Set in a universe of ${worldAtmosphere}. High detail expressive face, distinctive costume attire, iconic character design, professional lighting.`;
  }

  static buildLocationPrompt(location: WorldLocation, world?: WorldState): string {
    const worldGenre = world?.genre || 'Speculative';
    const type = location.type ? `Type: ${location.type}` : '';
    const sig = location.significance ? `Significance: ${location.significance}` : '';

    return `Panoramic landscape environment view of ${location.name}. ${type}. ${sig}. World theme: ${worldGenre}. Cinematic wide composition, intricate architectural scale, atmospheric environmental depth, tactical perspective.`;
  }

  static buildEvidencePrompt(clue: ClueItem, world?: WorldState): string {
    const category = clue.category ? `Category: ${clue.category} artifact` : '';
    const desc = clue.description ? `Description: ${clue.description}` : '';
    const sig = clue.significance ? `Significance: ${clue.significance}` : '';

    return `Forensic case evidence item: "${clue.title}". ${category}. ${desc}. ${sig}. Macro detailed focus, placed on an investigator's examination desk with crime lab lighting and subtle evidentiary markers.`;
  }

  static buildEventPrompt(event: WorldEvent, world?: WorldState): string {
    return `Dramatic climactic keyframe scene depicting: "${event.title}". Event details: ${event.description}. Category: ${event.category}. World genre: ${world?.genre || 'Speculative'}. Dynamic action composition, cinematic volumetric lighting, high tension atmosphere.`;
  }
}
