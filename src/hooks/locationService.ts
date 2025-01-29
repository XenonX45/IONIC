import { Geolocation } from '@capacitor/geolocation';

export const fetchWeatherWithGeolocation = async (setWeather: (weather: string | null) => void) => {
  try {
    const position = await Geolocation.getCurrentPosition();
    const { latitude, longitude } = position.coords;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=055edc42bdc91b2c5390365d1ae87c67&units=metric`
    );
    const data = await response.json();

    if (data.weather && data.weather.length > 0 && data.main) {
      setWeather(`${data.weather[0].description}, ${data.main.temp}°C`);
    } else {
      setWeather("Données météo indisponibles");
    }
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    setWeather('Météo indisponible');
  }
};