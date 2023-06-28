import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import axios from 'axios';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App = () => {
  const [temperatureValues, setTemperatureValues] = useState([]);
  const [humidityValues, setHumidityValues] = useState([]);
  const [timestamps, setTimestamps] = useState([]);

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000); // Fetch data every 5 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const formattedTime = new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(date);

    return formattedTime;
  };

  const baseUrl = 'http://localhost:4000';

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/display-data`);
      const fetchedData = response.data;

      console.log('fetched data:', fetchedData);
      setTimestamps(fetchedData.map((item) => formatTime(item.timestamp)));
      setTemperatureValues(fetchedData.map((item) => item.temperature));
      setHumidityValues(fetchedData.map((item) => item.humidity));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Rwanda Coding Academy Humidity - Temperature Bar Chart',
      },
    },
  };

  const chartData = {
    labels: timestamps,
    datasets: [
      {
        label: 'Temperatures',
        data: temperatureValues,
        backgroundColor: '#C0F2CF', // Blue color
      },
      {
        label: 'Humidity',
        data: humidityValues,
        backgroundColor: 'rgb(247,247,204)', // Orange color
      },
    ],
  };

  return (
    <div className="flex w-full flex-col justify-center items-center">
      <nav className="w-full flex items-center justify-between bg-primary py-4 px-6 shadow">
        <div className="flex items-center">
          <div className="text-white text-2xl font-bold mr-2">Temp.</div>
        </div>
      </nav>
      <div className="w-[75%] m-10">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default App;
