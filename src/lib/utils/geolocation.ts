/**
 * Geolocation-based language detection utilities
 * Defaults to Indonesian (id) with fallback to English (en) for non-Indonesian locations
 */

export interface LocationInfo {
  country: string;
  countryCode: string;
  city?: string;
  region?: string;
}

export interface GeolocationResult {
  location: LocationInfo | null;
  detectedLang: string;
  method: 'geolocation' | 'ip' | 'browser' | 'fallback';
}

// Country to language mapping
const COUNTRY_LANGUAGE_MAP: Record<string, string> = {
  'ID': 'id', // Indonesia
  // Add more specific country mappings if needed
};

/**
 * Detect user's location using browser geolocation API
 */
async function detectLocationByGeolocation(): Promise<LocationInfo | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Reverse geocoding using Nominatim (free OpenStreetMap service)
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`,
            {
              headers: {
                'User-Agent': 'WikWok-App/1.0'
              }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            const address = data.address;
            
            if (address) {
              return resolve({
                country: address.country || '',
                countryCode: address.country_code?.toUpperCase() || '',
                city: address.city || address.town || address.village,
                region: address.state || address.region
              });
            }
          }
        } catch (error) {
          console.warn('Geolocation reverse lookup failed:', error);
        }
        resolve(null);
      },
      (error) => {
        console.warn('Geolocation access denied or failed:', error);
        resolve(null);
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
        maximumAge: 300000 // 5 minutes cache
      }
    );
  });
}

/**
 * Detect location using IP-based geolocation API
 */
async function detectLocationByIP(): Promise<LocationInfo | null> {
  try {
    // Use a free IP geolocation service
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country_name || '',
        countryCode: data.country_code?.toUpperCase() || '',
        city: data.city,
        region: data.region
      };
    }
  } catch (error) {
    console.warn('IP-based location detection failed:', error);
  }
  
  // Fallback to another service if primary fails
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('https://ip-api.com/json/', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country || '',
        countryCode: data.countryCode || '',
        city: data.city,
        region: data.regionName
      };
    }
  } catch (error) {
    console.warn('Backup IP location detection failed:', error);
  }
  
  return null;
}

/**
 * Map location to language based on country
 */
function mapLocationToLanguage(location: LocationInfo | null): string {
  if (!location || !location.countryCode) {
    return 'id'; // Default to Indonesian
  }
  
  // Check if country has specific language mapping
  const mappedLang = COUNTRY_LANGUAGE_MAP[location.countryCode];
  if (mappedLang) {
    return mappedLang;
  }
  
  // Indonesia -> Indonesian, everything else -> English
  return location.countryCode === 'ID' ? 'id' : 'en';
}

/**
 * Get browser language as fallback
 */
function getBrowserLanguage(): string {
  const browserLang = navigator.language || navigator.languages?.[0] || 'en';
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // Map common browser languages to our supported languages
  const browserLangMap: Record<string, string> = {
    'id': 'id', // Indonesian
    'en': 'en', // English
    'ja': 'ja', // Japanese
    'fr': 'fr', // French
    'de': 'de', // German
    'es': 'es', // Spanish
    'ru': 'ru', // Russian
    'it': 'it', // Italian
    'pt': 'pt', // Portuguese
    'ar': 'ar', // Arabic
    'zh': 'zh', // Chinese
    'ko': 'ko', // Korean
    'hi': 'hi', // Hindi
    'bn': 'bn', // Bengali
    'ur': 'ur', // Urdu
    'tr': 'tr', // Turkish
    'vi': 'vi', // Vietnamese
    'th': 'th', // Thai
    'pl': 'pl', // Polish
    'nl': 'nl', // Dutch
    'sv': 'sv', // Swedish
    'fi': 'fi', // Finnish
    'da': 'da', // Danish
    'no': 'no', // Norwegian
    'cs': 'cs', // Czech
    'el': 'el', // Greek
    'he': 'he', // Hebrew
    'fa': 'fa', // Persian
    'uk': 'uk', // Ukrainian
    'hu': 'hu', // Hungarian
    'ro': 'ro', // Romanian
    'tl': 'tl', // Tagalog
    'sr': 'sr', // Serbian
    'hr': 'hr', // Croatian
    'bg': 'bg', // Bulgarian
    'sk': 'sk', // Slovak
    'lt': 'lt', // Lithuanian
    'lv': 'lv', // Latvian
    'et': 'et', // Estonian
    'jv': 'jv', // Javanese
    'su': 'su', // Sundanese
    'min': 'min', // Minangkabau
    'ace': 'ace', // Acehnese
    'ban': 'ban', // Balinese
    'bjn': 'bjn', // Banjar
    'bug': 'bug', // Buginese
    'mad': 'mad', // Madurese
    'gor': 'gor', // Gorontalo
  };
  
  return browserLangMap[langCode] || 'id'; // Default to Indonesian
}

/**
 * Main function to detect user's location and determine appropriate language
 */
export async function detectUserLanguage(): Promise<GeolocationResult> {
  try {
    // Try geolocation API first (most accurate)
    const location = await detectLocationByGeolocation();
    if (location) {
      const detectedLang = mapLocationToLanguage(location);
      return {
        location,
        detectedLang,
        method: 'geolocation'
      };
    }
  } catch (error) {
    console.warn('Geolocation detection failed:', error);
  }
  
  try {
    // Fallback to IP-based detection
    const location = await detectLocationByIP();
    if (location) {
      const detectedLang = mapLocationToLanguage(location);
      return {
        location,
        detectedLang,
        method: 'ip'
      };
    }
  } catch (error) {
    console.warn('IP-based location detection failed:', error);
  }
  
  // Final fallback to browser language
  const detectedLang = getBrowserLanguage();
  return {
    location: null,
    detectedLang,
    method: 'browser'
  };
}

/**
 * Get stored language preference from localStorage
 */
export function getStoredLanguage(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem('wikwok-language');
  } catch (error) {
    console.warn('Failed to read language preference from localStorage:', error);
    return null;
  }
}

/**
 * Store language preference in localStorage
 */
export function storeLanguagePreference(lang: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('wikwok-language', lang);
  } catch (error) {
    console.warn('Failed to store language preference in localStorage:', error);
  }
}

/**
 * Check if user has manually overridden the language detection
 */
export function hasManualLanguageOverride(): boolean {
  return getStoredLanguage() !== null;
}

/**
 * Clear stored language preference (reset to auto-detection)
 */
export function clearLanguagePreference(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('wikwok-language');
  } catch (error) {
    console.warn('Failed to clear language preference from localStorage:', error);
  }
}