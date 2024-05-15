import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5001/db');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const goToMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div>
      <p className='h1 bold'>Dashboard</p>
      <div>
        <table className='table table-hover' border={1}>
          <thead>
            <tr>
              <th>Id</th>
              <th>IpAdress</th>
              <th>GPS</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.ipAddress}</td>
                <td>
                  <button className='btn btn-primary' onClick={() => goToMaps(item.latitude, item.longitude)}>
                    Go to GPS
                  </button>
                </td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
