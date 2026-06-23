from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models
import datetime
import joblib
import os
import pandas as pd
from . import models
import requests

app = FastAPI(title="Nutrilytics API")

# Load ML Model
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "ml", "model.pkl")
LR_MODEL_PATH = os.path.join(BASE_DIR, "ml", "lr_model.pkl")
ATTENDANCE_MODEL_PATH = os.path.join(BASE_DIR, "ml", "attendance_model.pkl")
VACCINE_MODEL_PATH = os.path.join(BASE_DIR, "ml", "vaccine_model.pkl")
ANOMALY_MODEL_PATH = os.path.join(BASE_DIR, "ml", "anomaly_model.pkl")
DEEP_MODEL_PATH = os.path.join(BASE_DIR, "ml", "deep_health_model.keras")
DEEP_FALLBACK_PATH = os.path.join(BASE_DIR, "ml", "deep_health_model.pkl")

model = None
lr_model = None
attendance_model = None
vaccine_model = None
anomaly_model = None
deep_model = None
is_deep_fallback = False

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
if os.path.exists(LR_MODEL_PATH):
    lr_model = joblib.load(LR_MODEL_PATH)
if os.path.exists(ATTENDANCE_MODEL_PATH):
    attendance_model = joblib.load(ATTENDANCE_MODEL_PATH)
if os.path.exists(VACCINE_MODEL_PATH):
    vaccine_model = joblib.load(VACCINE_MODEL_PATH)
if os.path.exists(ANOMALY_MODEL_PATH):
    anomaly_model = joblib.load(ANOMALY_MODEL_PATH)

# Load TensorFlow/Keras model (primary) or Scikit-Learn (fallback)
if os.path.exists(DEEP_MODEL_PATH):
    try:
        import tensorflow as tf
        import numpy as np
        deep_model = tf.keras.models.load_model(DEEP_MODEL_PATH)
        print("Deep Health Model (TensorFlow) loaded successfully.")
    except Exception as e:
        print(f"Error loading Deep Health Model: {e}")

if not deep_model and os.path.exists(DEEP_FALLBACK_PATH):
    try:
        deep_model = joblib.load(DEEP_FALLBACK_PATH)
        is_deep_fallback = True
        print("Deep Health Fallback Model (Scikit-Learn) loaded successfully.")
    except Exception as e:
        print(f"Error loading Deep Health Fallback Model: {e}")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DB on startup
@app.on_event("startup")
def on_startup():
    models.init_db()
    # Auto-seed database if empty (great for initial deployment)
    try:
        db = models.SessionLocal()
        user_count = db.query(models.User).count()
        if user_count == 0:
            print("Database is empty. Seeding sample data...")
            from .seed import seed_data
            seed_data()
        db.close()
    except Exception as e:
        print(f"Error seeding database on startup: {e}")

# Dependency
def get_db():
    db = models.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to Nutrilytics API"}

@app.post("/auth/login")
def login(username: str, password: str, role: str):
    # This is a basic demo auth. Replace with real hashing/tokens in production.
    if username == "admin" and password == "admin":
        return {"username": username, "role": "supervisor", "token": "fake-admin-token"}
    elif username == "demo" and password == "demo":
        return {"username": username, "role": role, "token": "fake-demo-token"}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/children")
def get_children(db: Session = Depends(get_db)):
    children = db.query(models.Child).all()
    return children

@app.post("/children")
def create_child(child: dict, db: Session = Depends(get_db)):
    # Convert string date to datetime
    if 'dob' in child:
        child['dob'] = datetime.datetime.strptime(child['dob'], '%Y-%m-%d').date()
    
    db_child = models.Child(**child)
    db.add(db_child)
    db.commit()
    db.refresh(db_child)
    return db_child

@app.get("/children/{child_id}")
def get_child(child_id: str, db: Session = Depends(get_db)):
    child = db.query(models.Child).filter(models.Child.id == child_id).first()
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")
    return child

@app.post("/growth-records")
def add_growth_record(record: dict, db: Session = Depends(get_db)):
    if 'date' in record:
        record['date'] = datetime.datetime.strptime(record['date'], '%Y-%m-%d').date()
    db_record = models.GrowthRecord(**record)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@app.post("/predict-risk")
def predict_risk(payload: dict, db: Session = Depends(get_db)):
    # Payload can be child_id or features
    child_id = payload.get("child_id")
    if child_id:
        child = db.query(models.Child).filter(models.Child.id == child_id).first()
        if not child:
            raise HTTPException(status_code=404, detail="Child not found")
        
        # Compute features from DB records
        latest_growth = db.query(models.GrowthRecord).filter(models.GrowthRecord.child_id == child_id).order_by(models.GrowthRecord.date.desc()).first()
        if not latest_growth:
            # Dummy values for missing data in MVP
            features = {
                'age_months': child.age_months,
                'gender': 0 if child.gender == "Male" else 1,
                'weight': 12.5,
                'height': 85.0,
                'muac': 13.5,
                'bmi': 12.5 / (0.85 ** 2),
                'weight_delta': 0.2,
                'height_delta': 0.5,
                'attendance_pct': 85.0, 
                'missed_vaccines': 0,
                'overdue_vaccines': 0
            }
        else:
            prev_growth = db.query(models.GrowthRecord).filter(models.GrowthRecord.child_id == child_id).order_by(models.GrowthRecord.date.desc()).offset(1).first()
            
            # Calculate derived features
            height_m = latest_growth.height / 100
            bmi = latest_growth.weight / (height_m ** 2)
            weight_delta = latest_growth.weight - (prev_growth.weight if prev_growth else latest_growth.weight)
            height_delta = latest_growth.height - (prev_growth.height if prev_growth else latest_growth.height)
            
            features = {
                'age_months': child.age_months,
                'gender': 0 if child.gender == "Male" else 1,
                'weight': latest_growth.weight,
                'height': latest_growth.height,
                'muac': latest_growth.muac,
                'bmi': bmi,
                'weight_delta': weight_delta,
                'height_delta': height_delta,
                'attendance_pct': 85.0, 
                'missed_vaccines': 0,
                'overdue_vaccines': 0
            }
    else:
        features = payload.get("features")
    
    if not model:
        return {"error": "Model not loaded"}
        
    df = pd.DataFrame([features])
    prediction = model.predict(df)[0]
    probabilities = model.predict_proba(df)[0]
    score = float(max(probabilities))
    
    recommendation = "Normal monitoring"
    if prediction == "High Risk":
        recommendation = "Urgent nutrition follow-up within 7 days"
    elif prediction == "Medium Risk":
        recommendation = "Schedule nutrition counseling"
        
    # Save alert if risk detected and a specific child is being evaluated
    if child_id and prediction != "Low Risk":
        # Remove duplicate nutrition alerts for this child
        db.query(models.Alert).filter(models.Alert.child_id == child_id, models.Alert.alert_type == "nutrition").delete()
        
        alert = models.Alert(
            child_id=child_id,
            alert_type="nutrition",
            severity=prediction.split()[0].lower(),
            message=f"Nutrition risk: {prediction}",
            source="model"
        )
        db.add(alert)
        db.commit()
    
    return {
        "risk_label": prediction,
        "risk_score": score,
        "recommendation": recommendation,
        "features": features
    }

@app.post("/forecast-growth")
def forecast_growth(payload: dict, db: Session = Depends(get_db)):
    child_id = payload.get("child_id")
    if child_id:
        child = db.query(models.Child).filter(models.Child.id == child_id).first()
        if not child:
            raise HTTPException(status_code=404, detail="Child not found")
        
        latest_growth = db.query(models.GrowthRecord).filter(models.GrowthRecord.child_id == child_id).order_by(models.GrowthRecord.date.desc()).first()
        if not latest_growth:
            features = {
                'age_months': child.age_months,
                'gender': 0 if child.gender == "Male" else 1,
                'weight': 12.5,
                'height': 85.0,
            }
        else:
            features = {
                'age_months': child.age_months,
                'gender': 0 if child.gender == "Male" else 1,
                'weight': latest_growth.weight,
                'height': latest_growth.height,
            }
    else:
        features = payload.get("features")
    
    if not lr_model:
        return {"error": "Linear Regression model not loaded"}
        
    df = pd.DataFrame([features])
    prediction = lr_model.predict(df)[0]
    expected_weight, expected_height = prediction[0], prediction[1]
    
    # Warning if predicted growth is below expected trend (e.g. stagnant or losing weight)
    warning = None
    if expected_weight < features['weight']:
        warning = "Predicted growth shows weight loss or stagnation."
        
    return {
        "expected_weight": round(float(expected_weight), 2),
        "expected_height": round(float(expected_height), 2),
        "warning": warning
    }

@app.post("/evaluate-rules")
def evaluate_rules(payload: dict, db: Session = Depends(get_db)):
    child_id = payload.get("child_id")
    child = db.query(models.Child).filter(models.Child.id == child_id).first()
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")
        
    alerts = []
    
    # 1. Missing follow-up records
    latest_growth = db.query(models.GrowthRecord).filter(models.GrowthRecord.child_id == child_id).order_by(models.GrowthRecord.date.desc()).first()
    if not latest_growth or (datetime.date.today() - latest_growth.date).days > 30:
        alerts.append("Missing follow-up growth record (over 30 days).")
        
    # 2. Irregular Attendance
    attendance_pct = payload.get("attendance_pct", 65.0) # Dummy payload data or real
    if attendance_pct < 70.0:
        alerts.append("Irregular attendance detected (< 70%).")
        
    # 3. Vaccination Overdue
    overdue_vaccines = payload.get("overdue_vaccines", 1) # Dummy payload data or real
    if overdue_vaccines > 0:
        alerts.append(f"{overdue_vaccines} vaccination(s) overdue.")
        
    generated_alerts = []
    for msg in alerts:
        alert = models.Alert(
            child_id=child_id,
            alert_type="rule_based",
            severity="high" if "vaccination" in msg else "medium",
            message=msg,
            source="rules_engine"
        )
        db.add(alert)
        db.commit()
        db.refresh(alert)
        generated_alerts.append(alert)
    
    return {"alerts": [a.message for a in generated_alerts]}

@app.post("/predict-attendance-risk")
def predict_attendance_risk(payload: dict):
    if not attendance_model:
        return {"status": "error", "message": "Attendance model not loaded"}
    
    features = payload.get("features")
    if not features:
        return {"status": "error", "message": "No features provided"}
    
    df = pd.DataFrame([features])
    prediction = int(attendance_model.predict(df)[0])
    probs = attendance_model.predict_proba(df)[0]
    confidence = float(max(probs))
    
    labels = ["Regular", "Irregular", "High Dropout Risk"]
    return {
        "status": "success",
        "prediction": labels[prediction],
        "confidence": f"{confidence:.2%}",
        "recommendations": ["Incentivize attendance", "Home visit suggested"] if prediction > 0 else ["Continue monitoring"]
    }

@app.post("/predict-vaccine-default")
def predict_vaccine_default(payload: dict):
    if not vaccine_model:
        return {"status": "error", "message": "Vaccine model not loaded"}
    
    features = payload.get("features")
    if not features:
        return {"status": "error", "message": "No features provided"}
    
    df = pd.DataFrame([features])
    prediction = int(vaccine_model.predict(df)[0])
    probs = vaccine_model.predict_proba(df)[0]
    confidence = float(max(probs))
    
    labels = ["Likely to Complete", "Likely to Miss"]
    return {
        "status": "success",
        "prediction": labels[prediction],
        "confidence": f"{confidence:.2%}",
        "recommendations": ["Call parent", "Schedule immediate session"] if prediction == 1 else ["Monitor next date"]
    }

@app.post("/detect-growth-anomaly")
def detect_growth_anomaly(payload: dict):
    if not anomaly_model:
        return {"status": "error", "message": "Anomaly model not loaded"}
    
    features = payload.get("features")
    if not features:
        return {"status": "error", "message": "No features provided"}
    
    df = pd.DataFrame([features])
    # IsolationForest returns -1 for anomaly, 1 for normal
    prediction = int(anomaly_model.predict(df)[0])
    
    return {
        "status": "success",
        "prediction": "Anomaly Detected" if prediction == -1 else "Normal",
        "confidence": "N/A",
        "recommendations": ["Verify data entry", "Re-measure child"] if prediction == -1 else ["Data consistent"]
    }

@app.post("/nutrition-recommendation")
def nutrition_recommendation(payload: dict):
    risk_level = payload.get("risk_level", "Low Risk")
    muac = payload.get("muac", 13.5)
    age = payload.get("age_months", 24)
    
    # Compute detailed recommendations
    # Simple static rule‑based lists – can be expanded later
    # Foods are chosen to be locally available, affordable, and protein/iron rich
    protein_foods = ["Boiled eggs", "Milk", "Paneer", "Lentils (dal)", "Soybeans", "Groundnut chikki"]
    iron_foods = ["Spinach", "Green leafy vegetables", "Methi", "Beetroot", "Fortified flour", "Ragi porridge"]
    # Base recommendations per risk level
    if risk_level == "High Risk":
        recommended_foods = ["Ragi porridge", "Boiled eggs", "Banana", "Groundnut chikki", "Spinach", "Milk"]
        daily_plan = {
            "Breakfast": ["Ragi porridge", "Banana"],
            "Lunch": ["Rice", "Dal", "Spinach", "Milk"],
            "Evening": ["Groundnut chikki"],
            "Dinner": ["Rice", "Vegetable curry", "Milk"]
        }
        follow_up = "Reassessment within 7 days"
        parent_advice = "Your child may not be gaining enough weight. Include protein‑rich foods such as eggs, milk, and groundnuts regularly. Please visit the Anganwadi centre for a follow‑up check."
    elif risk_level == "Medium Risk":
        recommended_foods = ["Ragi porridge", "Lentils (dal)", "Seasonal fruits", "Green leafy veg", "Milk"]
        daily_plan = {
            "Breakfast": ["Ragi porridge", "Fruit"],
            "Lunch": ["Rice", "Dal", "Vegetables", "Milk"],
            "Evening": ["Fruit"],
            "Dinner": ["Rice", "Vegetable curry", "Milk"]
        }
        follow_up = "Follow‑up within 14 days"
        parent_advice = "Ensure balanced meals with protein sources like dal and milk. Monitor growth and visit the centre for routine check‑ups."
    else:
        # Low risk – maintain healthy diet
        recommended_foods = ["Balanced diet with cereals, pulses, vegetables, fruits, and dairy"]
        daily_plan = {
            "Breakfast": ["Whole grain cereal", "Milk"],
            "Lunch": ["Rice", "Dal", "Vegetables"],
            "Evening": ["Fruit"],
            "Dinner": ["Rice", "Vegetable curry", "Milk"]
        }
        follow_up = "Routine monitoring"
        parent_advice = "Continue providing a balanced, varied diet and attend regular growth monitoring sessions."

    # Combine generic lists for display
    recommendations = {
        "risk_level": risk_level,
        "recommended_foods": recommended_foods,
        "protein_foods": protein_foods,
        "iron_foods": iron_foods,
        "daily_meal_suggestions": daily_plan,
        "follow_up_priority": follow_up,
        "parent_advice": parent_advice
    }

    return {
        "status": "success",
        "prediction": risk_level,
        "recommendations": recommendations,
        "advisor_data": recommendations
    }

@app.post("/predict-deep-health-risk")
def predict_deep_health_risk(payload: dict):
    if not deep_model:
        return {
            "status": "error", 
            "message": "Deep Health Model (TensorFlow/Keras) not loaded. Please ensure tensorflow is installed and model is trained."
        }
    
    features = payload.get("features")
    if not features:
        return {"status": "error", "message": "No features provided"}
    
    try:
        import numpy as np
        # Ensure correct order of features for the neural network
        feat_list = [
            features.get('age_months', 0),
            features.get('gender', 0),
            features.get('weight', 0),
            features.get('height', 0),
            features.get('muac', 0),
            features.get('bmi', 0),
            features.get('weight_delta', 0),
            features.get('height_delta', 0),
            features.get('attendance_percentage', 0),
            features.get('missed_vaccines', 0),
            features.get('parent_engagement_score', 0),
            features.get('previous_risk_score', 0)
        ]
        
        input_data = np.array([feat_list])
        
        if is_deep_fallback:
            # Scikit-Learn prediction
            prediction_idx = int(deep_model.predict(input_data)[0])
            probs = deep_model.predict_proba(input_data)[0]
            confidence = float(probs[prediction_idx])
            model_type = "Scikit-Learn Random Forest (Fallback)"
        else:
            # TensorFlow prediction
            prediction_probs = deep_model.predict(input_data)
            prediction_idx = np.argmax(prediction_probs[0])
            confidence = float(prediction_probs[0][prediction_idx])
            model_type = "TensorFlow/Keras Neural Network"
        
        labels = ["Low Risk", "Medium Risk", "High Risk"]
        final_prediction = labels[prediction_idx]
        
        # Clinical Overrides (Safety Layer)
        muac = features.get('muac', 15)
        bmi = features.get('bmi', 18)
        
        if muac < 11.5:
            final_prediction = "High Risk"
        elif 11.5 <= muac < 12.5 and final_prediction == "Low Risk":
            final_prediction = "Medium Risk"
            
        if bmi > 35 or bmi < 12:
            final_prediction = "High Risk"

        recommendations = []
        if final_prediction == "High Risk":
            bmi = features.get('bmi', 0)
            if bmi > 25:
                recommendations = ["CRITICAL: Verify data entry (Weight/Height anomaly)", "Screen for childhood obesity"]
            else:
                recommendations = ["Immediate clinical audit", "Intensive nutrition intervention"]
        elif final_prediction == "Medium Risk":
            recommendations = ["Bi-weekly monitoring", "Parent counseling"]
            
        return {
            "status": "success",
            "model": model_type,
            "prediction": final_prediction,
            "confidence": round(confidence, 2),
            "recommendations": recommendations
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    return db.query(models.Alert).all()

@app.post("/send-sms")
def send_sms(payload: dict):
    phone = payload.get("phone")
    message = payload.get("message")
    if not phone or not message:
        return {"success": False, "error": "Phone and message required"}
    
    try:
        resp = requests.post('https://textbelt.com/text', {
            'phone': phone,
            'message': message,
            'key': 'textbelt',
        })
        data = resp.json()
        if data.get("success"):
            return {"success": True}
        else:
            return {"success": False, "error": data.get("error", "Unknown error")}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/sync")
def sync_records(payload: dict, db: Session = Depends(get_db)):
    # Helper for offline-first sync
    # payload contains tables e.g. {"children": [...], "growth": [...]}
    results = {"synced": 0, "errors": []}
    
    # Simple incremental sync logic
    for child in payload.get("children", []):
        try:
            if 'dob' in child and isinstance(child['dob'], str):
                child['dob'] = datetime.datetime.strptime(child['dob'], '%Y-%m-%d').date()
            db_child = models.Child(**child)
            db.merge(db_child)
            results["synced"] += 1
        except Exception as e:
            results["errors"].append(str(e))
            
    db.commit()
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
