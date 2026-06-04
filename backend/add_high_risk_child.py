from app.models import SessionLocal
from app.models import Child, GrowthRecord, Alert
from datetime import date, timedelta
import random

db = SessionLocal()

# 1. Clean up the 'unknown' alerts from the previous bug
deleted_count = db.query(Alert).filter(Alert.child_id == 'unknown').delete()
db.commit()
print(f"Deleted {deleted_count} 'unknown' alerts.")

# 2. Add a specific HIGH RISK child
child_id = f"SAM-{random.randint(1000, 9999)}"
child = Child(
    id=child_id,
    name="Ravi Kumar (High Risk)",
    age_months=14,
    gender="Male",
    parent_name="Sita Devi",
    parent_phone="9876543210",
    address="Block C, Anganwadi Center 2"
)
db.add(child)

# We need at least 2 growth records so the AI can calculate the 'delta' (growth trend)
last_month = date.today() - timedelta(days=30)
db.add(GrowthRecord(
    child_id=child_id,
    date=last_month,
    weight=5.8,
    height=67.0,
    muac=11.2
))

db.add(GrowthRecord(
    child_id=child_id,
    date=date.today(),
    weight=5.1,  # Weight significantly dropped!
    height=67.0, # No height gain
    muac=10.5    # MUAC below 11.5cm = Severe Acute Malnutrition (SAM)
))

db.commit()
print(f"Added High Risk child: {child.name} ({child.id})")
