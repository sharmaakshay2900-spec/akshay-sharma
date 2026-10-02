# Health-Analyzer: Intelligent Medical & Clinical Explorer

Health-Analyzer is a modern clinical intelligence and educational health analysis platform built with React, Vite, Express, Python Scikit-Learn Machine Learning, and Google Gemini AI.

---

## Architecture Overview (Zero-MongoDB)

In accordance with strict architectural requirements, **MongoDB and Mongoose have been completely eliminated**. Data and compute tiers are structured as follows:

1. **Static JSON Datasets (`frontend/src/data/` and `src/data/`)**:
   - `diseases.json`: Comprehensive disease profiles with symptoms, risk factors, doctor specialties, urgency levels, and clinical vs. plain English overviews.
   - `symptoms.json`: Systematic symptoms mapped to anatomical body regions (Head, Chest, Abdomen, Arms, Legs, Systemic).
   - `medicines.json`: Reference pharmacological catalog with mechanisms, common uses, warnings, and 3D visual geometry specifications.
   - `specialties.json` & `doctors.json`: Clinical specialty guidance and typical diagnostic procedures.
   - `aiims.json`, `hospitals.json`, `medicalCenters.json`: Educational reference registry of All India Institute of Medical Sciences (AIIMS) and premier Indian medical institutions.
   - `mcqs.json`: Over 100 clinical and health educational multiple-choice questions with answer rationales.

2. **Browser LocalStorage (`src/services/storageService.js`)**:
   - Manages simulated user authentication sessions (`health_analyzer_users`, `health_analyzer_current_user`).
   - Stores patient medical reports (`health_analyzer_reports`).
   - Persists symptom triage histories (`health_analyzer_symptom_history`).
   - Tracks educational MCQ quiz scores and completion stats (`health_analyzer_mcq_results`).

3. **Real Machine Learning Engine (`ml-service/`)**:
   - **Type**: Supervised Learning -> Multi-class Classification -> **Random Forest Classifier** (`n_estimators=100`, max_depth=15).
   - **Training Accuracy**: ~95.6% across 12 primary respiratory, cardiovascular, metabolic, gastrointestinal, infectious, and musculoskeletal conditions.
   - **Execution Pipeline**: React UI $\rightarrow$ Express $\rightarrow$ Python ML Process $\rightarrow$ Random Forest Model $\rightarrow$ Predicted Condition & Probabilities $\rightarrow$ Doctor Specialty Mapping $\rightarrow$ Urgency Rules $\rightarrow$ Gemini Clinical Explanation.

4. **Generative AI (`@google/genai`)**:
   - Powered server-side by `gemini-3.8-flash`.
   - AI Consult Chat with clinical triage prompts.
   - Multimodal Medical Image & Scan Analysis (X-rays, MRIs, rashes).
   - Automated Medical Report & Rx Clinical Draft synthesis.

---

## Application Modules & Features

- **Dashboard**: High-level clinical hub with quick access to all analytical utilities.
- **Symptom Disease Detector**: Multi-symptom input, anatomical filtering, Random Forest classification with live confidence distributions and Gemini educational guidance.
- **Human Anatomy Viewer (3D)**: Interactive anatomical system covering Head, Chest, Abdomen, Arms, and Legs.
- **Pill Viewer (3D)**: Interactive pharmaceutical visualizer rendering custom capsules and tablets with detailed pharmacology.
- **Medical Report & Rx Generator**: Full patient workup synthesis with vitals, diagnostic impressions, and printable reports.
- **Image & Scan Analysis**: Gemini Vision multimodal scanner for chest radiographs, MRIs, and skin lesions.
- **Disease Directory & Explainer**: Comprehensive browsing with "Plain English" vs. "Clinical" views and audio text-to-speech.
- **Saved Reports Manager**: Local management, search, and export of patient clinical reports.
- **AI Consult Chat**: Real-time interactive AI clinical assistant with safety triage guardrails.
- **MCQ Practice**: 100+ medical questions with category filters, score counters, and detailed rationale explanations.
- **AIIMS / Hospital Finder**: Search Indian healthcare institutions by city, state, specialty, and hospital type.
- **Admin Dashboard**: System telemetry, ML model metrics, active datasets count, and simulated user audit logs.

---

*Disclaimer: Health-Analyzer is an educational exploration tool. Information provided does not constitute personalized medical advice, diagnosis, or prescription.*
