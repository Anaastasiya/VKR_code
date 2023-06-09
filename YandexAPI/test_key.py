import requests
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
    # response = requests.get("https://api.rasp.yandex.net/v3.0/search/", params=params)
    response = requests.get("https://api.rasp.yandex.net/v3.0/stations_list/?apikey=1d5197db-641b-460e-a97e-750e0311d94c&lang=ru_RU&format=json&country_code=l20869")
    data = response.json()
    # Возвращаем список поездов из ответа API
    return data["segments"]



get_schedule()
