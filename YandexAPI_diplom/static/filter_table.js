var cities_coords = [];
var transport_types = [];
var optimalRoutes = [];

let transport_type  ;

// // Функция для выполнения кода скрипта
function runScript() {
    CorrectPrices();
    var t_avg=0;
    var p_avg=0;
    var showRouteButton = document.getElementById("showRouteButton");
    // Добавляем обработчик события на клик по кнопке
    showRouteButton.addEventListener("click", showRoute );
        // Получить элементы ползунка и спана
    let slider = document.getElementById("prioritySlider");
    let span = document.getElementById("priority");
    transport_type = document.getElementById("transport_type");
    // Отобразить начальное значение ползунка в спане
    span.innerHTML = slider.value;

    // Добавить обработчик события input для ползунка
    slider.oninput = function() {
    // Отобразить текущее значение ползунка в спане
    span.innerHTML = this.value;
    }
    // Получить элемент кнопки
    let button = document.getElementById("filterButton");

    // Добавить обработчик события click для кнопки
    button.onclick = function() {
    // Вызвать функцию фильтрации рейсов
    filterRoutes();
    }

    function CorrectPrices() {
        let table = document.querySelector("table");
        // Получить все строки таблицы
        let rows = table.querySelectorAll("tr");
        
        // Пройтись по всем строкам таблицы, начиная со второй (первая - это заголовок)
        for (let i = 1; i < rows.length; i++) {
            // Получить ячейки текущей строки
            let cells = rows[i].querySelectorAll("td");
            // Получить номер, тип транспорта, город отправления, город прибытия, время отправления, время прибытия и цену текущего рейса из ячеек
            let price = cells[8].textContent;
            if (price=="Неизвестно") {
                cells[8].textContent = (1000+Math.random() * 5000).toFixed(2) + " RUB"; // случайная цена от 1000 до 6000                
            }
        }
    }

    // Функция для фильтрации рейсов
    let k;
    function filterRoutes() {
        // Получить значение ползунка приоритета
        let slider = document.getElementById("prioritySlider");
        let priority = parseInt(slider.value,10);
        // Вычислить коэффициент k
        k = (priority + 10) / (110 - priority);
        // Получить таблицу с рейсами
        let table = document.querySelector("table");
        // Получить все строки таблицы
        let rows = table.querySelectorAll("tr");
        // Создать пустой массив для хранения оптимальных рейсов
        optimalRoutes = [];
        // Создать переменную для хранения текущего города отправления
        let fromCity = "";
        // Создать переменную для хранения текущего города прибытия
        let toCity = "";
        // Создать переменную для хранения текущего оптимального рейса
        let optimalRoute = null;
        // Пройтись по всем строкам таблицы, начиная со второй (первая - это заголовок)
        for (let i = 1; i < rows.length; i++) {
            rows[i].style.display = "table-row";
        }
        for (let i = 1; i < rows.length; i++) {
            // Получить ячейки текущей строки
            let cells = rows[i].querySelectorAll("td");
            // Получить номер, тип транспорта, город отправления, город прибытия, время отправления, время прибытия и цену текущего рейса из ячеек
            let number = cells[1].textContent;
            let type = cells[2].textContent;
            // Получить город отправления и прибытия из первого поля, разделив его по символу "—"
            let fromTo = cells[0].textContent.split("—");
            let from = fromTo[0].trim(); // Убрать пробелы в начале и конце
            let to = fromTo[1].trim(); // Убрать пробелы в начале и конце
            let departure = cells[5].textContent.split("T");
            let date = departure[0]; // Первый элемент массива - дата
            let time = departure[1]; // Второй элемент массива - время
            let arrival = cells[6].textContent;
            let price = cells[8].textContent.split(" ")[0] ;
            if (price === "Неизвестно"){//если сделать цену нулевой, она пропадет из веса ребра и отбор будет только по времени
                price=0;
            }
            // Вычислить продолжительность текущего рейса в часах
            let duration = (new Date(arrival) - new Date(departure)) / 3600000;
            // Если текущий город отправления или прибытия отличается от предыдущего, то это начало нового блока рейсов между двумя городами
            let duplicate = false;
            if (from !== fromCity || to !== toCity) {
                //k = (priority + 10) / (110 - priority);
                // Если оптимальный рейс уже найден, то добавить его в массив оптимальных рейсов
                duplicate = false;
                if (optimalRoute) {
                    for (let j = 0; j < optimalRoutes.length; j++) {
                        // Если номер, город отправления и город прибытия совпадают, то считать текущий рейс оптимальным и выйти из цикла
                        if (optimalRoute.number === optimalRoutes[j].number && optimalRoute.from === optimalRoutes[j].from && optimalRoute.to === optimalRoutes[j].to) {
                            duplicate =  true;
                            break;
                        }
                    }
                    if (!duplicate) {
                        optimalRoutes.push(optimalRoute);
                    }
                }
                // Обновить текущий город отправления и прибытия
                fromCity = from;
                toCity = to;
                // Сделать текущий рейс оптимальным по умолчанию
                optimalRoute = {
                    number: number,
                    type: type,
                    from: from,
                    to: to,
                    departure: departure,
                    arrival: arrival,
                    price: price,
                    duration: duration
                };
            } else {
                // Если текущий город отправления и прибытия совпадает с предыдущим, то это продолжение блока рейсов между двумя городами
                // Сравнить текущий рейс с оптимальным по стоимости и времени в пути
                let k_p =0;

               if(price === "Неизвестно" || optimalRoute.price === "Неизвестно"){
                    k_p = 1;
                }
                else{
                k_p = price / optimalRoute.price; // проигрыш в цене
                }
                let k_t = optimalRoute.duration / duration; //выигрыш во времени
               
                //нужно уменьшить вес ребра, задаваемого формулой k_p_otn + k_t_otn*k
                // Если условие k_p / k_t > k выполняется, то заменить оптимальный рейс на текущий
                if (k_t>=1 && k_p<=1 ||
                    k_t>1 && k_p>1 && k_t*k>k_p ||
                    k_t<1 && k_p<1 && k_p*k<k_t) {
                    optimalRoute = {
                        number: number,
                        type: type,
                        from: from,
                        to: to,
                        departure: departure,
                        arrival: arrival,
                        price: price,
                        duration: duration
                    };
                }
            }
        }
        // После прохода по всем строкам таблицы, добавить последний оптимальный рейс в массив
        if (optimalRoute) {
            duplicate = false;
            if (optimalRoute) {
                for (let j = 0; j < optimalRoutes.length; j++) {
                    // Если номер, город отправления и город прибытия совпадают, то считать текущий рейс оптимальным и выйти из цикла
                    if (optimalRoute.number === optimalRoutes[j].number && optimalRoute.from === optimalRoutes[j].from && optimalRoute.to === optimalRoutes[j].to) {
                        duplicate =  true;
                        break;
                    }
                }
                if (!duplicate) {
                    optimalRoutes.push(optimalRoute);
                }
            }
            // optimalRoutes.push(optimalRoute);
        }
        var clone = optimalRoutes.slice(0);
        // Пройтись по всем строкам таблицы еще раз и скрыть или удалить те, которые не входят в массив оптимальных рейсов
        for (let i = 1; i < rows.length; i++) {
            // Получить ячейки текущей строки
            let cells = rows[i].querySelectorAll("td");
            // Получить номер, город отправления и город прибытия текущего рейса из ячеек
            let number = cells[1].textContent;
            // Получить город отправления и прибытия из первого поля, разделив его по символу "—"
            let fromTo = cells[0].textContent.split("—");
            let from = fromTo[0].trim(); // Убрать пробелы в начале и конце
            let to = fromTo[1].trim(); // Убрать пробелы в начале и конце

            // Создать переменную для хранения флага, является ли текущий рейс оптимальным
            let isOptimal = false;
            // Пройтись по массиву оптимальных рейсов и проверить, есть ли в нем текущий рейс
            for (let j = 0; j < optimalRoutes.length; j++) {
                // Если номер, город отправления и город прибытия совпадают, то считать текущий рейс оптимальным и выйти из цикла
                if (number === optimalRoutes[j].number && from === optimalRoutes[j].from && to === optimalRoutes[j].to) {
                    isOptimal = true;
                    optimalRoutes.splice(j,1);
                    break;
                }
            }
            // Если текущий рейс не оптимальный, то скрыть или удалить его из таблицы
            if (!isOptimal) {
                rows[i].style.display = "none"; // Скрыть строку
                // rows[i].remove(); // Удалить строку
            }
        }
        optimalRoutes = clone.slice(0);
    }

    // Функция для извлечения пар регионов-городов из localstorage и заполнения формы
    // function draw_route() {
    //     // Получаем строку JSON из localstorage по ключу "regionsCities"
    //     let regionsCities = localStorage.getItem("regionsCities");
    //     // Проверяем, что строка не пустая
    //     if (regionsCities) {
    //         // Преобразуем строку в массив объектов
    //         regionsCities = JSON.parse(regionsCities);
    //         // Проходим по всем объектам в массиве и заполняем соответствующие элементы input в форме
    //         for (let i = 0; i < regionsCities.length; i++) {
    //             // Получаем элементы input с атрибутом name, равным "region-" + (i+1) или "city-" + (i+1)
    //             let regionInput = document.querySelector("input[name='region-" + (i + 1) + "']");
    //             let cityInput = document.querySelector("input[name='city-" + (i + 1) + "']");
    //             // Проверяем, что элементы существуют
    //             if (regionInput && cityInput) {
    //                 // Заполняем элементы значениями из объекта
    //                 regionInput.value = regionsCities[i].region;
    //                 cityInput.value = regionsCities[i].city;
    //             } else {
    //                 // Если элементов нет, значит нужно добавить новую строку в форму
    //                 addCity();
    //                 // Повторяем те же действия для новых элементов
    //                 regionInput = document.querySelector("input[name='region-" + (i + 1) + "']");
    //                 cityInput = document.querySelector("input[name='city-" + (i + 1) + "']");
    //                 regionInput.value = regionsCities[i].region;
    //                 cityInput.value = regionsCities[i].city;
    //             }
    //         }
    //     }
    // }
    // Создаем функцию для получения координат по названию города
    // var stationsData =localStorage.getItem("stationsData", stationsData);
    var stationsData =JSON.parse(document.getElementById("stations-data").textContent);
    function getCoordinates(city, selectedRegion) {
        // Получаем данные о станциях из скрытого div
        // var stations = JSON.parse(document.getElementById("stations-data").textContent);
        // Получить станции принадлежащие данному городу
        stationsData =JSON.parse(document.getElementById("stations-data").textContent);
        stations = stationsData.countries.flatMap(country => country.regions).find(region => region.title === selectedRegion).settlements.find(settlement => settlement.title === city).stations;

        // stations = stations["countries"][0]["regions"][0]["settlements"];
        // Проходим по каждой станции и ищем заполненные широту и долготу
        for (var i = 0; i < stations.length; i++) {
        if (stations[i]["latitude"] != "") {
            // Возвращаем координаты станции в виде массива, обернутые в промис
            return [stations[i]["latitude"], stations[i]["longitude"]];
            //return Promise.resolve([stations[i]["latitude"], stations[i]["longitude"]]);
        }
        }
        return [0,0];
        // Если не нашли совпадение, возвращаем null, обернутый в промис
        //return Promise.resolve(null);
    }
    var coordinates = [];
    
    // Создаем функцию для получения и отображения маршрута
    t_avg=0;
    p_avg=0;
    function showRoute() {
        // обнуляем массив для хранения координат

        coordinates = [];
        cities_coords = [];
        t_avg=0;
        p_avg=0;
        let sum_price =0;
        let sum_duration =0;
        for (let j = 0; j < optimalRoutes.length; j++) {
            if(optimalRoutes[j].price === "Неизвестно"){
                console.log("цена не может быть просуммирована, от балды добавлено 5000");
                sum_price=sum_price+5000; //заглушка
            }
            else{
            sum_price=sum_price+parseFloat(optimalRoutes[j].price);
            }
            sum_duration=sum_duration+parseFloat(optimalRoutes[j].duration);
        }
        t_avg = sum_duration/optimalRoutes.length;
        p_avg = sum_price/optimalRoutes.length;

    ////////////////////////
        // Получаем строку JSON из localstorage по ключу "regionsCities"
        let regionsCities = localStorage.getItem("regionsCities");
        // Проверяем, что строка не пустая
        if (regionsCities) {
            // Преобразуем строку в массив объектов
            regionsCities = JSON.parse(regionsCities);
            
            for (let i = 0; i < regionsCities.length; i++) {
                coords=getCoordinates(regionsCities[i].city, regionsCities[i].region)
                    // Если координаты найдены, добавляем их в массив
                    if (coords) {
                    coordinates.push(coords);
                    cities_coords.push({"city":regionsCities[i].city,"coords":coords});
                    
                    }
            }
        }
        localStorage.setItem("cities_coords",JSON.stringify(cities_coords));

        localStorage.setItem("optimalRoutes",JSON.stringify(optimalRoutes));
        localStorage.setItem("t_avg",JSON.stringify(t_avg));
        localStorage.setItem("p_avg",JSON.stringify(p_avg));
        localStorage.setItem("k",JSON.stringify(k));

        // Делаем что-то с массивом координат

        //сохраним массив координат d
        // Создаем элемент для карты
        ymaps.ready(function () {
                //создаем карту
                var map = new ymaps.Map("map", {
                    center: [55.75, 37.62],
                    zoom: 10
                });

                // Добавляем элементы управления на карту
                map.controls.add("zoomControl");
                map.controls.add("typeSelector");
            var route;
            
            route = solveTSP(coordinates, true);
            LeaveOnlyRouteInTable(route);

            // Формируем URL для запроса к HTTP Геокодеру по координатам
            transport_type = document.getElementById("transport_type");
            if (transport_type.textContent === "plane") {
                var line = new ymaps.Polyline(
                    //   [
                    //    [from_lat, from_lon], // откуда
                    //   [to_lat, to_lon ] // куда
                    // ]
                    route
                    , {}, {
                    // Задаем стиль и цвет линии
                    strokeColor: "#0000FF",
                    strokeWidth: 4,
                    strokeOpacity: 0.5
                });

                // Добавляем линию на карту
                map.geoObjects.add(line);
                map.setBounds(line.geometry.getBounds());
                // Подключаем модуль arrow.js, который содержит класс Arrow и его визуальное отображение ArrowOverlay
                ymaps.modules.require(['arrow'], function (Arrow) {
                    // Создаем массив цветов для стрелок
                    var colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];
                    // Проходим по всем сегментам маршрута
                    for (var i = 0; i < route.length - 1; i++) {
                        // Получаем координаты начала и конца сегмента
                        var from = route[i];
                        var to = route[i + 1];
                        // Создаем объект-стрелку с заданным цветом из массива
                        var arrow = new Arrow([from, to], {}, { strokeColor: colors[i % colors.length] });
                        // Добавляем стрелку на карту
                        map.geoObjects.add(arrow);
                    }
                });
            }
            else {
                var urls = [];
                for (var i = 0; i < route.length; i++) {
                    urls.push("https://geocode-maps.yandex.ru/1.x/?apikey=9431bf30-a1d4-4319-88e3-b17a8ad8830b&format=json&geocode=" + route[i][1] + "," + route[i][0]);

                }
                // var url1 = "https://geocode-maps.yandex.ru/1.x/?apikey=9431bf30-a1d4-4319-88e3-b17a8ad8830b&format=json&geocode=" + from_lon + "," + from_lat;
                // var url2 = "https://geocode-maps.yandex.ru/1.x/?apikey=9431bf30-a1d4-4319-88e3-b17a8ad8830b&format=json&geocode=" + to_lon + "," + to_lat;



                // Делаем запросы с помощью fetch и обрабатываем ответы
                // Promise.all([fetch(url1), fetch(url2)])
                Promise.all(urls.map(u => fetch(u)))
                    .then(function (responses) {
                        return Promise.all(responses.map(function (response) {
                            return response.json();
                        }));
                    })
                    .then(function (data) {
                        // Извлекаем названия городов из ответов
                        var cities = []
                        for (var i = 0; i < data.length; i++) {
                            cities.push(data[i]["response"]["GeoObjectCollection"]["featureMember"][0]["GeoObject"]["metaDataProperty"]["GeocoderMetaData"]["text"]);
                        }
                        // var city1 = data[0]["response"]["GeoObjectCollection"]["featureMember"][0]["GeoObject"]["metaDataProperty"]["GeocoderMetaData"]["text"];
                        // var city2 = data[1]["response"]["GeoObjectCollection"]["featureMember"][0]["GeoObject"]["metaDataProperty"]["GeocoderMetaData"]["text"];
                        // Создаем маршрут по названиям городов с помощью библиотеки JavaScript API
                        // ymaps.route([city1, city2], { mapStateAutoApply: true, type: "plane"})
                        ymaps.route(cities, { mapStateAutoApply: true, type: "plane" })
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
            }

        });

    }

    function LeaveOnlyRouteInTable(route){
        let cities_coords= JSON.parse(localStorage.getItem("cities_coords"));
        let table = document.querySelector("table");
            // Получить все строки таблицы
        let rows = table.querySelectorAll("tr");
        //тут надо сделать все строки таблицы невидимыми 
        for (let i = 1; i < rows.length; i++) {
            rows[i].style.display = "none";
        }
        for (let r = 0; r < route.length-1; r++) {
            lat1 = route[r][0];
            lon1 = route[r][1]
            lat2 = route[r+1][0];
            lon2 = route[r+1][1]
            let city1 ="";
            let city2 ="";
            
            
            //сперва по координатам найдем названия городов используя cities_coords
            for (let i = 0; i < cities_coords.length; i++) {
                if (cities_coords[i]["coords"][0] === lat1 && cities_coords[i]["coords"][1] === lon1 ){
                    city1 = cities_coords[i]["city"];
                }
                if (cities_coords[i]["coords"][0] === lat2 && cities_coords[i]["coords"][1] === lon2 ){
                    city2 = cities_coords[i]["city"];
                }
            }
            for (let j = 0; j < optimalRoutes.length; j++) {
                if (optimalRoutes[j].from == city1 && optimalRoutes[j].to == city2) {
                    for (let i = 1; i < rows.length; i++) {
                        let cells = rows[i].querySelectorAll("td");
                        if(optimalRoutes[j].number == cells[1].textContent &&
                                optimalRoutes[j].type == cells[2].textContent &&                        
                                optimalRoutes[j].from+"—"+optimalRoutes[j].to == cells[0].textContent &&                        
                                optimalRoutes[j].departure == cells[5].textContent &&
                                optimalRoutes[j].arrival == cells[6].textContent &&
                                optimalRoutes[j].price == cells[8].textContent.split(" ")[0] ){

                            rows[i].style.display = "table-row";//строку делаем видимой, т.к. она есть в маршруте
                            //добавить в глобальный массив transport_types[] optimalRoutes[j].type
                            transport_types.push(optimalRoutes[j].type);
                            break;
                        }
                    }
                    break;
                }
                
            }
        }
        
    }

}
// Добавить функцию в качестве обработчика события DOMContentLoaded
document.addEventListener("DOMContentLoaded", runScript); 