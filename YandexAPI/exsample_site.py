
# Импортируем необходимые библиотеки
from flask import Flask, render_template
from apscheduler.schedulers.background import BackgroundScheduler
import requests

# Создаем экземпляр приложения Flask
app = Flask(__name__)

# Создаем экземпляр планировщика APScheduler
sched = BackgroundScheduler(daemon=True)

# Определяем функцию для получения данных от API Яндекс.Расписаний
def get_schedule():
    # Задаем параметры запроса к API
    params = {
        "apikey": "1d5197db-641b-460e-a97e-750e0311d94c", # замените на свой ключ API
        "format": "json",
        "from": "c146", # код станции отправления (Москва)
        "to": "c213", # код станции прибытия (Санкт-Петербург)
        "lang": "ru_RU",
        "transport_types": "train", # тип транспорта (поезд)
        "date": "2023-05-25" # дата отправления
    }
    # Отправляем запрос к API и получаем ответ в формате JSON
    response = requests.get("https://api.rasp.yandex.net/v3.0/search/", params=params)
    data = response.json()
    # Возвращаем список поездов из ответа API
    return data["segments"]

# Добавляем задание для планировщика, которое будет вызывать функцию get_schedule каждый час
sched.add_job(get_schedule, "interval", hours=1)
# Запускаем планировщик
sched.start()

# Определяем маршрут для главной страницы
@app.route("/")
def index():
    # Получаем список поездов из функции get_schedule
    trains = get_schedule()
    print('entered /')
    # Рендерим шаблон index.html с передачей списка поездов в переменную trains
    return render_template("index.html", trains=trains)
    # return render_template("index.html")

# Запускаем приложение Flask
if __name__ == "__main__":
    app.debug = True
    app.run()
