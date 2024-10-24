import React, { useState, useEffect } from 'react';

interface Country {
  code: string;
  name: string;
}

const CountrySelector = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  useEffect(() => {
    // Mantén tus países originales
    const fetchedCountries = [
      { code: 'US', name: 'United States' },
      { code: 'MX', name: 'Mexico' },
      { code: 'GB', name: 'United Kingdom' },
      { code: 'FR', name: 'France' },
      { code: 'BR', name: 'Brazil' },
    ];
    setCountries(fetchedCountries);
  }, []);

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = event.target.value;
    const selected = countries.find((country) => country.code === countryCode) || null;
    setSelectedCountry(selected);
  };

  return (
    <div>
      <select onChange={handleCountryChange}>
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>

      {/* Mostrar el país seleccionado */}
      {selectedCountry && (
        <p>
          You selected: {selectedCountry.name}
        </p>
      )}
    </div>
  );
};

export default CountrySelector;
