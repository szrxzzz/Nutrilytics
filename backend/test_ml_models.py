import requests
import json

BASE = "http://localhost:8000"

# Color codes for terminal
GREEN  = "\033[92m"
YELLOW = "\033[93m"
RED    = "\033[91m"
CYAN   = "\033[96m"
BOLD   = "\033[1m"
RESET  = "\033[0m"

def color_prediction(text):
    if "High" in text or "SAM" in text or "Miss" in text or "Dropout" in text or "Anomaly" in text:
        return f"{RED}{BOLD}{text}{RESET}"
    elif "Medium" in text or "Irregular" in text or "MAM" in text:
        return f"{YELLOW}{BOLD}{text}{RESET}"
    else:
        return f"{GREEN}{BOLD}{text}{RESET}"

def print_result(endpoint, result):
    print(f"\n  {CYAN}→ {endpoint}{RESET}")
    if "prediction" in result:
        print(f"    Prediction  : {color_prediction(str(result['prediction']))}")
    if "confidence" in result:
        print(f"    Confidence  : {BOLD}{result['confidence']}{RESET}")
    if "risk_label" in result:
        print(f"    Risk Label  : {color_prediction(result['risk_label'])}")
    if "risk_score" in result:
        print(f"    Risk Score  : {result['risk_score']:.2%}")
    if "expected_weight" in result:
        print(f"    Exp. Weight : {result['expected_weight']} kg")
    if "expected_height" in result:
        print(f"    Exp. Height : {result['expected_height']} cm")
    if "warning" in result and result["warning"]:
        print(f"    {YELLOW}⚠  Warning   : {result['warning']}{RESET}")
    if "recommendations" in result and result["recommendations"]:
        print(f"    Recommendations:")
        for r in result["recommendations"]:
            print(f"      • {r}")
    if "error" in result:
        print(f"    {RED}Error: {result['error']}{RESET}")

def run_test(label, features_nutri, features_attendance, features_vaccine, features_anomaly):
    print(f"\n{'='*65}")
    print(f"{BOLD}  TEST: {label}{RESET}")
    print(f"{'='*65}")

    # 1. Nutritional Risk
    r = requests.post(f"{BASE}/predict-risk", json={"features": features_nutri})
    print_result("/predict-risk", r.json())

    # 2. Growth Forecast
    r = requests.post(f"{BASE}/forecast-growth", json={"features": {
        "age_months": features_nutri["age_months"],
        "gender":     features_nutri["gender"],
        "weight":     features_nutri["weight"],
        "height":     features_nutri["height"]
    }})
    print_result("/forecast-growth", r.json())

    # 3. Attendance Dropout
    r = requests.post(f"{BASE}/predict-attendance-risk", json={"features": features_attendance})
    print_result("/predict-attendance-risk", r.json())

    # 4. Vaccine Default
    r = requests.post(f"{BASE}/predict-vaccine-default", json={"features": features_vaccine})
    print_result("/predict-vaccine-default", r.json())

    # 5. Growth Anomaly
    r = requests.post(f"{BASE}/detect-growth-anomaly", json={"features": features_anomaly})
    print_result("/detect-growth-anomaly", r.json())

    # 6. Nutrition Recommendation
    risk_resp = requests.post(f"{BASE}/predict-risk", json={"features": features_nutri}).json()
    r = requests.post(f"{BASE}/nutrition-recommendation", json={
        "risk_level": risk_resp.get("risk_label", "Low Risk"),
        "muac": features_nutri["muac"],
        "age_months": features_nutri["age_months"],
        "weight": features_nutri["weight"],
        "height": features_nutri["height"]
    })
    print_result("/nutrition-recommendation", r.json())

# ─────────────────────────────────────────────
# SCENARIO 1: HEALTHY CHILD (Low Risk Expected)
# ─────────────────────────────────────────────
run_test(
    label="SCENARIO 1 — Healthy 24-Month-Old Boy (LOW RISK Expected)",
    features_nutri={
        "age_months": 24, "gender": 0,
        "weight": 11.5, "height": 87.0, "muac": 15.0,
        "bmi": 11.5 / (0.87**2),
        "weight_delta": 0.4, "height_delta": 0.8,
        "attendance_pct": 95.0, "missed_vaccines": 0, "overdue_vaccines": 0
    },
    features_attendance={
        "attendance_pct": 95.0, "past_absence": 5.0,
        "age_months": 24, "risk_level": 0
    },
    features_vaccine={
        "missed_vaccines": 0, "attendance_pct": 95.0, "parent_engagement": 9
    },
    features_anomaly={
        "age_months": 24, "weight": 11.5, "height": 87.0,
        "weight_delta": 0.4, "height_delta": 0.8
    }
)

# ─────────────────────────────────────────────
# SCENARIO 2: MODERATE MALNUTRITION (Medium Risk Expected)
# ─────────────────────────────────────────────
run_test(
    label="SCENARIO 2 — 18-Month Girl with MAM (MEDIUM RISK Expected)",
    features_nutri={
        "age_months": 18, "gender": 1,
        "weight": 7.2, "height": 74.0, "muac": 12.2,
        "bmi": 7.2 / (0.74**2),
        "weight_delta": 0.1, "height_delta": 0.3,
        "attendance_pct": 65.0, "missed_vaccines": 1, "overdue_vaccines": 1
    },
    features_attendance={
        "attendance_pct": 65.0, "past_absence": 35.0,
        "age_months": 18, "risk_level": 1
    },
    features_vaccine={
        "missed_vaccines": 1, "attendance_pct": 65.0, "parent_engagement": 5
    },
    features_anomaly={
        "age_months": 18, "weight": 7.2, "height": 74.0,
        "weight_delta": 0.1, "height_delta": 0.3
    }
)

# ─────────────────────────────────────────────
# SCENARIO 3: SEVERE MALNUTRITION (High Risk Expected)
# ─────────────────────────────────────────────
run_test(
    label="SCENARIO 3 — 12-Month Boy with SAM (HIGH RISK Expected)",
    features_nutri={
        "age_months": 12, "gender": 0,
        "weight": 5.1, "height": 66.0, "muac": 10.8,
        "bmi": 5.1 / (0.66**2),
        "weight_delta": -0.3, "height_delta": 0.1,
        "attendance_pct": 30.0, "missed_vaccines": 3, "overdue_vaccines": 3
    },
    features_attendance={
        "attendance_pct": 30.0, "past_absence": 70.0,
        "age_months": 12, "risk_level": 2
    },
    features_vaccine={
        "missed_vaccines": 3, "attendance_pct": 30.0, "parent_engagement": 2
    },
    features_anomaly={
        "age_months": 12, "weight": 5.1, "height": 66.0,
        "weight_delta": -0.3, "height_delta": 0.1
    }
)

# ─────────────────────────────────────────────
# SCENARIO 4: DATA ENTRY ERROR (Anomaly Expected)
# ─────────────────────────────────────────────
run_test(
    label="SCENARIO 4 — Obvious Data Entry Error (ANOMALY Expected)",
    features_nutri={
        "age_months": 24, "gender": 0,
        "weight": 45.0, "height": 25.0, "muac": 14.0,
        "bmi": 45.0 / (0.25**2),
        "weight_delta": 0.4, "height_delta": 0.8,
        "attendance_pct": 80.0, "missed_vaccines": 0, "overdue_vaccines": 0
    },
    features_attendance={
        "attendance_pct": 80.0, "past_absence": 20.0,
        "age_months": 24, "risk_level": 0
    },
    features_vaccine={
        "missed_vaccines": 0, "attendance_pct": 80.0, "parent_engagement": 7
    },
    features_anomaly={
        "age_months": 24, "weight": 45.0, "height": 25.0,
        "weight_delta": 0.4, "height_delta": 0.8
    }
)

print(f"\n{'='*65}")
print(f"{GREEN}{BOLD}  All Tests Completed!{RESET}")
print(f"{'='*65}\n")
