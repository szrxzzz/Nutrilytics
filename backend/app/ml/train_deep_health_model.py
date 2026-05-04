import pandas as pd
import numpy as np
import os

# Create dummy data for training
def generate_deep_health_data(n_samples=1000):
    np.random.seed(42)
    
    # 12 Features
    age_months = np.random.randint(6, 60, n_samples)
    gender = np.random.choice([0, 1], n_samples) # 0: Male, 1: Female
    weight = np.random.uniform(5, 20, n_samples)
    height = np.random.uniform(60, 110, n_samples)
    muac = np.random.uniform(10, 16, n_samples)
    bmi = weight / ((height/100)**2)
    weight_delta = np.random.uniform(-0.5, 1.0, n_samples)
    height_delta = np.random.uniform(0.1, 1.5, n_samples)
    attendance_percentage = np.random.uniform(30, 100, n_samples)
    missed_vaccines = np.random.randint(0, 5, n_samples)
    parent_engagement_score = np.random.randint(1, 10, n_samples)
    previous_risk_score = np.random.randint(0, 3, n_samples) # 0: Low, 1: Med, 2: High

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

    # Heuristic labeling for multi-factor risk
    y = []
    for i in range(n_samples):
        score = 0
        if bmi[i] < 14 or muac[i] < 11.5: score += 2
        if attendance_percentage[i] < 60: score += 1
        if missed_vaccines[i] > 1: score += 1
        if weight_delta[i] < 0: score += 1
        
        if score >= 3: y.append(2) # High
        elif score >= 1: y.append(1) # Medium
        else: y.append(0) # Low
        
    return X, np.array(y)

# We wrap the import to avoid crashing if TF isn't installed yet
def train():
    try:
        import tensorflow as tf
        from tensorflow.keras import layers, Sequential
    except ImportError:
        print("TensorFlow not found. Please install it with 'pip install tensorflow'")
        return

    print("Generating data...")
    X, y = generate_deep_health_data(2000)

    print("Building Keras model...")
    model = Sequential([
        layers.Dense(32, activation='relu', input_shape=(12,)),
        layers.Dense(16, activation='relu'),
        layers.Dense(8, activation='relu'),
        layers.Dense(3, activation='softmax')
    ])

    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )

    print("Training model...")
    model.fit(X, y, epochs=25, batch_size=32, verbose=1)

    save_path = "backend/app/ml/deep_health_model.keras"
    os.makedirs("backend/app/ml", exist_ok=True)
    model.save(save_path)
    print(f"Model saved successfully to {save_path}")

if __name__ == "__main__":
    train()
