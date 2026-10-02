import fs from 'fs';
import path from 'path';

const mcqs = [
  {
    id: 1,
    category: "Cardiology",
    question: "What is the normal resting adult heart rate range in beats per minute (bpm)?",
    options: ["40-60 bpm", "60-100 bpm", "100-140 bpm", "120-160 bpm"],
    correctAnswer: 1,
    explanation: "A normal resting heart rate for healthy adults ranges from 60 to 100 beats per minute. Rates below 60 are termed bradycardia, while rates exceeding 100 are termed tachycardia."
  },
  {
    id: 2,
    category: "Cardiology",
    question: "Which blood vessel carries oxygenated blood from the lungs directly into the left atrium of the heart?",
    options: ["Superior vena cava", "Pulmonary artery", "Pulmonary veins", "Aorta"],
    correctAnswer: 2,
    explanation: "Pulmonary veins are the only veins in the postnatal human body that transport oxygen-rich blood, carrying it from the pulmonary capillary bed into the left atrium."
  },
  {
    id: 3,
    category: "Cardiology",
    question: "According to standard clinical guidelines, what blood pressure reading defines Stage 1 Hypertension?",
    options: ["110/70 mmHg", "120/80 mmHg", "130-139 / 80-89 mmHg", "160/100 mmHg"],
    correctAnswer: 2,
    explanation: "AHA/ACC guidelines define Stage 1 hypertension as systolic BP between 130–139 mmHg or diastolic BP between 80–89 mmHg."
  },
  {
    id: 4,
    category: "Cardiology",
    question: "The 'P wave' on a standard electrocardiogram (ECG) represents which cardiac physiological event?",
    options: ["Ventricular depolarization", "Atrial depolarization", "Ventricular repolarization", "Atrial repolarization"],
    correctAnswer: 1,
    explanation: "The P wave corresponds to the electrical wave of atrial depolarization spreading from the sinoatrial (SA) node across both atria."
  },
  {
    id: 5,
    category: "Cardiology",
    question: "Which anatomical structure is termed the primary physiological pacemaker of the human heart?",
    options: ["Atrioventricular (AV) node", "Bundle of His", "Sinoatrial (SA) node", "Purkinje fibers"],
    correctAnswer: 2,
    explanation: "The Sinoatrial (SA) node, situated in the upper wall of the right atrium, exhibits the highest spontaneous intrinsic rate of depolarization (60-100 bpm)."
  },
  {
    id: 6,
    category: "Cardiology",
    question: "What is the primary pathophysiology underlying acute myocardial infarction (heart attack)?",
    options: ["Infection of heart valves", "Rupture of atherosclerotic plaque leading to coronary thrombosis", "Dilatation of thoracic aorta", "Autoimmune destruction of pericardium"],
    correctAnswer: 1,
    explanation: "Most acute myocardial infarctions result from the rupture or erosion of a coronary atherosclerotic plaque, triggering immediate platelet aggregation and occlusive thrombus formation."
  },
  {
    id: 7,
    category: "Cardiology",
    question: "The first heart sound (S1, 'lub') is produced primarily by the closure of which valves?",
    options: ["Aortic and pulmonary valves", "Mitral and tricuspid (AV) valves", "Aortic and mitral valves", "Tricuspid and pulmonary valves"],
    correctAnswer: 1,
    explanation: "S1 marks the onset of ventricular systole caused by the sudden closure of the atrioventricular (mitral and tricuspid) valves."
  },
  {
    id: 8,
    category: "Cardiology",
    question: "Which cardiac biomarker is considered the gold standard for laboratory diagnosis of myocardial necrosis?",
    options: ["Alanine transaminase (ALT)", "Cardiac Troponin I or T", "Alkaline phosphatase", "Amylase"],
    correctAnswer: 1,
    explanation: "Cardiac Troponin I and T are highly sensitive and specific structural proteins released into the bloodstream upon myocardial cell necrosis."
  },
  {
    id: 9,
    category: "Pulmonology",
    question: "Which component of pulmonary surfactant prevents alveolar collapse (atelectasis) at the end of expiration?",
    options: ["Albumin", "Dipalmitoylphosphatidylcholine (DPPC)", "Hemoglobin", "Mucin glycoprotein"],
    correctAnswer: 1,
    explanation: "DPPC is the major phospholipid component of surfactant secreted by Type II pneumocytes that significantly reduces alveolar surface tension."
  },
  {
    id: 10,
    category: "Pulmonology",
    question: "What spirometric finding is hallmark of an obstructive lung defect such as Asthma or COPD?",
    options: ["Increased FEV1/FVC ratio (>0.85)", "Reduced FEV1/FVC ratio (<0.70)", "Increased forced vital capacity", "Normal peak expiratory flow"],
    correctAnswer: 1,
    explanation: "Airflow obstruction impairs expiratory velocity, resulting in an FEV1/FVC ratio reduced below 0.70 (or below the lower limit of normal)."
  },
  {
    id: 11,
    category: "Pulmonology",
    question: "In human respiration, where does the majority of oxygen-carbon dioxide gas exchange occur?",
    options: ["Trachea", "Terminal bronchioles", "Alveoli", "Segmental bronchi"],
    correctAnswer: 2,
    explanation: "The alveoli provide a massive surface area (~70-100 m²) with ultrathin alveolar-capillary membranes for passive gas diffusion."
  },
  {
    id: 12,
    category: "Pulmonology",
    question: "What is the principal respiratory drive stimulus in a healthy individual breathing room air?",
    options: ["Low arterial oxygen tension (PaO2)", "High arterial carbon dioxide tension (PaCO2)", "Elevated blood nitrogen levels", "Low blood glucose"],
    correctAnswer: 1,
    explanation: "Central chemoreceptors in the medulla oblongata are exquisitely sensitive to hypercapnia (elevated PaCO2 / lowered CSF pH), driving ventilation."
  },
  {
    id: 13,
    category: "Pulmonology",
    question: "Which type of pneumocyte in the lung alveoli is primarily responsible for gas diffusion across the blood-air barrier?",
    options: ["Type I pneumocyte", "Type II pneumocyte", "Clara / Club cells", "Goblet cells"],
    correctAnswer: 0,
    explanation: "Type I pneumocytes are extremely flattened squamoid epithelial cells that cover ~95% of the alveolar surface and facilitate rapid gas diffusion."
  },
  {
    id: 14,
    category: "Pulmonology",
    question: "A patient presents with sudden pleuritic chest pain, dyspnea, and hyperresonance with absent breath sounds over the right hemithorax. What is the most likely diagnosis?",
    options: ["Pulmonary edema", "Pneumothorax", "Pleural effusion", "Lobar consolidation"],
    correctAnswer: 1,
    explanation: "Pneumothorax (air in the pleural cavity) leads to lung collapse, producing hyperresonance on percussion and decreased or absent breath sounds on auscultation."
  },
  {
    id: 15,
    category: "Endocrinology",
    question: "Which specific cells in the islets of Langerhans of the pancreas synthesize and secrete insulin?",
    options: ["Alpha cells", "Beta cells", "Delta cells", "PP cells"],
    correctAnswer: 1,
    explanation: "Pancreatic beta cells comprise the majority of islet endocrine tissue and produce proinsulin, cleaved into mature insulin and C-peptide."
  },
  {
    id: 16,
    category: "Endocrinology",
    question: "What diagnostic laboratory test reflects the average blood glucose concentration over the preceding 2 to 3 months?",
    options: ["Oral glucose tolerance test 1-hour", "Glycated Hemoglobin (HbA1c)", "Urine ketone dipstick", "Fasting serum insulin"],
    correctAnswer: 1,
    explanation: "HbA1c measures the percentage of hemoglobin non-enzymatically bound to glucose, reflecting circulating glycemic control over the 120-day erythrocyte lifespan."
  },
  {
    id: 17,
    category: "Endocrinology",
    question: "Which hormone produced by the anterior pituitary gland stimulates the thyroid gland to secrete T3 and T4?",
    options: ["Thyrotropin-releasing hormone (TRH)", "Thyroid-stimulating hormone (TSH)", "Adrenocorticotropic hormone (ACTH)", "Prolactin"],
    correctAnswer: 1,
    explanation: "TSH (thyrotropin) is released by anterior pituitary thyrotrophs in response to hypothalamic TRH and triggers follicular thyroid hormone synthesis."
  },
  {
    id: 18,
    category: "Endocrinology",
    question: "Graves' disease is the most common cause of hyperthyroidism. What is its pathophysiological mechanism?",
    options: ["Iodine deficiency in drinking water", "Autoantibodies stimulating the TSH receptor (TSI)", "Destruction of thyroid gland by cytotoxic T-cells", "Pituitary adenoma secreting excess cortisol"],
    correctAnswer: 1,
    explanation: "Thyroid-stimulating immunoglobulins (TSI) bind to and activate the TSH receptor on thyroid follicular cells, leading to unregulated autonomous production of thyroid hormones."
  },
  {
    id: 19,
    category: "Endocrinology",
    question: "Which hormone regulates extracellular fluid calcium concentration by increasing bone resorption and renal calcium reabsorption?",
    options: ["Calcitonin", "Parathyroid Hormone (PTH)", "Aldosterone", "Vasopressin"],
    correctAnswer: 1,
    explanation: "PTH elevates serum calcium levels by stimulating osteoclastic bone resorption, increasing renal distal tubular calcium reabsorption, and activating vitamin D."
  },
  {
    id: 20,
    category: "Endocrinology",
    question: "Which layer of the adrenal cortex is responsible for synthesizing mineralocorticoids like aldosterone?",
    options: ["Zona glomerulosa", "Zona fasciculata", "Zona reticularis", "Adrenal medulla"],
    correctAnswer: 0,
    explanation: "The outermost layer of the adrenal cortex, the zona glomerulosa, produces aldosterone under the influence of angiotensin II and extracellular potassium."
  },
  {
    id: 21,
    category: "Neurology",
    question: "Which cranial nerve (CN) carries parasympathetic innervation to thoracic and abdominal viscera including the heart and gastrointestinal tract?",
    options: ["CN V (Trigeminal)", "CN VII (Facial)", "CN X (Vagus)", "CN XII (Hypoglossal)"],
    correctAnswer: 2,
    explanation: "Cranial Nerve X, the Vagus nerve, is the principal conduit of the cranial parasympathetic system, supplying the larynx, trachea, heart, stomach, and intestines."
  },
  {
    id: 22,
    category: "Neurology",
    question: "In the acute assessment of suspected ischemic stroke, what does the FAST acronym represent?",
    options: ["Fever, Airway, Sensation, Temperature", "Face drooping, Arm weakness, Speech difficulty, Time to call emergency", "Foot pain, Abdomen rigidity, Sleepiness, Tachypnea", "Focus, Alertness, Strength, Tone"],
    correctAnswer: 1,
    explanation: "FAST stands for Face drooping, Arm weakness, Speech difficulty, and Time to act/call emergency services, facilitating rapid prehospital stroke identification."
  },
  {
    id: 23,
    category: "Neurology",
    question: "What is the primary excitatory neurotransmitter in the mammalian central nervous system?",
    options: ["GABA", "Glycine", "Glutamate", "Dopamine"],
    correctAnswer: 2,
    explanation: "Glutamate is the predominant excitatory amino acid neurotransmitter in the brain and spinal cord, acting through NMDA, AMPA, and kainate receptors."
  },
  {
    id: 24,
    category: "Neurology",
    question: "Where is cerebrospinal fluid (CSF) primarily synthesized in the human brain?",
    options: ["Arachnoid granulations", "Choroid plexus", "Substantia nigra", "Corpus callosum"],
    correctAnswer: 1,
    explanation: "Choroid plexuses situated within the lateral, third, and fourth cerebral ventricles produce the majority of cerebrospinal fluid through active secretion and filtration."
  },
  {
    id: 25,
    category: "Neurology",
    question: "Loss of dopaminergic neurons in which brainstem region is the cardinal pathological hallmark of Parkinson's disease?",
    options: ["Locus coeruleus", "Substantia nigra pars compacta", "Nucleus accumbens", "Red nucleus"],
    correctAnswer: 1,
    explanation: "Degeneration of pigmented dopaminergic neurons in the substantia nigra pars compacta causes dopamine depletion in the striatum, producing tremor, rigidity, and bradykinesia."
  },
  {
    id: 26,
    category: "Neurology",
    question: "Which lobe of the cerebral cortex houses the primary visual cortex (Brodmann area 17)?",
    options: ["Frontal lobe", "Parietal lobe", "Temporal lobe", "Occipital lobe"],
    correctAnswer: 3,
    explanation: "The occipital lobe, specifically the calcarine sulcus cortex, processes retinotopic visual afferent inputs from the lateral geniculate nucleus."
  },
  {
    id: 27,
    category: "Gastroenterology",
    question: "Which digestive enzyme initiated in the stomach requires an acidic pH (hydrochloric acid) for its conversion from an inactive zymogen?",
    options: ["Trypsin", "Pepsin", "Amylase", "Lipase"],
    correctAnswer: 1,
    explanation: "Pepsinogen secreted by gastric chief cells is cleaved into active proteolytic pepsin in the presence of gastric acid (pH 1.5–2.5) secreted by parietal cells."
  },
  {
    id: 28,
    category: "Gastroenterology",
    question: "What anatomical duct conveys bile and pancreatic juice into the second part of the duodenum?",
    options: ["Cystic duct", "Hepatopancreatic ampulla (Ampulla of Vater)", "Thoracic duct", "Stensen's duct"],
    correctAnswer: 1,
    explanation: "The common bile duct and main pancreatic duct unite at the ampulla of Vater, regulated by the sphincter of Oddi, entering the duodenum."
  },
  {
    id: 29,
    category: "Gastroenterology",
    question: "Which bacterial pathogen is the most frequent etiologic agent of chronic active gastritis and peptic ulcer disease?",
    options: ["Escherichia coli", "Helicobacter pylori", "Clostridioides difficile", "Salmonella enterica"],
    correctAnswer: 1,
    explanation: "Helicobacter pylori colonizes the gastric antral mucosa, producing urease and inflammatory cytotoxins that compromise mucosal resistance to acid."
  },
  {
    id: 30,
    category: "Gastroenterology",
    question: "Where in the human alimentary canal does the primary absorption of Vitamin B12 and bile salts take place?",
    options: ["Duodenum", "Jejunum", "Terminal ileum", "Ascending colon"],
    correctAnswer: 2,
    explanation: "The terminal ileum contains specialized cubilin-amnionless receptors for intrinsic factor-cobalamin complexes as well as sodium-dependent bile acid transporters."
  },
  {
    id: 31,
    category: "Gastroenterology",
    question: "Which blood vessel delivers nutrient-rich deoxygenated venous blood from the intestines directly to the liver?",
    options: ["Hepatic artery", "Hepatic portal vein", "Inferior vena cava", "Renal vein"],
    correctAnswer: 1,
    explanation: "The hepatic portal vein, formed by the union of the superior mesenteric and splenic veins, channels ~75% of liver blood inflow containing absorbed nutrients."
  },
  {
    id: 32,
    category: "Nephrology",
    question: "What is the functional microscopic filtration unit of the human kidney?",
    options: ["Renal pelvis", "Nephron", "Major calyx", "Ureter"],
    correctAnswer: 1,
    explanation: "Each kidney contains approximately 1 million nephrons, consisting of a renal corpuscle (glomerulus and Bowman's capsule) and specialized tubular segments."
  },
  {
    id: 33,
    category: "Nephrology",
    question: "What normal glomerular filtration rate (GFR) value in mL/min/1.73m² indicates preserved kidney function in young healthy adults?",
    options: ["15-29", "30-59", "60-89", "≥ 90"],
    correctAnswer: 3,
    explanation: "A GFR of 90 mL/min/1.73m² or higher is considered normal or optimal renal function in healthy young adults."
  },
  {
    id: 34,
    category: "Nephrology",
    question: "Which hormone synthesized by the juxtaglomerular apparatus of the kidney initiates the renin-angiotensin-aldosterone cascade?",
    options: ["Erythropoietin", "Renin", "Calcitriol", "Antidiuretic hormone"],
    correctAnswer: 1,
    explanation: "Renin is an enzymatic hormone released in response to decreased renal perfusion pressure, sympathetic activation, or low sodium chloride delivery to the macula densa."
  },
  {
    id: 35,
    category: "Nephrology",
    question: "What is the most prevalent chemical composition of renal calculi (kidney stones) globally?",
    options: ["Calcium oxalate", "Uric acid", "Struvite (magnesium ammonium phosphate)", "Cystine"],
    correctAnswer: 0,
    explanation: "Calcium oxalate stones account for approximately 70-80% of all diagnosed kidney stone cases."
  },
  {
    id: 36,
    category: "Hematology",
    question: "Which formed element of blood is an anucleate cytoplasmic fragment derived from bone marrow megakaryocytes?",
    options: ["Neutrophil", "Erythrocyte", "Platelet (Thrombocyte)", "Lymphocyte"],
    correctAnswer: 2,
    explanation: "Platelets are disk-shaped cellular fragments shed from mature megakaryocytes, essential for primary hemostatic plug formation."
  },
  {
    id: 37,
    category: "Hematology",
    question: "Which blood group type is universally regarded as the universal red blood cell donor for emergency transfusions?",
    options: ["A positive", "AB positive", "O negative", "B negative"],
    correctAnswer: 2,
    explanation: "O negative red blood cells lack A, B, and Rh(D) surface antigens on their erythrocyte membranes, minimizing immediate immune-mediated hemolytic transfusion reactions."
  },
  {
    id: 38,
    category: "Hematology",
    question: "What type of nutritional anemia is characterized by a low mean corpuscular volume (MCV < 80 fL) and microcytic hypochromic red cells?",
    options: ["Pernicious anemia", "Folate deficiency anemia", "Iron deficiency anemia", "Aplastic anemia"],
    correctAnswer: 2,
    explanation: "Iron deficiency restricts heme synthesis, resulting in small (microcytic) and pale (hypochromic) erythrocytes with low serum ferritin."
  },
  {
    id: 39,
    category: "Immunology",
    question: "Which class of immunoglobulin is the only one capable of crossing the human placenta to confer passive immunity to the fetus?",
    options: ["IgA", "IgM", "IgE", "IgG"],
    correctAnswer: 3,
    explanation: "IgG antibodies bind to the neonatal Fc receptor (FcRn) on syncytiotrophoblasts, enabling active transplacental transfer during pregnancy."
  },
  {
    id: 40,
    category: "Immunology",
    question: "Which antibody is the predominant secretory isotype found in colostrum, saliva, tears, and gastrointestinal mucus?",
    options: ["IgA", "IgD", "IgE", "IgM"],
    correctAnswer: 0,
    explanation: "Dimeric Secretory IgA (sIgA) protects mucosal epithelial surfaces against pathogen adhesion and colonization."
  }
];

// Add questions 41 to 105 systematically across all medical disciplines
const additionalDisciplines = [
  {
    cat: "Pharmacology",
    items: [
      ["What is the primary mechanism of action of beta-blockers such as Atenolol or Metoprolol?", ["Stimulation of adrenergic alpha receptors", "Competitive antagonism of beta-1 adrenergic receptors reducing cardiac chronotropy and inotropy", "Direct activation of calcium ion channels", "Inhibition of bacterial protein synthesis"], 1, "Beta-1 blockers bind competitively to cardiac beta-1 receptors, decreasing heart rate, myocardial contractility, and cardiac output."],
      ["Which class of antimicrobial agents acts by inhibiting bacterial DNA gyrase (topoisomerase II)?", ["Fluoroquinolones (e.g. Ciprofloxacin)", "Macrolides (e.g. Azithromycin)", "Aminoglycosides (e.g. Gentamicin)", "Cephalosporins (e.g. Ceftriaxone)"], 0, "Fluoroquinolones inhibit bacterial DNA gyrase and topoisomerase IV, preventing DNA replication and transcription."],
      ["What serious adverse effect is classically associated with high-dose acute Paracetamol (Acetaminophen) toxicity?", ["Acute tubular necrosis only", "Severe hepatotoxicity and acute liver failure due to NAPQI accumulation", "Aplastic anemia", "Permanent visual blindness"], 1, "Excess acetaminophen saturates glucuronidation pathways, generating toxic NAPQI which depletes hepatic glutathione and triggers hepatocellular necrosis."],
      ["Aspirin exerts its antiplatelet and antithrombotic effects through the irreversible inhibition of which enzyme?", ["Phosphodiesterase", "Cyclooxygenase-1 (COX-1)", "Angiotensin converting enzyme", "HMG-CoA reductase"], 1, "Aspirin acetylates a serine residue in COX-1, permanently preventing platelet synthesis of thromboxane A2 for the lifetime of the platelet."],
      ["Which vitamin is administered as the standard specific antidote for Warfarin anticoagulant toxicity?", ["Vitamin C", "Vitamin K1 (Phytonadione)", "Vitamin D3", "Vitamin B12"], 1, "Warfarin inhibits vitamin K epoxide reductase; exogenous Vitamin K1 bypasses this blockade to restore coagulation factors II, VII, IX, and X."],
      ["What adverse effect commonly occurs with Angiotensin Converting Enzyme (ACE) inhibitors due to bradykinin accumulation?", ["Dry persistent cough", "Severe bradycardia", "Hypoglycemia", "Alopecia"], 0, "ACE degrades bradykinin; inhibition leads to bradykinin and substance P accumulation in the respiratory tract, triggering a chronic dry cough in 10-15% of patients."],
      ["Nitroglycerin provides rapid relief in stable angina pectoris primarily by which mechanism?", ["Peripheral venodilation reducing cardiac preload and myocardial oxygen demand", "Direct coronary vasoconstriction", "Increasing systemic vascular resistance", "Slowing electrical conduction through AV node"], 0, "Nitroglycerin is converted to nitric oxide, causing systemic venodilation that reduces venous return (preload) and myocardial wall tension."],
      ["Which broad-spectrum antibiotic class is contraindicated in children and pregnant women due to risk of teeth discoloration and bone growth inhibition?", ["Penicillins", "Tetracyclines", "Macrolides", "Carbapenems"], 1, "Tetracyclines chelate calcium ions, depositing in calcifying bones and unerupted teeth, causing permanent yellowish-brown staining and enamel hypoplasia."]
    ]
  },
  {
    cat: "Infectious Disease",
    items: [
      ["Which protozoan parasite causes the most severe and lethal form of human malaria, known as cerebral malaria?", ["Plasmodium vivax", "Plasmodium falciparum", "Plasmodium malariae", "Plasmodium ovale"], 1, "Plasmodium falciparum cytoadheres to microvascular endothelium via PfEMP1, sequestering parasitized red cells in brain capillaries."],
      ["What vector mosquito transmits Dengue, Chikungunya, and Zika viruses, characteristically biting during daytime hours?", ["Anopheles culicifacies", "Aedes aegypti", "Culex quinquefasciatus", "Mansonia uniformis"], 1, "Aedes aegypti mosquitoes are daytime feeders that breed in artificial clean freshwater containers near human dwellings."],
      ["Which bacterium causes pulmonary Tuberculosis and is identified in sputum smears by Ziehl-Neelsen (Acid-Fast) staining?", ["Streptococcus pneumoniae", "Mycobacterium tuberculosis", "Klebsiella pneumoniae", "Legionella pneumophila"], 1, "Mycobacterium tuberculosis has a high cell wall mycolic acid lipid content, rendering it resistant to conventional Gram staining and acid-fast."],
      ["In medical microbiology, what bacterial structure confers resistance against phagocytosis by host white blood cells?", ["Flagella", "Polysaccharide capsule", "Pili (fimbriae)", "Mesosomes"], 1, "The antiphagocytic polysaccharide capsule hides bacterial surface antigens and prevents complement deposition (e.g. S. pneumoniae, N. meningitidis)."],
      ["Which hepatitis virus infection is transmitted primarily via the fecal-oral route through contaminated drinking water?", ["Hepatitis B", "Hepatitis C", "Hepatitis A", "Hepatitis D"], 2, "Hepatitis A and Hepatitis E viruses are enterically transmitted non-enveloped RNA viruses causing acute, non-chronic viral hepatitis."],
      ["What is the standard recommended first-line post-exposure prophylaxis intervention immediately after an animal bite suspected of rabies?", ["Cauterizing the wound with alcohol", "Immediate vigorous washing of the bite wound with soap and running water for 15 minutes", "Immediate surgical suturing of the wound", "Covering the wound tightly with airtight bandage"], 1, "Immediate, thorough wound washing with soap and water removes the majority of rabies virions from the inoculation site before neural entry."],
      ["Which diagnostic serological marker is the first to appear in the bloodstream during acute Hepatitis B viral infection?", ["Hepatitis B surface antibody (anti-HBs)", "Hepatitis B surface antigen (HBsAg)", "Hepatitis B core antibody IgG (anti-HBc IgG)", "Hepatitis B e antibody (anti-HBe)"], 1, "HBsAg is detectable in serum 1 to 10 weeks after HBV exposure and signifies active viral replication."],
      ["Typhoid fever (enteric fever) is primarily diagnosed in the first week of clinical symptoms by which laboratory method?", ["Widal agglutination test", "Blood culture", "Stool microscopy for ova", "Chest X-ray"], 1, "Blood culture is the diagnostic gold standard for Salmonella Typhi, positive in 80–90% of patients during the first week of illness."]
    ]
  },
  {
    cat: "Rheumatology & Musculoskeletal",
    items: [
      ["Which crystalline compound deposits within joint synovial spaces to trigger acute attacks of podagra in Gout?", ["Calcium pyrophosphate dihydrate", "Monosodium urate (MSU)", "Cholesterol crystals", "Basic calcium phosphate"], 1, "Needle-shaped, negatively birefringent monosodium urate crystals precipitate in joints when serum uric acid exceeds physiological saturation (>6.8 mg/dL)."],
      ["What structural protein is the most abundant extracellular matrix protein found in human bones, tendons, and skin?", ["Elastin", "Keratin", "Collagen", "Actin"], 2, "Collagen accounts for roughly 30% of total bodily protein content, with Type I collagen predominant in bone, dermis, and tendons."],
      ["Which diagnostic imaging modality is the investigation of choice for evaluating acute soft-tissue injuries such as knee anterior cruciate ligament (ACL) tears?", ["Conventional plain Radiography (X-Ray)", "Magnetic Resonance Imaging (MRI)", "Bone Scintigraphy", "Computed Tomography without contrast"], 1, "MRI provides superior soft-tissue contrast resolution, clearly demonstrating ligamentous disruption, meniscal tears, and bone marrow edema."],
      ["What is the typical clinical manifestation of Osteoarthritis compared to Rheumatoid Arthritis regarding morning stiffness?", ["Stiffness lasts more than 2 hours", "Morning stiffness typically resolves within 30 minutes and worsens with joint use", "No stiffness at any time", "Symmetrical swelling of MCP joints"], 1, "Osteoarthritis features mechanical wear-and-tear pain exacerbated by weight-bearing with brief morning gel phenomenon (<30 minutes)."],
      ["The Heberden's nodes characteristically seen in advanced Osteoarthritis are located at which joints?", ["Metacarpophalangeal (MCP) joints", "Proximal interphalangeal (PIP) joints", "Distal interphalangeal (DIP) joints", "Wrist carpal joints"], 2, "Heberden's nodes are bony osteophytic enlargements located at the distal interphalangeal (DIP) joints of the fingers."]
    ]
  },
  {
    cat: "Dermatology",
    items: [
      ["Which epidermal layer in human skin contains actively proliferating, mitotically active keratinocyte stem cells?", ["Stratum corneum", "Stratum lucidum", "Stratum basale (germinativum)", "Stratum granulosum"], 2, "The Stratum basale is the deepest, single-cell layer of the epidermis resting on the basement membrane where keratinocytes divide and replenish outer layers."],
      ["What is the classical clinical presentation of chronic plaque Psoriasis?", ["Itchy vesicles on an erythematous base", "Well-demarcated erythematous plaques covered with silvery-white scales", "Targetoid concentric rings on palms", "Subcutaneous fluctuant nodules"], 1, "Psoriasis vulgaris presents with sharply demarcated salmon-pink plaques with micaceous silvery scales, characteristically over extensor surfaces (knees, elbows)."],
      ["The 'A-B-C-D-E' mnemonic used in clinical dermatology aids in the early detection of which dangerous skin malignancy?", ["Basal Cell Carcinoma", "Squamous Cell Carcinoma", "Malignant Melanoma", "Seborrheic Keratosis"], 2, "ABCDE stands for Asymmetry, Border irregularity, Color variegation, Diameter (>6mm), and Evolution/Enlargement, identifying malignant melanoma."],
      ["Which microorganism is the predominant commensal bacterium residing on human skin that plays a role in acne vulgaris pathogenesis?", ["Staphylococcus aureus", "Cutibacterium acnes", "Streptococcus pyogenes", "Pseudomonas aeruginosa"], 1, "Cutibacterium acnes proliferates in obstructed pilosebaceous units, metabolizing sebum into chemotactic fatty acids that stimulate local inflammation."]
    ]
  },
  {
    cat: "Nutrition, Public Health & First Aid",
    items: [
      ["According to basic life support (BLS) guidelines, what is the recommended adult chest compression-to-ventilation ratio for single rescuer CPR?", ["15 compressions to 2 breaths", "30 compressions to 2 breaths", "50 compressions to 5 breaths", "Continuous breaths without compression"], 1, "AHA CPR guidelines recommend a 30:2 ratio of high-quality chest compressions (at least 100-120 cpm, depth of 5-6 cm) to rescue breaths."],
      ["Deficiency of which water-soluble vitamin causes Scurvy, characterized by bleeding gums and impaired wound healing?", ["Vitamin B1 (Thiamine)", "Vitamin C (Ascorbic Acid)", "Vitamin B6 (Pyridoxine)", "Vitamin B3 (Niacin)"], 1, "Vitamin C is an indispensable cofactor for prolyl and lysyl hydroxylases necessary for stable collagen triple-helix cross-linking."],
      ["Deficiency of which fat-soluble vitamin in young children causes Rickets with skeletal deformities like bowlegs?", ["Vitamin A", "Vitamin D", "Vitamin E", "Vitamin K"], 1, "Vitamin D deficiency impairs intestinal calcium and phosphate absorption, leading to defective mineralization of growing epiphyseal growth plates in children."],
      ["Night blindness (nyctalopia) and Bitot's spots on conjunctiva are clinical signs of deficiency of which nutrient?", ["Vitamin A (Retinol)", "Vitamin B12", "Folic acid", "Zinc"], 0, "Vitamin A is essential for the synthesis of rhodopsin in retinal rod photoreceptor cells and for maintaining conjunctival mucosal integrity."],
      ["What is the primary electrolyte that determines extracellular fluid (ECF) osmolality and tonicity?", ["Potassium", "Sodium", "Calcium", "Magnesium"], 1, "Sodium (normal range 135–145 mEq/L) and its attendant anions (chloride, bicarbonate) account for >90% of total extracellular fluid osmotic pressure."],
      ["Which vitamin is routinely administered to all newborn infants shortly after birth to prevent hemorrhagic disease of the newborn?", ["Vitamin A", "Vitamin D", "Vitamin K", "Vitamin E"], 2, "Newborns have low hepatic stores and an immature sterile gut flora; intramuscular Vitamin K1 prevents early and late vitamin K deficiency bleeding (VKDB)."],
      ["What is the physiological role of the hormone Erythropoietin (EPO)?", ["Regulation of blood pressure", "Stimulation of bone marrow red blood cell (erythrocyte) production", "Enhancement of bone mineralization", "Facilitation of glucose entry into skeletal muscle"], 1, "Synthesized primarily by renal interstitial peritubular fibroblasts in response to tissue hypoxia, EPO stimulates erythroid precursor maturation."],
      ["What is the standard compression depth for high-quality adult CPR according to resuscitation guidelines?", ["At least 2 inches (5 cm) but no more than 2.4 inches (6 cm)", "At least 1 inch (2.5 cm)", "At least 3.5 inches (9 cm)", "Depth does not matter as long as rate is fast"], 0, "Current guidelines mandate a compression depth of at least 5 cm (2 inches) while avoiding excessive depths exceeding 6 cm to prevent thoracic trauma."]
    ]
  }
];

let currentId = 41;
for (const disc of additionalDisciplines) {
  for (const item of disc.items) {
    mcqs.push({
      id: currentId++,
      category: disc.cat,
      question: item[0],
      options: item[1],
      correctAnswer: item[2],
      explanation: item[3]
    });
  }
}

// Generate remaining questions to comfortably exceed 100 questions (e.g. 102 questions total)
const medicalBasics = [
  ["What is the standard anatomical term for the kneecap bone?", ["Femur", "Patella", "Tibia", "Fibula"], 1, "The patella is the large sesamoid bone situated within the quadriceps femoris tendon protecting the knee joint.", "Anatomy"],
  ["Which organ stores and concentrates bile produced by the liver prior to secretion into the duodenum?", ["Spleen", "Gallbladder", "Pancreas", "Stomach"], 1, "The gallbladder serves as the reservoir that concentrates hepatic bile up to 10-fold until cholecystokinin triggers contraction.", "Gastroenterology"],
  ["What is the medical term for low blood sugar concentration (<70 mg/dL)?", ["Hyperglycemia", "Hypoglycemia", "Glucosuria", "Ketonemia"], 1, "Hypoglycemia is defined as a serum glucose concentration below 70 mg/dL accompanied by neuroglycopenic and autonomic symptoms.", "Endocrinology"],
  ["Which blood vessel carries deoxygenated blood from the upper extremities and head into the right atrium?", ["Inferior vena cava", "Superior vena cava", "Azygos vein", "Subclavian artery"], 1, "The superior vena cava drains venous blood from the head, neck, upper limbs, and thorax into the right atrium.", "Cardiology"],
  ["What is the main function of red blood cells (erythrocytes)?", ["Fighting viral infections", "Clotting blood", "Carrying oxygen to bodily tissues via hemoglobin", "Synthesizing antibodies"], 2, "Biconcave red blood cells are densely packed with hemoglobin molecules specialized for reversible oxygen loading and delivery.", "Hematology"],
  ["Which organ produces the anticoagulant protein Heparin and plasma Albumin?", ["Spleen", "Kidney", "Liver", "Thymus"], 2, "The liver synthesizes almost all circulating plasma proteins, including albumin, fibrinogen, and prothrombin.", "Gastroenterology"],
  ["What type of joint is the human shoulder or hip joint categorized as?", ["Hinge joint", "Pivot joint", "Ball-and-socket joint", "Saddle joint"], 2, "Ball-and-socket (enarthrodial) joints permit multiaxial movement across sagittal, coronal, and transverse planes.", "Anatomy"],
  ["What is the normal oral body temperature in healthy humans in degrees Celsius?", ["35.0 °C", "37.0 °C (approx 98.6 °F)", "39.5 °C", "41.0 °C"], 1, "Core normothermia averages 37.0 °C (98.6 °F) with a normal diurnal variation of approximately ±0.5 °C.", "General Medicine"],
  ["What is the primary function of the lymphatic system?", ["Pumping arterial blood", "Returning interstitial fluid to venous blood and immune surveillance", "Filtering urea from urine", "Digesting starch"], 1, "Lymphatic capillaries absorb excess tissue fluid and transport lymph through lymphoid nodes for antigen presentation.", "Immunology"],
  ["What is the medical term for high blood potassium level (>5.0 mEq/L)?", ["Hypocalcemia", "Hyperkalemia", "Hypernatremia", "Hyponatremia"], 1, "Hyperkalemia represents an elevated serum potassium level that can induce life-threatening cardiac arrhythmias.", "Nephrology"],
  ["Which organelle is universally known as the powerhouse of eukaryotic cells generating ATP?", ["Endoplasmic reticulum", "Mitochondria", "Golgi apparatus", "Lysosome"], 1, "Mitochondria produce the majority of cellular adenosine triphosphate (ATP) via the tricarboxylic acid cycle and oxidative phosphorylation.", "General Science"],
  ["What is the primary role of platelets in hemostasis?", ["Engulfing pathogenic bacteria", "Forming the primary platelet plug at vascular injury sites", "Synthesizing albumin", "Transporting hormones"], 1, "Upon endothelial injury, platelets adhere to subendothelial von Willebrand factor, activate, and aggregate to form a mechanical plug.", "Hematology"],
  ["Which enzyme breaks down dietary starch into maltose and dextrins in the mouth?", ["Pepsin", "Salivary amylase (ptyalin)", "Trypsin", "Lactase"], 1, "Salivary alpha-amylase initiates carbohydrate digestion by hydrolyzing alpha-1,4-glycosidic bonds in amylose.", "Gastroenterology"],
  ["Which cranial nerve is responsible for the sense of smell?", ["Cranial Nerve I (Olfactory)", "Cranial Nerve II (Optic)", "Cranial Nerve VIII (Vestibulocochlear)", "Cranial Nerve VII (Facial)"], 0, "Cranial Nerve I transmits sensory olfactory signals from the nasal neuroepithelium across the cribriform plate to the olfactory bulb.", "Neurology"],
  ["Which hormone stimulates uterine contractions during labor and milk ejection during breastfeeding?", ["Prolactin", "Oxytocin", "Progesterone", "Estrogen"], 1, "Oxytocin, synthesized in the paraventricular nucleus of the hypothalamus and secreted by the posterior pituitary, stimulates myometrial and myoepithelial contractions.", "Endocrinology"],
  ["What is the medical term for inflammation of the liver parenchyma?", ["Nephritis", "Hepatitis", "Cholecystitis", "Pancreatitis"], 1, "Hepatitis denotes inflammatory destruction of hepatocytes caused by viruses, toxins, alcohol, or autoimmunity.", "Gastroenterology"],
  ["What is the standard unit of measurement for blood pressure in clinical medicine?", ["Pascals (Pa)", "Millimeters of mercury (mmHg)", "Atmospheres (atm)", "Torr only"], 1, "Blood pressure is universally calibrated and recorded in millimeters of mercury (mmHg) using sphygmomanometers.", "Cardiology"],
  ["Which mineral is essential for the synthesis of thyroid hormones T3 and T4?", ["Iron", "Zinc", "Iodine", "Copper"], 2, "Iodide ions transported into thyroid follicular cells via the NIS symporter are essential building blocks for thyroxine synthesis.", "Endocrinology"],
  ["Which type of white blood cell is typically elevated during allergic reactions and parasitic helminth infections?", ["Neutrophils", "Eosinophils", "Basophils only", "Monocytes"], 1, "Eosinophils release major basic protein and peroxidase against helminths and participate in allergic type I hypersensitivity.", "Immunology"],
  ["What is the legal and clinical threshold for acute bradycardia in an adult at rest?", ["Heart rate < 40 bpm", "Heart rate < 60 bpm", "Heart rate < 80 bpm", "Heart rate < 90 bpm"], 1, "Sinus bradycardia is clinically defined as a regular rhythm originating from the SA node with a rate slower than 60 beats per minute.", "Cardiology"],
  ["Which valve separates the left atrium from the left ventricle?", ["Tricuspid valve", "Mitral (Bicuspid) valve", "Aortic valve", "Pulmonic valve"], 1, "The mitral or bicuspid valve has two cusps regulating unidirectionally the flow of oxygenated blood from left atrium to left ventricle.", "Cardiology"],
  ["Which disease is characterized by progressive degeneration of articular cartilage and subchondral bone remodeling?", ["Osteoarthritis", "Osteoporosis", "Rickets", "Gout"], 0, "Osteoarthritis is a chronic biomechanical disease of synovial joints featuring progressive cartilage loss, osteophytes, and sclerosis.", "Rheumatology"],
  ["What is the primary cause of dental caries (tooth cavities)?", ["Genetic predisposition only", "Acid production by oral bacteria fermenting dietary carbohydrates", "Lack of dietary calcium", "High saliva production"], 1, "Streptococcus mutans ferments refined sugars into lactic acid, dropping oral pH below 5.5 and demineralizing enamel hydroxyapatite.", "Dentistry"],
  ["What diagnostic blood test measures the time it takes for blood plasma to clot via the extrinsic pathway?", ["Activated Partial Thromboplastin Time (aPTT)", "Prothrombin Time / INR (PT/INR)", "Bleeding Time", "Thrombin Time"], 1, "Prothrombin Time (PT) and International Normalized Ratio (INR) evaluate the extrinsic and common coagulation cascades (Factors VII, X, V, II, I).", "Hematology"],
  ["Which structure in the inner ear is directly responsible for converting sound vibrations into neural impulses for hearing?", ["Semicircular canals", "Organ of Corti (within the cochlea)", "Tympanic membrane", "Auditory tube"], 1, "Hair cells within the Organ of Corti in the cochlea bend against the tectorial membrane, depolarizing cochlear nerve fibers.", "ENT"],
  ["What is the predominant lipid class stored in human adipose tissue as long-term energy reserves?", ["Phospholipids", "Cholesterol esters", "Triglycerides (triacylglycerols)", "Free fatty acids"], 2, "Triglycerides stored within lipid droplets of adipocytes represent the most concentrated, water-free energy reservoir in the body.", "Metabolism"],
  ["Which infectious viral disease causes parotitis (painful swelling of the parotid salivary glands)?", ["Measles", "Mumps", "Rubella", "Varicella"], 1, "Mumps virus (a paramyxovirus) classically presents with tender unilateral or bilateral inflammation of parotid glands.", "Infectious Disease"],
  ["What is the term for a rapid, involuntary, and predictable motor response to a sensory stimulus?", ["Voluntary movement", "Reflex arc", "Tremor", "Tetany"], 1, "A reflex arc links a peripheral sensory receptor, afferent neuron, central synapse, efferent motor neuron, and effector muscle.", "Neurology"],
  ["Which vitamin is synthesized in human skin upon exposure to solar Ultraviolet B (UVB) radiation?", ["Vitamin A", "Vitamin D3 (Cholecalciferol)", "Vitamin E", "Vitamin K2"], 1, "UVB radiation fotochemically converts 7-dehydrocholesterol in epidermal keratinocytes into previtamin D3, isomerized to cholecalciferol.", "Dermatology"],
  ["What is the medical term for difficult or painful swallowing?", ["Dyspepsia", "Dysphagia", "Dyspnea", "Dysarthria"], 1, "Dysphagia denotes impaired transit of solids or liquids from the oral cavity to the stomach.", "Gastroenterology"],
  ["Which gland is located in the anterior neck below the Adam's apple and shaped like a butterfly?", ["Pituitary gland", "Thyroid gland", "Adrenal gland", "Parathyroid gland"], 1, "The thyroid gland consists of two lateral lobes joined by a central isthmus overlying the 2nd to 4th tracheal rings.", "Endocrinology"],
  ["What is the medical term for high red blood cell count or elevated hematocrit?", ["Anemia", "Polycythemia", "Leukopenia", "Thrombocytopenia"], 1, "Polycythemia (or erythrocytosis) denotes an elevated red blood cell mass or hematocrit above the normal reference range.", "Hematology"],
  ["Which neurotransmitter deficiency at neuromuscular junctions is the target of myasthenia gravis autoantibodies?", ["Acetylcholine (ACh) receptors", "Dopamine receptors", "GABA receptors", "Serotonin receptors"], 0, "Myasthenia gravis is mediated by autoantibodies against post-synaptic nicotinic acetylcholine receptors (AChR) on the motor endplate.", "Neurology"],
  ["What is the clinical definition of a fever (pyrexia) measured orally?", ["Core temperature ≥ 36.5 °C (97.7 °F)", "Core temperature ≥ 38.0 °C (100.4 °F)", "Core temperature ≥ 40.0 °C (104.0 °F)", "Core temperature ≥ 42.0 °C (107.6 °F)"], 1, "In general clinical practice, a body temperature of 38.0 °C (100.4 °F) or higher measured orally represents significant fever.", "General Medicine"],
  ["Which organ filters old and damaged erythrocytes from circulation and stores platelets?", ["Pancreas", "Spleen", "Gallbladder", "Thymus"], 1, "The splenic red pulp tests erythrocytes through cords of Billroth and endothelial slits, destroying non-deformable senescent cells.", "Hematology"],
  ["What is the primary clinical use of an Automated External Defibrillator (AED)?", ["To measure blood glucose levels", "To deliver a controlled electrical shock to treat ventricular fibrillation or pulseless VT", "To stimulate breathing mechanically", "To administer intravenous fluids"], 1, "An AED analyzes cardiac rhythm and, if a shockable rhythm (VF or pulseless VT) is detected, delivers an electric shock to restore sinus rhythm.", "Emergency Medicine"]
];

for (const q of medicalBasics) {
  mcqs.push({
    id: currentId++,
    category: q[4],
    question: q[0],
    options: q[1],
    correctAnswer: q[2],
    explanation: q[3]
  });
}

console.log(`Generated ${mcqs.length} MCQs.`);
fs.writeFileSync('./src/data/mcqs.json', JSON.stringify(mcqs, null, 2));
