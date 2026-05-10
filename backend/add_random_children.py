from app.models import SessionLocal, Child, GrowthRecord, VaccinationRecord, init_db
import datetime
import random

def add_random_children(count=15):
    init_db()
    db = SessionLocal()
    
    first_names = [
        "Aarav", "Diya", "Arjun", "Ananya", "Vihaan", "Saanvi", "Aditya", "Isha", 
        "Reyansh", "Myra", "Kabir", "Aanya", "Vivaan", "Kiara", "Ayaan", "Navya", 
        "Dhruv", "Pari", "Atharv", "Riya", "Ishaan", "Zoya", "Advait", "Kaira",
        "Aryan", "Anika", "Shaurya", "Shanaya", "Dev", "Zara"
    ]
    last_names = [
        "Kumar", "Sharma", "Patel", "Singh", "Reddy", "Gupta", "Verma", "Nair", 
        "Joshi", "Desai", "Mehta", "Iyer", "Rao", "Pillai", "Khan", "Menon", 
        "Bhat", "Shetty", "Kulkarni", "Naik", "Choudhury", "Das", "Banerjee", "Dutta"
    ]
    
    centres = ["Anganwadi Centre A", "Anganwadi Centre B", "Anganwadi Centre C"]
    
    start_id = db.query(Child).count() + 1001
    
    for i in range(count):
        child_id = f"CH-{start_id + i}"
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
            address=f"Street {random.randint(1, 50)}, Ward {random.randint(1, 20)}",
            centre_name=random.choice(centres),
            notes="Bulk added random data"
        )
        db.add(child)
        
        # Add a few growth records for each
        for m in range(3):
            record_date = datetime.date.today() - datetime.timedelta(days=30 * m)
            weight = 8 + (age_months * 0.25) + random.uniform(-0.5, 0.5)
            height = 65 + (age_months * 0.6) + random.uniform(-1, 1)
            
            record = GrowthRecord(
                child_id=child_id,
                date=record_date,
                weight=round(weight, 2),
                height=round(height, 2),
                muac=round(13.0 + random.uniform(-0.8, 0.8), 2),
                notes="Automatic entry"
            )
            db.add(record)
            
    db.commit()
    print(f"Successfully added {count} random children to the database.")
    db.close()

if __name__ == "__main__":
    add_random_children(15)
