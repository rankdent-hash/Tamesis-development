// Boiler & heating pages. Pure data (no React/icon imports) so the edge
// middleware can read it for link previews as well as the pages themselves.
//
// Scope note: every service here is one the business already lists on the
// boiler hub page. New boiler installation is deliberately absent — it isn't
// offered anywhere on the site, so there is no page for it.

export const HEATING_HUB = {
  slug: "boiler-heating-repair",
  navLabel: "Boiler Repair & Breakdowns",
  short: "No heating or hot water, lockouts, error codes and pressure faults.",
} as const;

export interface HeatingService {
  slug: string;
  navLabel: string;
  /** One line for cards and menus */
  short: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  includesTitle: string;
  includes: string[];
  signsTitle: string;
  signs: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
}

const FIXED_PRICE_FAQ = {
  q: "Do you give a fixed price before starting?",
  a: "Always. We assess what's needed, confirm the cost with you, and only then start work.",
};

export const heatingServices: HeatingService[] = [
  {
    slug: "boiler-servicing",
    navLabel: "Boiler Servicing",
    short: "A yearly check that keeps your boiler safe, efficient and in warranty.",
    eyebrow: "Boiler Servicing",
    title: "Annual Boiler Servicing by Gas Safe Registered Engineers",
    subtitle:
      "A yearly service keeps your boiler safe and efficient, protects the manufacturer's warranty, and catches small faults before they become a winter breakdown.",
    seoTitle: "Boiler Servicing London — Gas Safe Registered Engineers",
    seoDescription:
      "Annual boiler servicing across London by Gas Safe registered engineers. Safety checks, flue gas analysis and a written record. Fixed price before we start.",
    intro:
      "A boiler works hard for months and then gets ignored until it stops. A service is the opposite of that: a methodical check of how the boiler is burning, how it is venting, and whether its safety devices still do their job. Most manufacturers make an annual service a condition of the warranty, and it is far cheaper to find a worn part in September than to lose your heating in January.",
    includesTitle: "What a Boiler Service Covers",
    includes: [
      "Visual inspection of the boiler, flue and visible pipework",
      "Flue gas analysis to confirm the boiler is burning cleanly",
      "Gas pressure and gas rate checks",
      "Cleaning of key components where needed, including the condensate trap",
      "Checks on safety devices and controls",
      "System pressure and expansion vessel check",
      "A written record of what was checked and what we found",
    ],
    signsTitle: "When to Book a Service",
    signs: [
      { title: "It has been 12 months", body: "Once a year is the standard interval, and most manufacturer warranties depend on it." },
      { title: "The flame looks yellow", body: "A healthy gas flame is crisp and blue. A yellow, lazy flame or soot marks around the boiler mean it should be checked before you keep using it." },
      { title: "Bills are creeping up", body: "A boiler that takes longer to heat the home is often burning inefficiently or fighting a system fault." },
      { title: "Before the cold weather", body: "Summer and early autumn are the best time — any part that needs replacing can be sorted before you depend on the heating." },
    ],
    faqs: [
      { q: "How often should a boiler be serviced?", a: "Once a year. That is the interval boiler manufacturers specify, and the one most warranties require." },
      { q: "How long does a boiler service take?", a: "For a typical domestic boiler it is usually under an hour. If we find something that needs attention we will explain it and price it before doing anything further." },
      { q: "Is a boiler service the same as a gas safety check?", a: "No. A service is maintenance of the boiler itself. A landlord gas safety check (CP12) is a legal check of every gas appliance and flue in a rented property. We can carry out both in the same visit." },
      { q: "Are your engineers Gas Safe registered?", a: "Yes. All gas work is carried out by Gas Safe registered engineers, and you are welcome to ask to see the ID card on arrival." },
      FIXED_PRICE_FAQ,
    ],
  },
  {
    slug: "gas-safety-certificate",
    navLabel: "Gas Safety Certificates (CP12)",
    short: "Annual landlord gas safety checks with the record issued after the visit.",
    eyebrow: "Landlord Gas Safety",
    title: "Landlord Gas Safety Certificates (CP12) in London",
    subtitle:
      "Annual gas safety checks for landlords, letting agents and housing providers, carried out by Gas Safe registered engineers, with the Gas Safety Record issued after the visit.",
    seoTitle: "Landlord Gas Safety Certificate (CP12) London",
    seoDescription:
      "Annual landlord gas safety checks and CP12 certificates across London by Gas Safe registered engineers. Single properties and managed portfolios.",
    intro:
      "If you let a property with gas appliances, the law requires every appliance and flue you provide to be checked each year by a Gas Safe registered engineer. The Gas Safety Record — still widely called a CP12 — is your proof that it was done. We carry out the check, issue the record, and tell you plainly if anything needs attention.",
    includesTitle: "What the Gas Safety Check Covers",
    includes: [
      "Every gas appliance provided by the landlord — boiler, hob, gas fire",
      "Flues and ventilation",
      "A tightness test of the gas installation",
      "Operating pressure or heat input checks",
      "Safety device checks",
      "Gas Safety Record (CP12) issued after the visit",
      "A clear note of any defects and what is needed to put them right",
    ],
    signsTitle: "What Landlords Need to Know",
    signs: [
      { title: "Every 12 months", body: "Each gas appliance and flue you provide must be checked annually by a Gas Safe registered engineer." },
      { title: "Tenants get a copy", body: "Existing tenants must receive the record within 28 days of the check, and new tenants before they move in." },
      { title: "Keep your records", body: "Landlords must keep each Gas Safety Record for at least two years." },
      { title: "You can book early", body: "The check can be done in the two months before it is due without changing the renewal date, so there is no need to leave it to the last week." },
    ],
    faqs: [
      { q: "Who needs a landlord gas safety certificate?", a: "Anyone letting a property that has gas appliances, pipework or flues they are responsible for — private landlords, letting agents acting for them, and housing providers." },
      { q: "What happens if an appliance fails the check?", a: "The engineer records the defect and explains the risk. If an appliance is unsafe it will be made safe with your permission, and we will tell you what repair is needed and what it will cost before any further work." },
      { q: "Can you service the boiler at the same visit?", a: "Yes. A gas safety check and a boiler service are different things, but they are often booked together to save a second visit." },
      { q: "Do you look after whole portfolios?", a: "Yes. We carry out gas safety checks and boiler servicing for landlords and managing agents across multiple properties." },
      FIXED_PRICE_FAQ,
    ],
  },
  {
    slug: "power-flushing",
    navLabel: "Power Flushing",
    short: "Clears sludge from radiators and pipework to restore circulation.",
    eyebrow: "Power Flushing",
    title: "Central Heating Power Flushing in London",
    subtitle:
      "Cold spots, a noisy boiler and black water when you bleed a radiator all point to sludge. A power flush clears it out — and we will tell you honestly if you don't need one.",
    seoTitle: "Power Flushing London — Central Heating Sludge Removal",
    seoDescription:
      "Central heating power flushing across London. Clears sludge that causes cold radiators and noisy boilers. Honest assessment and a fixed price first.",
    intro:
      "Over the years, the steel inside radiators corrodes and the debris settles as a black sludge. It collects at the bottom of radiators, narrows pipework and strains the pump and the boiler's heat exchanger. A power flush pushes cleaning chemicals through the system at high flow, radiator by radiator, until the water runs clear.",
    includesTitle: "How a Power Flush Works",
    includes: [
      "An assessment first, to confirm a flush is the right fix",
      "A pumping unit connected to circulate cleaning chemicals at high flow",
      "Each radiator flushed in turn",
      "Sludge and debris captured and removed from the system",
      "Clean water run through until it is clear",
      "Corrosion inhibitor added to protect the system afterwards",
      "System refilled, bled and balanced",
    ],
    signsTitle: "Signs Your System Needs Flushing",
    signs: [
      { title: "Radiators cold at the bottom", body: "Sludge settles low and blocks the flow. Heat at the top with a cold band along the bottom is the classic sign." },
      { title: "Black water when bleeding", body: "Dirty brown or black water from a bleed valve is corrosion debris in the system." },
      { title: "A kettling boiler", body: "Rumbling or banging from the boiler often means the heat exchanger is restricted by scale or sludge." },
      { title: "Slow or uneven heating", body: "Some radiators hot and others barely warm, or a system that takes much longer to heat than it used to." },
    ],
    faqs: [
      { q: "How long does a power flush take?", a: "It depends on the number of radiators and how dirty the system is. For most homes, allow the best part of a day." },
      { q: "Can a power flush cause leaks?", a: "A flush does not damage sound pipework, but it can expose a weak joint or radiator that sludge had been sealing. That is why we assess the system first and tell you about anything that concerns us." },
      { q: "Do I always need a full power flush?", a: "No. Sometimes one blocked radiator or a chemical clean is enough. We will tell you which you actually need before selling you the bigger job." },
      { q: "Why is inhibitor added afterwards?", a: "Clean water alone will start corroding the radiators again. Inhibitor slows that down and keeps the system clean for longer." },
      FIXED_PRICE_FAQ,
    ],
  },
  {
    slug: "radiator-repairs",
    navLabel: "Radiator Repairs",
    short: "Leaks, cold spots, stuck valves, replacement and rebalancing.",
    eyebrow: "Radiators",
    title: "Radiator Repair, Replacement & Balancing",
    subtitle:
      "Leaking valves, radiators that won't heat, and rooms that never get warm — diagnosed properly, so you only pay for the fix you actually need.",
    seoTitle: "Radiator Repair & Replacement London",
    seoDescription:
      "Radiator repairs across London: leaking valves, cold radiators, TRV replacement, new radiators and system rebalancing. Fixed price before we start.",
    intro:
      "A cold radiator is a symptom, and the cause decides the cure. Air, sludge, a seized valve and a badly balanced system each leave a different pattern of hot and cold. We work out which one you have before recommending anything — because most cold radiators do not need replacing.",
    includesTitle: "Radiator Work We Carry Out",
    includes: [
      "Leaking radiator valves and joints",
      "Thermostatic radiator valve (TRV) replacement",
      "Diagnosis of radiators that won't heat",
      "Bleeding and rebalancing the system",
      "Like-for-like radiator replacement",
      "Advice on whether a flush will fix cold spots",
    ],
    signsTitle: "What the Cold Spot Is Telling You",
    signs: [
      { title: "Cold at the top", body: "Trapped air. Bleeding the radiator usually fixes it — if it keeps coming back, something is letting air in." },
      { title: "Cold at the bottom", body: "Sludge restricting the flow. This is normally a flushing job rather than a new radiator." },
      { title: "One radiator stone cold", body: "Often a seized pin in the thermostatic valve, or a system that needs balancing so heat reaches the furthest radiators." },
      { title: "Drips and rust marks", body: "Leaks at a valve or joint are usually repairable. Rust on the panel itself means the radiator has corroded through and needs replacing." },
    ],
    faqs: [
      { q: "Do I need a new radiator?", a: "Usually not. Air, sludge and stuck valves are far more common than a failed radiator. We replace a radiator when the panel itself has corroded or is leaking." },
      { q: "Can I bleed a radiator myself?", a: "Yes — with the heating off and a radiator key it is a simple job. If you find yourself doing it often, that points to a fault worth investigating." },
      { q: "What does balancing a system mean?", a: "Adjusting each radiator's valve so hot water is shared evenly, rather than the nearest radiators taking it all and the furthest staying lukewarm." },
      FIXED_PRICE_FAQ,
    ],
  },
  {
    slug: "heating-controls",
    navLabel: "Heating Controls & Thermostats",
    short: "Thermostat, programmer and motorised valve faults put right.",
    eyebrow: "Heating Controls",
    title: "Thermostat & Heating Control Repairs",
    subtitle:
      "When the heating won't come on, won't go off, or ignores the thermostat, the fault is often in the controls rather than the boiler. We find it and fix it.",
    seoTitle: "Thermostat & Heating Control Repairs London",
    seoDescription:
      "Thermostat, programmer and motorised valve faults diagnosed and repaired across London by Gas Safe registered engineers. Fixed price before we start.",
    intro:
      "A heating system is a boiler taking instructions. The room thermostat, the programmer, the cylinder thermostat and the motorised valves between them decide when it fires and where the heat goes. When one of them fails, the boiler gets blamed — and replacing a thermostat is a great deal cheaper than replacing a boiler.",
    includesTitle: "Controls We Diagnose and Repair",
    includes: [
      "Room thermostat faults and replacement",
      "Programmer and timer faults and replacement",
      "Motorised and diverter valve replacement",
      "Cylinder thermostat faults",
      "Thermostatic radiator valves",
      "Wiring and connection faults between controls and boiler",
    ],
    signsTitle: "Signs the Controls Are at Fault",
    signs: [
      { title: "Heating won't switch on", body: "The boiler is fine but never receives the call for heat — a failed thermostat, programmer or valve." },
      { title: "Heating won't switch off", body: "Radiators warm when the heating is off usually means a motorised valve stuck open." },
      { title: "Hot water but no heating", body: "Or the reverse. The valve that directs heat between the two has failed or stuck." },
      { title: "A blank or frozen display", body: "Dead programmer or thermostat. Check the batteries first — it is the most common cause, and free." },
    ],
    faqs: [
      { q: "How do I know if it is the boiler or the controls?", a: "If the boiler fires for one thing but not another — hot water but no heating, for example — the controls are the likely cause. We test each part in turn rather than guessing." },
      { q: "Is there anything I can check first?", a: "Yes. Replace the batteries in a wireless thermostat, check the programmer has not lost its settings after a power cut, and make sure the thermostat is turned above room temperature." },
      { q: "Do you replace like for like?", a: "Where the existing control is still made, yes. Where it is not, we fit a compatible replacement and show you how to use it before we leave." },
      FIXED_PRICE_FAQ,
    ],
  },
  {
    slug: "hot-water-cylinders",
    navLabel: "Hot Water Cylinders",
    short: "No hot water, immersion heaters, thermostats and cylinder leaks.",
    eyebrow: "Hot Water",
    title: "Hot Water Cylinder & Immersion Heater Repairs",
    subtitle:
      "No hot water, water that runs out too fast, or a cylinder that has started to leak — we find the cause and tell you whether it is a repair or a replacement.",
    seoTitle: "Hot Water Cylinder & Immersion Heater Repairs London",
    seoDescription:
      "Hot water cylinder and immersion heater repairs across London. No hot water, thermostat faults and leaks diagnosed, with a fixed price before we start.",
    intro:
      "If your home has a cylinder, hot water depends on more than the boiler: the cylinder thermostat, the valve that sends heat to it, and often an electric immersion heater as a back-up. Any one of them can leave you with a cold tap. We test the lot and fix the part that has actually failed.",
    includesTitle: "Cylinder Work We Carry Out",
    includes: [
      "Diagnosis of no hot water or lukewarm water",
      "Immersion heater element and thermostat replacement",
      "Cylinder thermostat faults",
      "Motorised valve faults affecting hot water",
      "Leaks at cylinder connections",
      "Honest advice on repair versus replacement",
    ],
    signsTitle: "Common Hot Water Problems",
    signs: [
      { title: "No hot water at all", body: "With heating still working, the cylinder thermostat or the valve feeding the cylinder is the usual suspect." },
      { title: "Hot water runs out quickly", body: "A failing immersion element, a thermostat set too low, or scale reducing how much the cylinder can heat." },
      { title: "Water far too hot", body: "A failed thermostat is no longer switching the heat off. Worth dealing with promptly — scalding water is a safety risk." },
      { title: "Damp around the cylinder", body: "Often a weeping connection that can be remade. A leak from the cylinder body itself means it has reached the end of its life." },
    ],
    faqs: [
      { q: "Is it the cylinder or the boiler?", a: "If the radiators heat normally but the taps run cold, the boiler is working and the fault lies with the cylinder's controls or valve. We confirm that before quoting." },
      { q: "What does the immersion heater do?", a: "It is an electric element inside the cylinder that heats the water directly. In many homes it is the back-up for when the boiler is off or out of action." },
      { q: "Can a leaking cylinder be repaired?", a: "A leak at a pipe connection or fitting usually can. A leak through the cylinder wall cannot, and replacement is the only safe answer." },
      FIXED_PRICE_FAQ,
    ],
  },
];

/** Hub first, then every sub-service — for menus, footer and related links */
export const heatingNav: { label: string; href: string; short: string }[] = [
  { label: HEATING_HUB.navLabel, href: `/services/${HEATING_HUB.slug}`, short: HEATING_HUB.short },
  ...heatingServices.map((s) => ({ label: s.navLabel, href: `/services/${s.slug}`, short: s.short })),
];
