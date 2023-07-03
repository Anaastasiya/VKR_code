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
  // Получить данные о станциях из шаблона
  let stationsData = JSON.parse(document.getElementById("stations-data").textContent);
  // Получить массивы стран, регионов и городов из данных о станциях
  let countries = getUniqueValues(stationsData.countries.map(country => country.title));
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
// Получаем ссылку на fieldset
var fieldset = document.querySelector("fieldset:last-of-type");

// Назначаем обработчик события input на fieldset
fieldset.addEventListener("input", function(event) {
  // Получаем ссылку на измененный input
  var input = event.target;
  // Получаем id и name измененного input
  var id = input.id;
  var name = input.name;
  // Получаем номер группы полей (1, 2, 3 и т.д.)
  var number = id.split("-")[2];
  // Получаем datalist, связанный с измененным input
  var datalist = document.getElementById(input.list.id);
  // Определяем, какое поле было изменено
  if (name.startsWith("country")) {
    // Обновить datalist стран
    updateDatalist(input, datalist, countries);

    // Очистить input региона и города для текущей группы полей
    var regionInput = document.getElementById("region-input-" + number);
    regionInput.value = "";
    var cityInput = document.getElementById("city-input-" + number);
    cityInput.value = "";
    
    // Очистить datalist регионов и городов
    clearDatalist(document.getElementById("region-list"));
    clearDatalist(document.getElementById("city-list"));
  } else if (name.startsWith("region")) {
    // Получить выбранную страну
    let selectedCountry = document.getElementById("country-input-" + number).value;

    // Если выбрана страна
    if (selectedCountry) {
      // Получить регионы, принадлежащие выбранной стране
      let countryRegions = stationsData.countries.find(country => country.title === selectedCountry).regions;

      // Получить массив названий регионов
      let regionNames = countryRegions.map(region => region.title);

      // Обновить datalist регионов
      updateDatalist(input, datalist, regionNames);
    }

    // Очистить input города для текущей группы полей
    var cityInput = document.getElementById("city-input-" + number);
    cityInput.value = "";
    
    clearDatalist(document.getElementById("city-list"));
  } else if (name.startsWith("city")) {
    // Получить выбранный регион
    let selectedRegion = document.getElementById("region-input-" + number).value;

    // Если выбран регион
    if (selectedRegion) {
      // Получить города, принадлежащие выбранному региону
      let regionCities = stationsData.countries.flatMap(country => country.regions).find(region => region.title === selectedRegion).settlements;

      // Получить массив названий городов
      let cityNames = regionCities.map(city => city.title);

      // Обновить datalist городов
      updateDatalist(input, datalist, cityNames);
    }
  }
});

  // Функция для сохранения пар регионов-городов в localstorage
function saveRegionsCities() {
  // Создаем пустой массив для хранения пар
  let regionsCities = [];
  // Получаем все элементы input с атрибутом name, начинающимся с "region-" или "city-"
  let inputs = document.querySelectorAll("input[name^='region-'], input[name^='city-']");
  // Проходим по всем элементам input и добавляем их значения в массив в виде объектов {region: ..., city: ...}
  for (let i = 0; i < inputs.length; i += 2) {
    // Проверяем, что оба значения не пустые
    if (inputs[i].value && inputs[i+1].value) {
      // Добавляем объект с регионом и городом в массив
      regionsCities.push({region: inputs[i].value, city: inputs[i+1].value});
    }
  }
  // Преобразуем массив в строку JSON и сохраняем в localstorage под ключом "regionsCities"
  localStorage.setItem("regionsCities", JSON.stringify(regionsCities));  
}

// Получаем элемент формы по атрибуту action
let form = document.querySelector("form[action='/find_routes']");
// Добавляем обработчик события submit на форму
form.addEventListener("submit", function(event) {
  // Вызываем функцию для сохранения пар регионов-городов в localstorage
  saveRegionsCities();
  // Возвращаем true, чтобы продолжить отправку формы
  return true;
});
}

// Добавить функцию в качестве обработчика события DOMContentLoaded
document.addEventListener("DOMContentLoaded", runScript);