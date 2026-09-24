
function makeEl() {
  return {
    classList: { remove: function(){}, add: function(){}, toggle: function(){}, contains: function(){ return false; } },
    setAttribute: function(){},
    getAttribute: function(){ return ''; },
    querySelectorAll: function(){ return [makeEl()]; },
    querySelector: function(){ return makeEl(); },
    addEventListener: function(){},
    removeEventListener: function(){},
    insertAdjacentHTML: function(){},
    getBoundingClientRect: function(){ return { left:0, top:0, width:100, height:100 }; },
    style: {},
    appendChild: function(){},
    prepend: function(){},
    focus: function(){},
    scrollIntoView: function(){},
    dataset: {}
  };
}
var window = this;
window.addEventListener = function(){};
window.dispatchEvent = function(){};
window.matchMedia = function(){ return { matches: false }; };
var document = {
  documentElement: { classList: { add: function(){} } },
  addEventListener: function(){},
  dispatchEvent: function(){},
  querySelectorAll: function(){ return [makeEl()]; },
  getElementById: function(){ return makeEl(); },
  querySelector: function(){ return makeEl(); },
  createElement: function(){ return makeEl(); },
  body: makeEl()
};
var location = { hash: '#home' };
var history = { replaceState: function(){} };
var URL = { revokeObjectURL: function(){}, createObjectURL: function(){} };
var IntersectionObserver = function(){ return { observe: function(){}, unobserve: function(){}, disconnect: function(){} }; };
var ResizeObserver = function(){ return { observe: function(){}, unobserve: function(){}, disconnect: function(){} }; };
var requestAnimationFrame = function(cb){ return setTimeout(cb, 0); };

/* =====================================================================
   STEP Hub — shared mock data for SPRINT-STEP cohort.
   Includes official STEP Groups, Faculty, Predefined Demo Users,
   RBAC permission models, and dynamic team dashboards.
   ===================================================================== */
window.MOCK = (function () {
  const cohort = {
    code: "STEP3", name: "SPRINT-STEP 3", timezone: "Asia/Manila",
    starts_on: "2027-06-15", ends_on: "2027-11-30", current_week: 8,
  };

  /* ---------------------------------------------------------------------
     STEP Groups / Teams — the 10 official teams in SPRINT-STEP.
     --------------------------------------------------------------------- */
  const groups = [
    { id: "g1", name: "POSTE (USC)", short: "POSTE", abbr: "USC", logo: "assets/logos/wm/usc.png", mark: "assets/logos/sm/usc.png",
      institution: "University of San Carlos", city: "Cebu City", region: "Visayas",
      about: "POSTE (Interconnected Poste Kits for Environmental Sensing)",
      technology_title: "Interconnected Poste Kits for Environmental Sensing",
      implementing_agency: "University of San Carlos",
      mentor_id: "mn1", mentor_name: "Mr. Antonio Feria", panel_letter: "A",
      initials: "PO", accent: "hsl(206 56% 56%)", glow: "hsla(206, 56%, 56%, .30)", is_public: true },

    { id: "g2", name: "SINAG (USM)", short: "SINAG", abbr: "USM", logo: "assets/logos/wm/usm.png", mark: "assets/logos/sm/usm.png",
      institution: "University of Southern Mindanao", city: "Kabacan, Cotabato", region: "Mindanao",
      about: "Optimization of Irrigation Flow through Conduit Micro Hydropower to Generate Electricity for Off-grid Barangay of Kabacan, Cotabato (SINAG)",
      technology_title: "Conduit micro hydropower utilizing irrigation canal flow for off-grid communities",
      implementing_agency: "University of Southern Mindanao",
      mentor_id: "mn2", mentor_name: "Dr. Proceso “Jon” Fernandez", panel_letter: "A",
      initials: "SI", accent: "hsl(196 56% 56%)", glow: "hsla(196, 56%, 56%, .30)", is_public: true },

    { id: "g3", name: "BRICKS (USC)", short: "BRICKS", abbr: "USC", logo: "assets/logos/wm/usc.png", mark: "assets/logos/sm/usc.png",
      institution: "University of San Carlos", city: "Cebu City", region: "Visayas",
      about: "Conversion of Quarry Waste (Silt) Into High Temperature Refractory Bricks",
      technology_title: "High-temperature refractory bricks synthesized from quarry silt waste",
      implementing_agency: "University of San Carlos",
      mentor_id: "mn3", mentor_name: "Ms. Janine Chiong", panel_letter: "A",
      initials: "BR", accent: "hsl(186 56% 56%)", glow: "hsla(186, 56%, 56%, .30)", is_public: true },

    { id: "g4", name: "Halal Blockchain (USEP)", short: "Halal Blockchain", abbr: "USeP", logo: "assets/logos/wm/usep.png", mark: "assets/logos/sm/usep.png",
      institution: "University of Southeastern Philippines", city: "Davao City", region: "Mindanao",
      about: "Blockchain-Based Novel System/Application for Transparent Traceability of Halal-and-Tayeb Cacao Products",
      technology_title: "Distributed ledger traceability platform for farm-to-table Halal cacao certification",
      implementing_agency: "University of Southeastern Philippines",
      mentor_id: "mn4", mentor_name: "Mr. Bryan Erfe", panel_letter: "A",
      initials: "HB", accent: "hsl(172 56% 56%)", glow: "hsla(172, 56%, 56%, .30)", is_public: true },

    { id: "g5", name: "Zeoskin (SLU)", short: "Zeoskin", abbr: "SLU", logo: "assets/logos/wm/slu.png", mark: "assets/logos/sm/slu.png",
      institution: "Saint Louis University", city: "Baguio City", region: "Luzon",
      about: "ZEOSKIN: A Green Indoor Air Filter",
      technology_title: "Natural zeolite-enhanced breathable bio-composite filter for indoor air quality",
      implementing_agency: "Saint Louis University",
      mentor_id: "mn5", mentor_name: "Ms. Pamela Ann Da Silva", panel_letter: "B",
      initials: "ZS", accent: "hsl(158 56% 56%)", glow: "hsla(158, 56%, 56%, .30)", is_public: true },

    { id: "g6", name: "CAPPS (MSU IIT)", short: "CAPPS", abbr: "MSU-IIT", logo: "assets/logos/wm/msu-iit.png", mark: "assets/logos/sm/msu-iit.png",
      institution: "Mindanao State University – Iligan Institute of Technology", city: "Iligan City", region: "Mindanao",
      about: "CAPPS: Development of Alternative Ceramic Armor Plates from Philippine Silicates for Philippine Armed Personnel",
      technology_title: "Ballistic-grade ceramic armor insert plates synthesized from domestic silicates",
      implementing_agency: "Mindanao State University – Iligan Institute of Technology",
      mentor_id: "mn6", mentor_name: "Ms. M.C.B. de Guzman", panel_letter: "B",
      initials: "CA", accent: "hsl(142 56% 56%)", glow: "hsla(142, 56%, 56%, .30)", is_public: true },

    { id: "g7", name: "SPArC (MSU IIT)", short: "SPArC", abbr: "MSU-IIT", logo: "assets/logos/wm/msu-iit.png", mark: "assets/logos/sm/msu-iit.png",
      institution: "Mindanao State University – Iligan Institute of Technology", city: "Iligan City", region: "Mindanao",
      about: "Synergy in Solid Fuel Production from Agri-Industrial Biomass for Boiler Combustion (SPArC)",
      technology_title: "Densified high-calorific solid biofuel pellets from agricultural waste for industrial boilers",
      implementing_agency: "Mindanao State University – Iligan Institute of Technology",
      mentor_id: "mn7", mentor_name: "Ingco", panel_letter: "B",
      initials: "SP", accent: "hsl(118 56% 56%)", glow: "hsla(118, 56%, 56%, .30)", is_public: true },

    { id: "g8", name: "meSHM (DLSU)", short: "meSHM", abbr: "DLSU", logo: "assets/logos/wm/dlsu.png", mark: "assets/logos/sm/dlsu.png",
      institution: "De La Salle University", city: "Manila", region: "Luzon",
      about: "Intelligent Structural Health Monitoring via Mesh of Tremor Sensors (meSHM)",
      technology_title: "Wireless sensor mesh for rapid post-earthquake structural integrity assessment",
      implementing_agency: "De La Salle University",
      mentor_id: "mn8", mentor_name: "Oppus", panel_letter: "C",
      initials: "MS", accent: "hsl(92 56% 56%)", glow: "hsla(92, 56%, 56%, .30)", is_public: true },

    { id: "g9", name: "SFRSCC (FEU Tech)", short: "SFRSCC", abbr: "FEU Tech", logo: "assets/logos/wm/feu-tech.png", mark: "assets/logos/sm/feu-tech.png",
      institution: "Far Eastern University – Institute of Technology", city: "Manila", region: "Luzon",
      about: "Development of Fiber-Reinforced Self-Compacting Concrete (SFRSCC) for corrosion reduction",
      technology_title: "Corrosion-inhibiting fiber-reinforced self-compacting concrete for coastal structures",
      implementing_agency: "FEU Institute of Technology",
      mentor_id: "mn9", mentor_name: "Miclat", panel_letter: "C",
      initials: "SF", accent: "hsl(62 56% 56%)", glow: "hsla(62, 56%, 56%, .30)", is_public: true },

    { id: "g10", name: "LASER (DOST PNRI)", short: "LASER", abbr: "DOST-PNRI", logo: "assets/logos/wm/dost-pnri.png", mark: "assets/logos/sm/dost-pnri.png",
      institution: "Department of Science and Technology – Philippine Nuclear Research Institute", city: "Quezon City", region: "Luzon",
      about: "Luzon Arsenic Source Tracing and Extent Mapping with Risk Mitigation and Engineering Intervention (LASER)",
      technology_title: "Isotopic tracing and point-of-use adsorbent cartridges for groundwater arsenic remediation",
      implementing_agency: "DOST - Philippine Nuclear Research Institute",
      mentor_id: "mn10", mentor_name: "Mr. Antonio Feria", panel_letter: "C",
      initials: "LA", accent: "hsl(38 56% 56%)", glow: "hsla(38, 56%, 56%, .30)", is_public: true },
  ];

  // Aliased for unified usage
  const teams = groups;

  /* ---------------------------------------------------------------------
     Curriculum Modules & Sessions
     --------------------------------------------------------------------- */
  const modules = [
    { code: "M1E", week_no: 0, title: "Pathway Ideation Workshop", session_hours: 2.5, off_session_hours: 0, trainer: "Engr. Benjamin N. Mirasol" },
    { code: "M2", week_no: 1, title: "Beachhead Markets and Customer Segments", session_hours: 3, off_session_hours: 2, trainer: "Mr. Antonio Feria" },
    { code: "M3A", week_no: 2, title: "Market Size Estimation and Market Research", session_hours: 3, off_session_hours: 1.5, trainer: "Mr. Antonio Feria" },
    { code: "M3B", week_no: 3, title: "From Understanding Use to Measured Value", session_hours: 3, off_session_hours: 1.5, trainer: "Mr. Antonio Feria" },
    { code: "M4", week_no: 4, title: "Competitive Advantage (VRIO, CPM)", session_hours: 3, off_session_hours: 2, trainer: "Mr. G. Quitoriano" },
    { code: "M5", week_no: 5, title: "Go-to-Market Plan and Lean Canvas", session_hours: 3, off_session_hours: 3, trainer: "Mr. G. Quitoriano" },
    { code: "M6", week_no: 6, title: "Business Model Validation", session_hours: 3, off_session_hours: 4, trainer: "Mr. G. Quitoriano" },
    { code: "M8", week_no: 7, title: "Overview of IP & Basics of Patents", session_hours: 3, off_session_hours: 0, trainer: "Dr. Proceso “Jon” Fernandez, with IPOPHL" },
    { code: "M10", week_no: 9, title: "Discounted Cash Flow, ROI, 5-year Projection", session_hours: 3, off_session_hours: 2, trainer: "Mr. M. Santos" },
    { code: "M11", week_no: 8, title: "Selling Skill", session_hours: 3, off_session_hours: 1.5, trainer: "Mr. G. Quitoriano" },
    { code: "M12", week_no: 10, title: "Pitching Skill", session_hours: 3, off_session_hours: 2, trainer: "Ms. D. Reyes" },
    { code: "M14", week_no: 11, title: "FASTRAC Proposal Writing Workshop", session_hours: 2, off_session_hours: 3, trainer: "AIPO Ideation Support" },
  ];

  const sessions = [
    { id: "s1", type: "learning", title: "Learning Session 4 · Competitive Advantage", week_no: 4, starts_at: "2027-07-13T09:00:00+08:00", ends_at: "2027-07-13T12:00:00+08:00", mode: "online", meeting_url: "#", status: "scheduled" },
    { id: "s2", type: "feedback", title: "Feedback Session 4 · Panels A/B/C", week_no: 4, starts_at: "2027-07-17T09:00:00+08:00", ends_at: "2027-07-17T12:00:00+08:00", mode: "online", meeting_url: "#", status: "scheduled" },
    { id: "s3", type: "learning", title: "Learning Session 5 · Go-to-Market Plan", week_no: 5, starts_at: "2027-07-20T09:00:00+08:00", mode: "online", status: "scheduled" },
    { id: "s4", type: "onsite_workshop", title: "On-site Workshop · IP, Finance, Team Formation", week_no: 7, starts_at: "2027-08-03T08:00:00+08:00", mode: "onsite", venue: "Ateneo de Manila University", status: "scheduled", is_public: true },
    { id: "s5", type: "demo_day", title: "Demo Day & Graduation", week_no: 12, starts_at: "2027-09-14T08:00:00+08:00", mode: "onsite", venue: "Ateneo de Manila University", status: "scheduled", is_public: true },
  ];

  const announcements = [
    { id: "a1", title: "Week 4 outputs due Friday 12:00 NN", body_md: "Upload your CPM and VRIO analysis plus the 5-minute video link before the deadline.", week_no: 4, priority: "important", is_pinned: true, publish_at: "2027-07-13T08:00:00+08:00", read: false, author: "STEP Team" },
    { id: "a2", title: "Panel assignments for Saturday", body_md: "Panel A: POSTE, SINAG, BRICKS, Halal Blockchain. Panel B: Zeoskin, CAPPS, SPArC. Panel C: meSHM, SFRSCC, LASER.", week_no: 4, priority: "normal", is_pinned: false, publish_at: "2027-07-12T16:30:00+08:00", read: false, author: "STEP Team" },
    { id: "a3", title: "Certificates of Appearance now downloadable", body_md: "Government-employed participants can download their certificates from the Help Desk.", week_no: 3, priority: "normal", is_pinned: false, publish_at: "2027-07-08T10:00:00+08:00", read: true, author: "STEP Team" },
    { id: "a4", title: "Session moved: typhoon signal no. 2", body_md: "Tuesday's learning session moves to Thursday, same time. Deadlines shift by two days.", week_no: 2, priority: "urgent", is_pinned: false, publish_at: "2027-06-29T06:00:00+08:00", read: true, author: "STEP Team" },
  ];

  /* ---------------------------------------------------------------------
     Trainers, Mentors and Panelists (Faculty)
     --------------------------------------------------------------------- */
  const faculty = {
    scale: [
      { grade: "Excellent", value: "4.00" }, { grade: "Good", value: "3.00" },
      { grade: "Fair", value: "2.00" }, { grade: "Poor", value: "1.00" },
    ],
    scaleNote: "Decimals allowed to one place — 3.7, 2.6 and so on.",

    trainers: [
      { id: "tr1", name: "Mr. Antonio Feria", short: "Sir Tony", initials: "AF", org: "AIPO · Marketing track",
        focus: "Markets, customers and value", modules: ["M2", "M3A", "M3B"] },
      { id: "tr2", name: "Mr. G. Quitoriano", short: "Sir GQ", initials: "GQ", org: "AIPO · Strategy track",
        focus: "Competitive advantage through to selling", modules: ["M4", "M5", "M6", "M11"] },
      { id: "tr3", name: "Mr. M. Santos", short: "Sir Mike", initials: "MS", org: "AIPO · Finance track",
        focus: "Costing, financial models and returns", modules: ["M10"] },
      { id: "tr4", name: "Dr. Proceso “Jon” Fernandez", short: "Doc Jon", initials: "PF", org: "Ateneo · with IPOPHL",
        focus: "Intellectual property and prior art", modules: ["M8"] },
      { id: "tr5", name: "Engr. Benjamin N. Mirasol", short: "Engr. Mirasol", initials: "BM", org: "AIPO",
        focus: "Commercialization pathways", modules: ["M1E"] },
      { id: "tr6", name: "Ms. D. Reyes", short: "Ms. Reyes", initials: "DR", org: "AIPO",
        focus: "Pitching and investor readiness", modules: ["M12"] },
      { id: "tr7", name: "Dr. Ma. Corazon Halili-Dichosa", short: "Dr. Corieh", initials: "CH", org: "Guest lecturer",
        focus: "Tax incentives for spin-offs", modules: ["SP1"] },
      { id: "tr8", name: "AIPO Ideation Support", short: "AIPO", initials: "AI", org: "Ateneo Intellectual Property Office",
        focus: "FASTRAC proposal writing", modules: ["M14"] },
    ],

    mentors: [
      { id: "mn1", name: "Mr. Antonio Feria",          initials: "AF", team: "POSTE",            team_id: "g1",  day: "Wed", time: "14:00", zoom: "https://zoom.us/j/0000000001" },
      { id: "mn2", name: "Dr. Proceso “Jon” Fernandez", initials: "PF", team: "SINAG",            team_id: "g2",  day: "Wed", time: "16:00", zoom: "https://zoom.us/j/0000000002" },
      { id: "mn3", name: "Ms. Janine Chiong",           initials: "JC", team: "BRICKS",           team_id: "g3",  day: "Thu", time: "09:00", zoom: "https://zoom.us/j/0000000003" },
      { id: "mn4", name: "Mr. Bryan Erfe",              initials: "BE", team: "Halal Blockchain", team_id: "g4",  day: "Thu", time: "11:00", zoom: "https://zoom.us/j/0000000004" },
      { id: "mn5", name: "Ms. Pamela Ann Da Silva",     initials: "PD", team: "Zeoskin",          team_id: "g5",  day: "Thu", time: "14:00", zoom: "https://zoom.us/j/0000000005" },
      { id: "mn6", name: "Ms. M.C.B. de Guzman",        initials: "MG", team: "CAPPS",            team_id: "g6",  day: "Thu", time: "17:00", zoom: "https://zoom.us/j/0000000006" },
      { id: "mn7", name: "Ingco",                       initials: "IN", team: "SPArC",            team_id: "g7",  day: "Fri", time: "09:00", zoom: "https://zoom.us/j/0000000007" },
      { id: "mn8", name: "Oppus",                       initials: "OP", team: "meSHM",            team_id: "g8",  day: "Fri", time: "10:30", zoom: "https://zoom.us/j/0000000008" },
      { id: "mn9", name: "Miclat",                      initials: "MI", team: "SFRSCC",           team_id: "g9",  day: "Fri", time: "13:00", zoom: "https://zoom.us/j/0000000009" },
      { id: "mn10", name: "Mr. Antonio Feria",          initials: "AF", team: "LASER",            team_id: "g10", day: "Fri", time: "15:00", zoom: "https://zoom.us/j/0000000010" },
    ],
    mentorNote: "One hour a week per team, Wednesday to Friday, at a time the team and mentor arrange between them.",

    panels: [
      { letter: "A", panelists: ["Dr. Proceso “Jon” Fernandez", "Mr. Bryan Erfe", "Ms. Janine Chiong"],
        teams: [{ team: "POSTE", team_id: "g1", at: "09:00" }, { team: "SINAG", team_id: "g2", at: "09:35" },
                { team: "BRICKS", team_id: "g3", at: "10:10" }, { team: "Halal Blockchain", team_id: "g4", at: "10:45" }] },
      { letter: "B", panelists: ["Mr. Antonio Feria", "Ms. Pamela Ann Da Silva", "Ms. M.C.B. de Guzman"],
        teams: [{ team: "Zeoskin", team_id: "g5", at: "09:00" }, { team: "CAPPS", team_id: "g6", at: "09:35" }, { team: "SPArC", team_id: "g7", at: "10:10" }] },
      { letter: "C", panelists: ["Mr. G. Quitoriano", "Ingco", "Oppus"],
        teams: [{ team: "meSHM", team_id: "g8", at: "09:00" }, { team: "SFRSCC", team_id: "g9", at: "09:35" }, { team: "LASER", team_id: "g10", at: "10:10" }] },
    ],

    sessions: [
      { code: "M1E", week: 0, title: "Pathway Ideation Workshop", trainer: "Engr. Benjamin N. Mirasol", mode: "On site",
        coverage: "Introduction to STEP · Why spin off? · Technology commercialization pathways", deliverable: "Chosen commercialization pathway", assess: [] },
      { code: "M2", week: 1, title: "Beachhead Markets and Customer Segments", trainer: "Mr. Antonio Feria", mode: "Online",
        coverage: "Market opportunity identification · Segmentation · Problem-Solution Fit Canvas",
        deliverable: "List of 5–10 market opportunities, prioritized, with a Value Proposition Statement",
        assess: [
          { label: "Has the group identified 5 to 10 possible market opportunities?", weight: 25 },
          { label: "Has the group clearly prioritized these opportunities and identified a beachhead market?", weight: 25 },
          { label: "Has the group developed a clear and coherent Problem-Solution Fit Canvas for their beachhead segment?", weight: 25 },
          { label: "Has the group articulated a compelling Value Proposition Statement based on their Problem-Solution Fit Canvas?", weight: 25 },
        ] },
      { code: "M3A", week: 2, title: "Market Size Estimation and Market Research", trainer: "Mr. Antonio Feria", mode: "Online",
        coverage: "TAM, SAM and SOM · Primary and secondary research", deliverable: "TAM SAM SOM estimate",
        assess: [{ label: "Has the group estimated their TAM, SAM, and SOM with clear rationale?", weight: 100 }] },
      { code: "M3B", week: 3, title: "From Understanding of Use to Measured Value", trainer: "Mr. Antonio Feria", mode: "Online",
        coverage: "Full life cycle use case · Customer pitch · Quantified value proposition",
        deliverable: "Concept board or brochure, and a quantified value proposition",
        assess: [
          { label: "Has the team clearly identified and detailed their product’s full life cycle use case, showing how it will be used from start to end?", weight: 30 },
          { label: "How well did the team create a compelling customer pitch using either a concept board or a brochure, demonstrating the value and appeal of their product?", weight: 30 },
          { group: "Quantified Value Proposition (Total: 40%)" },
          { label: "Relevant Metrics – Has the team identified 2–3 relevant and meaningful metrics for their customer?", weight: 10 },
          { label: "Baseline vs. Improvement – Has the team estimated the baseline performance versus the expected improvement?", weight: 10 },
          { label: "Benefit Calculation – Has the team accurately calculated the potential ₱ or % benefit to the customer?", weight: 10 },
          { label: "One-Sentence Value Proposition – How well did the team articulate a clear one-sentence value proposition?", weight: 10 },
        ] },
      { code: "M4", week: 4, title: "Competitive Advantage (VRIO, CPM)", trainer: "Mr. G. Quitoriano", mode: "Online",
        coverage: "VRIO analysis · Competitor profile matrix · Conceptualizing the value proposition",
        deliverable: "Refined value proposition",
        assess: [
          { label: "Has the group identified their Competitive Advantage? Is this sustainable? (VRIO)", weight: 50 },
          { label: "Has the group identified their Value Proposition?", weight: 50 },
        ] },
      { code: "SP1", week: 5, title: "Tax Incentives for Spin-Offs", trainer: "Dr. Ma. Corazon Halili-Dichosa", mode: "On site",
        coverage: "Guest lecture · Incentives available to research spin-offs", deliverable: "—", assess: [], special: true },
      { code: "M5", week: 5, title: "Go-to-Market Plan and Lean Canvas", trainer: "Mr. G. Quitoriano", mode: "On site",
        coverage: "Lean Canvas · Go-to-market plan · Validation through product-market fit activities",
        deliverable: "Lean Canvas, go-to-market plan and market validation",
        assess: [
          { label: "Has the group developed their Lean Canvas?", weight: 34 },
          { label: "Do they have a go-to-market plan?", weight: 33 },
          { label: "Have they validated their product-market fit?", weight: 33 },
        ] },
      { code: "M6", week: 6, title: "Business Model Validation", trainer: "Mr. G. Quitoriano", mode: "Online",
        coverage: "Team organization · Team formation and spin-off simulation · Business model validation",
        deliverable: "Team composition and roles, validated business model",
        assess: [{ label: "Has the group clearly defined team roles and responsibilities aligned with their project goals?", weight: 100 }] },
      { code: "M8", week: 7, title: "Overview of IP and Basics of Patents", trainer: "Dr. Proceso “Jon” Fernandez, with IPOPHL", mode: "On site",
        coverage: "Overview of intellectual property · Basics of patents · Prior art search",
        deliverable: "Draft IP documentation and draft Freedom to Operate analysis",
        assess: [
          { label: "Has the group produced a draft of their Intellectual Property (IP) documentation or strategy?", weight: 50 },
          { label: "Has the group produced a draft Freedom to Operate (FTO) analysis that addresses relevant IP risks?", weight: 50 },
        ] },
      { code: "M10", week: 9, title: "Discounted Cash Flow, ROI, 5-year Projection", trainer: "Mr. M. Santos", mode: "Online",
        coverage: "Basics of finance · Project and development cost estimates · Cost-benefit analysis · Break-even",
        deliverable: "Validated financial model",
        assess: [{ label: "Has the group developed and validated a Financial Model with realistic projections and assumptions?", weight: 100 }] },
      { code: "M11", week: 8, title: "Selling Skills", trainer: "Mr. G. Quitoriano", mode: "Online",
        coverage: "Qualifying a prospect · Opening with the problem · Handling objections · Closing for a next step",
        deliverable: "Prospect list, battle card and a five-minute video",
        assess: [
          { label: "Has the group produced a prospect list of at least fifteen qualified names, with budget, authority and timing noted?", weight: 30 },
          { label: "Does the battle card address the group’s two closest competitors with evidence rather than adjectives?", weight: 30 },
          { group: "The sales conversation (Total: 40%)" },
          { label: "Opening – Does the conversation open with the buyer’s problem rather than the technology?", weight: 10 },
          { label: "Evidence – Are claims supported by field data or user numbers?", weight: 10 },
          { label: "Objection handling – Does the group answer the objection actually raised?", weight: 10 },
          { label: "Commitment – Does the conversation close by naming a specific next step?", weight: 10 },
        ] },
      { code: "M12", week: 10, title: "Pitching Skills", trainer: "Ms. D. Reyes", mode: "Online",
        coverage: "Investor pitch structure · Storyline · Delivery", deliverable: "Improved pitch deck", assess: [] },
      { code: "M14", week: 11, title: "FASTRAC Proposal Writing Workshop", trainer: "AIPO Ideation Support", mode: "On site",
        coverage: "Technology roadmapping · DOST FASTRAC Form 2", deliverable: "Completed FASTRAC proposal", assess: [] },
    ],
  };

  /* ---------------------------------------------------------------------
     Predefined Demo Users (for login testing)
     --------------------------------------------------------------------- */
  const users = [
    // --- 10 Team Participants ---
    { id: "u_poste", name: "Dr. Roland Emerito", email: "remerito@usc.edu.ph", role: "participant", role_label: "Participant", team_id: "g1", team_name: "POSTE (USC)", initials: "RE", institution: "University of San Carlos" },
    { id: "u_sinag", name: "Engr. Mark Anthony", email: "manthony@usm.edu.ph", role: "participant", role_label: "Participant", team_id: "g2", team_name: "SINAG (USM)", initials: "MA", institution: "University of Southern Mindanao" },
    { id: "u_bricks", name: "Dr. Ramon Del Fierro", email: "rdelfierro@usc.edu.ph", role: "participant", role_label: "Participant", team_id: "g3", team_name: "BRICKS (USC)", initials: "RF", institution: "University of San Carlos" },
    { id: "u_halal", name: "Dr. Tamara Cher", email: "tcher@usep.edu.ph", role: "participant", role_label: "Participant", team_id: "g4", team_name: "Halal Blockchain (USEP)", initials: "TC", institution: "University of Southeastern Philippines" },
    { id: "u_zeoskin", name: "Engr. Janine Macabulos", email: "jmacabulos@slu.edu.ph", role: "participant", role_label: "Participant", team_id: "g5", team_name: "Zeoskin (SLU)", initials: "JM", institution: "Saint Louis University" },
    { id: "u_capps", name: "Dr. Ephraim Ibarra", email: "eibarra@msuiit.edu.ph", role: "participant", role_label: "Participant", team_id: "g6", team_name: "CAPPS (MSU IIT)", initials: "EI", institution: "MSU - IIT" },
    { id: "u_sparc", name: "Dr. Roberto Malaluan", email: "rmalaluan@msuiit.edu.ph", role: "participant", role_label: "Participant", team_id: "g7", team_name: "SPArC (MSU IIT)", initials: "RM", institution: "MSU - IIT" },
    { id: "u_meshm", name: "Dr. Lessandro Garciano", email: "lgarciano@dlsu.edu.ph", role: "participant", role_label: "Participant", team_id: "g8", team_name: "meSHM (DLSU)", initials: "LG", institution: "De La Salle University" },
    { id: "u_sfrscc", name: "Engr. Maria Theresa Nicole", email: "mtnicole@feutech.edu.ph", role: "participant", role_label: "Participant", team_id: "g9", team_name: "SFRSCC (FEU Tech)", initials: "MN", institution: "FEU Institute of Technology" },
    { id: "u_laser", name: "Dr. Raymond Sucgang", email: "rsucgang@pnri.dost.gov.ph", role: "participant", role_label: "Participant", team_id: "g10", team_name: "LASER (DOST PNRI)", initials: "RS", institution: "DOST - PNRI" },

    // --- Mentors ---
    { id: "u_mentor_feria", name: "Mr. Antonio Feria", email: "aferia@ateneo.edu", role: "mentor", role_label: "Mentor (POSTE & LASER)", assigned_teams: ["g1", "g10"], initials: "AF", institution: "AIPO" },
    { id: "u_mentor_fernandez", name: "Dr. Proceso “Jon” Fernandez", email: "pfernandez@ateneo.edu", role: "mentor", role_label: "Mentor (SINAG)", assigned_teams: ["g2"], initials: "PF", institution: "Ateneo / IPOPHL" },
    { id: "u_mentor_chiong", name: "Ms. Janine Chiong", email: "jchiong@ateneo.edu", role: "mentor", role_label: "Mentor (BRICKS)", assigned_teams: ["g3"], initials: "JC", institution: "AIPO" },
    { id: "u_mentor_erfe", name: "Mr. Bryan Erfe", email: "berfe@ateneo.edu", role: "mentor", role_label: "Mentor (Halal Blockchain)", assigned_teams: ["g4"], initials: "BE", institution: "AIPO" },

    // --- Panelists ---
    { id: "u_panel_erfe", name: "Mr. Bryan Erfe", email: "berfe@ateneo.edu", role: "panel", role_label: "Panelist (Panel A)", panel: "A", assigned_teams: ["g1", "g2", "g3", "g4"], initials: "BE", institution: "AIPO" },
    { id: "u_panel_silva", name: "Ms. Pamela Ann Da Silva", email: "pdasilva@ateneo.edu", role: "panel", role_label: "Panelist (Panel B)", panel: "B", assigned_teams: ["g5", "g6", "g7"], initials: "PD", institution: "AIPO" },
    { id: "u_panel_quitoriano", name: "Mr. G. Quitoriano", email: "gquitoriano@ateneo.edu", role: "panel", role_label: "Panelist (Panel C)", panel: "C", assigned_teams: ["g8", "g9", "g10"], initials: "GQ", institution: "AIPO" },

    // --- Trainers ---
    { id: "u_trainer_mirasol", name: "Engr. Benjamin N. Mirasol", email: "bmirasol@ateneo.edu", role: "trainer", role_label: "Trainer (Ideation)", initials: "BM", institution: "AIPO" },
    { id: "u_trainer_santos", name: "Mr. M. Santos", email: "msantos@ateneo.edu", role: "trainer", role_label: "Trainer (Finance)", initials: "MS", institution: "AIPO" },

    // --- Admin ---
    { id: "u_admin", name: "Ms. May Ann Albis", email: "malbis@ateneo.edu", role: "admin", role_label: "STEP Team / Admin", initials: "MA", institution: "AIPO" },

    // --- Logged out / Public visitor ---
    { id: "guest", name: "Public Visitor", email: "", role: "guest", role_label: "Guest (Not logged in)", initials: "GU", institution: "" }
  ];

  /* ---------------------------------------------------------------------
     Authentication & RBAC Helper Methods
     --------------------------------------------------------------------- */
  const auth = {
    KEY: "stephub_current_user_id",

    _get(k) {
      try { return typeof localStorage !== "undefined" ? localStorage.getItem(k) : null; } catch (e) { return null; }
    },
    _set(k, v) {
      try { if (typeof localStorage !== "undefined") localStorage.setItem(k, v); } catch (e) {}
    },

    getCurrentUser() {
      const storedId = auth._get(auth.KEY);
      const user = users.find(u => u.id === storedId);
      // Default to POSTE participant if first time, so user sees working participant state immediately
      return user || users.find(u => u.id === "u_poste");
    },

    setCurrentUser(userId) {
      const user = users.find(u => u.id === userId);
      if (user) {
        auth._set(auth.KEY, user.id);
        if (typeof window !== "undefined" && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent("stephub_auth_changed", { detail: { user } }));
        }
      }
      return user;
    },

    logout() {
      const guest = users.find(u => u.id === "guest");
      auth._set(auth.KEY, "guest");
      if (typeof window !== "undefined" && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent("stephub_auth_changed", { detail: { user: guest } }));
      }
      return guest;
    },

    canAccess(route, user) {
      const u = user || auth.getCurrentUser();
      if (!u || u.role === "guest") {
        // Public routes
        return ["home", "program", "groups"].includes(route);
      }
      // Logged in roles
      if (["home", "program", "groups"].includes(route)) return true;
      if (route === "week") return true; // All authenticated users can see cohort this-week
      if (route === "myteam" || route === "capstone") return true; // Accessible to all authenticated users
      if (route === "trainers") {
        return ["trainer", "mentor", "panel", "admin"].includes(u.role);
      }
      return true;
    },

    getAssignedTeams(user) {
      const u = user || auth.getCurrentUser();
      if (u.role === "admin" || u.role === "trainer") {
        return groups.map(g => g.id);
      }
      if (u.role === "participant") {
        return u.team_id ? [u.team_id] : [];
      }
      if (u.role === "mentor" || u.role === "panel") {
        return u.assigned_teams || [];
      }
      return [];
    }
  };

  /* ---------------------------------------------------------------------
     Dynamic Team Work & Dashboard Data Generator
     Provides realistic metrics, submissions, and qualitative radar data
     for each of the 10 teams.
     --------------------------------------------------------------------- */
  const teamWorkProfiles = {
    g1: {
      members: [
        { name: "Dr. Roland Emerito", role: "Entrepreneurial lead", initials: "RE" },
        { name: "Engr. Dan Carlo", role: "Technical lead", initials: "DC" },
        { name: "Ms. Michelle Yu", role: "Business development", initials: "MY" },
        { name: "Mr. James Tan", role: "Hardware engineer", initials: "JT" },
        { name: "Ms. Nicole Yap", role: "Researcher", initials: "NY" },
      ],
      scores: [3.55, 3.20, 3.65, 3.60, 3.10, 3.40, 3.00],
      claim: "POSTE proves environmental sensing reliability but needs clearer unit economics per municipality.",
      quote: "Show the recurring cellular telemetry and maintenance costs in pesos per pole."
    },
    g2: {
      members: [
        { name: "Engr. Mark Anthony", role: "Entrepreneurial lead", initials: "MA" },
        { name: "Dr. Cheryl Pangilinan", role: "Technical lead", initials: "CP" },
        { name: "Mr. Alvin Mendoza", role: "Business development", initials: "AM" },
        { name: "Ms. Fatima Salik", role: "Field engineer", initials: "FS" },
        { name: "Mr. Ronilo Datu", role: "Community liaison", initials: "RD" },
      ],
      scores: [3.30, 3.40, 3.50, 3.45, 3.20, 3.35, 3.25],
      claim: "SINAG has excellent local LGU and irrigators alignment; needs formal off-grid power purchase agreement terms.",
      quote: "Good flow rate data. Now validate the maintenance cycle with the irrigators' cooperative."
    },
    g3: {
      members: [
        { name: "Dr. Ramon Del Fierro", role: "Entrepreneurial lead", initials: "RF" },
        { name: "Engr. Justin Ceballos", role: "Materials engineer", initials: "JC" },
        { name: "Ms. Kristine Go", role: "Business development", initials: "KG" },
        { name: "Mr. Paul Lim", role: "Process specialist", initials: "PL" },
        { name: "Ms. Sarah Uy", role: "Researcher", initials: "SU" },
      ],
      scores: [3.70, 3.50, 3.80, 3.65, 3.40, 3.55, 3.30],
      claim: "BRICKS demonstrates superior refractory durability; customer discovery with foundry operators is strong.",
      quote: "Demonstrate batch consistency and quarry hauling costs to prove the margin against imported bricks."
    },
    g4: {
      members: [
        { name: "Dr. Tamara Cher", role: "Entrepreneurial lead", initials: "TC" },
        { name: "Engr. Jeffrey Albao", role: "Software lead", initials: "JA" },
        { name: "Ms. Norhata Macapodi", role: "Halal standards officer", initials: "NM" },
        { name: "Mr. Kenneth Dizon", role: "Business development", initials: "KD" },
        { name: "Ms. Angelie Torres", role: "Researcher", initials: "AT" },
      ],
      scores: [3.45, 3.30, 3.40, 3.50, 3.35, 3.40, 3.15],
      claim: "Halal Blockchain solves certification opacity; prioritize simple QR verification for farm coops.",
      quote: "Ensure the blockchain layer adds trust without imposing high data-entry friction on smallholder farmers."
    },
    g5: {
      members: [
        { name: "Engr. Janine Macabulos", role: "Entrepreneurial lead", initials: "JM" },
        { name: "Dr. Florence Santos", role: "Material chemist", initials: "FS" },
        { name: "Mr. Carlo Domogan", role: "Product designer", initials: "CD" },
        { name: "Ms. Patricia Cariño", role: "Business development", initials: "PC" },
        { name: "Mr. Kevin Bosaing", role: "Researcher", initials: "KB" },
      ],
      scores: [3.20, 3.15, 3.45, 3.30, 3.10, 3.25, 3.05],
      claim: "Zeoskin proves particulate capture; clear B2B pricing for hospital and office HVAC systems is required.",
      quote: "Compare zeolite replacement cycles against conventional HEPA filters in total cost of ownership."
    },
    g6: {
      members: [
        { name: "Dr. Ephraim Ibarra", role: "Entrepreneurial lead", initials: "EI" },
        { name: "Engr. Michael Galvez", role: "Ceramics engineer", initials: "MG" },
        { name: "Ms. Sittie Dimakuta", role: "Business development", initials: "SD" },
        { name: "Mr. Bryan Alonto", role: "Testing & ballistics", initials: "BA" },
        { name: "Ms. Leila Usman", role: "Researcher", initials: "LU" },
      ],
      scores: [3.60, 3.40, 3.55, 3.70, 3.30, 3.45, 3.20],
      claim: "CAPPS has strong ballistic test credentials; focus on defense procurement compliance and manufacturing scale.",
      quote: "The NIJ Level III testing result is solid. Address shelf life and resin-backing supply chains."
    },
    g7: {
      members: [
        { name: "Dr. Roberto Malaluan", role: "Entrepreneurial lead", initials: "RM" },
        { name: "Engr. Francis Dave", role: "Bioenergy engineer", initials: "FD" },
        { name: "Ms. Hazel Grace", role: "Business development", initials: "HG" },
        { name: "Mr. Dennis Ramos", role: "Operations lead", initials: "DR" },
        { name: "Ms. Carmela Solis", role: "Researcher", initials: "CS" },
      ],
      scores: [3.35, 3.25, 3.40, 3.35, 3.15, 3.30, 3.10],
      claim: "SPArC demonstrates high calorific value; clarify biomass feedstock seasonality and drying logistics.",
      quote: "Industrial boiler operators care about ash fouling. Highlight your low slagging index."
    },
    g8: {
      members: [
        { name: "Dr. Lessandro Garciano", role: "Entrepreneurial lead", initials: "LG" },
        { name: "Engr. Patrick Joseph", role: "Hardware engineer", initials: "PJ" },
        { name: "Ms. Chloe Tan", role: "Software & AI lead", initials: "CT" },
        { name: "Mr. Ralph Gonzales", role: "Business development", initials: "RG" },
        { name: "Ms. Bianca Villareal", role: "Researcher", initials: "BV" },
      ],
      scores: [3.65, 3.55, 3.70, 3.75, 3.50, 3.60, 3.40],
      claim: "meSHM has compelling building code compliance alignment; insurance discount partnerships will accelerate adoption.",
      quote: "Structural engineers love the real-time modal frequency detection. Package it as an annual building audit tool."
    },
    g9: {
      members: [
        { name: "Engr. Maria Theresa Nicole", role: "Entrepreneurial lead", initials: "MN" },
        { name: "Dr. Anthony Cabatingan", role: "Concrete technologist", initials: "AC" },
        { name: "Mr. Gerald Co", role: "Structural tester", initials: "GC" },
        { name: "Ms. Bea Santos", role: "Business development", initials: "BS" },
        { name: "Mr. Christian Reyes", role: "Researcher", initials: "CR" },
      ],
      scores: [3.25, 3.10, 3.35, 3.30, 3.05, 3.20, 2.95],
      claim: "SFRSCC shows high slump flow and anti-spalling; quantify cost savings per cubic meter for port builders.",
      quote: "Port authorities need 25-year life cycle cost comparisons versus standard marine concrete."
    },
    g10: {
      members: [
        { name: "Dr. Raymond Sucgang", role: "Entrepreneurial lead", initials: "RS" },
        { name: "Ms. Arlene Delgado", role: "Analytical chemist", initials: "AD" },
        { name: "Engr. Neil Raymund", role: "Isotope specialist", initials: "NR" },
        { name: "Mr. Paulo Baldo", role: "Business development", initials: "PB" },
        { name: "Ms. Catherine Cruz", role: "Researcher", initials: "CC" },
      ],
      scores: [3.50, 3.35, 3.60, 3.55, 3.25, 3.45, 3.30],
      claim: "LASER possesses undisputed isotope tracing accuracy; commercialize the point-of-use filter cartridge directly with water districts.",
      quote: "Target local water districts where arsenic exceeds WHO standards and demonstrate filter cartridge replacement margins."
    }
  };

  function getTeamWork(teamId) {
    const tid = teamId || (auth.getCurrentUser().team_id || "g1");
    const t = groups.find(x => x.id === tid) || groups[0];
    const p = teamWorkProfiles[t.id] || teamWorkProfiles.g1;

    const outputs = [
      { code: "M2",  axis: "Beachhead\nmarkets", full: "Beachhead markets and customer segments", week: 1, score: p.scores[0], panel: t.panel_letter, scored_on: "2027-06-26" },
      { code: "M3A", axis: "Market\nsize", full: "Market size estimation and market research", week: 2, score: p.scores[1], panel: t.panel_letter, scored_on: "2027-07-03" },
      { code: "M3B", axis: "Measured\nvalue", full: "From understanding use to measured value", week: 3, score: p.scores[2], panel: t.panel_letter, scored_on: "2027-07-10" },
      { code: "M4",  axis: "Competitive\nadvantage", full: "Competitive advantage (VRIO, CPM)", week: 4, score: p.scores[3], panel: t.panel_letter, scored_on: "2027-07-17" },
      { code: "M5",  axis: "Go-to-market\nplan", full: "Go-to-market plan and lean canvas", week: 5, score: p.scores[4], panel: t.panel_letter, scored_on: "2027-07-24" },
      { code: "M6",  axis: "Business model\nvalidation", full: "Business model validation", week: 6, score: p.scores[5], panel: t.panel_letter, scored_on: "2027-07-31" },
      { code: "M10", axis: "Financial\nanalysis", full: "Discounted cash flow, ROI, 5-year projection", week: 7, score: p.scores[6], panel: t.panel_letter, scored_on: "2027-08-07" },
    ];

    const att_grid = {};
    p.members.forEach((m, idx) => {
      // 14 sessions attendance profile
      att_grid[m.initials] = [1, 1, 1, 1, (idx % 2 === 0 ? 1 : 0), 1, 1, 1, 1, 1, 1, 1, 1, 1];
    });

    return {
      team_id: t.id,
      team_name: t.name,
      technology_title: t.technology_title,
      implementing_agency: t.implementing_agency,
      region: t.region,
      week_no: 8,
      weeks_total: 12,
      members: p.members,
      outputs,
      sessions_held: [
        { n: 1, label: "W1 Learning" }, { n: 2, label: "W1 Feedback" },
        { n: 3, label: "W2 Learning" }, { n: 4, label: "W2 Feedback" },
        { n: 5, label: "W3 Learning" }, { n: 6, label: "W3 Feedback" },
        { n: 7, label: "W4 Learning" }, { n: 8, label: "W4 Feedback" },
        { n: 9, label: "W5 Learning" }, { n: 10, label: "W5 Feedback" },
        { n: 11, label: "W6 Learning" }, { n: 12, label: "W6 Feedback" },
        { n: 13, label: "W7 Learning" }, { n: 14, label: "W7 Feedback" },
      ],
      attendance_grid: att_grid,
      submissions: [
        { week: 8, module: "M11 · Selling skills", due: "2027-08-13T12:00:00+08:00", status: "open", files: [] },
        { week: 7, module: "M10 · Financial analysis", due: "2027-08-06T12:00:00+08:00", status: "scored", score: p.scores[6],
          files: [{ kind: "video", name: `${t.short.toLowerCase()}-w7-pitch.mp4`, size: "184 MB", at: "2027-08-06T11:42:00+08:00" },
                  { kind: "slides", name: `${t.short}_W7_Financials.pdf`, size: "6.2 MB", at: "2027-08-06T11:44:00+08:00" }] },
        { week: 6, module: "M6 · Business model validation", due: "2027-07-30T12:00:00+08:00", status: "scored", score: p.scores[5],
          files: [{ kind: "video", name: `${t.short.toLowerCase()}-w6-validation.mp4`, size: "201 MB", at: "2027-07-30T10:08:00+08:00" },
                  { kind: "slides", name: `${t.short}_W6_BMV.pptx`, size: "11.4 MB", at: "2027-07-30T10:10:00+08:00" }] },
        { week: 5, module: "M5 · Go-to-market plan", due: "2027-07-23T12:00:00+08:00", status: "scored", score: p.scores[4],
          files: [{ kind: "video", name: `${t.short.toLowerCase()}-w5-gtm.mp4`, size: "176 MB", at: "2027-07-23T13:05:00+08:00", late: true },
                  { kind: "slides", name: `${t.short}_W5_LeanCanvas.pdf`, size: "4.8 MB", at: "2027-07-23T11:58:00+08:00" }] },
      ],
      trajectory: outputs.map(o => ({ week: o.week, code: o.code, score: o.score })),
      handin_kinds: [
        { key: "video", label: "Five-minute video" },
        { key: "slides", label: "Slide deck" },
        { key: "report", label: "Feedback application report" },
      ],
      handins: [
        { week: 1, code: "M2", due: "2027-06-25T12:00:00+08:00", video: { state: "on_time", at: "2027-06-25T09:20:00+08:00" }, slides: { state: "on_time", at: "2027-06-25T09:24:00+08:00" }, report: { state: "on_time", at: "2027-06-27T20:10:00+08:00" } },
        { week: 2, code: "M3A", due: "2027-07-02T12:00:00+08:00", video: { state: "on_time", at: "2027-07-02T10:55:00+08:00" }, slides: { state: "on_time", at: "2027-07-02T11:02:00+08:00" }, report: { state: "on_time", at: "2027-07-04T18:40:00+08:00" } },
        { week: 3, code: "M3B", due: "2027-07-09T12:00:00+08:00", video: { state: "on_time", at: "2027-07-09T11:31:00+08:00" }, slides: { state: "late", at: "2027-07-10T08:15:00+08:00", late_days: 1 }, report: { state: "missed" } },
        { week: 4, code: "M4", due: "2027-07-16T12:00:00+08:00", video: { state: "on_time", at: "2027-07-16T08:47:00+08:00" }, slides: { state: "on_time", at: "2027-07-16T08:52:00+08:00" }, report: { state: "on_time", at: "2027-07-18T21:05:00+08:00" } },
        { week: 5, code: "M5", due: "2027-07-23T12:00:00+08:00", video: { state: "late", at: "2027-07-23T13:05:00+08:00", late_days: 1 }, slides: { state: "on_time", at: "2027-07-23T11:58:00+08:00" }, report: { state: "on_time", at: "2027-07-25T19:30:00+08:00" } },
        { week: 6, code: "M6", due: "2027-07-30T12:00:00+08:00", video: { state: "on_time", at: "2027-07-30T10:08:00+08:00" }, slides: { state: "on_time", at: "2027-07-30T10:10:00+08:00" }, report: { state: "missed" } },
        { week: 7, code: "M10", due: "2027-08-06T12:00:00+08:00", video: { state: "on_time", at: "2027-08-06T11:42:00+08:00" }, slides: { state: "on_time", at: "2027-08-06T11:44:00+08:00" }, report: { state: "on_time", at: "2027-08-08T17:12:00+08:00" } },
        { week: 8, code: "M11", due: "2027-08-13T12:00:00+08:00", video: { state: "open" }, slides: { state: "open" }, report: { state: "open" } },
      ],
      insight: {
        method: "Reflexive thematic analysis — every panel comment coded, codes grouped into themes",
        claim: p.claim,
        based_on: 23, weeks: "Weeks 1–7", reviewed_by: "Ms. May Ann Albis, STEP team", reviewed_on: "2027-08-11",
        corpus: { comments: 23, panelists: 6, sessions: 7, codes: 9, themes: 4 },
        saturation: "No new code appeared after Week 6 — the code book has settled.",
        themes: [
          { name: "Evidence of demand is convincing", polarity: "strength", mentions: 9,
            detail: `User interviews and pilot letters of intent for ${t.name} are cited approvingly by Panel ${t.panel_letter}.`,
            extracts: [{ who: t.mentor_name, week: 6, text: `Fieldwork and data from ${t.city} are the strongest part of this deck.` }] },
          { name: "Value proposition clarity", polarity: "gap", mentions: 7,
            detail: p.quote,
            extracts: [{ who: "Panelist", week: 7, text: p.quote }] },
          { name: "Competitor differentiation", polarity: "watch", mentions: 4,
            detail: "Keep the benchmarked competitors fixed for the rest of the cycle.",
            extracts: [{ who: "Panelist", week: 5, text: "Focus comparison against the top commercial alternatives currently imported." }] }
        ],
        quotes: [{ who: t.mentor_name, week: 7, text: p.quote }],
        next: [
          `Express value proposition as clear ROI metrics for ${t.institution} partners.`,
          "Freeze competitor benchmark comparison matrix.",
          "Open Week 8 pitch with customer pain point rather than technical specifications."
        ]
      }
    };
  }

  /* ---------------------------------------------------------------------
     Dynamic Capstone (DOST Form 2 & Pitch Deck) Generator
     --------------------------------------------------------------------- */
  function getCapstone(teamId) {
    const tid = teamId || (auth.getCurrentUser().team_id || "g1");
    const t = groups.find(x => x.id === tid) || groups[0];
    const p = teamWorkProfiles[t.id] || teamWorkProfiles.g1;
    const lead = p.members[0];

    const form = [
      { n: 1, group: "Project profile", title: "Project profile", kind: "profile",
        guide: "Program and project title, project leader and sex, duration with start and end dates, implementing agency, and the full address.",
        week: 0, source: "Kick-off", status: "reviewed",
        value: {
          program: `SPRINT-STEP Commercialization Program — ${t.name}`,
          title: `${t.name} — ${t.technology_title}`,
          leader: lead.name, sex: "M", months: "24",
          start: "2028-01-15", end: "2030-01-14",
          agency: `${t.implementing_agency}`,
          address: `${t.city}, ${t.region}, Philippines · contact@${t.abbr.toLowerCase().replace(/[^a-z]/g, '')}.edu.ph`
        }
      },
      { n: 2, group: "Project profile", title: "Cooperating agency/ies", kind: "prose",
        guide: "Agencies that support the project as collaborator, co-grantor, committed adopter of the resulting technology, or potential investor.",
        week: 0, source: "Kick-off", status: "reviewed",
        draft: `Local Government Unit of ${t.city} (committed adopter); Regional DOST Office (${t.region}); Industry Partners.`
      },
      { n: 3, group: "Project profile", title: "Site(s) of implementation", kind: "sites",
        guide: "Location/s where the project will be conducted.",
        week: 0, source: "Kick-off", status: "reviewed",
        value: [
          { country: "Philippines", region: t.region, province: t.city, district: "1st", municipality: t.city, barangay: "Poblacion" },
          { country: "Philippines", region: t.region, province: t.city, district: "2nd", municipality: t.city, barangay: "Industrial Zone" }
        ]
      },
      { n: 4, group: "Project profile", title: "Type of research", kind: "choice",
        guide: "Pre-commercialization — activities that bridge R&D and commercialization.",
        week: 0, source: "Kick-off", status: "reviewed",
        value: { precommercialization: true }
      },
      { n: 5, group: "Project profile", title: "R&D priority area, program and SDG", kind: "agenda",
        guide: "Which HNRDA agenda the project falls under and which SDGs it addresses.",
        week: 0, source: "Kick-off", status: "reviewed",
        value: { area: "Industry & Emerging Tech", commodity: t.short, priorityTopic: t.technology_title, sectorIndustry: "Manufacturing & Infrastructure", sectorBasic: "Applied Science", sdg: "SDG 9 (Industry, Innovation & Infrastructure) & SDG 11 (Sustainable Cities)" }
      },
      { n: 6, group: "The case", title: "Executive summary and startup background", kind: "prose",
        guide: "Briefly discusses what the proposal is about, founders, value proposition, and IP status.",
        week: 3, revisit: 9, source: "M3B · Measured value", status: "submitted", limit: 200,
        draft: `${t.name} is a university spin-off from ${t.implementing_agency} founded by ${lead.name} and research co-inventors. The team developed ${t.technology_title}. Field validation in ${t.city} demonstrates substantial cost reduction and operational advantage over imported solutions. IP protection includes a Philippine patent / utility model application. Grant funds will deploy industrial-scale pilot units across target partner sites.`
      },
      { n: 7, group: "The case", title: "Introduction — rationale, scientific basis, objectives", kind: "prose",
        guide: "Rationale, scientific framework, and general and specific objectives.",
        week: 11, source: "M14 · FASTRAC writeshop", status: "locked", limit: 300
      },
      { n: 8, group: "The case", title: "Review of literature & Prior Art", kind: "prose",
        guide: "State of the art, prior art search, patent novelty, and freedom-to-operate.",
        week: 7, source: "On-site · M8 IP and patents", status: "reviewed",
        draft: `Prior art search with IPOPHL confirmed no blocking patents in the Philippines for ${t.short}'s specialized formulation and architecture. Prototype validation completed successfully in 2026.`
      },
      { n: 9, group: "The case", title: "Marketing and commercial viability", kind: "prose",
        guide: "Competitor matrix, production requirements, target distribution, sales forecast.",
        week: 2, revisit: 7, source: "M3A, M4, M5, M10", status: "draft",
        draft: `Target beachhead market consists of industrial and municipal clients in ${t.region}. Competitive analysis indicates ${t.name} delivers 35% cost savings with domestic fabrication and immediate technical support.`
      },
      { n: 10, group: "Plan", title: "Methodology", kind: "prose",
        guide: "Parameters measured, experimental procedure, scale-up strategy.",
        week: 6, source: "M6 · Business model validation", status: "draft",
        draft: `Phase 1 (Months 1–6): Pilot fabrication and QA calibration. Phase 2 (Months 7–18): Field deployment across 3 pilot sites in ${t.region}. Phase 3 (Months 19–24): Long-term durability and unit economics verification.`
      },
      { n: 11, group: "Plan", title: "Technology roadmap", kind: "prose",
        guide: "Milestones matching technology maturity to market validation.",
        week: 10, source: "M13 · Technology roadmapping", status: "locked"
      },
      { n: 12, group: "Plan", title: "Expected outputs (6Ps)", kind: "prose",
        guide: "Publication, Patent, Product, People, Place/Partnership, Policy.",
        week: 8, source: "M11 · Selling skills", status: "open"
      },
      { n: 13, group: "Plan", title: "Potential outcomes", kind: "prose",
        guide: "Long-term results delivered 3 years after grant conclusion.",
        week: 6, source: "M6 · Business model validation", status: "submitted",
        draft: `Within three years: commercial deployment of ${t.short} across national facilities, generating sustained revenue, sustainable local manufacturing, and regional employment.`
      },
      { n: 14, group: "Plan", title: "Potential impacts (2Is)", kind: "prose",
        guide: "Social and economic impact dimensions.",
        week: 10, source: "M13 · Technology roadmapping", status: "locked"
      },
      { n: 15, group: "Plan", title: "Target beneficiaries", kind: "prose",
        guide: "Direct and indirect beneficiary groups.",
        week: 1, source: "M2 · Beachhead markets", status: "reviewed",
        draft: `Direct: Partner cooperatives, LGUs, and industrial facilities in ${t.region}. Indirect: Surrounding communities benefiting from improved safety, resource efficiency, and local technology self-reliance.`
      },
      { n: 16, group: "Plan", title: "Sustainability plan", kind: "prose",
        guide: "Post-grant commercial viability and revenue model.",
        week: 7, source: "On-site · M9 Tax incentives for spin-offs", status: "revise",
        draft: `Revenue generated via equipment sales and service maintenance agreements. Registration as an approved DOST spin-off under the Philippine Innovative Startup Act.`
      },
      { n: 17, group: "Compliance", title: "Gender and Development (GAD) score", kind: "prose",
        guide: "GAD checklist score and gender equality integrations.",
        week: 11, source: "M14 · FASTRAC writeshop", status: "locked"
      },
      { n: 18, group: "Compliance", title: "Limitations of the project", kind: "prose",
        guide: "Constraints and boundary limits of the project.",
        week: 11, source: "M14 · FASTRAC writeshop", status: "locked"
      },
      { n: 19, group: "Compliance", title: "Risks, assumptions and risk management plan", kind: "prose",
        guide: "Key risks and mitigation measures.",
        week: 11, source: "M14 · FASTRAC writeshop", status: "locked"
      },
      { n: 20, group: "Compliance", title: "Literature cited", kind: "prose",
        guide: "Full bibliography and technical citations.",
        week: 11, source: "M14 · FASTRAC writeshop", status: "locked"
      },
      { n: 21, group: "Resources", title: "Personnel requirement", kind: "personnel",
        guide: "Team roles and percent time dedicated.",
        week: 7, source: "On-site · M7 Team organisation", status: "submitted",
        value: p.members.map((m, idx) => ({
          position: `${m.name} (${m.role})`,
          pct: idx === 0 ? "50" : "40",
          resp: idx === 0 ? "Overall Project Leadership & Technology Management" : "Technical Development & Deployment"
        }))
      },
      { n: 22, group: "Resources", title: "Budget by implementing agency", kind: "budget",
        guide: "Personnel Services, MOOE, and Equipment Outlay per year.",
        week: 7, source: "On-site · M10 Financial analysis", status: "draft",
        value: {
          rows: [
            { label: "Year 1", ps: 1800000, mooe: 2100000, eo: 1500000 },
            { label: "Year 2", ps: 1900000, mooe: 1900000, eo: 400000 },
            { label: "Year n", ps: 0, mooe: 0, eo: 0 }
          ],
          counterpart: `Counterpart (${t.implementing_agency}, in kind): Laboratory facilities, utilities, and testing equipment.`
        }
      },
      { n: 23, group: "Resources", title: "Other ongoing projects of the project leader", kind: "projects",
        guide: "Current active research grants handled by project leader.",
        week: 11, source: "M14 · FASTRAC writeshop", status: "locked",
        value: { count: "", rows: [{ title: "", agency: "", role: "" }] }
      },
      { n: 24, group: "Attachments", title: "Other supporting documents", kind: "attachments",
        guide: "Counterpart letters, CVs, endorsement clearances.",
        week: 9, source: "Collected through the cycle", status: "draft",
        attachments: [
          { label: "Detailed fund breakdown with counterpart commitment letters", have: true },
          { label: "Institution counterpart fund commitment (min 15%)", have: true },
          { label: "CV of Project Leader and co-inventors", have: true },
          { label: "Endorsement from Head of Implementing Agency", have: true },
          { label: "Line-item budget and Gantt chart workplan", have: false }
        ]
      }
    ];

    const deck = [
      { n: 1,  title: t.name, sub: "Title and team", week: 0, source: "Kick-off", kind: "title", status: "in" },
      { n: 2,  title: "The problem", sub: `Unmet market pain addressed by ${t.short}`, week: 1, source: "M2", kind: "statement", status: "in", score: p.scores[0] },
      { n: 3,  title: "Beachhead market", sub: `Primary customers in ${t.region}`, week: 1, source: "M2", kind: "bullets", status: "in", score: p.scores[0] },
      { n: 4,  title: "Market size", sub: "TAM, SAM, SOM for the Philippines", week: 2, source: "M3A", kind: "chart", status: "in", score: p.scores[1] },
      { n: 5,  title: "Value proposition", sub: "Measurable customer ROI and performance", week: 3, source: "M3B", kind: "statement", status: "in", score: p.scores[2] },
      { n: 6,  title: "Competitive advantage", sub: "VRIO and Competitive Profile Matrix", week: 4, source: "M4", kind: "table", status: "in", score: p.scores[3] },
      { n: 7,  title: "Go-to-market", sub: "Distribution and customer acquisition plan", week: 5, source: "M5", kind: "grid", status: "in", score: p.scores[4] },
      { n: 8,  title: "Validation evidence", sub: `Field trials and pilot testing in ${t.city}`, week: 6, source: "M6", kind: "chart", status: "in", score: p.scores[5] },
      { n: 9,  title: "Team and spin-off", sub: `${t.implementing_agency} commercialization team`, week: 7, source: "M7", kind: "grid", status: "in" },
      { n: 10, title: "IP strategy", sub: "Patents, utility models and trade secrets", week: 7, source: "M8", kind: "bullets", status: "in" },
      { n: 11, title: "Financial model", sub: "5-year projection, payback and unit economics", week: 7, source: "M10", kind: "chart", status: "in", score: p.scores[6] },
      { n: 12, title: "The ask", sub: "DOST FASTRAC funding request and milestones", week: 8, source: "M11", kind: "statement", status: "due" },
      { n: 13, title: "Technology roadmap", sub: "Scale-up timeline through 2030", week: 10, source: "M13", kind: "timeline", status: "locked" },
      { n: 14, title: "Summary and contact", sub: `Connect with ${t.name}`, week: 9, source: "M12", kind: "title", status: "locked" }
    ];

    return {
      team_id: t.id,
      team_name: t.name,
      technology_title: t.technology_title,
      week_no: 8,
      weeks_total: 12,
      demo_day: "2027-09-14",
      form,
      deck
    };
  }

  /* ---------------------------------------------------------------------
     Cohort This Week Data
     --------------------------------------------------------------------- */
  const thisWeek = {
    week_no: 8, weeks_total: 12,
    today: "2027-08-12T14:30:00+08:00",
    starts: "2027-08-10", ends: "2027-08-16",
    topic: {
      code: "M11", title: "Selling skills",
      tagline: "Turning a good technology into a conversation someone says yes to.",
      brief: "Most research teams can explain what their technology does and still lose the room. This week is about the other half of the job: finding the people who can actually buy, opening with the problem they already feel, and closing with a specific next step instead of a polite goodbye.",
      able: [
        "Qualify a prospect on budget, authority and timing before spending a meeting on them",
        "Open a pitch with the buyer's problem rather than your technology",
        "Answer the objection you actually get, using a battle card you prepared",
      ],
      output: "A prospect list of at least fifteen qualified names, a one-page battle card for your two closest competitors, and a five-minute video of your team running the conversation end to end.",
      materials: [
        { name: "M11 Selling skills — slide deck", type: "PDF", size: "4.2 MB", by: "Mr. G. Quitoriano", at: "2027-08-09T16:20:00+08:00" },
        { name: "Prospect qualification worksheet", type: "XLSX", size: "82 KB", by: "Mr. G. Quitoriano", at: "2027-08-09T16:22:00+08:00" },
        { name: "Tuesday session recording", type: "Video", size: "1 h 52 m", by: "STEP Team", at: "2027-08-10T14:10:00+08:00" },
        { name: "Battle card template", type: "DOCX", pending: "Expected Friday" },
      ],
    },
    days: [
      { d: "2027-08-10", label: "Tuesday", kind: "session", title: "Learning session · M11 Selling skills", time: "9:00 AM – 12:00 NN", where: "Zoom", note: "Recording posted the same afternoon.", action: "recording" },
      { d: "2027-08-11", label: "Wednesday", kind: "window", title: "Mentoring window opens", time: "Wednesday to Friday", note: "One hour with your mentor, arranged directly." },
      { d: "2027-08-12", label: "Thursday", kind: "window", title: "Mentoring continues", time: "Any slot your team booked", note: "Nothing scheduled by STEP team today." },
      { d: "2027-08-13", label: "Friday", kind: "deadline", title: "Team output due", time: "12:00 NN", note: "Prospect list, battle card and five-minute video.", action: "submit" },
      { d: "2027-08-14", label: "Saturday", kind: "panel", title: "Feedback session · Panels A, B and C", time: "9:00 AM – 12:00 NN", where: "Zoom", note: "Five-minute video, then fifteen minutes of questions.", action: "join" },
      { d: "2027-08-15", label: "Sunday", kind: "rest", title: "No session", note: "Rest and regroup." },
      { d: "2027-08-16", label: "Monday", kind: "info", title: "Week 9 materials posted", note: "M12 Pitching skills opens on Program page." },
    ],
    announcements: [
      { id: "w8a", icon: "alert", pinned: true, priority: "important", title: "Saturday panels start at 9:00 AM sharp",
        body: "Panel assignments: Panel A (POSTE, SINAG, BRICKS, Halal Blockchain), Panel B (Zeoskin, CAPPS, SPArC), Panel C (meSHM, SFRSCC, LASER).",
        by: "Ms. May Ann Albis", at: "2027-08-11T08:30:00+08:00", read: false },
      { id: "w8b", icon: "file", pinned: false, priority: "normal", title: "Week 8 materials are up",
        body: "Slide deck and worksheet are posted.",
        by: "STEP Team", at: "2027-08-09T16:25:00+08:00", read: false },
      { id: "w8c", icon: "cert", pinned: false, priority: "normal", title: "Certificates of Appearance for August",
        body: "Government-employed participants can download certificates from the help desk.",
        by: "STEP Team", at: "2027-08-10T09:15:00+08:00", read: true },
      { id: "w8d", icon: "chart", pinned: false, priority: "normal", title: "Week 7 results released",
        body: "Financial analysis scores and panel comments are now visible on My Team's Work.",
        by: "STEP Team", at: "2027-08-09T11:00:00+08:00", read: true },
    ],
    helpdesk: [
      { who: "Ms. May Ann Albis", role: "STEP Team", me: false, at: "2027-08-12T09:02:00+08:00",
        body: "Good morning po! Reminder lang, bukas 12 NN ang deadline ng Week 8 output. The battle card template will be up by 10 AM tomorrow." },
      { who: "Anonymous participant", role: "", anon: true, me: false, at: "2027-08-12T09:40:00+08:00",
        body: "Ma'am, pwede po bang two competitors lang sa battle card? Yung third namin hindi pa confirmed." },
      { who: "Ms. May Ann Albis", role: "STEP Team", me: false, at: "2027-08-12T09:51:00+08:00",
        body: "Yes, two is fine. Better two you can defend than three you are guessing at." },
      { who: "Mr. G. Quitoriano", role: "Trainer", me: false, at: "2027-08-12T11:30:00+08:00",
        body: "Not at all. What the panel wants is evidence you had the conversation — even a note of what the customer said counts." },
    ],
    housekeeping: [
      { title: "How the panels work", note: "Five-minute video, fifteen minutes of questions, three panelists." },
      { title: "Missed the session?", note: "Every learning session is recorded and posted the same afternoon." },
    ],
    game: {
      title: "Put the sales conversation in order",
      prompt: "From first contact to closing a next step. Drag the cards into the order you would run them.",
      steps: [
        { order: 1, label: "Warm open & trigger event", why: "Reference the buyer's current problem before talking about your solution." },
        { order: 2, label: "Diagnose & qualify budget/authority", why: "Ensure they have decision authority before pitching specifics." },
        { order: 3, label: "Tailored value proposition", why: "Show how your technology uniquely addresses their pain point." },
        { order: 4, label: "Handle objections with battle card", why: "Address competitor comparisons with prepared evidence." },
        { order: 5, label: "Commitment to a concrete next step", why: "Lock in a trial, demo date or proposal review instead of a polite exit." },
      ],
    },
  };

  const articles = [
    { slug: "step-3-kickoff", photo: "assets/photos/teams.jpg", kind: "article", title: "Ten research teams begin SPRINT-STEP 3",
      excerpt: "Teams from Luzon, the Visayas and Mindanao opened the cycle with a two-day kick-off at the Ateneo campus.",
      published_at: "2027-06-16", author: "AIPO Communications", read: "4 min read",
      tags: ["Program news"], cover_color: "#dfeefc" },
    { slug: "spinoff-policy-brief", photo: "assets/photos/panel.jpg", kind: "publication", title: "What slows down university spin-offs in the Philippines",
      excerpt: "Evidence from two STEP cycles on fairness opinion boards, licensing timelines and equity rules, with five recommendations for HEIs.",
      published_at: "2027-05-30", author: "AIPO Policy Team", venue: "AIPO Policy Brief 2027-02", read: "PDF · 18 pages",
      tags: ["Policy brief"], cover_color: "#fbf1de" },
    { slug: "readiness-instrument", photo: "assets/photos/tables.jpg", kind: "publication", title: "Measuring commercialization readiness in researcher-led teams",
      excerpt: "An instrument developed inside SPRINT-STEP and tested across two cohorts, with reliability statistics and the full item bank.",
      published_at: "2027-04-18", author: "C. Perote, AIPO", venue: "Peer-reviewed article", read: "Journal article",
      tags: ["Research"], cover_color: "#e4f1ea" },
    { slug: "demo-day-2026", photo: "assets/photos/demoday.jpg", kind: "article", title: "STEP 2 Demo Day: from lab bench to first customers",
      excerpt: "Highlights from the culminating pitch day and the teams recognised by the panel.",
      published_at: "2026-10-20", author: "AIPO Communications", read: "6 min read",
      tags: ["Program news"], cover_color: "#e9eaf7" },
    { slug: "mentoring-field-notes", photo: "assets/photos/mentoring.jpg", kind: "article", title: "Field notes: what mentors actually ask in week four",
      excerpt: "Across thirty mentoring hours, the same three questions keep surfacing — and they are rarely about the technology.",
      published_at: "2026-09-08", author: "STEP Team", read: "5 min read",
      tags: ["Field notes"], cover_color: "#f7e9ea" },
  ];

  const helpers = {
    fmtDate(iso, opts) {
      return new Date(iso).toLocaleString("en-PH", Object.assign({ timeZone: "Asia/Manila", weekday: "short", month: "short", day: "numeric" }, opts || {}));
    },
    fmtTime(iso) {
      return new Date(iso).toLocaleTimeString("en-PH", { timeZone: "Asia/Manila", hour: "numeric", minute: "2-digit" });
    },
    heatClass(score) { return "heat heat-" + Math.max(1, Math.min(4, Math.round(score))); },
    statusBadge(t) {
      const map = { on_time: ["green", "On time"], late: ["amber", "Late"], missing: ["red", "Missing"], pending: ["", "Not submitted"] };
      const [cls, label] = map[t] || ["", t];
      return `<span class="badge ${cls}">${label}</span>`;
    },
  };

  const panelScores = {};
  groups.forEach(g => {
    const p = teamWorkProfiles[g.id] || teamWorkProfiles.g1;
    panelScores[g.id] = { M2: p.scores[0], M3A: p.scores[1], M3B: p.scores[2], M4: p.scores[3] };
  });

  const attendance = groups.map((g, i) => ({
    team_id: g.id, team_name: g.name,
    sessions_attended: [8, 8, 8, 7, 8, 8, 7, 8, 8, 8][i],
    sessions_total: 8,
    members_present_last: [5, 4, 5, 4, 4, 5, 4, 5, 4, 5][i],
    is_compliant: true,
  }));

  const submissions = [
    { assignment_id: "as1", assignment_title: "Week 4 Team Output · CPM & VRIO", assignment_type: "team_output", week_no: 4, due_at: "2027-07-16T12:00:00+08:00", team_id: "g1", status: "draft", timeliness: "pending", late_days: 0, score: null, max_points: 10 },
    { assignment_id: "as2", assignment_title: "Week 4 Discussion Post", assignment_type: "discussion_post", week_no: 4, due_at: "2027-07-15T23:59:00+08:00", team_id: "g1", status: "submitted", timeliness: "on_time", late_days: 0, score: null, max_points: 5 },
  ];

  return {
    cohort,
    groups,
    teams,
    faculty,
    modules,
    sessions,
    announcements,
    submissions,
    panelScores,
    attendance,
    thisWeek,
    articles,
    helpers,
    users,
    auth,
    getTeamWork,
    getCapstone,
    // Property getters for current active team work & capstone
    get teamWork() {
      return getTeamWork();
    },
    get capstone() {
      return getCapstone();
    },
    openAuthModal,
    closeAuthModal,
    selectUser,
    signOutUser,
    updateAuthChrome
  };

  /* ---------------------------------------------------------------------
     Client-side Auth UI Manager (Modal, Utility Bar, Nav Lock Indicators)
     --------------------------------------------------------------------- */
  function renderAuthModal() {
    let modal = document.getElementById("stephub-auth-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "stephub-auth-modal";
      modal.className = "auth-backdrop";
      document.body.appendChild(modal);
    }
    const curr = auth.getCurrentUser();

    modal.innerHTML = `
      <div class="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <div class="auth-modal-head">
          <h3 id="auth-modal-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
            Select Account to Test Access & Team
          </h3>
          <button class="auth-modal-close" aria-label="Close dialog" onclick="window.MOCK.closeAuthModal()">&times;</button>
        </div>
        <div class="auth-modal-body">
          <p style="font-size:13.5px; color:var(--ink-soft); margin:0 0 var(--s4)">
            Switch accounts below to immediately see how page content, team dashboards, and lock access adapt according to the logged-in role.
          </p>

          <div class="auth-section-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            STEP Group Members / Participants (10 Official Teams)
          </div>
          <div class="auth-user-grid">
            ${users.filter(u => u.role === "participant").map(u => `
              <div class="auth-user-card ${curr.id === u.id ? 'active-user' : ''}" onclick="window.MOCK.selectUser('${u.id}')">
                <span class="card-av">${u.initials}</span>
                <span class="card-details">
                  <span class="card-name">${u.name}</span>
                  <span class="card-role">${u.team_name}</span>
                  <span class="card-badge">${u.institution}</span>
                </span>
              </div>
            `).join("")}
          </div>

          <div class="auth-section-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            Faculty Mentors
          </div>
          <div class="auth-user-grid">
            ${users.filter(u => u.role === "mentor").map(u => `
              <div class="auth-user-card ${curr.id === u.id ? 'active-user' : ''}" onclick="window.MOCK.selectUser('${u.id}')">
                <span class="card-av" style="background:#5e35b1">${u.initials}</span>
                <span class="card-details">
                  <span class="card-name">${u.name}</span>
                  <span class="card-role">${u.role_label}</span>
                  <span class="card-badge">${u.institution}</span>
                </span>
              </div>
            `).join("")}
          </div>

          <div class="auth-section-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            Evaluation Panelists & Trainers
          </div>
          <div class="auth-user-grid">
            ${users.filter(u => u.role === "panel" || u.role === "trainer").map(u => `
              <div class="auth-user-card ${curr.id === u.id ? 'active-user' : ''}" onclick="window.MOCK.selectUser('${u.id}')">
                <span class="card-av" style="background:${u.role === 'panel' ? '#e65100' : '#2e7d32'}">${u.initials}</span>
                <span class="card-details">
                  <span class="card-name">${u.name}</span>
                  <span class="card-role">${u.role_label}</span>
                  <span class="card-badge">${u.institution}</span>
                </span>
              </div>
            `).join("")}
          </div>

          <div class="auth-section-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            STEP Administration
          </div>
          <div class="auth-user-grid">
            ${users.filter(u => u.role === "admin").map(u => `
              <div class="auth-user-card ${curr.id === u.id ? 'active-user' : ''}" onclick="window.MOCK.selectUser('${u.id}')">
                <span class="card-av" style="background:#c62828">${u.initials}</span>
                <span class="card-details">
                  <span class="card-name">${u.name}</span>
                  <span class="card-role">${u.role_label}</span>
                  <span class="card-badge">Full Access</span>
                </span>
              </div>
            `).join("")}
          </div>

          <div class="auth-signout-row">
            <span style="font-size:12.5px; color:var(--ink-soft)">Test guest access to locked tabs:</span>
            <button class="btn secondary" style="font-size:12.5px; padding:6px 14px;" onclick="window.MOCK.signOutUser()">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-1px;margin-right:4px;"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
              Sign Out (Public / Guest Mode)
            </button>
          </div>
        </div>
      </div>
    `;

    modal.onclick = (e) => {
      if (e.target === modal) window.MOCK.closeAuthModal();
    };
  }

  function updateAuthChrome() {
    const user = auth.getCurrentUser();
    // 1. Update utility-bar
    const utilRight = document.querySelector(".utility-bar .util-right");
    if (utilRight) {
      let authArea = document.getElementById("util-auth-area");
      const oldLogin = utilRight.querySelector(".util-login:not(#util-auth-area *)");
      if (oldLogin) oldLogin.remove();

      if (!authArea) {
        authArea = document.createElement("span");
        authArea.id = "util-auth-area";
        authArea.className = "util-user-wrap";
        utilRight.appendChild(authArea);
      }
      if (user.role === "guest") {
        authArea.innerHTML = `
          <button type="button" class="util-login" onclick="window.MOCK.openAuthModal()" style="cursor:pointer; background:none; color:inherit; font:inherit;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px;vertical-align:-1px;margin-right:4px;"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
            Sign In / Select Account
          </button>
        `;
      } else {
        const badgeLabel = user.role === "participant" ? user.team_name : user.role_label;
        authArea.innerHTML = `
          <div class="util-user-pill" onclick="window.MOCK.openAuthModal()" title="Logged in as ${user.name} (${user.role_label}). Click to switch role.">
            <span class="util-user-av">${user.initials}</span>
            <span class="util-user-name">${user.name}</span>
            <span class="util-user-role">${badgeLabel}</span>
          </div>
          <button type="button" class="util-user-switch-btn" onclick="window.MOCK.openAuthModal()">Switch</button>
        `;
      }
    }

    // 2. Update navigation locks
    document.querySelectorAll(".site-header.light .nav a, nav.nav a").forEach(a => {
      const href = a.getAttribute("href") || "";
      const route = a.dataset.route || (href.indexOf("#") > -1 ? href.slice(href.indexOf("#") + 1).split("-")[0] : (href.split(".")[0]));
      
      const lockSvg = a.querySelector("svg.lock");
      if (lockSvg) {
        const allowed = auth.canAccess(route, user);
        a.classList.toggle("tab-unlocked", allowed);
        a.classList.toggle("tab-locked", !allowed);
      }
    });

    // 3. Update floating quick switcher
    let qs = document.getElementById("quick-role-switcher");
    if (!qs) {
      qs = document.createElement("div");
      qs.id = "quick-role-switcher";
      qs.className = "quick-switcher-pill";
      qs.onclick = () => window.MOCK.openAuthModal();
      document.body.appendChild(qs);
    }
    if (user.role === "guest") {
      qs.innerHTML = `
        <span class="quick-switcher-av" style="background:#546e7a; color:#fff">🔒</span>
        <span class="quick-switcher-txt">Guest (Logged Out)</span>
        <span class="quick-switcher-tag">Sign In</span>
      `;
      qs.title = "Current: Guest (public). Click to sign in or test roles.";
    } else {
      const label = user.role === "participant" ? user.team_name : user.role_label;
      qs.innerHTML = `
        <span class="quick-switcher-av">${user.initials}</span>
        <span class="quick-switcher-txt">${user.name}</span>
        <span class="quick-switcher-tag">${label}</span>
      `;
      qs.title = `Current User: ${user.name} (${label}). Click to switch account.`;
    }
  }

  function openAuthModal() {
    renderAuthModal();
    const modal = document.getElementById("stephub-auth-modal");
    if (modal) modal.classList.add("active");
  }

  function closeAuthModal() {
    const modal = document.getElementById("stephub-auth-modal");
    if (modal) modal.classList.remove("active");
  }

  function selectUser(userId) {
    auth.setCurrentUser(userId);
    closeAuthModal();
    updateAuthChrome();
  }

  function signOutUser() {
    auth.logout();
    closeAuthModal();
    updateAuthChrome();
  }

  // Auto-init on page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      updateAuthChrome();
    });
  } else {
    setTimeout(updateAuthChrome, 10);
  }

  window.addEventListener("stephub_auth_changed", () => {
    updateAuthChrome();
  });
})();


/* ---- index.html ---- */
(function(){
const { sessions, helpers } = window.MOCK;

  /* ---------- articles and publications ---------- */
  (function () {
    const esc = t => String(t == null ? "" : t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const day = iso => new Date(iso + "T00:00:00+08:00").toLocaleDateString("en-PH",
      { timeZone: "Asia/Manila", day: "numeric", month: "long", year: "numeric" });
    const all = window.MOCK.articles.slice()
      .sort((a, b) => b.published_at.localeCompare(a.published_at));
    const KIND = { article: "Article", publication: "Publication" };
    const DOC = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>`;

    const FILTERS = [
      { k: "all", label: "Everything" },
      { k: "article", label: "Articles" },
      { k: "publication", label: "Publications" },
    ];
    const count = k => k === "all" ? all.length : all.filter(a => a.kind === k).length;
    document.getElementById("pub-filter").innerHTML = FILTERS.map(f => `
      <button role="tab" class="pf" data-k="${f.k}" aria-selected="${f.k === "all"}">
        ${f.label}<span>${count(f.k)}</span></button>`).join("");

    function render(kind) {
      const list = kind === "all" ? all : all.filter(a => a.kind === kind);
      document.getElementById("pub-lede").textContent =
        kind === "publication"
          ? "Peer-reviewed work and policy briefs that came out of the program."
          : kind === "article"
            ? "News and field notes from the cycles as they run."
            : "Everything the program has published — news from the cycles, policy briefs and peer-reviewed work.";
      document.getElementById("readgrid").hidden = !list.length;
      document.getElementById("pub-empty").hidden = !!list.length;
      if (!list.length) return;

      const [lead, ...rest] = list;
      const feat = document.getElementById("feat");
      feat.className = "feat reveal in " + lead.kind;
      feat.innerHTML = `
        <span class="cover"><img src="${lead.photo}" alt="" loading="lazy">
          <span class="kind">${lead.kind === "publication" ? DOC : ""}${KIND[lead.kind]}</span></span>
        <span class="fb">
          <span class="tagline">${lead.tags.map(t => `<span class="tg">${esc(t)}</span>`).join("")}
            <span class="dt">${day(lead.published_at)}</span></span>
          <strong>${esc(lead.title)}</strong>
          <span class="ex">${esc(lead.excerpt)}</span>
          <span class="by">${esc(lead.author)}${lead.venue ? " · " + esc(lead.venue) : ""}${lead.read ? " · " + esc(lead.read) : ""}</span>
        </span>`;

      document.getElementById("readlist").innerHTML = rest.map((a, i) => `
        <a class="rd reveal in ${a.kind}" style="--d:${i * 60}ms" href="#">
          <span class="th"><img src="${a.photo}" alt="" loading="lazy">
            ${a.kind === "publication" ? `<span class="pin">${DOC}</span>` : ""}</span>
          <span class="rb">
            <span class="tagline"><span class="tg">${esc(a.tags[0])}</span>
              <span class="dt">${day(a.published_at)}</span></span>
            <strong>${esc(a.title)}</strong>
            <span class="by">${esc(a.author)}${a.venue ? " · " + esc(a.venue) : ""}${a.read ? " · " + esc(a.read) : ""}</span>
          </span>
          <span class="go" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
          </span>
        </a>`).join("");
    }

    document.getElementById("pub-filter").addEventListener("click", e => {
      const b = e.target.closest(".pf"); if (!b) return;
      document.querySelectorAll("#pub-filter .pf").forEach(x =>
        x.setAttribute("aria-selected", x === b ? "true" : "false"));
      render(b.dataset.k);
    });
    render("all");
  })();

  document.getElementById("event-list").innerHTML = sessions.filter(s => s.is_public).map(s => {
    const d = new Date(s.starts_at);
    const m = d.toLocaleString("en-PH", { timeZone: "Asia/Manila", month: "short" });
    const day = d.toLocaleString("en-PH", { timeZone: "Asia/Manila", day: "numeric" });
    return `<div class="event-row">
        <div class="date-block"><div class="m">${m}</div><div class="d">${day}</div></div>
        <div><strong>${s.title.replace(/^On-site Workshop · /, "")}</strong>
          <div class="small">${s.venue || "Online"}</div></div>
      </div>`;
  }).join("");


})();
/* ---- this-week.html ---- */
(function(){
const W = window.MOCK.thisWeek;
const NOW = new Date(W.today);                       // demo clock: Thursday afternoon
const esc = t => String(t == null ? "" : t)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/* Compare Manila calendar days as plain YYYY-MM-DD strings — comparing Date
   objects breaks whenever the browser's own zone is behind Asia/Manila. */
const manilaDay = d => d.toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });
const TODAY = manilaDay(NOW);
const fmtD = (iso, o) => new Date(iso).toLocaleDateString("en-PH",
  Object.assign({ timeZone: "Asia/Manila", day: "numeric", month: "short" }, o || {}));
const fmtT = iso => new Date(iso).toLocaleTimeString("en-PH",
  { timeZone: "Asia/Manila", hour: "numeric", minute: "2-digit" });
const isToday = iso => iso === TODAY;
const isPast  = iso => iso < TODAY;
const dayNum  = iso => Number(iso.slice(8, 10));
const utcOf   = iso => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
const daysAway = iso => {
  const n = Math.round((utcOf(iso) - utcOf(TODAY)) / 86400000);
  return n === 1 ? "Tomorrow" : "In " + n + " days";
};

/* ---------- week bar ---------- */
(function () {
  document.getElementById("wk-title").textContent =
    "Week " + W.week_no + " of " + W.weeks_total;
  document.getElementById("wk-tag").textContent =
    fmtD(W.starts + "T00:00:00+08:00", { weekday: "long" }) + " to " +
    fmtD(W.ends + "T00:00:00+08:00", { weekday: "long", year: "numeric" });   // the topic sits beside it
  document.getElementById("wk-dots").innerHTML = W.days.map(d =>
    `<span class="${isToday(d.d) ? "now" : isPast(d.d) ? "done" : ""}"
       title="${esc(d.label)} · ${esc(d.title)}">${d.label.slice(0, 3)}<br>${dayNum(d.d)}</span>`).join("");
})();

/* ---------- the one deadline that matters, carried in the week bar ---------- */
(function () {
  const deadline = W.days.find(d => d.kind === "deadline");
  if (!deadline) return;
  const h = Math.round((new Date(deadline.d + "T12:00:00+08:00") - NOW) / 3600000);
  if (h < 0) return;                                        // already passed — the day rail shows it as done
  const left = h < 24 ? h + (h === 1 ? " hour" : " hours") + " left"
                      : Math.round(h / 24) + (Math.round(h / 24) === 1 ? " day" : " days") + " left";
  const el = document.getElementById("wk-due");
  el.innerHTML = `Team output due ${esc(deadline.label)}, 12:00 NN — <b>${left}</b>`;
  el.hidden = false;
})();

/* ---------- the topic ---------- */
(function () {
  const T = W.topic;
  /* the headline pair lives in the week banner; the section below just carries a quiet label */
  document.getElementById("wk-tp-title").textContent = T.title;
  document.getElementById("wk-tp-tagline").textContent = T.tagline;
  document.getElementById("wk-split").setAttribute("data-code", T.code);
  document.getElementById("tp-eyebrow").textContent = "What this week is about";
  document.getElementById("tp-title").textContent = T.title;
  document.getElementById("tp-brief").textContent = T.brief;
  document.getElementById("tp-able").innerHTML = T.able.map((a, i) =>
    `<li><span class="n">${i + 1}</span><span>${esc(a)}</span></li>`).join("");
  document.getElementById("tp-output").innerHTML =
    `<b>What to produce by Friday</b>${esc(T.output)}`;
  document.getElementById("tp-mats").innerHTML = T.materials.map(m => `
    <li>
      <span class="ft ${m.pending ? "pend" : ""}">${esc(m.type)}</span>
      <span>
        <span class="mn">${esc(m.name)}</span>
        <span class="mm">${m.pending ? esc(m.pending)
          : esc(m.size) + " · " + esc(m.by) + " · " + fmtD(m.at, { weekday: "short" })}</span>
      </span>
      ${m.pending ? `<span class="badge">Not yet posted</span>`
                  : `<a class="btn secondary" href="#">${m.type === "Video" ? "Watch" : "Download"}</a>`}
    </li>`).join("");
})();

/* ---------- mini game: put the steps in order ---------- */
(function () {
  const G = W.game;
  if (!G) return;
  const gmTitle = document.getElementById("gm-title");
  if (gmTitle) gmTitle.textContent = G.title;
  const gmPrompt = document.getElementById("gm-prompt");
  if (gmPrompt) gmPrompt.textContent = G.prompt;
  const list = document.getElementById("gm-list");
  const msg = document.getElementById("gm-msg");
  const board = document.getElementById("gm-board");
  const roundEl = document.getElementById("gm-round");
  const bestEl = document.getElementById("gm-best");
  let order = [], locked = false, round = 1, best = null;

  const shuffle = a => { const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
    return b; };

  function deal() {
    locked = false;
    board.classList.remove("win");
    do { order = shuffle(G.steps); } while (order.every((s, i) => s.order === i + 1));   // never deal it solved
    draw();
    msg.textContent = "Drag the cards, then check your order.";
    msg.className = "msg";
    roundEl.textContent = round;
    document.getElementById("gm-check").disabled = false;
    document.getElementById("gm-reset").textContent = "Shuffle again";
  }

  function draw(marks) {
    list.innerHTML = order.map((s, i) => `
      <li class="step-card ${locked ? "locked " : ""}${marks ? (marks[i] ? "right" : "wrong") : ""}"
          data-i="${i}" tabindex="0" role="button"${marks ? ` style="animation-delay:${i * 80}ms"` : ""}
          aria-label="${esc(s.label)}, position ${i + 1} of ${order.length}. Use the arrow keys to move it.">
        <span class="grip" aria-hidden="true">⣿</span>
        <span class="pos">${i + 1}</span>
        <span class="lb">${esc(s.label)}${marks ? `<span class="wy">${esc(s.why)}</span>` : ""}</span>
      </li>`).join("");
  }

  /* a small burst when the whole board comes out right */
  function celebrate() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = ["#c99a2e", "#9ccbf4", "#ffffff", "#6fdaa9", "#f0a1a1"];
    for (let i = 0; i < 36; i++) {
      const p = document.createElement("i");
      p.className = "cfti";
      p.style.left = (6 + Math.random() * 88) + "%";
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = Math.round(Math.random() * 280) + "ms";
      p.style.height = (9 + Math.round(Math.random() * 7)) + "px";
      board.appendChild(p);
      setTimeout(() => p.remove(), 2400);
    }
  }

  /* pointer-based reordering — works with a mouse and with a finger */
  let drag = null;
  list.addEventListener("pointerdown", e => {
    if (locked) return;
    const card = e.target.closest(".step-card"); if (!card) return;
    const rect = card.getBoundingClientRect();
    drag = { from: +card.dataset.i, dx: e.clientX - rect.left, dy: e.clientY - rect.top, w: rect.width };
    const ghost = card.cloneNode(true);
    ghost.classList.add("ghost");
    ghost.style.width = rect.width + "px";
    ghost.style.left = rect.left + "px";
    ghost.style.top = rect.top + "px";
    document.body.appendChild(ghost);
    drag.ghost = ghost;
    card.classList.add("dragging");
    list.setPointerCapture(e.pointerId);
  });
  list.addEventListener("pointermove", e => {
    if (!drag) return;
    e.preventDefault();
    drag.ghost.style.left = (e.clientX - drag.dx) + "px";
    drag.ghost.style.top = (e.clientY - drag.dy) + "px";
    const cards = [...list.querySelectorAll(".step-card")];
    const over = cards.find(c => {
      const r = c.getBoundingClientRect();
      return e.clientY >= r.top && e.clientY <= r.bottom;
    });
    if (over && +over.dataset.i !== drag.from) {
      const to = +over.dataset.i;
      order.splice(to, 0, order.splice(drag.from, 1)[0]);
      drag.from = to;
      draw();
      list.querySelectorAll(".step-card")[to].classList.add("dragging");
    }
  });
  const endDrag = () => {
    if (!drag) return;
    drag.ghost.remove();
    drag = null;
    draw();
  };
  list.addEventListener("pointerup", endDrag);
  list.addEventListener("pointercancel", endDrag);

  /* keyboard: move a focused card with the arrow keys */
  list.addEventListener("keydown", e => {
    if (locked) return;
    const card = e.target.closest(".step-card"); if (!card) return;
    const i = +card.dataset.i;
    let to = null;
    if (e.key === "ArrowUp" && i > 0) to = i - 1;
    if (e.key === "ArrowDown" && i < order.length - 1) to = i + 1;
    if (to === null) return;
    e.preventDefault();
    order.splice(to, 0, order.splice(i, 1)[0]);
    draw();
    list.querySelectorAll(".step-card")[to].focus();
  });

  document.getElementById("gm-check").addEventListener("click", () => {
    const marks = order.map((s, i) => s.order === i + 1);
    const got = marks.filter(Boolean).length;
    locked = true;
    draw(marks);
    document.getElementById("gm-check").disabled = true;
    document.getElementById("gm-reset").textContent = "Play again";
    if (best === null || got > best) best = got;
    bestEl.textContent = best + "/" + order.length;
    round++;
    if (got === order.length) {
      msg.textContent = "Clean sweep — that is the conversation you will run on Saturday.";
      msg.className = "msg ok";
      board.classList.add("win");
      celebrate();
    } else {
      msg.textContent = got + " of " + order.length + " in place. Read the notes, then play again.";
      msg.className = "msg no";
    }
  });
  document.getElementById("gm-reset").addEventListener("click", deal);
  deal();
})();

/* ---------- the seven days ---------- */
document.getElementById("rail").innerHTML = W.days.map(d => {
  const past = isPast(d.d), today = isToday(d.d);
  let act = "", gate = "";
  if (d.action === "join") {
    act = `<button class="btn" disabled>Join</button>`;
    gate = `<div class="gate">Opens 15 minutes before</div>`;
  } else if (d.action === "recording") {
    act = `<a class="btn secondary" href="#">Watch the recording</a>`;
  } else if (d.action === "submit") {
    act = `<a class="btn" href="#myteam-submit">Hand it in</a>`;
  }
  const state = past ? "past" : today ? "today" : "ahead";
  const tag = past  ? `<span class="st done">Done</span>`
            : today ? `<span class="st now">Today</span>`
                    : `<span class="st next">${daysAway(d.d)}</span>`;
  return `<div class="dayrow ${d.kind} ${state} reveal">
    <div class="dy">
      <span class="wd">${esc(d.label)}</span>
      <span class="dt">${fmtD(d.d + "T00:00:00+08:00")}</span>
      ${tag}
    </div>
    <div>
      <div class="ti">${past ? `<span class="tick" aria-hidden="true">✓</span>` : ""}${esc(d.title)}</div>
      <div class="nt">${d.time ? esc(d.time) + (d.where ? " · " + esc(d.where) : "") + " — " : ""}${esc(d.note || "")}</div>
    </div>
    <div>${act}${gate}</div>
  </div>`;
}).join("");

/* ---------- announcements ---------- */
(function () {
  const S = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"';
  const ICON = {
    alert: `<svg ${S}><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>`,
    file:  `<svg ${S}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h5"/></svg>`,
    cert:  `<svg ${S}><circle cx="12" cy="9" r="5"/><path d="M8.5 13.2 7 22l5-2.6L17 22l-1.5-8.8"/></svg>`,
    chart: `<svg ${S}><path d="M3 21h18"/><rect x="5" y="11" width="4" height="7" rx="1"/><rect x="11" y="6" width="4" height="12" rx="1"/><rect x="17" y="14" width="4" height="4" rx="1"/></svg>`,
  };
  const list = W.announcements.slice()
    .sort((a, b) => (b.pinned - a.pinned) || (new Date(b.at) - new Date(a.at)));

  document.getElementById("ann").innerHTML = list.map((a, i) => `
    <article class="note ${a.pinned ? "pinned" : ""} ${a.priority} ${a.read ? "" : "unread"} reveal"
             style="--d:${i * 60}ms">
      <span class="ic" aria-hidden="true">${ICON[a.icon] || ICON.file}</span>
      <div class="nb">
        ${a.pinned ? '<span class="ntag">Pinned by the STEP team</span>' : ""}
        <h4>${esc(a.title)}</h4>
        <p>${esc(a.body)}</p>
        <div class="mt">${esc(a.by)} · ${fmtD(a.at, { weekday: "long" })}, ${fmtT(a.at)}</div>
      </div>
      ${a.read ? "" : '<span class="dot" title="New since you last looked"></span>'}
    </article>`).join("");

  const unread = list.filter(a => !a.read).length;
  const badge = document.getElementById("ann-new");
  if (unread) { badge.innerHTML = `<b>${unread}</b> new this week`; badge.hidden = false; }
})();

/* ---------- help desk ---------- */
(function () {
  const thread = document.getElementById("thread");
  const HONOURIFIC = /^(ms|mr|mrs|dr|engr|atty|prof|sir|maam)$/i;
  const initials = n => {
    const parts = n.replace(/[^A-Za-z ]/g, "").split(/\s+/).filter(x => x && !HONOURIFIC.test(x));
    if (!parts.length) return "?";
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
  };
  /* an anonymous asker gets a neutral mark, never initials */
  const ANON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>`;
  const render = () => {
    thread.innerHTML = W.helpdesk.map(m => {
      const meta = [m.anon ? "" : esc(m.role), fmtT(m.at)].filter(Boolean).join(" · ");
      return `<div class="msg-row">
        <span class="av ${m.anon ? "anon" : ""}" aria-hidden="true">${m.anon ? ANON : esc(initials(m.who))}</span>
        <div class="bubble">
          <div class="who">${esc(m.who)}${m.me ? ' <span class="tagme">you</span>' : ""}
            <span>${meta ? "· " + meta : ""}</span></div>
          <div class="bd">${esc(m.body)}</div>
        </div>
      </div>`;
    }).join("");
    thread.scrollTop = thread.scrollHeight;
  };
  render();
  document.getElementById("composer").addEventListener("submit", e => {
    e.preventDefault();
    const box = document.getElementById("msg");
    const text = box.value.trim(); if (!text) return;
    const anon = document.getElementById("anon").checked;
    W.helpdesk.push({
      who: anon ? "Anonymous participant" : "Dr. Liza Ramos",
      role: anon ? "" : "AgriSense",
      anon: anon, me: true, at: new Date().toISOString(), body: text,
    });
    box.value = ""; render();
  });
})();

document.getElementById("hk").innerHTML = W.housekeeping.map(h =>
  `<li><b>${esc(h.title)}</b><span>${esc(h.note)}</span></li>`).join("");



/* ---------- RBAC Access Guard ---------- */
window.__renderThisWeek = function() {
  const user = window.MOCK ? window.MOCK.auth.getCurrentUser() : null;
  const gate = document.getElementById("week-locked-gate");
  const content = document.getElementById("week-content-wrap");
  if (!gate || !content) return;
  if (!user || user.role === "guest") {
    gate.hidden = false;
    gate.innerHTML = `
      <div class="access-restricted-card">
        <div class="shield-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
        </div>
        <h2>Sign In Required</h2>
        <p>This Week's schedule, materials, and panel assignments are private to enrolled SPRINT-STEP participants, mentors, trainers, and panelists. Please sign in to view this week's sessions.</p>
        <button class="btn solid" onclick="window.MOCK.openAuthModal()">Sign In / Select Demo Account</button>
      </div>
    `;
    content.hidden = true;
  } else {
    gate.hidden = true;
    content.hidden = false;
  }
};
window.__renderThisWeek();
document.addEventListener("stephub_auth_changed", () => {
  if (typeof window.__renderThisWeek === "function") window.__renderThisWeek();
});
})();
/* ---- program.html ---- */
(function(){
/* ---------------------------------------------------------------
   Program content. Edit these two arrays to update the page.
   Timeline dates are the actual SPRINT-STEP 2 (2025) cycle.
   --------------------------------------------------------------- */
const TIMELINE = [
  /* Only what differed week to week. The Saturday feedback panels and the
     midweek mentoring ran on every week of the cycle and are stated once,
     above the timeline, instead of repeating as twelve near-identical rows. */
  { m: "June", items: [
    { d: "Jun 20", t: "milestone", w: "Kick-off event",
      n: "Why spin off, technology-based entrepreneurship, pathway ideation workshop, FASTRAC grantee panel" },
  ]},
  { m: "July", items: [
    { d: "Jul 15", t: "online", w: "Online onboarding", n: "Programme walkthrough, expectations, platform orientation" },
    { d: "Jul 22 & 26", t: "note", w: "Postponed — typhoon", n: "Sessions moved, and the deadlines moved with them" },
    { d: "Jul 29", t: "online", w: "Beachhead markets and customer segments", c: "M2", n: "" },
  ]},
  { m: "August", items: [
    { d: "Aug 5", t: "online", w: "Market size estimation and market research", c: "M3", n: "" },
    { d: "Aug 12", t: "online", w: "From understanding use to measured value", c: "M3B", n: "" },
    { d: "Aug 26", t: "online", w: "Competitive advantage (VRIO, CPM)", c: "M4", n: "" },
  ]},
  { m: "September", items: [
    { d: "Sep 2", t: "online", w: "Go-to-market plan and lean canvas", c: "M5", n: "" },
    { d: "Sep 9", t: "online", w: "Business model validation", c: "M6", n: "" },
    { d: "Sep 16–17", t: "onsite", w: "On-site workshop", c: "M7–M10",
      n: "Team organization and spin-off simulation, IP and patents with IPOPHL, tax incentives, financial analysis" },
    { d: "Sep 23", t: "online", w: "Selling skills", c: "M11", n: "" },
    { d: "Sep 30", t: "online", w: "Pitching skills", c: "M12", n: "" },
  ]},
  { m: "October", items: [
    { d: "Oct 4", t: "milestone", w: "Pre-Demo Day", n: "Five-minute video pitch before a three-person panel" },
    { d: "Oct 14", t: "milestone", w: "Demo Day",
      n: "Pitches before investors, DOST-PCIEERD, agencies and industry, then technology roadmapping and the FASTRAC writeshop" },
    { d: "Oct 15", t: "milestone", w: "Graduation and closing", n: "Awarding, a panel on FASTRAC, networking" },
  ]},
  { m: "After the cycle", items: [
    { d: "Oct 16 – Nov 15", t: "note", w: "Follow-through", n: "Site visits, commercialization assessments, terminal report" },
  ]},
];

const MODULES = [
  { phase: "Weeks 1–4", title: "Find the market", items: [
    { c: "M1A", t: "Introduction to STEP", h: "1h", d: "Why a spin-off is a route worth taking" },
    { c: "M1B", t: "Technology-based entrepreneurship", h: "0.75h", d: "What makes deep-tech ventures different" },
    { c: "M1C", t: "Time and resource management", h: "0.75h", d: "Prioritisation for teams with day jobs" },
    { c: "M1D", t: "Marketing basics", h: "1h", d: "Foundations for technology products" },
    { c: "M1E", t: "Pathway ideation workshop", h: "2.5h", d: "Choose the commercialization pathway" },
    { c: "M2", t: "Beachhead markets and customer segments", h: "3h + 2h", d: "5–10 market opportunities, a chosen beachhead, problem-solution fit canvas, value proposition statement" },
    { c: "M3", t: "Market size estimation and market research", h: "3h + 1.5h", d: "TAM, SAM and SOM with rationale, plus follow-on market analysis" },
    { c: "M3B", t: "From understanding use to measured value", h: "3h + 1.5h", d: "Full life-cycle use case, customer metrics, a one-sentence quantified value proposition, concept board" },
    { c: "M4", t: "Competitive advantage", h: "3h + 2h", d: "Competitive profile matrix, VRIO analysis, refined value proposition, first lean canvas" },
  ]},
  { phase: "Weeks 5–8", title: "Build the business", items: [
    { c: "M5", t: "Go-to-market plan and lean canvas", h: "3h + 3h", d: "Strategy canvas, bullseye framework, go-to-market Gantt chart" },
    { c: "M6", t: "Business model validation", h: "3h + 4h", d: "Channels, cost and revenue structure, business model canvas, five-week plan" },
    { c: "M7", t: "Team organization workshop", h: "2h", d: "Roles, responsibilities and equity in a spin-off; spin-off simulation" },
    { c: "M8", t: "Intellectual property and patents", h: "3h", d: "With IPOPHL: patent basics, prior art search, draft IP and freedom-to-operate" },
    { c: "M9", t: "Tax incentives for spin-offs", h: "1h + 3h", d: "What R&D-based spin-offs can claim" },
    { c: "M10", t: "Financial analysis: DCF and ROI", h: "3h + 2h", d: "Projections, sensitivity analysis, five-year sustainability plan" },
  ]},
  { phase: "Weeks 9–12", title: "Pitch and propose", items: [
    { c: "M11", t: "Selling skills", h: "3h + 1.5h", d: "Prospect list and qualification, elevator pitch, sales presentation, battle cards" },
    { c: "M12", t: "Pitching skills", h: "3h + 2h", d: "60-second elevator pitch, five-minute video pitch, final pitch deck" },
    { c: "M13", t: "Technology roadmapping", h: "1h + 2h", d: "Long-term plan for the product's evolution" },
    { c: "M14", t: "FASTRAC proposal writeshop", h: "2h + 3h", d: "Consolidate everything into a draft DOST FASTRAC proposal" },
  ]},
];

/* ---------- the timeline, on one spine ---------- */
document.getElementById("tl").innerHTML = TIMELINE.map(g => `
  <div class="tl-mo"><span>${g.m}</span></div>
  ${g.items.map(i => `
    <div class="tl-row t-${i.t} reveal">
      <span class="tl-node" aria-hidden="true"></span>
      <span class="tl-when">${i.d}</span>
      <span class="tl-what">
        <span class="tl-title">${i.c ? `<span class="tl-code">${i.c}</span>` : ""}${i.w}</span>
        ${i.n ? `<span class="tl-note">${i.n}</span>` : ""}
      </span>
      <span class="tl-tag">${
        i.t === "milestone" ? "Milestone" : i.t === "onsite" ? "On site" : i.t === "online" ? "Online" : ""}</span>
    </div>`).join("")}
`).join("");

/* ---------- render modules ---------- */
document.getElementById("mods").innerHTML = MODULES.map(col => `
  <div class="modcol reveal">
    <header>
      <div class="ph">${col.phase}</div>
      <h3>${col.title}</h3>
    </header>
    ${col.items.map(m => `
      <details class="mod">
        <summary><span class="code">${m.c}</span> ${m.t}</summary>
        <div class="body">
          <div class="hrs">${m.h}</div>
          <div>${m.d}</div>
        </div>
      </details>`).join("")}
  </div>`).join("");


})();
/* ---- groups.html ---- */
(function(){
const G = window.MOCK.groups;
const esc = t => String(t == null ? "" : t)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- the hero plate: the cohort in numbers ---------- */
(function () {
  const insts = [...new Set(G.map(t => t.institution))];
  const cells = [["Research teams", G.length, "in this cycle"],
                 ["Institutions", insts.length, "host laboratories"]]
    .concat(["Luzon", "Visayas", "Mindanao"].map(r =>
      [r, G.filter(t => t.region === r).length, "team" + (G.filter(t => t.region === r).length === 1 ? "" : "s")]));
  document.getElementById("gs-spec").innerHTML = cells.map(([k, n, sub], i) => `
    <div class="cs reveal" style="--d:${i * 60}ms">
      <b>${n}</b><span class="k">${k}</span><span class="s">${sub}</span>
    </div>`).join("");
})();

/* ---------- the showcase ---------- */
(function () {
  const stage = document.getElementById("stage");
  const scene = document.getElementById("showcase");
  const list = document.getElementById("rs-list");
  const mark = document.getElementById("rs-mark");
  const nameEl = document.getElementById("st-name");
  let cur = -1, ticket = 0;

  document.getElementById("rs-count").textContent = G.length;

  /* the roster */
  list.insertAdjacentHTML("beforeend", G.map((t, i) => `
    <button class="rsx" role="tab" id="rsx-${i}" data-i="${i}" aria-selected="false" tabindex="-1">
      <span class="rn">${esc(t.short)}</span>
      <span class="ri">${esc(t.abbr)}</span>
    </button>`).join(""));
  const items = [...list.querySelectorAll(".rsx")];

  /* split the name so every letter can arrive on its own beat */
  const letters = s => [...s].map((c, i) =>
    `<span class="ch" style="--i:${i}">${c === " " ? "&nbsp;" : esc(c)}</span>`).join("");

  function moveMark(el) {
    mark.style.height = (el.offsetHeight - 10) + "px";
    mark.style.transform = "translateY(" + (el.offsetTop + 5) + "px)";
    /* on the narrow layout the roster is a horizontal strip — keep the pill in view */
    if (list.scrollWidth > list.clientWidth + 4) {
      list.scrollTo({ left: el.offsetLeft - (list.clientWidth - el.offsetWidth) / 2,
                      behavior: REDUCE ? "auto" : "smooth" });
    }
  }

  function select(i, dir) {
    i = (i + G.length) % G.length;
    if (i === cur) return;
    const prev = cur, t = G[i];
    cur = i;
    const my = ++ticket;

    /* the outgoing name, blown up behind the new one */
    if (prev > -1 && !REDUCE) {
      const ghost = document.createElement("div");
      ghost.className = "st-ghost";
      ghost.textContent = G[prev].short;
      ghost.style.setProperty("--gy", nameEl.offsetTop + "px");
      stage.appendChild(ghost);
      setTimeout(() => ghost.remove(), 700);
    }

    /* the team's own accent takes over the whole scene */
    scene.style.setProperty("--ac", t.accent);
    scene.style.setProperty("--glow", t.glow);

    stage.classList.remove("st-in");
    void stage.offsetWidth;                       // restart the entrance animations
    nameEl.style.setProperty("--dir", dir >= 0 ? 1 : -1);
    nameEl.innerHTML = letters(t.short);
    nameEl.setAttribute("aria-label", t.name);
    document.getElementById("st-abbr").textContent = t.abbr;
    document.getElementById("st-region").textContent = t.region;
    document.getElementById("st-inst-t").textContent = t.institution + " · " + t.city;
    document.getElementById("st-about").textContent = t.about;
    document.getElementById("st-pos").textContent = (i + 1) + " / " + G.length;
    /* the institution's own mark carries the background; the numeral stands in
       whenever a logo file has not been supplied yet */
    const num = document.getElementById("st-num"), logo = document.getElementById("st-logo");
    num.textContent = String(i + 1).padStart(2, "0");
    if (t.logo) {
      logo.onload  = () => { logo.hidden = false; num.hidden = true; };
      logo.onerror = () => { logo.hidden = true;  num.hidden = false; };
      logo.hidden = true; num.hidden = false;
      logo.src = t.logo;
    } else {
      logo.hidden = true; num.hidden = false;
    }
    stage.classList.add("st-in");

    items.forEach((el, n) => {
      el.setAttribute("aria-selected", n === i ? "true" : "false");
      el.tabIndex = n === i ? 0 : -1;
    });
    stage.setAttribute("aria-labelledby", "rsx-" + i);
    moveMark(items[i]);
    if (my !== ticket) return;
  }

  list.addEventListener("click", e => {
    const b = e.target.closest(".rsx"); if (!b) return;
    const i = +b.dataset.i;
    select(i, i > cur ? 1 : -1);
  });
  list.addEventListener("keydown", e => {
    let d = 0;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") d = 1;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") d = -1;
    if (e.key === "Home") { e.preventDefault(); select(0, -1); items[0].focus(); return; }
    if (e.key === "End") { e.preventDefault(); select(G.length - 1, 1); items[G.length - 1].focus(); return; }
    if (!d) return;
    e.preventDefault();
    const n = (cur + d + G.length) % G.length;
    select(n, d);
    items[n].focus();
  });
  document.getElementById("st-prev").addEventListener("click", () => select(cur - 1, -1));
  document.getElementById("st-next").addEventListener("click", () => select(cur + 1, 1));

  select(0, 1);
  window.addEventListener("resize", () => { if (cur > -1) moveMark(items[cur]); });
})();

/* ---------- where the cohort comes from ---------- */
(function () {
  const by = new Map();
  G.forEach(t => {
    if (!by.has(t.institution)) by.set(t.institution, { abbr: t.abbr, city: t.city, region: t.region, mark: t.mark, teams: [] });
    by.get(t.institution).teams.push(t.short);
  });
  document.getElementById("instgrid").innerHTML = [...by.entries()]
    .sort((a, b) => b[1].teams.length - a[1].teams.length || a[1].abbr.localeCompare(b[1].abbr))
    .map(([inst, d], i) => `
      <div class="inst reveal" style="--d:${i * 50}ms">
        <div class="ih">
          <span class="ilogo"><img src="${d.mark}" alt="" loading="lazy"></span>
          <span class="ihx">
            <span class="ia">${esc(d.abbr)}</span>
            <h4>${esc(inst)}</h4>
            <span class="ip">${esc(d.city)} · ${esc(d.region)}</span>
          </span>
        </div>
        <div class="it">
          <span class="itl">${d.teams.length === 1 ? "Team" : "Teams"}</span>
          ${d.teams.map(n => `<span class="tp">${esc(n)}</span>`).join("")}
        </div>
      </div>`).join("");
})();


})();
/* ---- my-team.html ---- */
(function(){
const MAXS = 4;
const fx2 = n => Number(n).toFixed(2);
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function tipAt(tip, host, x, y, html) {
  if (!tip) return;
  tip.innerHTML = html;
  tip.style.left = x + "px";
  tip.style.top  = y + "px";
  tip.classList.add("on");
}
const heat = s => "heat heat-" + (s >= 3.5 ? 4 : s >= 3.0 ? 3 : s >= 2.5 ? 2 : 1);

function fitChart(host, draw) {
  if (!host) return;
  host._draw = draw;
  function paint() {
    const W = Math.round(host.clientWidth), H = Math.round(host.clientHeight);
    if (W < 40 || H < 40) return;
    const old = host.querySelector("svg"); if (old) old.remove();
    host.insertAdjacentHTML("afterbegin", host._draw(W, H));
  }
  host._paint = paint;
  paint();
  if (!host._roAttached) {
    host._roAttached = true;
    if ("ResizeObserver" in window) {
      new ResizeObserver(() => {
        if (!host._queued) {
          host._queued = true;
          requestAnimationFrame(() => { host._queued = false; if (host._paint) host._paint(); });
        }
      }).observe(host);
    } else {
      window.addEventListener("resize", () => {
        if (!host._queued) {
          host._queued = true;
          requestAnimationFrame(() => { host._queued = false; if (host._paint) host._paint(); });
        }
      });
    }
  }
  return paint;
}

const HSTATE = {
  on_time: { label: "On time",       cls: "ok" },
  late:    { label: "Late",          cls: "late" },
  missed:  { label: "Not submitted", cls: "miss" },
  open:    { label: "Not due yet",   cls: "open" },
};

function pair(frontId, backId, onShow) {
  const front = document.getElementById(frontId), back = document.getElementById(backId);
  if (!front || !back) return;
  if (!front._paired) {
    front._paired = true;
    function face(el) {
      [front, back].forEach(f => { f.hidden = f !== el; f.classList.remove("enter"); });
      void el.offsetWidth; el.classList.add("enter"); el.focus();
      if (el === back && onShow) requestAnimationFrame(onShow);
    }
    [[front, back], [back, front]].forEach(([from, to]) => {
      from.addEventListener("click", () => face(to));
      from.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); face(to); }
      });
    });
  }
}

window.__renderMyTeam = function(targetTeamId) {
  const gate = document.getElementById("myteam-locked-gate");
  const content = document.getElementById("myteam-content-wrap");
  if (!gate || !content) return;

  const auth = window.MOCK && window.MOCK.auth;
  if (!auth || !auth.canAccess("myteam")) {
    gate.hidden = false;
    content.hidden = true;
    const slot = document.getElementById("team-switcher-slot");
    if (slot) slot.innerHTML = "";
    return;
  }

  gate.hidden = true;
  content.hidden = false;

  const user = auth.getCurrentUser();
  const assigned = auth.getAssignedTeams();
  let activeId;
  if (user.role === "participant") {
    activeId = user.team_id || "g1";
  } else {
    if (targetTeamId && (assigned.includes(targetTeamId) || user.role === "admin")) {
      activeId = targetTeamId;
    } else if (window.__selectedTeamId && (assigned.includes(window.__selectedTeamId) || user.role === "admin")) {
      activeId = window.__selectedTeamId;
    } else {
      activeId = assigned[0] || "g1";
    }
  }
  window.__selectedTeamId = activeId;

  const teams = window.MOCK.teams;
  const TEAM = teams.find(t => t.id === activeId) || teams[0];
  const TW = window.MOCK.getTeamWork(activeId);
  const CAP = window.MOCK.getCapstone(activeId);
  const helpers = window.MOCK.helpers;

  // Render team switcher
  const slot = document.getElementById("team-switcher-slot");
  if (slot) {
    if (user.role === "participant") {
      slot.innerHTML = `
        <div class="team-switcher-bar">
          <span style="font-weight:700;color:var(--ink-soft);font-size:0.95rem;">Assigned Team:</span>
          <span class="badge blue" style="font-size:0.85rem;padding:4px 10px;">${esc(TEAM.name)} — ${esc(TEAM.technology_title)}</span>
          <span class="small muted" style="margin-left:auto;">Participant access locked to your registered STEP Group</span>
        </div>`;
    } else {
      const allowedTeams = (user.role === "admin") ? teams : teams.filter(t => assigned.includes(t.id));
      if (allowedTeams.length > 1) {
        slot.innerHTML = `
          <div class="team-switcher-bar">
            <label for="team-select-myteam" style="font-weight:700;color:var(--ink);font-size:0.95rem;">Viewing Team:</label>
            <select id="team-select-myteam" class="form-select" style="padding:6px 12px;border-radius:var(--r1);border:1px solid var(--rim);background:var(--paper);font-weight:600;font-size:0.9rem;cursor:pointer;">
              ${allowedTeams.map(t => `<option value="${t.id}" ${t.id === activeId ? 'selected' : ''}>${esc(t.name)} — ${esc(t.technology_title)}</option>`).join('')}
            </select>
            <span class="badge gold" style="text-transform:capitalize;">${user.role} View (${allowedTeams.length} teams assigned)</span>
          </div>`;
        const sel = document.getElementById("team-select-myteam");
        if (sel) {
          sel.addEventListener("change", (e) => {
            window.__selectedTeamId = e.target.value;
            window.__renderMyTeam(e.target.value);
            document.dispatchEvent(new CustomEvent("stephub_team_changed", { detail: e.target.value }));
          });
        }
      } else {
        slot.innerHTML = `
          <div class="team-switcher-bar">
            <span style="font-weight:700;color:var(--ink-soft);font-size:0.95rem;">Assigned Team:</span>
            <span class="badge blue" style="font-size:0.85rem;padding:4px 10px;">${esc(TEAM.name)} — ${esc(TEAM.technology_title)}</span>
            <span class="badge gold" style="text-transform:capitalize;margin-left:auto;">${user.role}</span>
          </div>`;
      }
    }
  }

  // Team bar
  const tbName = document.getElementById("tb-name"); if (tbName) tbName.textContent = TEAM.name;
  const tbTech = document.getElementById("tb-tech"); if (tbTech) tbTech.textContent = TEAM.technology_title;
  const tbChips = document.getElementById("tb-chips");
  if (tbChips) {
    tbChips.innerHTML = [
      TEAM.implementing_agency, TEAM.region,
      "Week " + TW.week_no + " of " + TW.weeks_total,
    ].map(c => `<span class="chip">${esc(c)}</span>`).join("");
  }
  const tbRoster = document.getElementById("tb-roster");
  if (tbRoster) {
    tbRoster.innerHTML = TW.members.map(m => `<span class="avatar" title="${esc(m.name)} · ${esc(m.role)}">${esc(m.initials)}</span>`).join("");
  }
  const tbRosterCap = document.getElementById("tb-rostercap");
  if (tbRosterCap) tbRosterCap.textContent = TW.members.length + " members";

  /* Radar Chart */
  const O = TW.outputs, N = O.length;
  const rWrap = document.getElementById("radar-wrap");
  const rTip = document.getElementById("radar-tip");
  let rGeo = null;

  fitChart(rWrap, (W, H) => {
    const tight = W < 520;
    const mx = tight ? 48 : 112, my = tight ? 50 : 74, LAB = tight ? 18 : 30;
    const R = Math.max(70, Math.min((W - mx * 2) / 2, (H - my * 2) / 2));
    const C = W / 2, CY = H / 2;
    const ang = i => (Math.PI * 2 * i) / N - Math.PI / 2;
    const pt  = (i, r) => [C + Math.cos(ang(i)) * r, CY + Math.sin(ang(i)) * r];
    const rOf = v => ((v - 1) / (MAXS - 1)) * R;
    rGeo = { pt, rOf, R };

    const poly = (r) => O.map((_, i) => pt(i, r).map(n => n.toFixed(1)).join(",")).join(" ");
    const avg = O.reduce((a, o) => a + o.score, 0) / N;
    const hi = Math.max(...O.map(o => o.score)), lo = Math.min(...O.map(o => o.score));

    let g = `<defs>
      <radialGradient id="rdFill" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stop-color="#1f6fb2" stop-opacity=".07"/>
        <stop offset="62%"  stop-color="#1f6fb2" stop-opacity=".17"/>
        <stop offset="100%" stop-color="#1f6fb2" stop-opacity=".30"/>
      </radialGradient>
      <filter id="rdLift" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#0b3c6b" flood-opacity=".18"/>
      </filter>
    </defs>`;

    [4, 3, 2, 1].forEach((v, k) => {
      g += `<polygon class="radar-band" points="${poly(rOf(v))}" style="opacity:${(.2 + k * .17).toFixed(2)}"/>`;
    });
    [1, 2, 3, 4].forEach(v => {
      g += `<polygon class="radar-grid${v === MAXS ? " outer" : ""}" points="${poly(rOf(v))}"/>`;
      if (v > 1) g += `<text class="radar-ring-label" x="${C + 5}" y="${(CY - rOf(v) + 4).toFixed(1)}">${fx2(v)}</text>`;
    });
    O.forEach((_, i) => {
      const [x, y] = pt(i, R);
      g += `<line class="radar-spoke" x1="${C}" y1="${CY}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`;
    });
    g += `<polygon class="radar-avg" points="${poly(rOf(avg))}"/>`;
    if (!tight) g += `<text class="radar-avg-lab" x="${(C - 22).toFixed(1)}" y="${(CY - rOf(avg) - 5).toFixed(1)}" text-anchor="end">avg ${fx2(avg)}</text>`;
    g += `<polygon class="radar-shape" filter="url(#rdLift)" points="${
      O.map((o, i) => pt(i, rOf(o.score)).map(n => n.toFixed(1)).join(",")).join(" ")}"/>`;
    g += `<circle class="radar-hub" cx="${C}" cy="${CY}" r="3"/>`;
    O.forEach((o, i) => {
      const [lx, ly] = pt(i, R + LAB);
      const anchor = Math.abs(lx - C) < 14 ? "middle" : (lx > C ? "start" : "end");
      const em = o.score === hi ? " hi" : o.score === lo ? " lo" : "";
      const lines = tight ? [o.code] : o.axis.split("\n");
      const dy0 = -((lines.length - 1) * 7) - 6;
      g += `<text class="radar-axis-label${em}" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}">` +
           lines.map((ln, k) => `<tspan x="${lx.toFixed(1)}" dy="${k === 0 ? dy0 : 14}">${esc(ln)}</tspan>`).join("") +
           `<tspan x="${lx.toFixed(1)}" dy="16" class="radar-axis-score${em}">${fx2(o.score)}</tspan></text>`;
    });
    O.forEach((o, i) => {
      const [x, y] = pt(i, rOf(o.score));
      const mark = o.score === hi ? "hi" : o.score === lo ? "lo" : "";
      if (mark) g += `<circle class="radar-halo ${mark}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11" style="--i:${i}"/>`;
      g += `<circle class="radar-pt ${mark}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" style="--i:${i}" data-i="${i}" aria-label="${esc(o.full)}, ${fx2(o.score)} out of 4.00${mark === "hi" ? ", the strongest" : mark === "lo" ? ", the weakest" : ""}"/>`;
    });
    return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%" role="img" aria-label="Radar chart of panel scores across ${N} weekly outputs">${g}</svg>`;
  });

  if (rWrap && !rWrap._tipWired) {
    rWrap._tipWired = true;
    rWrap.addEventListener("mouseover", e => {
      const el = e.target.closest(".radar-pt"); if (!el || !rGeo) return;
      const o = O[+el.dataset.i], [x, y] = rGeo.pt(+el.dataset.i, rGeo.rOf(o.score));
      const box = rWrap.getBoundingClientRect(), svg = rWrap.querySelector("svg").getBoundingClientRect();
      tipAt(rTip, rWrap, svg.left - box.left + x, svg.top - box.top + y,
        `<b>Week ${o.week} · ${o.code}</b>${esc(o.full)}<br>
         <span class="sc">${fx2(o.score)} / 4.00</span> · Panel ${o.panel}`);
    });
    rWrap.addEventListener("mouseout", e => {
      if (!e.relatedTarget || !rWrap.contains(e.relatedTarget)) rTip.classList.remove("on");
    });
  }

  const scores = O.map(o => o.score);
  const avg = scores.reduce((a, b) => a + b, 0) / N;
  const best = O[scores.indexOf(Math.max(...scores))];
  const low  = O[scores.indexOf(Math.min(...scores))];
  document.getElementById("rd-avg").textContent  = fx2(avg);
  document.getElementById("rd-best").textContent = fx2(best.score);
  document.getElementById("rd-low").textContent  = fx2(low.score);
  document.getElementById("rd-best-n").textContent = " · " + best.axis.replace("\n", " ");
  document.getElementById("rd-low-n").textContent  = " · " + low.axis.replace("\n", " ");
  document.getElementById("rd-weeks").textContent = N + " scored outputs";

  document.getElementById("score-rows").innerHTML = O.map((o, i) => {
    const d = i === 0 ? null : o.score - O[i - 1].score;
    const cls = d === null ? "flat" : d > 0.04 ? "up" : d < -0.04 ? "down" : "flat";
    const txt = d === null ? "—" : (d > 0 ? "▲ +" : d < 0 ? "▼ " : "– ") + Math.abs(d).toFixed(2);
    return `<tr>
      <td>Week ${o.week}</td>
      <td><strong>${o.code}</strong> · ${esc(o.full)}</td>
      <td>Panel ${o.panel}</td>
      <td>${helpers.fmtDate(o.scored_on + "T09:00:00+08:00")}</td>
      <td><span class="${heat(o.score)}">${fx2(o.score)}</span></td>
      <td><span class="trend ${cls}">${txt}</span></td>
    </tr>`;
  }).join("");

  /* Video handins bar chart */
  const H = TW.handins;
  const hoursEarly = h => (new Date(h.due) - new Date(h.video.at)) / 3600000;
  const rows = H.map(h => ({
    week: h.week, code: h.code, state: h.video.state,
    at: h.video.at, hrs: h.video.at ? hoursEarly(h) : 0,
  }));
  const done = rows.filter(r => r.state !== "open");
  const onTime = done.filter(r => r.state === "on_time").length;

  document.getElementById("hi-pill").textContent = onTime + " of " + done.length + " on time";
  const present = ["on_time", "late", "missed", "open"].filter(st => rows.some(r => r.state === st));
  document.getElementById("hi-legend").innerHTML = present.map(st =>
    `<span><i class="sq ${HSTATE[st].cls}"></i>${HSTATE[st].label} · <b>${
      rows.filter(r => r.state === st).length}</b></span>`).join("");

  const hiHost = document.getElementById("hi-bars"), hiTip = document.getElementById("hi-tip");
  const hiMax = Math.max(1, ...rows.map(r => r.hrs)), loMin = Math.min(-0.5, ...rows.map(r => r.hrs));
  const top = Math.ceil(hiMax * 2) / 2, bot = Math.floor(loMin * 2) / 2;
  let hiGeo = null;

  fitChart(hiHost, (W, Ht) => {
    const padL = 34, padR = 8, padT = 14, padB = 36, n = rows.length;
    const slot = (W - padL - padR) / n, bw = Math.min(30, slot * 0.58);
    const y = v => padT + ((top - v) / (top - bot)) * (Ht - padT - padB);
    const bx = i => padL + slot * i + (slot - bw) / 2;
    hiGeo = { y, bx, bw, padT };
    let g = "";
    for (let v = Math.ceil(bot); v <= top; v++) {
      if (v === 0) continue;
      g += `<line class="tw-grid" x1="${padL}" y1="${y(v)}" x2="${W - padR}" y2="${y(v)}"/>
            <text class="tw-axis" x="${padL - 6}" y="${y(v) + 4}" text-anchor="end">${v}h</text>`;
    }
    rows.forEach((r, i) => {
      const x0 = bx(i);
      if (r.state === "open") {
        g += `<rect class="tw-open-bar" x="${x0}" y="${y(0) - 16}" width="${bw}" height="16" rx="4"/>`;
      } else if (r.state === "missed") {
        g += `<rect class="tw-bar short" x="${x0}" y="${y(0)}" width="${bw}" height="${y(bot) - y(0)}" rx="4"/>`;
      } else {
        const up = r.hrs >= 0, y0 = up ? y(r.hrs) : y(0), h = Math.abs(y(r.hrs) - y(0));
        g += `<rect class="tw-vbar ${HSTATE[r.state].cls}" x="${x0}" y="${y0}" width="${bw}" height="${Math.max(3, h)}" rx="4"/>`;
        g += `<text class="tw-blab" x="${x0 + bw / 2}" y="${(up ? y0 : y(0)) - 6}" text-anchor="middle" style="font-weight:800${up ? "" : ";fill:#9a690c"}">${up ? "" : "−"}${Math.abs(r.hrs).toFixed(1)}h</text>`;
      }
      g += `<text class="tw-blab" x="${x0 + bw / 2}" y="${Ht - padB + 15}" text-anchor="middle">W${r.week}</text>`;
      g += `<rect class="tw-bar-hit" data-i="${i}" x="${padL + slot * i}" y="${padT}" width="${slot}" height="${Ht - padT - padB}"/>`;
    });
    g += `<line class="tw-thr" style="stroke:var(--ink-soft)" x1="${padL}" y1="${y(0)}" x2="${W - padR}" y2="${y(0)}"/>
          <text class="tw-axis" x="${padL - 6}" y="${y(0) + 4}" text-anchor="end">due</text>`;
    return `<svg viewBox="0 0 ${W} ${Ht}" width="100%" height="100%" role="img" aria-label="Bar chart of how many hours before the deadline each week's five-minute video was handed in">${g}</svg>`;
  });

  if (hiHost && !hiHost._tipWired) {
    hiHost._tipWired = true;
    hiHost.addEventListener("mousemove", e => {
      const hit = e.target.closest(".tw-bar-hit"); if (!hit || !hiGeo) return;
      const r = rows[+hit.dataset.i];
      const mins = Math.round(Math.abs(r.hrs) * 60);
      tipAt(hiTip, hiHost, hiGeo.bx(+hit.dataset.i) + hiGeo.bw / 2,
        r.state === "open" ? hiGeo.y(0) - 16 : hiGeo.y(Math.max(0, r.hrs)),
        `<b>Week ${r.week} · ${r.code}</b><span class="big">${HSTATE[r.state].label}</span>` +
        (r.at ? `<br>${helpers.fmtDate(r.at)} ${helpers.fmtTime(r.at)}<br>${
          mins >= 60 ? (mins / 60).toFixed(1) + " hours" : mins + " minutes"} ${
          r.hrs >= 0 ? "before the deadline" : "past the deadline"}` : "<br>Due Friday, 12:00 NN"));
    });
    hiHost.addEventListener("mouseleave", () => hiTip.classList.remove("on"));
  }

  /* FASTRAC proposal status */
  const F = CAP.form;
  const BAND = {
    ready:  { label: "Reviewed",      cls: "ok",   of: ["reviewed"] },
    review: { label: "With STEP",     cls: "wait", of: ["submitted"] },
    doing:  { label: "Being written", cls: "late", of: ["draft", "revise", "open"] },
    later:  { label: "Opens later",   cls: "none", of: ["locked"] },
  };
  const bandOf = st => Object.keys(BAND).find(k => BAND[k].of.includes(st)) || "later";
  const groups = [];
  F.forEach(it => {
    let g = groups.find(x => x.name === it.group);
    if (!g) groups.push(g = { name: it.group, n: 0, ready: 0, review: 0, doing: 0, later: 0 });
    g.n++; g[bandOf(it.status)]++;
  });
  const tot = { ready: 0, review: 0, doing: 0, later: 0 };
  groups.forEach(g => Object.keys(tot).forEach(k => tot[k] += g[k]));

  document.getElementById("fa-sub").textContent =
    `The ${F.length} items of DOST Form 2 · Demo day ${helpers.fmtDate(CAP.demo_day + "T09:00:00+08:00")}`;
  document.getElementById("fa-legend").innerHTML = Object.keys(BAND)
    .filter(k => tot[k])
    .map(k => `<span><i class="sq ${BAND[k].cls}"></i>${BAND[k].label} · <b>${tot[k]}</b></span>`).join("");

  document.getElementById("fa-rows").innerHTML = groups.map(g => `
    <div class="tw-fa-row" title="${esc(g.name)}">
      <span class="nm">${esc(g.name)}</span>
      <span class="bar">${Object.keys(BAND).filter(k => g[k])
        .map(k => `<i class="${BAND[k].cls}" style="flex:${g[k]}" title="${g[k]} ${BAND[k].label.toLowerCase()}"></i>`).join("")}</span>
      <span class="ct">${g.ready + g.review}/${g.n}</span>
    </div>`).join("");

  /* Trajectory */
  const T = TW.trajectory, NOW = TW.week_no;
  const lastWk = Math.max(NOW, T[T.length - 1].week), lastT = T[T.length - 1];
  const tjHost = document.getElementById("tj-plot"), tjTip = document.getElementById("tj-tip");
  let tjGeo = null;

  const repaintTrajectory = fitChart(tjHost, (W, H) => {
    const padL = 36, padR = 30, padT = 14, padB = 40;
    const x = wk => padL + ((wk - 1) / (lastWk - 1)) * (W - padL - padR);
    const y = v  => padT + ((MAXS - v) / (MAXS - 1)) * (H - padT - padB);
    const p = (wk, v) => x(wk).toFixed(1) + "," + y(v).toFixed(1);
    tjGeo = { x, y };

    let g = "";
    [1, 2, 3, 4].forEach(v => {
      g += `<line class="tw-grid" x1="${padL}" y1="${y(v)}" x2="${W - padR}" y2="${y(v)}"/>
            <text class="tw-axis" x="${padL - 7}" y="${y(v) + 4}" text-anchor="end">${fx2(v)}</text>`;
    });
    g += `<polygon class="tw-under" points="${x(1).toFixed(1)},${y(1)} ${
      T.map(r => p(r.week, r.score)).join(" ")} ${x(lastT.week).toFixed(1)},${y(1)}"/>`;
    g += `<polyline class="tw-line" points="${T.map(r => p(r.week, r.score)).join(" ")}"/>`;
    if (lastWk > lastT.week) g += `<line class="tw-med" x1="${x(lastWk)}" y1="${padT}" x2="${x(lastWk)}" y2="${H - padB}"/>`;
    g += `<line class="tw-cross" id="tj-cross" x1="0" y1="${padT}" x2="0" y2="${H - padB}"/>`;
    for (let wk = 1; wk <= lastWk; wk++) {
      const r = T.find(t => t.week === wk);
      g += `<text class="tw-axis" x="${x(wk)}" y="${H - padB + 18}" text-anchor="middle" ${r ? "" : 'style="fill:#96a2ad"'}>W${wk}</text>`;
      if (!r) g += `<text class="tw-axis" x="${x(wk)}" y="${H - padB + 31}" text-anchor="middle" style="fill:#96a2ad;font-weight:700">now</text>`;
    }
    T.forEach(r => {
      g += `<circle class="tw-dot" cx="${x(r.week)}" cy="${y(r.score)}" r="4.5"/>`;
      g += `<text class="tw-ptlab" x="${x(r.week)}" y="${y(r.score) - 12}" text-anchor="middle">${fx2(r.score)}</text>`;
    });
    const half = (W - padL - padR) / (lastWk - 1) / 2;
    T.forEach(r => {
      g += `<rect class="tw-hit" data-w="${r.week}" x="${x(r.week) - half}" y="${padT}" width="${half * 2}" height="${H - padT - padB}"/>`;
    });
    return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%" role="img" aria-label="Line chart of this team's weighted average from Week 1 to Week ${lastT.week}">${g}</svg>`;
  });

  if (tjHost && !tjHost._tipWired) {
    tjHost._tipWired = true;
    tjHost.addEventListener("mousemove", e => {
      const hit = e.target.closest(".tw-hit"); if (!hit || !tjGeo) return;
      const i = T.findIndex(t => t.week === +hit.dataset.w), r = T[i];
      const cross = tjHost.querySelector("#tj-cross");
      if (cross) { cross.setAttribute("x1", tjGeo.x(r.week)); cross.setAttribute("x2", tjGeo.x(r.week)); }
      tjHost.classList.add("on");
      const d = i ? r.score - T[i - 1].score : null;
      tipAt(tjTip, tjHost, tjGeo.x(r.week), tjGeo.y(r.score),
        `<b>Week ${r.week} · ${r.code}</b><span class="big">${fx2(r.score)}</span> / 4.00` +
        (d === null ? "<br>your first scored output" : `<br>${d >= 0 ? "+" : ""}${d.toFixed(2)} on the week before`));
    });
    tjHost.addEventListener("mouseleave", () => { tjTip.classList.remove("on"); tjHost.classList.remove("on"); });
  }

  const chg = lastT.score - (T[T.length - 2] ? T[T.length - 2].score : lastT.score);
  const bestT = T.reduce((a, b) => (b.score > a.score ? b : a));
  document.getElementById("tj-now").textContent   = fx2(lastT.score);
  document.getElementById("tj-nowk").textContent  = " · Week " + lastT.week;
  document.getElementById("tj-chg").textContent   = (chg >= 0 ? "+" : "") + chg.toFixed(2);
  document.getElementById("tj-best").textContent  = fx2(bestT.score);
  document.getElementById("tj-bestk").textContent = " · Week " + bestT.week;

  pair("face-radar", "face-trend", repaintTrajectory);
  pair("face-video", "face-fastrac");
  pair("face-att", "face-grid");

  /* KPIs */
  const G = TW.attendance_grid, SES = TW.sessions_held;
  const tScores = T.map(r => r.score);
  const tAvg = tScores.reduce((a, b) => a + b, 0) / tScores.length;
  const lastScore = T[T.length - 1], prevScore = T[T.length - 2] || lastScore;
  const kpiChg = lastScore.score - prevScore.score;
  const out = TW.outputs.find(o => o.week === lastScore.week) || {};

  const count = { on_time: 0, late: 0, missed: 0, open: 0 };
  TW.handins.forEach(h => TW.handin_kinds.forEach(k => count[h[k.key].state]++));
  const dueTotal = count.on_time + count.late + count.missed;

  const perSession = SES.map((_, i) => TW.members.reduce((s, m) => s + G[m.initials][i], 0));
  const presentTot = perSession.reduce((a, b) => a + b, 0);
  const seats = perSession.length * TW.members.length;
  const met = perSession.filter(c => c >= 3).length;

  const spark = (vals) => {
    const w = 120, h = 34, lo = 1, hi = 4;
    const px = i => (i / (vals.length - 1)) * w;
    const py = v => h - ((v - lo) / (hi - lo)) * h;
    const pts = vals.map((v, i) => `${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(" ");
    return `<svg class="tw-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
              <path class="fl" d="M0,${h} L${pts.replace(/ /g, " L")} L${w},${h} Z"/>
              <path class="ln" d="M${pts.replace(/ /g, " L")}"/>
            </svg>`;
  };

  document.getElementById("tw-kpis").innerHTML = `
    <div class="tw-kpi hero reveal">
      <div class="k-lab">Cycle average</div>
      <div class="k-val">${fx2(tAvg)}<small>/ 4.00</small></div>
      <p class="k-note">Across <b>${tScores.length}</b> scored outputs, Weeks 1 to ${lastScore.week}.</p>
      ${spark(tScores)}
    </div>
    <div class="tw-kpi reveal" style="--d:60ms">
      <div class="k-lab">Latest score</div>
      <div class="k-val">${fx2(lastScore.score)}<small>/ 4.00</small></div>
      <p class="k-note"><span class="tw-delta ${kpiChg >= 0 ? "up" : "down"}">${kpiChg >= 0 ? "▲ +" : "▼ "}${Math.abs(kpiChg).toFixed(2)}</span>
         on Week ${prevScore.week} · ${esc((out.axis || "").replace("\n", " "))}</p>
    </div>
    <div class="tw-kpi reveal" style="--d:120ms">
      <div class="k-lab">Handed in on time</div>
      <div class="k-val">${dueTotal > 0 ? Math.round(count.on_time / dueTotal * 100) : 100}<small>%</small></div>
      <p class="k-note"><b>${count.on_time} of ${dueTotal}</b> deliverables due so far${
        count.late ? ` · ${count.late} late` : ""}${count.missed ? ` · ${count.missed} missed` : ""}</p>
    </div>
    <div class="tw-kpi reveal" style="--d:180ms">
      <div class="k-lab">Seats filled</div>
      <div class="k-val">${seats > 0 ? Math.round(presentTot / seats * 100) : 100}<small>%</small></div>
      <p class="k-note"><b>${met} of ${perSession.length}</b> sessions met the three-member minimum${
        met < perSession.length ? ` · short in ${perSession.length - met}` : ""}</p>
    </div>`;

  /* Insights / Thematic Analysis */
  const I = TW.insight, C = I.corpus;
  document.getElementById("ta-method").textContent =
    I.method + ". " + C.comments + " comments from " + C.panelists + " panelists across " +
    C.sessions + " feedback sessions became " + C.codes + " codes and " + C.themes + " themes.";

  document.getElementById("ta-strip").innerHTML = [
    [C.comments, "Comments coded"], [C.panelists, "Panelists"], [C.sessions, "Sessions"],
    [C.codes, "Codes"], [C.themes, "Themes"],
  ].map(([n, l]) => `<div><b>${n}</b><span>${l}</span></div>`).join("");

  document.getElementById("ta-phases").innerHTML = I.phases.map((p, i) =>
    `<div class="tw-ph reveal" style="--i:${i}; --d:${i * 50}ms">
       <b>Phase ${p.n}</b><span class="nm">${esc(p.name)}</span><span class="nt">${esc(p.note)}</span>
     </div>`).join("");

  const codes = I.themes.flatMap(t => t.codes.map(c => ({ ...c, pol: t.polarity, theme: t.name })))
                        .sort((a, b) => b.n - a.n);
  const topCode = Math.max(...codes.map(c => c.n));
  document.getElementById("ta-codes").innerHTML = codes.map(c => `
    <div class="tw-code" title="${esc(c.theme)}">
      <span class="cl">${esc(c.label)}</span>
      <span class="cn">${c.n}</span>
      <span class="cb"><i class="${c.pol}" data-w="${(c.n / topCode * 100).toFixed(1)}"></i></span>
    </div>`).join("");

  (function () {
    const bars = document.querySelectorAll("#ta-codes .cb i");
    const grow = () => bars.forEach(b => { b.style.width = b.dataset.w + "%"; });
    grow();
  })();

  document.getElementById("ta-sat").textContent = I.saturation;
  document.getElementById("ta-claim").textContent = I.claim;

  const POL = { strength: "Strength", gap: "Gap", watch: "Watch" };
  document.getElementById("ta-themes").innerHTML = I.themes.map((t, i) => `
    <div class="tw-theme reveal${i === 0 ? " open" : ""}" style="--d:${i * 60}ms">
      <button class="tw-theme-h" type="button" aria-expanded="${i === 0}">
        <span class="pol ${t.polarity}"></span>
        <span class="nm">${esc(t.name)}</span>
        <span class="ct">${POL[t.polarity]} · ${t.mentions} of ${C.comments}</span>
        <svg class="cv" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div class="tw-theme-b"><div class="tw-theme-in"><div>
        <p class="det">${esc(t.detail)}</p>
        <div class="tw-chips">${t.codes.map(c => `<span>${esc(c.label)} · ${c.n}</span>`).join("")}</div>
        ${t.extracts.map(x => `<blockquote class="tw-ex"><q>${esc(x.text)}</q>
            <span class="src">${esc(x.who)} · Week ${x.week}</span></blockquote>`).join("")}
      </div></div></div>
    </div>`).join("");

  const taThemesWrap = document.getElementById("ta-themes");
  if (taThemesWrap && !taThemesWrap._clickWired) {
    taThemesWrap._clickWired = true;
    taThemesWrap.addEventListener("click", e => {
      const b = e.target.closest(".tw-theme-h"); if (!b) return;
      const card = b.closest(".tw-theme"), open = !card.classList.contains("open");
      card.classList.toggle("open", open);
      b.setAttribute("aria-expanded", String(open));
    });
  }

  document.getElementById("ins-next").innerHTML = I.next.map(n => `<li>${esc(n)}</li>`).join("");
  const insNote = document.querySelector("#ins-note span");
  if (insNote) {
    insNote.textContent =
      `Coded by the STEP AI assistant from ${I.based_on} panel comments (${I.weeks}), then checked and released by ` +
      `${I.reviewed_by} on ${helpers.fmtDate(I.reviewed_on + "T09:00:00+08:00")}. Advisory only — it does not affect your grade.`;
  }

  /* Attendance */
  const nSes = SES.length;
  const avgPresent = perSession.reduce((a, b) => a + b, 0) / nSes;
  const maxM = TW.members.length;
  const attHost = document.getElementById("att-bars"), attTip = document.getElementById("att-tip");
  let attGeo = null;

  const barPath = (x0, y0, w, h, r) => {
    r = Math.min(r, h, w / 2);
    return `M${x0},${y0 + h} L${x0},${y0 + r} Q${x0},${y0} ${x0 + r},${y0}
            L${x0 + w - r},${y0} Q${x0 + w},${y0} ${x0 + w},${y0 + r} L${x0 + w},${y0 + h} Z`;
  };

  fitChart(attHost, (W, H) => {
    const padL = 24, padR = 8, padT = 12, padB = 38;
    const slot = (W - padL - padR) / nSes, bw = Math.min(30, slot * 0.64);
    const y = v => padT + ((maxM - v) / maxM) * (H - padT - padB);
    const bx = i => padL + slot * i + (slot - bw) / 2;
    attGeo = { y, bx, bw, padT, padB, H };
    let g = "";
    for (let v = 0; v <= maxM; v++) {
      g += `<line class="tw-grid" x1="${padL}" y1="${y(v)}" x2="${W - padR}" y2="${y(v)}"/>`;
      if (v) g += `<text class="tw-axis" x="${padL - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
    }
    perSession.forEach((v, i) => {
      const short = v < 3, h = (H - padT - padB) - (y(v) - padT);
      g += `<path class="tw-bar${short ? " short" : ""}" d="${barPath(bx(i), y(v), bw, h, 4)}"/>`;
      g += h > 17
        ? `<text class="tw-bval" x="${bx(i) + bw / 2}" y="${y(v) + 13}" text-anchor="middle">${v}</text>`
        : `<text class="tw-blab" x="${bx(i) + bw / 2}" y="${y(v) - 4}" text-anchor="middle" style="font-weight:800;fill:var(--tw-miss)">${v}</text>`;
      g += `<text class="tw-blab" x="${bx(i) + bw / 2}" y="${H - padB + 14}" text-anchor="middle">${SES[i].label.split(" ")[1][0]}</text>`;
      if (i % 2 === 0) g += `<text class="tw-blab" x="${bx(i) + bw / 2 + slot / 2}" y="${H - padB + 28}" text-anchor="middle" style="font-weight:750">${SES[i].label.split(" ")[0]}</text>`;
      g += `<rect class="tw-bar-hit" data-i="${i}" x="${padL + slot * i}" y="${padT}" width="${slot}" height="${H - padT - padB}"/>`;
    });
    g += `<line class="tw-thr" x1="${padL}" y1="${y(3)}" x2="${W - padR}" y2="${y(3)}"/>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%" role="img" aria-label="Bar chart of members present in each of the ${nSes} sessions held so far">${g}</svg>`;
  });

  if (attHost && !attHost._tipWired) {
    attHost._tipWired = true;
    attHost.addEventListener("mousemove", e => {
      const hit = e.target.closest(".tw-bar-hit"); if (!hit || !attGeo) return;
      const i = +hit.dataset.i, v = perSession[i];
      const away = TW.members.filter(m => !G[m.initials][i]).map(m => m.name.split(" ").slice(-1)[0]);
      tipAt(attTip, attHost, attGeo.bx(i) + attGeo.bw / 2, attGeo.y(v),
        `<b>${SES[i].label}</b><span class="big">${v} of ${maxM}</span> present<br>` +
        (away.length ? "Away: " + away.join(", ") : "Everyone attended") +
        (v < 3 ? "<br>Below the minimum" : ""));
    });
    attHost.addEventListener("mouseleave", () => attTip.classList.remove("on"));
  }

  document.getElementById("att-pill").textContent =
    met === nSes ? "Every session compliant" : (nSes - met) + " session" + (nSes - met > 1 ? "s" : "") + " short";

  const attHead = `<thead><tr><th class="who">Member</th>${
    SES.map(s => `<th title="${s.label}">${s.label.split(" ")[0].replace("W", "")}<br>${s.label.split(" ")[1][0]}</th>`).join("")
  }<th>Total</th></tr></thead>`;
  const attBody = `<tbody>${TW.members.map(m => {
    const row = G[m.initials], surname = m.name.split(" ").slice(-1)[0];
    return `<tr><td class="who" title="${esc(m.name)} · ${esc(m.role)}">${esc(surname)}</td>${
      row.map((v, i) => `<td><i class="mark ${v ? "yes" : "no"}" title="${SES[i].label}: ${v ? "present" : "absent"}"></i></td>`).join("")
    }<td><strong>${row.reduce((a, b) => a + b, 0)}/${nSes}</strong></td></tr>`;
  }).join("")}</tbody>`;
  document.getElementById("att-table").innerHTML = attHead + attBody;
  document.getElementById("att-foot-n").textContent =
    `${nSes} sessions so far · ${avgPresent.toFixed(1)} members present on average`;

  /* Submissions */
  const openSub = TW.submissions.find(s => s.status === "open") || TW.submissions[0];
  const due = new Date(openSub.due);
  const days = Math.max(0, Math.ceil((due - new Date("2027-08-12T09:00:00+08:00")) / 86400000));
  document.getElementById("due-bar").innerHTML =
    `<span><strong>Week ${openSub.week} · ${openSub.module}</strong> — due ${helpers.fmtDate(openSub.due)}, 12:00 NN</span>
     <span class="badge gold">${days} day${days === 1 ? "" : "s"} left</span>`;

  document.getElementById("past-rows").innerHTML = TW.submissions
    .filter(s => s.status !== "open")
    .map(s => `<tr>
      <td>Week ${s.week}</td>
      <td>${s.module}</td>
      <td>${s.files.map(f => `<div class="small">${esc(f.name)} <span class="muted">· ${f.size}</span></div>`).join("")}</td>
      <td>${helpers.fmtDate(s.files[0].at)} ${helpers.fmtTime(s.files[0].at)}
          ${s.files.some(f => f.late) ? '<span class="badge amber">Late</span>' : '<span class="badge green">On time</span>'}</td>
      <td><span class="${heat(s.score)}">${fx2(s.score)}</span></td>
    </tr>`).join("");

  // Submissions upload zone wiring
  const picked = { video: null, slides: null };
  const subBtn = document.getElementById("btn-submit");
  const KB = 1024, sizeOf = b => b > KB * KB * KB ? (b / (KB * KB * KB)).toFixed(1) + " GB"
                                : b > KB * KB     ? (b / (KB * KB)).toFixed(1) + " MB"
                                                  : Math.max(1, Math.round(b / KB)) + " KB";
  const LABEL = {
    video:  { h: "Five-minute video", hint: "MP4 or MOV, up to 500 MB. Drag it here or click to choose.",
              ico: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 11 6-3v8l-6-3z"/>' },
    slides: { h: "Slide deck", hint: "PDF or PPTX, up to 50 MB. Drag it here or click to choose.",
              ico: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 17v3M8 20h8"/>' },
  };

  function renderDrop(kind) {
    const zone = document.getElementById("drop-" + kind), f = picked[kind], L = LABEL[kind];
    if (!zone) return;
    const input = zone.querySelector("input");
    if (!f) {
      zone.classList.remove("filled");
      zone.innerHTML = `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${L.ico}</svg>
        <h4>${L.h}</h4><p class="hint">${L.hint}</p>`;
      if (input) { zone.prepend(input); input.value = ""; }
    } else {
      zone.classList.add("filled");
      zone.innerHTML = `<div class="filerow">
          <span class="fi"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="m5 13 4 4L19 7"/></svg></span>
          <span><span class="nm">${esc(f.name)}</span><span class="mt">${sizeOf(f.size)} · ready to submit</span></span>
          <button class="rm" type="button" aria-label="Remove ${esc(f.name)}">×</button>
        </div><div class="bar"><i></i></div>`;
      if (input) zone.prepend(input);
      requestAnimationFrame(() => { const barI = zone.querySelector(".bar i"); if (barI) barI.style.width = "100%"; });
      const rmBtn = zone.querySelector(".rm");
      if (rmBtn) {
        rmBtn.addEventListener("click", e => {
          e.preventDefault(); e.stopPropagation(); picked[kind] = null; renderDrop(kind); syncSubBtn();
        });
      }
    }
    syncSubBtn();
  }
  function syncSubBtn() {
    if (!subBtn) return;
    subBtn.disabled = !(picked.video && picked.slides);
  }

  if (subBtn && !subBtn._wired) {
    subBtn._wired = true;
    ["video", "slides"].forEach(kind => {
      const zone = document.getElementById("drop-" + kind);
      if (!zone) return;
      zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("over"); });
      zone.addEventListener("dragleave", () => zone.classList.remove("over"));
      zone.addEventListener("drop", e => {
        e.preventDefault(); zone.classList.remove("over");
        if (e.dataTransfer.files[0]) { picked[kind] = e.dataTransfer.files[0]; renderDrop(kind); }
      });
      zone.addEventListener("change", e => {
        if (e.target.files && e.target.files[0]) { picked[kind] = e.target.files[0]; renderDrop(kind); }
      });
    });

    subBtn.addEventListener("click", () => {
      subBtn.disabled = true;
      subBtn.textContent = "Submitted — the panel can see it now";
      document.getElementById("due-bar").innerHTML =
        `<span><strong>Week ${openSub.week} · ${openSub.module}</strong> — submitted, nothing further to do.</span>
         <span class="badge green">On time</span>`;
    });
  }

  // Trigger intersection observer for newly rendered reveals
  document.querySelectorAll(".reveal:not(.in)").forEach(el => io.observe(el));
};

/* Listen for global auth or team change */
document.addEventListener("stephub_auth_changed", () => {
  if (typeof window.__renderMyTeam === "function") window.__renderMyTeam();
});

/* Initial render */
window.__renderMyTeam();


})();
/* ---- capstone.html ---- */
(function(){
let { capstone: CAP, teams } = window.MOCK;
let TEAM = teams.find(t => t.id === CAP.team_id) || teams[0];
let FORM = CAP.form, DECK = CAP.deck;
const words = s => (s || "").trim() ? s.trim().split(/\s+/).length : 0;
const plural = (n, one, many) => n + " " + (n === 1 ? one : (many || one + "s"));
const STATUS = {
  reviewed:  ["Approved",        "st-reviewed"],
  submitted: ["Submitted",       "st-submitted"],
  draft:     ["Draft",           "st-draft"],
  revise:    ["Needs revision",  "st-revise"],
  open:      ["Due this week",   "st-open"],
  locked:    ["Unlocks later",   "st-locked"],
};

/* ---------------------------------------------------------------
   Structured items carry `value`; prose items carry `draft`.
   One test for "has this been filled in", used by the counters,
   the readiness check and the form preview alike.
   --------------------------------------------------------------- */
/* shared helpers — declared once, before anything uses them */
const esc = t => String(t == null ? "" : t)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const F = n => FORM.find(x => x.n === n);
const fmtDay = d => d ? new Date(d + "T00:00:00+08:00").toLocaleDateString("en-PH",
  { timeZone: "Asia/Manila", day: "numeric", month: "long", year: "numeric" }) : "";
const money = n => Number(n) ? "₱" + Number(n).toLocaleString("en-PH") : "";
const rowTotal = r => (+r.ps || 0) + (+r.mooe || 0) + (+r.eo || 0);
const AREAS = [
  { k: "agri",     label: "Agriculture, Aquatic and Natural Resources", extra: "commodity",      extraLabel: "Commodity" },
  { k: "health",   label: "Health",                                     extra: "priorityTopic",  extraLabel: "Priority Topic" },
  { k: "industry", label: "Industry, Energy and Emerging Technology",   extra: "sectorIndustry", extraLabel: "Sector" },
  { k: "drr",      label: "Disaster Risk Reduction and Climate Change Adaptation" },
  { k: "basic",    label: "Basic Research",                             extra: "sectorBasic",    extraLabel: "Sector" },
];
function hasContent(f) {
  const v = f.value;
  switch (f.kind) {
    case "profile":     return Object.values(v).some(x => String(x).trim());
    case "sites":       return v.some(r => Object.values(r).some(x => String(x).trim()));
    case "choice":      return !!v.precommercialization;
    case "agenda":      return !!v.area || !!String(v.sdg).trim();
    case "personnel":   return v.some(r => String(r.position).trim());
    case "budget":      return v.rows.some(r => rowTotal(r) > 0);
    case "projects":    return v.rows.some(r => String(r.title).trim());
    case "attachments": return f.attachments.some(a => a.have === true);
    default:            return !!(f.draft || "").trim();
  }
}

/* ---------- header figures ---------- */
function refreshCounts() {
  const started = FORM.filter(hasContent).length;
  const approved = FORM.filter(f => f.status === "reviewed").length;
  const slidesIn = DECK.filter(d => d.status === "in").length;
  const nextSlide = DECK.find(d => d.status !== "in");

  document.getElementById("ca-form").innerHTML = started + '<small>of 24 items</small>';
  document.getElementById("ca-form-sub").textContent =
    approved + " approved · " + FORM.filter(f => f.status === "revise").length + " to revise · " +
    FORM.filter(f => f.status === "locked").length + " still to come";
  document.getElementById("ca-deck").innerHTML = slidesIn + '<small>of 14 slides</small>';
  document.getElementById("ca-deck-sub").textContent = nextSlide ? "Next up: " + nextSlide.title : "Deck complete";

  document.getElementById("ca-chips").innerHTML = [
    TEAM.name, "Week " + CAP.week_no + " of " + CAP.weeks_total,
    "Demo Day " + new Date(CAP.demo_day).toLocaleDateString("en-PH", { timeZone: "Asia/Manila", month: "long", day: "numeric" }),
  ].map(c => `<span class="chip">${c}</span>`).join("");

  requestAnimationFrame(() => {
    document.getElementById("ca-form-bar").style.width = (started / FORM.length * 100) + "%";
    document.getElementById("ca-deck-bar").style.width = (slidesIn / DECK.length * 100) + "%";
  });
}
refreshCounts();

/* =====================================================================
   The two capstone workspaces are two views of this page, reached from
   the Capstone tab's menu or from the pill bar in the hero — they never
   share the screen.
   ===================================================================== */
const CAPVIEWS = ["form", "deck"];
const CAPLABEL = { form: "FASTRAC proposal", deck: "Pitch deck" };
const CAPNOTE  = {
  form: "DOST Form 2, filled in item by item across the cycle.",
  deck: "One slide per topic, assembled week by week.",
};
function readCapHash() {
  const raw = (location.hash || "").replace(/^#/, "");
  if (raw === "capstone-deck" || raw === "deck") return "deck";
  return "form";
}
/* mode: "init" on first paint (never touch the URL — in the merged site the
   hash belongs to the router), "push" when the reader chose a view. */
function showTab(which, mode) {
  const v = CAPVIEWS.includes(which) ? which : "form";
  const isForm = v === "form";
  document.getElementById("ws-form").hidden = !isForm;
  document.getElementById("ws-deck").hidden = isForm;
  if (!isForm && sheetOpen) closeSheet();
  document.querySelectorAll("#cap-bar .vb").forEach(b =>
    b.setAttribute("aria-selected", b.dataset.v === v ? "true" : "false"));
  document.querySelectorAll(".navdd .ddm a[href*='capstone']").forEach(a =>
    a.setAttribute("aria-current", String((a.getAttribute("href") || "").endsWith(
      isForm ? "#capstone" : "#capstone-deck"))));
  // the panel was hidden, so its reveal observer never fired — show it at once
  document.getElementById(isForm ? "ws-form" : "ws-deck")
          .querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
  if (mode === "init") return;
  const want = "#capstone" + (isForm ? "" : "-deck");
  if (location.hash !== want) {
    if (mode === "push") location.hash = want; else history.replaceState(null, "", want);
  }
}
document.getElementById("cap-bar").innerHTML = CAPVIEWS.map(v =>
  `<button role="tab" class="vb" data-v="${v}" aria-selected="false">${CAPLABEL[v]}</button>`).join("");
document.getElementById("cap-bar").addEventListener("click", e => {
  const b = e.target.closest(".vb"); if (!b) return;
  showTab(b.dataset.v, "push");
  document.getElementById("workspaces").scrollIntoView({ behavior: "smooth", block: "start" });
});
/* the Capstone tab menu drops a new hash in — follow it, but leave hashes
   that belong to another route alone */
window.addEventListener("hashchange", () => {
  const raw = (location.hash || "").replace(/^#/, "");
  if (raw && !/^capstone(-|$)/.test(raw) && !CAPVIEWS.includes(raw)) return;
  const v = readCapHash();
  if (document.getElementById("ws-" + v).hidden) showTab(v, "init");
});
showTab(readCapHash(), "init");

/* ---------- the 24-block bar ---------- */
function renderItemBar() {
  const bar = document.getElementById("itembar");
  if (!bar) return;
  bar.innerHTML = FORM.map(f =>
    `<button class="${STATUS[f.status][1]}" data-n="${f.n}" title="Item ${f.n} · ${f.title} — ${STATUS[f.status][0]}"
             aria-label="Item ${f.n}, ${f.title}, ${STATUS[f.status][0]}">${f.n}</button>`).join("");
}

/* ---------- the item list ---------- */
function renderItemList() {
  const list = document.getElementById("itemlist");
  if (!list) return;
  let html = "", grp = null;
  FORM.forEach(f => {
    if (f.group !== grp) { grp = f.group; html += `<div class="grp">${grp}</div>`; }
    html += `<button data-n="${f.n}" role="listitem" class="${f.status === "locked" ? "is-locked" : ""}">
      <span class="num ${STATUS[f.status][1]}">${f.n}</span>
      <span>
        <span class="ti">${f.title}</span>
        <span class="wk">${f.status === "locked" ? "Unlocks Week " + f.week : STATUS[f.status][0] + " · Week " + f.week}</span>
      </span>
    </button>`;
  });
  list.innerHTML = html;
}

/* ---------- the editor ---------- */
/* Structured items get the form's own fields; prose items get a writing box.
   Every control writes straight back into FORM, then redraws the paper. */
const inp = (val, ph, cls) =>
  `<input class="fin ${cls || ""}" type="text" value="${esc(val || "")}" placeholder="${esc(ph || "")}">`;

const FIELDS = {
  profile(f) {
    const v = f.value;
    const row = (k, label, fine, ph, extra) =>
      `<div class="ff"><label for="p-${k}">${label}${fine ? `<span class="fine">${fine}</span>` : ""}</label>
        <div>${extra || `<input class="fin" id="p-${k}" data-k="${k}" type="text" value="${esc(v[k] || "")}" placeholder="${esc(ph || "")}">`}</div></div>`;
    return row("program", "Program Title") + row("title", "Project Title") +
      `<div class="ff"><label>Project Leader / Sex</label><div class="frow2">
        <input class="fin" data-k="leader" type="text" value="${esc(v.leader)}" placeholder="Name">
        <input class="fin short" data-k="sex" type="text" value="${esc(v.sex)}" placeholder="M / F"></div></div>` +
      `<div class="ff"><label>Project Duration</label><div class="frow2">
        <input class="fin short" data-k="months" type="number" min="1" value="${esc(v.months)}" placeholder="months">
        <span class="fgrid-note">number of months</span></div></div>` +
      `<div class="ff"><label>Project Start Date</label><div><input class="fin short" data-k="start" type="date" value="${esc(v.start)}"></div></div>` +
      `<div class="ff"><label>Project End Date</label><div><input class="fin short" data-k="end" type="date" value="${esc(v.end)}"></div></div>` +
      row("agency", "Implementing Agency", "University-College-Institute, Department/Organization or Company") +
      row("address", "Address / Telephone / Fax / Email", "Barangay, Municipality, District, Province, Region");
  },

  sites(f) {
    const cols = [["country", "Country"], ["region", "Region"], ["province", "Province"],
                  ["district", "District"], ["municipality", "Municipality"], ["barangay", "Barangay"]];
    return `<p class="fhint">Up to five sites, exactly as the form asks for them.</p>
      <div class="fgrid-wrap"><table class="fgrid">
        <thead><tr><th class="n">No.</th>${cols.map(c => `<th>${c[1]}</th>`).join("")}</tr></thead>
        <tbody>${f.value.map((r, i) => `<tr><td class="n">${i + 1}</td>${cols.map(c =>
          `<td><input class="fin" data-row="${i}" data-k="${c[0]}" type="text" value="${esc(r[c[0]])}"></td>`).join("")}</tr>`).join("")}
        </tbody></table></div>`;
  },

  choice(f) {
    return `<div class="fchecks"><label>
      <input type="checkbox" data-k="precommercialization" ${f.value.precommercialization ? "checked" : ""}>
      <span>Pre-commercialization</span></label></div>
      <p class="fhint">The only type of research DOST Form 2 offers for startups.</p>`;
  },

  agenda(f) {
    const v = f.value;
    return `<p class="fhint">Tick one agenda, then name the commodity or sector under it.</p>
      <div class="fchecks">${AREAS.map(a => `
        <label><input type="radio" name="hnrda" data-area="${a.k}" ${v.area === a.k ? "checked" : ""}>
          <span>${a.label}</span></label>
        ${a.extra ? `<div class="sub"><span>${a.extraLabel}:</span>
          <input class="fin" data-k="${a.extra}" type="text" value="${esc(v[a.extra])}" ${v.area === a.k ? "" : "disabled"}></div>` : ""}`).join("")}
      </div>
      <div class="ff"><label>Sustainable Development Goal(s) addressed</label>
        <div><input class="fin" data-k="sdg" type="text" value="${esc(v.sdg)}" placeholder="e.g. SDG 2 (Zero Hunger)"></div></div>`;
  },

  personnel(f) {
    return `<p class="fhint">One row per position. Percent time is what the form asks for, not hours.</p>
      <div class="fgrid-wrap"><table class="fgrid">
        <thead><tr><th class="n">#</th><th style="width:38%">Position</th><th style="width:18%">Percent time</th><th>Responsibilities</th></tr></thead>
        <tbody>${f.value.map((r, i) => `<tr><td class="n">${i + 1}</td>
          <td><input class="fin" data-row="${i}" data-k="position" type="text" value="${esc(r.position)}"></td>
          <td><input class="fin" data-row="${i}" data-k="pct" type="number" min="0" max="100" value="${esc(r.pct)}"></td>
          <td><input class="fin" data-row="${i}" data-k="resp" type="text" value="${esc(r.resp)}"></td></tr>`).join("")}
        </tbody></table></div>
      <button class="btn secondary" data-add="personnel" type="button">Add a position</button>`;
  },

  budget(f) {
    const rows = f.value.rows;
    const col = k => rows.reduce((a, r) => a + (+r[k] || 0), 0);
    const grand = rows.reduce((a, r) => a + rowTotal(r), 0);
    return `<p class="fhint">Type the peso amounts; the Total column and the TOTAL row add themselves up.</p>
      <div class="fgrid-wrap"><table class="fgrid" id="budget-grid">
        <thead><tr><th style="width:26%">Implementing agency</th><th>PS</th><th>MOOE</th><th>EO</th><th style="width:18%">Total</th></tr></thead>
        <tbody>
          ${rows.map((r, i) => `<tr>
            <td><input class="fin" data-row="${i}" data-k="label" type="text" value="${esc(r.label)}"></td>
            ${["ps", "mooe", "eo"].map(k => `<td class="money"><input class="fin peso" data-row="${i}" data-k="${k}"
                 type="text" inputmode="numeric" value="${r[k] ? Number(r[k]).toLocaleString("en-PH") : ""}"
                 placeholder="0" aria-label="${k.toUpperCase()} for ${esc(r.label)}"></td>`).join("")}
            <td class="calc" data-total="${i}">${money(rowTotal(r))}</td></tr>`).join("")}
          <tr class="total"><td>TOTAL</td><td data-sum="ps">${money(col("ps"))}</td>
            <td data-sum="mooe">${money(col("mooe"))}</td><td data-sum="eo">${money(col("eo"))}</td>
            <td data-sum="grand">${money(grand)}</td></tr>
        </tbody></table></div>
      <div class="ff"><label>Counterpart and other fund sources</label>
        <div><input class="fin" data-k="counterpart" type="text" value="${esc(f.value.counterpart)}"
             placeholder="e.g. Counterpart (UPLB, in kind): laboratory access and 15% of total"></div></div>
      <button class="btn secondary" data-add="budget" type="button">Add a year</button>`;
  },

  projects(f) {
    return `<div class="ff"><label>Number of ongoing projects</label>
        <div><input class="fin short" data-count="1" type="number" min="0" value="${esc(f.value.count)}"></div></div>
      <div class="fgrid-wrap"><table class="fgrid">
        <thead><tr><th class="n">#</th><th style="width:46%">Title of the project</th><th>Funding agency</th><th>Involvement</th></tr></thead>
        <tbody>${f.value.rows.map((r, i) => `<tr><td class="n">${i + 1}</td>
          <td><input class="fin" data-row="${i}" data-k="title" type="text" value="${esc(r.title)}"></td>
          <td><input class="fin" data-row="${i}" data-k="agency" type="text" value="${esc(r.agency)}"></td>
          <td><input class="fin" data-row="${i}" data-k="role" type="text" value="${esc(r.role)}"></td></tr>`).join("")}
        </tbody></table></div>
      <button class="btn secondary" data-add="projects" type="button">Add a project</button>`;
  },

  attachments(f) {
    return `<p class="fhint">Tick each document once you have a copy on file.</p>
      <div class="fchecks">${f.attachments.map((a, i) => a.have === null
        ? `<div class="na">— ${esc(a.label)} · not applicable to this project</div>`
        : `<label><input type="checkbox" data-att="${i}" ${a.have ? "checked" : ""}><span>${esc(a.label)}</span></label>`).join("")}
      </div>`;
  },
};

/* keep the budget's computed cells right without redrawing the inputs */
function recalcBudget(f) {
  const g = document.getElementById("budget-grid"); if (!g) return;
  const rows = f.value.rows;
  rows.forEach((r, i) => {
    const c = g.querySelector(`[data-total="${i}"]`); if (c) c.textContent = money(rowTotal(r));
  });
  ["ps", "mooe", "eo"].forEach(k => {
    const c = g.querySelector(`[data-sum="${k}"]`);
    if (c) c.textContent = money(rows.reduce((a, r) => a + (+r[k] || 0), 0));
  });
  const gr = g.querySelector('[data-sum="grand"]');
  if (gr) gr.textContent = money(rows.reduce((a, r) => a + rowTotal(r), 0));
}

let current = null;
function openItem(n) {
  current = n;
  const f = FORM.find(x => x.n === n);
  const ed = document.getElementById("editor");
  const locked = f.status === "locked";
  const isProse = f.kind === "prose";

  let body;
  if (locked) {
    body = `<div class="locknote">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex:none" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
      <span>This item opens in <strong>Week ${f.week}</strong>, after ${f.source}. You are not behind —
      nothing is expected here yet.</span></div>`;
  } else if (isProse) {
    const wc = words(f.draft);
    body = `
      ${f.note ? `<div class="revise-note"><strong>Needs revision.</strong> ${f.note}</div>` : ""}
      <textarea id="ta" aria-label="Your answer for item ${f.n}"
        placeholder="Nothing written yet. Start from what you produced in ${f.source}.">${f.draft || ""}</textarea>
      <div class="ebar">
        <span class="wc ${f.limit && wc > f.limit ? "over" : ""}" id="wc">${wc} words${f.limit ? " of " + f.limit + " allowed" : ""}</span>
        <span class="row" style="gap:var(--s3)">
          <span class="saved" id="saved">Saved</span>
          <button class="btn secondary" id="btn-save">Save draft</button>
        </span>
      </div>`;
  } else {
    body = `${f.note ? `<div class="revise-note"><strong>Needs revision.</strong> ${f.note}</div>` : ""}
      <div id="fieldset">${FIELDS[f.kind](f)}</div>
      <div class="ebar"><span class="wc">Filled in as fields — the form on the right updates as you go</span>
        <span class="saved on" id="saved">Saved</span></div>`;
  }

  ed.innerHTML = `
    <div class="ehead">
      <h3>Item ${f.n} · ${f.title}</h3>
      <span class="badge ${f.status === "reviewed" ? "green" : f.status === "revise" ? "amber" : f.status === "open" ? "gold" : ""}">${STATUS[f.status][0]}</span>
    </div>
    <div class="from mt-3">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      Comes from ${f.source}${f.revisit ? " · revisited in Week " + f.revisit : ""}
    </div>
    <div class="guide"><b>What DOST asks for</b>${f.guide}</div>
    ${f.parts ? `<h4 class="mt-4 mb-0">Sub-items (${f.parts.filter(p => p.done).length} of ${f.parts.length} done)</h4>
      <div class="fchecks" id="parts">${f.parts.map((p, i) => `<label>
        <input type="checkbox" data-part="${i}" ${p.done ? "checked" : ""}>
        <span>(${p.k}) ${esc(p.label)} <span class="fgrid-note">· Week ${p.week}</span></span></label>`).join("")}</div>` : ""}
    ${body}`;

  document.querySelectorAll("#itembar button, #itemlist button").forEach(b =>
    b.setAttribute("aria-current", String(+b.dataset.n === n)));

  if (!locked && isProse) {
    const ta = document.getElementById("ta"), wcEl = document.getElementById("wc"), saved = document.getElementById("saved");
    let t;
    ta.addEventListener("input", () => {
      const w = words(ta.value);
      wcEl.textContent = w + " words" + (f.limit ? " of " + f.limit + " allowed" : "");
      wcEl.classList.toggle("over", !!f.limit && w > f.limit);
      f.draft = ta.value;                                  // kept in memory for this session only
      syncSheet(f.n, false);
      clearTimeout(t); saved.classList.remove("on");
      t = setTimeout(() => { saved.classList.add("on"); refreshCounts(); buildReady(); }, 700);
    });
    document.getElementById("btn-save").addEventListener("click", () => saved.classList.add("on"));
  }

  /* structured fields write straight into f.value */
  const fs = document.getElementById("fieldset");
  if (fs) {
    const touch = () => { syncSheet(f.n, false); refreshCounts(); buildReady(); };
    fs.addEventListener("input", e => {
      const el = e.target; if (!el.matches("input")) return;
      const row = el.dataset.row, k = el.dataset.k;
      if (el.dataset.count) f.value.count = el.value;
      else if (row != null) {
        const target = f.kind === "budget" ? f.value.rows[+row]
                     : f.kind === "projects" ? f.value.rows[+row] : f.value[+row];
        target[k] = el.classList.contains("peso") ? Number(String(el.value).replace(/[^0-9]/g, "")) || 0
                  : (el.type === "number") ? (el.value === "" ? 0 : Number(el.value))
                  : el.value;
        if (f.kind === "budget") recalcBudget(f);
      } else if (k) {
        f.value[k] = el.value;
      }
      touch();
    });
    fs.addEventListener("blur", e => {
      const el = e.target;
      if (el.classList && el.classList.contains("peso")) {
        const n = Number(String(el.value).replace(/[^0-9]/g, "")) || 0;
        el.value = n ? n.toLocaleString("en-PH") : "";
      }
    }, true);
    fs.addEventListener("change", e => {
      const el = e.target;
      if (el.dataset.area) {                                 // one agenda at a time
        f.value.area = el.dataset.area;
        fs.querySelectorAll("[data-k]").forEach(x => {
          const owner = AREAS.find(a => a.extra === x.dataset.k);
          if (owner) x.disabled = owner.k !== f.value.area;
        });
      } else if (el.dataset.k && el.type === "checkbox") f.value[el.dataset.k] = el.checked;
      else if (el.dataset.att) f.attachments[+el.dataset.att].have = el.checked;
      else return;
      touch();
    });
    fs.addEventListener("click", e => {
      const add = e.target.closest("[data-add]"); if (!add) return;
      if (f.kind === "personnel") f.value.push({ position: "", pct: "", resp: "" });
      if (f.kind === "budget")    f.value.rows.push({ label: "Year " + (f.value.rows.length + 1), ps: 0, mooe: 0, eo: 0 });
      if (f.kind === "projects")  f.value.rows.push({ title: "", agency: "", role: "" });
      openItem(n);
    });
  }

  /* the (a)–(k) checklist on item 9 */
  const parts = document.getElementById("parts");
  if (parts) parts.addEventListener("change", e => {
    const i = e.target.dataset.part; if (i == null) return;
    f.parts[+i].done = e.target.checked;
    syncSheet(f.n, false); buildReady();
    ed.querySelector("h4").textContent =
      `Sub-items (${f.parts.filter(p => p.done).length} of ${f.parts.length} done)`;
  });

  buildReady();
  syncSheet(n, true);                 // follow the team to the item they just opened
}
document.getElementById("itembar").addEventListener("click", e => {
  const b = e.target.closest("button"); if (b) openItem(+b.dataset.n);
});
document.getElementById("itemlist").addEventListener("click", e => {
  const b = e.target.closest("button"); if (b) openItem(+b.dataset.n);
});

/* ---------- readiness check ---------- */
function buildReady() {
  const empty = FORM.filter(f => !hasContent(f) && f.status !== "locked");
  const locked = FORM.filter(f => f.status === "locked");
  const revise = FORM.filter(f => f.status === "revise");
  const over = FORM.filter(f => f.limit && words(f.draft) > f.limit);
  const it9 = FORM.find(f => f.n === 9), it24 = FORM.find(f => f.n === 24);
  const parts9 = it9.parts.filter(p => !p.done);
  const docs = it24.attachments.filter(a => a.have === false);

  const lockWeeks = [...new Set(locked.map(f => f.week))].sort((a, b) => a - b);
  const rows = [
    over.length
      ? { s: "bad",  t: "Over the word limit: " + over.map(f => "item " + f.n).join(", ") }
      : { s: "ok",   t: "Every answer is inside its word limit" },
    revise.length
      ? { s: "warn", t: plural(revise.length, "item") + (revise.length === 1 ? " needs" : " need") + " revision — item " + revise.map(f => f.n).join(", ") }
      : { s: "ok",   t: "Nothing waiting on a revision" },
    empty.length
      ? { s: "warn", t: plural(empty.length, "open item") + " not yet written — item " + empty.map(f => f.n).join(", ") }
      : { s: "ok",   t: "Every unlocked item has a draft" },
    parts9.length
      ? { s: "warn", t: "Item 9 is missing " + plural(parts9.length, "sub-item") + ": " + parts9.map(p => "(" + p.k + ")").join(" ") }
      : { s: "ok",   t: "Item 9 covers all eleven sub-items" },
    docs.length
      ? { s: "warn", t: plural(docs.length, "supporting document") + " still to collect" }
      : { s: "ok",   t: "All supporting documents collected" },
    locked.length
      ? { s: "warn", t: plural(locked.length, "item") + (locked.length === 1 ? " opens" : " open") + " in a later week — " +
                        (lockWeeks.length > 1 ? "Weeks " : "Week ") + lockWeeks.join(" and ") }
      : { s: "ok",   t: "Every item of the form is open" },
  ];
  document.getElementById("ready").innerHTML = rows.map(r =>
    `<li class="${r.s}"><span class="ic">${r.s === "ok" ? "✓" : r.s === "warn" ? "!" : "×"}</span><span>${r.t}</span></li>`).join("");

  const bad = rows.filter(r => r.s !== "ok").length;
  const badge = document.getElementById("rd-badge");
  badge.textContent = bad ? bad + " thing" + (bad > 1 ? "s" : "") + " to settle" : "Ready to submit";
  badge.className = "badge " + (bad > 2 ? "amber" : bad ? "gold" : "green");
}

/* ---------- pitch deck ---------- */
const SLIDE_BODY = {
  title:     '<rect x="120" y="150" width="240" height="14" rx="7" fill="#cfe0f1"/>',
  statement: '<rect x="56" y="104" width="368" height="13" rx="6" fill="#e3e9ef"/><rect x="56" y="128" width="300" height="13" rx="6" fill="#e3e9ef"/><rect x="56" y="152" width="200" height="13" rx="6" fill="#cfe0f1"/>',
  bullets:   '<circle cx="62" cy="110" r="5" fill="#1f6fb2"/><rect x="78" y="104" width="300" height="11" rx="5" fill="#e3e9ef"/><circle cx="62" cy="140" r="5" fill="#1f6fb2"/><rect x="78" y="134" width="250" height="11" rx="5" fill="#e3e9ef"/><circle cx="62" cy="170" r="5" fill="#1f6fb2"/><rect x="78" y="164" width="280" height="11" rx="5" fill="#e3e9ef"/>',
  chart:     '<rect x="60" y="150" width="46" height="46" rx="4" fill="#cfe0f1"/><rect x="118" y="124" width="46" height="72" rx="4" fill="#9dc4e6"/><rect x="176" y="98" width="46" height="98" rx="4" fill="#1f6fb2"/><rect x="250" y="104" width="170" height="11" rx="5" fill="#e3e9ef"/><rect x="250" y="128" width="130" height="11" rx="5" fill="#e3e9ef"/>',
  table:     '<rect x="56" y="96" width="368" height="24" rx="4" fill="#0b3c6b"/><rect x="56" y="126" width="368" height="22" rx="4" fill="#eef3f8"/><rect x="56" y="154" width="368" height="22" rx="4" fill="#f6f8fa"/><rect x="56" y="182" width="368" height="22" rx="4" fill="#eef3f8"/>',
  grid:      '<rect x="56" y="96" width="176" height="52" rx="6" fill="#eef3f8"/><rect x="248" y="96" width="176" height="52" rx="6" fill="#eef3f8"/><rect x="56" y="158" width="176" height="52" rx="6" fill="#eef3f8"/><rect x="248" y="158" width="176" height="52" rx="6" fill="#fbf3e2"/>',
  timeline:  '<rect x="56" y="150" width="368" height="4" rx="2" fill="#e3e9ef"/><circle cx="90" cy="152" r="10" fill="#1f6fb2"/><circle cx="200" cy="152" r="10" fill="#9dc4e6"/><circle cx="310" cy="152" r="10" fill="#cfe0f1"/><circle cx="410" cy="152" r="10" fill="#c99a2e"/>',
};
function slideSVG(d, big) {
  const t = String(d.title).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const s = String(d.sub).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const isTitle = d.kind === "title";
  return `<svg viewBox="0 0 480 270" role="img" aria-label="Slide ${d.n}: ${t}">
    <rect width="480" height="270" fill="#ffffff"/>
    <rect x="0" y="0" width="480" height="8" fill="#0b3c6b"/>
    <text x="${isTitle ? 240 : 56}" y="${isTitle ? 120 : 68}" text-anchor="${isTitle ? "middle" : "start"}"
      font-family="Inter, Segoe UI, system-ui, sans-serif" font-size="${isTitle ? 34 : 22}" font-weight="800" fill="#0b3c6b">${t}</text>
    <text x="${isTitle ? 240 : 56}" y="${isTitle ? 148 : 90}" text-anchor="${isTitle ? "middle" : "start"}"
      font-family="Inter, Segoe UI, system-ui, sans-serif" font-size="14" font-weight="600" fill="#5a6470">${s}</text>
    ${SLIDE_BODY[d.kind] || ""}
    <text x="440" y="252" text-anchor="end" font-family="Inter, Segoe UI, system-ui, sans-serif" font-size="12" fill="#97a3ae">${d.n}</text>
  </svg>`;
}
const heatOf = s => "heat heat-" + (s >= 3.5 ? 4 : s >= 3.0 ? 3 : s >= 2.5 ? 2 : 1);

/* ---------- the deck storyboard, every frame a drop target ---------- */
const OK_TYPES = /\.(pdf|pptx?|png|jpe?g)$/i;
const sizeOf = b => b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB";

function frameInner(d) {
  const filled = d.status === "in";
  if (d.file) {
    return `<span class="up">${d.file.url
      ? `<img src="${d.file.url}" alt="Slide ${d.n}: ${esc(d.title)}">`
      : `<svg class="doc" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
           <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>
         <span class="fn">${esc(d.file.name)}</span><span class="sz">${esc(d.file.size)}</span>`}</span>`;
  }
  if (filled) return slideSVG(d);
  return `<svg viewBox="0 0 480 270" aria-hidden="true"><text x="240" y="132" text-anchor="middle"
      font-family="Inter, Segoe UI, system-ui, sans-serif" font-size="15" font-weight="650"
      fill="${d.status === "due" ? "#c99a2e" : "#9aa6b2"}">${d.status === "due" ? "Due this week" : "Week " + d.week}</text></svg>`;
}

function renderFilm() {
  document.getElementById("film").innerHTML = DECK.map(d => {
    const filled = d.status === "in", locked = d.status === "locked";
    const hint = locked ? "Opens in Week " + d.week : "Drop your slide here";
    /* A frame that already holds a file is a viewer: clicking it puts the
       slide on the stage. Only an empty frame is a drop target, and the
       file already in place is changed with its own Replace button. */
    /* A frame that already has a slide is a viewer: clicking it puts that
       slide on the stage. Only a frame still waiting for one is an upload
       target, and a slide already in place is changed with Replace. */
    return `<div class="frame ${filled ? "" : "empty"} ${d.file ? "uploaded" : ""} ${locked ? "locked" : ""}" data-i="${d.n - 1}">
      <span class="thumb">
        ${locked || filled ? "" : `<input type="file" accept=".pdf,.ppt,.pptx,.png,.jpg,.jpeg"
             aria-label="Upload slide ${d.n}: ${esc(d.title)}">`}
        ${frameInner(d)}
        ${filled ? `<span class="viewhint">View slide</span>`
                 : `<span class="drophint">${hint}${locked ? "" : "<br><span style=\"font-weight:500\">PDF, PPTX, PNG or JPG</span>"}</span>`}
      </span>
      ${d.file ? `<button class="rmslide" type="button" aria-label="Remove the file on slide ${d.n}">×</button>` : ""}
      ${filled ? `<input class="reinput" type="file" accept=".pdf,.ppt,.pptx,.png,.jpg,.jpeg" hidden
                         aria-label="Replace slide ${d.n}">` : ""}
      <span class="cap"><span class="no">${String(d.n).padStart(2, "0")}</span><span class="nm">${esc(d.title)}</span></span>
      <span class="fmeta">
        ${d.file ? `<span class="badge mine">Your file</span>`
                 : d.score ? `<span class="${heatOf(d.score)}">${d.score.toFixed(2)}</span>` : ""}
        ${filled ? `<button class="repl" type="button">Replace</button>`
                 : `<span class="src">${esc(d.source)}</span>`}
      </span>
    </div>`;
  }).join("");
  wireFrames();
}

/* a dropped file becomes that slide */
function takeFile(i, file) {
  const d = DECK[i];
  if (!file || d.status === "locked") return false;
  if (!OK_TYPES.test(file.name)) { alertLine("That file type is not accepted — use PDF, PPTX, PNG or JPG."); return false; }
  if (d.file && d.file.url) URL.revokeObjectURL(d.file.url);
  d.file = { name: file.name, size: sizeOf(file.size),
             url: /^image\//.test(file.type) ? URL.createObjectURL(file) : null };
  d.status = "in";
  renderFilm(); refreshCounts(); showSlide(i);
  return true;
}
function alertLine(msg) {
  const note = document.getElementById("deckdrop");
  const keep = note.innerHTML;
  note.innerHTML = `<strong>${msg}</strong>`;
  setTimeout(() => { note.innerHTML = keep; }, 2600);
}

function wireFrames() {
  document.querySelectorAll("#film .frame").forEach(fr => {
    const i = +fr.dataset.i;
    const inp = fr.querySelector("input[type=file]");
    if (inp) inp.addEventListener("change", e => { if (e.target.files[0]) takeFile(i, e.target.files[0]); });
    fr.addEventListener("dragover", e => { e.preventDefault(); if (DECK[i].status !== "locked") fr.classList.add("over"); });
    fr.addEventListener("dragleave", () => fr.classList.remove("over"));
    fr.addEventListener("drop", e => {
      e.preventDefault(); e.stopPropagation(); fr.classList.remove("over");
      takeFile(i, e.dataTransfer.files[0]);
    });
    const re = fr.querySelector(".reinput"), rb = fr.querySelector(".repl");
    if (rb && re) {
      rb.addEventListener("click", e => { e.preventDefault(); e.stopPropagation(); re.click(); });
      // the synthetic click on the hidden input would otherwise bubble to the strip
      re.addEventListener("click", e => e.stopPropagation());
      re.addEventListener("change", e => { if (e.target.files[0]) takeFile(i, e.target.files[0]); });
    }
    const rm = fr.querySelector(".rmslide");
    if (rm) rm.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      const d = DECK[i];
      if (d.file && d.file.url) URL.revokeObjectURL(d.file.url);
      d.file = null;
      d.status = d.n <= 11 ? "in" : (d.n === 12 ? "due" : "locked");   // back to how the week left it
      renderFilm(); refreshCounts(); showSlide(Math.min(i, DECK.length - 1));
    });
  });
}
renderFilm();

/* drop a handful of slides at once — they fill the next empty frames */
(function () {
  const zone = document.getElementById("deckdrop");
  zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("over"); });
  zone.addEventListener("dragleave", () => zone.classList.remove("over"));
  zone.addEventListener("drop", e => {
    e.preventDefault(); zone.classList.remove("over");
    const files = [...e.dataTransfer.files];
    let taken = 0, full = false;
    files.forEach(f => {
      // fill the next frame that has no file of its own and is open — never jump a filled one
      const slot = DECK.findIndex(d => !d.file && d.status !== "locked");
      if (slot === -1) { full = true; return; }
      if (takeFile(slot, f)) taken++;
    });
    if (full) alertLine("No open frames left — drop onto a slide to replace it.");
    else if (taken) alertLine(taken + (taken === 1 ? " slide" : " slides") + " added, in order.");
  });
})();

let slideAt = 0;
function showSlide(i) {
  const filledIdx = DECK.map((d, k) => d.status === "in" ? k : -1).filter(k => k >= 0);
  if (!filledIdx.length) return;
  slideAt = Math.max(0, Math.min(DECK.length - 1, i));
  if (DECK[slideAt].status !== "in") slideAt = filledIdx[filledIdx.length - 1];
  const d = DECK[slideAt];
  document.getElementById("stage-screen").innerHTML = d.file
    ? (d.file.url
        ? `<img src="${d.file.url}" alt="Slide ${d.n}: ${esc(d.title)}" style="width:100%;height:100%;object-fit:contain;background:#fff">`
        : `<div style="height:100%;display:grid;place-items:center;align-content:center;gap:8px;background:#fff;text-align:center;padding:20px">
             <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#2e7d5b" stroke-width="1.4" aria-hidden="true">
               <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>
             <div style="font-weight:700;color:#0b3c6b">${esc(d.file.name)}</div>
             <div style="font-size:13px;color:#5a6470">${esc(d.file.size)} · handed in, ready for the panel</div>
           </div>`)
    : slideSVG(d, true);
  document.getElementById("stage-who").innerHTML =
    `Slide ${d.n} · ${d.title}<small>${d.sub} — from ${d.source}${
      d.file ? " · your file: " + esc(d.file.name) : d.score ? " · panel scored this " + d.score.toFixed(2) : ""}</small>`;
  document.getElementById("slide-prev").disabled = slideAt <= filledIdx[0];
  document.getElementById("slide-next").disabled = slideAt >= filledIdx[filledIdx.length - 1];
  document.querySelectorAll("#film .frame").forEach(b =>
    b.setAttribute("aria-current", String(+b.dataset.i === slideAt)));
}
document.getElementById("film").addEventListener("click", e => {
  const b = e.target.closest(".frame"); if (!b) return;
  const i = +b.dataset.i, d = DECK[i];
  if (d.status === "in") { showSlide(i); return; }
  document.getElementById("stage-screen").innerHTML =
    `<svg viewBox="0 0 480 270" role="img" aria-label="Slide ${d.n} not made yet">
       <rect width="480" height="270" fill="#f6f8fa"/>
       <rect x="24" y="24" width="432" height="222" rx="10" fill="none" stroke="#cfd8e1" stroke-width="2" stroke-dasharray="8 7"/>
       <text x="240" y="128" text-anchor="middle" font-family="Inter, Segoe UI, system-ui, sans-serif"
         font-size="20" font-weight="700" fill="#0b3c6b">${d.title}</text>
       <text x="240" y="156" text-anchor="middle" font-family="Inter, Segoe UI, system-ui, sans-serif"
         font-size="13" fill="#5a6470">${d.status === "due" ? "Due this week" : "Opens in Week " + d.week}</text>
     </svg>`;
  document.getElementById("stage-who").innerHTML =
    `Slide ${d.n} · ${d.title}<small>Not made yet — comes from ${d.source} in Week ${d.week}</small>`;
  document.getElementById("slide-prev").disabled = false;
  document.getElementById("slide-next").disabled = false;
  document.querySelectorAll("#film .frame").forEach(x => x.setAttribute("aria-current", String(+x.dataset.i === i)));
});
document.getElementById("slide-prev").addEventListener("click", () => showSlide(slideAt - 1));
document.getElementById("slide-next").addEventListener("click", () => showSlide(slideAt + 1));

/* ---------- export (mockup) ---------- */
function flash(btn, msg, back) {
  btn.textContent = msg;
  setTimeout(() => { btn.textContent = back; }, 2600);
}
document.getElementById("btn-export").addEventListener("click", function () {
  flash(this, "Assembled " + FORM.filter(hasContent).length + " items into DOST Form 2 (mockup)", "Export current draft");
});
document.getElementById("btn-assemble").addEventListener("click", function () {
  flash(this, "Assembled " + DECK.filter(d => d.status === "in").length + " slides into one deck (mockup)", "Assemble the deck");
});


/* =====================================================================
   Proposal preview — DOST Form 2 redrawn box for box. Structured items
   read their `value`; prose items read `draft`. Nothing is parsed.
   ===================================================================== */

/* the blue answer, or a grey note saying which week fills it */
function ans(n) {
  const f = F(n), t = (f.draft || "").trim();
  if (t) return `<div class="ans">${esc(t)}</div>`;
  return `<div class="todo">${f.status === "open"
    ? "to be written this week — " + esc(f.source)
    : "opens Week " + f.week + " — " + esc(f.source)}</div>`;
}
const inline = v => String(v || "").trim()
  ? `<span class="inline">${esc(v)}</span>` : `<span class="rule"></span>`;
const tickbox = on => `<span class="tick">${on ? "&#9745;" : "_____"}</span>`;

function buildSheet() {
  const P = F(1).value, S = F(3).value, C4 = F(4).value, A = F(5).value;
  const staff = F(21).value, B = F(22).value, PR = F(23).value;
  const sCols = ["country", "region", "province", "district", "municipality", "barangay"];

  const siteRows = S.map((r, i) =>
    `<tr><td>${i + 1}.</td>${sCols.map(k => `<td class="ans">${esc(r[k])}</td>`).join("")}</tr>`).join("");

  const staffRows = (staff.length ? staff : [{ position: "", pct: "", resp: "" }]).map(r =>
    `<tr><td class="l ans">${esc(r.position)}</td><td class="ans">${r.pct ? esc(r.pct) + "%" : ""}</td>
      <td class="l ans">${esc(r.resp)}</td></tr>`).join("");

  const col = k => B.rows.reduce((a, r) => a + (+r[k] || 0), 0);
  const grand = B.rows.reduce((a, r) => a + rowTotal(r), 0);
  const budgetRows = B.rows.map(r =>
    `<tr><td class="l">${esc(r.label)}</td><td class="ans">${money(r.ps)}</td><td class="ans">${money(r.mooe)}</td>
      <td class="ans">${money(r.eo)}</td><td class="ans">${money(rowTotal(r))}</td></tr>`).join("");

  const projRows = PR.rows.map(r =>
    `<tr><td class="l ans">${esc(r.title) || "&nbsp;"}</td><td class="l ans">${esc(r.agency)}</td>
      <td class="l ans">${esc(r.role)}</td></tr>`).join("");

  const areaLine = a => `<div class="idt">${tickbox(A.area === a.k)} ${a.label}</div>` +
    (a.extra ? `<div class="idt" style="padding-left:44px">${a.extraLabel}: ${A.area === a.k ? inline(A[a.extra]) : '<span class="rule"></span>'}</div>` : "");

  const page1 = `
  <div class="frame">
    <div class="box">
      <div class="no">(1) PROJECT PROFILE</div>
      <div>Program Title: ${inline(P.program)}</div>
      <div>Project Title: ${inline(P.title)}</div>
      <div>Project Leader/Sex: ${inline(P.leader && P.sex ? P.leader + " (" + P.sex + ")" : P.leader)}</div>
      <div>Project Duration (number of months): ${inline(P.months)}</div>
      <div class="idt">Project Start Date: ${inline(fmtDay(P.start))}</div>
      <div class="idt">Project End Date: ${inline(fmtDay(P.end))}</div>
      <div>Implementing Agency <span class="fine">(Name of University-College-Institute, Department/Organization or Company)</span>: ${inline(P.agency)}</div>
      <div>Address/Telephone/Fax/Email <span class="fine">(Barangay, Municipality, District, Province, Region)</span>: ${inline(P.address)}</div>
    </div>

    <div class="box">
      <div class="no">(2) COOPERATING AGENCY/IES <span class="fine red">(Name/s and Address/es)</span></div>
      ${ans(2)}
    </div>

    <div class="box">
      <div class="no">(3) SITE(S) OF IMPLEMENTATION</div>
      <table class="g" style="margin-top:4px">
        <thead><tr>
          <th style="width:13%">IMPLEMENTATION SITES NO.</th><th class="red">COUNTRY</th><th>REGION</th>
          <th>PROVINCE</th><th>DISTRICT</th><th>MUNICIPALITY</th><th class="red">BARANGAY</th>
        </tr></thead>
        <tbody>${siteRows}</tbody>
      </table>
    </div>

    <div class="split" style="border-bottom:1px solid #000">
      <div>
        <div class="no">(4) TYPE OF RESEARCH</div>
        <div class="idt">${tickbox(C4.precommercialization)} Pre-commercialization</div>
      </div>
      <div>
        <div class="no">(5) R&amp;D PRIORITY AREA &amp; PROGRAM <span class="fine">(based on HNRDA 2017-2022)</span></div>
        ${AREAS.map(areaLine).join("")}
      </div>
    </div>

    <div class="split" style="border-bottom:1px solid #000">
      <div><span class="no">Sustainable Development Goal (SDG) Addressed</span></div>
      <div>${A.sdg ? `<span class="inline">${esc(A.sdg)}</span>` : '<span class="rule" style="min-width:100%"></span>'}</div>
    </div>

    <div class="box">
      <div class="no">(6) EXECUTIVE SUMMARY <span class="fine">(not to exceed 200 words)</span></div>
      ${ans(6)}
      <div class="sub red" style="margin-top:6px">STARTUP BACKGROUND
        <span class="fine" style="color:#000">(Description of the startup and the founders, their product and value proposition, and the IP status and protection (if applicable))</span></div>
    </div>

    <div class="box"><div class="no red">(7) INTRODUCTION</div></div>
    <div class="box"><div class="no idt">(7.1) RATIONALE/SIGNIFICANCE <span class="fine">(not to exceed 300 words)</span></div>${ans(7)}</div>
    <div class="box"><div class="no idt">(7.2) SCIENTIFIC BASIS/THEORETICAL FRAMEWORK</div></div>
    <div class="box">
      <div class="no idt">(7.3) OBJECTIVES</div>
      <div>General:</div><div>Specific:</div>
    </div>

    <div class="box">
      <div class="no">(8) REVIEW OF LITERATURE</div>
      <p class="hint">For startup proposals, results of previous R&amp;D conducted related to the proposed technology
        (product/process/service) and the status of the intellectual property (IP) protection of the proposed technology
        should be included. Also, include a background on the development of the technology (i.e., evolution of the
        startup, first prototype, first test, first sale).</p>
      ${ans(8)}
    </div>

    <div class="box">
      <div class="no">(9) MARKETING AND COMMERCIAL VIABILITY <span class="fine">(For startup proposals)</span></div>
      <p class="hint">(Details such as: a) competitors (Include in the proposal a competitive advantage analysis using a
        comparative advantage table.); b) similarities, differences, and advantages of the product compared to its
        competitors; c) production requirements and its corresponding values; d) details of Intellectual Property Rights
        (IPR) and license applications; e) raw materials and suppliers; f) target and current areas of distribution;
        g) target market and beneficiaries; h) description and size of the target market; i) ideal forecast of the demand
        and sales; j) limiting factors, and; k) marketing strategies and pricing.)</p>
      ${ans(9)}
      <div class="hint" style="margin-top:4px">${F(9).parts.map(pt =>
        `${tickbox(pt.done)} (${pt.k}) ${esc(pt.label)}`).join("<br>")}</div>
    </div>
  </div>`;

  const simple = (n, title, hint) => `
    <div class="box">
      <div class="no">(${n}) ${title}${hint ? ` <span class="fine">${hint}</span>` : ""}</div>
      ${ans(n)}
    </div>`;

  const page2 = `
  <div class="frame">
    ${simple(10, "METHODOLOGY")}
    ${simple(11, "TECHNOLOGY ROADMAP", "(if applicable) (use the attached sheet)")}
    ${simple(12, "EXPECTED OUTPUTS (6Ps)")}
    ${simple(13, "POTENTIAL OUTCOMES")}
    ${simple(14, "POTENTIAL IMPACTS (2Is)")}
    ${simple(15, "TARGET BENEFICIARIES")}
    ${simple(16, "SUSTAINABILITY PLAN", "(if applicable)")}
    ${simple(17, "GENDER AND DEVELOPMENT (GAD) SCORE", "(refer to the attached GAD checklist)")}
    ${simple(18, "LIMITATIONS OF THE PROJECT")}
    ${simple(19, "LIST OF RISKS AND ASSUMPTIONS RISK MANAGEMENT PLAN", "(List possible risks and assumptions in attaining target outputs or objectives.)")}
    ${simple(20, "LITERATURE CITED")}

    <div class="box">
      <div class="no">(21) PERSONNEL REQUIREMENT</div>
      <table class="g" style="margin-top:4px">
        <thead><tr><th style="width:42%">Position</th><th style="width:18%">Percent Time Devoted to the Project</th><th>Responsibilities</th></tr></thead>
        <tbody>${staffRows}</tbody>
      </table>
    </div>

    <div class="box">
      <div class="no">(22) BUDGET BY IMPLEMENTING AGENCY</div>
      <table class="g" style="margin-top:4px">
        <thead><tr><th style="width:32%">IMPLEMENTING AGENCY</th><th>PS</th><th>MOOE</th><th>EO</th><th>Total</th></tr></thead>
        <tbody>${budgetRows}
          <tr><td><strong>TOTAL</strong></td><td class="ans"><strong>${money(col("ps"))}</strong></td>
            <td class="ans"><strong>${money(col("mooe"))}</strong></td><td class="ans"><strong>${money(col("eo"))}</strong></td>
            <td class="ans"><strong>${money(grand)}</strong></td></tr>
        </tbody></table>
      ${B.counterpart ? `<div class="ans">${esc(B.counterpart)}</div>` : ""}
    </div>

    <div class="box">
      <div class="no">(23) OTHER ONGOING PROJECTS BEING HANDLED BY THE PROJECT LEADER: ${inline(PR.count)} <span class="fine">(number)</span></div>
      <table class="g" style="margin-top:4px">
        <thead><tr><th style="width:48%">Title of the Project</th><th>Funding Agency</th><th>Involvement in the Project</th></tr></thead>
        <tbody>${projRows}</tbody>
      </table>
    </div>

    <div class="box">
      <div class="no">(24) OTHER SUPPORTING DOCUMENTS <span class="fine">(Please refer to page 2 for the additional necessary documents.)</span></div>
      <div class="hint">${F(24).attachments.map(a =>
        `${a.have === null ? '<span class="tick">&#8211;</span>' : tickbox(a.have)} ${esc(a.label)}`).join("<br>")}</div>
    </div>
  </div>

  <p class="certify">I hereby certify the truth of the foregoing and have no pending financial and/or technical
    obligations from the DOST and its attached Agencies. I further certify that the programs/projects being handled
    is within the prescribed number as stipulated in the DOST-GIA Guidelines. Any willful omission/false statement
    shall be a basis of disapproval and cancellation of the project.</p>

  <table class="g">
    <thead><tr><th style="width:26%">&nbsp;</th><th>SUBMITTED BY (Project Leader)</th><th>ENDORSED BY (Head of the Agency)</th></tr></thead>
    <tbody>${["Signature", "Printed Name", "Designation/Title", "Date"].map(r =>
      `<tr><td class="l" style="height:30px">${r}</td><td></td><td></td></tr>`).join("")}</tbody>
  </table>
  <div class="footnote">Note: See guidelines/definitions at the back.</div>`;

  const done = FORM.filter(hasContent).length;
  document.getElementById("sheet").innerHTML = `
    <div class="dochead">
      <img src="assets/dost-logo.png" alt="Department of Science and Technology">
      <div class="ti"><div class="l1">DOST Form 2 (for Startups)</div>
        <div class="l2">DETAILED RESEARCH &amp; DEVELOPMENT PROJECT PROPOSAL</div></div>
      <div></div>
    </div>
    <div class="draftnote">Working draft · ${done} of ${FORM.length} items written · ${esc(TEAM.name)} · Week ${CAP.week_no} of ${CAP.weeks_total}</div>
    ${page1}<div class="pagebreak"></div>${page2}`;

  document.getElementById("sheet-sub").textContent =
    done + " of " + FORM.length + " items written · updates as you type";
}

/* the box on the paper that belongs to the item being edited */
function markHot(n) {
  const sheet = document.getElementById("sheet");
  sheet.querySelectorAll(".hot").forEach(el => el.classList.remove("hot"));
  const box = [...sheet.querySelectorAll(".box, .split")]
    .find(el => new RegExp("^\\(" + n + "\\)").test((el.querySelector(".no") || {}).textContent || ""));
  if (box) box.classList.add("hot");
  return box;
}

/* open / close — docked, so typing on the left redraws the paper on the right */
let sheetOpen = false, lastFocus = null;
function openSheet() {
  buildSheet();
  lastFocus = document.activeElement;
  document.getElementById("sheetwrap").hidden = false;
  document.body.classList.add("sheet-open");
  sheetOpen = true;
  document.getElementById("btn-preview").textContent = "Hide the form";
  const box = markHot(current);
  if (box) box.scrollIntoView({ block: "center" });
}
function closeSheet() {
  document.getElementById("sheetwrap").hidden = true;
  document.body.classList.remove("sheet-open");
  sheetOpen = false;
  document.getElementById("btn-preview").textContent = "Preview the form";
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
}
/* called on every keystroke in the editor */
function syncSheet(n, scroll) {
  if (!sheetOpen) return;
  const keep = document.getElementById("sheetwrap").scrollTop;
  buildSheet();
  const box = markHot(n);
  if (scroll && box) box.scrollIntoView({ block: "center" });
  else document.getElementById("sheetwrap").scrollTop = keep;
}
document.getElementById("btn-preview").addEventListener("click", () => sheetOpen ? closeSheet() : openSheet());
// the merged site's router calls this when you navigate away from Capstone
window.__closeSheet = () => { if (sheetOpen) closeSheet(); };
document.getElementById("sheet-close").addEventListener("click", closeSheet);
document.getElementById("sheet-print").addEventListener("click", () => window.print());
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && sheetOpen) closeSheet();
});

/* ---------- dynamic controller & start ---------- */
window.__renderCapstone = function(targetTeamId) {
  const gate = document.getElementById("capstone-locked-gate");
  const content = document.getElementById("capstone-content-wrap");
  if (!gate || !content) return;

  const auth = window.MOCK && window.MOCK.auth;
  if (!auth || !auth.canAccess("capstone")) {
    gate.hidden = false;
    content.hidden = true;
    const slot = document.getElementById("capstone-switcher-slot");
    if (slot) slot.innerHTML = "";
    if (typeof closeSheet === "function" && sheetOpen) closeSheet();
    return;
  }

  gate.hidden = true;
  content.hidden = false;

  const user = auth.getCurrentUser();
  const assigned = auth.getAssignedTeams();
  let activeId;
  if (user.role === "participant") {
    activeId = user.team_id || "g1";
  } else {
    if (targetTeamId && (assigned.includes(targetTeamId) || user.role === "admin")) {
      activeId = targetTeamId;
    } else if (window.__selectedTeamId && (assigned.includes(window.__selectedTeamId) || user.role === "admin")) {
      activeId = window.__selectedTeamId;
    } else {
      activeId = assigned[0] || "g1";
    }
  }
  window.__selectedTeamId = activeId;

  const teams = window.MOCK.teams;
  TEAM = teams.find(t => t.id === activeId) || teams[0];
  CAP = window.MOCK.getCapstone(activeId);
  FORM = CAP.form;
  DECK = CAP.deck;

  // Render team switcher
  const slot = document.getElementById("capstone-switcher-slot");
  if (slot) {
    if (user.role === "participant") {
      slot.innerHTML = `
        <div class="team-switcher-bar">
          <span style="font-weight:700;color:var(--ink-soft);font-size:0.95rem;">Assigned Team:</span>
          <span class="badge blue" style="font-size:0.85rem;padding:4px 10px;">${esc(TEAM.name)} — ${esc(TEAM.technology_title)}</span>
          <span class="small muted" style="margin-left:auto;">Participant access locked to your registered STEP Group</span>
        </div>`;
    } else {
      const allowedTeams = (user.role === "admin") ? teams : teams.filter(t => assigned.includes(t.id));
      if (allowedTeams.length > 1) {
        slot.innerHTML = `
          <div class="team-switcher-bar">
            <label for="team-select-capstone" style="font-weight:700;color:var(--ink);font-size:0.95rem;">Viewing Team:</label>
            <select id="team-select-capstone" class="form-select" style="padding:6px 12px;border-radius:var(--r1);border:1px solid var(--rim);background:var(--paper);font-weight:600;font-size:0.9rem;cursor:pointer;">
              ${allowedTeams.map(t => `<option value="${t.id}" ${t.id === activeId ? 'selected' : ''}>${esc(t.name)} — ${esc(t.technology_title)}</option>`).join('')}
            </select>
            <span class="badge gold" style="text-transform:capitalize;">${user.role} View (${allowedTeams.length} teams assigned)</span>
          </div>`;
        const sel = document.getElementById("team-select-capstone");
        if (sel) {
          sel.addEventListener("change", (e) => {
            window.__selectedTeamId = e.target.value;
            window.__renderCapstone(e.target.value);
            document.dispatchEvent(new CustomEvent("stephub_team_changed", { detail: e.target.value }));
          });
        }
      } else {
        slot.innerHTML = `
          <div class="team-switcher-bar">
            <span style="font-weight:700;color:var(--ink-soft);font-size:0.95rem;">Assigned Team:</span>
            <span class="badge blue" style="font-size:0.85rem;padding:4px 10px;">${esc(TEAM.name)} — ${esc(TEAM.technology_title)}</span>
            <span class="badge gold" style="text-transform:capitalize;margin-left:auto;">${user.role}</span>
          </div>`;
      }
    }
  }

  refreshCounts();
  renderItemBar();
  renderItemList();
  const openItemObj = FORM.find(f => f.status === "open") || FORM[0];
  openItem(openItemObj.n);
  renderFilm();
  const firstIn = DECK.filter(d => d.status === "in").length - 1;
  showSlide(firstIn >= 0 ? firstIn : 0);
  if (sheetOpen) buildSheet();
};

document.addEventListener("stephub_auth_changed", () => {
  if (typeof window.__renderCapstone === "function") window.__renderCapstone();
});

window.__renderCapstone();


})();
/* ---- trainers.html ---- */
(function(){
const F = window.MOCK.faculty;
const G = window.MOCK.groups;
const CUR = window.MOCK.cohort.current_week;
const esc = t => String(t == null ? "" : t)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const byTeam = Object.fromEntries(G.map(t => [t.short, t]));
const NOW = new Date(window.MOCK.thisWeek.today);

/* ---------- the plate in the hero ---------- */
document.getElementById("fa-spec").innerHTML = `
  <div class="cap">This cycle</div>
  <dl>
    <div class="r"><dt>Trainers</dt><dd><b>${F.trainers.length}</b><em>across the tracks</em></dd></div>
    <div class="r"><dt>Mentors</dt><dd><b>${F.mentors.length}</b><em>one per team</em></dd></div>
    <div class="r"><dt>Panels</dt><dd><b>${F.panels.length}</b><em>running in parallel</em></dd></div>
    <div class="r"><dt>Sessions</dt><dd><b>${F.sessions.filter(s => !s.special).length}</b><em>in the curriculum</em></dd></div>
  </dl>`;

/* ---------- the view switch ---------- */
(function () {
  const note = document.getElementById("fa-note");
  const NOTES = {
    trainers: "Who teaches each topic, what has been delivered so far, and where the slide decks go.",
    mentors: "Who mentors which team, when they meet this week, and the room they meet in.",
    panel: "Who sits on each panel, and the score sheet used on Saturday.",
  };
  const VIEWS = ["trainers", "mentors", "panel"];
  /* The merged site routes on the hash, so the view rides along as
     #trainers-<view> — which its router reads as the trainers route. */
  const readHash = () => {
    const h = (location.hash || "").replace(/^#/, "").replace(/^trainers-?/, "");
    return VIEWS.includes(h) ? h : "trainers";
  };
  const LABEL = { trainers: "Trainers", mentors: "Mentors", panel: "Panel" };
  const bar = document.getElementById("fa-bar");
  bar.innerHTML = VIEWS.map(v =>
    `<button role="tab" class="vb" data-v="${v}" aria-selected="false">${LABEL[v]}</button>`).join("");

  /* mode: "init" on first paint (never touch the URL — in the merged site the
     hash belongs to the router), "push" when the reader chose a view. */
  function show(v, mode) {
    VIEWS.forEach(k => { document.getElementById("view-" + k).hidden = k !== v; });
    note.textContent = NOTES[v];
    document.getElementById("fa-title").textContent = LABEL[v];
    bar.querySelectorAll(".vb").forEach(b =>
      b.setAttribute("aria-selected", b.dataset.v === v ? "true" : "false"));
    document.querySelectorAll(".ddm a").forEach(a =>
      a.setAttribute("aria-current", (a.getAttribute("href") || "").endsWith(
        v === "trainers" ? "#trainers" : "-" + v) ? "true" : "false"));
    if (mode === "init") return;
    const want = "#trainers" + (v === "trainers" ? "" : "-" + v);
    if (location.hash !== want) {
      if (mode === "push") location.hash = want; else history.replaceState(null, "", want);
    }
  }
  bar.addEventListener("click", e => {
    const b = e.target.closest(".vb"); if (!b) return;
    show(b.dataset.v, "push");
  });
  /* the Trainers tab menu drops a new hash in — follow it, but leave hashes
     that belong to another route alone */
  window.addEventListener("hashchange", () => {
    const raw = (location.hash || "").replace(/^#/, "");
    if (raw && !/^trainers(-|$)/.test(raw) && !VIEWS.includes(raw)) return;
    const h = readHash();
    if (document.getElementById("view-" + h).hidden) show(h, "init");
  });
  show(readHash(), "init");
})();

/* ---------- trainers ---------- */
(function () {
  const titleOf = c => (F.sessions.find(s => s.code === c) || {}).title || c;
  document.getElementById("tr-grid").innerHTML = F.trainers.map((t, i) => `
    <article class="fcard reveal" style="--d:${i * 50}ms">
      <div class="fh">
        <span class="fav">${esc(t.initials)}</span>
        <span class="fhx">
          <h4>${esc(t.name)}</h4>
          <span class="fo">${esc(t.org)}</span>
        </span>
      </div>
      <p class="ffocus">${esc(t.focus)}</p>
      <div class="fmods">
        ${t.modules.map(c => `<span class="mod" title="${esc(titleOf(c))}">${esc(c)}</span>`).join("")}
        <span class="fmn">${t.modules.length} session${t.modules.length === 1 ? "" : "s"}</span>
      </div>
    </article>`).join("");
})();

/* ---------- the curriculum, with what is done ---------- */
(function () {
  const rows = F.sessions.slice().sort((a, b) => a.week - b.week || (a.special ? 1 : -1));
  document.getElementById("curr").innerHTML = rows.map(s => {
    const state = s.week < CUR ? "done" : s.week === CUR ? "now" : "next";
    const tag = state === "done" ? "Delivered" : state === "now" ? "This week" : "Upcoming";
    return `
    <div class="crow ${state} reveal">
      <div class="cwk"><b>${s.special ? "—" : "Week " + s.week}</b><span class="code">${esc(s.code)}</span></div>
      <div class="cbody">
        <div class="ctitle">${esc(s.title)}</div>
        <div class="cmeta">${esc(s.trainer)} · ${esc(s.mode)}</div>
        <div class="ccov">${esc(s.coverage)}</div>
        ${s.deliverable && s.deliverable !== "—"
          ? `<div class="cdel"><span>Output</span>${esc(s.deliverable)}</div>` : ""}
        ${s.assess.length
          ? `<details class="cass"><summary>Panel criteria (${s.assess.filter(a => a.weight).length})</summary>
               <ul>${s.assess.map(a => a.group
                    ? `<li class="grp">${esc(a.group)}</li>`
                    : `<li><b>${a.weight}%</b> ${esc(a.label)}</li>`).join("")}</ul>
             </details>` : ""}
      </div>
      <div class="cside"><span class="cstat ${state}">${tag}</span>
        <span class="cslides" data-code="${esc(s.code)}">${state === "done" ? "Slides posted" : "No slides yet"}</span>
      </div>
    </div>`;
  }).join("");
})();

/* ---------- posting a deck ---------- */
(function () {
  const sel = document.getElementById("sl-session");
  sel.innerHTML = F.sessions.map(s => `<option value="${esc(s.code)}">${esc(s.code)} · ${esc(s.title)}</option>`).join("");
  sel.value = (F.sessions.find(s => s.week === CUR) || F.sessions[0]).code;

  const drop = document.getElementById("sl-drop");
  const input = document.getElementById("sl-file");
  const posted = document.getElementById("sl-posted");
  const list = [];

  const kb = n => n < 1024 * 1024 ? Math.round(n / 1024) + " KB" : (n / 1048576).toFixed(1) + " MB";
  function draw() {
    posted.innerHTML = list.length
      ? `<div class="pl-h">Posted in this session</div>` + list.map((f, i) => `
          <div class="pl">
            <span class="ft">${esc(f.ext)}</span>
            <span class="pn"><b>${esc(f.name)}</b><span>${esc(f.code)} · ${esc(f.size)}</span></span>
            <button class="lnk" data-i="${i}" aria-label="Remove ${esc(f.name)}">Remove</button>
          </div>`).join("")
      : `<div class="pl-h">Nothing posted yet</div>
         <p class="small muted mb-0">Decks you post here appear against the session in the curriculum above.</p>`;
  }
  function take(file) {
    if (!file) return;
    const ext = (file.name.split(".").pop() || "file").toUpperCase().slice(0, 4);
    list.unshift({ name: file.name, size: kb(file.size), ext, code: sel.value });
    const mark = document.querySelector(`.cslides[data-code="${sel.value}"]`);
    if (mark) { mark.textContent = "Slides posted"; mark.closest(".crow").classList.add("has-slides"); }
    draw();
  }
  input.addEventListener("change", e => take(e.target.files[0]));
  ["dragenter", "dragover"].forEach(ev => drop.addEventListener(ev, e => {
    e.preventDefault(); drop.classList.add("over");
  }));
  ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, e => {
    e.preventDefault(); drop.classList.remove("over");
  }));
  drop.addEventListener("drop", e => take(e.dataTransfer.files[0]));
  posted.addEventListener("click", e => {
    const b = e.target.closest(".lnk"); if (!b) return;
    list.splice(+b.dataset.i, 1); draw();
  });
  draw();
})();

/* ---------- mentors ---------- */
(function () {
  document.getElementById("mn-note").textContent = F.mentorNote;
  document.getElementById("mn-grid").innerHTML = F.mentors.map((m, i) => {
    const t = byTeam[m.team];
    return `
    <article class="fcard reveal" style="--d:${i * 40}ms">
      <div class="fh">
        <span class="fav">${esc(m.initials)}</span>
        <span class="fhx">
          <h4>${esc(m.name)}</h4>
          <span class="fo">${t ? esc(t.institution) : ""}</span>
        </span>
      </div>
      <div class="fteam">
        ${t ? `<span class="tlogo"><img src="${t.mark}" alt="" loading="lazy"></span>` : ""}
        <span class="ftx"><b>${esc(m.team)}</b><span>${esc(m.day)} · ${esc(m.time)}</span></span>
      </div>
    </article>`;
  }).join("");
})();

/* ---------- the week's mentoring slots ---------- */
(function () {
  const W = window.MOCK.thisWeek;
  const DAY = { Wed: 1, Thu: 2, Fri: 3 };
  const dayDate = d => W.days.find(x => x.label.slice(0, 3) === d);
  const manilaDay = dt => dt.toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });
  const TODAY = manilaDay(NOW);

  const groups = ["Wed", "Thu", "Fri"].map(d => ({
    day: d, date: dayDate(d),
    rows: F.mentors.filter(m => m.day === d).sort((a, b) => a.time.localeCompare(b.time)),
  }));

  document.getElementById("sched").innerHTML = groups.map(g => {
    if (!g.rows.length) return "";
    const iso = g.date ? g.date.d : "";
    const past = iso && iso < TODAY, today = iso === TODAY;
    return `
    <div class="sday ${past ? "past" : ""} ${today ? "today" : ""} reveal">
      <div class="sdh">
        <b>${g.date ? esc(g.date.label) : g.day}</b>
        <span>${iso ? new Date(iso + "T00:00:00+08:00").toLocaleDateString("en-PH",
          { timeZone: "Asia/Manila", day: "numeric", month: "long" }) : ""}${today ? " · today" : ""}</span>
      </div>
      <div class="sbody">
        ${g.rows.map(m => {
          const t = byTeam[m.team];
          const start = iso ? new Date(iso + "T" + m.time + ":00+08:00") : null;
          const open = start && (NOW >= new Date(start - 15 * 60000)) && (NOW <= new Date(+start + 60 * 60000));
          const done = start && NOW > new Date(+start + 60 * 60000);
          return `
          <div class="srow">
            <span class="stime">${esc(m.time)}<small>1 hour</small></span>
            <span class="steam">
              ${t ? `<span class="tlogo sm"><img src="${t.mark}" alt="" loading="lazy"></span>` : ""}
              <span><b>${esc(m.team)}</b><span class="smn">${esc(m.name)}</span></span>
            </span>
            ${done
              ? `<span class="sdone">Done</span>`
              : open
                ? `<a class="btn sm" href="${esc(m.zoom)}" target="_blank" rel="noopener">Join now</a>`
                : `<button class="btn secondary sm" disabled title="Opens 15 minutes before the slot">Join</button>`}
          </div>`;
        }).join("")}
      </div>
    </div>`;
  }).join("");
})();

/* ---------- the panels ---------- */
(function () {
  document.getElementById("pnl-grid").innerHTML = F.panels.map((p, i) => `
    <article class="pcard reveal" style="--d:${i * 70}ms">
      <div class="ph"><span class="pl">Panel ${esc(p.letter)}</span>
        <span class="pn2">${p.teams.length} team${p.teams.length === 1 ? "" : "s"}</span></div>
      <div class="pmembers">
        ${p.panelists.map(n => `<div class="pm"><span class="fav sm">${esc(initials(n))}</span>${esc(n)}</div>`).join("")}
      </div>
      <div class="pslots">
        ${p.teams.map(t => {
          const g = byTeam[t.team];
          return `<div class="ps">
            <span class="pst">${esc(t.at)}</span>
            ${g ? `<span class="tlogo sm"><img src="${g.mark}" alt="" loading="lazy"></span>` : ""}
            <span class="psn">${esc(t.team)}</span></div>`;
        }).join("")}
      </div>
    </article>`).join("");
})();

function initials(n) {
  const skip = /^(ms|mr|mrs|dr|engr|atty|prof|sir|maam)\.?$/i;
  const parts = String(n).replace(/[“”"]/g, "").split(/\s+/).filter(x => x && !skip.test(x));
  return ((parts[0] || "?")[0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

/* ---------- the score sheet: one team at a time ---------- */
(function () {
  const scored = F.sessions.filter(s => s.assess.length);
  const selS = document.getElementById("sc-session");
  const selP = document.getElementById("sc-panel");
  const selN = document.getElementById("sc-panelist");
  const tabs = document.getElementById("sc-tabs");
  const body = document.getElementById("sc-body");
  const msg = document.getElementById("sc-msg");
  let S, P, cur = 0, marks = {}, notes = {}, pnotes = {}, openRow = -1;

  selS.innerHTML = scored.map(s => `<option value="${esc(s.code)}">Week ${s.week} · ${esc(s.title)}</option>`).join("");
  const topic = window.MOCK.thisWeek.topic.code;      // keep it in step with This Week
  selS.value = (scored.find(s => s.code === topic) || scored.find(s => s.week === CUR)
                || scored[scored.length - 1]).code;
  selP.innerHTML = F.panels.map(p => `<option value="${esc(p.letter)}">Panel ${esc(p.letter)}</option>`).join("");


  const crit = () => S.assess.filter(a => !a.group);
  const band = v => v >= 3.5 ? "hi" : v >= 3.0 ? "ok" : v >= 2.5 ? "mid" : "lo";

  function totals(team) {
    let sum = 0, filled = 0;
    crit().forEach((a, i) => {
      const v = marks[team] && marks[team][i];
      if (v) { sum += v * (a.weight / 100); filled++; }
    });
    return { sum, filled, all: filled === crit().length };
  }

  /* the team strip — the one being scored is unmistakable */
  function drawTabs() {
    tabs.innerHTML = P.teams.map((t, i) => {
      const g = byTeam[t.team], r = totals(t.team), on = i === cur;
      const state = r.all ? "done" : r.filled ? "part" : "empty";
      return `<button class="tmb ${state}" role="tab" data-i="${i}" aria-selected="${on}"
                 tabindex="${on ? 0 : -1}">
        <span class="tmb-slot">${esc(t.at)}</span>
        ${g ? `<span class="tlogo sm"><img src="${g.mark}" alt="" loading="lazy"></span>` : ""}
        <span class="tmb-tx"><b>${esc(t.team)}</b>
          <span class="tmb-st">${r.all ? "Scored " + r.sum.toFixed(2)
                                : r.filled ? r.filled + " of " + crit().length
                                : "Not started"}</span></span>
        <span class="tmb-dot" aria-hidden="true">${r.all ? "✓" : ""}</span>
      </button>`;
    }).join("");
  }

  /* the sheet for that one team: criteria on the left, the running mark and
     the comment box on the right, so the whole thing sits in one screen */
  function drawBody() {
    const t = P.teams[cur], g = byTeam[t.team], r = totals(t.team);
    let n = -1;
    const rows = S.assess.map(a => {
      if (a.group) return `<li class="cgrp">${esc(a.group)}</li>`;
      n++; const i = n;
      const v = (marks[t.team] || {})[i] || "";
      const note = (pnotes[t.team] || {})[i] || "";
      const open = openRow === i;
      return `<li class="crow2${v ? " set" : ""}${note ? " noted" : ""}${open ? " open" : ""}">
        <span class="wt">${a.weight}%</span>
        <button type="button" class="cdef" data-row="${i}" aria-expanded="${open}"
                aria-controls="cnote-${i}">
          <span class="cdef-t">${esc(a.label)}</span>
          <span class="cdef-ic" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </span>
        </button>
        <span class="inwrap">
          <input class="scin" type="number" min="1" max="4" step="0.05" value="${v}"
                 data-i="${i}" placeholder="—" aria-label="Score out of 4, ${esc(a.label)}">
          <span class="outof">/&thinsp;4</span>
        </span>
        <div class="cnote" id="cnote-${i}"><div class="cnote-in">
          <textarea class="pnote" data-i="${i}" rows="2"
            placeholder="Comment on this point — what the panel saw, and what would raise it">${esc(note)}</textarea>
        </div></div>
      </li>`;
    }).join("");

    body.innerHTML = `
      <ol class="crit">${rows}</ol>
      <aside class="tmside">
        <div class="tmh">
          <span class="tmh-slot">${esc(t.at)}</span>
          ${g ? `<span class="tlogo lg"><img src="${g.mark}" alt="" loading="lazy"></span>` : ""}
          <span class="tmh-tx">
            <h4>${esc(t.team)}</h4>
            <span>${g ? esc(g.institution) : ""}</span>
          </span>
        </div>
        <div class="tmh-tot ${r.all ? band(r.sum) : ""}" id="sc-tot">
          <b>${r.filled ? r.sum.toFixed(2) : "—"}</b>
          <span>${r.all ? "weighted total, out of 4.00" : r.filled + " of " + crit().length + " scored"}</span>
        </div>
        <div class="scalewrap">
          <dl class="scalekey">
            ${F.scale.map(x => `<div><dt>${esc(x.value)}</dt><dd>${esc(x.grade)}</dd></div>`).join("")}
          </dl>
          <p class="scalenote">${esc(F.scaleNote)}</p>
        </div>
        <div class="cmt-box">
          <label for="sc-note">General comment</label>
          <textarea id="sc-note"
            placeholder="What they did well, and the one thing to fix before next week">${esc(notes[t.team] || "")}</textarea>
        </div>
      </aside>`;
    lockPanel();
    tally();
  }

  /* Measure the panel once with every note closed, then pin that height.
     Opening a note scrolls inside the criteria column instead of making the
     whole sheet grow and shift under the panelist. */
  function lockPanel() {
    body.style.height = "";
    requestAnimationFrame(() => {
      if (body.offsetParent === null) return;          // hidden view: measure it once it shows
      body.style.height = Math.ceil(body.getBoundingClientRect().height) + "px";
    });
  }
  /* In the merged site the Panel view is built while it is still hidden, so the
     first honest measurement happens the moment it comes on screen. */
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting) && S && !body.style.height) lockPanel();
    }).observe(body);
  }
  window.addEventListener("resize", () => { if (S) lockPanel(); });

  function refreshTotal() {
    const t = P.teams[cur], r = totals(t.team);
    const el = document.getElementById("sc-tot");
    el.className = "tmh-tot " + (r.all ? band(r.sum) : "");
    el.innerHTML = `<b>${r.filled ? r.sum.toFixed(2) : "—"}</b>
      <span>${r.all ? "weighted total, out of 4.00" : r.filled + " of " + crit().length + " scored"}</span>`;
  }

  function tally() {
    const done = P.teams.filter(t => totals(t.team).all).length;
    msg.textContent = done === 0 ? "Nothing scored yet."
      : done === P.teams.length ? "All " + done + " teams scored. Submit when you are ready."
      : done + " of " + P.teams.length + " teams fully scored.";
    msg.className = "msg" + (done === P.teams.length ? " ok" : "");
  }

  function pick(i) {
    cur = (i + P.teams.length) % P.teams.length;
    openRow = -1;                                   // start each team with the notes closed
    drawTabs(); drawBody();
    const b = tabs.querySelector('[aria-selected="true"]');
    if (b) b.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  tabs.addEventListener("click", e => {
    const b = e.target.closest(".tmb"); if (!b) return;
    pick(+b.dataset.i);
    tabs.querySelector('[aria-selected="true"]').focus();
  });
  tabs.addEventListener("keydown", e => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    pick(cur + (e.key === "ArrowRight" ? 1 : -1));
    tabs.querySelector('[aria-selected="true"]').focus();
  });

  body.addEventListener("click", e => {
    const b = e.target.closest(".cdef"); if (!b) return;
    const i = +b.dataset.row;
    openRow = openRow === i ? -1 : i;
    body.querySelectorAll(".crow2").forEach((row, n) => {
      const on = n === openRow;                       // n counts rows, not criteria
      row.classList.toggle("open", row.querySelector(".cdef") &&
        +row.querySelector(".cdef").dataset.row === openRow);
      const btn = row.querySelector(".cdef");
      if (btn) btn.setAttribute("aria-expanded", +btn.dataset.row === openRow);
    });
    if (openRow === i) {
      const ta = body.querySelector(`.pnote[data-i="${i}"]`);
      if (ta) setTimeout(() => ta.focus(), 180);
    }
  });

  body.addEventListener("input", e => {
    const el = e.target, team = P.teams[cur].team;
    if (el.classList.contains("scin")) {
      let v = parseFloat(el.value);
      if (isNaN(v)) { if (marks[team]) delete marks[team][el.dataset.i]; el.closest(".crow2").classList.remove("set"); }
      else {
        v = Math.min(4, Math.max(1, v));
        (marks[team] = marks[team] || {})[el.dataset.i] = v;
        el.closest(".crow2").classList.add("set");
      }
      refreshTotal(); drawTabs(); tally();
    }
    if (el.id === "sc-note") notes[team] = el.value;
    if (el.classList.contains("pnote")) {
      (pnotes[team] = pnotes[team] || {})[el.dataset.i] = el.value;
      el.closest(".crow2").classList.toggle("noted", !!el.value.trim());
    }
  });

  function load() {
    S = scored.find(s => s.code === selS.value);
    P = F.panels.find(p => p.letter === selP.value);
    selN.innerHTML = P.panelists.map(n => `<option>${esc(n)}</option>`).join("");
    document.getElementById("sc-code").textContent = S.code + " · Week " + S.week;
    document.getElementById("sc-title").textContent = S.title;
    document.getElementById("sc-meta").textContent =
      "Saturday panel · " + P.teams.length + " teams · 35 min each";
    marks = {}; notes = {}; pnotes = {}; openRow = -1; cur = 0;
    drawTabs(); drawBody();
  }

  selS.addEventListener("change", load);
  selP.addEventListener("change", load);
  document.getElementById("sc-clear").addEventListener("click", () => {
    marks = {}; notes = {}; pnotes = {}; openRow = -1; drawTabs(); drawBody();
  });
  document.getElementById("sc-submit").addEventListener("click", () => {
    const missing = P.teams.filter(t => !totals(t.team).all);
    if (!missing.length) {
      msg.textContent = "Submitted. In the built site this would go to each team's My Team's Work page.";
      msg.className = "msg ok";
    } else {
      pick(P.teams.indexOf(missing[0]));          // jump to the first one still open
      msg.textContent = "Still to finish: " + missing.map(t => t.team).join(", ") + ".";
      msg.className = "msg no";
    }
  });
  load();
})();



/* ---------- RBAC Access Guard for Faculty Portal ---------- */
window.__renderTrainers = function() {
  const user = window.MOCK ? window.MOCK.auth.getCurrentUser() : null;
  const gate = document.getElementById("trainers-locked-gate");
  const content = document.getElementById("trainers-content-wrap");
  if (!gate || !content) return;

  if (!user || user.role === "guest" || user.role === "participant") {
    gate.hidden = false;
    gate.innerHTML = `
      <div class="access-restricted-card">
        <div class="shield-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
        </div>
        <h2>Faculty &amp; Staff Access Only</h2>
        <p>The Trainers, Mentors, and Panel evaluation portal is restricted to program instructors, mentors, and panelists. Participants can access their team dashboard under <b>My Team's Work</b> and <b>Capstone</b>.</p>
        <div class="role-badge-row">
          <span>Current Account: <b>${user ? (user.name + ' (' + user.role_label + ')') : 'Guest / Visitor'}</b></span>
        </div>
        <div>
          <button class="btn solid" onclick="window.MOCK.openAuthModal()">Switch to Faculty or Admin Account</button>
        </div>
      </div>
    `;
    content.hidden = true;
  } else {
    gate.hidden = true;
    content.hidden = false;
    // Set appropriate view based on role
    if (user.role === "mentor") {
      const btn = document.querySelector('[data-view="mentors"]');
      if (btn) btn.click();
    } else if (user.role === "panel") {
      const btn = document.querySelector('[data-view="panel"]');
      if (btn) btn.click();
    } else if (user.role === "trainer") {
      const btn = document.querySelector('[data-view="trainers"]');
      if (btn) btn.click();
    }
  }
};
window.__renderTrainers();
window.addEventListener("stephub_auth_changed", () => window.__renderTrainers());
})();

/* ---------- scroll reveal (shared by both pages) ---------- */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    window.__stepObserve = function (scope) {
      (scope || document).querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    };
    window.__stepObserve(document);
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  window.__stepObserve = function (scope) {
    (scope || document).querySelectorAll(".reveal:not(.in)").forEach(function (el) { io.observe(el); });
  };
  window.__stepObserve(document);
})();


/* ---------- tiny hash router ---------- */
(function () {
  var routes = [].slice.call(document.querySelectorAll(".route"));
  var links  = [].slice.call(document.querySelectorAll("[data-route]"));
  var titles = { home: "SPRINT-STEP — Turning Filipino Researches into Business",
                 program: "Program · SPRINT-STEP",
                 myteam:  "My Team's Work · SPRINT-STEP",
                 capstone: "Capstone · SPRINT-STEP",
                 week:    "This Week · SPRINT-STEP",
                 groups:  "STEP Groups · SPRINT-STEP",
                 trainers: "Trainers · SPRINT-STEP" };

  function show(name, anchor) {
    if (!titles[name]) name = "home";
    // the Capstone form panel is docked to the page; never let it follow you elsewhere
    if (name !== "capstone" && window.__closeSheet) window.__closeSheet();
    routes.forEach(function (r) { r.hidden = (r.dataset.route !== name); });
    links.forEach(function (a) {
      var on = a.dataset.route === name && a.classList.contains("nav-link");
      a.classList.toggle("active", on);
    });
    document.title = titles[name];
    document.getElementById("nav").classList.remove("open");
    document.querySelector(".nav-toggle").setAttribute("aria-expanded", "false");
    // Trigger dynamic renders if available
    if (name === "week" && typeof window.__renderThisWeek === "function") window.__renderThisWeek();
    if (name === "myteam" && typeof window.__renderMyTeam === "function") window.__renderMyTeam();
    if (name === "capstone" && typeof window.__renderCapstone === "function") window.__renderCapstone();
    if (name === "trainers" && typeof window.__renderTrainers === "function") window.__renderTrainers();
    // replay the scroll reveals for the page we just switched to
    var target = document.getElementById("route-" + name);
    target.querySelectorAll(".reveal").forEach(function (el) { el.classList.remove("in"); });
    if (window.__stepObserve) window.__stepObserve(target);
    if (anchor) {
      var el = document.getElementById(anchor);
      if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    }
    window.scrollTo(0, 0);
  }

  function fromHash() {
    var h = (location.hash || "#home").slice(1);          // e.g. "program-selection"
    var name = h.split("-")[0];
    var anchor = h.indexOf("-") > -1 ? h.slice(h.indexOf("-") + 1) : "";
    show(name, anchor);
  }

  window.addEventListener("hashchange", fromHash);
  document.addEventListener("stephub_auth_changed", function () {
    var h = (location.hash || "#home").slice(1);
    var name = h.split("-")[0];
    if (name === "week" && typeof window.__renderThisWeek === "function") window.__renderThisWeek();
    if (name === "myteam" && typeof window.__renderMyTeam === "function") window.__renderMyTeam();
    if (name === "capstone" && typeof window.__renderCapstone === "function") window.__renderCapstone();
    if (name === "trainers" && typeof window.__renderTrainers === "function") window.__renderTrainers();
  });
  fromHash();
})();

