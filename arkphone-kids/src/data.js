// Emergency card data — all content is DRAFT until reviewed against source documents.
// Trust labels, confidence markers, and reviewed dates are required on every card.

export const TRUST = {
  OFFICIAL_GOVERNMENT: "trust-official",
  RED_CROSS_OR_MEDICAL_AUTHORITY: "trust-med",
  FIELD_MANUAL: "trust-field",
  OPEN_SOURCE_PROJECT: "trust-oss",
  MAP_SOURCE: "trust-map",
  PREPPER_OR_COMMUNITY_IDEA: "trust-community",
  AARON_PERSONAL_NOTE: "trust-personal",
  UNVERIFIED: "trust-unverified"
};

export const cards = [
  {
    id: "power-outage",
    icon: "⚡",
    short: "Power Out",
    title: "Power Outage",
    keywords: "power outage blackout electricity grid generator fridge freezer carbon monoxide medical equipment",
    readiness: "amber",
    readinessText: "Draft",
    trustLabels: ["OFFICIAL_GOVERNMENT", "UNVERIFIED"],
    situation: "Loss of household or neighbourhood electrical service.",
    danger: "Carbon monoxide from unsafe generator or fuel-burning appliance use, damaged or downed lines, food and medication storage failure, heat or cold exposure.",
    first5: [
      "Check for immediate hazards: smoke, burning smell, sparks, downed wires, or a carbon monoxide alarm.",
      "Use flashlights or battery lanterns. Avoid candles unless there is no safer light source.",
      "Keep fridge and freezer doors closed as much as possible.",
      "Check people, pets, medical devices, sump pump risk, and temperature-sensitive medication.",
      "Use official alerts, utility updates, battery radio, or trusted local information when available."
    ],
    family: "Stay together in one safe room. Use flashlights. Do not touch wires. Do not open the fridge unless a grown-up says so.",
    notDo: "Do not run a fuel-powered generator, barbecue, camping stove, or fuel-burning equipment indoors, in a garage, or in a shed. Do not plug a generator into a wall outlet. Do not touch downed wires.",
    supplies: "Flashlights, headlamps, batteries, power banks, battery or hand-crank radio, cooler, water, shelf-stable food, manual can opener, written emergency contacts.",
    callEmergency: "Call emergency services for fire, smoke, suspected carbon monoxide exposure, a CO alarm, injuries, downed live wires, or failure of life-support medical equipment.",
    sources: [
      "Government of Canada — Get Prepared: Power outages",
      "Health Canada — Carbon monoxide prevention",
      "Ontario — Power outages and blackouts"
    ],
    confidence: "Source-matched draft — not human reviewed",
    reviewed: "2026-05-30"
  },
  {
    id: "water-notice",
    icon: "💧",
    short: "Water",
    title: "Contaminated Water Notice",
    keywords: "water boil advisory contaminated tap drink bottled teeth dishes ice pets baby formula",
    readiness: "amber",
    readinessText: "Draft",
    trustLabels: ["OFFICIAL_GOVERNMENT", "UNVERIFIED"],
    situation: "An official notice says tap water may be unsafe or must be boiled or avoided.",
    danger: "Illness from disease-causing organisms or exposure to chemical contamination if water is used incorrectly.",
    first5: [
      "Stop using tap water for drinking, food preparation, brushing teeth, ice, baby formula, and pets until the notice is understood.",
      "Use sealed bottled water or another source confirmed safe by local officials.",
      "Read the exact advisory: boil water, do-not-consume, and do-not-use orders are not the same.",
      "Discard ice, drinks, or food prepared with unsafe water after the advisory began.",
      "Follow local public health instructions before using filters, boiling, or disinfecting methods."
    ],
    family: "Do not drink from the tap. Do not brush teeth with sink water. Use bottled water for people and pets until a grown-up says it is safe.",
    notDo: "Do not assume a pitcher filter, fridge filter, or basic carbon filter makes contaminated water safe. Do not improvise chemical disinfection unless the source card has been reviewed. VERIFY AGAINST TRUSTED SOURCE BEFORE FIELD USE.",
    supplies: "Stored bottled water, clean containers, pot and kettle, camp stove or safe cooking method, printed local public health contacts.",
    callEmergency: "Call emergency services or poison control for severe symptoms, suspected poisoning, dehydration risk, or a vulnerable person becoming ill.",
    sources: [
      "Health Canada — Food and drinking water safety in an emergency",
      "Health Canada — Boil water advisory guidance",
      "Environment and Climate Change Canada — Boil water advisories overview"
    ],
    confidence: "Source-matched draft — not human reviewed",
    reviewed: "2026-05-30"
  },
  {
    id: "winter-heat",
    icon: "❄️",
    short: "Cold",
    title: "Winter Heat Failure",
    keywords: "winter heat failure furnace cold hypothermia pipes freeze blankets layers carbon monoxide",
    readiness: "amber",
    readinessText: "Draft",
    trustLabels: ["OFFICIAL_GOVERNMENT", "UNVERIFIED"],
    situation: "Primary heat fails or a power or fuel interruption leaves the home getting cold.",
    danger: "Hypothermia, carbon monoxide poisoning from unsafe heat sources, frozen pipes, and higher risk for children, older adults, and medically vulnerable people.",
    first5: [
      "Move everyone to one smaller interior room and close off unused rooms.",
      "Dress in dry layers. Use hats, socks, blankets, and sleeping bags.",
      "Block obvious drafts at doors and windows with towels, blankets, or plastic if available.",
      "Check vulnerable people often for confusion, severe shivering, unusual sleepiness, or worsening condition.",
      "Plan early relocation to a warmer safe location if indoor temperature keeps dropping."
    ],
    family: "Put on warm layers and stay together. Use blankets and sleeping bags. Tell a grown-up right away if you feel very cold, sleepy, confused, or your body stops shivering.",
    notDo: "Do not use ovens, barbecues, outdoor heaters, generators, or camping stoves as indoor heat sources. Carbon monoxide can kill without warning.",
    supplies: "Thermal blankets, sleeping bags, winter clothing, thermometer, hand warmers, battery lights, backup power, CO alarms with battery backup.",
    callEmergency: "Call emergency services for carbon monoxide alarm or symptoms, severe hypothermia signs, inability to keep a vulnerable person warm, or flooding from burst pipes.",
    sources: [
      "Health Canada — Extreme cold",
      "Health Canada — Carbon monoxide prevention",
      "Ontario emergency and health guidance — add during human review"
    ],
    confidence: "Source-matched draft — not human reviewed",
    reviewed: "2026-05-30"
  },
  {
    id: "medical",
    icon: "🚑",
    short: "Medical",
    title: "Medical Emergency",
    keywords: "medical emergency bleeding breathing chest pain stroke seizure unconscious first aid 911 red cross",
    readiness: "red",
    readinessText: "Unreviewed",
    trustLabels: ["RED_CROSS_OR_MEDICAL_AUTHORITY", "UNVERIFIED"],
    situation: "A person may be seriously injured, unconscious, having trouble breathing, bleeding heavily, or showing severe sudden symptoms.",
    danger: "Delay can lead to death or permanent injury. This card is not a substitute for first-aid training or emergency dispatch instructions.",
    first5: [
      "Check that the scene is safe before approaching.",
      "Call 911 or direct one specific person to call 911 now.",
      "Check whether the person responds and is breathing normally.",
      "For serious external bleeding, apply firm direct pressure with a clean dressing or cloth while waiting for help.",
      "Follow emergency dispatcher instructions until responders arrive."
    ],
    family: "One grown-up helps the patient. One person calls 911. Kids stay back, keep the path clear, and bring the first-aid kit only if it is safe to do so.",
    notDo: "Do not move a person with possible head, neck, back, or major trauma unless they are in immediate danger. Do not give food or drink. Do not perform procedures you are not trained to do. VERIFY AGAINST TRAINED FIRST RESPONDER OR DISPATCHER.",
    supplies: "First-aid kit, gloves, clean dressings, pressure bandage, emergency blanket, written medical info, phone, charger.",
    callEmergency: "Call immediately for unconsciousness, abnormal breathing, chest pain, stroke signs, severe bleeding, seizure, major trauma, suspected poisoning, or any life-threatening condition.",
    sources: [
      "Canadian Red Cross — First Aid and CPR guidance",
      "Canadian Red Cross — Pocket Guide and first-aid training materials",
      "Local emergency dispatcher instructions override this draft"
    ],
    confidence: "Emergency framework only — not human reviewed",
    reviewed: "2026-05-30"
  },
  {
    id: "shelter",
    icon: "🏠",
    short: "Shelter",
    title: "Shelter in Place",
    keywords: "shelter in place chemical release hazardous material airborne smoke storm tornado lockdown ventilation windows doors",
    readiness: "amber",
    readinessText: "Draft",
    trustLabels: ["OFFICIAL_GOVERNMENT", "UNVERIFIED"],
    situation: "Authorities or conditions indicate it is safer to stay inside than to evacuate immediately.",
    danger: "Exposure to hazardous outdoor air, flying debris, severe weather, or external threat.",
    first5: [
      "Bring people and pets indoors immediately.",
      "Close and lock exterior doors and windows.",
      "Turn off fans, ventilation, furnace or AC circulation, and vents if the hazard is airborne.",
      "Move to a small interior room with emergency supplies, phone, radio, and water.",
      "Wait for official instructions before leaving or ventilating the space."
    ],
    family: "Go inside now. Close doors and windows. Stay in the safe room with the emergency bag until a grown-up hears the official all-clear.",
    notDo: "Do not go outside to investigate. Do not run ventilation during airborne hazard instructions. Do not leave shelter until official guidance says it is safe or staying becomes more dangerous.",
    supplies: "Emergency kit, phone, charger or power bank, battery radio, water, tape and plastic and wet towels if instructed, medications, pet supplies.",
    callEmergency: "Call emergency services for breathing trouble, chemical exposure symptoms, fire, injury, or if the shelter area becomes unsafe.",
    sources: [
      "Government of Canada — Get Prepared: Hazardous material releases",
      "Transport Canada Emergency Response Guidebook concepts — add during human review",
      "Local emergency officials override this draft"
    ],
    confidence: "Source-matched draft — not human reviewed",
    reviewed: "2026-05-30"
  }
];

export const defaultSupplies = [
  "Water for household and pets",
  "Flashlights and headlamps",
  "Extra batteries",
  "Power banks — charged",
  "Battery or hand-crank radio",
  "First-aid kit",
  "Medications list",
  "Manual can opener",
  "Shelf-stable food",
  "Warm blankets and sleeping bags",
  "Copies of key documents",
  "Emergency contacts — printed"
];
