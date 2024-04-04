import requests
import pandas as pd
import json

def get_place_details(place_id):
    params = {
        "place_id": place_id,
        "key": "YOUR_KEY",
        "region": "jp",
        "language": "ja",
    }

    url = "https://maps.googleapis.com/maps/api/place/details/json"
    res = requests.get(url, params=params)
    return json.loads(res.text)["result"]

def get_place_info(query):
    params = {
        "query": query,
        "key": "YOUR_KEY",
        "region": "jp",
        "language": "ja",
    }

    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    res = requests.get(url, params=params)
    return json.loads(res.text)["results"]

def get_reviews(reviews):
    return [review["text"] for review in reviews]

# CSVファイルからデータを読み込む
df = pd.read_csv("sapporo_list4.csv")

# 新しいカラムを追加する
for i in range(1, 6):
    df[f'レビュー{i}'] = ""

df['営業時間'] = ""
df['概要'] = ""
df['評価'] = ""
df['ウェブサイトURL'] = ""
df['lat'] = ""
df['lng'] = ""
df['店名from Google'] = ""
df['住所from Google'] = ""

# 各店舗の情報を取得してDFに追加
for index, row in df.iterrows():
    target_info = get_place_info(row['店名'] + ' ' + row['住所'])
    if target_info:
        place_id = target_info[0]["place_id"]
        target_detail = get_place_details(place_id)
        df.at[index, '営業時間'] = target_detail.get("current_opening_hours", {}).get("weekday_text", "")
        df.at[index, '概要'] = target_detail.get("editorial_summary", {}).get("overview", "")
        df.at[index, '評価'] = target_detail.get("rating", "")
        df.at[index, 'ウェブサイトURL'] = target_detail.get("website", "")
        geo = target_detail.get("geometry", {})
        df.at[index, 'lat'] = geo.get("location", {}).get("lat", "")
        df.at[index, 'lng'] = geo.get("location", {}).get("lng", "")
        df.at[index, '店名from Google'] = target_detail.get("name", "")
        df.at[index, '住所from Google'] = target_info[0]["formatted_address"]
        reviews = target_detail.get("reviews", [])
        for i, review in enumerate(reviews[:5]):
            df.at[index, f'レビュー{i+1}'] = review.get("text", "")

# CSVファイルとして出力(utf-8_sigだと文字化けしない)
df.to_csv("output_sample.csv", index=False, encoding="utf-8_sig")