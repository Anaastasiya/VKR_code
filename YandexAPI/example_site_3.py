API_KEY = 'd7012521-ab87-4756-8244-36216e5d9ea4'
# Импортируем необходимые библиотеки
from flask import Flask, render_template, request, jsonify
import requests
import datetime

# Создаем экземпляр приложения Flask
app = Flask(__name__)

# Создаем список стран в переменной countries
countries = []
# Задаем параметры запроса к API Яндекс.Расписаний для получения списка стран
params = {
    "apikey": API_KEY, # замените на свой ключ API
    "format": "json",
    "lang": "ru_RU"
}

# Отправляем запрос к API и получаем ответ в формате JSON
response = requests.get("https://api.rasp.yandex.net/v3.0/stations_list/", params=params)
data = response.json()
# Проходим по списку стран в ответе и добавляем их в список countries
for country in data["countries"]:
    countries.append(country)

# Создаем переменные today и max_date для ограничения выбора даты
today = datetime.date.today().isoformat() # текущая дата в формате YYYY-MM-DD
max_date = (datetime.date.today() + datetime.timedelta(days=90)).isoformat() # максимальная дата (текущая дата + 90 дней) в формате YYYY-MM-DD

# Определяем маршрут для страницы выбора пунктов
@app.route("/")
def select():
    # Рендерим шаблон select.html с передачей списка стран в переменную countries и дат в переменные today и max_date
    return render_template("select.html", countries=countries, today=today, max_date=max_date)

# Определяем маршрут для получения списка станций по коду страны
@app.route("/stations")
def stations():
    # Получаем параметр кода страны из объекта request.args
    country_code = request.args.get("country_code")
    # Если код страны не пустой, то отправляем запрос к API Яндекс.Расписаний для получения списка станций по этой стране
    if country_code:
        # Задаем параметры запроса к API Яндекс.Расписаний для получения списка станций по коду страны
        params = {
            "apikey": API_KEY, # замените на свой ключ API
            "format": "json",
            "lang": "ru_RU",
            "country_code": country_code # код страны
        }
        # Отправляем запрос к API и получаем ответ в формате JSON
        response = requests.get("https://api.rasp.yandex.net/v3.0/stations_list/", params=params)
        data = response.json()
        # Создаем пустой список станций
        stations = []
        # Проходим по списку регионов в ответе и добавляем станции в список stations
        for region in data["countries"][0]["regions"]:
            for settlement in region["settlements"]:
                for station in settlement["stations"]:
                    stations.append(station)
        # Возвращаем список станций в формате JSON с помощью функции jsonify из библиотеки Flask
        return jsonify(stations)
    else:
        # Если код страны пустой, то возвращаем пустой список в формате JSON
        return jsonify([])

# Определяем маршрут для страницы результатов поиска
@app.route("/results")
def results():
    # Получаем параметры запроса из объекта request.args
    from_code = request.args.get("from") # код станции отправления
    to_code = request.args.get("to") # код станции прибытия
    date = request.args.get("date") # дата отправления
    # Задаем параметры запроса к API Яндекс.Расписаний для поиска поездов
    params = {
        "apikey": API_KEY, # замените на свой ключ API
        "format": "json",
        "from": from_code,
        "to": to_code,
        "lang": "ru_RU",
        "transport_types": "train", # тип транспорта (поезд)
        "date": date
    }
    # Отправляем запрос к API и получаем ответ в формате JSON
    response = requests.get("https://api.rasp.yandex.net/v3.0/search/", params=params)
    data = response.json()
    # Возвращаем список поездов из ответа API в формате JSON с помощью функции jsonify из библиотеки Flask
    return jsonify(data["segments"])

# Запускаем приложение Flask
if __name__ == "__main__":
    app.debug = True
    app.run()
