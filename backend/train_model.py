import pandas as pd
import numpy as np
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os

# Create model directory if it doesn't exist
if not os.path.exists('model'):
    os.makedirs('model')

print("Loading California Housing dataset...")
california = fetch_california_housing()
X = pd.DataFrame(california.data, columns=california.feature_names)
y = pd.Series(california.target, name='MedHouseVal')

# Feature Engineering to match frontend inputs
# The frontend computes:
# - rooms_per_household = total_rooms / households
# - bedrooms_per_room = total_bedrooms / total_rooms
# - population_per_household = population / households

# The dataset already has these base features:
# MedInc, HouseAge, AveRooms, AveBedrms, Population, AveOccup, Latitude, Longitude

# Note: The sklearn dataset features 'AveRooms', 'AveBedrms', 'AveOccup' are actually averages (per household).
# The frontend sends raw totals, but also computes the averages.
# Let's check what the model expects. 
# Sklearn features: ['MedInc', 'HouseAge', 'AveRooms', 'AveBedrms', 'Population', 'AveOccup', 'Latitude', 'Longitude']

# We need to map frontend inputs to these features.
# Frontend sends:
# longitude -> Longitude
# latitude -> Latitude
# housing_median_age -> HouseAge
# median_income -> MedInc
# population -> Population
# rooms_per_household -> AveRooms
# bedrooms_per_room -> (This is NOT in sklearn dataset directly, but AveBedrms is bedrooms per household)
# population_per_household -> AveOccup

# Wait, the Sklearn dataset 'AveBedrms' means average number of bedrooms per household.
# Frontend computes 'bedroomsPerRoom'.
# We should probably retrain the model or ensure features match.

# Let's inspect the sklearn features exactly.
# MedInc: Median income in block group
# HouseAge: Median house age in block group
# AveRooms: Average number of rooms per household
# AveBedrms: Average number of bedrooms per household
# Population: Block group population
# AveOccup: Average number of household members (population per household)
# Latitude: Block group latitude
# Longitude: Block group longitude

# Frontend computed features:
# roomsPerHousehold -> Matches AveRooms
# populationPerHousehold -> Matches AveOccup

# The frontend ALSO sends 'bedroomsPerRoom'. The sklearn model has 'AveBedrms' (Bedrooms per household).
# AveBedrms = bedroomsPerRoom * roomsPerHousehold.
# We can compute this in the backend API before inference.

print("Dataset loaded. Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training Random Forest Regressor...")
model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Model Trained. MSE: {mse:.4f}, R2: {r2:.4f}")

# Save the model
model_path = 'model/house_price_model.pkl'
joblib.dump(model, model_path)
print(f"Model saved to {model_path}")
