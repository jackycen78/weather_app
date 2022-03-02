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

export {
    formatDate, formatTime, getDay, getMonth, getTime, formatCelsius, formatWindSpeedKM, formatHumidity, formatPrecipitationMM
}