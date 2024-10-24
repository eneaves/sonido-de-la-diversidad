import React, { useState, useEffect } from 'react';

interface Country {
  code: string;
  name: string;
}

interface CountrySelectorProps {
  onCountrySelect: (countryCode: string | null) => void;
}

const CountrySelector = ({ onCountrySelect }: CountrySelectorProps) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  useEffect(() => {
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
    onCountrySelect(selected ? selected.code : null); // Pasamos solo el código del país
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
    </div>
  );
};


export default CountrySelector;
