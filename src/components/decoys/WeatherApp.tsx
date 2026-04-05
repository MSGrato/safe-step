import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Droplets, Wind, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog, Loader2 } from 'lucide-react';

type WeatherLocation = {
  lat: number;
  lon: number;
  city: string;
  country: string;
};

type WeatherData = {
  temperature: number;
  temperatureMax: number;
  temperatureMin: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
};

type GeoResult = {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
};

const LOCATION_KEY = 'safestep_weather_location';

function loadLocation(): WeatherLocation | null {
  const data = localStorage.getItem(LOCATION_KEY);
  return data ? JSON.parse(data) : null;
}

function saveLocation(loc: WeatherLocation) {
  localStorage.setItem(LOCATION_KEY, JSON.stringify(loc));
}

// Maps WMO weather codes to icons and descriptions
function getWeatherInfo(code: number, isDay: boolean): { icon: React.ReactNode; description: string } {
  if (code === 0) return { icon: <Sun className="w-20 h-20 text-decoy-accent" />, description: 'Clear Sky' };
  if (code <= 3) return { icon: <Cloud className="w-20 h-20 text-decoy-muted" />, description: code === 1 ? 'Mainly Clear' : code === 2 ? 'Partly Cloudy' : 'Overcast' };
  if (code <= 49) return { icon: <CloudFog className="w-20 h-20 text-decoy-muted" />, description: 'Foggy' };
  if (code <= 59) return { icon: <CloudDrizzle className="w-20 h-20 text-decoy-accent" />, description: 'Drizzle' };
  if (code <= 69) return { icon: <CloudRain className="w-20 h-20 text-decoy-accent" />, description: 'Rain' };
  if (code <= 79) return { icon: <CloudSnow className="w-20 h-20 text-decoy-muted" />, description: 'Snow' };
  if (code <= 84) return { icon: <CloudRain className="w-20 h-20 text-decoy-accent" />, description: 'Rain Showers' };
  if (code <= 86) return { icon: <CloudSnow className="w-20 h-20 text-decoy-muted" />, description: 'Snow Showers' };
  if (code <= 99) return { icon: <CloudLightning className="w-20 h-20 text-decoy-accent" />, description: 'Thunderstorm' };
  return { icon: <Cloud className="w-20 h-20 text-decoy-muted" />, description: 'Unknown' };
}

export function WeatherApp({ onTripleTap }: { onTripleTap?: () => void }) {
  const [location, setLocation] = useState<WeatherLocation | null>(loadLocation);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_days=1`
      );
      if (!res.ok) throw new Error('Failed to fetch weather');
      const data = await res.json();
      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        temperatureMax: Math.round(data.daily.temperature_2m_max[0]),
        temperatureMin: Math.round(data.daily.temperature_2m_min[0]),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        weatherCode: data.current.weather_code,
        isDay: data.current.is_day === 1,
      });
    } catch {
      setError('Could not load weather data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeather(location.lat, location.lon);
    }
  }, [location, fetchWeather]);

  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setSearching(true);
    setSearchResults([]);
    setError('');
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setSearchResults(data.results);
      } else {
        setError('No locations found. Try a different city name.');
      }
    } catch {
      setError('Search failed. Check your connection.');
    } finally {
      setSearching(false);
    }
  };

  const selectLocation = (result: GeoResult) => {
    const loc: WeatherLocation = {
      lat: result.latitude,
      lon: result.longitude,
      city: result.name,
      country: result.country,
    };
    setLocation(loc);
    saveLocation(loc);
    setSearchResults([]);
    setSearchQuery('');
  };

  // --- No location set: show search prompt ---
  if (!location) {
    return (
      <div className="min-h-screen bg-decoy-bg">
        {/* Header */}
        <div className="bg-decoy-card border-b border-[hsl(var(--border))] px-5 pt-12 pb-4 shadow-sm">
          <h1 className="text-2xl font-bold text-decoy-text" onPointerDown={onTripleTap}>Weather</h1>
          <p className="text-sm text-decoy-muted mt-0.5">Find your location to get started</p>
        </div>

        {/* Search bar */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 bg-decoy-card rounded-2xl px-4 py-3 shadow-sm border border-[hsl(var(--border))]">
            <Search className="w-4 h-4 text-decoy-muted shrink-0" />
            <input
              type="text"
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="bg-transparent text-decoy-text text-sm outline-none w-full placeholder:text-decoy-muted"
            />
            <button onClick={handleSearch} disabled={searching} className="text-decoy-accent text-sm font-semibold shrink-0">
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>
          </div>
        </div>

        <div className="px-5 space-y-2">
          {error && <p className="text-sm text-decoy-muted text-center py-4">{error}</p>}
          {searchResults.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-decoy-card border border-[hsl(var(--border))] flex items-center justify-center mb-4 shadow-sm">
                <MapPin className="w-8 h-8 text-decoy-accent" />
              </div>
              <p className="text-decoy-text font-medium">No location set</p>
              <p className="text-decoy-muted text-sm mt-1">Enter a city name above</p>
            </div>
          )}
          {searchResults.map((result, i) => (
            <button
              key={i}
              onClick={() => selectLocation(result)}
              className="w-full bg-decoy-card rounded-2xl p-4 shadow-sm border border-[hsl(var(--border))] flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
            >
              <div className="w-10 h-10 rounded-xl bg-decoy-bg flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-decoy-accent" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-decoy-text truncate">{result.name}</p>
                <p className="text-sm text-decoy-muted truncate">{result.admin1 ? `${result.admin1}, ` : ''}{result.country}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- Weather display ---
  const weatherInfo = weather ? getWeatherInfo(weather.weatherCode, weather.isDay) : null;

  return (
    <div className="min-h-screen bg-decoy-bg">
      {/* Header */}
      <div className="bg-decoy-card border-b border-[hsl(var(--border))] px-5 pt-12 pb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-decoy-text" onPointerDown={onTripleTap}>Weather</h1>
            <div className="flex items-center gap-1.5 text-decoy-muted mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-decoy-accent" />
              <span className="text-sm">{location.city}, {location.country}</span>
            </div>
          </div>
          <button
            onClick={() => { setLocation(null); localStorage.removeItem(LOCATION_KEY); }}
            className="text-decoy-accent text-sm font-semibold"
          >
            Change
          </button>
        </div>
      </div>

      <div className="px-5 py-5">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-decoy-accent animate-spin" />
            <p className="text-sm text-decoy-muted mt-4">Loading weather...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-sm text-decoy-muted">{error}</p>
            <button onClick={() => fetchWeather(location.lat, location.lon)} className="text-decoy-accent text-sm font-semibold mt-2">
              Try again
            </button>
          </div>
        )}

        {weather && weatherInfo && !loading && (
          <div className="space-y-4">
            {/* Main temperature card — tinted sky background */}
            <div className="bg-decoy-card rounded-3xl p-8 shadow-sm border border-[hsl(var(--border))] flex flex-col items-center text-center overflow-hidden relative">
              {/* Subtle sky tint overlay */}
              <div className="absolute inset-0 bg-[hsl(var(--decoy-accent)/0.06)] pointer-events-none" />
              <div className="relative">
                {weatherInfo.icon}
                <p className="text-7xl font-thin text-decoy-text mt-3 tracking-tight">{weather.temperature}°</p>
                <p className="text-lg font-medium text-decoy-text mt-1">{weatherInfo.description}</p>
                <p className="text-sm text-decoy-muted mt-1">
                  H: {weather.temperatureMax}°&ensp;/&ensp;L: {weather.temperatureMin}°
                </p>
              </div>
            </div>

            {/* Details row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-decoy-card rounded-2xl p-4 shadow-sm border border-[hsl(var(--border))] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-decoy-bg flex items-center justify-center shrink-0">
                  <Droplets className="w-5 h-5 text-decoy-accent" />
                </div>
                <div>
                  <p className="text-xs text-decoy-muted uppercase tracking-wide">Humidity</p>
                  <p className="text-xl font-semibold text-decoy-text">{weather.humidity}%</p>
                </div>
              </div>
              <div className="bg-decoy-card rounded-2xl p-4 shadow-sm border border-[hsl(var(--border))] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-decoy-bg flex items-center justify-center shrink-0">
                  <Wind className="w-5 h-5 text-decoy-accent" />
                </div>
                <div>
                  <p className="text-xs text-decoy-muted uppercase tracking-wide">Wind</p>
                  <p className="text-xl font-semibold text-decoy-text">{weather.windSpeed} <span className="text-sm font-normal">mph</span></p>
                </div>
              </div>
            </div>

            {/* Search for another location */}
            <div className="bg-decoy-card rounded-2xl p-4 shadow-sm border border-[hsl(var(--border))]">
              <p className="text-xs text-decoy-muted uppercase tracking-wide mb-3">Search Location</p>
              <div className="flex items-center gap-2 bg-decoy-bg rounded-xl px-4 py-3">
                <Search className="w-4 h-4 text-decoy-muted shrink-0" />
                <input
                  type="text"
                  placeholder="Search another city..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="bg-transparent text-decoy-text text-sm outline-none w-full placeholder:text-decoy-muted"
                />
                <button onClick={handleSearch} disabled={searching} className="text-decoy-accent text-sm font-semibold shrink-0">
                  {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Go'}
                </button>
              </div>
              {searchResults.length > 0 && (
                <div className="mt-3 space-y-2">
                  {searchResults.map((result, i) => (
                    <button
                      key={i}
                      onClick={() => selectLocation(result)}
                      className="w-full rounded-xl p-3 flex items-center gap-3 text-left active:scale-[0.98] transition-transform bg-decoy-bg"
                    >
                      <MapPin className="w-4 h-4 text-decoy-accent shrink-0" />
                      <span className="text-sm text-decoy-text truncate">{result.name}{result.admin1 ? `, ${result.admin1}` : ''}, {result.country}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
