import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier, IsolationForest
import os

# Create ml directory if it doesn't exist
os.makedirs("c:/AnganAI/backend/app/ml", exist_ok=True)
np.random.seed(42)

def generate_clinically_accurate_data(n_samples=2000):
    # 1. Base Demographics
    age_months = np.random.randint(6, 60, n_samples)
    gender = np.random.choice([0, 1], n_samples) # 0: Male, 1: Female

    # 2. WHO Growth Approximations (Mean values by age)
    # Weight (kg): roughly 3kg at birth + 0.25kg per month
    expected_weight = 3.0 + (age_months * 0.25)
    # Height (cm): roughly 50cm at birth + 1cm per month
    expected_height = 50.0 + (age_months * 1.0)
    
    # 3. Simulate Malnutrition Distributions (India approx: 15% SAM/MAM, 85% Normal)
    health_status = np.random.choice(['Normal', 'MAM', 'SAM'], n_samples, p=[0.80, 0.15, 0.05])
    
    weight = []
    height = []
    muac = []
    risk_level = []
    
    for i in range(n_samples):
        status = health_status[i]
        age = age_months[i]
        
        if status == 'Normal':
            w = expected_weight[i] + np.random.normal(0, 1.0)
            h = expected_height[i] + np.random.normal(0, 2.0)
            m = np.random.uniform(12.5, 15.0)
            r = 0 # Low Risk
        elif status == 'MAM': # Moderate Acute Malnutrition
            w = expected_weight[i] * 0.85 + np.random.normal(0, 0.5)
            h = expected_height[i] * 0.95 + np.random.normal(0, 1.0)
            m = np.random.uniform(11.5, 12.49)
            r = 1 # Medium Risk
        else: # SAM - Severe Acute Malnutrition
            w = expected_weight[i] * 0.70 + np.random.normal(0, 0.5)
            h = expected_height[i] * 0.90 + np.random.normal(0, 1.0)
            m = np.random.uniform(9.0, 11.49)
            r = 2 # High Risk
            
        weight.append(w)
        height.append(h)
        muac.append(m)
        risk_level.append(r)
        
    weight = np.array(weight)
    height = np.array(height)
    muac = np.array(muac)
    risk_level = np.array(risk_level)
    
    bmi = weight / ((height/100)**2)
    weight_delta = np.random.normal(0.5, 0.2, n_samples)
    height_delta = np.random.normal(1.0, 0.5, n_samples)
    
    # 4. Behavioral Data
    attendance_pct = np.zeros(n_samples)
    missed_vaccines = np.zeros(n_samples)
    
    for i in range(n_samples):
        if risk_level[i] == 2: # SAM kids often have poorer attendance/more missed vaccines due to illness/socioeconomic factors
            attendance_pct[i] = np.random.uniform(20, 65)
            missed_vaccines[i] = np.random.randint(1, 5)
        elif risk_level[i] == 1:
            attendance_pct[i] = np.random.uniform(50, 85)
            missed_vaccines[i] = np.random.randint(0, 3)
        else:
            attendance_pct[i] = np.random.uniform(75, 100)
            missed_vaccines[i] = np.random.randint(0, 2)
            
    past_absence = 100 - attendance_pct
    parent_engagement = (attendance_pct / 10) + np.random.normal(0, 1, n_samples)
    parent_engagement = np.clip(parent_engagement, 1, 10)

    # Compile dataset
    df = pd.DataFrame({
        'age_months': age_months,
        'gender': gender,
        'weight': weight,
        'height': height,
        'muac': muac,
        'bmi': bmi,
        'weight_delta': weight_delta,
        'height_delta': height_delta,
        'attendance_pct': attendance_pct,
        'past_absence': past_absence,
        'missed_vaccines': missed_vaccines,
        'parent_engagement': parent_engagement,
        'risk_level': risk_level
    })
    
    return df

print("Generating clinically realistic synthetic dataset based on WHO approximations...")
df = generate_clinically_accurate_data(3000)

# ---------------------------------------------------------
# 1. Train Nutritional Risk Model (model.pkl)
# ---------------------------------------------------------
# Target mapping: 0 -> Low Risk, 1 -> Medium Risk, 2 -> High Risk
X_nutrition = df[['age_months', 'gender', 'weight', 'height', 'muac', 'bmi', 'weight_delta', 'height_delta', 'attendance_pct', 'missed_vaccines']]
# Note: we need to match the feature list expected in main.py for predict_risk
# In main.py, features are: age_months, gender, weight, height, muac, bmi, weight_delta, height_delta, attendance_pct, missed_vaccines, overdue_vaccines
df['overdue_vaccines'] = df['missed_vaccines'] # simplify
X_nutrition = df[['age_months', 'gender', 'weight', 'height', 'muac', 'bmi', 'weight_delta', 'height_delta', 'attendance_pct', 'missed_vaccines', 'overdue_vaccines']]
y_nutrition = df['risk_level'].map({0: "Low Risk", 1: "Medium Risk", 2: "High Risk"})

print("Training Nutritional Risk Model...")
nutrition_model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
nutrition_model.fit(X_nutrition, y_nutrition)
joblib.dump(nutrition_model, "c:/AnganAI/backend/app/ml/model.pkl")

# ---------------------------------------------------------
# 2. Train Attendance Dropout Model (attendance_model.pkl)
# ---------------------------------------------------------
X_attendance = df[['attendance_pct', 'past_absence', 'age_months', 'risk_level']]
dropout_target = []
for att in df['attendance_pct']:
    if att > 75: dropout_target.append(0) # Regular
    elif att > 50: dropout_target.append(1) # Irregular
    else: dropout_target.append(2) # High Dropout Risk
y_attendance = np.array(dropout_target)

print("Training Attendance Dropout Model...")
attendance_model = RandomForestClassifier(n_estimators=50, random_state=42)
attendance_model.fit(X_attendance, y_attendance)
joblib.dump(attendance_model, "c:/AnganAI/backend/app/ml/attendance_model.pkl")

# ---------------------------------------------------------
# 3. Train Vaccine Default Model (vaccine_model.pkl)
# ---------------------------------------------------------
X_vaccine = df[['missed_vaccines', 'attendance_pct', 'parent_engagement']]
vaccine_target = []
for mv, pe in zip(df['missed_vaccines'], df['parent_engagement']):
    if mv >= 2 or pe <= 4: vaccine_target.append(1) # Likely to miss
    else: vaccine_target.append(0) # Likely to complete
y_vaccine = np.array(vaccine_target)

print("Training Vaccine Default Model...")
vaccine_model = RandomForestClassifier(n_estimators=50, random_state=42)
vaccine_model.fit(X_vaccine, y_vaccine)
joblib.dump(vaccine_model, "c:/AnganAI/backend/app/ml/vaccine_model.pkl")

# ---------------------------------------------------------
# 4. Train Growth Anomaly Detection Model (anomaly_model.pkl)
# ---------------------------------------------------------
X_anomaly = df[['age_months', 'weight', 'height', 'weight_delta', 'height_delta']]

# Introduce some artificial extreme anomalies into the training set for IsolationForest to learn
X_anomaly_dirty = X_anomaly.copy()
X_anomaly_dirty.iloc[0, 1] = 80.0  # Impossible weight for infant
X_anomaly_dirty.iloc[1, 2] = 200.0 # Impossible height

print("Training Growth Anomaly Model...")
anomaly_model = IsolationForest(contamination=0.02, random_state=42)
anomaly_model.fit(X_anomaly_dirty)
joblib.dump(anomaly_model, "c:/AnganAI/backend/app/ml/anomaly_model.pkl")

# ---------------------------------------------------------
# 5. Train Linear Regression Forecast Model (lr_model.pkl)
# ---------------------------------------------------------
from sklearn.linear_model import LinearRegression
X_lr = df[['age_months', 'gender', 'weight', 'height']]
# Predict weight and height for NEXT month (simple approximation)
y_lr = pd.DataFrame({
    'next_weight': df['weight'] + df['weight_delta'],
    'next_height': df['height'] + df['height_delta']
})

print("Training Growth Forecast Model...")
lr_model = LinearRegression()
lr_model.fit(X_lr, y_lr)
joblib.dump(lr_model, "c:/AnganAI/backend/app/ml/lr_model.pkl")

print("All clinically guided models have been successfully trained and saved!")
