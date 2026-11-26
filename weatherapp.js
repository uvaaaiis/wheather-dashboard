let API_KEY = "0119cf3e865ca5b4721c8b468c013b93"

let weathercard = document.getElementById("weatherCard")
let errormsg = document.getElementById("errorMsg")
let searchbtn = document.getElementById("searchBtn")
let cityinput = document.getElementById("cityInput")
let favoriteslist = document.getElementById("favoritesList")
let favoritesbtn = document.getElementById("favoritesbtn")
let addbtn = document.getElementById("add")
let removebtn = document.getElementById("remove")
let themebtn = document.getElementById("themeBtn")


async function getweather(city){
    let fulldata = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)

    if(!fulldata.ok){
        if(fulldata.status == 401){
            throw new Error("invalid API")
        }
        if(fulldata.status == 404){
            throw new Error("city not found")
        }

        throw new Error("Something went wrong")
    }

    let data = await fulldata.json()

        return {
            city: data.name,
            temp: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed
        };
}

let currentcity = ""
async function searchWeather(){
    let city = cityinput.value.trim()
    if(city === ""){
        errormsg.style.display= "block"
        errormsg.textContent = "Please enter your city"
        weathercard.style.display = "none"
        return
    } 
    try{
        weathercard.style.display = "block"
        errormsg.style.display = "none"

        let data = await getweather(city)
        currentcity = data.city;
        weathercard.innerHTML = `
        <h1>${data.city}</h1>
        <p>Temperature : ${data.temp}</p>
        <p>FeelsLike : ${data.feelsLike}</p>
        <p>Description : ${data.description}</p>
        <p>Humidity : ${data.humidity}</p>
        <p>WindSpeed : ${data.windSpeed}</p>`
    }
    catch(error){
        weathercard.style.display = "none"
        errormsg.style.display = "block"
        errormsg.textContent = error.message
    }
}


searchbtn.addEventListener("click",()=>{
    searchWeather()
})

cityinput.addEventListener("click",()=>{
    cityinput.value = ""
    weathercard.style.display = "none"
})
cityinput.addEventListener("keydown",()=>{
    if(event.key === "Enter"){
        searchWeather()
    }
})

let fav = JSON.parse(localStorage.getItem("fav")) || []

function addFavorite(city){
    if(fav.includes(city)){
        errormsg.style.display = "block"
        errormsg.textContent = "already added"
        return
    }
    fav.push(city)
    localStorage.setItem("fav",JSON.stringify(fav))
    displayfav()
}

function displayfav(){
    favoriteslist.innerHTML = ""
    fav.forEach(each => {
        if(!each || !each.trim()){
            return
        }

        let div= document.createElement("div")
        div.textContent = each
        favoriteslist.appendChild(div)

        div.addEventListener("click",()=>{
        cityinput.value = each
        searchWeather()
        })
    });   
}

function removefavorite(){
    fav = fav.filter(one => one !== currentcity)
    localStorage.setItem("fav",JSON.stringify(fav))
    displayfav()
}

addbtn.addEventListener("click",()=>{
    addFavorite(currentcity)
})

favoritesbtn.addEventListener("click",()=>{
    if(favoriteslist.innerHTML === ""){
        displayfav()
        favoriteslist.style.display = "block"
    }else{
        favoriteslist.innerHTML =""
        favoriteslist.style.display = "none"
    }
})

removebtn.addEventListener("click",()=>{
    removefavorite()
})



let theming = document.getElementById("themeBtn")
theming.addEventListener("click",themer)

function themer(){
        document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themebtn.innerHTML = "☀️ Light";
    } else {
        themebtn.innerHTML = "🌙 Dark";
    }
}
