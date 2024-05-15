import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Location from 'expo-location';
import * as Network from 'expo-network';
import axios from 'axios';

export default function Gps() {
  const [ipAddress, setIpAddress] = useState();
  const [location, setLocation] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIpAddress();
    fetchLocation();
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      sendDataToServer();
      
    }, 1000); // every 1 second

    return () => clearInterval(intervalId);
  }, [ipAddress, location]);

  const fetchIpAddress = async () => {
    try {
      const ip = await Network.getIpAddressAsync();
      await setIpAddress(ip);
    } catch (error) {
      console.error('Error getting IP address:', error);
    }
  };

  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Location permission status:', status);

      if (status !== 'granted') {
        setError('Location permission not granted');
        return;
      }

      const mlocation = await Location.getCurrentPositionAsync({});
      await setLocation(mlocation);
      console.log('Fetched location:', mlocation);
    } catch (error) {
      setError(`Error getting location: ${error.message}`);
    }
  };

  const sendDataToServer = async () => {
    try {
      if (!location) {
        console.log('Location not available');
        return;
      }

      if (!ipAddress) {
        console.log('IP address not available');
        return;
      }

      const { latitude, longitude } = location.coords;

      // Fetch GPS data from server
      const response = await axios.get('http://192.168.3.133:3000/gps');
      const existingItem = response?.data?.find(item => item.ipAddress === ipAddress);

      if (existingItem) {
        // Update existing item's location
        const updatedData = { ...existingItem, latitude, longitude };
        await axios.put(`http://192.168.3.133:3000/gps/${existingItem.id}`, updatedData);
        console.log('Location updated successfully');
      } 
       


        // Add new item
        else{
        const data = { latitude, longitude, ipAddress };
        await axios.post('http://192.168.3.133:3000/gps', data);
        console.log('New location added successfully');
      }
    }
    catch (error) {
      console.error('Error sending location data:', error.message);
      Alert.alert('Error', 'Failed to send location data to server');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text selectable>
        GPS Location:
        {location ? (
          <>
            {'\n'}Latitude: {location.coords.latitude}
            {'\n'}Longitude: {location.coords.longitude}
          </>
        ) : (
          '\nNo location fetched yet'
        )}
      </Text>
      {error && <Text selectable>Error: {error}</Text>}
      <Text>IP Address: {ipAddress || 'Fetching IP address...'}</Text>
    </View>
  );
}
