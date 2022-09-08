const cityname = document.getElementById('cityname');
const submit = document.getElementById('submit');
const myChart = document.getElementById('myChart').getContext('2d');

let chart;

submit.addEventListener('click', () => {
    getCoordinates(cityname.value);
});

function getCoordinates(cityname) {
    const url = `https://nominatim.openstreetmap.org/search?q=${cityname}&format=json`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const lat = data[0].lat;
            const lon = data[0].lon;
            getTemperature(lat, lon);
        })
        .catch(error => console.log(error));
}

function getTemperature(lat, lon) {
    const url = `https://archive-api.open-meteo.com/v1/era5?latitude=${lat}&longitude=${lon}&start_date=1960-01-01&end_date=2021-12-31&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=Europe%2FBerlin`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const historical = {};
            for (let i = 0; i < data.daily.time.length; i++) {
            const date = data.daily.time[i];
            const temperature = data.daily.temperature_2m_max[i];
            const temperatureMin = data.daily.temperature_2m_min[i]
            const precipitation = data.daily.precipitation_sum[i];
            const windspeed = data.daily.windspeed_10m_max[i];
            historical[date] = {
                temperature,
                precipitation,
                windspeed,
                temperatureMin
            };
            }
            const labels = Object.keys(historical);
            const temperatures = Object.values(historical).map(item => item.temperature);
            const precipitations = Object.values(historical).map(item => item.precipitation);
            const temperaturesMin = Object.values(historical).map(item => item.temperatureMin);
            const windspeeds = Object.values(historical).map(item => item.windspeed);
            if (chart) {
                chart.destroy();
            }
            chart = new Chart(myChart, {
                type: 'line',
                data: {
                    labels,
                    datasets: [
                    {
                        label: 'Temperature',
                        data: temperatures,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Temperature Min',
                        data: temperaturesMin,
                        backgroundColor: 'rgba(0, 99, 132, 0.2)',
                        borderColor: 'rgba(0, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Precipitation',
                        data: precipitations,
                        backgroundColor: 'rgba(122, 99, 132, 0.2)',
                        borderColor: 'rgba(122, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Wind Speed',
                        data: windspeeds,
                        backgroundColor: 'rgba(35, 99, 132, 0.2)',
                        borderColor: 'rgba(35, 99, 132, 1)',
                        borderWidth: 1
                    }
                    ]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        })
        .catch(error => console.log(error));
}