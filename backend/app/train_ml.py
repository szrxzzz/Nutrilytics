import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LinearRegression
import joblib
import os

def generate_synthetic_data(n_samples=1000):
    np.random.seed(42)
    
    # Features
    age_months = np.random.randint(6, 60, n_samples)
    gender = np.random.choice([0, 1], n_samples) # 0: Male, 1: Female
    weight = 7 + (age_months * 0.25) + np.random.normal(0, 1, n_samples)
    height = 60 + (age_months * 0.6) + np.random.normal(0, 2, n_samples)
    muac = 13 + (age_months * 0.05) + np.random.normal(0, 0.5, n_samples)
    
    # Derived
    height_m = height / 100
    bmi = weight / (height_m ** 2)
    
    # Delta (simulated)
    weight_delta = np.random.normal(0.2, 0.1, n_samples)
    height_delta = np.random.normal(0.5, 0.2, n_samples)
    
    attendance_pct = np.random.uniform(50, 100, n_samples)
    missed_vaccines = np.random.randint(0, 5, n_samples)
    overdue_vaccines = np.random.randint(0, 3, n_samples)
    
    data = pd.DataFrame({
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
        'overdue_vaccines': overdue_vaccines,
        'next_weight': weight + weight_delta + np.random.normal(0.1, 0.05, n_samples),
        'next_height': height + height_delta + np.random.normal(0.2, 0.1, n_samples)
    })
    
    # Labeling Logic (Medically inspired heuristics)
    # Risk based on BMI and MUAC
    def assign_risk(row):
        score = 0
        if row['bmi'] < 14: score += 3
        elif row['bmi'] < 16: score += 1
        
        if row['muac'] < 11.5: score += 3
        elif row['muac'] < 12.5: score += 1
        
        if row['weight_delta'] < 0: score += 2
        if row['attendance_pct'] < 70: score += 1
        if row['overdue_vaccines'] > 0: score += 1
        
        if score >= 5: return 'High Risk'
        if score >= 2: return 'Medium Risk'
        return 'Low Risk'
    
    data['risk_class'] = data.apply(assign_risk, axis=1)
    return data

def train_model():
    print("Generating synthetic data...")
    df = generate_synthetic_data(2000)
    
    X_clf = df.drop(['risk_class', 'next_weight', 'next_height'], axis=1)
    y_clf = df['risk_class']
    
    print("Training RandomForest model...")
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_clf, y_clf)
    
    print("Training LinearRegression model...")
    X_reg = df[['age_months', 'gender', 'weight', 'height']]
    y_reg = df[['next_weight', 'next_height']]
    lr_model = LinearRegression()
    lr_model.fit(X_reg, y_reg)
    
    os.makedirs('backend/app/ml', exist_ok=True)
    joblib.dump(rf_model, 'backend/app/ml/model.pkl')
    joblib.dump(lr_model, 'backend/app/ml/lr_model.pkl')
    df.to_csv('backend/data/sample_training_data.csv', index=False)
    print("Models trained and saved to backend/app/ml/")

if __name__ == "__main__":
    os.makedirs('backend/data', exist_ok=True)
    train_model()
