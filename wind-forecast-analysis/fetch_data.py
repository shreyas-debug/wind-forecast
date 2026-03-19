import requests
import pandas as pd
from datetime import datetime

print("Fetching ELEXON Data for Jan 2025...")

BASE_URL = "https://data.elexon.co.uk/bmrs/api/v1/datasets"
START_TIME = "2025-01-01T00:00:00Z"
END_TIME = "2025-01-31T00:00:00Z"

def fetch_actuals():
    url = f"{BASE_URL}/FUELHH/stream?publishTimeFrom={START_TIME}&publishTimeTo={END_TIME}"
    res = requests.get(url)
    data = res.json()
    # Filter for wind
    wind_data = [d for d in data if d.get('fuelType') == 'WIND']
    df = pd.DataFrame(wind_data)
    if not df.empty:
        df = df[['startTime', 'generation']].rename(columns={'startTime': 'targetTime', 'generation': 'actualGeneration'})
        df.to_csv("actuals.csv", index=False)
        print("actuals.csv saved with", len(df), "rows.")
    else:
        print("No actuals found.")

def fetch_forecasts():
    # WINDFOR stream has startTime and publishTime
    url = f"{BASE_URL}/WINDFOR/stream?startTimeFrom={START_TIME}&startTimeTo={END_TIME}"
    res = requests.get(url)
    data = res.json()
    df = pd.DataFrame(data)
    if not df.empty:
        df = df[['startTime', 'publishTime', 'generation']].rename(columns={'startTime': 'targetTime', 'generation': 'forecastedGeneration'})
        df.to_csv("forecasts.csv", index=False)
        print("forecasts.csv saved with", len(df), "rows.")
    else:
        print("No forecasts found.")

if __name__ == "__main__":
    fetch_actuals()
    fetch_forecasts()
