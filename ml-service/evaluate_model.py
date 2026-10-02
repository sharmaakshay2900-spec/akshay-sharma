import json
import joblib
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.model_selection import cross_val_score

def evaluate():
    print("Evaluating trained Random Forest model...")
    rf = joblib.load("ml-service/model/random_forest_model.joblib")
    df = pd.read_csv("ml-service/data/symptoms_dataset.csv")
    
    with open("ml-service/model/features.json", "r") as f:
        features = json.load(f)
        
    X = df[features]
    y = df["prognosis"]
    
    scores = cross_val_score(rf, X, y, cv=5, scoring='accuracy')
    print(f"5-Fold Cross Validation Accuracy: {scores.mean()*100:.2f}% (+/- {scores.std()*100:.2f}%)")
    
    y_pred = rf.predict(X)
    print("\nFull Dataset Metrics:")
    print(classification_report(y, y_pred))

if __name__ == "__main__":
    evaluate()
