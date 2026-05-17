"use client";

import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

export interface PlaceResult {
  city: string;
  state: string;
  lat: number;
  lng: number;
  label: string;
}

interface Props {
  placeholder?: string;
  defaultValue?: string;
  onSelect: (place: PlaceResult) => void;
  height?: number;
}

export default function BuscaLocalizacao({ placeholder, defaultValue, onSelect, height = 52 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState(defaultValue ?? "");

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY;
    if (!apiKey || !inputRef.current) return;

    let listenerHandle: google.maps.MapsEventListener | undefined;

    setOptions({ key: apiKey, v: "weekly" });

    importLibrary("places").then((placesLib) => {
      if (!inputRef.current) return;

      const { Autocomplete } = placesLib as google.maps.PlacesLibrary;
      const autocomplete = new Autocomplete(inputRef.current, {
        types: ["geocode"],
        componentRestrictions: { country: "br" },
        fields: ["address_components", "geometry", "name", "formatted_address"],
      });

      listenerHandle = autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry?.location) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        const components = place.address_components ?? [];
        const cityComp =
          components.find((c) => c.types.includes("locality")) ??
          components.find((c) => c.types.includes("administrative_area_level_2")) ??
          components.find((c) => c.types.includes("sublocality_level_1"));
        const stateComp = components.find((c) => c.types.includes("administrative_area_level_1"));

        const city = cityComp?.long_name ?? place.name ?? "";
        const state = stateComp?.short_name ?? "";
        const label = [city, state].filter(Boolean).join(", ");

        setValue(label);
        onSelectRef.current({ city, state, lat, lng, label });
      });
    });

    return () => {
      if (listenerHandle) {
        google.maps.event.removeListener(listenerHandle);
      }
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex", alignItems: "center" }}>
        <PinIcon focused={focused} />
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder ?? "Buscar cidade ou bairro…"}
        autoComplete="off"
        style={{
          width: "100%",
          height: `${height}px`,
          backgroundColor: "#1A1A1A",
          border: `1px solid ${focused ? "#FFD11A" : "#2E2E2E"}`,
          borderRadius: "10px",
          padding: `0 16px 0 42px`,
          fontSize: "15px",
          color: "#F0F0F0",
          fontFamily: "var(--font-inter), Inter, sans-serif",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.15s",
        }}
      />
    </div>
  );
}

function PinIcon({ focused }: { focused: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={focused ? "#FFD11A" : "#555555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
