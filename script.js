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

class App {
  _map
  __mapEvent
  constructor () {
    this._getPosition()

    form?.addEventListener('submit', this._newWorkout.bind(this))
    inputType?.addEventListener('change', this._toggleField)
  }

  // TODO Show currently position
  _getPosition() {
    if(navigator.geolocation) {}
    navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),
      () => {
        alert(`You have not granted access to your location`)
      }
    )
  }
  // TODO Loading map
  _loadMap(position) {
    const {latitude} = position.coords
    const {longitude} = position.coords
    const coords = [latitude, longitude]
    console.log(this)
    this._map = L.map('map').setView(coords, 13)
    console.log(this._map)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
      .addTo(this._map)

    this._map.on('click', this._showForm.bind(this))
  }

  // TODO Show currently form
  _showForm(mapE) {
    this._mapEvent = mapE
    form?.classList.remove('hidden')
    inputDistance?.focus()

  }
  // TODO Change field the form
  _toggleField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
  }

  // TODO showing the distance and duration
  _newWorkout(e) {
    e.preventDefault()
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ''
    console.log(this._mapEvent)
    const {lat, lng} = this._mapEvent.latlng
    L.marker([lat, lng]).addTo(this._map)
    L.marker([lat, lng])
      .addTo(this._map)
      .bindPopup
      (L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: 'mark-popup'
      }))
      .setPopupContent('Training')
      .openPopup()
  }
}

const app = new App()
app._getPosition

