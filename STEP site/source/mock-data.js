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
      // Default to guest if no stored user
      return user || users.find(u => u.id === "guest");
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
        // Public routes — accessible without login
        return ["home", "program", "groups"].includes(route);
      }

      // ── Public routes — always accessible to logged-in users
      if (["home", "program", "groups"].includes(route)) return true;

      // ── This Week — all authenticated users
      if (route === "week") return true;

      // ── My Team's Work — all authenticated users
      if (route === "myteam") return true;

      // ── Capstone — all authenticated users
      if (route === "capstone") return true;

      // ── Trainers / Mentors / Panel — restricted to staff roles
      if (route === "trainers") {
        return ["trainer", "mentor", "panel", "admin"].includes(u.role);
      }

      // ── Default: deny access to unknown routes
      return ["admin"].includes(u.role);
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
        phases: [
          { n: 1, name: "Familiarisation", note: "Read all panel feedback transcripts end-to-end." },
          { n: 2, name: "Coding", note: "Assign descriptive labels to every meaningful comment." },
          { n: 3, name: "Theme development", note: "Cluster related codes into candidate themes." },
          { n: 4, name: "Review & refine", note: "Check themes against the coded data, merge or split as needed." },
          { n: 5, name: "Define & name", note: "Write concise theme names and scope statements." },
          { n: 6, name: "Write-up", note: "Compose the narrative with supporting extracts." }
        ],
        themes: [
          { name: "Evidence of demand is convincing", polarity: "strength", mentions: 9,
            detail: `User interviews and pilot letters of intent for ${t.name} are cited approvingly by Panel ${t.panel_letter}.`,
            codes: [{ label: "User validation", n: 5 }, { label: "Letter of intent", n: 4 }],
            extracts: [{ who: t.mentor_name, week: 6, text: `Fieldwork and data from ${t.city} are the strongest part of this deck.` }] },
          { name: "Value proposition clarity", polarity: "gap", mentions: 7,
            detail: p.quote,
            codes: [{ label: "Unclear ROI", n: 4 }, { label: "Missing metrics", n: 3 }],
            extracts: [{ who: "Panelist", week: 7, text: p.quote }] },
          { name: "Competitor differentiation", polarity: "watch", mentions: 4,
            detail: "Keep the benchmarked competitors fixed for the rest of the cycle.",
            codes: [{ label: "Benchmarking needed", n: 2 }, { label: "Import comparison", n: 2 }],
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

  // ── MOCK object is assembled at the end, after all functions are defined ──

  /* ---------------------------------------------------------------------
     Client-side Auth UI Manager (Modal, Utility Bar, Nav Lock Indicators)
     Now integrates with Supabase for real authentication.
     --------------------------------------------------------------------- */

  /* ── Cached live user (from Supabase profile) ── */
  let _liveUser = null;

  /** Get the effective current user: Supabase live user → mock user → guest */
  function getEffectiveUser() {
    if (_liveUser) return _liveUser;
    return auth.getCurrentUser();
  }

  // Patch auth.getCurrentUser to check for live user first
  const _origGetCurrentUser = auth.getCurrentUser.bind(auth);
  auth.getCurrentUser = function () {
    if (_liveUser) return _liveUser;
    return _origGetCurrentUser();
  };

  function renderAuthModal() {
    let modal = document.getElementById("stephub-auth-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "stephub-auth-modal";
      modal.className = "auth-backdrop";
      document.body.appendChild(modal);
    }
    const curr = getEffectiveUser();
    const isLiveUser = !!_liveUser;
    const isLoggedIn = isLiveUser || (curr && curr.role !== "guest");

    modal.innerHTML = `
      <div class="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <div class="auth-modal-head">
          <h3 id="auth-modal-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
            ${isLoggedIn ? 'Account' : 'Sign In'}
          </h3>
          <button class="auth-modal-close" aria-label="Close dialog" onclick="window.MOCK.closeAuthModal()">&times;</button>
        </div>
        <div class="auth-modal-body">
          ${isLoggedIn && isLiveUser ? `
            <!-- Signed-in state -->
            <div style="display:flex;align-items:center;gap:14px;padding:16px 18px;background:rgba(46,125,50,.06);border-radius:12px;margin-bottom:var(--s4);">
              <span class="card-av" style="background:#2e7d32;width:44px;height:44px;font-size:16px;flex-shrink:0;">${curr.initials || '??'}</span>
              <div>
                <div style="font-weight:600;font-size:15px;color:var(--navy);">${curr.full_name || curr.email}</div>
                <div style="font-size:13px;color:var(--ink-soft);">${curr.role_label || curr.role} ${curr.team_id ? '· ' + (curr.team_name || curr.team_id) : ''}</div>
                <div style="font-size:12px;color:var(--ink-soft);margin-top:2px;">${curr.email}</div>
              </div>
            </div>
            <button class="btn solid" style="width:100%;margin-top:4px;" onclick="window.MOCK._doSignOut()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-right:6px;"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          ` : isLoggedIn && !isLiveUser ? `
            <!-- Mock signed-in state -->
            <div style="display:flex;align-items:center;gap:14px;padding:16px 18px;background:rgba(46,125,50,.06);border-radius:12px;margin-bottom:var(--s4);">
              <span class="card-av" style="width:44px;height:44px;font-size:16px;flex-shrink:0;">${curr.initials}</span>
              <div>
                <div style="font-weight:600;font-size:15px;color:var(--navy);">${curr.name}</div>
                <div style="font-size:13px;color:var(--ink-soft);">${curr.role_label} ${curr.team_name ? '· ' + curr.team_name : ''}</div>
                <div style="font-size:12px;color:var(--ink-soft);opacity:.6;">Demo account</div>
              </div>
            </div>
            <button class="btn secondary" style="width:100%;margin-top:4px;" onclick="window.MOCK.signOutUser()">Sign Out (Guest Mode)</button>
          ` : `
            <!-- Sign-in form -->
            <form id="stephub-login-form" onsubmit="window.MOCK._doSignIn(event)" style="display:flex;flex-direction:column;gap:12px;">
              <div id="login-error" style="display:none;padding:10px 14px;border-radius:8px;background:rgba(198,40,40,.08);color:#c62828;font-size:13px;"></div>
              <label style="font-size:13px;font-weight:500;color:var(--navy);">
                Email
                <input type="email" id="login-email" required placeholder="you@example.com" style="width:100%;padding:10px 14px;border:1.5px solid #d0d5dd;border-radius:8px;font-size:14px;margin-top:4px;outline:none;transition:border-color .15s;" onfocus="this.style.borderColor='var(--blue)'" onblur="this.style.borderColor='#d0d5dd'">
              </label>
              <label style="font-size:13px;font-weight:500;color:var(--navy);">
                Password
                <input type="password" id="login-password" required minlength="6" placeholder="••••••••" style="width:100%;padding:10px 14px;border:1.5px solid #d0d5dd;border-radius:8px;font-size:14px;margin-top:4px;outline:none;transition:border-color .15s;" onfocus="this.style.borderColor='var(--blue)'" onblur="this.style.borderColor='#d0d5dd'">
              </label>
              <button type="submit" class="btn solid" id="login-submit-btn" style="width:100%;margin-top:4px;">
                Sign In
              </button>
            </form>
          `}

          <!-- Demo accounts (collapsible) -->
          <details style="margin-top:var(--s5);border-top:1px solid rgba(0,0,0,.08);padding-top:var(--s4);" ${!isLoggedIn ? '' : 'open'}>
            <summary style="font-size:12.5px;color:var(--ink-soft);cursor:pointer;user-select:none;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-1px;margin-right:4px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Demo accounts (for testing)
            </summary>
            <div style="margin-top:var(--s3);">
              <div class="auth-section-title">Participants</div>
              <div class="auth-user-grid">
                ${users.filter(u => u.role === "participant").map(u => `
                  <div class="auth-user-card ${curr.id === u.id && !isLiveUser ? 'active-user' : ''}" onclick="window.MOCK.selectUser('${u.id}')">
                    <span class="card-av">${u.initials}</span>
                    <span class="card-details">
                      <span class="card-name">${u.name}</span>
                      <span class="card-role">${u.team_name}</span>
                    </span>
                  </div>
                `).join("")}
              </div>
              <div class="auth-section-title">Admin / Faculty</div>
              <div class="auth-user-grid">
                ${users.filter(u => ["admin","mentor","panel","trainer"].includes(u.role)).map(u => `
                  <div class="auth-user-card ${curr.id === u.id && !isLiveUser ? 'active-user' : ''}" onclick="window.MOCK.selectUser('${u.id}')">
                    <span class="card-av" style="background:${u.role==='admin'?'#c62828':u.role==='mentor'?'#5e35b1':u.role==='panel'?'#e65100':'#2e7d32'}">${u.initials}</span>
                    <span class="card-details">
                      <span class="card-name">${u.name}</span>
                      <span class="card-role">${u.role_label}</span>
                    </span>
                  </div>
                `).join("")}
              </div>
              <div class="auth-signout-row" style="margin-top:var(--s3);">
                <button class="btn secondary" style="font-size:12px;padding:5px 12px;width:100%;" onclick="window.MOCK.signOutUser()">
                  Sign Out (Guest Mode)
                </button>
              </div>
            </div>
          </details>

        </div>
      </div>
    `;

    modal.onclick = (e) => {
      if (e.target === modal) window.MOCK.closeAuthModal();
    };
  }

  function updateAuthChrome() {
    const user = getEffectiveUser();
    const isLive = !!_liveUser;

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
    if ((!user || user.role === "guest") && !_liveUser) {
        authArea.innerHTML = `
          <button type="button" class="util-login" onclick="window.MOCK.openAuthModal()" style="cursor:pointer; background:none; color:inherit; font:inherit;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px;vertical-align:-1px;margin-right:4px;"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
            Sign In
          </button>
        `;
      } else {
        const displayName = isLive ? (user.full_name || user.email) : user.name;
        const badgeLabel = user.role === "participant" ? (user.team_name || user.team_id || 'Participant') : (user.role_label || user.role);
        const initials = user.initials || displayName.charAt(0).toUpperCase();
        authArea.innerHTML = `
          <div class="util-user-pill" onclick="window.MOCK.openAuthModal()" title="Logged in as ${displayName} (${badgeLabel}). Click to manage account.">
            <span class="util-user-av">${initials}</span>
            <span class="util-user-name">${displayName}</span>
            <span class="util-user-role">${badgeLabel}</span>
          </div>
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
    if ((!user || user.role === "guest") && !_liveUser) {
      qs.innerHTML = `
        <span class="quick-switcher-av" style="background:#546e7a; color:#fff">🔒</span>
        <span class="quick-switcher-txt">Guest (Logged Out)</span>
        <span class="quick-switcher-tag">Sign In</span>
      `;
      qs.title = "Current: Guest (public). Click to sign in.";
    } else {
      const displayName = isLive ? (user.full_name || user.email) : user.name;
      const label = user.role === "participant" ? (user.team_name || user.team_id || 'Participant') : (user.role_label || user.role);
      const initials = user.initials || displayName.charAt(0).toUpperCase();
      qs.innerHTML = `
        <span class="quick-switcher-av">${initials}</span>
        <span class="quick-switcher-txt">${displayName}</span>
        <span class="quick-switcher-tag">${label}</span>
      `;
      qs.title = `Signed in: ${displayName} (${label}). Click to manage account.`;
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
    // If there's a live Supabase user, sign them out first
    if (_liveUser && window.STEP_SUPABASE) {
      window.STEP_SUPABASE.signOut();
      _liveUser = null;
    }
    auth.setCurrentUser(userId);
    closeAuthModal();
    updateAuthChrome();
  }

  function signOutUser() {
    if (_liveUser && window.STEP_SUPABASE) {
      window.STEP_SUPABASE.signOut();
      _liveUser = null;
    }
    auth.logout();
    closeAuthModal();
    updateAuthChrome();
  }

  /* ── Real Supabase sign-in handler ── */
  async function _doSignIn(e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const errBox = document.getElementById("login-error");
    const btn = document.getElementById("login-submit-btn");

    if (!email || !password) return;

    // Show loading state
    btn.disabled = true;
    btn.textContent = "Signing in…";
    if (errBox) { errBox.style.display = "none"; errBox.textContent = ""; }

    if (!window.STEP_SUPABASE || !window.STEP_SUPABASE.isOnline()) {
      if (errBox) { errBox.textContent = "Supabase is not configured. Use a demo account below instead."; errBox.style.display = "block"; }
      btn.disabled = false; btn.textContent = "Sign In";
      return;
    }

    try {
      console.log('[STEP] Attempting sign-in for:', email);
      const { data, error } = await window.STEP_SUPABASE.signIn(email, password);
      console.log('[STEP] Sign-in result:', { data, error });

      if (error) {
        console.error('[STEP] Sign-in error:', error);
        if (errBox) { errBox.textContent = error.message || "Sign in failed. Check your email and password."; errBox.style.display = "block"; }
        btn.disabled = false; btn.textContent = "Sign In";
        return;
      }

      // Success — fetch profile and set as live user
      if (data && data.user) {
        console.log('[STEP] Auth user:', data.user.id, data.user.email);
        let profile = null;
        try {
          profile = await window.STEP_SUPABASE.fetchProfile(data.user.id);
          console.log('[STEP] Profile fetched:', profile);
        } catch (profileErr) {
          console.warn('[STEP] Profile fetch failed:', profileErr);
        }

        if (profile) {
          _liveUser = {
            ...profile,
            name: profile.full_name || profile.email || email,
            team_name: profile.team_id ? (window.MOCK.groups.find(g => g.id === profile.team_id) || {}).name || profile.team_id : null
          };
        } else {
          // Profile not found (RLS issue or not created yet) — use basic info from auth
          _liveUser = {
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.email.split('@')[0],
            name: data.user.email.split('@')[0],
            initials: data.user.email.substring(0, 2).toUpperCase(),
            role: 'authenticated',
            role_label: 'Signed In',
            team_id: null,
            team_name: null
          };
          console.warn('[STEP] No profile found for user, using basic auth info.');
        }

        console.log('[STEP] Live user set:', _liveUser);
        closeAuthModal();
        updateAuthChrome();
        window.dispatchEvent(new CustomEvent("stephub_auth_changed", { detail: { user: _liveUser } }));
      } else {
        if (errBox) { errBox.textContent = "Sign in succeeded but no user data returned. Please try again."; errBox.style.display = "block"; }
        btn.disabled = false; btn.textContent = "Sign In";
      }
    } catch (err) {
      console.error('[STEP] Sign-in exception:', err);
      if (errBox) { errBox.textContent = "Network error: " + (err.message || "Could not reach the server."); errBox.style.display = "block"; }
      btn.disabled = false; btn.textContent = "Sign In";
    }
  }

  /* ── Real Supabase sign-out handler ── */
  async function _doSignOut() {
    if (window.STEP_SUPABASE) {
      await window.STEP_SUPABASE.signOut();
    }
    _liveUser = null;
    auth.logout();
    closeAuthModal();
    updateAuthChrome();
    window.dispatchEvent(new CustomEvent("stephub_auth_changed", { detail: { user: null } }));
  }

  // Auto-init on page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      updateAuthChrome();
      _checkExistingSession();
    });
  } else {
    setTimeout(() => {
      updateAuthChrome();
      _checkExistingSession();
    }, 10);
  }

  /** Check if there's an existing Supabase session (e.g. page reload) */
  async function _checkExistingSession() {
    if (!window.STEP_SUPABASE || !window.STEP_SUPABASE.isOnline()) return;
    try {
      const profile = await window.STEP_SUPABASE.getCurrentUser();
      if (profile) {
        _liveUser = {
          ...profile,
          name: profile.full_name || profile.email,
          team_name: profile.team_id ? (window.MOCK.groups.find(g => g.id === profile.team_id) || {}).name || profile.team_id : null
        };
        updateAuthChrome();
        window.dispatchEvent(new CustomEvent("stephub_auth_changed", { detail: { user: _liveUser } }));
      }
    } catch (err) {
      console.warn("[STEP] Session check failed:", err);
    }
  }

  window.addEventListener("stephub_auth_changed", () => {
    updateAuthChrome();
  });

  // ── Return the public API ──
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
    get teamWork() { return getTeamWork(); },
    get capstone() { return getCapstone(); },
    openAuthModal,
    closeAuthModal,
    selectUser,
    signOutUser,
    _doSignIn,
    _doSignOut,
    updateAuthChrome
  };
})();
