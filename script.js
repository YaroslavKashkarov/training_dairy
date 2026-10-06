"use strict"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const form = document.querySelector(".form")
const containerWorkouts = document.querySelector(".workouts")
const inputType = document.querySelector(".form__input--type")
const inputDistance = document.querySelector(".form__input--distance")
const inputDuration = document.querySelector(".form__input--duration")
const inputCadence = document.querySelector(".form__input--cadence")
const inputElevation = document.querySelector(".form__input--elevation")

let map
let mapEvent

if(navigator.geolocation) {}

navigator.geolocation.getCurrentPosition(
  function (position) {
    const {latitude} = position.coords
    const {longitude} = position.coords
    const coords = [latitude, longitude]

    map = L.map('map').setView(coords, 13)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)


    map.on('click', (mapE) => {
      mapEvent = mapE
      form?.classList.remove('hidden')
      inputDistance.focus()
    }),
      function () {
        alert(`You have not granted access to your location`)
      }

    form?.addEventListener('submit', (e) => {
      e.preventDefault()
      inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ''
      console.log(mapEvent)
      const {lat, lng} = mapEvent.latlng
      L.marker([lat, lng]).addTo(map)
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup
        (L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'mark-popup'
        })).setPopupContent('Training')
        .openPopup()
    })
  })

inputType?.addEventListener('change', () => {
  inputCadence?.closest('.form__row').classList.toggle('form__row--hidden')
  inputElevation?.closest('.form__row').classList.toggle('form__row--hidden')
})