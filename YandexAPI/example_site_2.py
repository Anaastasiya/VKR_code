API_KEY = '1d5197db-641b-460e-a97e-750e0311d94c'
# Импортируем необходимые библиотеки
from flask import Flask, render_template, request
from flask_cors import cross_origin,CORS

import requests
import datetime

# Создаем экземпляр приложения Flask
app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
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
@cross_origin(origin='*')
def select():
    # Рендерим шаблон select.html с передачей списка стран в переменную countries и дат в переменные today и max_date
    return render_template("select.html", countries=countries, today=today, max_date=max_date)

# Определяем маршрут для страницы результатов поиска
@app.route("/results")
@cross_origin(origin='*')
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
    # Возвращаем список поездов из ответа API
    trains = data["segments"]
    # Рендерим шаблон index.html с передачей списка поездов в переменную trains
    return render_template("index.html", trains=trains)

# Запускаем приложение Flask
if __name__ == "__main__":
    app.debug = True
    app.run()
