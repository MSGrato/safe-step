import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Phone, MapPin } from 'lucide-react';
import { storage } from '@/lib/storage';

const placeholderSections = [
  { title: 'Shelters', emoji: '🏠', note: 'Location-based shelter lookup coming soon.' },
  { title: 'Legal Aid', emoji: '⚖️', note: 'Legal aid directory coming soon.' },
  { title: 'Counseling', emoji: '💬', note: 'Counseling services directory coming soon.' },
];

export function ResourcesTab() {
  const [zip, setZip] = useState(storage.getZipCode());

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
      </div>

      <div className="space-y-4 mb-8">
        {placeholderSections.map(section => (
          <div key={section.title} className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{section.emoji}</span>
              <h3 className="font-semibold text-foreground">{section.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{section.note}</p>
            <p className="text-xs text-muted-foreground mt-2">Call the hotline below for referrals in your area.</p>
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
