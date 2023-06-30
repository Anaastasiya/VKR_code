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

    // route = solveTSP(coordinates, true);

    route = [[55.75, 37.62], [56.75, 36.62], [58.75, 33.62]];
    let transport_types = ["plane", "train"];

    let route_pairs = [];
    for (var t = 0; t < route.length - 1; t++) {
        if (transport_types[t] == "plane") {
            var from = route[t];
            var to = route[t + 1];
            route_pairs.push([from, to]);
        }
    }
    // LeaveOnlyRouteInTable(route);


    //рисуем стрелочки для не самолетов
    Promise.all(route_pairs.map(u => draw_arrow(u)));
    function draw_arrow(route_pair) {
        ymaps.modules.require(['geoObject.Arrow'], function (Arrow) {
            // Создаем массив цветов для стрелок
            var colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];
            //var arrow = new Arrow(route_pair, {}, { strokeolor: colors[randomInteger(0,colors.length-1)] });
            var arrow = new Arrow(route_pair, null, { strokeWidth: 10 }, { strokeColor: "#00FF00" });
            // Добавляем стрелку на карту
            map.geoObjects.add(arrow);
        });
    }
    //рисуем не стрелочки
    for (var t = 0; t < route.length - 1; t++) {

        if (transport_types[t] == "plane") {
        }
        else {
            var urls = [];
            var pair_route;
            pair_route = [route[t], route[t + 1]];
            urls.push("https://geocode-maps.yandex.ru/1.x/?apikey=9431bf30-a1d4-4319-88e3-b17a8ad8830b&format=json&geocode=" + route[t][1] + "," + route[t][0]);
            urls.push("https://geocode-maps.yandex.ru/1.x/?apikey=9431bf30-a1d4-4319-88e3-b17a8ad8830b&format=json&geocode=" + route[t + 1][1] + "," + route[t + 1][0]);



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
                        .then(function (pair_route) {
                            // Добавляем маршрут на карту
                            pair_route.options.set("hasBalloon", false);
                            map.geoObjects.add(pair_route);
                            // Добавляем метки с названиями городов на карту
                            pair_route.getWayPoints().each(function (wayPoint) {
                                wayPoint.options.set("preset", "islands#redStretchyIcon");
                            });
                            map.setCenter([10, 10]);
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
    }


});