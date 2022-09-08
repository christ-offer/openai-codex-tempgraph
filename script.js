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
    const url = `https://archive-api.open-meteo.com/v1/era5?latitude=${lat}&longitude=${lon}&start_date=1960-01-01&end_date=2021-12-31&daily=temperature_2m_max,precipitation_sum&timezone=Europe%2FBerlin`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const historical = {};
            for (let i = 0; i < data.daily.time.length; i++) {
            const date = data.daily.time[i];
            const temperature = data.daily.temperature_2m_max[i];
            const precipitation = data.daily.precipitation_sum[i];
            historical[date] = {
                temperature,
                precipitation
            };
            }
            const labels = Object.keys(historical);
            const temperatures = Object.values(historical).map(item => item.temperature);
            const precipitations = Object.values(historical).map(item => item.precipitation);
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
                        label: 'Precipitation',
                        data: precipitations,
                        backgroundColor: 'rgba(122, 99, 132, 0.2)',
                        borderColor: 'rgba(122, 99, 132, 1)',
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