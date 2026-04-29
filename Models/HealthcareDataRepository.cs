namespace HealthcareApp.Models;

public static class HealthcareDataRepository
{
    // ── Static pools ─────────────────────────────────────────────────────
    private static readonly string[] Nurses =
    [
        "Olivia Parker", "James Chen", "Maria Santos", "Robert Kim",
        "Sarah Johnson", "David Lee", "Aisha Williams", "Carlos Torres"
    ];

    private static readonly string[] VisitReasons =
    [
        "Blood pressure check & medication adjustment", "Cardiology follow-up",
        "Annual physical exam", "Neurology consult", "Post-ER follow-up",
        "Hypertensive episode evaluation", "Post-MRI assessment", "Fatigue workup review",
        "COPD exacerbation review", "HbA1c review", "GI panel results review",
        "CKD progression review", "Joint inflammation follow-up", "Lab results review",
        "Medication adjustment", "Specialist referral follow-up", "Pre-operative assessment",
        "Post-surgical check-up", "Chronic pain management", "Discharge follow-up"
    ];

    private static readonly string[] AppointmentReasons =
    [
        "Follow-up visit", "Consultation appointment", "Diagnostics review",
        "Lab results review", "Blood pressure follow-up", "Annual physical exam",
        "Imaging follow-up", "Lab panel results review", "CRP follow-up results",
        "Treatment plan discussion", "Post-visit follow-up", "Post-procedure assessment",
        "Treatment plan consultation", "Urgent evaluation", "Emergency visit"
    ];

    private static readonly string[] AlertTemplates =
    [
        "CRP elevated", "Blood pressure high", "Glucose levels elevated",
        "High cholesterol detected", "Oxygen saturation low",
        "Potassium level abnormal", "Heart rate irregular",
        "Creatinine elevated", "Temperature spike noted", "HbA1c above target",
        "Sodium level low", "INR out of range", "Respiratory rate elevated",
        "Hemoglobin low", "White cell count elevated", "BMI critical range",
        "Uric acid elevated"
    ];

    private static readonly string[] AlertSeverities = ["critical", "warning", "warning", "critical", "critical", "warning", "critical", "warning", "warning", "critical", "warning", "critical", "warning", "critical", "warning", "warning", "critical"];

    private static readonly string[] AlertTimes = ["2 min ago", "8 min ago", "15 min ago", "22 min ago", "30 min ago", "45 min ago", "1 hr ago", "1.5 hrs ago", "2 hrs ago", "2.5 hrs ago", "3 hrs ago", "4 hrs ago", "5 hrs ago", "6 hrs ago", "8 hrs ago", "10 hrs ago", "12 hrs ago"];

    private static readonly (string Drug, string Dose, string Freq, string Duration)[] MedPool =
    [
        ("Lisinopril",               "10 mg",            "Once daily",    "Ongoing"),
        ("Atorvastatin",             "20 mg",            "Once daily",    "Ongoing"),
        ("Metoprolol",               "25 mg",            "Twice daily",   "3 months"),
        ("Amlodipine",               "10 mg",            "Once daily",    "Ongoing"),
        ("Furosemide",               "40 mg",            "Once daily",    "Ongoing"),
        ("Metformin",                "1000 mg",          "Twice daily",   "Ongoing"),
        ("Omeprazole",               "20 mg",            "Once daily",    "8 weeks"),
        ("Prednisone",               "5 mg",             "Once daily",    "Taper 2 wk"),
        ("Topiramate",               "50 mg",            "Twice daily",   "6 months"),
        ("Losartan",                 "50 mg",            "Once daily",    "Ongoing"),
        ("Carvedilol",               "12.5 mg",          "Twice daily",   "6 months"),
        ("Glipizide",                "5 mg",             "Once daily",    "Ongoing"),
        ("Empagliflozin",            "10 mg",            "Once daily",    "6 months"),
        ("Warfarin",                 "5 mg",             "Once daily",    "Ongoing"),
        ("Heparin",                  "5000 U",           "Every 8 hrs",   "7 days"),
        ("Enoxaparin",               "40 mg",            "Once daily",    "10 days"),
        ("Vancomycin",               "1 g",              "Twice daily",   "14 days"),
        ("Piperacillin/Tazobactam",  "4.5 g",            "Every 8 hrs",   "10 days"),
        ("Norepinephrine",           "0.05 mcg/kg/min",  "Continuous IV", "Ongoing"),
        ("Levetiracetam",            "500 mg",           "Twice daily",   "Ongoing"),
        ("Carbidopa/Levodopa",       "25/100 mg",        "Three daily",   "Ongoing"),
        ("Acetaminophen",            "500 mg",           "PRN",           "2 weeks"),
        ("Ibuprofen",                "400 mg",           "PRN",           "2 weeks"),
        ("Cetirizine",               "10 mg",            "Once daily",    "Ongoing"),
    ];

    private static readonly string[] PatientNotes =
    [
        // P-1001 Emma Johnson — Acute respiratory failure, Critical
        "<p>Patient admitted via emergency department with acute respiratory failure secondary to bilateral pneumonia with superimposed sepsis. Oxygen saturation on arrival was 82% on room air. Patient was immediately placed on high-flow nasal cannula and subsequently intubated for airway protection. No prior history of chronic lung disease reported.</p><p>Currently sedated and mechanically ventilated on volume-assist control with FiO2 70%. Most recent ABG shows pH 7.31, PaCO2 52 mmHg, PaO2 68 mmHg. WBC elevated at 12.5 with a left shift. Creatinine trending upward at 2.1, suggesting early acute kidney injury. Known allergies to Penicillin and NSAIDs documented and flagged.</p><p>Broad-spectrum antibiotics initiated — Piperacillin/Tazobactam and Vancomycin per ID consult. Continuous hemodynamic monitoring in place. Daily sedation vacation and spontaneous breathing trials to be performed. Renal function monitored with possible nephrology consult if creatinine continues to rise.</p><p>Patient remains in critical condition. Family notified and updated on prognosis. Goals-of-care discussion documented. ICU attending Dr. Carter to review ventilator settings each morning. Weaning trial planned pending improvement in oxygenation parameters.</p>",

        // P-1002 Lucas Brown — Post-operative pain management, Monitoring
        "<p>Patient is a 32-year-old male, post-operative day 2 following an elective abdominal procedure under general anesthesia. Recovery has been uneventful. Patient is alert, oriented, and tolerating clear liquids without difficulty. Ambulating with nursing assistance twice daily.</p><p>Vital signs remain within expected post-operative range. Pain currently rated 4/10 at rest and 6/10 with movement, managed with scheduled acetaminophen and PRN low-dose opioids. Wound site clean, dry, and intact with no signs of infection or dehiscence. No fever or tachycardia. Bowel sounds present in all four quadrants.</p><p>Continue current pain management protocol and transition to oral analgesics as tolerated. Encourage deep breathing exercises and use of incentive spirometry hourly while awake. Physical therapy to begin supervised mobilization exercises tomorrow. Diet to be advanced to soft foods pending tolerance assessment.</p><p>Discharge planning initiated. Patient to be evaluated for fitness of discharge on post-operative day 3 or 4 pending pain control, oral intake, and ambulation milestones. Follow-up wound check scheduled for one week post-discharge. Patient counseled on activity restrictions and signs of post-operative complications to watch for at home.</p>",

        // P-1003 Olivia Davis — Complex cardiac surgery recovery, Monitoring
        "<p>Patient is a 67-year-old female with a history of triple-vessel coronary artery disease admitted for complex cardiac surgery. She underwent coronary artery bypass grafting (CABG) with three vessels bypassed four days ago. Surgery was technically successful per operative notes. Known allergy to Aspirin noted on chart.</p><p>Currently in the cardiac step-down unit. Hemodynamically stable on reduced vasopressor support. Troponin I remains elevated at 0.8 ng/mL, expected in the post-CABG context. BNP at 450 pg/mL indicating fluid overload; diuresis underway. D-Dimer mildly elevated — PE ruled out by CT pulmonary angiogram yesterday. No arrhythmias on telemetry over the past 24 hours.</p><p>Continue anticoagulation per cardiac surgery protocol. Daily chest X-ray to monitor for pleural effusion. Echocardiogram ordered to assess left ventricular function post-procedure. Cardiac rehabilitation team consulted — bedside exercises to begin tomorrow. Sternotomy incision healing appropriately with staples intact.</p><p>Cardiology follow-up with Dr. Pham in 1 week post-discharge. Patient and family educated on cardiac diet, medication adherence, and activity restrictions. Target discharge within 2–3 days provided hemodynamic and fluid status continue to improve. Social work involved for home care planning.</p>",

        // P-1004 James Wilson — Minor surgical procedure, Stable
        "<p>Patient is a 28-year-old male presenting for outpatient-to-inpatient observation following a minor surgical intervention. Procedure was performed under local anesthesia without complications. No significant past medical history. No known drug allergies.</p><p>Currently stable. Vital signs unremarkable. Pain well-controlled with scheduled oral analgesics rated 2/10. Wound is clean and dry with no signs of bleeding or infection. Patient is ambulatory, tolerating a regular diet, and voiding without difficulty. Lab work drawn post-procedure returned within normal limits.</p><p>Maintain current analgesic regimen and observation protocol. Patient encouraged to ambulate regularly. Continue monitoring surgical site every 4 hours. Morning discharge anticipated if overnight observation remains uneventful and patient meets all discharge criteria.</p><p>Patient instructed on wound care and activity restrictions prior to discharge. Follow-up appointment with outpatient surgical clinic scheduled in 5–7 days. Patient verbalized understanding of discharge instructions and symptoms warranting emergency return. No further interventions anticipated.</p>",

        // P-1005 Sophia Martinez — Septic shock, Critical
        "<p>Patient is a 55-year-old female admitted from triage in septic shock with a suspected intra-abdominal source. She presented with fever of 39.8°C, hypotension unresponsive to initial fluid resuscitation, tachycardia at 118 bpm, and altered mental status. Known allergies to Sulfa drugs and Codeine prominently documented.</p><p>Lactate markedly elevated at 4.2 mmol/L confirming tissue hypoperfusion. Procalcitonin 8.5 ng/mL consistent with severe bacterial infection. WBC 18.9 demonstrating significant leukocytosis. Blood cultures drawn — results pending. CT abdomen revealed perforated appendix with free intra-peritoneal air. Patient urgently taken to OR for emergency laparotomy.</p><p>Post-operatively admitted to ICU. Vasopressors initiated — Norepinephrine titrated for MAP greater than 65 mmHg. Broad-spectrum antibiotics continued per ID guidance, adjusted for sulfa allergy. Serial lactate measurements every 4 hours to assess resuscitation adequacy. Continuous cardiac monitoring and hourly urine output documentation in progress.</p><p>Patient remains critically ill. Designated family contact notified. Goals of care discussion held with next of kin. Intensivist Dr. Carter conducting twice-daily rounds. Repeat CT planned in 48 hours to evaluate post-operative abdominal cavity. ICU nursing staff monitoring closely for organ failure progression and secondary infection signs.</p>",

        // P-1006 Michael Anderson — Atrial fibrillation, Monitoring
        "<p>Patient is a 41-year-old male admitted with new-onset symptomatic atrial fibrillation with rapid ventricular response, presenting with palpitations, mild exertional dyspnea, and lightheadedness. No prior cardiac history documented. Allergy to ACE inhibitors on file.</p><p>INR at 2.3 — therapeutic anticoagulation in place with Warfarin. BNP mildly elevated at 220 pg/mL consistent with rate-related cardiac dysfunction. Creatinine 1.2 mg/dL within normal limits. 12-lead ECG confirms irregularly irregular rhythm without ST segment changes. Preliminary echocardiogram shows mildly reduced left ventricular ejection fraction at 50%.</p><p>Rate control achieved with titrated Metoprolol. Rhythm assessment ongoing — cardioversion considered pending TEE to rule out left atrial thrombus. INR to be maintained between 2.0–3.0. Cardiology follow-up with Dr. Lee scheduled. Patient educated on the importance of anticoagulation compliance and fall precautions.</p><p>Continuous telemetry monitoring in place. Cardiology to perform TEE within 48 hours if rate control is sustained. Anticoagulation continued — bleeding precautions reviewed with nursing staff. Patient expressed concerns about return to work — activity guidance provided. Discharge planning to begin once rhythm strategy is determined.</p>",

        // P-1007 Isabella Thompson — Fractured radius, Stable
        "<p>Patient is a 29-year-old female presenting to the emergency department after a fall onto an outstretched hand, sustaining a distal radius fracture of the right wrist. No neurovascular compromise on initial assessment. No known drug allergies. No prior fracture history reported.</p><p>X-ray confirms a non-displaced Colles' fracture. Neurovascular exam of the hand and fingers intact — capillary refill less than 2 seconds, sensation normal in all digits, range of motion at fingers preserved. Labs within normal limits. Calcium 9.4 mg/dL. Vitals stable throughout.</p><p>Fracture reduced under conscious sedation. Short arm plaster cast applied. Post-reduction X-ray confirms acceptable alignment. Patient instructed in cast care, elevation of limb to reduce swelling, and finger range-of-motion exercises. Pain managed with oral analgesics — ibuprofen avoided given fracture healing considerations.</p><p>Orthopedic clinic follow-up arranged for 1 week for repeat X-ray and cast evaluation. Patient counseled on warning signs of compartment syndrome — instructed to return to ED if experiencing increasing pain, numbness, or color changes. Expected full recovery with conservative management over 6–8 weeks. Fracture liaison nurse referral placed to assess bone health and falls risk.</p>",

        // P-1008 Daniel Garcia — Severe sepsis, Critical
        "<p>Patient is a 63-year-old male admitted to the ICU with severe sepsis secondary to a urinary tract infection progressing to urosepsis. He presented via ambulance in a confused, obtunded state with high fevers, rigors, and hypoxia. Known allergy to Penicillin documented on admission.</p><p>Lactate critically elevated at 5.1 mmol/L. WBC 19.2 with toxic granulation on differential. Creatinine 2.8 mg/dL indicating acute kidney injury stage 2. Urine cultures reveal gram-negative bacteremia — susceptibilities pending. Patient intubated for airway protection due to declining mental status.</p><p>Carbapenem-based antibiotic therapy initiated given Penicillin allergy. Vasopressor support with Norepinephrine ongoing. Nephrology consulted — CRRT considered if creatinine fails to trend down with resuscitation. IV fluid balance closely monitored. Foley catheter in situ for strict urine output monitoring. Sepsis bundle completed within first hour of recognition.</p><p>Patient critically ill — guarded prognosis discussed with family. Designated surrogate contact documented. ICU attending Dr. Carter reviewing daily. Serial lactate monitoring every 6 hours. Repeat blood and urine cultures in 48 hours to confirm response to antibiotics. Vasopressor weaning strategy to be implemented if MAP targets maintained for more than 6 consecutive hours.</p>",

        // P-1009 Mia Rodriguez — ACL reconstruction recovery, Monitoring
        "<p>Patient is a 38-year-old female, post-operative day 3 following elective anterior cruciate ligament (ACL) reconstruction of the right knee. Surgery performed arthroscopically without intraoperative complications. No known drug allergies. Patient is a recreational athlete with strong motivation for recovery.</p><p>CRP mildly elevated at 3.2 mg/L — expected post-surgical inflammatory response. Hemoglobin and WBC within normal range. Wound inspection reveals clean surgical incision with no signs of infection or hematoma. Right knee shows expected post-operative swelling, controlled with elevation and compression bandaging. Pain rated 3/10 at rest, 5/10 with movement. Cryotherapy applied 3 times daily.</p><p>Physical therapy commenced — quadriceps-setting and range-of-motion exercises initiated. Crutch ambulation with partial weight-bearing as tolerated. Analgesic regimen includes scheduled acetaminophen and PRN ibuprofen. DVT prophylaxis continued with daily aspirin given low-risk profile. Drain output minimal — drain removal planned for today.</p><p>Expected discharge tomorrow if pain and mobility milestones are met. Post-operative rehabilitation program outlined — outpatient physiotherapy to begin at 10 days. Full return to sporting activity anticipated at 9–12 months pending graft maturation and strength testing milestones. Patient provided written rehabilitation guide and emergency contact card for complications.</p>",

        // P-1010 Ethan Williams — Acute ischemic stroke, Critical
        "<p>Patient is a 52-year-old male presenting to the emergency department with sudden onset right-sided hemiplegia and expressive aphasia approximately 1 hour prior to arrival. CT head on arrival showed no hemorrhage. NIHSS score on presentation was 16 — moderate to severe stroke. Known allergies to Aspirin and NSAIDs documented prominently on chart.</p><p>MRI/DWI confirms acute left middle cerebral artery territory infarct. INR 2.1 — patient anticoagulated on admission. IV thrombolysis not administered given elevated INR. Interventional neurology performed mechanical thrombectomy with successful TICI 2b reperfusion achieved. BNP elevated at 310 pg/mL and creatinine 1.5 mg/dL — cardiology consult requested.</p><p>Patient transferred to neurological ICU for continuous monitoring. Permissive hypertension maintained per post-thrombectomy protocol. Aspirin allergy noted — alternative antiplatelet strategy to be discussed with pharmacy. Speech therapy, physiotherapy, and occupational therapy all consulted. Swallowing assessment pending prior to oral intake.</p><p>Prognosis guarded with moderate deficit expected. Family meeting held — goals of care documented. Neurological observations every hour including pupillary responses. Secondary prevention: cardiac monitoring for AF, fasting lipid panel, and echocardiogram ordered. Stroke nurse coordinator assigned to manage care pathway. Rehabilitation planning initiated.</p>",

        // P-1011 Charlotte Miller — COPD, Stable
        "<p>Patient is a 71-year-old female with a long-standing history of chronic obstructive pulmonary disease (COPD), admitted for optimization of her respiratory management and medication review. She reports increased sputum production and mild worsening of exercise tolerance over the past two weeks. Known allergy to Ibuprofen documented.</p><p>Oxygen saturation baseline 89% on room air — supplemental O2 at 2L/min initiated maintaining SpO2 at 92–94%. Hemoglobin mildly low at 11.9 g/dL, consistent with chronic disease anemia. Chest X-ray shows hyperinflation with no new infiltrates or consolidation. Pulmonary function tests confirm severe obstructive pattern.</p><p>Short-acting bronchodilator nebulizations initiated every 4 hours. Oral corticosteroid course prescribed for 5 days. Antibiotic therapy commenced given purulent sputum — avoiding ibuprofen per allergy record. Respiratory physiotherapy twice daily with airway clearance techniques. Pulmonologist Dr. Pham involved in management plan.</p><p>Patient stable and improving with current regimen. Discharge planning underway — home oxygen assessment requested. Pulmonary rehabilitation referral placed. Follow-up outpatient COPD clinic appointment in 4 weeks. Inhaler technique reviewed and corrected with respiratory nurse educator. Smoking cessation counseling reiterated (patient quit 10 years ago — benefits reinforced).</p>",

        // P-1012 Alexander Davis — Appendectomy recovery, Monitoring
        "<p>Patient is a 34-year-old male, post-operative day 1 following emergency laparoscopic appendectomy for acute uncomplicated appendicitis. Procedure was completed without complications. No known drug allergies. Patient is medically fit with no significant comorbidities.</p><p>Vital signs stable throughout. Temperature 37.3°C. WBC returning toward normal range at 6.0. CRP 2.0 mg/L. Hemoglobin 14.0 g/dL. Three laparoscopic port sites clean and dry. Bowel sounds present — patient passed flatus this morning, indicating GI recovery is progressing normally.</p><p>Oral diet resumed — tolerating clear fluids advancing to light foods without nausea. Pain managed effectively with oral paracetamol and PRN low-dose morphine — patient rates pain 2/10. No analgesic escalation required. Encouraging early mobilization — patient walking independently in corridor. Wound care instructions reviewed with patient.</p><p>Anticipated discharge tomorrow pending continued improvement. Outpatient follow-up in 1 week for wound review. Patient provided written wound care instructions, activity limitations for 2 weeks, and symptoms requiring urgent re-presentation. Expected full return to work in 2 weeks. Patient expressed satisfaction with care team and recovery progress.</p>",

        // P-1013 Layla Nguyen — Heart failure, Monitoring
        "<p>Patient is a 66-year-old female admitted with decompensated congestive heart failure presenting with worsening dyspnea on exertion, orthopnea requiring 3-pillow elevation, bilateral ankle edema, and a 4 kg weight gain in the past week. Known allergy to Iodine documented on admission.</p><p>BNP markedly elevated at 480 pg/mL confirming significant cardiac decompensation. Creatinine elevated at 1.8 mg/dL raising concern for cardiorenal syndrome — nephrology consult placed. Echocardiogram shows reduced ejection fraction of 32% (previously 38%), indicating disease progression. Chest X-ray confirms bilateral interstitial edema and cardiomegaly. Potassium 4.8 mEq/L borderline high, requiring close monitoring during diuresis.</p><p>IV Furosemide diuresis initiated — targeting daily urine output greater than 2L with net negative fluid balance. Daily weight monitoring at 6 AM. Strict fluid restriction to 1.5L per day. ACE inhibitor uptitrated; beta-blocker dose maintained. Telemetry monitoring in place for arrhythmia. Iodine allergy documented — avoiding iodinated contrast studies unless critically necessary.</p><p>Patient showing early response to diuretic therapy — 1.2 kg weight lost in 24 hours; breathlessness improving. Repeat BNP and renal panel ordered for tomorrow. Heart failure nurse specialist consulted for patient education. Cardiology follow-up appointment with Dr. Singh in 2 weeks. Discharge anticipated in 3–4 days once euvolemia achieved and oral diuretic regimen optimized.</p>",

        // P-1014 Noah Kim — Aortic aneurysm repair, Monitoring
        "<p>Patient is a 59-year-old male admitted post-endovascular aortic aneurysm repair (EVAR) for a 6.2 cm infrarenal abdominal aortic aneurysm detected on routine surveillance. Procedure performed 2 days ago via bilateral femoral approach without intraoperative complications. No known drug allergies.</p><p>INR 1.9 — currently on therapeutic anticoagulation per vascular surgery protocol. Hemoglobin mildly reduced at 12.2 g/dL — monitoring for endoleak-related blood loss. Creatinine 1.4 mg/dL mildly elevated — likely combination of contrast-induced nephropathy and operative stress. Bilateral groin access sites intact with no hematoma. Pedal pulses palpable bilaterally indicating adequate lower limb perfusion.</p><p>CT angiogram ordered for 30-day follow-up to assess stent graft position and exclude endoleak. Blood pressure management with target systolic less than 130 mmHg. Renal function monitored daily — fluid hydration continued. Activity restrictions in place: no heavy lifting or strenuous activity for 6 weeks. DVT prophylaxis continued as per protocol.</p><p>Patient recovering well. Pain at groin access sites manageable with oral analgesia. Dr. Lee satisfied with progress at ward round today. Patient educated on signs of late complications including sudden back or abdominal pain requiring immediate ED presentation. Outpatient vascular follow-up in 4 weeks. Discharge planned for tomorrow if vitals, ambulation, and renal function remain stable.</p>",

        // P-1015 Ava Thompson — Shoulder arthroscopy recovery, Stable
        "<p>Patient is a 47-year-old female, post-operative day 2 following elective right shoulder arthroscopy for rotator cuff repair and subacromial decompression. Surgery was completed successfully without complications. No known drug allergies and no significant past medical or surgical history.</p><p>Vital signs stable throughout recovery. Wound inspection: 2 arthroscopic portal sites clean and well-approximated with no signs of infection, hematoma, or wound breakdown. Right shoulder in sling with arm properly supported. Calcium and CBC labs within normal limits. Patient reports post-operative pain rated 3/10 at rest, controlled with scheduled paracetamol and intermittent ice pack application.</p><p>Shoulder immobilization in sling to continue for 4 weeks post-operatively. Passive range-of-motion exercises to begin in 5 days per physiotherapy plan. Pain adequate; PRN analgesia available. Patient instructed on sling application, arm positioning during sleep, and activity limitations. No driving, lifting, or overhead reaching permitted for 4 weeks.</p><p>Discharge planned for today. Physiotherapy outpatient appointments arranged to begin at 2 weeks. Orthopedic clinic follow-up with Dr. Pham at 6 weeks for wound review and functional assessment. Return to full activity and sport expected at 6 months post-operatively. Patient verbalized understanding of rehabilitation plan and recovery timeline.</p>",

        // P-1016 Liam Patel — Advanced Parkinson's disease, Stable
        "<p>Patient is a 68-year-old male admitted for optimization of his Parkinson's disease management following a fall at home resulting in a minor abrasion. Long-standing history of advanced Parkinson's disease with increasing motor fluctuations and dyskinesia. Known allergy to Metoclopramide — dopamine antagonist anti-emetics strictly avoided.</p><p>Neurological assessment confirms advancing Parkinson's with resting tremor, bradykinesia, and bilateral rigidity. Mild cognitive impairment noted. Current regimen of Carbidopa/Levodopa reviewed — timing of doses adjusted to minimize off-period duration. Falls risk score elevated — physiotherapy assessment completed with recommendations for walking frame and environmental modifications.</p><p>Dopaminergic medication administered at consistent timed intervals with critical importance reinforced to nursing staff. Physical and occupational therapy involved for mobility and activities of daily living assessment. Speech therapy consulted for swallowing assessment given dysphagia concerns. Metoclopramide allergy prominently flagged — domperidone used as alternative anti-emetic if required.</p><p>Patient and carer educated on fall prevention strategies and medication adherence. Neurology follow-up with Dr. Carter arranged in 4 weeks. Community occupational therapy assessment for home modifications ordered. Patient to remain in supervised ward for 48 hours post-fall. Discharge to home with carer support anticipated tomorrow. Deep brain stimulation candidacy to be discussed at outpatient review.</p>",

        // P-1017 Zoe Carter — Severe pneumonia, Critical
        "<p>Patient is a 72-year-old female admitted from a residential care facility with severe community-acquired pneumonia with respiratory failure. She presented with high fever of 40.1°C, productive cough with purulent sputum, SpO2 of 82%, and altered consciousness. Known allergies to Penicillin and Erythromycin documented — antibiotic selection adjusted accordingly.</p><p>WBC markedly elevated at 15.2 with left shift. Hemoglobin 10.5 reflecting chronic disease anemia. O2 saturation 84% on high-flow O2 at admission — improving to 92% with NIV. Chest X-ray shows bilateral consolidation predominantly in lower lobes. Sputum and blood cultures sent — results pending.</p><p>Non-invasive ventilation (BiPAP) in progress. Antibiotic therapy initiated with Levofloxacin — avoiding Penicillin and Macrolides per allergy profile. ID consult obtained for antibiotic stewardship guidance. IV fluid resuscitation underway with careful balance given cardiac comorbidity. Antipyretics administered. Respiratory physiotherapy initiated daily.</p><p>Patient remains in critical condition. Discussions with family regarding care goals and advance directives ongoing. ICU review completed by Dr. Singh — patient deemed appropriate for step-up to ICU if NIV fails. Repeat chest X-ray in 24 hours. Plan for extubation assessment if respiratory status improves over next 48 hours. Nursing facility informed of admission.</p>",

        // P-1018 Henry Parker — Kidney stones, Stable
        "<p>Patient is a 53-year-old male presenting to the emergency department with severe right-sided renal colic rated 9/10, hematuria, and nausea. CT KUB confirms a 6mm obstructing calculus in the right ureter at the ureterovesical junction. No prior urological history. No known drug allergies.</p><p>Vital signs stable. Afebrile. Urinalysis confirms hematuria with no evidence of urinary tract infection. Renal function labs within acceptable limits — creatinine 1.1 mg/dL. CBC and electrolytes normal. Urine culture sent to rule out concurrent infection. No signs of obstruction complicated by sepsis or significant hydronephrosis.</p><p>IV analgesia initiated with ketorolac and titrated morphine for pain relief. IV hydration commenced. Alpha-blocker (tamsulosin) commenced to facilitate spontaneous stone passage. Urine filtered with collection strainer provided for stone capture and composition analysis. Urology consulted — surgical intervention deferred unless spontaneous passage not achieved within 4 weeks or infection develops.</p><p>Pain well-controlled. Patient ambulatory and tolerating oral fluids. Renal colic dietary advice provided — increased fluid intake greater than 2.5L daily emphasized. Urology outpatient follow-up in 2 weeks with repeat KUB to assess stone passage. Patient discharged today with oral analgesia, alpha-blocker, and stone analysis instructions. Return precautions explained clearly regarding fever or worsening pain.</p>",

        // P-1019 Amelia Brooks — Laparoscopic cholecystectomy recovery, Monitoring
        "<p>Patient is a 26-year-old female, post-operative day 1 following urgent laparoscopic cholecystectomy for acute cholecystitis with failed conservative management. Gallstones confirmed on pre-operative ultrasound. Procedure performed without complications. No known drug allergies. Previously healthy with no significant past medical history.</p><p>WBC returning to normal at 6.1. CRP 1.8 mg/L. Hemoglobin 13.9 g/dL. Temperature 37.0°C — apyrexial. Port site wounds dry and healing well with standard dressings applied. Bowel sounds present and active throughout abdomen. Patient passed flatus this morning.</p><p>Patient tolerating full fluids advancing to a light low-fat diet without nausea. Pain managed with paracetamol and PRN low-dose codeine — rated 2/10 at rest. Encouraging regular mobilization to reduce DVT risk and promote GI recovery. Post-operative instruction on low-fat dietary requirements commenced by nursing staff.</p><p>Discharge planned for tomorrow morning provided continued clinical improvement. Patient given a 3-day course of oral antibiotics on discharge. Low-fat diet to continue for 4 weeks post-operatively. Outpatient surgical review in 7 days for wound check. Patient counselled about expected shoulder tip pain from diaphragmatic irritation, wound care, and activity limitations for 2 weeks.</p>",

        // P-1020 Owen Rivera — Myocardial infarction recovery, Monitoring
        "<p>Patient is a 64-year-old male admitted following a non-ST elevation myocardial infarction (NSTEMI) confirmed by rising troponin and characteristic ECG changes. He presented with central chest tightness radiating to the left arm, associated with diaphoresis and dyspnea. Known allergy to contrast dye — pre-medication protocol initiated prior to angiography.</p><p>Troponin I 0.7 ng/mL elevated and trending. BNP 390 pg/mL indicating left ventricular stress. Creatinine 1.6 mg/dL elevated — careful fluid management required. Coronary angiogram performed with allergy pre-treatment — revealed single-vessel disease of the LAD. PCI with drug-eluting stent inserted successfully. Post-intervention TIMI 3 flow confirmed.</p><p>Dual antiplatelet therapy (DAPT) commenced with Ticagrelor and Aspirin. Statin therapy and ACE inhibitor initiated. Repeat ECG post-procedure shows resolution of ST changes. Patient monitored on telemetry for 48 hours post-procedure. Cardiac rehabilitation referral placed for post-discharge enrollment.</p><p>Patient progressing well — chest pain resolved. Repeat troponin every 6 hours trending favorably. Cardiology teaching provided on DAPT compliance, statin use, and risk factor modification. Smoking cessation counseling offered. Discharge anticipated in 48 hours with cardiac rehab appointment at 6 weeks. Dr. Carter to perform pre-discharge echo assessment.</p>",

        // P-1021 Nora Ahmed — Asthma exacerbation, Stable
        "<p>Patient is a 35-year-old female presenting with an acute exacerbation of moderate persistent asthma, triggered by a recent upper respiratory tract infection. She reports worsening wheeze, shortness of breath, and nocturnal cough for the past 3 days. Known allergies to Aspirin and NSAIDs — all analgesics reviewed and charted accordingly.</p><p>SpO2 on room air is 92% — improving with bronchodilator therapy. Peak expiratory flow rate on admission was 58% of predicted. WBC and CBC within normal range, ruling out significant infection. Chest X-ray clear — no consolidation, pneumothorax, or effusion. CRP within normal limits.</p><p>Salbutamol nebulizations every 4 hours initially, stepping down to PRN as tolerated. Oral prednisolone course commenced for 5 days. Ipratropium added to nebulizations in first 24 hours. Avoidance of all aspirin and NSAIDs strictly enforced. Supplemental oxygen titrated to maintain SpO2 above 94%.</p><p>Patient responding well to treatment. SpO2 now 97% on room air. PEFR improved to 78% predicted. Inhaler technique reviewed and corrected with respiratory nurse. Asthma management plan updated and provided in writing. Allergy card issued with aspirin/NSAID warning. Discharge tomorrow if PEFR remains above 75% predicted. Follow-up with GP and respiratory clinic in 2 weeks.</p>",

        // P-1022 Leo Conti — Massive pulmonary embolism, Critical
        "<p>Patient is a 78-year-old male presenting with massive bilateral pulmonary embolism confirmed on CT pulmonary angiogram. He arrived to the emergency department in extremis with acute onset hypoxemia, tachycardia, and signs of right heart strain. Prolonged surgical history in the past month is a significant predisposing factor. No known drug allergies.</p><p>D-Dimer critically elevated at 3.5 µg/mL. WBC 14.8 consistent with stress response. Creatinine 1.9 mg/dL indicating renal compromise from hypoperfusion. ECG shows S1Q3T3 pattern with right bundle branch block, classical for massive PE. Echo confirms right ventricular dilation with septal bowing — obstructive shock physiology present.</p><p>Systemic thrombolysis with alteplase administered under resuscitation. Follow-on therapeutic anticoagulation with unfractionated heparin infusion commenced. Patient transferred to ICU post-thrombolysis. Continuous hemodynamic monitoring with arterial line and central venous access. Cardiothoracic surgery alerted for consideration of surgical embolectomy if thrombolysis fails. Serial ABGs every 4 hours.</p><p>Patient in critical condition — prognosis discussed with family. DNAR documentation reviewed and confirmed per patient's advance directive. Interventional radiology team on standby. Repeat echo in 4 hours post-thrombolysis to assess right ventricular recovery. Dr. Lee and ICU team managing collaboratively. Mortality risk remains high — intensive nursing observation critical during this phase.</p>",

        // P-1023 Iris Petrov — Epilepsy management, Monitoring
        "<p>Patient is a 57-year-old female admitted following a witnessed tonic-clonic seizure at home, her third episode in the past 6 months despite ongoing anti-epileptic therapy. She has a long-standing diagnosis of focal epilepsy with secondary generalization. Known allergy to Tetracycline documented on chart.</p><p>WBC and CBC within normal limits. Creatinine 1.0 mg/dL normal. Post-ictal state on admission — now alert and oriented after 6 hours. No focal neurological deficit identified post-ictally. Current Levetiracetam levels sub-therapeutic — medication non-compliance identified as likely contributing factor. EEG monitoring arranged. MRI brain ordered to exclude new structural lesion.</p><p>Levetiracetam dose adjusted upward. Compliance counseling provided — consequences of missed doses discussed in detail. Medication alarm strategy and pill organizer discussed with patient. Driving cessation advice given per regulations. Seizure precautions in place: bed rails up, seizure kit and suction at bedside.</p><p>Patient counseled on seizure first aid, trigger identification (poor sleep noted as recurring pattern), and lifestyle modification. Neurology outpatient follow-up with Dr. Pham in 4 weeks. EEG and MRI results to be reviewed at outpatient appointment. Patient safety discussion regarding employment and independent living conducted sensitively. Discharge planned for tomorrow with updated medication card and emergency contact provided.</p>",

        // P-1024 Marco Silva — Advanced dementia, Stable
        "<p>Patient is a 62-year-old male with advanced vascular dementia, admitted from a residential care facility after increased agitation, confusion, and refusal to eat over a 5-day period. Carer reports a possible recent fall but patient unable to provide a consistent history. No known drug allergies.</p><p>Hemoglobin mildly low at 11.8 g/dL — consistent with chronic anemia. SpO2 88% on room air — supplemental O2 at 2L commenced. Clinically dehydrated on admission; IV fluid resuscitation initiated. CT head completed to exclude acute intracranial event — no new findings from previous scan. Urinalysis positive for leucocytes and nitrites — urinary tract infection likely contributing to acute-on-chronic confusion.</p><p>Urinary tract infection treated with antibiotics guided by prior culture sensitivities. Gentle rehydration and nutritional supplementation commenced — dietetics consult placed. Confusion management: familiar care environment maintained, low stimulation protocol, and regular gentle reorientation within patient's comprehension level. Non-pharmacological agitation management prioritized throughout.</p><p>Family meeting held — goals of care and advance care planning discussed in the context of progressive dementia. Existing DNAR order reviewed and confirmed. Specialist dementia care team and geriatrics co-managing. Dr. Carter to review daily. Care facility informed with handover documentation updated. Return to residential facility anticipated in 3–5 days pending infection response and improved oral intake.</p>",

        // P-1025 Yuki Tanaka — Elective surgery recovery, Stable
        "<p>Patient is a 42-year-old female, post-operative day 1 following an uncomplicated elective laparoscopic procedure performed under general anesthesia. She remains apyrexial with vital signs within normal parameters. No known drug allergies. Pre-operative assessment confirmed fitness for surgery without cardiac or respiratory concerns.</p><p>Lab results all within normal limits: CBC, CRP 1.0 mg/L, and creatinine within range. Post-operative hemoglobin 14.1 g/dL — no significant intraoperative blood loss. Wound inspection: two port sites clean, dry, and intact with appropriate skin closure. Patient ambulatory and fully weight-bearing. Tolerating oral diet without nausea. Voiding without difficulty since catheter removal this morning.</p><p>Pain well controlled with regular oral analgesics — patient reporting 1–2/10 at rest. No escalation to IV or opioid analgesia required. Recovery progressing as expected. Discharge criteria being assessed — patient has met all milestones. Comprehensive discharge instructions prepared covering wound care, activity restriction, diet, and follow-up.</p><p>Patient to be discharged today following final assessment by anesthesia and surgical team. Outpatient surgical wound review in 7–10 days arranged. Patient instructed to avoid heavy lifting and strenuous exercise for 2 weeks. Advised to expect mild fatigue for up to 2 weeks post-operatively. Emergency contact details and return criteria given in writing. Patient verbalized clear understanding and expressed satisfaction with her care.</p>",

        // P-1026 Rosa Delgado — Valvular heart disease, Monitoring
        "<p>Patient is a 69-year-old female with severe mitral valve regurgitation admitted for management of worsening symptoms including progressive exertional dyspnea, bilateral ankle swelling, and reduced exercise tolerance. She is being evaluated for surgical or transcatheter mitral valve intervention. Known allergy to Ibuprofen documented.</p><p>BNP elevated at 420 pg/mL confirming significant hemodynamic compromise. Creatinine 1.7 mg/dL — borderline elevated, requiring careful consideration in fluid management. Troponin I mildly elevated at 0.6 ng/mL — myocardial stress secondary to volume overload suspected. Echocardiogram demonstrates severe MR with dilated left ventricle and reduced LVEF of 40%. Atrial fibrillation incidentally noted on ECG — cardiology notified.</p><p>IV diuresis commenced — daily Furosemide with electrolyte monitoring. ACE inhibitor uptitrated cautiously given renal function. Rate control initiated for new AF. Anticoagulation assessment completed — plan for Warfarin with bridging heparin established. Cardiothoracic surgery and interventional cardiology joint review scheduled to determine optimal valve intervention pathway. Ibuprofen flagged — NSAIDs removed from all PRN order sets.</p><p>Cardiology Dr. Lee coordinating multidisciplinary valve clinic assessment. Patient scheduled for cardiac CT and coronary angiogram as part of surgical workup. Patient counseled on valve disease progression and intervention options. Discharge anticipated once acute symptoms are controlled and full workup completed. Advance care planning discussion document started given complexity of planned intervention.</p>",

        // P-1027 Kai Müller — Hip replacement recovery, Monitoring
        "<p>Patient is a 51-year-old male, post-operative day 4 following elective total right hip replacement for end-stage osteoarthritis. Surgery performed under spinal anesthesia without intraoperative complications. Hip prosthesis secured via cementless press-fit technique. No known drug allergies.</p><p>Post-operative hemoglobin 13.3 g/dL — no blood transfusion required. WBC 6.6 within normal limits. Calcium 9.5 mg/dL normal. Wound: surgical incision healing well with staples intact. No erythema, dehiscence, or wound discharge observed. Hip prosthesis functioning appropriately — X-ray confirms excellent component alignment.</p><p>DVT prophylaxis with rivaroxaban commenced. Compression stockings in place bilaterally. Physiotherapy twice daily — patient achieving sit-to-stand, stair practice, and walking 50 meters with walking frame. Full weight-bearing as tolerated per orthopedic instruction. Hip precautions clearly explained and observed in all mobility sessions.</p><p>Progressing well ahead of expected milestones. Discharge to home with physiotherapy follow-up arranged in 1 week. Occupational therapy assessment completed — raised toilet seat and bath aids recommended. Orthopedic outpatient review with Dr. Pham at 6 weeks for wound check and X-ray. No driving for 6 weeks. Anticipated return to full daily activities at 3 months. Patient provided hip replacement rehabilitation guide.</p>",

        // P-1028 Maya Cohen — Oncological resection, Critical
        "<p>Patient is a 63-year-old female admitted post major oncological resection for colorectal carcinoma staged pT3N1M0. Surgery involved right hemicolectomy with complete mesocolic excision and primary anastomosis. Procedure was prolonged at 5.5 hours with significant intraoperative blood loss requiring transfusion of 2 units packed red cells. Known allergy to Penicillin — alternative surgical prophylaxis used.</p><p>Post-operative hemoglobin 11.6 g/dL — acceptable post-transfusion. CRP elevated at 4.5 mg/L reflecting expected major surgical inflammatory response. WBC 8.9 within range. Midline laparotomy incision with wound drain in situ draining serosanguinous fluid in expected volumes. Anastomosis integrity monitored — no clinical signs of anastomotic leak currently. Patient hemodynamically stable but with significant pain burden.</p><p>IV PCA morphine for analgesia — Penicillin-containing antibiotics avoided. Alternative broad-spectrum antibiotic cover prescribed. Stoma nurse involved for patient education; bowel habit monitoring essential post-resection. Oncology consulted for adjuvant chemotherapy planning post-recovery. MDT meeting scheduled to review histology and systemic treatment options. Enhanced recovery protocol followed throughout.</p><p>Patient emotionally distressed following cancer diagnosis and major surgery — psychological support referral placed. Social work involved for family support and care planning. Dr. Carter conducting daily ward rounds. Discharge not anticipated for 7–10 days given surgical complexity and nutritional demands. Oncology outpatient appointment to follow in 4 weeks. Patient and family counselled regarding staging, prognosis, and planned treatment pathway.</p>",

        // P-1029 Jonas Weber — Minor head trauma, Stable
        "<p>Patient is a 37-year-old male presenting after a minor head injury sustained during a cycling accident. He was wearing a helmet at the time. He reported a brief loss of consciousness of less than 1 minute, followed by mild headache and transient dizziness. No focal neurological deficit on presentation. No known drug allergies.</p><p>GCS 15 on arrival and throughout assessment. Pupils equal and reactive to light. Cranial nerve examination intact. CT head performed — no intracranial hemorrhage, structural lesion, or skull fracture identified. Blood glucose 90 mg/dL normal. CBC and metabolic panel within normal limits. Cervical spine reviewed clinically and radiologically — no injury identified.</p><p>Observation protocol initiated per minor head injury guidelines. Neurological observations every hour for the first 4 hours then every 2 hours thereafter. Patient monitored for worsening headache, repeated vomiting, confusion, or focal neurology — none identified throughout observation period. Analgesia with paracetamol — NSAIDs avoided. Head injury advice sheet provided and discussed.</p><p>Patient admitted to ambulatory care for 6-hour observation — all discharge criteria met. Discharged home with a responsible adult companion. Return-to-sport concussion graded protocol explained in detail. Patient advised that headache and fatigue may persist for several days. GP follow-up arranged for persistent symptoms. Patient instructed to return to ED immediately if any deterioration occurs.</p>",

        // P-1030 Paula Rossi — Chronic kidney disease, Monitoring
        "<p>Patient is a 58-year-old female with stage 4 chronic kidney disease (eGFR 18 mL/min) presented for monitoring admission following outpatient blood results showing rapid disease progression over the last 6 months. She has known hypertension and type 2 diabetes as primary causative conditions. Known allergies to NSAIDs and contrast dye — strict avoidance protocols in place.</p><p>Creatinine 2.3 mg/dL and trending upward. Potassium 5.1 mEq/L elevated — dietary potassium restriction reinforced and urgent nephrology review of ACE inhibitor dose requested. Hemoglobin 11.2 g/dL consistent with renal anemia — erythropoiesis-stimulating agent dosing to be reviewed. Urinalysis shows persistent proteinuria +++ — 24-hour urine collection arranged for protein quantification.</p><p>Strict avoidance of NSAIDs and contrast agents maintained. All medications reviewed for nephrotoxicity by clinical pharmacist — two drugs dose-adjusted for renal clearance. Blood pressure target less than 130/80 mmHg — antihypertensive regimen revised accordingly. Renal dietitian counseling: low potassium, low phosphate, 1.5L fluid restriction, and protein intake moderation.</p><p>Nephrology Dr. Lee coordinating CKD follow-up. Discussion initiated regarding renal replacement therapy planning — pre-emptive transplantation listing assessment referred and home hemodialysis discussed. Patient tearful but engaged with information provided. Psychological support referral approved. Discharge in 3–4 days pending electrolyte stabilization and dietetic optimization. Outpatient renal clinic follow-up in 3 weeks. Advance care planning documents provided for patient and family review.</p>",
    ];

    private static readonly string[] VitalDates = ["Jan", "Feb", "Mar", "Apr", "May"];
    private static readonly string[] WeekDays = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];

    private static readonly (string Test, string Result, string Flag)[][] PatientLabSets =
    [
        // P-1001 Emma Johnson — Critical, Respiratory failure
        [("CBC", "WBC 12.5 ×10³/µL", "High"), ("CBC", "Hemoglobin 8.2 g/dL", "Low"), ("Renal Function", "Creatinine 2.1 mg/dL", "High")],
        // P-1002 Lucas Brown — Post-op pain
        [("CBC", "WBC 7.2 ×10³/µL", "Normal"), ("CBC", "Hemoglobin 13.1 g/dL", "Normal"), ("CBC", "Platelets 250 ×10³/µL", "Normal")],
        // P-1003 Olivia Davis — Cardiac surgery
        [("Cardiac", "Troponin I 0.8 ng/mL", "High"), ("Cardiac", "BNP 450 pg/mL", "High"), ("Coagulation", "D-Dimer 2.1 µg/mL", "High")],
        // P-1004 James Wilson — Minor surgery
        [("CBC", "WBC 6.8 ×10³/µL", "Normal"), ("CBC", "Hemoglobin 14.2 g/dL", "Normal"), ("Metabolic", "Glucose 95 mg/dL", "Normal")],
        // P-1005 Sophia Martinez — Septic shock
        [("Metabolic", "Lactate 4.2 mmol/L", "High"), ("Cardiac", "Procalcitonin 8.5 ng/mL", "High"), ("CBC", "WBC 18.9 ×10³/µL", "High")],
        // P-1006 Michael Anderson — A-fib
        [("Coagulation", "INR 2.3", "High"), ("Cardiac", "BNP 220 pg/mL", "High"), ("Renal Function", "Creatinine 1.2 mg/dL", "Normal")],
        // P-1007 Isabella Thompson — Fractured radius
        [("CBC", "WBC 5.9 ×10³/µL", "Normal"), ("CBC", "Hemoglobin 13.8 g/dL", "Normal"), ("Electrolytes", "Calcium 9.4 mg/dL", "Normal")],
        // P-1008 Daniel Garcia — Severe sepsis
        [("Metabolic", "Lactate 5.1 mmol/L", "High"), ("CBC", "WBC 19.2 ×10³/µL", "High"), ("Renal Function", "Creatinine 2.8 mg/dL", "High")],
        // P-1009 Mia Rodriguez — ACL
        [("CBC", "WBC 6.4 ×10³/µL", "Normal"), ("CBC", "Hemoglobin 12.7 g/dL", "Normal"), ("CRP", "CRP 3.2 mg/L", "Normal")],
        // P-1010 Ethan Williams — Stroke
        [("Coagulation", "INR 2.1", "High"), ("Cardiac", "BNP 310 pg/mL", "High"), ("Renal Function", "Creatinine 1.5 mg/dL", "High")],
        // P-1011 Charlotte Miller — COPD
        [("CBC", "WBC 8.1 ×10³/µL", "Normal"), ("CBC", "Hemoglobin 11.9 g/dL", "Low"), ("Pulmonary", "O2 Saturation 89%", "Low")],
        // P-1012 Alexander Davis — Appendectomy
        [("CBC", "WBC 6.0 ×10³/µL", "Normal"), ("CBC", "Hemoglobin 14.0 g/dL", "Normal"), ("CRP", "CRP 2.0 mg/L", "Normal")],
        // P-1013 Layla Nguyen — Heart failure
        [("Cardiac", "BNP 480 pg/mL", "High"), ("Renal Function", "Creatinine 1.8 mg/dL", "High"), ("Electrolytes", "Potassium 4.8 mEq/L", "Normal")],
        // P-1014 Noah Kim — Aortic aneurysm
        [("Coagulation", "INR 1.9", "High"), ("CBC", "Hemoglobin 12.2 g/dL", "Low"), ("Renal Function", "Creatinine 1.4 mg/dL", "High")],
        // P-1015 Ava Thompson — Shoulder arthroscopy
        [("CBC", "WBC 6.3 ×10³/µL", "Normal"), ("CBC", "Hemoglobin 13.5 g/dL", "Normal"), ("Electrolytes", "Calcium 9.2 mg/dL", "Normal")],
        // P-1016 Liam Patel — Parkinson's
        [("CBC", "WBC 7.0 ×10³/µL", "Normal"), ("CBC", "Hemoglobin 12.8 g/dL", "Normal"), ("Renal Function", "Creatinine 1.3 mg/dL", "High")],
        // P-1017 Zoe Carter — Pneumonia
        [("CBC", "WBC 15.2 ×10³/µL", "High"), ("CBC", "Hemoglobin 10.5 g/dL", "Low"), ("Pulmonary", "O2 Saturation 84%", "Low")],
        // P-1018 Henry Parker — Kidney stones
        [("CBC", "WBC 7.5 ×10³/µL", "Normal"), ("CBC", "Hemoglobin 13.2 g/dL", "Normal"), ("Renal Function", "Creatinine 1.1 mg/dL", "Normal")],
        // P-1019 Amelia Brooks — Cholecystectomy
        [("CBC", "WBC 6.1 ×10³/µL", "Normal"), ("CBC", "Hemoglobin 13.9 g/dL", "Normal"), ("CRP", "CRP 1.8 mg/L", "Normal")],
        // P-1020 Owen Rivera — MI recovery
        [("Cardiac", "BNP 390 pg/mL", "High"), ("Renal Function", "Creatinine 1.6 mg/dL", "High"), ("Cardiac", "Troponin I 0.7 ng/mL", "High")],
        // P-1021 Nora Ahmed — Asthma
        [("CBC", "WBC 9.0 ×10³/µL", "Normal"), ("CBC", "Hemoglobin 13.6 g/dL", "Normal"), ("Pulmonary", "O2 Saturation 92%", "Low")],
        // P-1022 Leo Conti — PE
        [("Coagulation", "D-Dimer 3.5 µg/mL", "High"), ("CBC", "WBC 14.8 ×10³/µL", "High"), ("Renal Function", "Creatinine 1.9 mg/dL", "High")],
        // P-1023 Iris Petrov — Epilepsy
        [("CBC", "WBC 7.8 ×10³/µL", "Normal"), ("CBC", "Hemoglobin 12.5 g/dL", "Normal"), ("Renal Function", "Creatinine 1.0 mg/dL", "Normal")],
        // P-1024 Marco Silva — Dementia
        [("CBC", "WBC 8.4 ×10³/µL", "Normal"), ("CBC", "Hemoglobin 11.8 g/dL", "Low"), ("Pulmonary", "O2 Saturation 88%", "Low")],
        // P-1025 Yuki Tanaka — Elective surgery
        [("CBC", "WBC 5.7 ×10³/µL", "Normal"), ("CBC", "Hemoglobin 14.1 g/dL", "Normal"), ("CRP", "CRP 1.0 mg/L", "Normal")],
        // P-1026 Rosa Delgado — Valvular heart disease
        [("Cardiac", "BNP 420 pg/mL", "High"), ("Renal Function", "Creatinine 1.7 mg/dL", "High"), ("Cardiac", "Troponin I 0.6 ng/mL", "High")],
        // P-1027 Kai Müller — Hip replacement
        [("CBC", "WBC 6.6 ×10³/µL", "Normal"), ("CBC", "Hemoglobin 13.3 g/dL", "Normal"), ("Electrolytes", "Calcium 9.5 mg/dL", "Normal")],
        // P-1028 Maya Cohen — Oncological resection
        [("CBC", "WBC 8.9 ×10³/µL", "Normal"), ("CBC", "Hemoglobin 11.6 g/dL", "Low"), ("CRP", "CRP 4.5 mg/L", "High")],
        // P-1029 Jonas Weber — Head trauma
        [("CBC", "WBC 6.2 ×10³/µL", "Normal"), ("CBC", "Hemoglobin 14.3 g/dL", "Normal"), ("Metabolic", "Glucose 90 mg/dL", "Normal")],
        // P-1030 Paula Rossi — CKD
        [("Renal Function", "Creatinine 2.3 mg/dL", "High"), ("Electrolytes", "Potassium 5.1 mEq/L", "High"), ("CBC", "Hemoglobin 11.2 g/dL", "Low")],
    ];

    // ── Public API ────────────────────────────────────────────────────────

    public static IList<PatientRecord> GetPatients()
    {
        var rng = new Random(42);

        (string Id, string Name, int Age, string Gender, string BloodType, string Ward,
         string Diagnosis, string Status, string Doctor, string Phone, int RiskScore,
         string[] Allergies)[] basePats =
        [
            ("P-1001","Emma Johnson",45,"Female","A+","Anesthesiology","Acute respiratory failure","Critical","Dr. Carter","+1 555-0001",85,["Penicillin","NSAIDs"]),
            ("P-1002","Lucas Brown",32,"Male","O+","Anesthesiology","Post-operative pain management","Monitoring","Dr. Lee","+1 555-0002",45,[]),
            ("P-1003","Olivia Davis",67,"Female","B+","Anesthesiology","Complex cardiac surgery recovery","Monitoring","Dr. Pham","+1 555-0003",78,["Aspirin"]),
            ("P-1004","James Wilson",28,"Male","AB+","Anesthesiology","Minor surgical procedure","Stable","Dr. Singh","+1 555-0004",25,[]),
            ("P-1005","Sophia Martinez",55,"Female","A-","Anesthesiology","Septic shock","Critical","Dr. Carter","+1 555-0005",92,["Sulfa drugs","Codeine"]),
            ("P-1006","Michael Anderson",41,"Male","O-","Cardiology","Atrial fibrillation","Monitoring","Dr. Lee","+1 555-0006",58,["ACE inhibitors"]),
            ("P-1007","Isabella Thompson",29,"Female","B-","Emergency","Fractured radius","Stable","Dr. Pham","+1 555-0007",22,[]),
            ("P-1008","Daniel Garcia",63,"Male","AB-","ICU","Severe sepsis","Critical","Dr. Carter","+1 555-0008",81,["Penicillin"]),
            ("P-1009","Mia Rodriguez",38,"Female","A+","Orthopedics","ACL reconstruction recovery","Monitoring","Dr. Singh","+1 555-0009",42,[]),
            ("P-1010","Ethan Williams",52,"Male","O+","Neurology","Acute ischemic stroke","Critical","Dr. Lee","+1 555-0010",88,["Aspirin","NSAIDs"]),
            ("P-1011","Charlotte Miller",71,"Female","B+","Geriatrics","Chronic obstructive pulmonary disease","Stable","Dr. Pham","+1 555-0011",48,["Ibuprofen"]),
            ("P-1012","Alexander Davis",34,"Male","AB+","Surgery","Appendectomy recovery","Monitoring","Dr. Carter","+1 555-0012",28,[]),
            ("P-1013","Layla Nguyen",66,"Female","A-","Cardiology","Heart failure","Monitoring","Dr. Singh","+1 555-0013",73,["Iodine"]),
            ("P-1014","Noah Kim",59,"Male","O-","ICU","Aortic aneurysm repair","Monitoring","Dr. Lee","+1 555-0014",64,[]),
            ("P-1015","Ava Thompson",47,"Female","B-","Orthopedics","Shoulder arthroscopy recovery","Stable","Dr. Pham","+1 555-0015",33,[]),
            ("P-1016","Liam Patel",68,"Male","AB-","Neurology","Advanced Parkinson's disease","Stable","Dr. Carter","+1 555-0016",79,["Metoclopramide"]),
            ("P-1017","Zoe Carter",72,"Female","A+","Geriatrics","Severe pneumonia","Critical","Dr. Singh","+1 555-0017",91,["Penicillin","Erythromycin"]),
            ("P-1018","Henry Parker",53,"Male","O+","Emergency","Kidney stones","Stable","Dr. Lee","+1 555-0018",36,[]),
            ("P-1019","Amelia Brooks",26,"Female","B+","Surgery","Laparoscopic cholecystectomy recovery","Monitoring","Dr. Pham","+1 555-0019",31,[]),
            ("P-1020","Owen Rivera",64,"Male","AB+","Cardiology","Myocardial infarction recovery","Monitoring","Dr. Carter","+1 555-0020",69,["Contrast dye"]),
            ("P-1021","Nora Ahmed",35,"Female","A-","Emergency","Asthma exacerbation","Stable","Dr. Singh","+1 555-0021",40,["Aspirin","NSAIDs"]),
            ("P-1022","Leo Conti",78,"Male","O-","ICU","Massive pulmonary embolism","Critical","Dr. Lee","+1 555-0022",93,[]),
            ("P-1023","Iris Petrov",57,"Female","B-","Neurology","Epilepsy management","Monitoring","Dr. Pham","+1 555-0023",52,["Tetracycline"]),
            ("P-1024","Marco Silva",62,"Male","AB-","Geriatrics","Advanced dementia","Stable","Dr. Carter","+1 555-0024",47,[]),
            ("P-1025","Yuki Tanaka",42,"Female","A+","Anesthesiology","Elective surgery recovery","Stable","Dr. Singh","+1 555-0025",24,[]),
            ("P-1026","Rosa Delgado",69,"Female","O+","Cardiology","Valvular heart disease","Monitoring","Dr. Lee","+1 555-0026",75,["Ibuprofen"]),
            ("P-1027","Kai Müller",51,"Male","B+","Orthopedics","Hip replacement recovery","Monitoring","Dr. Pham","+1 555-0027",55,[]),
            ("P-1028","Maya Cohen",63,"Female","AB+","Surgery","Oncological resection","Critical","Dr. Carter","+1 555-0028",82,["Penicillin"]),
            ("P-1029","Jonas Weber",37,"Male","A-","Emergency","Minor head trauma","Stable","Dr. Singh","+1 555-0029",29,[]),
            ("P-1030","Paula Rossi",58,"Female","O-","Geriatrics","Chronic kidney disease","Monitoring","Dr. Lee","+1 555-0030",62,["NSAIDs","Contrast dye"]),
        ];

        var patients = new List<PatientRecord>(basePats.Length);

        for (int i = 0; i < basePats.Length; i++)
        {
            var b = basePats[i];
            bool isCritical   = b.Status == "Critical";
            bool isMonitoring = b.Status == "Monitoring";

            int systolic  = isCritical ? rng.Next(145, 176) : isMonitoring ? rng.Next(125, 146) : rng.Next(105, 129);
            int diastolic = (int)(systolic * (0.58 + rng.NextDouble() * 0.08));
            int hr        = isCritical ? rng.Next(85, 106) : rng.Next(60, 91);
            double temp   = Math.Round(isCritical ? 98.0 + rng.NextDouble() * 2.5 : 97.6 + rng.NextDouble() * 1.2, 1);
            int spo2      = isCritical ? rng.Next(88, 96) : rng.Next(96, 101);
            int weight    = rng.Next(110, 231);
            int rr        = isCritical ? rng.Next(20, 29) : rng.Next(12, 22);

            // Last visit: 5-55 days ago
            var lastVisitDt = new DateTime(2026, 3, 19).AddDays(-rng.Next(5, 56));
            string lastVisit = lastVisitDt.ToString("MMM dd, yyyy");

            // Avatar — use local images from /content/patient-images/
            string[] menImages = [
                "albert-dera-ILip77SbmOE-unsplash.jpg",
                "charlie-green-3JmfENcL24M-unsplash.jpg",
                "chuko-cribb-6UwpM1835DY-unsplash.jpg",
                "danny-postma-zNxOw2JFNKs-unsplash.jpg",
                "derick-mckinney-bBuUjB98PPY-unsplash.jpg",
                "duman-photography-GvvtE31b0JI-unsplash.jpg",
                "ian-dooley-d1UPkiFd04A-unsplash.jpg",
                "leilani-angel-K84vnnzxmTQ-unsplash.jpg",
                "prince-akachi-4Yv84VgQkRM-unsplash.jpg",
                "vicky-hladynets-GRyMXAQdtp8-unsplash.jpg",
                "vince-fleming-j3lf-Jn6deo-unsplash.jpg"
            ];
            string[] womenImages = [
                "aiony-haust-3TLl_97HNJo-unsplash.jpg",
                "brooke-cagle-QZRAaYfmvA8-unsplash.jpg",
                "gabriel-silverio-K_b41GaWC5Y-unsplash.jpg",
                "jake-nackos-IF9TK5Uy-KI-unsplash.jpg",
                "jeffery-erhunse-vp9mRauo68c-unsplash.jpg",
                "jimmy-fermin-bqe0J0b26RQ-unsplash.jpg",
                "jonathan-borba-n1B6ftPB5Eg-unsplash.jpg",
                "michael-dam-mEZ3PoFGs_k-unsplash.jpg",
                "raamin-ka-uR51HXLO7G0-unsplash.jpg",
                "rafaella-mendes-diniz-et_78QkMMQs-unsplash.jpg",
                "vladislav-nikonov-mRelDTGo3HY-unsplash.jpg"
            ];
            string[] pool = b.Gender == "Male" ? menImages : womenImages;
            string genderFolder = b.Gender == "Male" ? "men" : "women";
            string imgFile = pool[i % pool.Length];
            string avatar = $"./content/patient-images/{genderFolder}/thumb/{imgFile}";

            // Admission date
            var admDt = new DateTime(2024, 7, 1).AddDays(rng.Next(0, 300));
            string admDate = admDt.ToString("MMM dd, yyyy");

            // Labs with date — condition-specific + common panels (8–15 per patient)
            var labSet = PatientLabSets[i];
            var labDate = new DateTime(2026, 3, 14).AddDays(-rng.Next(0, 14)).ToString("MMM dd, yyyy");
            var labs = labSet.Select(l => new LabResult
            {
                Test   = l.Test,
                Result = l.Result,
                Flag   = l.Flag,
                Date   = labDate
            }).ToList();
            labs.AddRange(GenerateCommonLabs(rng, isCritical, isMonitoring, labDate, labs));

            // Medications — pick from pool using patient's med count based on risk score
            int medCount = Math.Max(1, Math.Min(b.RiskScore / 10, MedPool.Length));
            var meds = new List<PatientMedication>();
            var medIndices = new HashSet<int>();
            while (meds.Count < medCount)
            {
                int idx = rng.Next(MedPool.Length);
                if (medIndices.Add(idx))
                {
                    var m = MedPool[idx];
                    meds.Add(new PatientMedication { Drug = m.Drug, Dose = m.Dose, Frequency = m.Freq, Duration = m.Duration });
                }
            }

            // Visits — 1-2 entries
            int visitCount = rng.Next(1, 3);
            var visits = new List<PatientVisit>();
            for (int v = 0; v < visitCount; v++)
            {
                var vDt = lastVisitDt.AddDays(-(v * rng.Next(20, 60)));
                visits.Add(new PatientVisit
                {
                    Date   = vDt.ToString("MMM dd, yyyy"),
                    Reason = VisitReasons[rng.Next(VisitReasons.Length)]
                });
            }

            // Admission details
            string[] unitSuffixes = ["A", "B", "C"];
            var admission = new AdmissionInfo
            {
                Department    = b.Ward,
                WardUnit      = $"{b.Ward} Unit {unitSuffixes[rng.Next(unitSuffixes.Length)]}",
                Room          = rng.Next(200, 451),
                AdmissionDate = admDate,
                AssignedNurse = Nurses[rng.Next(Nurses.Length)]
            };

            patients.Add(new PatientRecord
            {
                Id               = b.Id,
                Name             = b.Name,
                Age              = b.Age,
                Gender           = b.Gender,
                BloodType        = b.BloodType,
                Ward             = b.Ward,
                Diagnosis        = b.Diagnosis,
                Status           = b.Status,
                Doctor           = b.Doctor,
                Phone            = b.Phone,
                RiskScore        = b.RiskScore,
                Allergies        = [.. b.Allergies],
                LastVisit        = lastVisit,
                Avatar           = avatar,
                Vitals           = new PatientVitals
                {
                    Bp        = $"{systolic}/{diastolic} mmHg",
                    Systolic  = systolic,
                    Diastolic = diastolic,
                    Hr        = hr,
                    Temp      = temp,
                    Spo2      = spo2,
                    Weight    = weight,
                    Rr        = rr
                },
                Labs             = labs,
                Medications      = meds,
                Visits           = visits,
                Notes            = PatientNotes[i],
                AdmissionDetails = admission,
            });
        }

        return patients;
    }

    public static Dictionary<string, PatientAnalytics> GetAnalyticsData(IList<PatientRecord> patients)
    {
        var rng = new Random(42);
        var result = new Dictionary<string, PatientAnalytics>();

        foreach (var p in patients)
        {
            bool isCritical = p.Status == "Critical";
            bool isModerate = p.Status == "Monitoring";

            // Vitals history
            var history = new List<VitalDataPoint>();
            foreach (var date in VitalDates)
            {
                history.Add(new VitalDataPoint
                {
                    Date        = date,
                    Systolic    = p.Vitals.Systolic  + rng.Next(-18, 29),
                    Diastolic   = p.Vitals.Diastolic + rng.Next(-15, 26),
                    HeartRate   = p.Vitals.Hr        + rng.Next(-16, 27),
                    Spo2        = Math.Min(100, p.Vitals.Spo2 + rng.Next(-12, 23)),
                    Temperature = Math.Round(p.Vitals.Temp + (rng.NextDouble() * 0.8 - 0.4), 1),
                    Pulse       = Math.Max(50, p.Vitals.Hr + rng.Next(-20, 31))
                });
            }

            // Lab chart results (5 items)
            var labChartNames = new[] { "CBC", "CRP", "Lipid Panel", "HbA1c", "eGFR" };
            var labUnits      = new[] { "×10³/µL", "mg/L", "mg/dL", "%", "mL/min" };
            var labBaseValues = new[] { 7.0, 5.0, 130.0, 6.0, 75.0 };
            var labCharts = new List<LabChartResult>();
            for (int i = 0; i < labChartNames.Length; i++)
            {
                double baseVal   = labBaseValues[i] * (isCritical ? 1.4 + rng.NextDouble() * 0.4 : 0.9 + rng.NextDouble() * 0.3);
                double normalMax = Math.Round(baseVal * (0.7 + rng.NextDouble() * 0.4), 1);
                double normalMin = Math.Round(normalMax * (0.3 + rng.NextDouble() * 0.3), 1);
                labCharts.Add(new LabChartResult
                {
                    Name       = labChartNames[i],
                    Value      = Math.Round(baseVal, 1),
                    NormalMin  = normalMin,
                    NormalMax  = normalMax,
                    WarningMax = Math.Round(normalMax * (1.2 + rng.NextDouble() * 0.4), 1),
                    Unit       = labUnits[i]
                });
            }

            // Alerts over time (7 days)
            int alertBase = isCritical ? 3 : isModerate ? 1 : 0;
            var alertsOverTime = WeekDays.Select(day => new AlertDataPoint
            {
                Day      = day,
                Critical = Math.Max(0, alertBase + rng.Next(-2, 3)),
                Warning  = rng.Next(0, 4),
                Info     = rng.Next(0, 4)
            }).ToList();

            // Alerts by type
            var alertsByType = new List<AlertCategory>
            {
                new() { Category = "Arrhythmia",           Value = rng.Next(3, 13) },
                new() { Category = "Hypertension",         Value = rng.Next(4, 16) },
                new() { Category = "High Cholesterol",     Value = rng.Next(3, 12) },
                new() { Category = "Inflammation",         Value = rng.Next(4, 14) },
                new() { Category = "Medication Adherence", Value = rng.Next(2, 10) },
                new() { Category = "Cardiac Risk",         Value = rng.Next(3, 12) }
            };

            result[p.Id] = new PatientAnalytics
            {
                RiskScore      = p.RiskScore,
                VitalsHistory  = history,
                LabResults     = labCharts,
                AlertsOverTime = alertsOverTime,
                AlertsByType   = alertsByType
            };
        }

        return result;
    }

    public static IList<TodayAppointment> GetTodayAppointments(IList<PatientRecord> patients)
    {
        var rng = new Random(42);
        var slots = new[]
        {
            "09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
            "12:00 PM","12:30 PM","01:00 PM","01:30 PM","02:00 PM","02:30 PM",
            "03:00 PM","03:30 PM","04:00 PM"
        };
        var statuses = new[] { "Complete", "Complete", "Complete", "In Progress", "Upcoming", "Upcoming", "Upcoming", "Cancelled" };
        var rooms = GetRoomOptions();
        var count = Math.Min(patients.Count, slots.Length);

        // Shuffle patients for variety
        var shuffled = patients.OrderBy(_ => rng.Next()).Take(count).ToList();

        return shuffled.Select((p, i) => new TodayAppointment
        {
            Time        = slots[i],
            PatientId   = p.Id,
            PatientName = p.Name,
            Reason      = AppointmentReasons[rng.Next(AppointmentReasons.Length)],
            Status      = statuses[rng.Next(statuses.Length)],
            Room        = rooms[rng.Next(rooms.Length)]
        }).ToList();
    }

    public static IList<PatientAlert> GetAlerts(IList<PatientRecord> patients)
    {
        var rng = new Random(42);
        int count = Math.Min(17, patients.Count);

        return patients
            .Where(p => p.Status == "Critical" || p.Status == "Monitoring" || p.Status == "Stable")
            .Take(count)
            .Select((p, i) => new PatientAlert
            {
                Title     = $"{AlertTemplates[i % AlertTemplates.Length]} \u2013 {p.Name}",
                Time      = AlertTimes[i % AlertTimes.Length],
                Severity  = AlertSeverities[i % AlertSeverities.Length],
                PatientId = p.Id
            }).ToList();
    }

    public static IList<EventType> GetEventTypes() =>
    [
        new() { Text = "Follow-up",    Value = "Follow-up",    Color = "#4caf50" },
        new() { Text = "Consultation", Value = "Consultation", Color = "#2196f3" },
        new() { Text = "Lab Review",   Value = "Lab Review",   Color = "#ff9800" },
        new() { Text = "Diagnostics",  Value = "Diagnostics",  Color = "#9c27b0" },
        new() { Text = "Emergency",    Value = "Emergency",    Color = "#f44336" },
    ];

    public static string[] GetRoomOptions() =>
    [
        "204 (Floor 2)", "456 (Floor 4)", "79A (Floor 0)",
        "ER-1", "ER-3", "Imaging 1B", "Imaging 2A", "Lab Office"
    ];

    // ── Initial seed builders (used by HealthcareDbSeeder) ────────────

    public static IList<ScheduleAppointment> BuildInitialScheduleAppointments(IList<PatientRecord> patients)
    {
        var slots = new (int Week, int Day, int H1, int M1, int H2, int M2, string Reason, string EventType)[]
        {
            // ── Week 0 (current week) — all durations 45 min – 1 h 30 min ──
            (0, 1, 8,  0,  8,  45, "Follow-up visit",               "Follow-up"),       // 45 min
            (0, 1, 9,  0,  10, 15, "Consultation appointment",      "Consultation"),    // 75 min
            (0, 1, 11, 0,  12, 30, "Emergency visit",               "Emergency"),       // 90 min
            (0, 2, 8,  30, 9,  45, "Diagnostics review",            "Diagnostics"),     // 75 min
            (0, 2, 10, 0,  11, 0,  "Lab results review",            "Lab Review"),      // 60 min
            (0, 2, 13, 0,  14, 0,  "Blood pressure follow-up",      "Follow-up"),       // 60 min
            (0, 3, 9,  0,  10, 30, "Annual physical exam",          "Consultation"),    // 90 min
            (0, 3, 11, 0,  12, 0,  "Imaging follow-up",             "Diagnostics"),     // 60 min
            (0, 3, 14, 0,  14, 45, "Lab panel results review",      "Lab Review"),      // 45 min
            (0, 4, 8,  0,  9,  30, "CRP follow-up results",         "Lab Review"),      // 90 min
            (0, 4, 10, 0,  11, 15, "Treatment plan discussion",     "Consultation"),    // 75 min
            (0, 4, 13, 30, 14, 30, "Post-visit follow-up",          "Follow-up"),       // 60 min
            (0, 5, 9,  0,  10, 0,  "Post-procedure assessment",     "Follow-up"),       // 60 min
            (0, 5, 11, 0,  12, 30, "Treatment plan consultation",   "Consultation"),    // 90 min
            (0, 5, 14, 0,  15, 0,  "Urgent evaluation",             "Emergency"),       // 60 min
            // ── Week 1 ──────────────────────────────────────────────────
            (1, 1, 9,  0,  10, 15, "Cardiology follow-up",          "Follow-up"),       // 75 min
            (1, 1, 10, 30, 11, 45, "Annual wellness check",          "Consultation"),   // 75 min
            (1, 1, 14, 0,  15, 0,  "CT scan review",                 "Diagnostics"),    // 60 min
            (1, 2, 8,  0,  8,  45, "Lipid panel review",             "Lab Review"),     // 45 min
            (1, 2, 11, 0,  12, 30, "Chest pain evaluation",          "Emergency"),      // 90 min
            (1, 2, 13, 0,  14, 0,  "Heart rate monitoring",          "Follow-up"),      // 60 min
            (1, 3, 9,  0,  9,  45, "Thyroid function review",        "Lab Review"),     // 45 min
            (1, 3, 11, 30, 12, 30, "X-ray follow-up",                "Diagnostics"),    // 60 min
            (1, 3, 15, 0,  15, 45, "Glucose tolerance check",        "Lab Review"),     // 45 min
            (1, 4, 8,  30, 9,  45, "Cognitive evaluation",           "Consultation"),   // 75 min
            (1, 4, 10, 0,  10, 45, "Wound inspection",               "Follow-up"),      // 45 min
            (1, 4, 14, 30, 15, 30, "Allergy skin test review",       "Diagnostics"),    // 60 min
            (1, 5, 9,  0,  10, 0,  "CBC results review",             "Lab Review"),     // 60 min
            (1, 5, 11, 0,  12, 15, "Vitamin D deficiency follow-up", "Follow-up"),      // 75 min
            // ── Week 2 ──────────────────────────────────────────────────
            (2, 1, 8,  0,  8,  45, "Bone density follow-up",         "Diagnostics"),    // 45 min
            (2, 1, 10, 30, 11, 45, "Stress test consultation",        "Consultation"),  // 75 min
            (2, 1, 13, 0,  14, 0,  "Echocardiogram review",           "Diagnostics"),   // 60 min
            (2, 2, 9,  0,  10, 30, "Iron deficiency follow-up",       "Lab Review"),    // 90 min
            (2, 2, 11, 0,  12, 0,  "Asthma evaluation",               "Consultation"),  // 60 min
            (2, 2, 14, 0,  15, 0,  "Urgent GI complaint",             "Emergency"),     // 60 min
            (2, 3, 8,  30, 9,  45, "Kidney function check",           "Lab Review"),    // 75 min
            (2, 3, 10, 0,  10, 45, "Respiratory therapy review",      "Follow-up"),     // 45 min
            (2, 3, 13, 30, 14, 30, "Post-op wound check",             "Follow-up"),     // 60 min
            (2, 4, 9,  0,  10, 15, "Nutrition counseling",            "Consultation"),  // 75 min
            (2, 4, 11, 30, 12, 30, "Ultrasound results review",       "Diagnostics"),   // 60 min
            (2, 5, 8,  0,  8,  45, "Hemoglobin A1c review",           "Lab Review"),    // 45 min
            (2, 5, 10, 0,  11, 30, "Medication adjustment",           "Consultation"),  // 90 min
            (2, 5, 14, 0,  15, 15, "Vaccine assessment",              "Follow-up"),     // 75 min
            // ── Week 3 ──────────────────────────────────────────────────
            (3, 1, 9,  0,  10, 0,  "Stroke risk evaluation",          "Emergency"),     // 60 min
            (3, 1, 10, 30, 11, 45, "Dermatology consultation",         "Consultation"), // 75 min
            (3, 1, 14, 0,  14, 45, "Blood culture results",            "Lab Review"),   // 45 min
            (3, 2, 8,  0,  9,  0,  "Comprehensive metabolic panel",    "Lab Review"),   // 60 min
            (3, 2, 10, 0,  11, 30, "Migraine follow-up",               "Follow-up"),    // 90 min
            (3, 2, 13, 0,  13, 45, "Neurological assessment",          "Consultation"), // 45 min
            (3, 3, 9,  0,  10, 15, "MRI results review",               "Diagnostics"),  // 75 min
            (3, 3, 11, 0,  12, 0,  "Cardiac rehab check",              "Follow-up"),    // 60 min
            (3, 3, 15, 0,  15, 45, "Urgent allergic reaction",         "Emergency"),    // 45 min
            (3, 4, 8,  30, 10, 0,  "Back pain evaluation",             "Consultation"), // 90 min
            (3, 4, 11, 0,  12, 15, "Pulmonary function test",          "Diagnostics"),  // 75 min
            (3, 4, 13, 30, 14, 30, "Rheumatology follow-up",           "Follow-up"),    // 60 min
            (3, 5, 9,  30, 10, 30, "Endocrine panel review",           "Lab Review"),   // 60 min
            (3, 5, 11, 0,  12, 15, "Physical therapy check-in",        "Follow-up"),    // 75 min
        };

        var list  = new List<ScheduleAppointment>();
        var today = DateTime.Today;
        var rooms = GetRoomOptions();

        for (int i = 0; i < slots.Length; i++)
        {
            var s       = slots[i];
            var patient = patients[i % patients.Count];
            var diff    = s.Day - (int)today.DayOfWeek + s.Week * 7;
            var date    = today.AddDays(diff);

            list.Add(new ScheduleAppointment
            {
                Id          = i + 1,
                Title       = patient.Name,
                PatientName = patient.Name,
                Reason      = s.Reason,
                Room        = rooms[i % rooms.Length],
                EventType   = s.EventType,
                Start       = new DateTime(date.Year, date.Month, date.Day, s.H1, s.M1, 0),
                End         = new DateTime(date.Year, date.Month, date.Day, s.H2, s.M2, 0),
            });
        }

        return list;
    }

    public static IList<DailyTask> BuildInitialDailyTasks(IList<PatientRecord> patients)
    {
        var templates = new (string Tpl, string Priority, string Desc)[]
        {
            ("Review {name} lab results",                          "High",   "Check latest CBC, CMP, and lipid panel results. Flag any values outside reference range and update the care plan accordingly."),
            ("Update treatment notes \u2014 {name}",               "Low",    "Add progress notes from today\u2019s rounds. Include medication response, symptom changes, and any new clinical observations."),
            ("Call pharmacy re: {name} allergy",                   "High",   "Verify documented penicillin allergy with dispensing pharmacist before authorising the prescribed antibiotic course."),
            ("Order follow-up MRI \u2014 {name}",                  "Medium", "Submit MRI brain with contrast order. Indicate clinical indication as post-treatment surveillance and mark as routine priority."),
            ("Sign discharge summary \u2014 Room 204",             "Medium", "Complete and co-sign the discharge summary for the patient in Room 204. Ensure medication reconciliation and follow-up instructions are included."),
            ("Prepare Friday case review presentation",            "Medium", "Compile three complex cases for the weekly multidisciplinary team review. Include imaging, lab trends, and proposed management changes."),
            ("Schedule echocardiogram \u2014 {name}",              "High",   "Arrange transthoracic echocardiogram to evaluate left ventricular function. Coordinate with cardiology for earliest available slot this week."),
            ("Follow up on blood culture results \u2014 {name}",   "High",   "Results from Tuesday\u2019s cultures are pending. Review sensitivities when available and adjust empirical antibiotic coverage as needed."),
            ("Adjust insulin dosage \u2014 {name}",                "High",   "Review three-day glucose log. HbA1c trending above target. Consider increasing basal insulin by 10% and recheck fasting glucose in 48 hours."),
            ("Notify family of discharge \u2014 {name}",           "Medium", "Contact next of kin to confirm discharge date and transport arrangements. Provide written instructions for post-discharge medication and follow-up appointment."),
            ("Review medication allergies \u2014 {name}",          "Medium", "Reconcile allergy list with current medication orders. Confirm no contraindicated prescriptions exist and update the EMR allergy panel."),
            ("Update care plan \u2014 {name}",                     "Low",    "Revise the interdisciplinary care plan to reflect changes discussed at today\u2019s rounds. Ensure nursing, physio, and dietary goals are aligned."),
            ("Consult cardiology for {name}",                      "High",   "Request urgent cardiology review for new onset arrhythmia. Attach recent ECG and telemetry strip. Ask for inpatient assessment within 4 hours."),
            ("Process insurance authorisation \u2014 {name}",      "Low",    "Submit prior-authorisation request for the proposed PET-CT scan. Attach clinical justification letter and recent imaging reports."),
            ("Arrange physical therapy session \u2014 {name}",     "Medium", "Refer to physiotherapy for post-operative mobilisation program. Goal is independent ambulation with a walking frame by day 5 post-op."),
            ("Reorder IV fluids \u2014 Room 318",                  "Low",    "Stock of 0.9% NaCl 1 L bags is low on Ward C. Submit a reorder request to pharmacy for a minimum of 20 units to last the weekend."),
            ("Check morning vitals \u2014 Ward B",                 "High",   "Confirm that all patients on Ward B have had temperature, BP, HR, RR, and SpO\u2082 documented before 08:00. Flag any abnormal readings immediately."),
            ("Submit end-of-shift report",                         "Medium", "Complete the end-of-shift handover summary covering all active admissions. Include outstanding tasks, pending results, and any escalation concerns."),
            ("Review imaging results \u2014 {name}",               "High",   "Chest X-ray and abdominal CT results are available in PACS. Review with reference to yesterday\u2019s examination and update clinical notes."),
            ("Coordinate discharge transport \u2014 {name}",       "Medium", "Arrange non-emergency patient transport for discharge to the rehabilitation facility. Confirm bed availability and estimated arrival time with the receiving unit."),
            ("Update allergy panel \u2014 {name}",                 "Low",    "Patient has reported a new reaction to codeine. Document the reaction type and severity in the allergy panel and remove all codeine-containing medications from the active prescription list."),
        };

        var tasks = new List<DailyTask>();
        var picks = patients.Take(Math.Min(4, patients.Count)).ToList();

        for (int i = 0; i < templates.Length; i++)
        {
            var t    = templates[i];
            var text = t.Tpl.Replace("{name}", picks[i % picks.Count].Name);
            tasks.Add(new DailyTask { Id = i + 1, Task = text, Priority = t.Priority, Description = t.Desc, Done = i == 0 || i == 3 || i == 5 || i == 9 || i == 16 });
        }

        return tasks;
    }

    // ── Common lab panel generator (supplements condition-specific labs) ──

    private static List<LabResult> GenerateCommonLabs(
        Random rng, bool isCritical, bool isMonitoring, string date,
        List<LabResult> existing)
    {
        // Determine how many additional labs to add (target 8–15 total)
        int targetTotal = rng.Next(8, 16);
        int needed = Math.Max(0, targetTotal - existing.Count);
        if (needed == 0) return [];

        // Track which result names already exist so we don't duplicate
        var usedNames = new HashSet<string>(existing.Select(l => l.Result.Split(' ')[0]),
            StringComparer.OrdinalIgnoreCase);

        var pool = new List<(string Test, string Name, Func<(string Result, string Flag)> Gen)>
        {
            ("CBC", "Platelets", () =>
            {
                int v = isCritical ? rng.Next(110, 490) : rng.Next(150, 400);
                return ($"Platelets {v} \u00d710\u00b3/\u00b5L", v < 150 ? "Low" : v > 400 ? "High" : "Normal");
            }),
            ("CBC", "RBC", () =>
            {
                double v = Math.Round(isCritical ? 3.5 + rng.NextDouble() * 2.8 : 4.0 + rng.NextDouble() * 1.8, 2);
                return ($"RBC {v} \u00d710\u2076/\u00b5L", v < 4.2 ? "Low" : v > 5.8 ? "High" : "Normal");
            }),
            ("CBC", "Hematocrit", () =>
            {
                double v = Math.Round(isCritical ? 28.0 + rng.NextDouble() * 22.0 : 36.0 + rng.NextDouble() * 12.0, 1);
                return ($"Hematocrit {v}%", v < 36.0 ? "Low" : v > 48.0 ? "High" : "Normal");
            }),
            ("Metabolic", "Glucose", () =>
            {
                int v = isCritical ? rng.Next(55, 200) : rng.Next(70, 115);
                return ($"Glucose {v} mg/dL", v < 70 ? "Low" : v > 100 ? "High" : "Normal");
            }),
            ("Metabolic", "BUN", () =>
            {
                int v = isCritical ? rng.Next(8, 40) : rng.Next(7, 25);
                return ($"BUN {v} mg/dL", v > 20 ? "High" : "Normal");
            }),
            ("Electrolytes", "Sodium", () =>
            {
                int v = isCritical ? rng.Next(128, 150) : rng.Next(136, 146);
                return ($"Sodium {v} mEq/L", v < 136 ? "Low" : v > 145 ? "High" : "Normal");
            }),
            ("Electrolytes", "Potassium", () =>
            {
                double v = Math.Round(isCritical ? 3.0 + rng.NextDouble() * 3.0 : 3.5 + rng.NextDouble() * 1.5, 1);
                return ($"Potassium {v} mEq/L", v < 3.5 ? "Low" : v > 5.0 ? "High" : "Normal");
            }),
            ("Electrolytes", "Chloride", () =>
            {
                int v = rng.Next(94, 112);
                return ($"Chloride {v} mEq/L", v < 96 ? "Low" : v > 106 ? "High" : "Normal");
            }),
            ("Liver", "ALT", () =>
            {
                int v = isCritical ? rng.Next(15, 90) : rng.Next(10, 50);
                return ($"ALT {v} U/L", v > 40 ? "High" : "Normal");
            }),
            ("Liver", "AST", () =>
            {
                int v = isCritical ? rng.Next(15, 80) : rng.Next(10, 45);
                return ($"AST {v} U/L", v > 40 ? "High" : "Normal");
            }),
            ("Liver", "Albumin", () =>
            {
                double v = Math.Round(isCritical ? 2.2 + rng.NextDouble() * 2.5 : 3.5 + rng.NextDouble() * 1.5, 1);
                return ($"Albumin {v} g/dL", v < 3.5 ? "Low" : "Normal");
            }),
            ("Lipid", "Total Cholesterol", () =>
            {
                int v = rng.Next(130, 280);
                return ($"Total Cholesterol {v} mg/dL", v > 200 ? "High" : "Normal");
            }),
            ("Lipid", "LDL", () =>
            {
                int v = rng.Next(60, 190);
                return ($"LDL {v} mg/dL", v > 130 ? "High" : "Normal");
            }),
            ("Lipid", "HDL", () =>
            {
                int v = rng.Next(30, 75);
                return ($"HDL {v} mg/dL", v < 40 ? "Low" : "Normal");
            }),
            ("Metabolic", "HbA1c", () =>
            {
                double v = Math.Round(4.5 + rng.NextDouble() * 4.0, 1);
                return ($"HbA1c {v}%", v > 6.5 ? "High" : "Normal");
            }),
            ("Coagulation", "PT", () =>
            {
                double v = Math.Round(10.0 + rng.NextDouble() * 8.0, 1);
                return ($"PT {v} sec", v > 13.5 ? "High" : "Normal");
            }),
            ("Renal Function", "eGFR", () =>
            {
                int v = isCritical ? rng.Next(15, 90) : isMonitoring ? rng.Next(40, 100) : rng.Next(60, 120);
                return ($"eGFR {v} mL/min", v < 60 ? "Low" : "Normal");
            }),
            ("Thyroid", "TSH", () =>
            {
                double v = Math.Round(0.3 + rng.NextDouble() * 6.0, 2);
                return ($"TSH {v} mIU/L", v < 0.4 ? "Low" : v > 4.0 ? "High" : "Normal");
            }),
        };

        // Shuffle and pick labs not already present
        var extra = new List<LabResult>();
        foreach (var item in pool.OrderBy(_ => rng.Next()))
        {
            if (extra.Count >= needed) break;
            if (usedNames.Contains(item.Name)) continue;
            usedNames.Add(item.Name);

            var (result, flag) = item.Gen();
            extra.Add(new LabResult { Test = item.Test, Result = result, Flag = flag, Date = date });
        }

        return extra;
    }
}
