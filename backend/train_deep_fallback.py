import pandas as pd
import numpy as np
import os
import joblib
from sklearn.ensemble import RandomForestClassifier

def generate_deep_health_data(n_samples=2000):
    np.random.seed(42)
    
    age_months = np.random.randint(6, 60, n_samples)
    gender = np.random.choice([0, 1], n_samples)
    weight = np.random.uniform(5, 20, n_samples)
    height = np.random.uniform(60, 110, n_samples)
    muac = np.random.uniform(10, 16, n_samples)
    bmi = weight / ((height/100)**2)
    weight_delta = np.random.uniform(-0.5, 1.0, n_samples)
    height_delta = np.random.uniform(0.1, 1.5, n_samples)
    attendance_percentage = np.random.uniform(30, 100, n_samples)
    missed_vaccines = np.random.randint(0, 5, n_samples)
    parent_engagement_score = np.random.randint(1, 10, n_samples)
    previous_risk_score = np.random.randint(0, 3, n_samples)

    X = pd.DataFrame({
        'age_months': age_months,
        'gender': gender,
        'weight': weight,
        'height': height,
        'muac': muac,
        'bmi': bmi,
        'weight_delta': weight_delta,
        'height_delta': height_delta,
        'attendance_percentage': attendance_percentage,
        'missed_vaccines': missed_vaccines,
        'parent_engagement_score': parent_engagement_score,
        'previous_risk_score': previous_risk_score
    })

    y = []
    for i in range(n_samples):
        score = 0
        # Under-nutrition markers
        if bmi[i] < 14 or muac[i] < 11.5: 
            score += 3 # Critical risk
        
        # Over-nutrition / Anomaly markers
        if bmi[i] > 25: 
            score += 3 # Critical risk (Obesity/Data Error)
        
        if muac[i] > 18:
            score += 2 # High risk of data error
            
        if attendance_percentage[i] < 60: score += 1
        if missed_vaccines[i] > 1: score += 1
        if weight_delta[i] < 0: score += 1
        
        if score >= 3: y.append(2) # High Risk / Critical
        elif score >= 1: y.append(1) # Medium Risk
        else: y.append(0) # Low Risk
        
    return X, np.array(y)

def train_fallback():
    print("Generating data for fallback model...")
    X, y = generate_deep_health_data(3000)
    
    print("Training RandomForest fallback...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    save_path = "backend/app/ml/deep_health_model.pkl"
    joblib.dump(model, save_path)
    print(f"Fallback model saved to {save_path}")

if __name__ == "__main__":
    train_fallback()
