async function fetchMoodData() {
    try {
        const response = await fetch("http://localhost:3000/mood-data");
        const data = await response.json()
        return data;
    } catch (error) {
        console.error("Error fetching mood data:", error);
        return [];
    }
}

async function renderChart() {
    const moodData = await fetchMoodData();

    moodData.sort((a, b) => new Date(a.date) - new Date(b.date))

    const labels = moodData.map(entry => entry.date);
    const moodValues = moodData.map(entry => entry.rating); // Adjust this based on your data
    console.log(moodValues);

    const ctx = document.getElementById('moodChart').getContext('2d');
    new Chart(ctx, {
        type: 'line', // Change to 'bar', 'pie', etc. if desired
        data: {
            labels: labels,
            datasets: [{
                label: 'Mood Rating',
                data: moodValues,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}

renderChart();