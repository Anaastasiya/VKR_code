
// Функция, которая вычисляет расстояние между двумя точками по координатам
function distance(lat1, lon1, lat2, lon2) {
  // Используем формулу гаверсинусов
  var R = 6371; // Радиус Земли в км
  var dLat = (lat2 - lat1) * Math.PI / 180; // Переводим разность широт в радианы
  var dLon = (lon2 - lon1) * Math.PI / 180; // Переводим разность долгот в радианы
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2); // Вычисляем гаверсинус центрального угла
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Вычисляем центральный угол
  var d = R * c; // Вычисляем расстояние
  return d;
}


//cities_coords - глобальный массив вида [{"city":"Москва", "coords":"35.43,23.34"}]
//optimalRoutes - глобальный массив со структурой таблицы, содержащий только оптималоьные маршруты
//t_avg, p_avg - глобальные переменные содержащие среднее время и среднюю стоимость в оптимальных машрутах
//k - глобальная переменная отвечающая за приоритет между ценой и временем
function reeb_weight(lat1, lon1, lat2, lon2){
  let city1 ="";
  let city2 ="";
  let t =0;
  let p=0;
  let cities_coords= JSON.parse(localStorage.getItem("cities_coords"));
  let optimalRoutes= JSON.parse(localStorage.getItem("optimalRoutes"));
  let t_avg = JSON.parse(localStorage.getItem("t_avg"));
  let p_avg = JSON.parse(localStorage.getItem("p_avg"));
  let k = JSON.parse(localStorage.getItem("k"));
  //  city1,city2, t,p,k
  //сперва по координатам найдем названия городов используя cities_coords
  for (let i = 0; i < cities_coords.length; i++) {
    if (cities_coords[i]["coords"][0] === lat1 && cities_coords[i]["coords"][1] === lon1 ){
      city1 = cities_coords[i]["city"];
    }
    if (cities_coords[i]["coords"][0] === lat2 && cities_coords[i]["coords"][1] === lon2 ){
      city2 = cities_coords[i]["city"];
    }
  }
  //теперь, имея найдем p и t используя названия городов в optimalRoutes
  for (let i = 0; i < optimalRoutes.length; i++) {
    if (optimalRoutes[i].from === city1 && optimalRoutes[i].to === city2){
      p=optimalRoutes[i].price;
      t=optimalRoutes[i].duration;
    }
  }
  //вернем вес ребра
  if (p_avg === 0){
    return t/t_avg*k;
  }else{
    return p/p_avg+t/t_avg*k;
  }
}

// Функция, которая решает задачу комивояжера жадным алгоритмом
function solveTSP(coordinates, flag_use_weight) {
  // Создаем пустой массив для хранения маршрута
  var route = [];
  var last_city;
  // Добавляем стартовый город в маршрут
  route.push(coordinates[0]);
  last_city = coordinates[1];

  // Удаляем стартовый город из массива координат
  coordinates.splice(0, 1);
  // Удаляем конечный город из массива координат
  coordinates.splice(0, 1);

  // Пока есть непосещенные города
  while (coordinates.length > 0) {
    // Получаем координаты последнего посещенного города
    var lastCity = route[route.length - 1];    
    // Инициализируем переменные для хранения ближайшего города и его индекса и расстояния до него
    var nearestCity = null;
    var nearestIndex = -1;
    var nearestDistance = Infinity;
    // Проходим по всем непосещенным городам
    for (var i = 0; i < coordinates.length; i++) {
      // Получаем координаты текущего города
      var currentCity = coordinates[i];
      // Вычисляем расстояние от последнего посещенного города до текущего
      var currentDistance=0;
      if (flag_use_weight) {
        currentDistance = reeb_weight(lastCity[0], lastCity[1], currentCity[0], currentCity[1]);
      }
      else
      {
       currentDistance = distance(lastCity[0], lastCity[1], currentCity[0], currentCity[1]);
      }
      // Если расстояние меньше, чем минимальное до сих пор
      if (currentDistance < nearestDistance) {
        // Обновляем ближайший город и его индекс и расстояние до него
        nearestCity = currentCity;
        nearestIndex = i;
        nearestDistance = currentDistance;
      }
    }
    // Добавляем ближайший город в маршрут
    
    route.push(nearestCity);
    // Удаляем ближайший город из массива координат
    coordinates.splice(nearestIndex, 1);
  }
  // Добавляем конечный город в маршрут
  route.push(last_city);
  // Возвращаем маршрут
//   return route.splice(route.length-1,1);
  return route;
}
