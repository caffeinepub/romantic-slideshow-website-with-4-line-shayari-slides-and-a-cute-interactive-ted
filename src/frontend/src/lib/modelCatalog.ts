/**
 * Fixed offline mapping from input names to local 3D model assets.
 * Supports case-insensitive matching and aliases.
 */

interface ModelEntry {
  path: string;
  displayName: string;
  aliases: string[];
}

const MODEL_CATALOG: ModelEntry[] = [
  {
    path: '/assets/models/rose.glb',
    displayName: 'Rose',
    aliases: ['rose', 'flower', 'bloom', 'blossom'],
  },
  {
    path: '/assets/models/teddy.glb',
    displayName: 'Teddy Bear',
    aliases: ['teddy', 'bear', 'teddybear', 'toy'],
  },
  {
    path: '/assets/models/castle.glb',
    displayName: 'Castle',
    aliases: ['castle', 'palace', 'fortress', 'tower'],
  },
];

/**
 * Normalize input string for matching (lowercase, trim)
 */
function normalizeInput(input: string): string {
  return input.toLowerCase().trim();
}

/**
 * Resolve a model path from an input name.
 * Returns the model path if found, null otherwise.
 */
export function resolveModelFromName(input: string): string | null {
  const normalized = normalizeInput(input);
  
  for (const entry of MODEL_CATALOG) {
    if (entry.aliases.includes(normalized)) {
      return entry.path;
    }
  }
  
  return null;
}

/**
 * Get a list of all supported names (primary aliases only)
 */
export function getSupportedNames(): string[] {
  return MODEL_CATALOG.map((entry) => entry.aliases[0]);
}

/**
 * Get display name for a model path
 */
export function getDisplayName(modelPath: string): string {
  const entry = MODEL_CATALOG.find((e) => e.path === modelPath);
  return entry?.displayName || 'Unknown';
}
