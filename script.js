const apiKey = 'b57d3f4d038583550d1199acb002af1b'; // Replace with your OpenWeatherMap API key

// Function to fetch weather data from API
function fetchWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        });
}

// Function to display weather data on the webpage
function displayWeatherData(data) {
    const cityName = document.getElementById('cityName');
    const temperature = document.getElementById('temperature');
    const description = document.getElementById('description');
    const windSpeed = document.getElementById('windSpeed');

    cityName.textContent = data.name;
    temperature.textContent = `Temperature: ${data.main.temp}°C`;
    description.textContent = `Weather: ${data.weather[0].description}`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;

    // Show favorite button after displaying weather data
    document.getElementById('favoriteIcon').style.display = 'inline';

    // Show weather info section
    document.getElementById('weatherInfo').style.display = 'block';
}

// Function to add city to recent searches
function addToRecentSearches(city) {
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

    // Remove city if already exists to add to the top
    recentSearches = recentSearches.filter(item => item !== city);

    // Add city to recent searches
    recentSearches.unshift(city);

    // Save to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));

    // Display recent searches
    displayRecentSearches();
}

// Function to display recent searches
// Function to display recent searches
function displayRecentSearches() {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    const recentSearchList = document.getElementById('recentSearchList');
    recentSearchList.innerHTML = '';

    recentSearches.slice(0, 5).forEach(city => {
        const div = document.createElement('div');
        div.textContent = city;
        div.classList.add('recentSearch');
        div.addEventListener('click', () => {
            fetchWeatherData(city)
                .then(data => {
                    displayWeatherData(data);
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    alert('City not found. Please enter a valid city name.');
                });
        });
        recentSearchList.appendChild(div);
    });

    // Show or hide recent searches section based on data presence
    const recentSearchesSection = document.getElementById('recentSearches');
    recentSearchesSection.style.display = recentSearches.length > 0 ? 'block' : 'none';
}

// Function to add city to favorites
function addToFavorites(city) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (!favorites.includes(city)) {
        if (favorites.length >= 5) {
            alert('You already have 5 favorites. Remove some favorites to add new ones.');
            return;
        }
        favorites.unshift(city);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavoriteCities();
    } else {
        alert('City is already in favorites.');
    }
}

// Function to display favorite cities with weather data

// Function to display favorite cities with weather data and delete button
function displayFavoriteCities() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteCities = document.getElementById('favoriteCities');
    favoriteCities.innerHTML = '';

    favorites.forEach(city => {
        const div = document.createElement('div');
        div.classList.add('favoriteCity');

        // City name text
        const cityName = document.createElement('span');
        cityName.textContent = city;

        // Temperature text
        const temperature = document.createElement('span');
        temperature.classList.add('temperature');
        temperature.style.marginLeft = '5px'; // Adjust spacing between temperature and city name

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('deleteBtn');
        deleteBtn.addEventListener('click', () => {
            removeFromFavorites(city);
        });

        // Click event to fetch and display weather data for the city
        cityName.addEventListener('click', () => {
            fetchWeatherData(city)
                .then(data => {
                    displayWeatherData(data);
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    alert('City not found. Please enter a valid city name.');
                });
        });

        div.appendChild(cityName);
        div.appendChild(temperature);
        div.appendChild(deleteBtn);
        favoriteCities.appendChild(div);

        // Fetch and display weather data for the city
        fetchWeatherData(city)
            .then(data => {
                temperature.textContent = `${data.main.temp}°C`;
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                temperature.textContent = 'N/A';
            });
    });

    // Show or hide favorites section based on data presence
    const favoritesSection = document.getElementById('favorites');
    favoritesSection.style.display = favorites.length > 0 ? 'block' : 'none';
}

// Function to remove city from favorites
function removeFromFavorites(city) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Remove city from favorites array
    favorites = favorites.filter(item => item !== city);

    // Update localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Re-display favorite cities
    displayFavoriteCities();
}

// Function to update weather data for favorite cities every 3 seconds
function updateFavoriteCitiesWeather() {
    displayFavoriteCities(); // Initial display
    setInterval(displayFavoriteCities, 3000); // Update every 3 seconds
}

// Initialize recent searches and favorites on page load
window.addEventListener('DOMContentLoaded', () => {
    displayRecentSearches();
    updateFavoriteCitiesWeather();
});

// Event listener for search button
document.getElementById('searchBtn').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
        fetchWeatherData(city)
            .then(data => {
                displayWeatherData(data);
                addToRecentSearches(city);
                document.getElementById('cityInput').value = ''; // Clear input after search
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                alert('City not found. Please enter a valid city name.');
            });
    } else {
        alert('Please enter a city name');
    }
});

// Event listener for Enter key in search input
document.getElementById('cityInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const city = document.getElementById('cityInput').value.trim();
        if (city) {
            fetchWeatherData(city)
                .then(data => {
                    displayWeatherData(data);
                    addToRecentSearches(city);
                    document.getElementById('cityInput').value = ''; // Clear input after search
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    alert('City not found. Please enter a valid city name.');
                });
        } else {
            alert('Please enter a city name');
        }
    }
});

// Event listener for favorite icon
document.getElementById('favoriteIcon').addEventListener('click', () => {
    const city = document.getElementById('cityName').textContent.trim();
    addToFavorites(city);
});

// Event listener for clear history button
document.getElementById('clearHistoryBtn').addEventListener('click', () => {
    localStorage.removeItem('recentSearches');
    displayRecentSearches();

    // Clear displayed weather data
    document.getElementById('cityName').textContent = '';
    document.getElementById('temperature').textContent = '';
    document.getElementById('description').textContent = '';
    document.getElementById('windSpeed').textContent = '';

    // Hide favorite icon
    document.getElementById('favoriteIcon').style.display = 'none';

    // Hide weather info section
    document.getElementById('weatherInfo').style.display = 'none';
});
