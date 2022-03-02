const api_key = '055d36ea33dc4a19bb9152414221001'

const conditionImage = document.getElementById('conditionImage')
const condition = document.getElementById('condition')
const origin = document.getElementById('origin')
const localDate = document.getElementById('localDate')
const localTime = document.getElementById('localTime')
const temperature = document.getElementById('temperature')
const locationInput = document.getElementById('locationInput')
const locationSearch = document.getElementById('locationSearch')
const errorText = document.getElementById('errorText')

const feelsLike = document.getElementById('feelsLike')
const windSpeed = document.getElementById('windSpeed')
const humidity = document.getElementById('humidity')
const precipitation = document.getElementById('precipitation')

const hourlyContainer = document.getElementById('hourlyContainer')
const leftButton = document.getElementById('bottomLeftButton')
const rightButton = document.getElementById('bottomRightButton')
const todayButton = document.getElementById('todayButton')
const nextDayButton = document.getElementById('nextDayButton')
const nextNextDayButton = document.getElementById('nextNextDayButton')
let hourlyContainerIndex = 0


leftButton.addEventListener('click', showPreviousHourlyContainer)
rightButton.addEventListener('click', showNextHourlyContainer)
todayButton.addEventListener('click', ChangeToToday)
nextDayButton.addEventListener('click', ChangeToNextDay)
nextNextDayButton.addEventListener('click', ChangeToNextNextDay)
locationSearch.addEventListener('click', getNewLocation)
document.addEventListener('keydown', keyEntry)

window.onload = function(){
    locationInput.value = 'Toronto'
    getNewLocation()
}

function keyEntry(event){
    if (event.keyCode == 13 && locationInput == document.activeElement){
        getNewLocation()
    }
    else if (event.keyCode == 37 && locationInput != document.activeElement){
        showPreviousHourlyContainer()
    }
    else if (event.keyCode == 39 && locationInput != document.activeElement){
        showNextHourlyContainer()
    }
    else {
        locationInput.focus()
    }
}

function getNewLocation() {
    let forecastURL = `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${locationInput.value}&days=7&aqi=no&alerts=no`
    updateWeatherAndForecast(forecastURL)
}

async function updateWeatherAndForecast(url) {
    try{ 
        const response = await fetch(url);
        const data = await response.json();
        let validForecastHours = getValidForecastHours(data)
        clearHourlyContainer()
        errorText.style.display = 'none'
        locationInput.value = ''
        updateWeather(data)
        createForecastChild(validForecastHours)
    }
    catch (err){
        errorText.style.display = 'block'
    }
}

function updateWeather(data) {
    weatherData = data.current
    locationData = data.location

    conditionImage.src = 'https:' + weatherData.condition.icon
    condition.innerHTML = weatherData.condition.text
    origin.innerHTML = locationData.name
    localDate.innerHTML = formatDate(locationData.localtime)
    localTime.innerHTML = formatTime(locationData.localtime)
    temperature.innerHTML = formatCelsius(weatherData.temp_c) 

    feelsLike.innerHTML = formatCelsius(weatherData.feelslike_c)
    windSpeed.innerHTML = formatWindSpeedKM(weatherData.wind_kph)
    humidity.innerHTML = formatHumidity(weatherData.humidity)
    precipitation.innerHTML = formatPrecipitationMM(weatherData.precip_mm)
}

function clearHourlyContainer(){
    hourlyContainerIndex = 0
    hourlyContainer.replaceChildren()
}

function ChangeToToday(){
    if (!todayButton.classList.contains('timeButton')){
        toggleTodayButton()
        getTodayHourlyContainer()
    }
}

function ChangeToNextDay(){
    if (!nextDayButton.classList.contains('timeButton')){
        toggleNextDayButton()
        getNextDayHourlyContainer()
    }
}

function ChangeToNextNextDay(){
    if (!nextNextDayButton.classList.contains('timeButton')){
        toggleNextNextDayButton()
        getNextNextDayHourlyContainer()
    }
}

function showNextHourlyContainer(){
    let maxHours = hourlyContainer.children.length
    if ((hourlyContainerIndex + 1) * 7 < maxHours){
        hideHourlyContainer()
        hourlyContainerIndex += 1
        showHourlyContainer(hourlyContainerIndex)
        getTimeButton()
    }
}

function showPreviousHourlyContainer(){
    let maxHours = hourlyContainer.children.length
    if ((hourlyContainerIndex - 1) * 7 >= 0){
        hideHourlyContainer()
        hourlyContainerIndex -= 1
        showHourlyContainer(hourlyContainerIndex)
        getTimeButton()
    }
}    

function hideHourlyContainer(){
    let maxHours = hourlyContainer.children.length
    for (let i = hourlyContainerIndex * 7; i < (hourlyContainerIndex + 1) * 7 && i < maxHours; i++){
        hourlyChild = hourlyContainer.children[i]
        for (let k = 0; k < hourlyChild.children.length; k++){
            hourlyChild.children[k].style = 'display: none'
        }
        hourlyChild.style = 'display: none'
    }
}

function showHourlyContainer(index){
    let maxHours = hourlyContainer.children.length
    hideHourlyContainerIndex = index
    for (let i = hourlyContainerIndex * 7; i < (hourlyContainerIndex + 1) * 7 && i < maxHours; i++){
        hourlyChild = hourlyContainer.children[i]
        for (let k = 0; k < hourlyChild.children.length; k++){
            hourlyChild.children[k].style = 'display: block'
        }
        hourlyChild.style = 'display: block'
    }
}

function getTodayHourlyContainer(){
    hideHourlyContainer()
    hourlyContainerIndex = 0
    showHourlyContainer(hourlyContainerIndex)
}

function getNextDayHourlyContainer(){
    hideHourlyContainer()
    hourlyContainerIndex = + Math.floor((hourlyContainer.children.length - 48) / 7)
    showHourlyContainer(hourlyContainerIndex)
}

function getNextNextDayHourlyContainer(){
    hideHourlyContainer()
    hourlyContainerIndex = + Math.floor((hourlyContainer.children.length - 24) / 7)
    showHourlyContainer(hourlyContainerIndex)
}

function getTimeButton(){
    nextDayIndex = + Math.floor((hourlyContainer.children.length - 48) / 7)
    nextNextDayIndex = + Math.floor((hourlyContainer.children.length - 24) / 7)

    if (hourlyContainerIndex >= nextNextDayIndex){
        toggleNextNextDayButton()
    }
    else if (hourlyContainerIndex >= nextDayIndex){
        toggleNextDayButton()
    }
    else{
        toggleTodayButton()
    }
}

function createForecastChild(forecastHours) {
    for (let i = 0; i < forecastHours.length; i++){
        let hourlyChild = document.createElement('div');
        let hourlyChildTime = document.createElement('div')
        let hourlyChildConditionImage = document.createElement('img')
        let hourlyChildTemp = document.createElement('div')
        let hourlyChildPrecip = document.createElement('div')

        hourlyChildTime.innerHTML = getTime(new Date(forecastHours[i].time))
        hourlyChildConditionImage.src = 'https:' + forecastHours[i].condition.icon
        hourlyChildTemp.innerHTML = formatCelsius(forecastHours[i].temp_c)
        hourlyChildPrecip.innerHTML = formatPrecipitationMM(forecastHours[i].precip_mm)

        if (i >= 7){
            hourlyChildTime.style = 'display: none'
            hourlyChildConditionImage.style = 'display:none'
            hourlyChildTemp.style = 'display: none'
            hourlyChildPrecip.style = 'display: none'
            hourlyChild.style = 'display:none'
        }

        else{
            hourlyChildTime.style = 'display: block'
            hourlyChildConditionImage.style = 'display: block'
            hourlyChildTemp.style = 'display: block'
            hourlyChildPrecip.style = 'display: block'
            hourlyChild.style = 'display: block'
        }

        getTimeButton()
        hourlyChild.classList = 'hourlyChild'
        hourlyChild.appendChild(hourlyChildTime)
        hourlyChild.appendChild(hourlyChildConditionImage)
        hourlyChild.appendChild(hourlyChildTemp)
        hourlyChild.appendChild(hourlyChildPrecip)
        hourlyContainer.appendChild(hourlyChild)
    }

}

function getValidForecastHours(data){
    let currentHour = (new Date(data.location.localtime)).getHours()
    let validHours = []

    for (let hour = currentHour + 1; hour < 24; hour++ ){
        validHours.push(data.forecast.forecastday[0].hour[hour])
    }

    for (let hour = 0; hour < 24; hour++){
        validHours.push(data.forecast.forecastday[1].hour[hour])
    }

    for (let hour = 0; hour < 24; hour++){
        validHours.push(data.forecast.forecastday[2].hour[hour])
    }

    todayButton.innerHTML = 'Today'
    nextDayButton.innerHTML = getDay(new Date(data.forecast.forecastday[1].hour[0].time))
    nextNextDayButton.innerHTML = getDay(new Date(data.forecast.forecastday[2].hour[0].time))

    return validHours
}



function toggleTodayButton(){
    todayButton.classList = 'timeButton'
    nextDayButton.classList = 'timeButtonHide'
    nextNextDayButton.classList = 'timeButtonHide'
}

function toggleNextDayButton(){
    nextDayButton.classList = 'timeButton'
    todayButton.classList = 'timeButtonHide'
    nextNextDayButton.classList = 'timeButtonHide'
}

function toggleNextNextDayButton(){
    nextNextDayButton.classList = 'timeButton'
    nextDayButton.classList = 'timeButtonHide'
    todayButton.classList = 'timeButtonHide'
}


function formatDate(string){
    let date = new Date(string)
    let weekday = getDay(date)
    let month = getMonth(date)
    let day = date.getDate()
    let year = date.getFullYear()

    return weekday + ', ' + month + ' ' + day + ' ' + year
}

function formatTime(string) {
    let formattedTime = getTime(new Date(string))
    return formattedTime
}

function getDay(date) {
    return date.toLocaleString('en-us', {  weekday: 'long' })
}

function getMonth(date) {
    return date.toLocaleString('en-us', {  month: 'long' })
}

function getTime(date) {
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
}

function formatCelsius(degrees){
    return degrees + '&#176; C'
}

function formatWindSpeedKM(speed){
    return speed + ' km/h'
}

function formatHumidity(humidity){
    return humidity + ' %'
}

function formatPrecipitationMM(precipitation){
    return precipitation + ' mm'
}
