/**
 * optimistically rewrites a Wikimedia image URL to request a specific width thumbnail.
 * This avoids fetching full-resolution (4K+) images and improves performance.
 *
 * Example:
 * Input: https://upload.wikimedia.org/wikipedia/commons/a/a9/Example.jpg
 * Output (800px): https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Example.jpg/800px-Example.jpg
 */
export function getWikimediaImageUrl(url: string, width: number = 800): string {
  if (!url) return '';

  // If it's not a wikimedia upload URL, return original
  if (!url.includes('upload.wikimedia.org')) return url;

  // If it's already a thumbnail, we might need to adjust logic, but usually we get the "original" source from API.
  // The API returns 'originalimage.source' which is the full res.

  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split('/');
    // Expected format: /wikipedia/commons/a/a9/Filename.jpg

    // Find 'commons' or lang code 'en', etc.
    // simpler: look for the part after "wikipedia/{project}/..."

    const filename = parts[parts.length - 1];
    const isSvg = filename.toLowerCase().endsWith('.svg');

    // Construct thumbnail path
    // Wiki structure: /wikipedia/{project}/{hash1}/{hash2}/{filename}
    // Thumb structure: /wikipedia/{project}/thumb/{hash1}/{hash2}/{filename}/{width}px-{filename}

    // If it's already a thumb URL, try to strip it back
    if (url.includes('/thumb/')) {
       // logic to resize existing thumb could go here, but let's assume input is original source for now
       return url;
    }

    // Insert 'thumb' after project identifier (usually index 2 if starting with empty string split)
    // path: /wikipedia/commons/a/a9/File.jpg
    // parts: ["", "wikipedia", "commons", "a", "a9", "File.jpg"]

    // Safer way: replace "/wikipedia/commons/" with "/wikipedia/commons/thumb/"
    // But project can vary (commons, en, etc).

    // Regex strategy
    const regex = /(\/wikipedia\/[\w-]+\/)([\w0-9]+\/[\w0-9]+\/)([^/]+)$/;
    const match = urlObj.pathname.match(regex);

    if (match) {
        const [_, prefix, hash, file] = match;
        // prefix: /wikipedia/commons/
        // hash: a/a9/
        // file: Example.jpg

        let thumbFile = `${width}px-${file}`;
        if (isSvg) {
            thumbFile += '.png'; // SVGs are rasterized to PNG in thumbs
        }

        return `${urlObj.origin}${prefix}thumb/${hash}${file}/${thumbFile}`;
    }

    return url;
  } catch (e) {
    return url;
  }
}
