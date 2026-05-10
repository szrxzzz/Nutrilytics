from app.models import SessionLocal, Child, GrowthRecord, Alert, init_db
import datetime
import random

def add_risk_children():
    init_db()
    db = SessionLocal()
    
    # Base names for the demo
    risk_profiles = [
        {"name": "Aman High-Risk", "risk": "high", "weight": 6.5, "height": 72.0, "muac": 11.2, "age": 18},
        {"name": "Priya Severe-Case", "risk": "high", "weight": 7.0, "height": 75.0, "muac": 10.8, "age": 24},
        {"name": "Suresh Normal", "risk": "low", "weight": 12.5, "height": 85.0, "muac": 13.5, "age": 24},
        {"name": "Kavita Healthy", "risk": "low", "weight": 14.0, "height": 90.0, "muac": 14.2, "age": 30},
        {"name": "Rahul Moderate", "risk": "medium", "weight": 9.5, "height": 82.0, "muac": 12.2, "age": 24}
    ]
    
    centres = ["Anganwadi Centre A", "Anganwadi Centre B"]
    
    start_id = db.query(Child).count() + 2001
    
    for i, profile in enumerate(risk_profiles):
        child_id = f"CH-{start_id + i}"
        
        # Add Child
        child = Child(
            id=child_id,
            name=profile["name"],
            dob=datetime.date.today() - datetime.timedelta(days=profile["age"] * 30),
            age_months=profile["age"],
            gender="Male" if "aman" in profile["name"].lower() or "suresh" in profile["name"].lower() or "rahul" in profile["name"].lower() else "Female",
            parent_name=f"Parent of {profile['name'].split()[0]}",
            parent_phone=f"+91{random.randint(7000000000, 9999999999)}",
            address="Demo Address, Street 1",
            centre_name=random.choice(centres),
            notes=f"Data added for {profile['risk']} risk demo"
        )
        db.add(child)
        
        # Add Growth Record (Metrics that trigger the risk)
        record = GrowthRecord(
            child_id=child_id,
            date=datetime.date.today(),
            weight=profile["weight"],
            height=profile["height"],
            muac=profile["muac"],
            notes="Current assessment"
        )
        db.add(record)
        
        # Manually add Alert if it's high or medium risk to ensure it shows up
        if profile["risk"] != "low":
            alert = Alert(
                child_id=child_id,
                alert_type="nutrition",
                severity=profile["risk"],
                message=f"Risk detected: {profile['risk'].capitalize()} nutrition risk based on MUAC/BMI.",
                source="Manual Entry",
                created_at=datetime.datetime.utcnow()
            )
            db.add(alert)
            
    db.commit()
    print(f"Successfully added 5 children with specific risk profiles.")
    db.close()

if __name__ == "__main__":
    add_risk_children()
