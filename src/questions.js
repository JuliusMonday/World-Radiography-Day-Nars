/* World Radiography Day quiz: question bank.
   Hand-written questions (first option is always the correct one) plus
   generated calculation questions whose answers are computed, not typed.
   window.WRD_BANK = [{id, cat, q, a:[correct, wrong, wrong, wrong], f}] */
(function () {
  var B = [];
  function add(id, cat, q, a, f) { B.push({ id: id, cat: cat, q: q, a: a, f: f || "" }); }

  /* [category, question, correct, wrong, wrong, wrong, explanation] */
  var H = [
    /* ---------------- history & profession ---------------- */
    ["history","Who discovered X-rays?","Wilhelm Conrad Röntgen","Marie Curie","Thomas Edison","Henri Becquerel","Röntgen discovered X-rays on 8 November 1895, the day we celebrate as World Radiography Day."],
    ["history","In which year were X-rays discovered?","1895","1885","1901","1912","Röntgen made the discovery on 8 November 1895."],
    ["history","World Radiography Day is celebrated on which date?","8 November","1 December","7 April","10 October","It marks the anniversary of Röntgen’s discovery in 1895."],
    ["history","In which German city was Röntgen working when he discovered X-rays?","Würzburg","Berlin","Munich","Hamburg","He was professor of physics at the University of Würzburg."],
    ["history","Whose hand is shown in the first famous medical X-ray image?","Anna Bertha Röntgen, his wife","Röntgen’s own hand","Marie Curie’s hand","A hospital patient’s hand","The image of Anna Bertha’s hand, wedding ring included, was taken in December 1895."],
    ["history","Röntgen won the first ever Nobel Prize in Physics in which year?","1901","1895","1905","1911","The first Nobel Prizes were awarded in 1901, and the physics prize went to Röntgen."],
    ["history","Why did Röntgen call his discovery “X” rays?","Their nature was unknown","They formed an X shape","They were the tenth ray found","X stood for his lab"," “X” is the mathematical symbol for an unknown."],
    ["history","Who discovered natural radioactivity in 1896?","Henri Becquerel","Marie Curie","Ernest Rutherford","Wilhelm Röntgen","Becquerel found that uranium salts fogged photographic plates without any light."],
    ["history","Which two elements did Marie and Pierre Curie discover in 1898?","Polonium and radium","Uranium and thorium","Radon and radium","Polonium and uranium","Polonium was named after Marie Curie’s home country, Poland."],
    ["history","Who built the first clinical CT scanner?","Godfrey Hounsfield","Raymond Damadian","William Coolidge","Paul Lauterbur","Hounsfield built it at EMI in England."],
    ["history","The first CT scan of a patient was performed in which year?","1971","1959","1985","1965","It was done at Atkinson Morley Hospital, London, in October 1971."],
    ["history","Godfrey Hounsfield shared the 1979 Nobel Prize for CT with whom?","Allan Cormack","Paul Lauterbur","Peter Mansfield","Felix Bloch","Cormack had worked out the mathematics of image reconstruction."],
    ["history","Who shared the 2003 Nobel Prize for discoveries behind MRI?","Paul Lauterbur and Peter Mansfield","Godfrey Hounsfield and Allan Cormack","Felix Bloch and Edward Purcell","Raymond Damadian and Paul Lauterbur","Their work made it possible to build images from magnetic resonance signals."],
    ["history","Who invented the hot-cathode X-ray tube in 1913?","William Coolidge","Thomas Edison","Nikola Tesla","Wilhelm Röntgen","The Coolidge tube used a heated filament, giving stable and controllable exposures."],
    ["history","Which inventor stopped X-ray research after his assistant suffered severe radiation injuries?","Thomas Edison","Nikola Tesla","William Coolidge","Alexander Graham Bell","His assistant Clarence Dally died in 1904 from radiation injuries."],
    ["history","Which body publishes the main international recommendations on radiological protection?","ICRP","ISRRT","UNESCO","NAFDAC","The International Commission on Radiological Protection sets the dose limits most countries follow."],
    ["history","What does ISRRT stand for?","International Society of Radiographers and Radiological Technologists","International Society for Radiation Research and Therapy","International Standards for Radiology and Radiation Training","Institute of Safe Radiation and Radiographic Technology","The ISRRT represents radiographers worldwide and promotes World Radiography Day."],
    ["history","Which organisation regulates radiation safety in Nigeria?","Nigerian Nuclear Regulatory Authority (NNRA)","NAFDAC","NCDC","Standards Organisation of Nigeria","The NNRA licenses and inspects facilities that use ionising radiation."],
    ["history","Which body registers and regulates radiographers in Nigeria?","Radiographers Registration Board of Nigeria","Medical and Dental Council of Nigeria","Nursing and Midwifery Council of Nigeria","Pharmacists Council of Nigeria","The RRBN registers radiographers and regulates training and practice."],
    ["history","What does ARN stand for?","Association of Radiographers of Nigeria","Academy of Radiology of Nigeria","Association of Radiologists of Nigeria","Allied Radiation Network","The ARN is the professional association for radiographers in Nigeria."],
    ["history","What does NARS stand for?","Nigerian Association of Radiography Students","National Association of Radiation Scientists","Nigerian Academy of Radiology Studies","National Alliance of Radiographic Students","NARS brings together radiography students across Nigeria."],
    ["history","In which year was the Radiographers Registration Board of Nigeria established?","1987","1960","1999","2004","The Radiographers (Registration, etc.) Act came into force on 17 December 1987; it is now Cap R1, Laws of the Federation 2004."],
    ["history","Under the RRBN Act, which institute may the Board set up to train radiographers?","Nigerian Institute of Radiographers","Nigerian Institute of Radiology","Federal School of Imaging","National Radiation Academy","Section 18 of the Act allows the Board to establish it and award its own diploma."],
    ["history","According to the RRBN Act, which of these is a function of the Board?","Keeping the register of radiographers","Licensing X-ray equipment","Setting hospital fees","Manufacturing contrast media","The Board sets professional standards, keeps the register and conducts professional examinations. Equipment licensing is the NNRA’s job."],
    ["history","Which Nigerian regulations set radiation dose limits for workers and the public?","Nigeria Basic Ionizing Radiation Regulations, 2003","Radiographers Registration Act, 1987","National Health Act, 2014","Environmental Impact Assessment Act","The NNRA enforces these regulations, which follow the international Basic Safety Standards."],
    ["history","Which radiologist worked with Godfrey Hounsfield on the first CT scan of a patient?","James Ambrose","Allan Cormack","Peter Mansfield","William Coolidge","They scanned a patient with a suspected brain tumour at Atkinson Morley Hospital, London, in 1971."],
    ["history","At which hospital was the first CT scan of a patient performed?","Atkinson Morley Hospital, London","Massachusetts General Hospital, Boston","Charité, Berlin","Lagos University Teaching Hospital","The scan took place on 1 October 1971."],
    ["history","Who is regarded as the first person to die from X-ray exposure?","Clarence Dally","Wilhelm Röntgen","Marie Curie","Thomas Edison","Dally, Thomas Edison’s assistant, tested X-ray tubes on his own hands and died in 1904."],
    ["protection","Under ICRP recommendations, a radiation worker’s effective dose in any single year must not exceed…","50 mSv","20 mSv","100 mSv","1 mSv","The 20 mSv limit is an average over 5 years, with a cap of 50 mSv in any one year (ICRP Publication 103)."],
    ["protection","In which year did ICRP lower the occupational dose limit for the lens of the eye?","2011","1995","2001","2020","Its 2011 Seoul Statement cut the limit from 150 mSv to 20 mSv a year, averaged over 5 years."],
    ["protection","What is the ICRP equivalent dose limit for the skin of a member of the public?","50 mSv a year","500 mSv a year","1 mSv a year","150 mSv a year","Workers have a 500 mSv skin limit; the public limit is ten times lower."],

    /* ---------------- radiation protection ---------------- */
    ["protection","What does ALARA stand for?","As Low As Reasonably Achievable","As Long As Radiation Allows","All Levels Are Radiation Approved","Always Limit All Radiation Areas","Keep every dose as low as reasonably achievable while still getting a diagnostic image."],
    ["protection","Which three basics of radiation protection go together?","Time, distance, shielding","Speed, power, contrast","Light, sound, heat","Film, cassette, darkroom","Less time, more distance and proper shielding all reduce dose."],
    ["protection","What is the main source of occupational exposure for radiographers?","Scattered radiation from the patient","The primary beam","Leakage from the collimator","Natural background radiation","Staff should never be in the primary beam, so scatter from the patient is the main risk."],
    ["protection","What is the ICRP occupational effective dose limit?","20 mSv a year, averaged over 5 years","50 mSv a year, averaged over 5 years","1 mSv a year, averaged over 5 years","100 mSv a year, averaged over 5 years","No single year may exceed 50 mSv (ICRP Publication 103). Nigeria’s NNRA applies the same 20 mSv a year."],
    ["protection","What is the ICRP effective dose limit for members of the public?","1 mSv a year","5 mSv a year","20 mSv a year","50 mSv a year","The public limit is twenty times lower than the occupational limit (ICRP Publication 103)."],
    ["protection","What is the ICRP occupational dose limit for the lens of the eye?","20 mSv a year, averaged over 5 years","150 mSv a year, averaged over 5 years","500 mSv a year, averaged over 5 years","50 mSv a year, averaged over 5 years","ICRP lowered it from 150 mSv in its 2011 Seoul Statement, and the IAEA safety standards (GSR Part 3) adopted the same limit."],
    ["protection","What is the occupational equivalent dose limit for the skin, hands and feet?","500 mSv a year","50 mSv a year","150 mSv a year","20 mSv a year","Extremities tolerate more dose than the whole body (ICRP Publication 103)."],
    ["protection","What is the typical lead equivalence of a protective apron?","0.25 to 0.5 mm Pb","2 to 3 mm Pb","5 mm Pb","0.01 mm Pb","Most aprons are 0.25, 0.35 or 0.5 mm lead equivalent."],
    ["protection","Which device do radiographers wear to record their personal dose?","A personal dosimeter badge","A pocket Geiger counter","An ionisation chamber","A survey meter","Dosimeters are read regularly and the results kept on record."],
    ["protection","Which of these cells is the most radiosensitive?","Lymphocytes","Nerve cells","Muscle cells","Mature bone cells","Rapidly dividing, immature cells are the most sensitive."],
    ["protection","The Law of Bergonié and Tribondeau says cells are more radiosensitive when they…","Divide rapidly and are less specialised","Divide slowly and are highly specialised","Are large and old","Contain more fat","That is why lymphocytes and fetal tissue are so sensitive."],
    ["protection","Which effect has a dose threshold and gets more severe as dose rises?","A deterministic effect","A stochastic effect","A hereditary effect","A probabilistic effect","Skin burns and cataracts are deterministic effects (tissue reactions)."],
    ["protection","Radiation-induced cancer is an example of which type of effect?","Stochastic","Deterministic","Acute","Threshold","For stochastic effects the probability rises with dose, with no safe threshold assumed."],
    ["protection","Before X-raying the pelvis of a woman of childbearing age, you should first…","Check whether she could be pregnant","Ask when she last ate or drank","Check her blood pressure","Confirm her blood group","Check the last menstrual period and follow your local pregnancy policy."],
    ["protection","Collimating the beam tightly to the area of interest…","Reduces patient dose and scatter","Increases patient dose","Has no effect on image quality","Increases the exposure time","A smaller field irradiates less tissue and produces less scatter."],
    ["protection","Which practice reduces patient dose in fluoroscopy?","Pulsed fluoroscopy with last-image hold","Continuous high-dose mode","Using maximum magnification","Moving the image receptor away from the patient","Pulsing and last-image hold cut beam-on time."],
    ["protection","In fluoroscopy, where should the image receptor be?","As close to the patient as possible","As far from the patient as possible","Touching the X-ray tube","It makes no difference","This reduces patient dose, scatter and magnification."],
    ["protection","During mobile radiography with no protective screen, common guidance says staff should stand at least how far from the tube and patient?","2 metres","20 centimetres","50 centimetres","10 metres","Distance is the simplest protection on the ward. Always follow your own department’s local rules too."],
    ["protection","Why is lead used for radiation shielding?","Its high atomic number and density","Its low cost and light weight","It reflects X-rays back to the tube","It stays cool under heavy exposure","Lead has an atomic number of 82."],
    ["protection","What is the atomic number of lead?","82","74","56","53","Its high atomic number makes it absorb X-rays strongly."],
    ["protection","After a radiographer declares a pregnancy, ICRP recommends keeping the extra dose to the embryo or fetus to about…","1 mSv for the rest of the pregnancy","20 mSv for the rest of the pregnancy","50 mSv a year","There is no recommendation","ICRP Publication 103: the same level of protection as a member of the public."],
    ["protection","Who should preferably hold a child still for an X-ray if needed?","A non-pregnant parent in a lead apron","The radiographer taking the image","A pregnant parent in a lead apron","Another child from the waiting room","Staff should not routinely hold patients; a protected parent is preferred."],
    ["protection","Which colours are standard for the radiation warning sign?","Black or magenta on yellow","Red on white with black text","White on a blue background","Yellow on a black background","The trefoil is shown in black or magenta on a yellow background."],

    /* ---------------- physics ---------------- */
    ["physics","Which exposure factor mainly controls beam penetration?","kVp","mAs","Focal spot size","Exposure time alone","kVp controls photon energy, or beam quality."],
    ["physics","Which exposure factor mainly controls the number of X-ray photons?","mAs","kVp","SID","Filtration","mAs controls beam quantity."],
    ["physics","What is the most common anode target material?","Tungsten","Lead","Copper","Aluminium","Tungsten has a high atomic number and a very high melting point."],
    ["physics","What is the atomic number of tungsten?","74","82","56","26","Its high atomic number makes X-ray production more efficient."],
    ["physics","About what percentage of electron energy becomes X-rays in a diagnostic tube?","About 1%","About 25%","About 50%","About 99%","The other 99% or so becomes heat."],
    ["physics","Most of the energy in an X-ray tube is turned into…","Heat","X-rays","Light","Sound","That is why anodes rotate and tubes have heat limits."],
    ["physics","X-rays produced when electrons slow down near a nucleus are called…","Bremsstrahlung","Characteristic radiation","Compton scatter","Photoelectrons","Bremsstrahlung means “braking radiation” in German."],
    ["physics","X-rays produced when an outer electron fills an inner-shell vacancy are called…","Characteristic radiation","Bremsstrahlung","Scatter","Background radiation","Their energy is characteristic of the target element."],
    ["physics","Which interaction mainly creates image contrast in diagnostic radiography?","Photoelectric absorption","Compton scattering","Pair production","Coherent scattering","Differences in photoelectric absorption between tissues produce contrast."],
    ["physics","Which interaction produces most of the scatter in diagnostic imaging?","Compton scattering","Photoelectric absorption","Pair production","Photodisintegration","Compton scatter fogs the image and is the main staff hazard."],
    ["physics","Photoelectric absorption becomes more likely with…","Higher atomic number and lower photon energy","Lower atomic number and higher energy","Higher energy only","Lower density only","This is why bone and contrast agents look white."],
    ["physics","Because of the anode heel effect, beam intensity is lower on the…","Anode side","Cathode side","Centre of the beam","Patient’s right side","The anode absorbs part of the beam travelling along its surface."],
    ["physics","To use the anode heel effect, place the thicker part of the body under the…","Cathode","Anode","Collimator light","Grid lines","The cathode side of the beam is more intense."],
    ["physics","Why do most X-ray tubes have a rotating anode?","To spread heat over a larger area","To make the beam rotate","To reduce kVp","To focus the light field","Rotation lets the tube handle much higher exposures."],
    ["physics","The line focus principle allows…","A small effective focal spot from a larger target area","A large effective focal spot from a small target area","Higher tube output at lower kVp settings","Faster anode rotation with less heating","Angling the target makes the focal spot look smaller from the patient side."],
    ["physics","What does added filtration remove from the beam?","Low-energy photons that only add skin dose","High-energy photons that cause scatter","Scattered photons leaving the patient","Electrons that escape from the anode","These soft photons are absorbed by the skin and never reach the detector."],
    ["physics","Which metal is commonly used for added filtration in diagnostic tubes?","Aluminium","Lead","Gold","Tin","Aluminium removes soft radiation without cutting the useful beam too much."],
    ["physics","At what speed do X-rays travel?","The speed of light","The speed of sound","Half the speed of light","It depends on kVp","X-rays are electromagnetic waves, like light."],
    ["physics","X-rays are a form of…","Electromagnetic radiation","Mechanical sound waves","A stream of electrons","A stream of beta particles","They sit beyond ultraviolet on the electromagnetic spectrum."],
    ["physics","What electrical charge do X-ray photons carry?","None","Positive","Negative","It depends on kVp","Being uncharged, they cannot be deflected by electric or magnetic fields."],
    ["physics","What is the cathode filament usually made of?","Tungsten","Copper","Lead","Molybdenum","It is often thoriated tungsten."],
    ["physics","Releasing electrons from a heated filament is called…","Thermionic emission","Photoelectric effect","Ionisation","Bremsstrahlung","The electron cloud forms around the hot filament."],
    ["physics","Using a smaller focal spot gives…","Sharper detail (less geometric unsharpness)","Lower patient dose for the same image","Higher image contrast","A larger usable field size","Small focal spots are used for fine detail such as extremities."],
    ["physics","Increasing the object-to-image distance (OID)…","Increases magnification","Reduces magnification","Has no effect","Reduces patient dose","Keep the part as close to the detector as possible."],
    ["physics","Which combination reduces magnification?","Long SID and short OID","Short SID and long OID","Short SID and short OID","Long SID and long OID","This is why chest X-rays use 180 cm with the chest against the detector."],
    ["physics","What does an anti-scatter grid do?","Absorbs scatter before it reaches the detector","Absorbs low-energy photons before the patient","Lowers the dose the patient receives","Increases the intensity of the beam","Grids improve contrast but need more exposure, so patient dose goes up."],
    ["physics","When you add a grid, you usually need to…","Increase the mAs","Decrease the mAs","Decrease the kVp","Remove collimation","The grid absorbs some primary radiation too."],
    ["physics","How does the air-gap technique reduce scatter reaching the detector?","The extra gap lets scatter miss the detector","It hardens the beam before the patient","It reduces the photons leaving the tube","It lowers the kVp needed for the image","Scattered photons diverge and miss the receptor."],
    ["physics","What causes quantum mottle (noise) in an image?","Too few photons reaching the detector","Too many photons reaching the detector","Movement during the exposure","Too much scattered radiation","Low mAs is the usual cause. Scatter causes fog, not mottle."],
    ["physics","Raising the kVp generally makes radiographic contrast…","Lower","Higher","Unchanged","Inverted","More penetration means smaller differences between tissues."],
    ["physics","What is the SI unit of absorbed dose?","Gray (Gy)","Sievert (Sv)","Becquerel (Bq)","Roentgen (R)","1 Gy is 1 joule of energy absorbed per kilogram."],
    ["physics","Which unit is used for effective dose?","Sievert (Sv)","Gray (Gy)","Becquerel (Bq)","Coulomb (C)","Effective dose accounts for radiation type and tissue sensitivity."],
    ["physics","One becquerel equals…","One nuclear decay per second","3.7 × 10¹⁰ decays per second","One joule per kilogram","One coulomb per kilogram","3.7 × 10¹⁰ decays per second is one curie."],
    ["physics","What is the SI unit of exposure in air?","Coulomb per kilogram","Joule per kilogram","Gray per second","Sievert per hour","It measures ionisation in air. One joule per kilogram is the gray."],
    ["physics","What is a half-value layer (HVL)?","The thickness that halves the beam intensity","Half the patient thickness","Half the kVp","The thickness that stops all radiation","HVL describes beam quality."],
    ["physics","The K-shell binding energy of tungsten is about…","69 keV","10 keV","140 keV","511 keV","Tungsten’s characteristic K-shell X-rays are around this energy."],

    /* ---------------- anatomy ---------------- */
    ["anatomy","How many bones are in the adult human skeleton?","206","212","300","186","Babies have around 300 bones, many of which fuse with age."],
    ["anatomy","How many cervical vertebrae are there?","7","5","12","8","Almost all mammals, giraffes included, have 7 neck vertebrae."],
    ["anatomy","How many thoracic vertebrae are there?","12","7","5","10","One for each pair of ribs."],
    ["anatomy","How many lumbar vertebrae are there?","5","7","4","12","They are the largest vertebrae."],
    ["anatomy","How many pairs of ribs do humans usually have?","12","10","11","14","Pairs 11 and 12 are “floating” ribs."],
    ["anatomy","How many carpal bones are in each wrist?","8","7","5","10","Two rows of four."],
    ["anatomy","How many tarsal bones are in each foot?","7","8","5","14","They include the talus and calcaneus."],
    ["anatomy","Which is the longest bone in the body?","Femur","Tibia","Humerus","Fibula","It is about a quarter of a person’s height."],
    ["anatomy","Which is the smallest bone in the body?","Stapes","Incus","Hyoid","Pisiform","It sits in the middle ear."],
    ["anatomy","Which is the largest sesamoid bone?","Patella","Pisiform","Hamate","Talus","It develops within the quadriceps tendon."],
    ["anatomy","What is the first cervical vertebra called?","Atlas","Axis","Dens","Vertebra prominens","It holds up the skull, like Atlas holding up the sky."],
    ["anatomy","What is the second cervical vertebra called?","Axis","Atlas","Dens","Coccyx","Its dens lets the head rotate."],
    ["anatomy","Which carpal bone is most often fractured?","Scaphoid","Lunate","Pisiform","Hamate","Scaphoid fractures can be hidden on first X-rays."],
    ["anatomy","What is the heel bone called?","Calcaneus","Talus","Navicular","Cuboid","It is the largest tarsal bone."],
    ["anatomy","What is the medical name for the collarbone?","Clavicle","Scapula","Sternum","Acromion","It is one of the most commonly fractured bones."],
    ["anatomy","In the anatomical position, which forearm bone is lateral?","Radius","Ulna","Humerus","Fibula","The radius is on the thumb side."],
    ["anatomy","Which is the larger, weight-bearing bone of the lower leg?","Tibia","Fibula","Femur","Patella","The tibia carries most of the body weight."],
    ["anatomy","Which ribs are called “floating” ribs?","11th and 12th pairs","1st and 2nd pairs","8th to 10th pairs","6th and 7th pairs","They do not attach to the sternum at the front."],
    ["anatomy","How many cranial bones are there?","8","14","22","6","The skull has 22 bones: 8 cranial and 14 facial."],
    ["anatomy","Which organ lies mostly in the right upper quadrant?","Liver","Spleen","Sigmoid colon","Appendix","The spleen is in the left upper quadrant."],
    ["anatomy","The carina, where the trachea divides, is level with roughly…","The sternal angle (T4/T5)","C3","L1","The xiphoid process","The sternal angle is a useful surface landmark."],
    ["anatomy","The kidneys usually lie between which vertebral levels?","T12 and L3","C7 and T2","L4 and S1","T4 and T8","The right kidney sits slightly lower because of the liver."],
    ["anatomy","Which lung has three lobes?","Right lung","Left lung","Both lungs","Neither lung","The left lung has two lobes to make room for the heart."],
    ["anatomy","Which bone does not articulate with any other bone?","Hyoid","Patella","Stapes","Coccyx","It is held in place by muscles and ligaments."],
    ["anatomy","How many phalanges are in each hand?","14","10","15","5","Two in the thumb and three in each finger."],
    ["anatomy","How many metacarpals are in each hand?","5","4","8","14","One for each digit."],
    ["anatomy","The iliac crests are usually level with which vertebra?","L4","T12","L1","S2","A key landmark for abdominal and lumbar spine centring."],
    ["anatomy","Which bone forms the point of the elbow?","Olecranon of the ulna","Head of the radius","Medial epicondyle","Coronoid process","You lean on the olecranon."],

    /* ---------------- positioning ---------------- */
    ["positioning","A routine PA chest X-ray is taken with the patient…","Holding a deep breath in","Breathing normally","Breathing all the way out","Coughing","Full inspiration lowers the diaphragm so more of the lungs can be seen."],
    ["positioning","What is the standard SID for an erect PA chest X-ray?","180 cm (72 inches)","100 cm (40 inches)","60 cm","300 cm","The long distance reduces heart magnification."],
    ["positioning","What is the standard SID for most table and bucky examinations?","100 cm (40 inches)","180 cm (72 inches)","150 cm (60 inches)","75 cm (30 inches)","180 cm is mainly used for chests."],
    ["positioning","Why is a chest X-ray usually taken PA rather than AP?","The heart is less magnified","The scapulae stay over the lungs","It needs a higher exposure","The diaphragm sits higher","With the chest against the detector the heart is closer to it, so it is magnified less."],
    ["positioning","Why do you roll the shoulders forward on a PA chest?","To move the scapulae off the lungs","To raise the clavicles above the apices","To straighten the thoracic spine","To bring the heart closer to the detector","Overlapping scapulae can hide lung disease."],
    ["positioning","On a well-inspired PA chest, about how many posterior ribs show above the diaphragm?","10","4","6","14","European quality criteria use about 10 posterior (or 6 anterior) ribs as the sign of full inspiration."],
    ["positioning","For a routine lateral chest, which side is usually placed against the detector?","Left side","Right side","Back","Front","The heart is on the left and stays less magnified."],
    ["positioning","To show a pleural effusion on a lateral decubitus view, the patient lies on…","The affected side","The unaffected side","Their back","Their front","Fluid falls to the dependent side."],
    ["positioning","To show a small pneumothorax on a lateral decubitus view, the affected side should be…","Uppermost","Down on the table","Facing the detector","Out of the beam","Air rises to the highest point."],
    ["positioning","Which projection is best for free air under the diaphragm?","Erect chest","Supine abdomen","Prone abdomen","Lateral skull","Free air rises under the domes of the diaphragm."],
    ["positioning","The occipitomental (Waters) view best shows the…","Maxillary sinuses","Occipital bone","Mastoids","Cervical spine","The petrous ridges are projected below the sinuses."],
    ["positioning","The AP axial (Towne’s) view mainly shows the…","Occipital bone","Maxillary sinuses","Nasal bones","Mandible","The beam is angled caudally."],
    ["positioning","Which wrist position helps show the scaphoid?","PA with ulnar deviation","PA with radial deviation","Lateral with flexion","AP with supination","Ulnar deviation lengthens the scaphoid."],
    ["positioning","For an ankle mortise view, the leg is rotated internally about…","15 to 20 degrees","45 degrees","90 degrees","5 degrees","This opens up the whole ankle joint space."],
    ["positioning","The swimmer’s view is used to show the…","Cervicothoracic junction (C7/T1)","Lumbosacral junction (L5/S1)","Atlanto-axial joint (C1/C2)","Sacroiliac joints","It clears the shoulders away from C7 and T1."],
    ["positioning","The open-mouth view of the cervical spine shows the…","Dens and C1/C2","C7/T1 junction","Facet joints of C4","Hyoid bone","The mouth is opened to remove the teeth from the view."],
    ["positioning","The skyline (sunrise) view shows the…","Patellofemoral joint","Tibial plateau","Ankle mortise","Hip joint","The beam runs along the back of the patella."],
    ["positioning","The scapular Y view is mainly used for…","Suspected shoulder dislocation","Suspected clavicle fracture","Suspected elbow effusion","Suspected rib fractures","It shows whether the humeral head sits in the glenoid."],
    ["positioning","In the Trendelenburg position, the patient’s…","Head is lower than the feet","Head is raised","Body lies on its side","Knees are drawn up","It is used in some fluoroscopy procedures."],
    ["positioning","Lying face down is called…","Prone","Supine","Lateral","Fowler’s","Supine is lying face up."],
    ["positioning","In a left anterior oblique (LAO), which part is closest to the detector?","The left front of the body","The right front of the body","The left back of the body","The right back of the body","Obliques are named by the side nearest the detector."],
    ["positioning","For a lateral knee, the knee is usually flexed about…","20 to 30 degrees","90 degrees","5 degrees","45 to 60 degrees","More flexion tightens the muscles and can hide an effusion."],
    ["positioning","For a supine AP abdomen, the central ray is usually at the level of the…","Iliac crests","Xiphoid process","Symphysis pubis","Umbilicus only in children","This centres the kidneys, ureters and bladder."],
    ["positioning","Abdominal X-rays are taken on…","Expiration","Full inspiration","Deep breath in and out","Valsalva","Expiration raises the diaphragm, giving more room for the abdomen."],
    ["positioning","For a PA hand, the central ray is directed to the…","3rd metacarpophalangeal joint","2nd metacarpophalangeal joint","Radiocarpal (wrist) joint","3rd proximal interphalangeal joint","It is the centre of the hand."],
    ["positioning","Why do we take two views at right angles for a fracture?","One view can hide a fracture or displacement","Two views halve the dose to the patient","Two views improve image contrast","It is only needed for legal reasons","“One view is no view.”"],
    ["positioning","When imaging a long bone, you should include…","The joints at both ends","Only the fracture site","Only the nearest joint","The whole limb and the chest","This shows rotation and any associated injury."],
    ["positioning","A patient with suspected spinal injury on a trolley should have a lateral taken…","Horizontal beam, without moving them","Sitting up, after removing the collar","Standing, once they say it is not painful","Rolled onto their side for a true lateral","Never move a patient with a suspected spinal injury to get a view."],

    /* ---------------- modalities ---------------- */
    ["modalities","Which of these does NOT use ionising radiation?","MRI","CT","Mammography","Fluoroscopy","MRI uses a strong magnetic field and radio waves."],
    ["modalities","How does technetium-99m decay to give its imaging photon?","Isomeric transition (gamma emission)","Positron emission (beta-plus decay)","Alpha decay to technetium-95","Beta-minus decay to ruthenium","Its 140 keV gamma ray is imaged with a gamma camera or SPECT, not PET."],
    ["modalities","How does fluorine-18 decay?","Positron emission","Isomeric transition","Alpha decay","Electron capture only","Each positron annihilates with an electron, giving the two 511 keV photons that PET detects."],
    ["modalities","Which anode/filter pair is commonly used in mammography?","Molybdenum target with rhodium filter","Tungsten target with lead filter","Copper target with aluminium filter","Lead target with molybdenum filter","Mo/Mo, Mo/Rh and W/Rh are common, chosen to suit breast thickness."],
    ["modalities","Ultrasound imaging uses…","High-frequency sound waves","Low-dose X-ray pulses","Radio waves in a magnet","Gamma rays from a tracer","Sound echoes from tissue boundaries form the image."],
    ["modalities","What is the CT number of water?","0 HU","−1000 HU","+1000 HU","100 HU","The Hounsfield scale is defined so that water is zero."],
    ["modalities","What is the CT number of air?","−1000 HU","0 HU","+1000 HU","−100 HU","Air is the darkest thing on a CT image."],
    ["modalities","Fat on CT measures roughly…","−100 HU","+100 HU","−1000 HU","+500 HU","Fat is darker than water but much brighter than air."],
    ["modalities","Dense cortical bone on CT measures around…","Around +1000 HU","Around −1000 HU","Around +100 HU","Around −100 HU","Bone is the brightest natural tissue, and very dense bone can exceed +1000 HU."],
    ["modalities","On a T1-weighted MRI, which tissue looks bright?","Fat","Simple fluid","Air","Cortical bone","On T2-weighted images, fluid is bright."],
    ["modalities","On a T2-weighted MRI, which looks bright?","Fluid","Air","Cortical bone","Calcification","Remember “World War Two”: water is white on T2."],
    ["modalities","MRI magnet strength is measured in…","Tesla","Gray","Hertz","Sievert","Common clinical scanners are 1.5 T and 3 T."],
    ["modalities","Mammography uses a low kVp of about…","25 to 35 kVp","70 to 90 kVp","120 kVp","5 to 10 kVp","Low energy gives the contrast needed for breast tissue."],
    ["modalities","Which target material is used in many mammography tubes?","Molybdenum","Lead","Copper","Aluminium","Rhodium and tungsten targets are also used."],
    ["modalities","What are the two standard mammography views?","Craniocaudal and mediolateral oblique","Craniocaudal and true lateral","Mediolateral and lateromedial","Spot compression and magnification","CC and MLO."],
    ["modalities","A DEXA scan is used to measure…","Bone mineral density","Blood flow","Lung volume","Brain activity","It helps diagnose osteoporosis."],
    ["modalities","Fluoroscopy produces…","Real-time moving images","Only still images","3D volumes","Sound images","It is used for barium studies and many procedures."],
    ["modalities","Which radioisotope is most used in nuclear medicine?","Technetium-99m","Iodine-131","Cobalt-60","Uranium-235","Its 6-hour half-life and 140 keV gamma rays suit imaging well."],
    ["modalities","What is the half-life of technetium-99m?","About 6 hours","About 6 days","About 6 minutes","About 60 days","Long enough to image, short enough to limit dose."],
    ["modalities","What is the main gamma energy of technetium-99m?","140 keV","511 keV","60 keV","1.25 MeV","Ideal for gamma cameras."],
    ["modalities","Which tracer is most used in PET scanning?","F-18 FDG","Tc-99m MDP","Iodine-131","Gallium-67","Fluorodeoxyglucose: active tissues such as many tumours take up more glucose."],
    ["modalities","What is the half-life of fluorine-18?","About 110 minutes","About 6 hours","About 8 days","About 30 seconds","FDG must be made and used the same day."],
    ["modalities","PET scanners detect…","Pairs of 511 keV photons","Single 140 keV photons","Pulses of radio waves","Reflected sound echoes","A positron and an electron annihilate into two photons travelling in opposite directions."],
    ["modalities","Why is gel used in ultrasound?","To remove air between probe and skin","To cool the probe while scanning","To act as an ultrasound contrast agent","To protect the probe from infection","Air reflects almost all sound. Probe covers, not gel, are used for infection control."],
    ["modalities","Doppler ultrasound is used to assess…","Blood flow","Bone density","Lung capacity","Kidney stones only","It measures the frequency shift from moving blood."],
    ["modalities","On ultrasound, a simple cyst appears…","Anechoic (black)","Bright white","Grey and speckled","Invisible","Clear fluid sends back no echoes."],
    ["modalities","What does CT stand for?","Computed tomography","Contrast tomography","Computed thermography","Cathode tube","Tomography means imaging in slices."],
    ["modalities","Angiography images the…","Blood vessels","Bones","Lungs only","Nerves","Contrast is injected into the vessels."],
    ["modalities","Before an MRI scan, which must be ruled out?","Metal fragments in the eyes","Dental amalgam fillings","A recent large meal","Recent blood donation","Ferromagnetic fragments can move in the magnet and damage the eye."],
    ["modalities","Interventional radiology is…","Image-guided minimally invasive treatment","Reporting images from a remote site","Planning radiotherapy treatment","Imaging during open surgery only","Examples include angioplasty and drainages."],
    ["modalities","A linear accelerator (linac) is used for…","Radiotherapy","Ultrasound","MRI","Bone densitometry","It produces high-energy beams to treat cancer."],

    /* ---------------- contrast ---------------- */
    ["contrast","Which contrast agent is used for most GI tract studies?","Barium sulfate","Gadolinium","Iodinated oil","Air only","Barium is cheap and coats the bowel well."],
    ["contrast","Which contrast is used for most IV CT scans?","Iodine-based contrast","Barium sulfate","Gadolinium","Air","Iodine’s high atomic number absorbs X-rays strongly."],
    ["contrast","Which contrast agent is used in MRI?","Gadolinium-based","Barium sulfate","Iodine-based","Carbon dioxide only","Gadolinium changes how nearby tissue relaxes in the magnet."],
    ["contrast","If a bowel perforation is suspected, which contrast should be avoided?","Barium sulfate","Water-soluble iodinated contrast","Air","No contrast at all","Barium leaking into the abdomen causes serious peritonitis."],
    ["contrast","Air and carbon dioxide are examples of…","Negative contrast agents","Positive contrast agents","MRI contrast","Radioisotopes","They absorb fewer X-rays than tissue, so they look dark."],
    ["contrast","What is the atomic number of iodine?","53","56","82","20","It sits just above the K-edge energies used in diagnostic imaging."],
    ["contrast","What is the atomic number of barium?","56","53","74","12","High atomic number makes it a good positive contrast agent."],
    ["contrast","Before giving IV iodinated contrast, you should check…","Kidney function and allergy history","Liver function and blood group","Full blood count and blood group","Blood sugar and blood pressure","Contrast is cleared by the kidneys."],
    ["contrast","Which is a sign of a severe contrast reaction?","Wheeze with low blood pressure","A warm feeling during injection","A metallic taste in the mouth","A brief urge to pass urine","These signs mean anaphylaxis until proven otherwise."],
    ["contrast","What is the first-line drug for anaphylaxis?","Intramuscular adrenaline","Oral antihistamine","IV hydrocortisone","Nebulised salbutamol","Give IM adrenaline (epinephrine) and call for help. Antihistamines and steroids are only add-ons."],
    ["contrast","A hysterosalpingogram (HSG) examines the…","Uterus and fallopian tubes","Ovaries and fallopian tubes","Bladder and urethra","Uterus and ovaries","It is often used in fertility assessment."],
    ["contrast","An intravenous urogram (IVU) shows the…","Kidneys, ureters and bladder","Stomach","Blood vessels of the brain","Bile ducts","Contrast is excreted by the kidneys."],
    ["contrast","A barium swallow examines the…","Oesophagus","Large bowel","Small bowel only","Bladder","The patient swallows barium while being screened."],
    ["contrast","A barium enema examines the…","Large bowel","Oesophagus","Stomach","Ureters","Barium is given rectally."],
    ["contrast","ERCP images the…","Bile and pancreatic ducts","Hepatic and portal veins","Gallbladder wall only","Kidneys and ureters","It combines endoscopy with fluoroscopy."],
    ["contrast","A myelogram images the…","Spinal canal","Salivary glands","Uterus","Joints","Contrast is injected into the subarachnoid space."],
    ["contrast","An arthrogram images…","A joint","A blood vessel","The bladder","The bowel","Contrast is injected into the joint space."],

    /* ---------------- digital imaging ---------------- */
    ["digital","Computed radiography (CR) uses…","A photostimulable phosphor plate","A flat-panel selenium detector","Film with an intensifying screen","A caesium iodide scintillator","The plate stores energy that a laser later releases as light."],
    ["digital","CR imaging plates are commonly made of…","Barium fluorohalide","Silver bromide","Caesium iodide","Gadolinium oxysulfide","Europium-doped barium fluorohalide stores the image until a laser reads it out."],
    ["digital","Which material converts X-rays directly into charge in direct DR detectors?","Amorphous selenium","Caesium iodide","Gadolinium oxysulfide","Silver halide","Indirect detectors use a scintillator first."],
    ["digital","Indirect DR detectors convert X-rays to light using a scintillator such as…","Caesium iodide","Amorphous selenium","Lead","Aluminium","The light is then read by amorphous silicon photodiodes."],
    ["digital","What does PACS stand for?","Picture Archiving and Communication System","Patient Access and Care System","Picture Analysis and Correction Software","Primary Archive for Clinical Scans","It stores and distributes medical images."],
    ["digital","What is DICOM?","The standard for medical images","A detector material","A reconstruction algorithm","A type of contrast agent","Digital Imaging and Communications in Medicine."],
    ["digital","What does RIS stand for?","Radiology Information System","Radiation Intensity Scale","Remote Image Server","Radiographic Imaging Standard","It handles bookings, workflow and reports."],
    ["digital","In image display, window width mainly controls…","Contrast","Brightness","Resolution","Patient dose","A narrow window gives high contrast."],
    ["digital","Window level mainly controls…","Brightness","Contrast","Matrix size","Noise","It sets the centre of the displayed range."],
    ["digital","A narrow window width gives…","Higher contrast","Lower contrast","More dose","Larger pixels","Fewer grey levels cover each tissue."],
    ["digital","What is a pixel?","The smallest element of an image","A unit of image contrast","A single detector row","One line pair","A voxel is its 3D equivalent."],
    ["digital","What is a voxel?","A volume element of a 3D image","A pixel that carries colour","One slice of a CT scan","A unit of tube voltage","It has width, height and depth."],
    ["digital","With the same field of view, a larger matrix gives…","Smaller pixels and finer detail","Larger pixels and more noise","Smaller pixels and less noise","Larger pixels and finer detail","More pixels share the same area."],
    ["digital","What does the exposure index tell you?","Exposure reaching the detector","Dose received by the patient","Contrast of the final image","kVp chosen for the exposure","Use it to check your exposures are consistent."],
    ["digital","What is “dose creep” in digital radiography?","Over-exposure that the image hides","Gradual loss of detector sensitivity","Rising kVp across a working day","Noise creeping into old detectors","Digital processing hides over-exposure."],
    ["digital","Spatial resolution is measured in…","Line pairs per millimetre","Pixels per square centimetre","Hounsfield units","Dots per inch","Higher values mean finer detail."],
    ["digital","Why must every radiograph carry an anatomical side marker?","It identifies left and right","It improves image contrast","It records the exposure used","It shows the patient’s ID number","Wrong-side errors can lead to wrong-site treatment."],

    /* ---------------- patient care ---------------- */
    ["care","Before any examination, confirm the patient’s identity using at least…","Two identifiers, e.g. name and date of birth","Their name, confirmed by a relative","Their ward and bed number","Their name, as on the request form","This prevents wrong-patient examinations."],
    ["care","What is the single most effective infection control measure?","Hand hygiene","Wearing a lead apron","Opening windows","Using a grid","Clean hands between every patient."],
    ["care","Valid consent requires that the patient…","Understands the procedure and agrees","Has a relative sign on their behalf","Has signed a form, read or not","Is told after the examination","They must understand what will happen and any risks."],
    ["care","In pregnancy checks, what does LMP stand for?","Last menstrual period","Lowest maternal pressure","Lateral medial projection","Lead mask protection","It helps decide if a patient could be pregnant."],
    ["care","If a patient feels faint during an examination, you should…","Lie them down and raise their legs","Make them stand","Give them a drink of water and continue","Leave the room","This helps blood return to the brain."],
    ["care","Who may see a patient’s images and results?","Only staff involved in their care","Any staff member in the hospital","Any relative who asks","Anyone with their hospital number","Confidentiality is a professional duty."],
    ["care","A patient is in pain and cannot move into the standard position. You should…","Adapt the technique to what they can do","Insist on the standard position","Give them your own painkillers","Ask a relative to hold them in place","Modify the projection and document it."],
    ["care","What should you do before starting any examination?","Explain the procedure to the patient","Start immediately to save time","Ask them to sign a payment form","Turn off the lights","Patients cooperate better when they know what to expect."],
    ["care","A patient asks what their X-ray shows. As a radiographer you should…","Explain the report will come from the reporter","Tell them what you can see on the screen","Say nothing and end the conversation","Show them other patients’ images to compare","Follow your department’s reporting policy."],
    ["care","Patients with which device need careful screening before an MRI scan?","A cardiac pacemaker","A plaster cast","Glasses","A walking stick","Many pacemakers are only safe under specific MRI conditions, if at all."],
    ["care","Her wristband says “Ada Obi” but she answers to “Ada Okafor”. What do you do?","Stop and resolve the mismatch first","Image her, then fix the band later","Go by the name on the request form","Ask the porter which name is right","Never expose until identity is confirmed with the patient and records."],
    ["care","A frail patient on the X-ray table says she feels dizzy. What do you do first?","Keep her lying down and call for help","Sit her up quickly to get her moving","Finish the exposure, then check on her","Give her a glass of water to drink","Preventing a fall comes first; lying flat is safest."],
    ["care","A child is crying and won’t keep still for a chest X-ray. Best first step?","Explain simply and involve the parent","Hold the child down firmly yourself","Keep exposing until one image is sharp","Send the child back to the ward","Calm, simple explanations and a parent’s help usually work better than force."],
    ["care","A woman is unsure whether she is pregnant before a pelvic CT. What do you do?","Pause and follow the pregnancy policy","Proceed, as CT doses are always low","Shield her abdomen and proceed","Ask her partner to decide for her","If pregnancy can’t be ruled out, follow your department’s pregnancy policy before any exposure."],
    ["care","A patient refuses a chest X-ray after you explain it. What should you do?","Respect it and inform the referrer","Do it anyway, as it was requested","Tell them the doctor insists","Ask a relative to consent instead","A competent adult can refuse. Document it and tell the referring clinician."],
    ["care","An inpatient’s cannula is bleeding at the site when they arrive. First action?","Apply pressure and alert the nurse","Remove the cannula yourself","Complete the X-ray, then report it","Ask them to keep the arm raised","Control the bleeding first, then involve the nursing team."],
    ["care","Which patients need MRI safety screening before entering the scanner room?","Every patient, every time","Only patients over 60","Only patients with known implants","Only patients having contrast","MRI safety screening is done for every patient and every visitor, with no exceptions."],
    ["care","A patient complains that a colleague was rude to them earlier. Best response?","Listen, apologise and explain how to complain","Defend your colleague straight away","Tell them it is not your concern","Agree and criticise your colleague","Acknowledge the concern and point them to the proper feedback route."],
    ["care","During IV contrast injection the arm swells and hurts at the cannula. What happened?","Contrast has leaked into the tissue","The patient is allergic to contrast","The cannula has entered an artery","This is a normal response to contrast","Swelling and pain at the site suggest extravasation. Stop the injection and follow local protocol."],
    ["care","What is the safest way to move a patient from a trolley to the X-ray table?","A slide sheet with enough staff","Lift them alone, as quickly as possible","Ask the patient to jump across","Pull them across by the arms","Safe manual handling protects both the patient and staff."],
    ["care","A patient with dementia keeps trying to get off the table. Best approach?","Speak calmly and involve their carer","Strap them down without explaining","Raise your voice so they can hear","Leave them alone until they settle","Reassurance and a familiar carer reduce distress and the risk of falls."],
    ["care","An anxious patient needs an intimate examination. What helps most?","Offer a chaperone and explain each step","Work quickly and explain afterwards","Leave the door open for safety","Ask a student to explain it instead","Dignity, consent and a chaperone build trust."],
    ["care","When should you clean your hands in the X-ray room?","Before and after every patient contact","Only after touching a patient","Only when your hands look dirty","Only before putting on gloves","Hand hygiene before and after each contact protects patients and staff."],
    ["care","After imaging a patient with suspected TB, what do you do with the equipment?","Clean contact surfaces per protocol","Clean the detector only if it looks dirty","Leave it for the end-of-day clean","Spray the room with air freshener","Clean contact surfaces between patients, following infection control guidance."],
    ["care","A patient speaks little English and their 10-year-old offers to translate. Best option?","Use a trained interpreter if possible","Let the child translate everything","Proceed using gestures only","Skip the explanation to save time","Trained interpreters keep consent and history-taking accurate and confidential."],
    ["care","You realise the wrong side was X-rayed. What do you do?","Report it promptly as an incident","Delete the image and repeat quietly","Change the side marker on the image","Wait to see whether anyone notices","Report errors openly so patients are protected and systems improve."],
    ["care","A patient in a wheelchair cannot stand for an erect chest X-ray. Best approach?","Image them seated and note it","Insist they stand without support","Cancel the examination","Lie them flat and label it erect","Adapt the technique safely and record what was done."],
    ["care","A trauma patient in severe pain asks you for painkillers. You should…","Tell the clinical team and keep them comfortable","Give them painkillers from your own bag","Refuse to continue until the pain stops","Ignore it and finish as fast as possible","Radiographers don’t prescribe; escalate pain to the clinical team."],
    ["care","Before a mobile X-ray on the ward, what do you do first?","Introduce yourself and check their ID","Switch on the unit and set exposure","Ask everyone to leave the bay","Slide the detector under the patient","Introduction and an identity check always come first."],
    ["care","A patient says they reacted badly to contrast last year. What do you do?","Tell the radiologist before any injection","Proceed, as reactions rarely repeat","Inject half the usual dose instead","Note it in the record after the scan","A previous reaction must be flagged to the radiologist before contrast is given."],
    ["care","A child’s injuries don’t match the story the carer gives. What do you do?","Follow the safeguarding procedure","Confront the carer about it","Ignore it, as it is not your role","Discuss it with other parents","Every healthcare worker has a duty to raise safeguarding concerns."],
    ["care","A patient in a hospital gown asks for more privacy while waiting. Best action?","Offer a second gown or a private space","Tell them everyone wears the same gown","Ask them to wait in the corridor","Tell them it will only take a minute","Simple steps like a second gown protect dignity."],
    ["care","Which action best shows “Upholding Patient Care” during an X-ray?","Explaining the procedure and checking comfort","Finishing the list as quickly as possible","Repeating images until one is perfect","Letting the patient read the request form","Clear communication and comfort are at the heart of patient care."],
    ["care","A patient faints in the waiting area. What do you do first?","Make them safe and call for help","Splash cold water on their face","Lift them onto a chair at once","Leave them to recover on their own","Make the area safe, lie them flat and get help."],
    ["care","A diabetic patient fasting for a scan becomes sweaty and confused. Likely cause?","Low blood sugar","A contrast reaction","Anxiety about the scan","Dehydration from fasting","Fasting can cause hypoglycaemia in diabetic patients. Get help and follow protocol."],
    ["care","A patient is on oxygen during a mobile chest X-ray. What should you do?","Keep the oxygen on and work around it","Remove the mask during the exposure","Turn the oxygen off to avoid artefacts","Ask them to hold their breath longer","Never remove prescribed oxygen; position around it."],
    ["care","What is the best way to check a patient understands their preparation?","Ask them to explain it back to you","Ask “Do you understand?”","Give them a leaflet to read later","Repeat it louder and more slowly","The teach-back method confirms real understanding."],
    ["care","Two patients with the same name are on today’s list. What do you do?","Check at least two identifiers for each","Go by the order on the list","Ask which of them arrived first","Use their ward numbers to tell them apart","Matching names are a known risk; always use two identifiers."],
    ["care","A patient asks why they need an X-ray at all. What is the best reply?","Explain the reason and the benefit simply","Tell them the doctor knows best","Say you are not allowed to discuss it","Tell them the dose is too small to matter","Patients have a right to understand why an exam is being done."],
    ["care","Your patient is wearing a hijab for a skull X-ray. What is most appropriate?","Explain why, and offer privacy to remove it","Remove it yourself without asking","Image through it without telling her","Refuse to do the examination","Respect beliefs: explain, ask, and offer privacy and a same-sex colleague if possible."],
    ["protection","A doctor asks for a repeat X-ray “just for another look”. What applies?","Each exposure must be justified","Repeat it, since it was requested","Repeat it at half the usual dose","Repeat it with a lead apron on","Justification is a core principle: no exposure without clinical benefit."],
    ["protection","Which action cuts patient dose without lowering image quality?","Collimating tightly to the area","Using a shorter SID than usual","Taking an extra view to be sure","Raising the mAs “just in case”","Tight collimation reduces both dose and scatter."],
    ["protection","In fluoroscopy, where is the scatter to staff usually highest?","The X-ray tube side","The image receptor side","The control console side","The patient’s feet end","Scatter is greatest where the beam enters the patient, on the tube side."],
    ["positioning","On a PA chest, the medial ends of the clavicles are unequal distances from the spine. Why?","The patient was rotated","The patient breathed out","The exposure was too high","The SID was too long","Unequal clavicles mean rotation; the image may misrepresent the heart and mediastinum."],
    ["positioning","An AP abdomen misses the lower pelvis and bladder area. Most likely cause?","Centring was too high","The kVp was too low","The patient breathed in","The grid was left out","Centring too high cuts off the symphysis pubis and bladder."]
  ];
  H.forEach(function (r, i) { add("h" + i, r[0], r[1], [r[2], r[3], r[4], r[5]], r[6]); });

  /* ---------------- generated calculation questions ---------------- */
  function fmt(n) { var r = Math.round(n * 1000) / 1000; return String(r); }
  function opts(c, cands, unit) {
    var out = [c], seen = [fmt(c)];
    cands.concat([c * 2, c / 2, c * 4, c / 4, c * 10, c / 10, c * 3]).forEach(function (v) {
      if (out.length < 4 && v > 0 && isFinite(v) && seen.indexOf(fmt(v)) < 0) { out.push(v); seen.push(fmt(v)); }
    });
    return out.map(function (v) { return fmt(v) + (unit || ""); });
  }
  function nice(v, dp) { var m = Math.pow(10, dp || 2); return Math.abs(Math.round(v * m) - v * m) < 1e-6; }

  // mAs = mA x time
  [50, 100, 200, 250, 300, 400, 500, 600, 800].forEach(function (mA) {
    [0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.5].forEach(function (t) {
      var c = mA * t;
      add("mas-" + mA + "-" + t, "calc-mas", "An exposure uses " + mA + " mA for " + fmt(t) + " s. How many mAs is that?",
        opts(c, [c * 10, c / 10, c * 2], " mAs"), "mAs = mA × time in seconds: " + mA + " × " + fmt(t) + " = " + fmt(c) + " mAs.");
    });
  });
  // time = mAs / mA
  [5, 8, 10, 16, 20, 25, 32, 40, 50, 100].forEach(function (mas) {
    [100, 200, 250, 400, 500, 800].forEach(function (mA) {
      var t = mas / mA;
      if (t < 0.005 || t > 1 || !nice(t, 3)) return;
      add("time-" + mas + "-" + mA, "calc-time", "You need " + mas + " mAs and set " + mA + " mA. What exposure time do you need?",
        opts(t, [t * 10, t / 10, t * 2], " s"), "Time = mAs ÷ mA: " + mas + " ÷ " + mA + " = " + fmt(t) + " s.");
    });
  });
  // inverse square law
  var PAIRS = [[100, 200], [50, 100], [100, 50], [200, 100], [60, 120], [90, 180], [150, 75], [100, 400]];
  [2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40].forEach(function (i1) {
    PAIRS.forEach(function (p) {
      var i2 = i1 * Math.pow(p[0] / p[1], 2);
      if (!nice(i2, 3)) return;
      add("isl-" + i1 + "-" + p[0] + "-" + p[1], "calc-isl", "The dose rate is " + i1 + " mGy/h at " + p[0] + " cm from the source. What is it at " + p[1] + " cm?",
        opts(i2, [i1 * p[0] / p[1], i1 * Math.pow(p[1] / p[0], 2), i1 * p[1] / p[0]], " mGy/h"),
        "Inverse square law: " + i1 + " × (" + p[0] + "/" + p[1] + ")² = " + fmt(i2) + " mGy/h.");
    });
  });
  // density maintenance (mAs-distance)
  var SIDS = [[100, 200], [50, 100], [100, 50], [200, 100], [90, 180], [60, 120], [100, 150], [180, 90]];
  [2, 4, 5, 8, 10, 16, 20, 25, 40].forEach(function (m1) {
    SIDS.forEach(function (p) {
      var m2 = m1 * Math.pow(p[1] / p[0], 2);
      if (!nice(m2, 2)) return;
      add("dm-" + m1 + "-" + p[0] + "-" + p[1], "calc-dm", "A good image uses " + m1 + " mAs at " + p[0] + " cm SID. What mAs keeps the same receptor exposure at " + p[1] + " cm SID?",
        opts(m2, [m1 * p[1] / p[0], m1 * Math.pow(p[0] / p[1], 2), m1 * p[0] / p[1]], " mAs"),
        "mAs₂ = mAs₁ × (SID₂ ÷ SID₁)² = " + m1 + " × (" + p[1] + "/" + p[0] + ")² = " + fmt(m2) + " mAs.");
    });
  });
  // 15% rule
  [60, 64, 70, 74, 80, 86, 90].forEach(function (kv) {
    [4, 8, 10, 16, 20, 32, 40].forEach(function (mas) {
      var c = mas / 2;
      add("k15-" + kv + "-" + mas, "calc-15", "Using the 15% rule, you raise " + kv + " kVp by 15%. To keep the same receptor exposure, " + mas + " mAs becomes about…",
        opts(c, [mas * 2, mas * 1.15, mas * 0.85], " mAs"),
        "A 15% rise in kVp roughly doubles receptor exposure, so halve the mAs. " + kv + " × 1.15 ≈ " + Math.round(kv * 1.15) + " kVp.");
    });
  });
  // magnification
  var MAG = [[100, 80], [100, 50], [120, 100], [150, 100], [180, 150], [120, 80], [150, 120], [180, 120], [160, 80], [100, 40], [200, 160], [180, 90]];
  MAG.forEach(function (p) {
    var mf = p[0] / p[1];
    add("mf-" + p[0] + "-" + p[1], "calc-mag", "The SID is " + p[0] + " cm and the SOD is " + p[1] + " cm. What is the magnification factor?",
      opts(mf, [p[1] / p[0], p[0] / (p[0] - p[1]), mf + 0.5], ""), "Magnification factor = SID ÷ SOD = " + p[0] + " ÷ " + p[1] + " = " + fmt(mf) + ".");
    [6, 10, 12, 15, 20, 30].forEach(function (img) {
      var obj = img / mf;
      if (!nice(obj, 2)) return;
      add("obj-" + p[0] + "-" + p[1] + "-" + img, "calc-mag", "An image of a structure measures " + img + " cm. SID is " + p[0] + " cm and SOD is " + p[1] + " cm. What is its real size?",
        opts(obj, [img * mf, img - (mf - 1) * 2, obj / 2], " cm"), "Real size = image size ÷ (SID ÷ SOD) = " + img + " ÷ " + fmt(mf) + " = " + fmt(obj) + " cm.");
    });
  });
  // grid ratio
  [5, 6, 8, 10, 12, 16].forEach(function (r) {
    [0.2, 0.25, 0.3, 0.4, 0.5].forEach(function (d) {
      var h = r * d;
      add("grid-" + r + "-" + d, "calc-grid", "Grid strips are " + fmt(h) + " mm tall with " + fmt(d) + " mm gaps between them. What is the grid ratio?",
        opts(r, [r / 2, r * 2, r + 4], ":1"), "Grid ratio = strip height ÷ gap width = " + fmt(h) + " ÷ " + fmt(d) + " = " + r + ":1.");
    });
  });
  // half-value layers
  [1, 2, 3, 4, 5].forEach(function (n) {
    var den = Math.pow(2, n), w = [2 * n === den ? den * 2 : 2 * n, den * 2, n + 1 === den ? den * 4 : n + 1].filter(function (v, i, a) { return v !== den && a.indexOf(v) === i; });
    while (w.length < 3) w.push(den * (w.length + 3));
    add("hvl-" + n, "calc-hvl", "What fraction of the beam remains after " + n + " half-value layer" + (n > 1 ? "s" : "") + "?",
      ["1/" + den].concat(w.slice(0, 3).map(function (v) { return "1/" + v; })), "Each HVL halves the beam: (1/2)^" + n + " = 1/" + den + ".");
  });
  [80, 100, 160, 200, 320, 400].forEach(function (i0) {
    [1, 2, 3, 4].forEach(function (n) {
      var c = i0 / Math.pow(2, n);
      add("hvli-" + i0 + "-" + n, "calc-hvl", "A beam of " + i0 + " mGy passes through " + n + " half-value layer" + (n > 1 ? "s" : "") + ". How much remains?",
        opts(c, [i0 / (2 * n + 1), i0 / Math.pow(2, n + 1), i0 - 10 * n], " mGy"), i0 + " × (1/2)^" + n + " = " + fmt(c) + " mGy.");
    });
  });
  // unit conversions
  [0.005, 0.02, 0.25, 0.5, 1, 1.5, 2].forEach(function (v) {
    add("u-gy-" + v, "calc-units", "How many mGy is " + fmt(v) + " Gy?", opts(v * 1000, [v * 100, v / 1000, v * 10], " mGy"), "1 Gy = 1000 mGy.");
    add("u-gyrad-" + v, "calc-units", "How many rad is " + fmt(v) + " Gy?", opts(v * 100, [v * 1000, v / 100, v * 10], " rad"), "1 Gy = 100 rad.");
    add("u-svrem-" + v, "calc-units", "How many rem is " + fmt(v) + " Sv?", opts(v * 100, [v * 1000, v / 100, v * 10], " rem"), "1 Sv = 100 rem.");
  });
  [20, 50, 250, 500, 1500, 2400].forEach(function (v) {
    add("u-usv-" + v, "calc-units", "How many mSv is " + v + " µSv?", opts(v / 1000, [v / 100, v * 1000, v / 10], " mSv"), "1 mSv = 1000 µSv.");
    add("u-msv-" + v, "calc-units", "How many Sv is " + v + " mSv?", opts(v / 1000, [v / 100, v * 1000, v / 10], " Sv"), "1 Sv = 1000 mSv.");
  });
  // radioactive decay
  [400, 600, 800, 1000, 1200, 1600].forEach(function (a0) {
    [6, 12, 18, 24].forEach(function (t) {
      var n = t / 6, c = a0 / Math.pow(2, n);
      add("tc-" + a0 + "-" + t, "calc-decay", "A technetium-99m dose measures " + a0 + " MBq. Roughly how much activity is left after " + t + " hours?",
        opts(c, [Math.round(a0 / (n + 1)), Math.round(a0 * (1 - t / 48)), Math.round(a0 / (2 * n + 2))], " MBq"), "Tc-99m has a half-life of about 6 hours: " + t + " h is " + n + " half-li" + (n > 1 ? "ves" : "fe") + ", so " + a0 + " → " + fmt(c) + " MBq.");
    });
  });
  [370, 400, 740].forEach(function (a0) {
    [110, 220].forEach(function (t) {
      var n = t / 110, c = a0 / Math.pow(2, n);
      add("f18-" + a0 + "-" + t, "calc-decay", "An FDG (fluorine-18) dose measures " + a0 + " MBq. Roughly how much is left after " + t + " minutes?",
        opts(c, [Math.round(a0 / (n + 1)), Math.round(a0 * 0.9), Math.round(a0 / (2 * n + 2))], " MBq"), "F-18 has a half-life of about 110 minutes, so " + a0 + " → " + fmt(c) + " MBq.");
    });
  });
  // pixel size
  [200, 250, 300, 350, 400, 430].forEach(function (fov) {
    [256, 512, 1024, 2048].forEach(function (m) {
      var c = Math.round(fov / m * 1000) / 1000;
      add("px-" + fov + "-" + m, "calc-pixel", "With a " + fov + " mm field of view and a " + m + " × " + m + " matrix, what is the pixel size?",
        opts(c, [c * 2, c / 2, c * 4], " mm"), "Pixel size = field of view ÷ matrix = " + fov + " ÷ " + m + " ≈ " + fmt(c) + " mm.");
    });
  });
  // spatial resolution
  [0.05, 0.1, 0.125, 0.2, 0.25, 0.5].forEach(function (p) {
    var lp = 1 / (2 * p);
    add("lp-" + p, "calc-pixel", "A detector has " + p + " mm pixels. What is its maximum theoretical spatial resolution?",
      opts(lp, [1 / p, 1 / (4 * p), lp * 3], " lp/mm"), "One line pair needs two pixels: 1 ÷ (2 × " + p + ") = " + fmt(lp) + " lp/mm.");
  });
  // heat units (single-phase)
  [60, 70, 80, 90, 100].forEach(function (kv) {
    [100, 200, 300].forEach(function (mA) {
      [0.1, 0.2, 0.5].forEach(function (t) {
        var c = kv * mA * t;
        add("hu-" + kv + "-" + mA + "-" + t, "calc-heat", "On a single-phase unit, how many heat units does an exposure of " + kv + " kVp, " + mA + " mA and " + fmt(t) + " s produce?",
          opts(c, [kv * mA, mA * t * 100, c * 10], " HU"), "Single-phase heat units = kVp × mA × s = " + fmt(c) + " HU.");
      });
    });
  });
  // CT windows
  [[40, 400], [40, 80], [50, 350], [-600, 1500], [300, 1500], [400, 2000], [60, 400], [35, 100], [0, 200], [-500, 1000], [80, 200], [500, 2500]].forEach(function (w) {
    var lo = w[0] - w[1] / 2, hi = w[0] + w[1] / 2;
    var A = [lo + " to " + hi + " HU", (w[0] - w[1]) + " to " + (w[0] + w[1]) + " HU", w[0] + " to " + (w[0] + w[1]) + " HU", (w[0] - w[1]) + " to " + w[0] + " HU"];
    add("win-" + w[0] + "-" + w[1], "calc-window", "A CT window is set to level " + w[0] + " HU and width " + w[1] + " HU. Which range is shown in shades of grey?",
      A, "Range = level ± width/2 = " + w[0] + " ± " + (w[1] / 2) + ". Anything below " + lo + " HU is black, above " + hi + " HU is white.");
  });

  window.WRD_BANK = B;
})();
