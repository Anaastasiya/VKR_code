// Функция для выполнения кода скрипта
function runScript() {
  // Функция для получения списка уникальных значений из массива
  function getUniqueValues(array) {
    let uniqueValues = [];
    for (let value of array) {
      if (!uniqueValues.includes(value)) {
        uniqueValues.push(value);
      }
    }
    return uniqueValues;
  }

  // Функция для фильтрации массива по заданному значению
  function filterByValue(array, value) {
    let filteredArray = [];
    for (let item of array) {
      if (item === value) {
        filteredArray.push(item);
      }
    }
    return filteredArray;
  }

  // Функция для создания элемента option для datalist
  function createOption(value) {
    let option = document.createElement("option");
    option.value = value;
    return option;
  }

  // Функция для очистки содержимого datalist
  function clearDatalist(datalist) {
    while (datalist.firstChild) {
      datalist.removeChild(datalist.firstChild);
    }
  }

  // Функция для заполнения datalist данными из массива
  function fillDatalist(datalist, array) {
    for (let value of array) {
      let option = createOption(value);
      datalist.appendChild(option);
    }
  }

  // Функция для обновления datalist в зависимости от введенного значения
  function updateDatalist(input, datalist, array) {
    // Получить введенное значение
    let inputValue = input.value;

    // Очистить datalist
    clearDatalist(datalist);

    // Если введенное значение не пустое
    if (inputValue) {
      // Получить подсказки, которые начинаются с введенного значения
      let suggestions = array.filter(item => item.startsWith(inputValue));

      // Заполнить datalist подсказками
      fillDatalist(datalist, suggestions);
    }
  }

  // Получить элементы формы
  let countryInput1 = document.getElementById("country-input-1");
  let regionInput1 = document.getElementById("region-input-1");
  let cityInput1 = document.getElementById("city-input-1");
  let countryInput2 = document.getElementById("country-input-2");
  let regionInput2 = document.getElementById("region-input-2");
  let cityInput2 = document.getElementById("city-input-2");

  let countryList1 = document.getElementById("country-list-1");
  let regionList1 = document.getElementById("region-list-1");
  let cityList1 = document.getElementById("city-list-1");
  let countryList2 = document.getElementById("country-list-2");
  let regionList2 = document.getElementById("region-list-2");
  let cityList2 = document.getElementById("city-list-2");
  var showRouteButton = document.getElementById("showRouteButton");

  // Создаем переменные для хранения координат городов
  var from_lat;
  var from_lon;
  var to_lat;
  var to_lon;

  // Получить данные о станциях из шаблона
  let stationsData = JSON.parse(document.getElementById("stations-data").textContent);

  // Получить массивы стран, регионов и городов из данных о станциях
  let countries = getUniqueValues(stationsData.countries.map(country => country.title));
  let regions = getUniqueValues(stationsData.countries.flatMap(country => country.regions.map(region => region.title)));
  let cities = getUniqueValues(stationsData.countries.flatMap(country => country.regions.flatMap(region => region.settlements.map(city => city.title))));

  // Добавить обработчики событий ввода значения input

  // При вводе значения в первый input страны
  countryInput1.addEventListener("input", function () {
    // Обновить datalist стран
    updateDatalist(this, countryList1, countries);

    // Очистить input и datalist регионов и городов
    regionInput1.value = "";
    clearDatalist(regionList1);
    cityInput1.value = "";
    clearDatalist(cityList1);
  });

  // При вводе значения в первый input региона
  regionInput1.addEventListener("input", function () {
    // Получить выбранную страну
    let selectedCountry = countryInput1.value;

    // Если выбрана страна
    if (selectedCountry) {
      // Получить регионы, принадлежащие выбранной стране
      let countryRegions = stationsData.countries.find(country => country.title === selectedCountry).regions;

      // Получить массив названий регионов
      let regionNames = countryRegions.map(region => region.title);

      // Обновить datalist регионов
      updateDatalist(this, regionList1, regionNames);
    }

    // Очистить input и datalist городов
    cityInput1.value = "";
    clearDatalist(cityList1);
  });

  // При вводе значения в первый input города
  cityInput1.addEventListener("input", function () {
    // Получить выбранный регион
    let selectedRegion = regionInput1.value;

    // Если выбран регион
    if (selectedRegion) {
      // Получить города, принадлежащие выбранному региону
      let regionCities = stationsData.countries.flatMap(country => country.regions).find(region => region.title === selectedRegion).settlements;

      // Получить массив названий городов
      let cityNames = regionCities.map(city => city.title);

      // Обновить datalist городов
      updateDatalist(this, cityList1, cityNames);
    }
  });

  // При вводе значения во второй input страны
  countryInput2.addEventListener("input", function () {
    // Обновить datalist стран
    updateDatalist(this, countryList2, countries);

    // Очистить input и datalist регионов и городов
    regionInput2.value = "";
    clearDatalist(regionList2);
    cityInput2.value = "";
    clearDatalist(cityList2);
  });

  // При вводе значения во второй input региона
  regionInput2.addEventListener("input", function () {

    // Получить выбранную страну
    let selectedCountry = countryInput2.value;

    // Если выбрана страна
    if (selectedCountry) {
      // Получить регионы, принадлежащие выбранной стране
      let countryRegions = stationsData.countries.find(country => country.title === selectedCountry).regions;

      // Получить массив названий регионов
      let regionNames = countryRegions.map(region => region.title);

      // Обновить datalist регионов
      updateDatalist(this, regionList2, regionNames);
    }

    // Очистить input и datalist городов
    cityInput2.value = "";
    clearDatalist(cityList2);
  });

  // При вводе значения во второй input города
  cityInput2.addEventListener("input", function () {
    // Получить выбранный регион
    let selectedRegion = regionInput2.value;

    // Если выбран регион
    if (selectedRegion) {
      // Получить города, принадлежащие выбранному региону
      let regionCities = stationsData.countries.flatMap(country => country.regions).find(region => region.title === selectedRegion).settlements;

      // Получить массив названий городов
      let cityNames = regionCities.map(city => city.title);

      // Обновить datalist городов
      updateDatalist(this, cityList2, cityNames);
    }
  });

  // Создаем функцию для получения координат по названию города
  function getCoordinates(city, selectedRegion) {
    // Получаем данные о станциях из скрытого div
    // var stations = JSON.parse(document.getElementById("stations-data").textContent);

    // Получить станции принадлежащие данному городу
    stations = stationsData.countries.flatMap(country => country.regions).find(region => region.title === selectedRegion).settlements.find(settlement => settlement.title === city).stations;

    // stations = stations["countries"][0]["regions"][0]["settlements"];
    // Проходим по каждой станции и ищем заполненные широту и долготу
    for (var i = 0; i < stations.length; i++) {
      if (stations[i]["latitude"] != "") {
        // Возвращаем координаты станции в виде массива, обернутые в промис
        return Promise.resolve([stations[i]["latitude"], stations[i]["longitude"]]);
      }
    }
    // Если не нашли совпадение, возвращаем null, обернутый в промис
    return Promise.resolve(null);
  }
  // Добавляем обработчик события на клик по кнопке
  showRouteButton.addEventListener("click", function () {
    // Получаем значение инпута
    var city1 = cityInput1.value;
    var city2 = cityInput2.value;
    // Получаем координаты по названию города
    getCoordinates(city1, regionInput1.value).then(function (coords) {
      // Если координаты найдены, сохраняем их в переменные
      if (coords) {
        from_lat = coords[0];
        from_lon = coords[1];
      }
    });

    getCoordinates(city2, regionInput2.value).then(function (coords) {
      // Если координаты найдены, сохраняем их в переменные
      if (coords) {
        to_lat = coords[0];
        to_lon = coords[1];
      }
    });


    // Проверяем, что оба города заданы и вызываем функцию showRoute()
    checkAndShowRoute();
  });
  // Создаем функцию для проверки, что оба города заданы и вызова функции showRoute()
  function checkAndShowRoute() {
    if (from_lat && from_lon && to_lat && to_lon) {
      showRoute(from_lat, from_lon, to_lat, to_lon);
    }
  }
  // Создаем функцию для получения и отображения маршрута
  function showRoute(from_lat, from_lon, to_lat, to_lon) {
    // Создаем элемент для карты
    ymaps.ready(function () {
      var map = new ymaps.Map("map", {
        center: [55.75, 37.62],
        zoom: 10
      });

      // Добавляем элементы управления на карту
      map.controls.add("zoomControl");
      map.controls.add("typeSelector");

      // Формируем URL для запроса к HTTP Геокодеру по координатам
      var url1 = "https://geocode-maps.yandex.ru/1.x/?apikey=9431bf30-a1d4-4319-88e3-b17a8ad8830b&format=json&geocode=" + from_lon + "," + from_lat;
      var url2 = "https://geocode-maps.yandex.ru/1.x/?apikey=9431bf30-a1d4-4319-88e3-b17a8ad8830b&format=json&geocode=" + to_lon + "," + to_lat;

      // Делаем запросы с помощью fetch и обрабатываем ответы
      Promise.all([fetch(url1), fetch(url2)])
        .then(function (responses) {
          return Promise.all(responses.map(function (response) {
            return response.json();
          }));
        })
        .then(function (data) {
          // Извлекаем названия городов из ответов
          var city1 = data[0]["response"]["GeoObjectCollection"]["featureMember"][0]["GeoObject"]["metaDataProperty"]["GeocoderMetaData"]["text"];
          var city2 = data[1]["response"]["GeoObjectCollection"]["featureMember"][0]["GeoObject"]["metaDataProperty"]["GeocoderMetaData"]["text"];
          // Создаем маршрут по названиям городов с помощью библиотеки JavaScript API
          ymaps.route([city1, city2], { mapStateAutoApply: true })
            .then(function (route) {
              // Добавляем маршрут на карту
              map.geoObjects.add(route);
              // Добавляем метки с названиями городов на карту
              route.getWayPoints().each(function (wayPoint) {
                wayPoint.options.set("preset", "islands#redStretchyIcon");
              });
            })
            .catch(function (error) {
              // Выводим ошибку в консоль
              console.log(error);
            });
        })
        .catch(function (error) {
          // Выводим ошибку в консоль
          console.log(error);
        });
    });
  }

  // Вызываем функцию для отображения маршрута по заданным координатам
  //showRoute(55.75, 37.62, 59.95, 30.32);

}




// Добавить функцию в качестве обработчика события DOMContentLoaded
document.addEventListener("DOMContentLoaded", runScript);