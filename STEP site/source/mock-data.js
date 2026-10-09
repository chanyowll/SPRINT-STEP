/* =====================================================================
   STEP Hub — shared data for the STEP 2.5 cohort.
   The weeks, dates and topics come from schedule-data.js (the STEP 2.5
   Master Tracker); the team-level sample numbers below only answer the
   offline preview (?demo=1).
   Includes official STEP Groups, Faculty, Predefined Demo Users,
   RBAC permission models, and dynamic team dashboards.
   ===================================================================== */
window.MOCK = (function () {
  const SCHED = window.STEP_SCHEDULE;
  const NOW_AT = SCHED.current(new Date());          // where the program is today
  const cohort = Object.assign({}, SCHED.cohort, { current_week: NOW_AT.week });

  /* ---------------------------------------------------------------------
     STEP Groups / Teams — the 10 official teams in SPRINT-STEP.
     --------------------------------------------------------------------- */
  const groups = [
    { id: "g1", name: "POSTE (USC)", short: "POSTE", abbr: "USC", logo: "assets/logos/wm/usc.png", mark: "assets/logos/sm/usc.png",
      institution: "University of San Carlos", city: "Cebu City", region: "Visayas",
      about: "POSTE (Interconnected Poste Kits for Environmental Sensing)",
      technology_title: "Interconnected Poste Kits for Environmental Sensing",
      implementing_agency: "University of San Carlos",
      mentor_id: "mn1", mentor_name: "Dr. Jon Fernandez", panel_letter: "A",
      initials: "PO", accent: "hsl(206 56% 56%)", glow: "hsla(206, 56%, 56%, .30)", is_public: true },

    { id: "g2", name: "SINAG (USM)", short: "SINAG", abbr: "USM", logo: "assets/logos/wm/usm.png", mark: "assets/logos/sm/usm.png",
      institution: "University of Southern Mindanao", city: "Kabacan, Cotabato", region: "Mindanao",
      about: "Optimization of Irrigation Flow through Conduit Micro Hydropower to Generate Electricity for Off-grid Barangay of Kabacan, Cotabato (SINAG)",
      technology_title: "Conduit micro hydropower utilizing irrigation canal flow for off-grid communities",
      implementing_agency: "University of Southern Mindanao",
      mentor_id: "mn2", mentor_name: "Dr. John Lagdameo", panel_letter: "A",
      initials: "SI", accent: "hsl(196 56% 56%)", glow: "hsla(196, 56%, 56%, .30)", is_public: true },

    { id: "g3", name: "BRICKS (USC)", short: "BRICKS", abbr: "USC", logo: "assets/logos/wm/usc.png", mark: "assets/logos/sm/usc.png",
      institution: "University of San Carlos", city: "Cebu City", region: "Visayas",
      about: "Conversion of Quarry Waste (Silt) Into High Temperature Refractory Bricks",
      technology_title: "High-temperature refractory bricks synthesized from quarry silt waste",
      implementing_agency: "University of San Carlos",
      mentor_id: "mn3", mentor_name: "Mr. Bienvenido Garcia", panel_letter: "A",
      initials: "BR", accent: "hsl(186 56% 56%)", glow: "hsla(186, 56%, 56%, .30)", is_public: true },

    { id: "g4", name: "Halal Blockchain (USEP)", short: "Halal Blockchain", abbr: "USeP", logo: "assets/logos/wm/usep.png", mark: "assets/logos/sm/usep.png",
      institution: "University of Southeastern Philippines", city: "Davao City", region: "Mindanao",
      about: "Blockchain-Based Novel System/Application for Transparent Traceability of Halal-and-Tayeb Cacao Products",
      technology_title: "Distributed ledger traceability platform for farm-to-table Halal cacao certification",
      implementing_agency: "University of Southeastern Philippines",
      mentor_id: "mn4", mentor_name: "Mr. Michael Tan", panel_letter: "A",
      initials: "HB", accent: "hsl(172 56% 56%)", glow: "hsla(172, 56%, 56%, .30)", is_public: true },

    { id: "g5", name: "Zeoskin (SLU)", short: "Zeoskin", abbr: "SLU", logo: "assets/logos/wm/slu.png", mark: "assets/logos/sm/slu.png",
      institution: "Saint Louis University", city: "Baguio City", region: "Luzon",
      about: "ZEOSKIN: A Green Indoor Air Filter",
      technology_title: "Natural zeolite-enhanced breathable bio-composite filter for indoor air quality",
      implementing_agency: "Saint Louis University",
      mentor_id: "mn5", mentor_name: "Mr. Armando Miclat", panel_letter: "B",
      initials: "ZS", accent: "hsl(158 56% 56%)", glow: "hsla(158, 56%, 56%, .30)", is_public: true },

    { id: "g6", name: "CAPPS (MSU IIT)", short: "CAPPS", abbr: "MSU-IIT", logo: "assets/logos/wm/msu-iit.png", mark: "assets/logos/sm/msu-iit.png",
      institution: "Mindanao State University – Iligan Institute of Technology", city: "Iligan City", region: "Mindanao",
      about: "CAPPS: Development of Alternative Ceramic Armor Plates from Philippine Silicates for Philippine Armed Personnel",
      technology_title: "Ballistic-grade ceramic armor insert plates synthesized from domestic silicates",
      implementing_agency: "Mindanao State University – Iligan Institute of Technology",
      mentor_id: "mn6", mentor_name: "Mr. George Quitoriano", panel_letter: "B",
      initials: "CA", accent: "hsl(142 56% 56%)", glow: "hsla(142, 56%, 56%, .30)", is_public: true },

    { id: "g7", name: "SPArC (MSU IIT)", short: "SPArC", abbr: "MSU-IIT", logo: "assets/logos/wm/msu-iit.png", mark: "assets/logos/sm/msu-iit.png",
      institution: "Mindanao State University – Iligan Institute of Technology", city: "Iligan City", region: "Mindanao",
      about: "Synergy in Solid Fuel Production from Agri-Industrial Biomass for Boiler Combustion (SPArC)",
      technology_title: "Densified high-calorific solid biofuel pellets from agricultural waste for industrial boilers",
      implementing_agency: "Mindanao State University – Iligan Institute of Technology",
      mentor_id: "mn7", mentor_name: "Engr. Benjamin N. Mirasol", panel_letter: "B",
      initials: "SP", accent: "hsl(118 56% 56%)", glow: "hsla(118, 56%, 56%, .30)", is_public: true },

    { id: "g8", name: "meSHM (DLSU)", short: "meSHM", abbr: "DLSU", logo: "assets/logos/wm/dlsu.png", mark: "assets/logos/sm/dlsu.png",
      institution: "De La Salle University", city: "Manila", region: "Luzon",
      about: "Intelligent Structural Health Monitoring via Mesh of Tremor Sensors (meSHM)",
      technology_title: "Wireless sensor mesh for rapid post-earthquake structural integrity assessment",
      implementing_agency: "De La Salle University",
      mentor_id: "mn8", mentor_name: "Ms. Janine Chiong", panel_letter: "C",
      initials: "MS", accent: "hsl(92 56% 56%)", glow: "hsla(92, 56%, 56%, .30)", is_public: true },

    { id: "g9", name: "SFRSCC (FEU Tech)", short: "SFRSCC", abbr: "FEU Tech", logo: "assets/logos/wm/feu-tech.png", mark: "assets/logos/sm/feu-tech.png",
      institution: "Far Eastern University – Institute of Technology", city: "Manila", region: "Luzon",
      about: "Development of Fiber-Reinforced Self-Compacting Concrete (SFRSCC) for corrosion reduction",
      technology_title: "Corrosion-inhibiting fiber-reinforced self-compacting concrete for coastal structures",
      implementing_agency: "FEU Institute of Technology",
      mentor_id: "mn9", mentor_name: "Ms. Bunnie De Guzman", panel_letter: "C",
      initials: "SF", accent: "hsl(62 56% 56%)", glow: "hsla(62, 56%, 56%, .30)", is_public: true },

    { id: "g10", name: "LASER (DOST PNRI)", short: "LASER", abbr: "DOST-PNRI", logo: "assets/logos/wm/dost-pnri.png", mark: "assets/logos/sm/dost-pnri.png",
      institution: "Department of Science and Technology – Philippine Nuclear Research Institute", city: "Quezon City", region: "Luzon",
      about: "Luzon Arsenic Source Tracing and Extent Mapping with Risk Mitigation and Engineering Intervention (LASER)",
      technology_title: "Isotopic tracing and point-of-use adsorbent cartridges for groundwater arsenic remediation",
      implementing_agency: "DOST - Philippine Nuclear Research Institute",
      mentor_id: "mn10", mentor_name: "Mr. Tony Feria", panel_letter: "C",
      initials: "LA", accent: "hsl(38 56% 56%)", glow: "hsla(38, 56%, 56%, .30)", is_public: true },
  ];

  // Aliased for unified usage
  const teams = groups;

  /* ---------------------------------------------------------------------
     Program weeks (W0–W12) & sessions
     --------------------------------------------------------------------- */
  /* one entry per program week, W0–W12 — the same rows as the modules
     table in the database */
  const modules = SCHED.weeks.map(w => ({
    code: w.code, week_no: w.week, title: w.title, short: w.short,
    trainer: w.trainer || "Trainer to be announced",
  }));

  /* every dated session of the cycle, in calendar order */
  const sessions = SCHED.timeline().map((x, i) => ({
    id: "s" + (i + 1), type: x.kind, title: x.title, week_no: x.week, code: x.code,
    starts_at: x.date + "T09:00:00+08:00", mode: x.mode, status: "scheduled",
    is_public: x.kind === "onsite" || x.kind === "orientation",
  }));

  const announcements = [];          // the real ones live in the announcements table

  /* Panel score sheets, one per feedback session. W3 beachhead, W4
     competitive advantage, W5 business model validation, W6 finance
     (presented at the checkpoint), W7 go-to-market and W12 Demo Day carry
     over the STEP 2 sheets for the same topic (criteria and weights
     unchanged). W2 market mapping, W8 selling, W9 pitching, W10 technology
     roadmapping and W11 the FASTRAC proposal are STEP 2.5 sheets written
     from each week's stated outputs; weights add to 100. */
  const SCORE_SHEETS = {
      W2: [
          { label: "Has the group mapped the players in its technology’s ecosystem — suppliers, users, buyers, regulators, funders and competitors — and how value and money move between them?", weight: 30 },
          { label: "Has the group identified the vertical markets where the technology could be applied?", weight: 25 },
          { label: "Has the group identified the partners and gaps that matter most for reaching the market?", weight: 25 },
          { label: "How clearly did the five-minute video walk the panel through the map?", weight: 20 },
        ],
      W3: [
          { label: "Has the group identified 5 to 10 possible market opportunities?", weight: 25 },
          { label: "Has the group clearly prioritized these opportunities and identified a beachhead market?", weight: 25 },
          { label: "Has the group developed a clear and coherent Problem-Solution Fit Canvas for their beachhead segment?", weight: 25 },
          { label: "Has the group articulated a compelling Value Proposition Statement based on their Problem-Solution Fit Canvas?", weight: 25 },
        ],
      W4: [
          { label: "Has the group identified their Competitive Advantage using the Competitive Profile Matrix?", weight: 35 },
          { label: "Is this sustainable? (VRIO)", weight: 35 },
          { label: "How was the group's Lean Canvas Model?", weight: 30 },
        ],
      W5: [
          { label: "Has the group refined their Lean Canvas?", weight: 35 },
          { label: "How's the group transitioned their Business Model Canvas from startup to scale-up?", weight: 35 },
          { label: "Has the group reconfigured their Go-to-Market Gantt Chart for the weeks up to Demo Day, in preparation for their final pitch?", weight: 30 },
        ],
      W6: [
          { label: "Ratio Interpretation and Application", weight: 25, hint: "Assess the accuracy and relevance of the financial ratios presented (e.g., liquidity, profitability, efficiency). Consider how well the presenters interpret the results and connect them to the financial health and operational performance of the business." },
          { label: "Capital Budgeting Analysis", weight: 25, hint: "Review the clarity and correctness of capital budgeting calculations such as Payback Period and Internal Rate of Return (IRR). Examine whether the evaluation of investment feasibility is well-reasoned and aligned with the startup’s strategic goals." },
          { label: "Cost-Benefit and Breakeven Analysis", weight: 25, hint: "Assess how effectively the cost-benefit analysis and breakeven points are calculated and explained. Consider whether the presenters clearly demonstrate the relationship between costs, revenues, and profitability thresholds." },
          { label: "Analytical Reasoning and Financial Insight", weight: 25, hint: "Evaluate the depth of financial insight and analytical thinking reflected in the overall output. Consider how well the team uses data to draw conclusions, support decision-making, and reflect on the financial viability of the venture." },
        ],
      W7: [
          { label: "How well did the team develop their Strategy Canvas?", weight: 25 },
          { label: "How complete and coherent was the Lean Canvas?", weight: 25 },
          { label: "How effectively did the team identify, prioritize, and justify their chosen channels for reaching the target market (Bullseye Framework)?", weight: 25 },
          { label: "How clear, feasible, and well-structured was the team’s Go-to-Market Gantt Chart?", weight: 25 },
        ],
      W8: [
          { label: "Did the team open with the customer’s problem rather than with the technology?", weight: 20 },
          { label: "Did the team ask and listen — drawing out how the customer handles the problem today and what it costs them?", weight: 20 },
          { label: "Did the team show the value in the customer’s own numbers (the quantified value proposition)?", weight: 25 },
          { label: "How well did the team handle the objections raised — price, risk, switching?", weight: 20 },
          { label: "Did the team ask for a concrete next step — a trial, a visit or a letter of intent?", weight: 15 },
        ],
      W9: [
          { label: "Structure — problem, solution, market, business model and evidence, ask: all present and in a logical order?", weight: 25 },
          { label: "Delivery — within five minutes, confident, and understandable to a non-specialist?", weight: 25 },
          { label: "Evidence — are the claims backed by the work of the earlier weeks (beachhead, competition, validation)?", weight: 20 },
          { label: "The ask — specific, justified, and tied to what it will achieve?", weight: 15 },
          { label: "Questions — did the team answer the panel directly, without losing the thread?", weight: 15 },
        ],
      W10: [
          { label: "Has the team stated the technology’s current readiness level honestly, and the level the market needs?", weight: 25 },
          { label: "Are the milestones in between clear — prototype, pilot, certification, first production?", weight: 25 },
          { label: "Does each milestone carry a realistic timing and cost?", weight: 20 },
          { label: "Are the risks on the way identified, with an owner for each?", weight: 15 },
          { label: "Does the roadmap line up with the go-to-market plan and the financial projection?", weight: 15 },
        ],
      W11: [
          { label: "Project profile and the case — complete, consistent, and drawn from the team’s earlier outputs?", weight: 20 },
          { label: "Market and commercial viability — beachhead, competition, channels and a sales forecast a reviewer can follow?", weight: 20 },
          { label: "The plan — methodology, technology roadmap, expected outputs and outcomes, clearly laid out?", weight: 20 },
          { label: "Resources and budget — people, equipment and money by year, justified?", weight: 20 },
          { label: "Readiness — how close is the draft to a proposal DOST could receive as it stands?", weight: 20 },
        ],
      W12: [
          { label: "Market Opportunity", weight: 20, hint: "Market Potential or Market Size & Opportunity (Highlights scope, growth potential, and demand.)" },
          { label: "Financial Viability", weight: 20, hint: "Financial Sustainability or Business Viability (Focuses on revenue model, cost structure, and path to profitability.)" },
          { label: "Customer Understanding and Business Model", weight: 10, hint: "Customer Insight & Business Model (Emphasizes clarity of customer needs and how the business delivers value.)" },
          { label: "Pitching and Selling Skills", weight: 10, hint: "Pitch Delivery & Persuasion or Communication & Selling Ability (Captures clarity, confidence, storytelling, and salesmanship.)" },
          { label: "Team Composition", weight: 10, hint: "Team Strength or Team Capability (Assesses skill diversity, experience, commitment, and execution capacity.)" },
          { label: "Potential adopter/Nearness to commercialization", weight: 30, hint: "Readiness for Adoption or Market Entry (Evaluates the product’s maturity, user validation, adaptability, and potential for real-world implementation or commercialization.)" },
        ],
  };

  /* ---------------------------------------------------------------------
     Trainers, Mentors and Panelists (Faculty)
     --------------------------------------------------------------------- */
  const faculty = {
    scale: [
      { grade: "Excellent", value: "4.00" }, { grade: "Good", value: "3.00" },
      { grade: "Fair", value: "2.00" }, { grade: "Poor", value: "1.00" },
    ],
    scaleNote: "Decimals allowed to one place — 3.7, 2.6 and so on.",

    /* The STEP 2.5 trainers, from the Master Tracker. Which topic each one
       takes is not assigned yet, so every topic reads "Trainer to be
       announced" until it is. */
    trainers: [
      { id: "tr1", name: "Mr. Antonio P. Feria Jr.", short: "Sir Tony", initials: "AF", org: "Ateneo de Manila University",
        focus: "Beachhead market and customer segments", modules: ["W3"] },
      { id: "tr2", name: "Mr. George Omer Denis S. Quitoriano", short: "Sir GQ", initials: "GQ", org: "Ateneo de Manila University",
        focus: "Competitive advantage, go-to-market, selling and pitching", modules: ["W4", "W7", "W8", "W9"] },
      { id: "tr3", name: "Mr. Mike Tan", short: "Sir Mike", initials: "MT", org: "Ateneo de Manila University",
        focus: "Topics to be announced", modules: [] },
      { id: "tr4", name: "Engr. Benjamin N. Mirasol", short: "Sir Benjie", initials: "BM", org: "Ateneo de Manila University",
        focus: "Technology roadmapping", modules: ["W10"] },
      { id: "tr5", name: "Dr. Proceso “Jon” Fernandez", short: "Doc Jon", initials: "JF", org: "Ateneo de Manila University",
        focus: "Intellectual property, at the Mid-Program Checkpoint", modules: ["W6"] },
      { id: "tr6", name: "Mr. Steve Chavez", short: "Sir Steve", initials: "SC", org: "Ateneo de Manila University",
        focus: "FASTRAC proposal workshop", modules: ["W11"] },
    ],

    mentors: [
      { id: "mn1", name: "Dr. Jon Fernandez",          initials: "JF", team: "POSTE",            team_id: "g1",  day: "Wed", time: "14:00", zoom: "https://zoom.us/j/0000000001" },
      { id: "mn2", name: "Dr. John Lagdameo", initials: "JL", team: "SINAG",            team_id: "g2",  day: "Wed", time: "16:00", zoom: "https://zoom.us/j/0000000002" },
      { id: "mn3", name: "Mr. Bienvenido Garcia",           initials: "BG", team: "BRICKS",           team_id: "g3",  day: "Thu", time: "09:00", zoom: "https://zoom.us/j/0000000003" },
      { id: "mn4", name: "Mr. Michael Tan",              initials: "MT", team: "Halal Blockchain", team_id: "g4",  day: "Thu", time: "11:00", zoom: "https://zoom.us/j/0000000004" },
      { id: "mn5", name: "Mr. Armando Miclat",     initials: "AM", team: "Zeoskin",          team_id: "g5",  day: "Thu", time: "14:00", zoom: "https://zoom.us/j/0000000005" },
      { id: "mn6", name: "Mr. George Quitoriano",        initials: "GQ", team: "CAPPS",            team_id: "g6",  day: "Thu", time: "17:00", zoom: "https://zoom.us/j/0000000006" },
      { id: "mn7", name: "Engr. Benjamin N. Mirasol",                       initials: "BM", team: "SPArC",            team_id: "g7",  day: "Fri", time: "09:00", zoom: "https://zoom.us/j/0000000007" },
      { id: "mn8", name: "Ms. Janine Chiong",                       initials: "JC", team: "meSHM",            team_id: "g8",  day: "Fri", time: "10:30", zoom: "https://zoom.us/j/0000000008" },
      { id: "mn9", name: "Ms. Bunnie De Guzman",                      initials: "BD", team: "SFRSCC",           team_id: "g9",  day: "Fri", time: "13:00", zoom: "https://zoom.us/j/0000000009" },
      { id: "mn10", name: "Mr. Tony Feria",          initials: "TF", team: "LASER",            team_id: "g10", day: "Fri", time: "15:00", zoom: "https://zoom.us/j/0000000010" },
    ],
    mentorNote: "An hour and a half a week per team, Wednesday to Friday, at a time the team and mentor arrange between them.",
    /* The mentors' weekly accomplishment report — the planned activities
       each week, carried over word for word from the STEP 2 mentors'
       reports (Mentors Accomplishment Report folder). They are the targets
       every mentor reports against. `lead` rows are headings inside the
       table; **…** is printed bold, as on the original forms.
       Weeks 7 (IP) and 9 (financial analysis) had no STEP 2 report: their
       activities are drafted from the panel score sheet for that week and
       marked source: "scoresheet" until the team confirms them. */
    mentorReport: {
      title: "SPRINT-STEP MENTORS ACCOMPLISHMENTS REPORT",
      endorsedBy: "May Ann A. Udtojan-Albis", endorsedRole: "Project Leader",
    },
    /* One plan per program week (W1–W12). Where a STEP 2 mentors' report
       covered the same topic, its activities are carried over word for
       word. Weeks with a topic that is new in STEP 2.5 (W1, W2, W8, W10)
       are drafted from the schedule itself and marked source: "schedule";
       W11's activities are drafted from that week's panel score sheet. */
    mentorPlans: [
      { code: "W1", week: 1, topic: "Program Launch and Mentor Introduction", source: "schedule", tasks: [
        { text: "Meet the team at the program launch and agree on a regular weekly mentoring slot (Wednesday to Friday)." },
        { text: "Support the team in choosing the commercialization pathway they will test first." },
      ] },
      { code: "W2", week: 2, topic: SCHED.byWeek(2).title, source: "schedule", tasks: [
        { text: "Guide the team in mapping the ecosystem around their technology — suppliers, users, buyers, regulators, funders and competitors." },
        { text: "Help the team list the vertical markets where their technology could be applied." },
        { text: "Help the team identify the partners and gaps that matter most for reaching the market." },
      ] },
      { code: "W3", week: 3, topic: SCHED.byWeek(3).title, tasks: [
        { text: "Guide the group in identifying 5 to 10 possible market opportunities." },
        { text: "Support the group in prioritizing these opportunities and identifying a beachhead market." },
        { text: "Help the group develop a clear and coherent Problem-Solution Fit Canvas for their beachhead segment." },
        { text: "Assist the group in articulating a compelling Value Proposition Statement based on their Problem-Solution Fit Canvas." },
      ] },
      { code: "W4", week: 4, topic: SCHED.byWeek(4).title, tasks: [
        { text: "Assist the team in\n(a) continuing to identify/ideate on feasible market opportunities for their technology\n(b) evaluating and assessing these candidates, and\n(c) finally settling on a viable, realistic, and strong beachhead opportunity." },
        { text: "Help the team evaluate the realism of their TAM/SAM/SOM analysis **for their beachhead market**, including the logic/soundness of their market estimates. Encourage them to consider current and emerging market trends that could affect their opportunity sizing." },
        { text: "Help the team evaluate the realism of their TAM/SAM/SOM analysis **for their other candidate market opportunities** (which they could attack after success in their beachhead market), including the logic/soundness of their market estimates. Encourage them to consider current and emerging market trends that could affect their opportunity sizing." },
      ] },
      { code: "W5", week: 5, topic: SCHED.byWeek(5).title,
        topicLines: ["1. Understanding your Product's Full Life Cycle Use Case", "2. Developing your High-Level Product Specification", "3. Quantifying Your Value Proposition"],
        tasks: [
        { text: "Help the team to detail their product’s full life cycle use case" },
        { text: "Guide the team in creating their customer pitch either using a concept board or a brochure." },
        { text: "For the teams' product/technology, help them:\n- Identify 2–3 relevant metrics for their customer\n- Estimate baseline vs. improvement\n- Calculate $ or % benefit\n- Draft a one-sentence Quantified Value Proposition" },
      ] },
      { code: "W6", week: 6, topic: SCHED.byWeek(6).title,
        topicLines: ["VRIO Analysis", "Competitor Profile matrix", "Conceptualize Value proposition"],
        tasks: [
        { text: "Help the group identify their Competitive Advantage using the Competitive Profile Matrix." },
        { text: "Guide the group in making their Competitive Advantage sustainable (VRIO)." },
        { text: "Help the group in creating their Lean Canvas Model." },
      ] },
      { code: "W7", week: 7, topic: SCHED.byWeek(7).title, tasks: [
        { text: "Help the team develop their Strategy Canvas" },
        { text: "Help the team complete their Lean Canvas" },
        { text: "Guide the group in creating their Bullseye Framework" },
        { text: "Guide the group in developing their Go-to-Market Gantt Chart" },
      ] },
      { code: "W8", week: 8, topic: SCHED.byWeek(8).title, source: "schedule", tasks: [
        { text: "Help the team position their venture in its ecosystem — partners, channels and competitors." },
        { text: "Guide the team in stating a market strategy that ties their beachhead, value proposition and go-to-market plan together." },
        { text: "Help the team prepare their technology review and refined pitch for the Mid-Program Checkpoint." },
      ] },
      { code: "CU", week: null, label: "Catch-up week", topic: "Catch Up Mentoring Session", tasks: [
        { text: "Meet with the team to catch up on the progress of their technology." },
      ] },
      { code: "W9", week: 9, topic: SCHED.byWeek(9).title, tasks: [
        { text: "Help the team refine their Lean Canvas" },
        { text: "Guide the group in transitioning their Business Model Canvas from startup to scale-up." },
        { text: "Assist the group in reconfiguring their Go-to-Market Gantt Chart for the weeks up to Demo Day" },
      ] },
      { code: "W10", week: 10, topic: SCHED.byWeek(10).title, source: "schedule", tasks: [
        { text: "Help the team estimate the costs and revenues behind their business model." },
        { text: "Guide the team in setting out their spin-off's roles, responsibilities and equity." },
        { text: "Help the team outline an IP strategy for their technology." },
      ] },
      { code: "W11", week: 11, topic: SCHED.byWeek(11).title, source: "scoresheet", tasks: [
        { text: "Guide the team in completing their Financial Analysis:", lead: true },
        { text: "Ratio interpretation and application — liquidity, profitability, efficiency" },
        { text: "Capital budgeting analysis — Payback Period and IRR" },
        { text: "Cost-benefit and breakeven analysis" },
        { text: "Analytical reasoning and financial insight drawn from the model" },
      ] },
      { code: "W12", week: 12, topic: "Preparation for Demo Day", tasks: [
        { text: "Provide guidance and support to the team as they prepare for their final pitch at the STEP Demo Day" },
      ] },
    ],

    /* Nine panel seats, three per panel — the STEP 2.5 panel list. The third
       seat on each panel is an industry panelist, named "Industry Panel 1–3"
       until the names are in. With a live project the names come from the
       panel_seats table (each seat tied to the panelist's email). */
    panels: [
      { letter: "A", seats: [1, 2, 3], panelists: ["Dr. Jon Fernandez", "Ms. Janine Chiong", "Industry Panel 1"],
        teams: [{ team: "POSTE", team_id: "g1", at: "09:00" }, { team: "SINAG", team_id: "g2", at: "09:35" },
                { team: "BRICKS", team_id: "g3", at: "10:10" }, { team: "Halal Blockchain", team_id: "g4", at: "10:45" }] },
      { letter: "B", seats: [4, 5, 6], panelists: ["Mr. George Quitoriano", "Mr. Bienvenido Garcia", "Industry Panel 2"],
        teams: [{ team: "Zeoskin", team_id: "g5", at: "09:00" }, { team: "CAPPS", team_id: "g6", at: "09:35" }, { team: "SPArC", team_id: "g7", at: "10:10" }] },
      { letter: "C", seats: [7, 8, 9], panelists: ["Mr. Tony Feria", "Engr. Benjamin N. Mirasol", "Industry Panel 3"],
        teams: [{ team: "meSHM", team_id: "g8", at: "09:00" }, { team: "SFRSCC", team_id: "g9", at: "09:35" }, { team: "LASER", team_id: "g10", at: "10:10" }] },
    ],

    /* The curriculum and the panel score sheets, one per program week.
       Titles, dates and modes come from the STEP 2.5 schedule. A week's
       score sheet carries over the STEP 2 criteria for the same topic, or
       a STEP 2.5 sheet for the new topics; every feedback session and the
       checkpoint has one. Demo Day (W12) uses the STEP 2 Demo Day sheet. */
    sessions: SCHED.weeks.map(w => ({
      code: w.code, week: w.week, title: w.title, short: w.short, topic: w.topic,
      tag: w.week === 12 ? "Demo Day" : undefined,
      trainer: w.trainer || "Trainer to be announced",
      mode: Array.from(new Set(w.sessions.filter(x => x.kind !== "holiday").map(x => x.mode))).join(" + "),
      coverage: w.sessions.map(x => SCHED.dayName(x.date).slice(0, 3) + (x.end ? "–" + SCHED.dayName(x.end).slice(0, 3) : "") + " " + SCHED.fmtRange(x.date, x.end) + " · " +
        ({ learning: x.adjusted ? "Adjusted learning session" : "Learning session", feedback: "Feedback session",
           orientation: "Online orientation", onsite: "On site", holiday: "Holiday" }[x.kind]) + ": " + x.title).join("\n"),
      deliverable: w.output || w.week === 12 ? w.produce : "—",
      assess: SCORE_SHEETS[w.code] || [],
      criteria_pending: !!w.output && !SCORE_SHEETS[w.code],
    })),
    /* every score sheet now belongs to a week (Demo Day is W12) */
    panelSheets: [],
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
    { id: "u_mentor_pfernandez", name: "Dr. Jon Fernandez", email: "pfernandez@ateneo.edu", role: "mentor", roles: ["mentor", "trainer", "panel"], role_label: "Mentor, Trainer & Panelist (POSTE)", assigned_teams: ["g1"], team_id: "g1", initials: "JF", institution: "AIPO" },
    { id: "u_mentor_jlagdameo", name: "Dr. John Lagdameo", email: "jlagdameo@ateneo.edu", role: "mentor", roles: ["mentor", "panel"], role_label: "Mentor & Panelist (SINAG)", assigned_teams: ["g2"], team_id: "g2", initials: "JL", institution: "AIPO" },
    { id: "u_mentor_bgarcia", name: "Mr. Bienvenido Garcia", email: "bgarcia@ateneo.edu", role: "mentor", roles: ["mentor", "panel"], role_label: "Mentor & Panelist (BRICKS)", assigned_teams: ["g3"], team_id: "g3", initials: "BG", institution: "AIPO" },
    { id: "u_mentor_mctan", name: "Mr. Michael Tan", email: "mctan@ateneo.edu", role: "mentor", roles: ["mentor", "trainer", "panel"], role_label: "Mentor, Trainer & Panelist (Halal Blockchain)", assigned_teams: ["g4"], team_id: "g4", initials: "MT", institution: "AIPO" },
    { id: "u_mentor_amiclat", name: "Mr. Armando Miclat", email: "amiclat@ateneo.edu", role: "mentor", role_label: "Mentor (Zeoskin)", assigned_teams: ["g5"], team_id: "g5", initials: "AM", institution: "AIPO" },
    { id: "u_mentor_gquitoriano", name: "Mr. George Quitoriano", email: "gquitoriano@ateneo.edu", role: "mentor", roles: ["mentor", "trainer", "panel"], role_label: "Mentor, Trainer & Panelist (CAPPS)", assigned_teams: ["g6"], team_id: "g6", initials: "GQ", institution: "AIPO" },
    { id: "u_mentor_bmirasol", name: "Engr. Benjamin N. Mirasol", email: "bmirasol@ateneo.edu", role: "mentor", roles: ["mentor", "trainer", "panel"], role_label: "Mentor, Trainer & Panelist (SPArC)", assigned_teams: ["g7"], team_id: "g7", initials: "BM", institution: "AIPO" },
    { id: "u_mentor_jchiong", name: "Ms. Janine Chiong", email: "jchiong@ateneo.edu", role: "mentor", roles: ["mentor", "panel"], role_label: "Mentor & Panelist (meSHM)", assigned_teams: ["g8"], team_id: "g8", initials: "JC", institution: "AIPO" },
    { id: "u_mentor_mcbdeguzman", name: "Ms. Bunnie De Guzman", email: "mcbdeguzman@ateneo.edu", role: "mentor", roles: ["mentor", "panel"], role_label: "Mentor & Panelist (SFRSCC)", assigned_teams: ["g9"], team_id: "g9", initials: "BD", institution: "AIPO" },
    { id: "u_mentor_aferia", name: "Mr. Tony Feria", email: "aferia@ateneo.edu", role: "mentor", roles: ["mentor", "trainer", "panel"], role_label: "Mentor, Trainer & Panelist (LASER)", assigned_teams: ["g10"], team_id: "g10", initials: "TF", institution: "AIPO" },

    // --- Trainers ---
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
      /* The sample accounts are for building the site only. On the real site
         a visitor is a guest until they sign in with their own account;
         the samples answer only when the page is opened with ?demo=1. */
      const demoOn = typeof location !== "undefined" && /[?&]demo=1(&|$)/.test(location.search || "");
      const storedId = demoOn ? auth._get(auth.KEY) : "guest";
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

    /* Every role a person holds. One account may be given more than one
       — a mentor who also sits on a panel, say — by setting `roles` on
       their profile. With nothing set, they hold exactly the one role in
       `role`: access is never inferred from a neighbouring role. */
    rolesOf(user) {
      const u = user || auth.getCurrentUser();
      if (!u) return [];
      const list = Array.isArray(u.roles) && u.roles.length ? u.roles : [u.role];
      return list.filter(Boolean).map(r => String(r).trim().toLowerCase());
    },

    /* The faculty portal holds three separate pages. Each answers to its
       own role and nothing else; an admin sees all three. */
    canView(view, user) {
      const u = user || auth.getCurrentUser();
      if (!u) return false;
      const roles = auth.rolesOf(u);
      if (roles.includes("admin")) return true;
      const NEEDS = { trainers: "trainer", mentors: "mentor", panel: "panel" };
      return !!NEEDS[view] && roles.includes(NEEDS[view]);
    },

    /* Which of the three a person may open, in page order. */
    viewsFor(user) {
      return ["trainers", "mentors", "panel"].filter(v => auth.canView(v, user));
    },

    canAccess(route, user) {
      const u = user || auth.getCurrentUser();
      if (!u || u.role === "guest") {
        // Public routes — accessible without login
        return ["home", "program", "groups"].includes(route);
      }

      // ── Public routes — always accessible to logged-in users
      if (["home", "program", "groups"].includes(route)) return true;

      // ── This Week and STEP GC — all authenticated users
      if (route === "week" || route === "gc") return true;

      // ── My Team's Work — all authenticated users
      if (route === "myteam") return true;

      // ── Capstone — all authenticated users
      if (route === "capstone") return true;

      // ── Trainers / Mentors / Panel — each answers to its own role
      if (route === "trainers") {
        return auth.viewsFor(u).length > 0;
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
      /* facilitators work alongside a few teams without being members of them */
      if (u.role === "facilitator") {
        return Array.isArray(u.teams) ? u.teams.slice() : [];
      }
      if (u.role === "mentor" || u.role === "panel") {
        /* a live Supabase profile has no assigned_teams column yet, so a
           signed-in mentor or panelist can reach every team until those
           assignments exist in the database */
        if (Array.isArray(u.assigned_teams)) return u.assigned_teams;
        if (u.role === "mentor" && u.team_id) return [u.team_id];
        return groups.map(g => g.id);
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

    /* the sample team's scored weeks: every week with a score sheet so far */
    const SCORED = ["W3", "W4", "W5", "W6", "W7"];
    const outputs = SCORED.map((c, i) => {
      const w = SCHED.byCode(c), fb = SCHED.feedbackOf(w.week);
      return { code: c, axis: w.axis, full: w.title, week: w.week, score: p.scores[i],
               panel: t.panel_letter, scored_on: fb ? fb.date : w.ends };
    });
    const DEMO_WEEK = 9;                       // the preview shows the cycle at Week 9

    const att_grid = {};
    p.members.forEach((m, idx) => {
      // 14 sessions attendance profile (W2–W8, learning and feedback)
      att_grid[m.initials] = [1, 1, 1, 1, (idx % 2 === 0 ? 1 : 0), 1, 1, 1, 1, 1, 1, 1, 1, 1];
    });

    const slug = t.short.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const subOf = n => {
      const w = SCHED.byWeek(n), o = outputs.find(x => x.week === n), due = SCHED.dueOf(n);
      const at = (h, m) => (due || w.starts).slice(0, 10) + "T" + String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":00+08:00";
      if (n === DEMO_WEEK) return { week: n, code: w.code, module: w.title, due, status: "open", files: [] };
      if (n === 5) return { week: n, code: w.code, module: w.title, due, status: "missing", files: [] };
      return { week: n, code: w.code, module: w.title, due, status: o ? "scored" : "submitted", score: o ? o.score : undefined,
        files: [{ kind: "video", name: `${slug}-w${n}.mp4`, size: (138 + n * 7) + " MB", at: at(9, 20 + n) },
                { kind: "slides", name: `${t.short}_W${n}.pdf`, size: (3 + n / 2).toFixed(1) + " MB", at: at(9, 30 + n) }] };
    };

    return {
      team_id: t.id,
      team_name: t.name,
      technology_title: t.technology_title,
      implementing_agency: t.implementing_agency,
      region: t.region,
      week_no: DEMO_WEEK,
      weeks_total: 12,
      members: p.members,
      outputs,
      sessions_held: [2, 3, 4, 5, 6, 7, 8].flatMap((w, i) => [
        { n: i * 2 + 1, label: "W" + w + " Learning" }, { n: i * 2 + 2, label: "W" + w + " Feedback" }]),
      attendance_grid: att_grid,
      submissions: [9, 8, 7, 6, 5, 4, 3, 2].map(subOf),
      trajectory: outputs.map(o => ({ week: o.week, code: o.code, score: o.score })),
      handin_kinds: [
        { key: "video", label: "Five-minute video" },
        { key: "slides", label: "Slide deck" },
        { key: "report", label: "Feedback application report" },
      ],
      handins: [2, 3, 4, 5, 6, 7, 8, 9].map(n => {
        const due = SCHED.dueOf(n), d = (due || SCHED.byWeek(n).starts).slice(0, 10);
        const ok = (h, m) => ({ state: "on_time", at: d + "T" + String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":00+08:00" });
        if (n === 9) return { week: n, code: "W9", due, video: { state: "open" }, slides: { state: "open" }, report: { state: "open" } };
        if (n === 5) return { week: n, code: "W5", due, video: ok(11, 31), slides: { state: "late", at: SCHED.addDays(d, 1) + "T08:15:00+08:00", late_days: 1 }, report: { state: "missed" } };
        return { week: n, code: "W" + n, due, video: ok(9, 10 + n), slides: ok(9, 20 + n), report: ok(20, 10) };
      }),
      insight: {
        method: "Reflexive thematic analysis — every panel and mentor comment coded, codes grouped into themes",
        claim: p.claim,
        based_on: 23, weeks: "Weeks 2–8", reviewed_by: "Ms. May Ann Albis, STEP team", reviewed_on: "2027-01-06",
        corpus: { comments: 23, panelists: 6, sessions: 7, codes: 9, themes: 4 },
        saturation: "No new code appeared after Week 7 — the code book has settled.",
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
          "Open the Week 9 pitch with the customer's pain point rather than technical specifications."
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
        week: 1, source: "Program Launch", status: "reviewed",
        value: {
          program: `STEP 2.5 Commercialization Program — ${t.name}`,
          title: `${t.name} — ${t.technology_title}`,
          leader: lead.name, sex: "M", months: "24",
          start: "2028-01-15", end: "2030-01-14",
          agency: `${t.implementing_agency}`,
          address: `${t.city}, ${t.region}, Philippines · contact@${t.abbr.toLowerCase().replace(/[^a-z]/g, '')}.edu.ph`
        }
      },
      { n: 2, group: "Project profile", title: "Cooperating agency/ies", kind: "prose",
        guide: "Agencies that support the project as collaborator, co-grantor, committed adopter of the resulting technology, or potential investor.",
        week: 1, source: "Program Launch", status: "reviewed",
        draft: `Local Government Unit of ${t.city} (committed adopter); Regional DOST Office (${t.region}); Industry Partners.`
      },
      { n: 3, group: "Project profile", title: "Site(s) of implementation", kind: "sites",
        guide: "Location/s where the project will be conducted.",
        week: 1, source: "Program Launch", status: "reviewed",
        value: [
          { country: "Philippines", region: t.region, province: t.city, district: "1st", municipality: t.city, barangay: "Poblacion" },
          { country: "Philippines", region: t.region, province: t.city, district: "2nd", municipality: t.city, barangay: "Industrial Zone" }
        ]
      },
      { n: 4, group: "Project profile", title: "Type of research", kind: "choice",
        guide: "Pre-commercialization — activities that bridge R&D and commercialization.",
        week: 1, source: "Program Launch", status: "reviewed",
        value: { precommercialization: true }
      },
      { n: 5, group: "Project profile", title: "R&D priority area, program and SDG", kind: "agenda",
        guide: "Which HNRDA agenda the project falls under and which SDGs it addresses.",
        week: 1, source: "Program Launch", status: "reviewed",
        value: { area: "Industry & Emerging Tech", commodity: t.short, priorityTopic: t.technology_title, sectorIndustry: "Manufacturing & Infrastructure", sectorBasic: "Applied Science", sdg: "SDG 9 (Industry, Innovation & Infrastructure) & SDG 11 (Sustainable Cities)" }
      },
      { n: 6, group: "The case", title: "Executive summary and startup background", kind: "prose",
        guide: "Briefly discusses what the proposal is about, founders, value proposition, and IP status.",
        week: 3, revisit: 11, source: "Beachhead Market & Customer Segments", status: "submitted", limit: 200,
        draft: `${t.name} is a university spin-off from ${t.implementing_agency} founded by ${lead.name} and research co-inventors. The team developed ${t.technology_title}. Field validation in ${t.city} demonstrates substantial cost reduction and operational advantage over imported solutions. IP protection includes a Philippine patent / utility model application. Grant funds will deploy industrial-scale pilot units across target partner sites.`
      },
      /* Item 7 has three parts on DOST Form 2 — 7.1 Rationale/Significance
         (max 300 words), 7.2 Scientific basis/Theoretical framework, and
         7.3 Objectives (General and Specific) — so it is filled part by part. */
      { n: 7, group: "The case", title: "Introduction — rationale, scientific basis, objectives", kind: "intro",
        guide: "Rationale, scientific framework, and general and specific objectives.",
        week: 11, source: "FASTRAC Proposal Workshop", status: "locked", limit: 300,
        value: { rationale: "", framework: "", general: "", specific: "" }
      },
      { n: 8, group: "The case", title: "Review of literature & Prior Art", kind: "prose",
        guide: "State of the art, prior art search, patent novelty, and freedom-to-operate.",
        week: 6, source: "Mid-Program Checkpoint: IP & Finance", status: "locked",
        draft: `Prior art search with IPOPHL confirmed no blocking patents in the Philippines for ${t.short}'s specialized formulation and architecture. Prototype validation completed successfully in 2026.`
      },
      { n: 9, group: "The case", title: "Marketing and commercial viability", kind: "prose",
        guide: "Competitor matrix, production requirements, target distribution, sales forecast.",
        week: 4, revisit: 7, source: "Competitive Advantage and Go-to-Market Plan", status: "draft",
        draft: `Target beachhead market consists of industrial and municipal clients in ${t.region}. Competitive analysis indicates ${t.name} delivers 35% cost savings with domestic fabrication and immediate technical support.`
      },
      { n: 10, group: "Plan", title: "Methodology", kind: "prose",
        guide: "Parameters measured, experimental procedure, scale-up strategy.",
        week: 5, source: "Business Model Validation", status: "draft",
        draft: `Phase 1 (Months 1–6): Pilot fabrication and QA calibration. Phase 2 (Months 7–18): Field deployment across 3 pilot sites in ${t.region}. Phase 3 (Months 19–24): Long-term durability and unit economics verification.`
      },
      { n: 11, group: "Plan", title: "Technology roadmap", kind: "prose",
        guide: "Milestones matching technology maturity to market validation.",
        week: 10, source: "Technology Roadmapping", status: "locked"
      },
      { n: 12, group: "Plan", title: "Expected outputs (6Ps)", kind: "prose",
        guide: "Publication, Patent, Product, People, Place/Partnership, Policy.",
        week: 11, source: "FASTRAC Proposal Workshop", status: "locked"
      },
      { n: 13, group: "Plan", title: "Potential outcomes", kind: "prose",
        guide: "Long-term results delivered 3 years after grant conclusion.",
        week: 5, source: "Business Model Validation", status: "submitted",
        draft: `Within three years: commercial deployment of ${t.short} across national facilities, generating sustained revenue, sustainable local manufacturing, and regional employment.`
      },
      { n: 14, group: "Plan", title: "Potential impacts (2Is)", kind: "prose",
        guide: "Social and economic impact dimensions.",
        week: 11, source: "FASTRAC Proposal Workshop", status: "locked"
      },
      { n: 15, group: "Plan", title: "Target beneficiaries", kind: "prose",
        guide: "Direct and indirect beneficiary groups.",
        week: 3, source: "Beachhead Market & Customer Segments", status: "reviewed",
        draft: `Direct: Partner cooperatives, LGUs, and industrial facilities in ${t.region}. Indirect: Surrounding communities benefiting from improved safety, resource efficiency, and local technology self-reliance.`
      },
      { n: 16, group: "Plan", title: "Sustainability plan", kind: "prose",
        guide: "Post-grant commercial viability and revenue model.",
        week: 6, source: "Mid-Program Checkpoint: IP & Finance", status: "locked",
        draft: `Revenue generated via equipment sales and service maintenance agreements. Registration as an approved DOST spin-off under the Philippine Innovative Startup Act.`
      },
      { n: 17, group: "Compliance", title: "Gender and Development (GAD) score", kind: "prose",
        guide: "GAD checklist score and gender equality integrations.",
        week: 11, source: "FASTRAC Proposal Workshop", status: "locked"
      },
      { n: 18, group: "Compliance", title: "Limitations of the project", kind: "prose",
        guide: "Constraints and boundary limits of the project.",
        week: 11, source: "FASTRAC Proposal Workshop", status: "locked"
      },
      { n: 19, group: "Compliance", title: "Risks, assumptions and risk management plan", kind: "prose",
        guide: "Key risks and mitigation measures.",
        week: 11, source: "FASTRAC Proposal Workshop", status: "locked"
      },
      { n: 20, group: "Compliance", title: "Literature cited", kind: "prose",
        guide: "Full bibliography and technical citations.",
        week: 11, source: "FASTRAC Proposal Workshop", status: "locked"
      },
      { n: 21, group: "Resources", title: "Personnel requirement", kind: "personnel",
        guide: "Team roles and percent time dedicated.",
        week: 1, source: "Program Launch: Team Formation", status: "locked",
        value: p.members.map((m, idx) => ({
          position: `${m.name} (${m.role})`,
          pct: idx === 0 ? "50" : "40",
          resp: idx === 0 ? "Overall Project Leadership & Technology Management" : "Technical Development & Deployment"
        }))
      },
      { n: 22, group: "Resources", title: "Budget by implementing agency", kind: "budget",
        guide: "Personnel Services, MOOE, and Equipment Outlay per year.",
        week: 6, source: "Mid-Program Checkpoint: IP & Finance", status: "locked",
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
        week: 11, source: "FASTRAC Proposal Workshop", status: "locked",
        value: { count: "", rows: [{ title: "", agency: "", role: "" }] }
      },
      { n: 24, group: "Attachments", title: "Other supporting documents", kind: "attachments",
        guide: "Counterpart letters, CVs, endorsement clearances.",
        week: 11, source: "Collected through the cycle", status: "draft",
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
      { n: 1,  title: t.name, sub: "Title and team", week: 1, source: "Program Launch", kind: "title", status: "in" },
      { n: 2,  title: "The problem", sub: `Unmet market pain addressed by ${t.short}`, week: 3, source: "Beachhead Market & Customer Segments", kind: "statement", status: "in", score: p.scores[0] },
      { n: 3,  title: "Beachhead market", sub: `Primary customers in ${t.region}`, week: 3, source: "Beachhead Market & Customer Segments", kind: "bullets", status: "in", score: p.scores[0] },
      { n: 4,  title: "Market size", sub: "TAM, SAM, SOM for the Philippines", week: 2, source: "Market Mapping Review", kind: "chart", status: "in", score: p.scores[1] },
      { n: 5,  title: "Value proposition", sub: "Measurable customer ROI and performance", week: 3, source: "Beachhead Market & Customer Segments", kind: "statement", status: "in", score: p.scores[2] },
      { n: 6,  title: "Competitive advantage", sub: "VRIO and Competitive Profile Matrix", week: 4, source: "Competitive Advantage", kind: "table", status: "in", score: p.scores[3] },
      { n: 7,  title: "Go-to-market", sub: "Distribution and customer acquisition plan", week: 7, source: "Go-to-Market & Lean Canvas", kind: "grid", status: "in", score: p.scores[4] },
      { n: 8,  title: "Validation evidence", sub: `Field trials and pilot testing in ${t.city}`, week: 5, source: "Business Model Validation", kind: "chart", status: "due" },
      { n: 9,  title: "Team and spin-off", sub: `${t.implementing_agency} commercialization team`, week: 1, source: "Program Launch: Team Formation", kind: "grid", status: "locked" },
      { n: 10, title: "IP strategy", sub: "Patents, utility models and trade secrets", week: 6, source: "Mid-Program Checkpoint: IP & Finance", kind: "bullets", status: "locked" },
      { n: 11, title: "Financial model", sub: "5-year projection, payback and unit economics", week: 6, source: "Mid-Program Checkpoint: IP & Finance", kind: "chart", status: "locked" },
      { n: 12, title: "The ask", sub: "DOST FASTRAC funding request and milestones", week: 11, source: "FASTRAC Proposal Workshop", kind: "statement", status: "locked" },
      { n: 13, title: "Technology roadmap", sub: "Scale-up timeline through 2030", week: 10, source: "Technology Roadmapping", kind: "timeline", status: "locked" },
      { n: 14, title: "Summary and contact", sub: `Connect with ${t.name}`, week: 12, source: "Demo Day", kind: "title", status: "locked" }
    ];

    return {
      team_id: t.id,
      team_name: t.name,
      technology_title: t.technology_title,
      week_no: 9,
      weeks_total: 12,
      demo_day: "2027-01-28",
      form,
      deck
    };
  }

  /* ---------------------------------------------------------------------
     This Week — the program week we are actually in, from the schedule.
     Before Oct 19 it is Week 0 (the orientation coming up); over the
     Christmas break it is Week 9, the week sessions resume.
     --------------------------------------------------------------------- */
  const WK = SCHED.byWeek(NOW_AT.week);
  const thisWeek = {
    week_no: WK.week, weeks_total: SCHED.cohort.weeks_total, code: WK.code,
    status: NOW_AT.status, note: NOW_AT.note,
    today: new Date().toISOString(),
    starts: WK.starts, ends: WK.ends,
    topic: {
      code: WK.code, week: WK.week, title: WK.title, short: WK.short, topic: WK.topic,
      tagline: WK.tagline, brief: WK.brief, able: WK.able, output: WK.produce,
      review: WK.review || "",
      /* sample files for the offline preview only — signed in, the list is
         whatever the trainer has really posted for this week */
      materials: WK.output ? [
        { name: "Week " + WK.week + " " + WK.short + " — slide deck", type: "PDF", size: "4.2 MB", by: "Trainer", at: (SCHED.learningOf(WK.week) || WK.sessions[0]).date + "T16:20:00+08:00" },
        { name: WK.short + " worksheet", type: "XLSX", size: "82 KB", by: "Trainer", at: (SCHED.learningOf(WK.week) || WK.sessions[0]).date + "T16:22:00+08:00" },
        { name: "Output template", type: "DOCX", pending: "Expected Friday" },
      ] : [],
    },
    days: SCHED.daysOf(WK.week),
    /* sample board for the offline preview; the live board is the
       announcements table */
    announcements: [
      { id: "wa", icon: "alert", pinned: true, priority: "important", title: "Week " + WK.week + " · " + WK.short,
        body: WK.tagline, by: "STEP Team", at: WK.starts + "T08:30:00+08:00", read: false },
    ],
    helpdesk: [],
    housekeeping: [
      { title: "How the panels work", note: "Five-minute video, twenty-five minutes of questions, three panelists." },
      { title: "Missed the session?", note: "Every learning session is recorded and posted the same afternoon." },
    ],
    game: WK.game,
  };

  const articles = [
    { slug: "step-3-kickoff", photo: "assets/photos/teams.jpg", kind: "article", title: "Ten research teams begin STEP 2.5",
      excerpt: "Teams from Luzon, the Visayas and Mindanao opened the cycle with a two-day kick-off at the Ateneo campus.",
      published_at: "2026-10-20", author: "AIPO Communications", read: "4 min read",
      tags: ["Program news"], cover_color: "#dfeefc" },
    { slug: "spinoff-policy-brief", photo: "assets/photos/panel.jpg", kind: "publication", title: "What slows down university spin-offs in the Philippines",
      excerpt: "Evidence from two STEP cycles on fairness opinion boards, licensing timelines and equity rules, with five recommendations for HEIs.",
      published_at: "2027-05-30", author: "AIPO Policy Team", venue: "AIPO Policy Brief", venue_from_date: true, read: "PDF · 18 pages",
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
    panelScores[g.id] = { W3: p.scores[0], W4: p.scores[1], W5: p.scores[2], W6: p.scores[3] };
  });

  const attendance = groups.map((g, i) => ({
    team_id: g.id, team_name: g.name,
    sessions_attended: [8, 8, 8, 7, 8, 8, 7, 8, 8, 8][i],
    sessions_total: 8,
    members_present_last: [5, 4, 5, 4, 4, 5, 4, 5, 4, 5][i],
    is_compliant: true,
  }));

  const submissions = [
    { assignment_id: "as1", assignment_title: "Week 6 Team Output · CPM & VRIO", assignment_type: "team_output", week_no: 6, due_at: "2026-11-27T12:00:00+08:00", team_id: "g1", status: "draft", timeliness: "pending", late_days: 0, score: null, max_points: 10 },
    { assignment_id: "as2", assignment_title: "Week 6 Discussion Post", assignment_type: "discussion_post", week_no: 6, due_at: "2026-11-26T23:59:00+08:00", team_id: "g1", status: "submitted", timeliness: "on_time", late_days: 0, score: null, max_points: 5 },
  ];

  // ── MOCK object is assembled at the end, after all functions are defined ──

  /* ---------------------------------------------------------------------
     Client-side Auth UI Manager (Modal, Utility Bar, Nav Lock Indicators)
     Now integrates with Supabase for real authentication.
     --------------------------------------------------------------------- */

  /* ── Cached live user (from Supabase profile) ── */
  /* Someone who is already signed in should see their own view the moment
     a page opens, not a guest view that changes a second later. Their
     profile is remembered in this browser (only while their sign-in is
     still there) and used straight away; the database then confirms it,
     and if anything about them changed the page refreshes itself once. */
  const PROFILE_CACHE = "stephub_profile_cache";
  function _sessionUserId() {
    try {
      const key = Object.keys(localStorage).find(k => /^sb-.+-auth-token$/.test(k));
      if (!key) return null;
      const sess = JSON.parse(localStorage.getItem(key) || "null");
      return (sess && sess.user && sess.user.id) || (sess && sess.currentSession && sess.currentSession.user && sess.currentSession.user.id) || null;
    } catch (e) { return null; }
  }
  function _readCachedUser() {
    try {
      const cached = JSON.parse(localStorage.getItem(PROFILE_CACHE) || "null");
      return cached && cached.id && cached.id === _sessionUserId() ? cached : null;
    } catch (e) { return null; }
  }
  function _cacheUser(u) {
    try { if (u && u.id) localStorage.setItem(PROFILE_CACHE, JSON.stringify(u)); else localStorage.removeItem(PROFILE_CACHE); } catch (e) {}
  }
  const _sig = u => u ? JSON.stringify([u.id, u.role, u.roles || [], u.team_id || null, u.teams || [], u.full_name || ""]) : "";
  /* refresh at most once every few seconds, so a hiccup can never loop */
  function _reloadOnce() {
    try {
      const last = +sessionStorage.getItem("stephub_auto_reload") || 0;
      if (Date.now() - last < 8000) return false;
      sessionStorage.setItem("stephub_auto_reload", String(Date.now()));
      location.reload();
      return true;
    } catch (e) { return false; }
  }
  let _liveUser = _readCachedUser();

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

  /* a profile that came from Supabase may not carry the mock extras */
  const ROLE_NAMES = { participant: "Participant", trainer: "Trainer", mentor: "Mentor", facilitator: "Facilitator",
                       panel: "Panelist", admin: "STEP Team / Admin", guest: "Guest" };
  const initialsOf = u => String((u && (u.name || u.full_name || u.email)) || "?")
    .replace(/[^A-Za-z ]/g, " ").trim().split(/\s+/).slice(0, 2)
    .map(w => w[0] ? w[0].toUpperCase() : "").join("") || "?";

  let _recovery = null;                      // set while a password-reset link is being used
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
          ${_recovery ? `
            <!-- Arrived from a password-reset email: set the new password -->
            <form id="recover-form" onsubmit="window.MOCK._doRecover(event)" style="display:flex;flex-direction:column;gap:12px;">
              <p style="font-size:13.5px;color:var(--ink-soft);margin:0;">Choose a new password for <b>${_recovery.email || 'your account'}</b>. At least 8 characters.</p>
              <div id="recover-msg" style="display:none;padding:10px 14px;border-radius:8px;font-size:13px;"></div>
              <label style="font-size:13px;font-weight:500;color:var(--navy);">New password
                <input type="password" id="recover-new" required minlength="8" autocomplete="new-password" style="width:100%;padding:10px 14px;border:1.5px solid #d0d5dd;border-radius:8px;font-size:14px;margin-top:4px;box-sizing:border-box;"></label>
              <label style="font-size:13px;font-weight:500;color:var(--navy);">New password again
                <input type="password" id="recover-new2" required minlength="8" autocomplete="new-password" style="width:100%;padding:10px 14px;border:1.5px solid #d0d5dd;border-radius:8px;font-size:14px;margin-top:4px;box-sizing:border-box;"></label>
              <button type="submit" class="btn solid" id="recover-btn" style="width:100%;margin-top:4px;">Save new password</button>
            </form>
          ` : isLoggedIn && isLiveUser ? `
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
            <details id="pw-change" style="margin-top:16px;border-top:1px solid #e6ebf1;padding-top:12px;">
              <summary style="cursor:pointer;font-weight:600;font-size:14px;color:var(--navy);">Change password</summary>
              <p style="font-size:12.5px;color:var(--ink-soft);margin:8px 0 10px;">If you are still using the password the STEP team gave you, set your own here. At least 8 characters.</p>
              <form id="pw-form" onsubmit="window.MOCK._doChangePassword(event)" style="display:flex;flex-direction:column;gap:10px;">
                <div id="pw-msg" style="display:none;padding:9px 12px;border-radius:8px;font-size:13px;"></div>
                <label style="font-size:13px;font-weight:500;color:var(--navy);">Current password
                  <input type="password" id="pw-current" required autocomplete="current-password" style="width:100%;padding:10px 14px;border:1.5px solid #d0d5dd;border-radius:8px;font-size:14px;margin-top:4px;box-sizing:border-box;"></label>
                <label style="font-size:13px;font-weight:500;color:var(--navy);">New password
                  <input type="password" id="pw-new" required minlength="8" autocomplete="new-password" style="width:100%;padding:10px 14px;border:1.5px solid #d0d5dd;border-radius:8px;font-size:14px;margin-top:4px;box-sizing:border-box;"></label>
                <label style="font-size:13px;font-weight:500;color:var(--navy);">New password again
                  <input type="password" id="pw-new2" required minlength="8" autocomplete="new-password" style="width:100%;padding:10px 14px;border:1.5px solid #d0d5dd;border-radius:8px;font-size:14px;margin-top:4px;box-sizing:border-box;"></label>
                <button type="submit" class="btn solid" id="pw-btn" style="width:100%;margin-top:2px;">Save new password</button>
              </form>
            </details>
          ` : isLoggedIn && !isLiveUser ? `
            <!-- Mock signed-in state -->
            <div style="display:flex;align-items:center;gap:14px;padding:16px 18px;background:rgba(46,125,50,.06);border-radius:12px;margin-bottom:var(--s4);">
              <span class="card-av" style="width:44px;height:44px;font-size:16px;flex-shrink:0;">${curr.initials || initialsOf(curr)}</span>
              <div>
                <div style="font-weight:600;font-size:15px;color:var(--navy);">${curr.name}</div>
                <div style="font-size:13px;color:var(--ink-soft);">${curr.role_label || ROLE_NAMES[curr.role] || curr.role || ''} ${curr.team_name ? '· ' + curr.team_name : ''}</div>
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
              <button type="button" class="auth-link" id="pw-forgot" onclick="window.MOCK._showForgot()"
                      style="background:none;border:0;padding:4px 0 0;font:inherit;font-size:13px;color:var(--blue);cursor:pointer;text-align:left;text-decoration:underline;">Forgot your password?</button>
            </form>
            <form id="forgot-form" onsubmit="window.MOCK._doForgot(event)" style="display:none;flex-direction:column;gap:12px;">
              <p style="font-size:13.5px;color:var(--ink-soft);margin:0;">Enter the email you signed up with. We will send a link that lets you set a new password.</p>
              <div id="forgot-msg" style="display:none;padding:10px 14px;border-radius:8px;font-size:13px;"></div>
              <label style="font-size:13px;font-weight:500;color:var(--navy);">Email
                <input type="email" id="forgot-email" required placeholder="you@example.com" style="width:100%;padding:10px 14px;border:1.5px solid #d0d5dd;border-radius:8px;font-size:14px;margin-top:4px;box-sizing:border-box;"></label>
              <button type="submit" class="btn solid" id="forgot-btn" style="width:100%;margin-top:4px;">Send reset link</button>
              <button type="button" onclick="window.MOCK._showForgot(false)" style="background:none;border:0;padding:0;font:inherit;font-size:13px;color:var(--blue);cursor:pointer;text-decoration:underline;">Back to sign in</button>
            </form>
          `}


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

    /* 1a. The address beside the account pill is the signed-in person's own
           email, or "Not logged in". It replaces the static office mailto link
           the page ships with (kept in the markup for no-JS visitors). */
    if (utilRight) {
      let em = document.getElementById("util-email");
      if (!em) {
        const old = utilRight.querySelector('a[href^="mailto:"]');
        em = document.createElement("span");
        em.id = "util-email";
        if (old) old.replaceWith(em); else utilRight.prepend(em);
      }
      const signedIn = !!_liveUser || (user && user.role !== "guest");
      const email = signedIn ? (user.email || "") : "";
      em.className = "util-email" + (email ? "" : " out");
      em.textContent = email || "Not logged in";
      em.title = email ? "Signed in as " + email : "You are not signed in";
    }
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
        const displayName = (isLive ? (user.full_name || user.email) : user.name)
                         || user.full_name || user.name || user.email || "Account";
        const badgeLabel = user.role === "participant" ? (user.team_name || user.team_id || 'Participant')
                         : (user.role_label || ROLE_NAMES[user.role] || user.role || '');
        const initials = user.initials || initialsOf(user);
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

    // 2b. Sub-items of the faculty dropdown follow the same rule: a
    //     mentor is offered Mentors, and is not shown Trainers or Panel.
    const SUB = { "#trainers": "trainers", "#trainers-mentors": "mentors", "#trainers-panel": "panel" };
    document.querySelectorAll(".ddm a").forEach(a => {
      const href = a.getAttribute("href") || "";
      const key = Object.keys(SUB).find(k => href.endsWith(k));
      if (!key) return;
      a.hidden = !auth.canView(SUB[key], user);
    });

    /* A menu whose every item is hidden would open as an empty box, so the
       whole dropdown folds away and the tab becomes a plain link — clicking
       it lands on the page, which explains why it is shut. */
    document.querySelectorAll(".navdd").forEach(dd => {
      const menu = dd.querySelector(".ddm");
      if (!menu) return;
      const links = Array.prototype.slice.call(menu.querySelectorAll("a"));
      const empty = links.length > 0 && links.every(a => a.hidden);
      dd.classList.toggle("dd-empty", empty);
      if (empty) dd.classList.remove("open");
      /* Found by position, not by aria-haspopup: that attribute is removed while
         the menu is empty (e.g. the guest state at page load), and must come back
         once a live profile with access arrives a moment later. */
      const trigger = dd.querySelector(":scope > a");
      if (trigger) {
        if (empty) trigger.removeAttribute("aria-haspopup");
        else trigger.setAttribute("aria-haspopup", "true");
        trigger.setAttribute("aria-expanded", "false");
      }
    });

    // 3. No floating account pill: the one in the utility bar at the top
    //    already shows who is signed in and opens the account panel.
    const qs = document.getElementById("quick-role-switcher");
    if (qs) qs.remove();
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
      _liveUser = null; _cacheUser(null);
    }
    auth.setCurrentUser(userId);
    closeAuthModal();
    updateAuthChrome();
  }

  function signOutUser() {
    if (_liveUser && window.STEP_SUPABASE) {
      window.STEP_SUPABASE.signOut();
      _liveUser = null; _cacheUser(null);
    }
    auth.logout();
    closeAuthModal();
    updateAuthChrome();
  }

  /* ── Real Supabase sign-in handler ── */
  /* ---- passwords ---- */
  const _note = (id, text, bad) => { const el = document.getElementById(id); if (!el) return;
    el.textContent = text; el.style.display = text ? "block" : "none";
    el.style.background = bad ? "rgba(198,40,40,.08)" : "rgba(46,125,50,.08)"; el.style.color = bad ? "#c62828" : "#2e7d32"; };
  const _pwProblem = (a, b) => !a || a.length < 8 ? "Use at least 8 characters." : a !== b ? "The two new passwords do not match." : "";

  async function _doChangePassword(e) {
    e.preventDefault();
    const cur = document.getElementById("pw-current").value, a = document.getElementById("pw-new").value, b = document.getElementById("pw-new2").value;
    const btn = document.getElementById("pw-btn");
    const bad = _pwProblem(a, b) || (a === cur ? "The new password is the same as the current one." : "");
    if (bad) { _note("pw-msg", bad, true); return; }
    if (!window.STEP_SUPABASE || !window.STEP_SUPABASE.isOnline()) { _note("pw-msg", "Not connected — try again in a moment.", true); return; }
    btn.disabled = true; btn.textContent = "Saving…"; _note("pw-msg", "");
    const { error } = await window.STEP_SUPABASE.changePassword(cur, a);
    btn.disabled = false; btn.textContent = "Save new password";
    if (error) { _note("pw-msg", error.message || "Couldn't change the password.", true); return; }
    document.getElementById("pw-form").reset();
    _note("pw-msg", "Password changed. Use the new one next time you sign in.");
  }
  function _showForgot(on) {
    const login = document.getElementById("stephub-login-form"), forgot = document.getElementById("forgot-form");
    if (!login || !forgot) return;
    const show = on !== false;
    login.style.display = show ? "none" : "flex"; forgot.style.display = show ? "flex" : "none";
    if (show) { const em = document.getElementById("login-email"); if (em && em.value) document.getElementById("forgot-email").value = em.value; document.getElementById("forgot-email").focus(); }
  }
  async function _doForgot(e) {
    e.preventDefault();
    const email = document.getElementById("forgot-email").value.trim(), btn = document.getElementById("forgot-btn");
    if (!email) return;
    if (!window.STEP_SUPABASE || !window.STEP_SUPABASE.isOnline()) { _note("forgot-msg", "Not connected — try again in a moment.", true); return; }
    btn.disabled = true; btn.textContent = "Sending…"; _note("forgot-msg", "");
    const { error } = await window.STEP_SUPABASE.requestPasswordReset(email);
    btn.disabled = false; btn.textContent = "Send reset link";
    if (error) { _note("forgot-msg", error.message || "Couldn't send the link.", true); return; }
    _note("forgot-msg", "If " + email + " has a STEP account, a reset link is on its way. Check your inbox (and spam) and open the link on this device.");
  }
  async function _doRecover(e) {
    e.preventDefault();
    const a = document.getElementById("recover-new").value, b = document.getElementById("recover-new2").value, btn = document.getElementById("recover-btn");
    const bad = _pwProblem(a, b); if (bad) { _note("recover-msg", bad, true); return; }
    btn.disabled = true; btn.textContent = "Saving…"; _note("recover-msg", "");
    const { error } = await window.STEP_SUPABASE.setPasswordFromReset(a);
    btn.disabled = false; btn.textContent = "Save new password";
    if (error) { _note("recover-msg", error.message || "Couldn't set the password.", true); return; }
    _recovery = null;
    _note("recover-msg", "Password saved — you are signed in.");
    setTimeout(() => { closeAuthModal(); try { history.replaceState(null, "", location.pathname + location.search); } catch (x) {} location.reload(); }, 900);
  }
  /* a reset link lands here with a recovery session: open the "new password" form straight away */
  (function watchRecovery() {
    const fromHash = /(^|[#&])type=recovery(&|$)/.test(location.hash || "");
    function open(email) { _recovery = { email: email || "" }; renderAuthModal(); openAuthModal(); }
    if (fromHash) {
      const tryOpen = () => { if (window.STEP_SUPABASE && window.STEP_SUPABASE.isOnline()) {
        Promise.resolve(window.STEP_SUPABASE.getSession()).then(r => { const u = r && r.data && r.data.session && r.data.session.user; open(u ? u.email : ""); }).catch(() => open("")); } else setTimeout(tryOpen, 300); };
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tryOpen); else tryOpen();
    }
    const hook = () => { try { window.STEP_SUPABASE.onAuthChange((event, profile) => { if (event === "PASSWORD_RECOVERY") open(profile && profile.email); }); } catch (x) {} };
    if (window.STEP_SUPABASE && window.STEP_SUPABASE.isOnline()) hook(); else document.addEventListener("DOMContentLoaded", () => { if (window.STEP_SUPABASE && window.STEP_SUPABASE.isOnline()) hook(); });
  })();

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
      if (errBox) { errBox.textContent = "Sign-in is not available right now. Please try again later."; errBox.style.display = "block"; }
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
        _cacheUser(_liveUser);
        try { sessionStorage.setItem("stephub_auto_reload", String(Date.now())); } catch (e) {}
        /* start the site afresh as this person — every page then loads their
           own data from the beginning (the session survives the reload) */
        btn.textContent = "Signed in — loading your view…";
        setTimeout(() => { try { location.reload(); } catch (e) {
          closeAuthModal(); updateAuthChrome();
          window.dispatchEvent(new CustomEvent("stephub_auth_changed", { detail: { user: _liveUser } }));
        } }, 150);
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
    _cacheUser(null);
    auth.logout();
    /* refresh on the way out too, so nothing private stays on the screen */
    try { location.reload(); return; } catch (e) {}
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
  function _settleAuth() {
    if (window.__authSettled) return;
    window.__authSettled = true;
    window.dispatchEvent(new CustomEvent("stephub_auth_settled"));
  }
  async function _checkExistingSession() {
    if (!window.STEP_SUPABASE || !window.STEP_SUPABASE.isOnline()) { _settleAuth(); return; }
    try {
      const profile = await window.STEP_SUPABASE.getCurrentUser();
      const before = _sig(_liveUser);
      if (profile) {
        _liveUser = {
          ...profile,
          name: profile.full_name || profile.email,
          team_name: profile.team_id ? (window.MOCK.groups.find(g => g.id === profile.team_id) || {}).name || profile.team_id : null
        };
        _cacheUser(_liveUser);
        /* the page was drawn for someone else (a guest, or an older copy of
           this account) — start it afresh as who they really are */
        if (before !== _sig(_liveUser) && _reloadOnce()) return;
        updateAuthChrome();
        window.dispatchEvent(new CustomEvent("stephub_auth_changed", { detail: { user: _liveUser } }));
      } else if (_liveUser) {
        /* the remembered sign-in has ended — show the guest view */
        _liveUser = null; _cacheUser(null);
        if (_reloadOnce()) return;
        updateAuthChrome();
        window.dispatchEvent(new CustomEvent("stephub_auth_changed", { detail: { user: null } }));
      }
    } catch (err) {
      console.warn("[STEP] Session check failed:", err);
    } finally {
      _settleAuth();
    }
  }

  window.addEventListener("stephub_auth_changed", () => {
    updateAuthChrome();
  });

  /* Put the sample cohort on the real calendar before anyone reads it:
     everything dated moves by a whole number of weeks so that "this
     week" is the week you are actually looking at the site in. */
  const _mock = {
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
    _doChangePassword, _showForgot, _doForgot, _doRecover,
    closeAuthModal,
    /* true only for a real STEP account — the page then shows real data */
    isLiveUser: () => !!_liveUser,
    selectUser,
    signOutUser,
    _doSignIn,
    _doSignOut,
    updateAuthChrome
  };

  if (window.STEP_CLOCK && window.STEP_CLOCK.align) {
    try { _mock.__shiftedDays = window.STEP_CLOCK.align(_mock); } catch (e) {}
  }

  return _mock;
})();
