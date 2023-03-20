const time = document.querySelector('.time'),
    date = document.querySelector('.date'),
    greeting = document.querySelector('.greeting'),
    user = document.querySelector('.name'),
    url = "https://api.quotable.io/random";

//-------Show time date--------

function showTime() {
    let timeDay = new Date(),
        hour = timeDay.getHours(),
        min = timeDay.getMinutes(),
        sec = timeDay.getSeconds();

    //-------Time output-----------
    
    time.innerHTML = `${zero(hour)}:${zero(min)}:${zero(sec)}`;

    setTimeout(showTime, 1000)
}

//-------Show Date--------

function showDate() {
    let dayToday = new Date(),
        day = dayToday.getDate(),
        month = dayToday.getMonth(),
        year = dayToday.getFullYear();

    date.innerHTML = `${zero(day)}.${zero(month + 1)}.${year}`;

    setTimeout(showDate, 1000)
}

//-----Add Zero------

function zero(z) {
    return (parseInt(z, 10) < 10 ? '0' : '') + z;
}

//--------Change BGreet----------

function changeBGreet() {
    let timeDay = new Date(),
        hour = timeDay.getHours();

    if (hour < 12) {
        document.body.style.backgroundImage = "url('../assets/img/bg_utro.jpg')";
        greeting.innerHTML = "Доброе утро";
    } else if (hour < 18) {
        document.body.style.backgroundImage = "url('../assets/img/bg_day.jpg')";
        greeting.innerHTML = "Добрый день";
    }
    else if (hour <= 23) {
        document.body.style.backgroundImage = "url('../assets/img/bg_vecher.jpg')";
        greeting.innerHTML = "Добрый вечер";
    } else {
        document.body.style.backgroundImage = "url('../assets/img/bg_noch.jpg')";
        greeting.textContent = "Доброй ночи";
    }
}

//--------Name----------

function getName() {
    if (localStorage.getItem("name") === null) {
        user.textContent = "Введите имя";
    } else {
        user.textContent = localStorage.getItem('name')
    }
}

//--------Set Name----------

function setName(e) {
    if (e.type === "keypress") {
        if (e.which == 13 || e.keyCode == 13) {
            localStorage.setItem('name', e.target.innerText)
            user.blur()
        }
    } else {
        localStorage.setItem('name', e.target.innerText)
    }
}

user.addEventListener("keypress", setName)
user.addEventListener("blur", setName)

//--------Quotes----------

let quote = document.querySelector(".quote");
let author = document.querySelector(".author");
let btn = document.querySelector(".change-quote");

let getQuote = () => {
    fetch(url)
        .then((data) => data.json())
        .then((item) => {
            quote.innerText = item.content;
            author.innerText = item.author;
        });
};

window.addEventListener("load", getQuote);
btn.addEventListener("click", getQuote);

//--------Weather----------

const cityInput = document.querySelector('.city');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');

cityInput.value = 'Брест';

async function getWeather() {  
    getCity();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&lang=ru&appid=5ce195254a355c2e01eee9bc40d88c88&units=metric`;
    const res = await fetch(url);
    const data = await res.json(); 
    
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp}°C`;
    weatherDescription.textContent = data.weather[0].description;
  }

const getCity = () => {
    if (localStorage.getItem('city')) {
        cityInput.value = localStorage.getItem('city');
    }
}

const setCity = () => {
    localStorage.setItem('city', cityInput.value);
    getWeather();
}
window.addEventListener('blur', setCity);

//--------Player----------

const playList = [
    {
        title: 'Aqua Caelestis',
        src: './assets/sounds/Aqua Caelestis.mp3',
    },
    {
        title: 'River Flows In You',
        src: './assets/sounds/River Flows In You.mp3',
    },
    {
        title: 'Summer Wind',
        src: './assets/sounds/Summer Wind.mp3',
    },
    {
        title: 'Ennio Morricone',
        src: './assets/sounds/Ennio Morricone.mp3',
    },
]

const audio = new Audio();

const playBtn = document.querySelector('.play');
const playNextBtn = document.querySelector('.play-next');
const playPrevBtn = document.querySelector('.play-prev');

let isPlay = false;
let playNum = 0;
let previousClick;

const playlistSongs = document.querySelector('.play-list');
playList.forEach(el => {
    const liPlayItem = document.createElement('li');
    liPlayItem.classList.add('play-item')
    liPlayItem.textContent = el.title;
    playlistSongs.append(liPlayItem);
});

const songsList = document.querySelectorAll('.play-item');
const playAudio = () => {
    if (!isPlay) {
        togglePlayButton();
        audio.src = playList[playNum].src;
        audio.play();
        songsList.forEach(el => {
            el.classList.remove('play-item-active');
            el.classList.remove('playing-item');
        })
        songsList[playNum].classList.add('play-item-active');
        songsList[playNum].classList.add('playing-item');
        previousClick = document.querySelector('.playing-item');
        isPlay = true;
    } else {
        togglePlayButton();
        songsList[playNum].classList.remove('playing-item');
        previousClick = document.querySelector('.playing-item');
        isPlay = false;
        audio.pause();
    }
}

const playlist = document.querySelector('.play-list');
playlist.addEventListener('click', e => {
    const element = e.target;
    for (const el in songsList) {
        if (element.innerHTML === songsList[el].innerHTML) {
            playNum = parseInt(el);
            break;
        }
    }
    if (previousClick === element) {
        isPlay = true;
        playAudio();
    } else {
        isPlay = false;
        playAudio();
    }
})


const togglePlayButton = () => {
    isPlay === false ? playBtn.classList.add('pause') : playBtn.classList.remove('pause')
}

const playNext = () => {
    playNum === Object.keys(playList).length - 1 ? playNum = 0 : playNum += 1;
    isPlay = false;
    playAudio();
}

const playPrev = () => {
    playNum === 0 ? playNum = Object.keys(playList).length - 1 : playNum -= 1;
    isPlay = false;
    playAudio();
}

audio.addEventListener('ended', () => playNext());

playBtn.addEventListener('click', playAudio);
playNextBtn.addEventListener('click', playNext);
playPrevBtn.addEventListener('click', playPrev);

//--------Slider----------

const base = '../assets/img/';
const images = ['bg_utro.jpg', 'bg_day.jpg', 'bg_vecher.jpg', 'bg_noch.jpg'];
let i = 0;
const body = document.querySelector('body');
const slide_prev = document.querySelector('.slide-prev');
const slide_next = document.querySelector('.slide-next');


function viewBgImage(src) {
    const img = new Image();
    img.src = src;
    img.onload = () => {
        body.style.backgroundImage = `url(${src})`;
    };
}

function prevImage() {
    const index = i % images.length;
    const imageSrc = base + images[index];
    viewBgImage(imageSrc);
    i--;
    slide_prev.disabled = true;
    setTimeout(function () { slide_prev.disabled = false }, 1000);
}
slide_prev.addEventListener('click', prevImage);

function nextImage() {
    const index = i % images.length;
    const imageSrc = base + images[index];
    viewBgImage(imageSrc);
    i++;
    slide_next.disabled = true;
    setTimeout(function () { slide_next.disabled = false }, 1000);
}
slide_next.addEventListener('click', nextImage);

//-----Function Run--------

showTime();
showDate();
changeBGreet();
getName();
getWeather();