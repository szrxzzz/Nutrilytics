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
MODEL_PATH = "backend/app/ml/model.pkl"
LR_MODEL_PATH = "backend/app/ml/lr_model.pkl"
model = None
lr_model = None
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
if os.path.exists(LR_MODEL_PATH):
    lr_model = joblib.load(LR_MODEL_PATH)

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
        
    # Save alert if risk detected
    if prediction != "Low Risk":
        alert = models.Alert(
            child_id=child_id or "unknown",
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
