from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# =========================
# Paths
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "model", "house_price_model.pkl")
FRONTEND_DIR = os.path.join(BASE_DIR, "..", "frontend", "dist")

# =========================
# Load ML Model
# =========================
try:
    model = joblib.load(MODEL_PATH)
    print("✅ Model loaded successfully")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

# =========================
# Serve Frontend (ROOT)
# =========================
@app.route("/", methods=["GET"])
def serve_frontend():
    return send_from_directory(FRONTEND_DIR, "index.html")

# =========================
# Serve Frontend Assets (CSS / JS)
# =========================
@app.route("/assets/<path:path>")
def serve_assets(path):
    return send_from_directory(os.path.join(FRONTEND_DIR, "assets"), path)

# =========================
# Health Check
# =========================
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None
    })

# =========================
# Prediction Endpoint
# =========================
@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid or missing JSON body"}), 400

    try:
        med_inc = float(data.get("median_income"))
        house_age = float(data.get("housing_median_age"))
        population = float(data.get("population"))
        latitude = float(data.get("latitude"))
        longitude = float(data.get("longitude"))

        rooms_per_household = float(data.get("rooms_per_household"))
        population_per_household = float(data.get("population_per_household"))
        bedrooms_per_room = float(data.get("bedrooms_per_room"))

        ave_bedrms = bedrooms_per_room * rooms_per_household

        features = pd.DataFrame([{
            "MedInc": med_inc,
            "HouseAge": house_age,
            "AveRooms": rooms_per_household,
            "AveBedrms": ave_bedrms,
            "Population": population,
            "AveOccup": population_per_household,
            "Latitude": latitude,
            "Longitude": longitude
        }])

        prediction_scaled = model.predict(features)[0]
        prediction_usd = float(prediction_scaled * 100000)

        return jsonify({
            "predicted_price": prediction_usd
        })

    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 400

# =========================
# App Runner (Hugging Face requires 7860)
# =========================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860)
