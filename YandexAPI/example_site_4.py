from flask import Flask, render_template, request
import requests
API_KEY = '1d5197db-641b-460e-a97e-750e0311d94c'
app = Flask(__name__)

@app.route('/example_site_4')
def example_site_4():
    return render_template('example_site_4.html')

@app.route('/routes')
def routes():
    return render_template('routes.html')


stations_data = {}
# Получить данные о станциях от яндекс апи
def get_stations():
    url = f"https://api.rasp.yandex.net/v3.0/stations_list/?apikey={API_KEY}&lang=ru_RU&format=json"
    response = requests.get(url)
    data = response.json()
    return data

# Получить данные о рейсах от яндекс апи
def get_routes(from_city, to_city,transport_type, date):
    # transport_type = "plane" 
    #    
    # Получить коды станций по названиям городов
    from_code = next(city["codes"]["yandex_code"] for country in stations_data["countries"] for region in country["regions"] for city in region["settlements"] if city["title"] == from_city)
    to_code = next(city["codes"]["yandex_code"] for country in stations_data["countries"] for region in country["regions"] for city in region["settlements"] if city["title"] == to_city)
    
    # Сформировать url запроса с параметрами
    url = f"https://api.rasp.yandex.net/v3.0/search/?apikey={API_KEY}&lang=ru_RU&format=json&from={from_code}&to={to_code}&date={date}"

    # Отправить запрос и получить ответ
    response = requests.get(url)
    data = response.json()
    return data

# Отобразить главную страницу с формой выбора страны, региона и города
@app.route("/")
def index():
    global stations_data
    # Получить данные о станциях и передать их в шаблон
    stations_data = get_stations()
    return render_template("example_site_4.html", stations_data=stations_data)

# Обработать запрос на поиск рейсов
@app.route("/find_routes", methods=["POST"])
def find_routes():
    # Получить данные из формы
    from_city = request.form.get("city-1")
    to_city = request.form.get("city-2")
    date = request.form.get("date")
    # Получить данные о рейсах и передать их в шаблон
    routes_data = get_routes(from_city, to_city,"plane", date)
    return render_template("routes.html", routes_data=routes_data)

@app.route("/route_map")
def index2():
    # Получаем координаты города отправления и города прибытия из параметров запроса
    from_lat = request.args.get("from_lat")
    from_lon = request.args.get("from_lon")
    to_lat = request.args.get("to_lat")
    to_lon = request.args.get("to_lon")

    # Проверяем, что координаты заданы
    if from_lat and from_lon and to_lat and to_lon:
        global stations_data
        # Формируем URL для запроса к Яндекс API
        url = f"https://api.rasp.yandex.net/v3.0/search/?apikey=<YOUR_API_KEY>&format=json&from={from_lat},{from_lon}&to={to_lat},{to_lon}&lang=ru_RU"
        # Делаем запрос и получаем ответ в формате JSON
        response = requests.get(url).json()
        # Извлекаем список сегментов маршрута из ответа
        segments = response["segments"]
        # Возвращаем шаблон HTML с данными о маршруте
        return render_template("route.html", segments=segments)
    else:
        # Возвращаем шаблон HTML с формой для ввода координат
        
        # Получить данные о станциях и передать их в шаблон
        
        return render_template("example_site_4.html", stations_data=stations_data)
    
# Запустить приложение
if __name__ == "__main__":
    app.run(debug=True)
