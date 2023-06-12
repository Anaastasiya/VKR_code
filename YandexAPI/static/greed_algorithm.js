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

// Функция, которая решает задачу комивояжера жадным алгоритмом
function solveTSP(coordinates) {
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
      var currentDistance = distance(lastCity[0], lastCity[1], currentCity[0], currentCity[1]);
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
