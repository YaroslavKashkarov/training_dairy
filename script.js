'use strict'

const form = document.querySelector('.form')
const containerWorkouts = document.querySelector('.workouts')
const inputType = document.querySelector('.form__input--type')
const inputDistance = document.querySelector('.form__input--distance')
const inputDuration = document.querySelector('.form__input--duration')
const inputCadence = document.querySelector('.form__input--cadence')
const inputElevation = document.querySelector('.form__input--elevation')

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor (coords, distance, duration) {
    this.coords = coords
    this.distance = distance
    this.duration = duration
  }
  _setDescription() {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} ${months[this.date.getMonth()]} ${this.date.getDate()}`
  }
}

class Running extends Workout {
  type = 'running';
  constructor (coords, distance, duration, cadence) {
    super(coords, distance, duration)
    this.cadence = cadence
    this.calcPace()
    this._setDescription()
  }
  calcPace() {
    this.pace = this.duration / this.distance
    return this.pace
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor (coords, distance, duration, elevation) {
    super(coords, distance, duration)
    this.elevation = elevation
    this.calcSpeed()
    this._setDescription()
  }
  calcSpeed() {
    this.speed = this.distance / this.duration / 60
    return this.speed
  }
}

class App {
  _workouts = [];
  _map
  __mapEvent
  constructor () {
    this._getPosition()

    form?.addEventListener('submit', this._newWorkout.bind(this))
    inputType?.addEventListener('change', this._toggleField)
  }

  // TODO Show currently position
  _getPosition() {
    if(navigator.geolocation) {
    }
    navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
      alert(`You have not granted access to your location`)
    })
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
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this._map)

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

    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp))
    const allPositive = (...inputs) => inputs.every((inp) => inp > 0)
    //  * Get field to form
    const type = inputType.value
    const distance = +inputDistance.value
    const duration = +inputDuration.value
    const {lat, lng} = this._mapEvent.latlng
    let workout

    if(type === 'running') {
      const cadence = +inputCadence.value
      if(
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      ) {
        return alert('You must enter a positive integer')
      }
      workout = new Running([lat, lng], distance, duration, cadence)
    }

    if(type === 'cycling') {
      const elevation = +inputElevation.value
      if(
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      ) {
        return alert('You must enter a positive integer')
      }
      workout = new Cycling([lat, lng], distance, duration, elevation)
    }

    this._workouts.push(workout)
    console.log(this._workouts)

    //  * If it’s a run, create a run object
    //  * If it’s a bicycle, create a ‘bicycle’ object
    //  * Add an item to the workout array
    //  * Render of the training marker on the map
    this._renderWorkMarker(workout)
    this._renderWorkout(workout)
    this._hideForm()
  }
  _renderWorkMarker(workout) {
    L.marker(workout.coords)
      .addTo(this._map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'mark-popup',
        }),
      )
      .setPopupContent(`${workout.type === 'running' ? '🏃' : '🚴‍♀️'}${workout.description}`)
      .openPopup()
  }

  //  * Clear the fields of water and hide the form
  _hideForm() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
      ''
    form?.classList.add('hidden')
  }
  //  * Rendering the list of training sessions
  _renderWorkout(workout) {
    let html = `
          <li class="workout workout--${workout.type}" data-id=${workout.id}>
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${workout.type === 'running' ? '🏃' : '🚴‍♀️'}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">км</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>`
    if(workout.type === 'running') {
      html += `
            <div class="workout__details">
              <span class="workout__icon">⚡️</span>
              <span class="workout__value">${workout.pace.toFixed(1)}</span>
              <span class="workout__unit">min/км</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">🦶🏼</span>
              <span class="workout__value">${workout.cadence}</span>
              <span class="workout__unit">step</span>
            </div>
          </li>
            `
    }

    if(workout.type === 'cyccling') {
      html += `
      <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevetion}</span>
            <span class="workout__unit">м</span>
          </div>
        </li>
      `
    }
    form?.insertAdjacentHTML('afterend', html)
  }
}

// *Running App
const app = new App()
app._getPosition
