import pandas as pd
import numpy as np
import sys
import json
import matplotlib.pyplot as plt
import base64
from io import BytesIO

def main():
    input_data = sys.stdin.read()
    data = json.loads(input_data)

    df = pd.DataFrame(data)

    # ✅ Handle empty data
    if df.empty:
        print(json.dumps({
            "avg_sleep": 0,
            "avg_water": 0,
            "avg_calories": 0,
            "avg_workout": 0,
            "consistency": 0,
            "fitness_score": 0,
            "insights": [],
            "chart": None
        }))
        return

    #  Convert to numeric
    for col in ["sleep", "water", "workout", "calories"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

    #  Sort by date
    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"])
        df = df.sort_values(by="date")

   
    #  Generate Chart
  
    chart_base64 = None

    if "date" in df.columns and "workout" in df.columns:
        plt.figure()

        plt.plot(df["date"], df["workout"])
        plt.title("Workout Trend")
        plt.xlabel("Date")
        plt.ylabel("Workout (min)")

        buffer = BytesIO()
        plt.savefig(buffer, format="png")
        buffer.seek(0)

        chart_base64 = base64.b64encode(buffer.read()).decode("utf-8")
        plt.close()

    #Metrics
    
    avg_sleep = df["sleep"].mean() if "sleep" in df.columns else 0
    avg_water = df["water"].mean() if "water" in df.columns else 0
    avg_calories = df["calories"].mean() if "calories" in df.columns else 0
    avg_workout = df["workout"].mean() if "workout" in df.columns else 0

    consistency = df["workout"].var() if "workout" in df.columns else 0

    #  Fitness score
    fitness_score = 0
    if all(col in df.columns for col in ["sleep", "water", "workout"]):
        fitness_score = (
            df["workout"] * 0.4 +
            df["sleep"] * 10 * 0.3 +
            df["water"] / 100 * 0.3
        ).mean()

    insights = []

    #  Sleep
  
    if "sleep" in df.columns:
        if avg_sleep < 7:
            insights.append("⚠️ Sleep is below optimal (<7 hrs)")
        elif avg_sleep > 9:
            insights.append("😴 Oversleeping detected")
        else:
            insights.append("✅ Sleep is optimal")

  
    #  Water
    # ------------------------
    if "water" in df.columns:
        if avg_water < 2000:
            insights.append("💧 Water intake is low (<2L)")
        elif avg_water > 4000:
            insights.append("🚰 Very high water intake")
        else:
            insights.append("✅ Hydration is good")

    # ------------------------
    # 🏃 Workout
    # ------------------------
    if "workout" in df.columns:
        if avg_workout < 30:
            insights.append("🏃 Low workout duration")
        elif avg_workout > 120:
            insights.append("🔥 High workout duration — risk of fatigue")
        else:
            insights.append("✅ Workout duration is good")

    # ------------------------
    # 🔥 Calories
    # ------------------------
    if "calories" in df.columns:
        if avg_calories < 150:
            insights.append("🍽️ Low calorie burn (low activity)")
        elif avg_calories > 800:
            insights.append("🔥 Very high calorie burn — ensure recovery")
        else:
            insights.append("✅ Calorie burn is balanced")

    # ------------------------
    # 📊 Consistency
    # ------------------------
    if "workout" in df.columns:
        if consistency > avg_workout:
            insights.append("📉 Workout routine is inconsistent")
        else:
            insights.append("📊 Workout routine is consistent")

    # ------------------------
    # 📈 Trend
    # ------------------------
    if "workout" in df.columns and len(df) > 1:
        if df["workout"].iloc[-1] > df["workout"].iloc[0]:
            insights.append("📈 Workout trend is improving")
        else:
            insights.append("📉 Workout trend is declining")

    # ------------------------
    # 🧾 Final Output
    # ------------------------
    result = {
        "avg_sleep": round(avg_sleep, 2),
        "avg_water": round(avg_water, 2),
        "avg_calories": round(avg_calories, 2),
        "avg_workout": round(avg_workout, 2),
        "fitness_score": round(fitness_score, 2),
        "consistency": round(consistency, 2),
        "insights": insights,
        "chart": chart_base64
    }

    print(json.dumps(result))


if __name__ == "__main__":
    main()