import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier, IsolationForest
import os

os.makedirs("c:/AnganAI/backend/app/ml", exist_ok=True)

np.random.seed(42)
n_samples = 500
attendance_pct = np.random.uniform(30, 100, n_samples)
past_absence = 100 - attendance_pct
age_months = np.random.randint(6, 60, n_samples)
risk_level = np.random.choice([0, 1, 2], n_samples)

dropout_target = []
for att in attendance_pct:
    if att > 80: dropout_target.append(0)
    elif att > 50: dropout_target.append(1)
    else: dropout_target.append(2)

X_attendance = pd.DataFrame({
    'attendance_pct': attendance_pct,
    'past_absence': past_absence,
    'age_months': age_months,
    'risk_level': risk_level
})
y_attendance = np.array(dropout_target)

attendance_model = RandomForestClassifier(n_estimators=50, random_state=42)
attendance_model.fit(X_attendance, y_attendance)
joblib.dump(attendance_model, "c:/AnganAI/backend/app/ml/attendance_model.pkl")

missed_vaccines = np.random.randint(0, 5, n_samples)
parent_engagement = np.random.randint(1, 10, n_samples)

vaccine_target = []
for mv, pe in zip(missed_vaccines, parent_engagement):
    if mv > 1 or pe < 4: vaccine_target.append(1)
    else: vaccine_target.append(0)

X_vaccine = pd.DataFrame({
    'missed_vaccines': missed_vaccines,
    'attendance_pct': attendance_pct,
    'parent_engagement': parent_engagement
})
y_vaccine = np.array(vaccine_target)

vaccine_model = RandomForestClassifier(n_estimators=50, random_state=42)
vaccine_model.fit(X_vaccine, y_vaccine)
joblib.dump(vaccine_model, "c:/AnganAI/backend/app/ml/vaccine_model.pkl")

weight = np.random.normal(12, 3, n_samples)
height = np.random.normal(85, 10, n_samples)
weight_delta = np.random.normal(0.5, 0.2, n_samples)
height_delta = np.random.normal(1.0, 0.5, n_samples)

X_anomaly = pd.DataFrame({
    'age_months': age_months,
    'weight': weight,
    'height': height,
    'weight_delta': weight_delta,
    'height_delta': height_delta
})

anomaly_model = IsolationForest(contamination=0.05, random_state=42)
anomaly_model.fit(X_anomaly)
joblib.dump(anomaly_model, "c:/AnganAI/backend/app/ml/anomaly_model.pkl")

print("Models trained and saved successfully.")
