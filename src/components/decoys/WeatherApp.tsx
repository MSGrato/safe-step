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
  if (code === 0) return { icon: <Sun className="w-16 h-16 text-decoy-accent" />, description: 'Clear sky' };
  if (code <= 3) return { icon: <Cloud className="w-16 h-16 text-decoy-muted" />, description: code === 1 ? 'Mainly clear' : code === 2 ? 'Partly cloudy' : 'Overcast' };
  if (code <= 49) return { icon: <CloudFog className="w-16 h-16 text-decoy-muted" />, description: 'Foggy' };
  if (code <= 59) return { icon: <CloudDrizzle className="w-16 h-16 text-decoy-accent" />, description: 'Drizzle' };
  if (code <= 69) return { icon: <CloudRain className="w-16 h-16 text-decoy-accent" />, description: 'Rain' };
  if (code <= 79) return { icon: <CloudSnow className="w-16 h-16 text-decoy-muted" />, description: 'Snow' };
  if (code <= 84) return { icon: <CloudRain className="w-16 h-16 text-decoy-accent" />, description: 'Rain showers' };
  if (code <= 86) return { icon: <CloudSnow className="w-16 h-16 text-decoy-muted" />, description: 'Snow showers' };
  if (code <= 99) return { icon: <CloudLightning className="w-16 h-16 text-decoy-accent" />, description: 'Thunderstorm' };
  return { icon: <Cloud className="w-16 h-16 text-decoy-muted" />, description: 'Unknown' };
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
        <div className="bg-decoy-card px-5 pt-12 pb-5 shadow-sm">
          <h1 className="text-2xl font-bold text-decoy-text mb-4" onPointerDown={onTripleTap}>Weather</h1>
          <div className="flex items-center gap-2 bg-decoy-bg rounded-xl px-4 py-3">
            <Search className="w-4 h-4 text-decoy-muted shrink-0" />
            <input
              type="text"
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="bg-transparent text-decoy-text text-sm outline-none w-full placeholder:text-decoy-muted"
            />
            <button onClick={handleSearch} disabled={searching} className="text-decoy-accent text-sm font-medium shrink-0">
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-2">
          {error && <p className="text-sm text-decoy-muted text-center py-4">{error}</p>}
          {searchResults.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <MapPin className="w-12 h-12 text-decoy-muted mb-4" />
              <p className="text-decoy-muted text-sm">Enter a city name to get started</p>
            </div>
          )}
          {searchResults.map((result, i) => (
            <button
              key={i}
              onClick={() => selectLocation(result)}
              className="w-full bg-decoy-card rounded-2xl p-4 shadow-sm flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
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
      <div className="bg-decoy-card px-5 pt-12 pb-5 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-decoy-text" onPointerDown={onTripleTap}>Weather</h1>
          <button
            onClick={() => { setLocation(null); localStorage.removeItem(LOCATION_KEY); }}
            className="text-decoy-accent text-sm font-medium"
          >
            Change
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-decoy-muted">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-sm">{location.city}, {location.country}</span>
        </div>
      </div>

      <div className="px-5 py-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-decoy-accent animate-spin" />
            <p className="text-sm text-decoy-muted mt-4">Loading weather...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-sm text-decoy-muted">{error}</p>
            <button onClick={() => fetchWeather(location.lat, location.lon)} className="text-decoy-accent text-sm font-medium mt-2">
              Try again
            </button>
          </div>
        )}

        {weather && weatherInfo && !loading && (
          <div className="space-y-5">
            {/* Main temperature card */}
            <div className="bg-decoy-card rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
              {weatherInfo.icon}
              <p className="text-6xl font-bold text-decoy-text mt-4">{weather.temperature}°</p>
              <p className="text-base text-decoy-muted mt-1">{weatherInfo.description}</p>
              <p className="text-sm text-decoy-muted mt-2">
                H: {weather.temperatureMax}° &nbsp; L: {weather.temperatureMin}°
              </p>
            </div>

            {/* Details row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-decoy-card rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-decoy-bg flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-decoy-accent" />
                </div>
                <div>
                  <p className="text-xs text-decoy-muted">Humidity</p>
                  <p className="text-lg font-semibold text-decoy-text">{weather.humidity}%</p>
                </div>
              </div>
              <div className="bg-decoy-card rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-decoy-bg flex items-center justify-center">
                  <Wind className="w-5 h-5 text-decoy-accent" />
                </div>
                <div>
                  <p className="text-xs text-decoy-muted">Wind</p>
                  <p className="text-lg font-semibold text-decoy-text">{weather.windSpeed} mph</p>
                </div>
              </div>
            </div>

            {/* Search for another location */}
            <div className="bg-decoy-card rounded-2xl p-4 shadow-sm">
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
                <button onClick={handleSearch} disabled={searching} className="text-decoy-accent text-sm font-medium shrink-0">
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
