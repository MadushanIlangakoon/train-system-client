"use client";
import { useEffect, useState, useRef } from 'react';

export default function Map() {
  const [markerPositions, setMarkerPositions] = useState([]);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const fetchTrains = async () => {
    console.log('Fetching train data...');
    console.log('API URL:', process.env.NEXT_PUBLIC_TRAIN_API);
    console.log('API Key:', process.env.NEXT_PUBLIC_API_KEY);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_TRAIN_API, {
        headers: {
          'Authorization': `${process.env.NEXT_PUBLIC_API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

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
    } catch (error) {
      console.error('Error fetching train data:', error);
      setError(error.message);
    }
  };

  const initMap = () => {
    mapRef.current = new window.google.maps.Map(document.getElementById('google-map'), {
      zoom: 7.5,
      center: { lat: 7.87708, lng: 80.69791 }, // Center of Sri Lanka
    });

    // Initialize markers array
    markersRef.current = [];

    // Initial rendering of markers
    markerPositions.forEach((position) => {
      addOrUpdateMarker(position);
    });
  };

  const addOrUpdateMarker = (position) => {
    // Find existing marker by train ID
    const existingMarker = markersRef.current.find(marker => marker.id === position.id);

    if (existingMarker) {
      // Update position if marker exists
      existingMarker.setPosition({ lat: position.lat, lng: position.lng });
    } else {
      // Create new marker if it doesn't exist
      const marker = new window.google.maps.Marker({
        position: { lat: position.lat, lng: position.lng },
        map: mapRef.current,
        title: position.city,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="color:black"><h3>${position.city}</h3><p>Train: ${position.train}</p><p>Engine: ${position.engine}</p><p>ID: ${position.id}</p></div>`,
      });

      marker.addListener('click', () => {
        infoWindow.open(mapRef.current, marker);
      });

      marker.id = position.id; // Attach the train ID to the marker

      // Add to the markers array
      markersRef.current.push(marker);
    }
  };

  const updateMarkers = () => {
    markerPositions.forEach(position => {
      addOrUpdateMarker(position);
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
    fetchTrains(); // Initial fetch
    const intervalId = setInterval(fetchTrains, 60000); // Fetch data every 1/2 minute

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    if (markerPositions.length > 0) {
      updateMarkers(); // Update marker positions on the map
    }
  }, [markerPositions]);

  return (
    <div>
      <h1>Train Locations</h1>
      <div id="google-map" style={{ height: 'calc(100vh - 100px)', width: '100vw' }} />
    </div>
  );
}
