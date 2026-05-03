from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./nutrilytics.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String) # worker, supervisor
    centre_name = Column(String)

class Child(Base):
    __tablename__ = "children"
    id = Column(String, primary_key=True, index=True) # UUID or custom ID
    name = Column(String, index=True)
    dob = Column(Date)
    age_months = Column(Integer)
    gender = Column(String)
    parent_name = Column(String)
    parent_phone = Column(String)
    address = Column(String)
    centre_name = Column(String)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    growth_records = relationship("GrowthRecord", back_populates="child")
    attendance = relationship("AttendanceRecord", back_populates="child")
    vaccinations = relationship("VaccinationRecord", back_populates="child")

class GrowthRecord(Base):
    __tablename__ = "growth_records"
    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(String, ForeignKey("children.id"))
    date = Column(Date)
    weight = Column(Float)
    height = Column(Float)
    muac = Column(Float)
    notes = Column(String, nullable=True)

    child = relationship("Child", back_populates="growth_records")

class AttendanceRecord(Base):
    __tablename__ = "attendance_records"
    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(String, ForeignKey("children.id"))
    date = Column(Date)
    present = Column(Boolean)

    child = relationship("Child", back_populates="attendance")

class VaccinationRecord(Base):
    __tablename__ = "vaccination_records"
    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(String, ForeignKey("children.id"))
    vaccine_name = Column(String)
    due_date = Column(Date)
    completed_date = Column(Date, nullable=True)
    status = Column(String) # due, completed, upcoming

    child = relationship("Child", back_populates="vaccinations")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(String, ForeignKey("children.id"))
    parent_phone = Column(String)
    message = Column(String)
    status = Column(String) # queued, sent, failed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(String, ForeignKey("children.id"))
    alert_type = Column(String) # nutrition, vaccination, attendance
    severity = Column(String) # low, medium, high
    message = Column(String)
    source = Column(String) # model, rule
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    resolved = Column(Boolean, default=False)

def init_db():
    Base.metadata.create_all(bind=engine)
