from flask import Flask, render_template, request
import requests
API_KEY = '1d5197db-641b-460e-a97e-750e0311d94c'
app = Flask(__name__)



@app.route('/routes')
def routes():
    return render_template('routes.html')


stations_data={}
# Получить данные о станциях от яндекс апи
def get_stations():
    url = f"https://api.rasp.yandex.net/v3.0/stations_list/?apikey={API_KEY}&lang=ru_RU&format=json"
    response = requests.get(url)
    data = response.json()
    return data

# Получить данные о рейсах от яндекс апи
def get_routes(from_city, to_city, date,transport_type, from_region, to_region):
    
    
    # transport_type = "plane" 
    global stations_data 
    # Получить коды станций по названиям городов
    from_code = next(city["codes"]["yandex_code"] for country in stations_data["countries"] for region in country["regions"] for city in region["settlements"] if city["title"] == from_city and region["title"] == from_region)
    to_code = next(city["codes"]["yandex_code"] for country in stations_data["countries"] for region in country["regions"] for city in region["settlements"] if city["title"] == to_city and region["title"] == to_region)    
    if transport_type == "any":
            # Сформировать url запроса с параметрами
        url = f"https://api.rasp.yandex.net/v3.0/search/?apikey={API_KEY}&lang=ru_RU&format=json&from={from_code}&to={to_code}&date={date}"        
    else:
        # Сформировать url запроса с параметрами
        url = f"https://api.rasp.yandex.net/v3.0/search/?apikey={API_KEY}&lang=ru_RU&format=json&from={from_code}&to={to_code}&date={date}&transport_types={transport_type}"
    # Отправить запрос и получить ответ
    response = requests.get(url)
   
    data = response.json()
    for i in range(len(data["segments"])): 
        from_city =    data["search"]["from"]["popular_title"]
        to_city=   data["search"]["to"]["popular_title"] 
        data["segments"][i]["thread"]["title"] =  from_city+"—"+to_city
    print("from: "+data["search"]["from"]["popular_title"]+" to: "+data["search"]["to"]["popular_title"])
    
    return data

# Отобразить главную страницу с формой выбора страны, региона и города
@app.route("/")
def index():
    global stations_data
    # Получить данные о станциях и передать их в шаблон
    stations_data = get_stations()
    return render_template("site.html", stations_data=stations_data)
# Обработать запрос на поиск рейсов
@app.route("/find_routes", methods=["POST"])
def find_routes():
    # Получить данные из формы
    global stations_data
    routes_datas=[]
    from_city = request.form.get("city-1")
    to_city = request.form.get("city-2")
    from_region = request.form.get("region-1")
    to_region = request.form.get("region-2")
    
    date = request.form.get("date")
    transport_type = request.form.get("transport_type")
    a=list(range(3,int(len(request.form)/3+1)))
    # сперва найдем все рейсы из стартового города к остальным городам
    routes_datas.append(get_routes(from_city, to_city, date,transport_type,from_region, to_region))
    for i in a:
        trans_city_1 = request.form.get("city-"+str(i))
        trans_region_1 = request.form.get("region-"+str(i))
        routes_datas.append(get_routes(from_city, trans_city_1, date,transport_type,from_region, trans_region_1))
    # теперь добавим к списку маршруты из промежуточных городов в конечный
        routes_datas.append(get_routes(trans_city_1, to_city, date,transport_type, trans_region_1, to_region))
    # и теперь добавим все рейсы между промежуточными городами (в обе стороны)    
    for i, j in [(i,j) for i in a for j in a]:
            if i!=j:
                trans_region_1 = request.form.get("region-"+str(i))
                trans_city_1 = request.form.get("city-"+str(i))
                trans_region_2 = request.form.get("region-"+str(j))
                trans_city_2 = request.form.get("city-"+str(j))
                routes_datas.append(get_routes(trans_city_1, trans_city_2, date,transport_type,trans_region_1,trans_region_2))
 
    return render_template("routes.html", routes_data=routes_datas,stations_data=stations_data,transport_type=transport_type)
    

    
# Запустить приложение
if __name__ == "__main__":
    app.run(debug=True)
