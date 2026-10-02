import sys
import json
import joblib
import pandas as pd
import numpy as np

def load_model():
    model = joblib.load("ml-service/model/random_forest_model.joblib")
    with open("ml-service/model/features.json", "r") as f:
        features = json.load(f)
    with open("ml-service/model/classes.json", "r") as f:
        classes = json.load(f)
    return model, features, classes

def predict_symptoms(symptoms_list):
    model, features, classes = load_model()
    
    # Normalize input symptom strings
    normalized_input = [s.strip().lower().replace(" ", "_").replace("-", "_") for s in symptoms_list]
    
    # Create input vector
    input_vector = np.zeros(len(features), dtype=int)
    matched_features = []
    
    for idx, feature in enumerate(features):
        feature_norm = feature.lower().replace(" ", "_").replace("-", "_")
        for sym in normalized_input:
            if sym in feature_norm or feature_norm in sym:
                input_vector[idx] = 1
                matched_features.append(feature)
                break
                
    # If no features directly matched, return gracefully
    if input_vector.sum() == 0:
        return {
            "success": False,
            "message": "No matching symptoms recognized in trained feature vocabulary.",
            "matched_features": [],
            "predictions": []
        }
        
    input_df = pd.DataFrame([input_vector], columns=features)
    probabilities = model.predict_proba(input_df)[0]
    
    # Top predictions sorted by probability
    ranked_indices = np.argsort(probabilities)[::-1]
    
    predictions = []
    for i in ranked_indices[:4]:
        prob = float(probabilities[i])
        if prob > 0.05:  # filter negligible probs
            predictions.append({
                "condition": classes[i],
                "confidence": round(prob * 100, 1),
                "probability": round(prob, 3)
            })
            
    # If top probability is low, ensure at least top 2 are returned
    if len(predictions) == 0:
        for i in ranked_indices[:2]:
            predictions.append({
                "condition": classes[i],
                "confidence": round(float(probabilities[i]) * 100, 1),
                "probability": round(float(probabilities[i]), 3)
            })

    return {
        "success": True,
        "matched_features": list(set(matched_features)),
        "predictions": predictions,
        "top_condition": predictions[0]["condition"] if predictions else None,
        "top_confidence": predictions[0]["confidence"] if predictions else 0
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # CLI usage: python3 ml-service/main.py '["fever", "cough", "fatigue"]'
        raw_input = sys.argv[1]
        try:
            parsed = json.loads(raw_input)
            result = predict_symptoms(parsed)
            print(json.dumps(result))
        except Exception as e:
            print(json.dumps({"success": False, "error": str(e)}))
    else:
        # Test run
        test_syms = ["fever", "cough", "shortness of breath", "chest pain"]
        res = predict_symptoms(test_syms)
        print("Test prediction for", test_syms)
        print(json.dumps(res, indent=2))
