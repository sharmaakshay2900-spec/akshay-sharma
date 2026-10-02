import csv
import random

# Features: 30 binary symptoms
features = [
    "fever", "cough", "fatigue", "headache", "sore_throat", 
    "runny_nose", "shortness_of_breath", "chest_pain", "body_ache", "nausea", 
    "vomiting", "diarrhea", "abdominal_pain", "heartburn", "joint_pain", 
    "joint_swelling", "skin_rash", "itching", "dizziness", "loss_of_smell", 
    "wheezing", "frequent_urination", "increased_thirst", "unexplained_weight_loss", "facial_pressure", 
    "chills", "palpitations", "swollen_legs", "numbness_in_hands", "blurred_vision"
]

disease_profiles = {
    "Common Cold": {
        "core": ["runny_nose", "sore_throat", "cough", "fatigue"],
        "occasional": ["headache", "chills", "body_ache"],
        "rare": ["fever", "dizziness"],
        "count": 80
    },
    "Influenza": {
        "core": ["fever", "cough", "fatigue", "body_ache", "chills", "headache"],
        "occasional": ["sore_throat", "runny_nose", "dizziness", "nausea"],
        "rare": ["shortness_of_breath", "vomiting"],
        "count": 80
    },
    "Sinusitis": {
        "core": ["facial_pressure", "headache", "runny_nose"],
        "occasional": ["sore_throat", "cough", "fatigue", "fever"],
        "rare": ["dizziness", "loss_of_smell"],
        "count": 75
    },
    "COVID-19": {
        "core": ["fever", "cough", "fatigue", "loss_of_smell", "body_ache"],
        "occasional": ["shortness_of_breath", "headache", "sore_throat", "chills", "diarrhea"],
        "rare": ["nausea", "chest_pain"],
        "count": 85
    },
    "Pneumonia": {
        "core": ["fever", "cough", "shortness_of_breath", "chest_pain", "chills"],
        "occasional": ["fatigue", "body_ache", "headache"],
        "rare": ["nausea", "vomiting", "dizziness"],
        "count": 80
    },
    "Bronchial Asthma": {
        "core": ["wheezing", "shortness_of_breath", "cough", "chest_pain"],
        "occasional": ["fatigue"],
        "rare": ["headache"],
        "count": 75
    },
    "Hypertension": {
        "core": ["headache", "dizziness", "blurred_vision"],
        "occasional": ["palpitations", "fatigue", "chest_pain"],
        "rare": ["numbness_in_hands", "swollen_legs"],
        "count": 70
    },
    "Type 2 Diabetes Mellitus": {
        "core": ["frequent_urination", "increased_thirst", "unexplained_weight_loss", "fatigue"],
        "occasional": ["blurred_vision", "numbness_in_hands", "dizziness", "itching"],
        "rare": ["nausea"],
        "count": 75
    },
    "Gastroesophageal Reflux Disease (GERD)": {
        "core": ["heartburn", "chest_pain", "nausea"],
        "occasional": ["abdominal_pain", "cough", "sore_throat"],
        "rare": ["vomiting"],
        "count": 75
    },
    "Migraine": {
        "core": ["headache", "nausea", "blurred_vision"],
        "occasional": ["vomiting", "dizziness", "fatigue"],
        "rare": ["palpitations"],
        "count": 75
    },
    "Rheumatoid Arthritis": {
        "core": ["joint_pain", "joint_swelling", "fatigue", "body_ache"],
        "occasional": ["numbness_in_hands", "swollen_legs"],
        "rare": ["fever"],
        "count": 70
    },
    "Dengue Fever": {
        "core": ["fever", "headache", "body_ache", "joint_pain", "skin_rash"],
        "occasional": ["nausea", "vomiting", "chills", "fatigue"],
        "rare": ["abdominal_pain", "dizziness"],
        "count": 80
    }
}

random.seed(42)

rows = []
for disease, config in disease_profiles.items():
    for _ in range(config["count"]):
        row = {f: 0 for f in features}
        
        # 85-98% chance of core symptoms present
        for s in config["core"]:
            if random.random() < 0.92:
                row[s] = 1
                
        # 30-50% chance of occasional symptoms
        for s in config.get("occasional", []):
            if random.random() < 0.45:
                row[s] = 1
                
        # 5-15% chance of rare symptoms
        for s in config.get("rare", []):
            if random.random() < 0.12:
                row[s] = 1
                
        # 1-2% random background noise
        for f in features:
            if row[f] == 0 and random.random() < 0.02:
                row[f] = 1
                
        row["prognosis"] = disease
        rows.append(row)

# Shuffle
random.shuffle(rows)

output_file = "ml-service/data/symptoms_dataset.csv"
with open(output_file, mode="w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=features + ["prognosis"])
    writer.writeheader()
    writer.writerows(rows)

print(f"Generated {len(rows)} samples in {output_file} across {len(disease_profiles)} conditions.")
