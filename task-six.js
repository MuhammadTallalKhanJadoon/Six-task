async function getWeather(){

    let city = document.getElementById("city").value.trim();

    if(!city){
        alert("Enter city name");
        return;
    }

    let geoURL =
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;

    let geoRes = await fetch(geoURL);
    let geoData = await geoRes.json();

    if(!geoData.results){
        document.getElementById("location").textContent = "City not found";
        return;
    }

    let place = geoData.results[0];

    let lat = place.latitude;
    let lon = place.longitude;

    let weatherURL =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,cloud_cover,wind_speed_10m,weather_code&hourly=precipitation_probability&forecast_days=1`;

    let weatherRes = await fetch(weatherURL);
    let data = await weatherRes.json();

    let current = data.current;

    let condition = "Unknown";

    if(current.weather_code === 0){
        condition = "☀️ Sunny";
    }
    else if([1,2].includes(current.weather_code)){
        condition = "🌤 Partly Cloudy";
    }
    else if(current.weather_code === 3){
        condition = "☁️ Cloudy";
    }
    else if([61,63,65,80,81,82].includes(current.weather_code)){
        condition = "🌧 Rainy";
    }

    let rainChance =
    Math.max(...data.hourly.precipitation_probability);

    document.getElementById("location").textContent =
    `${place.name}, ${place.country}`;

    document.getElementById("temp").textContent =
    `${current.temperature_2m}°C`;

    document.getElementById("humidity").textContent =
    `${current.relative_humidity_2m}%`;

    document.getElementById("cloud").textContent =
    `${current.cloud_cover}%`;

    document.getElementById("wind").textContent =
    `${current.wind_speed_10m} km/h`;

    document.getElementById("rain").textContent =
    `${rainChance}%`;

    document.getElementById("condition").textContent =
    condition;


    
    const result = document.getElementById("about-result");
    const image =document.getElementById("cityImage");

    if(!city){result.innerHTML ="<p>Please enter a city name.</p>";
    return;
    }

    result.innerHTML = "Searching...";
    image.style.display = "none";

    try{

        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`);

        const data = await response.json();

        if(data.type === "https://mediawiki.org/wiki/HyperSwitch/errors/not_found"){

            result.innerHTML ="<p>City not found.</p>";

            return;
        }

        result.innerHTML = `
            <h2>${data.title}</h2>
            <p>${data.extract || "No description available."}</p>
        `;

        if(data.thumbnail){

            image.src = data.thumbnail.source;

            image.style.display = "block";

        }else{

            result.innerHTML += "";

        }

    }
    catch(error){

        console.log(error);

        result.innerHTML = "<p>Something went wrong.</p>";

    }

}

document.getElementById("city").addEventListener("keydown",function(event){
    if(event.key === "Enter"){
        getWeather();
    }
});
