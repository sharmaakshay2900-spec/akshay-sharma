import json
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

print("Loading dataset...")
df = pd.read_csv("ml-service/data/symptoms_dataset.csv")

feature_cols = [c for c in df.columns if c != "prognosis"]
X = df[feature_cols]
y = df["prognosis"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Training Random Forest Classifier on {len(X_train)} samples with {len(feature_cols)} features...")
rf = RandomForestClassifier(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1)
rf.fit(X_train, y_train)

y_pred = rf.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"Model Training Complete! Test Accuracy: {acc * 100:.2f}%\n")
print("Classification Report:")
print(classification_report(y_test, y_pred))

# Save model artifact
joblib.dump(rf, "ml-service/model/random_forest_model.joblib")

# Save feature and class metadata
with open("ml-service/model/features.json", "w", encoding="utf-8") as f:
    json.dump(feature_cols, f, indent=2)

with open("ml-service/model/classes.json", "w", encoding="utf-8") as f:
    json.dump(list(rf.classes_), f, indent=2)

print("Saved model artifacts to ml-service/model/ successfully.")
