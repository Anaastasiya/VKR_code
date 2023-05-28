API_KEY = 'd7012521-ab87-4756-8244-36216e5d9ea4'
import requests

def fetch(url, params):
    headers = params['headers']
    body = params['body']
    if params['method'] == 'GET':
       return requests.get(url, headers=headers)
    if params['method'] == 'POST':
      return requests.post(url, headers=headers, data=body)
   
marsh = fetch("https://suggests.rasp.yandex.net/all_suggests?client_city=973&field=to&format=old&lang=ru&national_version=ru&other_point=c973", {
  "headers": {
    "accept": "*/*",
    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": "\"Google Chrome\";v=\"113\", \"Chromium\";v=\"113\", \"Not-A.Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referer": "https://t.rasp.yandex.ru/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": None,
  "method": "GET"
})
print(marsh.status_code)
print(marsh.json())