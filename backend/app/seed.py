from sqlalchemy.orm import Session
from .models import SessionLocal, Child, GrowthRecord, User, VaccinationRecord, init_db
import datetime
import random

def seed_data():
    init_db()
    db = SessionLocal()
    
    # Create demo user
    admin_user = db.query(User).filter(User.username == "admin").first()
    if not admin_user:
        admin_user = User(
            username="admin", 
            password_hash="admin", # Hardcoded for demo/prototype
            role="supervisor", 
            centre_name="Regional HQ"
        )
        db.add(admin_user)
    
    worker_user = db.query(User).filter(User.username == "demo").first()
    if not worker_user:
        worker_user = User(
            username="demo", 
            password_hash="demo", 
            role="worker", 
            centre_name="Anganwadi Centre 1"
        )
        db.add(worker_user)
    
    # Random Indian names
    first_names = ["Aarav", "Diya", "Arjun", "Ananya", "Vihaan", "Saanvi", "Aditya", "Isha", "Reyansh", "Myra", "Kabir", "Aanya", "Vivaan", "Kiara", "Ayaan", "Navya", "Dhruv", "Pari", "Atharv", "Riya"]
    last_names = ["Kumar", "Sharma", "Patel", "Singh", "Reddy", "Gupta", "Verma", "Nair", "Joshi", "Desai", "Mehta", "Iyer", "Rao", "Pillai", "Khan", "Menon", "Bhat", "Shetty", "Kulkarni", "Naik"]
    
    centres = ["Anganwadi Centre 1", "Anganwadi Centre 2", "Anganwadi Centre 3"]
    
    # Generate children
    for i in range(25):
        child_id = f"CH-{1000 + i}"
        existing = db.query(Child).filter(Child.id == child_id).first()
        if not existing:
            first = random.choice(first_names)
            last = random.choice(last_names)
            dob = datetime.date(2020 + random.randint(0, 3), random.randint(1, 12), random.randint(1, 28))
            age_months = (datetime.date.today() - dob).days // 30
            
            child = Child(
                id=child_id,
                name=f"{first} {last}",
                dob=dob,
                age_months=age_months,
                gender="Male" if random.random() > 0.5 else "Female",
                parent_name=f"{random.choice(first_names)} {last}",
                parent_phone=f"+91{random.randint(7000000000, 9999999999)}",
                address=f"Village {random.randint(1, 10)}, District Area",
                centre_name=random.choice(centres),
                notes="Normal registration"
            )
            db.add(child)
            
            # Add historical growth records (6 months)
            for m in range(6):
                record_date = datetime.date.today() - datetime.timedelta(days=30 * m)
                base_weight = 10 + (age_months * 0.2)
                base_height = 70 + (age_months * 0.5)
                
                # Introduce some risks for demo
                is_at_risk = (i % 5 == 0) # 20% children at risk
                weight_variance = -1.5 if is_at_risk else random.uniform(-0.5, 0.5)
                
                record = GrowthRecord(
                    child_id=child_id,
                    date=record_date,
                    weight=base_weight + weight_variance,
                    height=base_height + random.uniform(-1, 1),
                    muac=12.5 + random.uniform(-0.5, 0.5),
                    notes="Baseline check" if m == 5 else "Periodic update"
                )
                db.add(record)
                
            # Add sample vaccinations
            vaccines = ["BCG", "OPV-1", "DPT-1", "Hepatitis B", "MR-1"]
            for v in vaccines:
                vacc_record = VaccinationRecord(
                    child_id=child_id,
                    vaccine_name=v,
                    due_date=dob + datetime.timedelta(days=random.randint(0, 365)),
                    status="completed" if random.random() > 0.3 else "due"
                )
                if vacc_record.status == "completed":
                    vacc_record.completed_date = vacc_record.due_date + datetime.timedelta(days=random.randint(0, 10))
                db.add(vacc_record)
                
    db.commit()
    db.close()
    print("Database seeded successfully")

if __name__ == "__main__":
    seed_data()
