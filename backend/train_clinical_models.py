import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier, IsolationForest
import os

os.makedirs("c:/AnganAI/backend/app/ml", exist_ok=True)

np.random.seed(42)
n_samples = 2000

# Generate Base Demographics
age_months = np.random.randint(1, 60, n_samples)
gender = np.random.choice([0, 1], n_samples) # 0: Male, 1: Female

# Simulate WHO Growth Standards (Approximations)
# Normal Weight (kg)
normal_weight = np.where(gender == 0, 
                         3.3 + (0.35 * age_months), 
                         3.2 + (0.32 * age_months))

# Normal Height (cm)
normal_height = np.where(gender == 0,
                         50.0 + (1.5 * age_months),
                         49.0 + (1.4 * age_months))

# Normal MUAC (cm) - roughly 13.5 to 16 for healthy kids > 6 months
normal_muac = np.where(age_months >= 6, 14.5 + np.random.normal(0, 0.5, n_samples), 12.0)

# Introduce Malnutrition Distribution
# 70% Normal (Low Risk), 20% MAM (Medium Risk), 10% SAM (High Risk)
risk_categories = np.random.choice(["Low Risk", "Medium Risk", "High Risk"], n_samples, p=[0.7, 0.2, 0.1])

weight = np.zeros(n_samples)
height = np.zeros(n_samples)
muac = np.zeros(n_samples)

for i in range(n_samples):
    if risk_categories[i] == "Low Risk":
        weight[i] = normal_weight[i] + np.random.normal(0, 0.5)
        height[i] = normal_height[i] + np.random.normal(0, 2.0)
        muac[i] = normal_muac[i] if age_months[i] < 6 else np.random.uniform(12.5, 16.0)
    elif risk_categories[i] == "Medium Risk":
        # MAM: Moderate Acute Malnutrition
        weight[i] = normal_weight[i] * np.random.uniform(0.75, 0.85)
        height[i] = normal_height[i] * np.random.uniform(0.90, 0.95)
        muac[i] = normal_muac[i] if age_months[i] < 6 else np.random.uniform(11.5, 12.4)
    else:
        # SAM: Severe Acute Malnutrition
        weight[i] = normal_weight[i] * np.random.uniform(0.55, 0.70)
        height[i] = normal_height[i] * np.random.uniform(0.80, 0.88)
        muac[i] = normal_muac[i] if age_months[i] < 6 else np.random.uniform(9.0, 11.4)

# Calculate BMI
height_m = height / 100
bmi = weight / (height_m ** 2)

# Simulate past growth (deltas)
weight_delta = np.where(risk_categories == "High Risk", np.random.uniform(-0.5, 0.1, n_samples), np.random.uniform(0.1, 0.5, n_samples))
height_delta = np.where(risk_categories == "High Risk", np.random.uniform(0.0, 0.2, n_samples), np.random.uniform(0.3, 1.0, n_samples))

# Social/Behavioral features
attendance_pct = np.where(risk_categories == "Low Risk", np.random.uniform(80, 100, n_samples),
                          np.where(risk_categories == "Medium Risk", np.random.uniform(50, 85, n_samples),
                                   np.random.uniform(10, 60, n_samples)))
missed_vaccines = np.where(risk_categories == "Low Risk", np.random.randint(0, 1, n_samples),
                           np.random.randint(0, 4, n_samples))
overdue_vaccines = missed_vaccines

# 1. Nutritional Risk Model
X_nutri = pd.DataFrame({
    'age_months': age_months,
    'gender': gender,
    'weight': weight,
    'height': height,
    'muac': muac,
    'bmi': bmi,
    'weight_delta': weight_delta,
    'height_delta': height_delta,
    'attendance_pct': attendance_pct,
    'missed_vaccines': missed_vaccines,
    'overdue_vaccines': overdue_vaccines
})
y_nutri = risk_categories

nutri_model = RandomForestClassifier(n_estimators=100, max_depth=7, random_state=42)
nutri_model.fit(X_nutri, y_nutri)
joblib.dump(nutri_model, "c:/AnganAI/backend/app/ml/model.pkl")

# 2. Linear Regression (Forecast Growth) - Just train a simple LR for demonstration
from sklearn.linear_model import LinearRegression
X_lr = pd.DataFrame({'age_months': age_months, 'gender': gender, 'weight': weight, 'height': height})
y_lr = pd.DataFrame({'expected_weight': weight + weight_delta, 'expected_height': height + height_delta})
lr_model = LinearRegression()
lr_model.fit(X_lr, y_lr)
joblib.dump(lr_model, "c:/AnganAI/backend/app/ml/lr_model.pkl")

# 3. Attendance Dropout Model
# Inputs: attendance_pct, past_absence, age_months, risk_level
risk_level_encoded = np.where(risk_categories == "High Risk", 2, np.where(risk_categories == "Medium Risk", 1, 0))
X_attendance = pd.DataFrame({
    'attendance_pct': attendance_pct,
    'past_absence': 100 - attendance_pct,
    'age_months': age_months,
    'risk_level': risk_level_encoded
})
dropout_target = np.where(attendance_pct < 40, 2, np.where(attendance_pct < 75, 1, 0))
att_model = RandomForestClassifier(n_estimators=50, random_state=42)
att_model.fit(X_attendance, dropout_target)
joblib.dump(att_model, "c:/AnganAI/backend/app/ml/attendance_model.pkl")

# 4. Vaccine Default Model
parent_engagement = np.random.randint(1, 10, n_samples)
X_vaccine = pd.DataFrame({
    'missed_vaccines': missed_vaccines,
    'attendance_pct': attendance_pct,
    'parent_engagement': parent_engagement
})
vaccine_target = np.where((missed_vaccines > 1) | (parent_engagement < 4), 1, 0)
vac_model = RandomForestClassifier(n_estimators=50, random_state=42)
vac_model.fit(X_vaccine, vaccine_target)
joblib.dump(vac_model, "c:/AnganAI/backend/app/ml/vaccine_model.pkl")

# 5. Anomaly Detection
X_anomaly = pd.DataFrame({
    'age_months': age_months,
    'weight': weight,
    'height': height,
    'weight_delta': weight_delta,
    'height_delta': height_delta
})
# Inject strong anomalies to ensure Isolation Forest learns
X_anomaly.loc[0, ['weight', 'height']] = [50.0, 20.0]
X_anomaly.loc[1, ['weight', 'height']] = [1.0, 150.0]
anom_model = IsolationForest(contamination=0.02, random_state=42)
anom_model.fit(X_anomaly)
joblib.dump(anom_model, "c:/AnganAI/backend/app/ml/anomaly_model.pkl")

print("Clinically-inspired models generated successfully and saved to backend/app/ml/")
