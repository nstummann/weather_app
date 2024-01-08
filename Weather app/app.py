from flask import Flask, render_template, jsonify, request
import requests

app = Flask(__name__)

q = ""  # Set the value of q as needed
api_key = "ebb83a917e6b4627aad133231240701"


def fetch_realtime(q):
    url = "http://api.weatherapi.com/v1/current.json"
    request = requests.get(url, params={"key": api_key, "q": q})
    realtime = {
        "time": request.json()["location"]["localtime"],
        "temp_c": request.json()["current"]["temp_c"]
    }
    return realtime

def fetch_forecast(q):
    url = "http://api.weatherapi.com/v1/forecast.json"
    days = 7
    forecast = []
    
    request = requests.get(url, params={"key": api_key, "q": q, "days": days})    
    request = request.json()["forecast"]["forecastday"][0]["hour"]

    for hour in request:
        forecast.append({
            "time": hour["time"],
            "temp_c": hour["temp_c"]
        })
    
    return forecast

@app.route("/")
def index():
    global q
    return render_template('index.html')

@app.route("/realtime")
def fetch_realtime_route():
    global q
    q = request.args.get("q", "")
    realtime_data = fetch_realtime(q)
    return jsonify(realtime_data)

@app.route("/forecast")
def fetch_forecast_route():
    global q
    q = request.args.get("q", "")
    forecast_data = fetch_forecast(q)
    return jsonify(forecast_data)

if __name__ == "__main__":
    app.run(debug=True)
