const apiKey =
  'live_v2pJRY5HWXmWporHHf5vtquRgIKlG3EPF3B8iNpsZznh3vba2II0IsSsfYXghYj5';
let data,
  chart,
  minName,
  maxName,
  min = 0,
  max = 0,
  avg = 0,
  teller = 0,
  avgDog = 0;
let backgroundColor = document.documentElement.style.getPropertyValue(
  '--global-background-color'
);
let mainColorLight = document.documentElement.style.getPropertyValue(
  '--global-main-color-light'
);
let mainColor = document.documentElement.style.getPropertyValue(
  '--global-main-color'
);
let mainColorDark = document.documentElement.style.getPropertyValue(
  '--global-main-color-dark'
);
const ListenToButtons = function () {
  document.querySelector('.js-prev').addEventListener('click', function () {
    console.log('prev');
    teller--;
    if (teller < 0) {
      teller = data.length - 1;
    }
    changeDog();
  });
  document.querySelector('.js-next').addEventListener('click', function () {
    console.log('next');
    teller++;
    if (teller > data.length - 1) {
      teller = 0;
    }
    changeDog();
  });
  document.querySelector('.js-random').addEventListener('click', function () {
    displayLoading();
    console.log('random');
    teller = Math.floor(Math.random() * data.length);
  });
  document.querySelector('.js-darkmode').addEventListener('click', function () {
    console.log('darkmode');
    if (document.querySelector('.js-darkmodetoggle').checked) {
      document.documentElement.style.setProperty(
        '--global-background-color',
        '#1f1d1f'
      );
      document.documentElement.style.setProperty(
        '--global-main-color-light',
        'hsl(47, 7%, 58%)'
      );
      document.documentElement.style.setProperty(
        '--global-main-color',
        'hsl(44, 46%, 85%)'
      );
      document.documentElement.style.setProperty(
        '--global-main-color-dark',
        'hsl(48, 50%, 64%)'
      );
      document.documentElement.style.setProperty(
        '--global-main-color-light-opacity',
        '#9B988C9D'
      );
    } else {
      document.documentElement.style.removeProperty(
        '--global-background-color'
      );
      document.documentElement.style.removeProperty(
        '--global-main-color-light'
      );
      document.documentElement.style.removeProperty('--global-main-color');
      document.documentElement.style.removeProperty('--global-main-color-dark');
      document.documentElement.style.removeProperty(
        '--global-main-color-light-opacity'
      );
    }
    chart.destroy();
    chart = null;
    createChart(avgDog);
  });
};
function displayLoading() {
  document.querySelector('.c-icon').classList.add('loading');
  // to stop loading after some time
  setTimeout(() => {
    document.querySelector('.c-icon').classList.remove('loading');
    changeDog();
  }, 500);
}
const getApi = async function () {
  const url = 'https://api.thedogapi.com/v1/breeds';
  data = await getData(url);
  console.log(data);
  for (let dog of data) {
    let avgDog;
    let array = dog.life_span.split(' ');
    if (array.length == 2) {
      avgDog = parseInt(array[0]);
    } else {
      avgDog = (parseInt(array[0]) + parseInt(array[2])) / 2;
    }
    if (avgDog > max) {
      max = avgDog;
      maxName = dog.name;
    }
    if (avgDog < min || min == 0) {
      min = avgDog;
      minName = dog.name;
    }
    avg += avgDog;
    // console.log(avgDog);
  }
  avg = avg / data.length;
  console.log('min', min, 'max', max, 'avg', avg);
  changeDog();
  ListenToButtons();
};
const changeDog = function () {
  console.log(data[teller]);
  document.querySelector('.js-image').src = data[teller].image.url;
  document.querySelector('.js-image').alt = data[teller].name;
  document.querySelector('.js-name').innerHTML = data[teller].name;
  let temperament = 'Characteristics  unknown';
  if (data[teller].temperament) {
    temperament = data[teller].temperament;
  }
  document.querySelector('.js-temperament').innerHTML = temperament;
  let origin = 'Country unknown';
  if (data[teller].origin) {
    origin = data[teller].origin;
  } else if (data[teller].history) {
    origin = data[teller].history;
  }
  document.querySelector('.js-origin').innerHTML = origin;
  let bredFor = 'Purpose unknown';
  if (data[teller].bred_for) {
    bredFor = data[teller].bred_for;
  }
  document.querySelector('.js-bredFor').innerHTML = bredFor;
  if (data[teller].life_span.split(' ').length == 2) {
    avgDog = parseInt(data[teller].life_span.split(' ')[0]);
  } else {
    avgDog =
      (parseInt(data[teller].life_span.split(' ')[0]) +
        parseInt(data[teller].life_span.split(' ')[2])) /
      2;
  }
  createChart(avgDog);
};
const createChart = function (dogLifeSpan) {
  dogLifeSpan = Math.round(dogLifeSpan, 2);
  // console.log(data[teller].name.length, 'length');
  let name = data[teller].name;
  //if name has a space, it will be cut off
  if (name.includes(' ')) {
    name =
      data[teller].name.substring(0, data[teller].name.indexOf(' ')) + '...';
  }
  const datasets = [dogLifeSpan, max, avg, min];
  const labels = [
    `${name}`,
    'Max from all dogs',
    'Average from all dogs',
    'Min from all dogs',
  ];
  // const labels = ['Maximum', 'Average', 'Minimum', `Dog lifespan`];
  const canvas = document.querySelector('.js-chart');

  if (!chart) {
    chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Years',
            data: datasets,
            backgroundColor: [
              getComputedStyle(document.documentElement).getPropertyValue(
                '--global-accent-color'
              ),
            ],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            font: {
              size: 16, //this change the font size
            },
            text: "Dog's lifespan in comparison with other dogs",
            color: getComputedStyle(document.documentElement).getPropertyValue(
              '--global-main-color-dark'
            ),
          },
        },
        aspectRatio: 16 / 9,
        maintainAspectRatio: true,
        scales: {
          y: {
            grid: {
              color: getComputedStyle(
                document.documentElement
              ).getPropertyValue('--global-main-color-light'),
            },
            ticks: {
              font: {
                size: 12, //this change the font size
              },
              color: getComputedStyle(
                document.documentElement
              ).getPropertyValue('--global-main-color'),
            },
            beginAtZero: true,
            suggestedMax: max + 2,
          },
          x: {
            grid: {
              color: getComputedStyle(
                document.documentElement
              ).getPropertyValue('--global-main-color-light'),
            },
            ticks: {
              font: {
                size: 12, //this change the font size
              },
              color: getComputedStyle(
                document.documentElement
              ).getPropertyValue('--global-main-color'),
            },
          },
        },
      },
    });
  } else {
    chart.data.labels = labels;
    chart.data.datasets[0].data = datasets;
    chart.update();
  }
};
const resize = function () {
  chart.destroy();
  chart = null;
  createChart(avgDog);
};
const init = function () {
  getApi();
};
const getData = function (url) {
  return fetch(url, {
    headers: {
      'x-api-key': apiKey,
    },
  })
    .then((response) => response.json())
    .catch((error) => console.log('Error while fetching:', error));
};
document.addEventListener('DOMContentLoaded', init);
