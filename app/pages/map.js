"use client";
import { useEffect, useState } from 'react';

export default function Map() {
  const [markerPositions, setMarkerPositions] = useState([]);
  const [trains, setTrains] = useState([]);

  const fetchTrains = async () => {
    console.log('Fetching train data...'); // Add console log to check button click
    const response = await fetch('/api/trains');
    const data = await response.json();
    setTrains(data);

    // Transform the train data to marker positions
    const positions = data.map(train => ({
      lat: parseFloat(train.latitude),
      lng: parseFloat(train.longitude),
      city: train.last_station,
      train: train.train_name,
      engine: train.engine_model,
      id: train.engine_id,
    }));

    setMarkerPositions(positions);
  };

  const initMap = () => {
    const googleMap = new window.google.maps.Map(document.getElementById('google-map'), {
      zoom: 7.5,
      center: { lat: 7.87708, lng: 80.69791 }, // Center of Sri Lanka
    });

    markerPositions.forEach((position) => {
      const marker = new window.google.maps.Marker({
        position: { lat: position.lat, lng: position.lng },
        map: googleMap,
        title: position.city,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="color:black"><h3>${position.city}</h3><p>Train: ${position.train}</p><p>Engine: ${position.engine}</p><p>ID: ${position.id}</p></div>`,
      });

      marker.addListener('click', () => {
        infoWindow.open(googleMap, marker);
      });
    });
  };

  const loadGoogleMapsScript = () => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;
    document.head.appendChild(script);
    window.initMap = initMap;
  };

  useEffect(() => {
    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      initMap();
    }
  }, []);

  useEffect(() => {
    if (markerPositions.length > 0) {
      initMap();
    }
  }, [markerPositions]);

  return (
    <div>
      <h1>Hello</h1>
      <button onClick={fetchTrains}>Load Train Data</button>
      <div id="google-map" style={{ height: 'calc(100vh - 100px)', width: '100vw' }} />
      <div>
        {trains.map((train) => (
          <div key={train._id.$oid}>
            <p>Train Name: {train.train_name}</p>
            <p>Engine Model: {train.engine_model}</p>
            <p>Engine ID: {train.engine_id}</p>
            <p>Latitude: {train.latitude}</p>
            <p>Longitude: {train.longitude}</p>
            <p>Last Station: {train.last_station}</p>
            <p>Timestamp: {train.time_stamp}</p>
            <p>Start Location: {train.start_location}</p>
            <p>Destination: {train.destination}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
