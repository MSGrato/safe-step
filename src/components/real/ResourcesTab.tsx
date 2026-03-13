import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, ExternalLink, Loader2 } from 'lucide-react';
import { storage, type PlacesResults } from '@/lib/storage';
import { toast } from 'sonner';

interface PlaceResult {
  name: string;
  address: string;
  placeId: string;
  mapsUrl: string;
}

interface SectionResults {
  shelters: PlaceResult[];
  legal: PlaceResult[];
  counseling: PlaceResult[];
}

const SECTIONS = [
  { key: 'shelters' as const, title: 'Shelters', emoji: '🏠', query: 'shelters' },
  { key: 'legal' as const, title: 'Legal Aid', emoji: '⚖️', query: 'legal' },
  { key: 'counseling' as const, title: 'Counseling', emoji: '💬', query: 'counseling' },
];

export function ResourcesTab() {
  const [zip, setZip] = useState(storage.getZipCode());
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SectionResults | null>(null);

  useEffect(() => {
    if (!zip && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const resp = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`
          );
          const data = await resp.json();
          if (data.postcode) {
            setZip(data.postcode);
            storage.setZipCode(data.postcode);
          }
        } catch {}
      }, () => {});
    }
  }, []);

  const searchPlaces = async () => {
    if (!zip || zip.trim().length < 5) {
      toast.error('Please enter a valid ZIP code.');
      return;
    }
    setLoading(true);
    setResults(null);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const [sheltersRes, legalRes, counselingRes] = await Promise.all(
        SECTIONS.map(s =>
          fetch(`${supabaseUrl}/functions/v1/places`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${anonKey}`,
            },
            body: JSON.stringify({ zip: zip.trim(), type: s.key }),
          }).then(r => r.json())
        )
      );

      const placesResults: PlacesResults = {
        shelters: sheltersRes.results ?? [],
        legal: legalRes.results ?? [],
        counseling: counselingRes.results ?? [],
        zip: zip.trim(),
      };
      setResults(placesResults);
      storage.setPlacesResults(placesResults);
    } catch {
      toast.error('Unable to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 pt-6 pb-24">
      <h2 className="text-xl font-semibold text-foreground mb-4">Find Help Near You</h2>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ZIP code"
            value={zip}
            onChange={e => { setZip(e.target.value); storage.setZipCode(e.target.value); }}
            className="pl-9"
          />
        </div>
        <Button onClick={searchPlaces} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
        </Button>
      </div>

      <div className="space-y-4 mb-8">
        {SECTIONS.map(section => (
          <div key={section.key} className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{section.emoji}</span>
              <h3 className="font-semibold text-foreground">{section.title}</h3>
            </div>

            {!results ? (
              <p className="text-sm text-muted-foreground">Enter your ZIP code and tap Search to find {section.title.toLowerCase()} nearby.</p>
            ) : results[section.key].length === 0 ? (
              <p className="text-sm text-muted-foreground">No results found near {zip}. Call the hotline below for referrals in your area.</p>
            ) : (
              <ul className="space-y-3">
                {results[section.key].map(place => (
                  <li key={place.placeId} className="border-t border-border pt-3 first:border-0 first:pt-0">
                    <p className="text-sm font-medium text-foreground">{place.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{place.address}</p>
                    <a
                      href={place.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary mt-1 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View on Google Maps
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Persistent hotline card */}
      <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-5">
        <h3 className="font-semibold text-foreground mb-1">National Domestic Violence Hotline</h3>
        <p className="text-sm text-muted-foreground mb-3">Available 24/7 · thehotline.org</p>
        <a href="tel:1-800-799-7233">
          <Button className="w-full h-12 gap-2">
            <Phone className="w-4 h-4" />
            1-800-799-7233
          </Button>
        </a>
      </div>
    </div>
  );
}
