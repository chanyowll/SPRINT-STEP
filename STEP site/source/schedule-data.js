/* =====================================================================
   STEP Hub — the STEP 2.5 program schedule

   Taken from the "STEP 2.5 Master Tracker" (Master Timeline sheet),
   Updated Schedule: October 12, 2026 – January 29, 2027.

   Each week has a short name the program uses everywhere (title), and
   the topic exactly as the tracker words it (topic).

   The program runs by WEEK NUMBER, not by module:
     W0   Pre-program online orientation (Oct 12)
     W1   Program launch, on site (Oct 19–20)
     W2–W11  one topic a week: Tuesday learning session, Saturday
          feedback session (W8 moves to Wednesday for the holiday and
          adds the on-site Mid-Program Checkpoint)
     —    Christmas break, Dec 14 – Jan 4 (not counted as a week)
     W12  Demo Day (Jan 28) and Graduation (Jan 29), on site

   Every page reads the weeks, dates and topics from here, so a change
   to the schedule is made once, in this file.

   Times are the program's usual ones (learning and feedback sessions
   9:00 AM – 12:00 NN, team output due Friday 12:00 NN); the tracker
   itself gives dates only.
   ===================================================================== */
(function () {
  'use strict';

  const LS_TIME = "9:00 AM – 12:00 NN";
  const FB_TIME = "9:00 AM – 12:00 NN";

  /* one entry per program week */
  const weeks = [
    {
      week: 0, code: "W0", starts: "2026-10-12", ends: "2026-10-18",
      title: "Pre-Program: STEP Onboarding", short: "Pre-Program: STEP Onboarding", axis: "Pre-Program\nonboarding",
      topic: "Pre-Program: STEP Onboarding",
      milestone: "Kick-Off",
      sessions: [
        { date: "2026-10-12", kind: "orientation", att: "OR", mode: "Online",
          title: "Pre-Program: STEP Onboarding" },
      ],
      output: false,
      tagline: "Meet the program, the people and the platform before the work starts.",
      brief: "A short online session before the launch: how the twelve weeks run, what each team is expected to do every week, and how STEP Hub, the mentors and the Saturday panels fit together. Come with questions — this is the time to ask them.",
      able: [
        "Explain how a program week runs, from Tuesday's learning session to Saturday's panel",
        "Find your materials, hand-ins and feedback on STEP Hub",
        "Name the team members who will attend each session",
      ],
      produce: "Nothing to hand in yet. Make sure everyone on the team can sign in to STEP Hub before the launch.",
      game: {
        title: "Put a program week in order",
        prompt: "Every week from Week 2 follows the same rhythm. Drag the cards into the order they happen.",
        steps: [
          { order: 1, label: "Tuesday learning session", why: "The week's topic is taught first, so everything after it builds on the session." },
          { order: 2, label: "Mentoring, Wednesday to Friday", why: "Your mentor helps you turn the session into your team's own output." },
          { order: 3, label: "Team output due Friday, 12:00 NN", why: "The panel reads your work before they meet you." },
          { order: 4, label: "Saturday feedback session", why: "A five-minute video, then questions from your panel." },
          { order: 5, label: "Next week's topic", why: "The panel's comments become your short list for the week ahead." },
        ],
      },
    },
    {
      week: 1, code: "W1", starts: "2026-10-19", ends: "2026-10-25",
      title: "Program Launch", short: "Program Launch", axis: "Program\nlaunch",
      topic: "Program Launch, Team Formation, Technology Entrepreneurship Overview, Pathway Ideation, Mentor Introduction",
      sessions: [
        { date: "2026-10-19", end: "2026-10-20", kind: "onsite", att: "OS", mode: "On site",
          title: "Program Launch, Team Formation, Technology Entrepreneurship Overview, Pathway Ideation, Mentor Introduction",
          rail: "Program Launch & Team Formation" },
      ],
      output: false,
      tagline: "Two days on site to form the team, choose a pathway and meet your mentor.",
      brief: "The cycle opens in person. Teams settle who does what, get an overview of technology entrepreneurship, work through pathway ideation to choose how their technology could reach the market, and meet the mentor they will work with every week.",
      able: [
        "Agree on your team's roles for the cycle",
        "Describe the commercialization pathways open to your technology and choose the one to test first",
        "Set a regular weekly slot with your mentor",
      ],
      produce: "Your chosen commercialization pathway and your team's roles, agreed before you leave the launch.",
      game: {
        title: "Choose a pathway",
        prompt: "From technology to a first pathway to test. Drag the cards into the order you would work through them.",
        steps: [
          { order: 1, label: "Say what the technology does better", why: "Start from the advantage, in plain words." },
          { order: 2, label: "List who could use it", why: "Users and buyers, before any business model." },
          { order: 3, label: "Compare the pathways", why: "Licensing, a spin-off, or a partnership with industry." },
          { order: 4, label: "Choose one pathway to test first", why: "One, so the next weeks have a clear focus." },
          { order: 5, label: "Agree the next steps with your mentor", why: "The mentor meets you every week from here." },
        ],
      },
    },
    {
      week: 2, code: "W2", starts: "2026-10-26", ends: "2026-11-01",
      title: "Ecosystem & Vertical Market Mapping", short: "Ecosystem & Vertical Market Mapping", axis: "Ecosystem\nmapping",
      topic: "Ecosystem & Vertical Market Mapping",
      review: "Ecosystem and Vertical Market Map Review",
      sessions: [
        { date: "2026-10-27", kind: "learning", att: "LS", mode: "Online", time: LS_TIME,
          title: "Ecosystem & Vertical Market Mapping" },
        { date: "2026-10-31", kind: "feedback", att: "FB", mode: "Online", time: FB_TIME,
          title: "Ecosystem and Vertical Market Map Review" },
      ],
      output: true,
      tagline: "See every player around your technology before choosing where to start.",
      brief: "Before choosing a first customer, teams map the ecosystem their technology would enter — suppliers, users, buyers, regulators, funders and competitors — and the vertical markets where it could be applied. The map becomes the shortlist the following weeks work from.",
      able: [
        "Identify the players in your technology's ecosystem and how value and money move between them",
        "List the vertical markets where your technology could be applied",
        "Spot the partners and gaps that matter most for reaching the market",
      ],
      produce: "Your ecosystem and vertical market map, with a five-minute video walking the panel through it.",
      game: {
        title: "Trace the value chain",
        prompt: "From raw inputs to the person who uses the product. Drag the cards into order.",
        steps: [
          { order: 1, label: "Suppliers of materials and parts", why: "What your technology needs before it can be made." },
          { order: 2, label: "Your team, the technology developer", why: "Where the invention sits in the chain." },
          { order: 3, label: "Manufacturer or integrator", why: "Who builds it at scale or puts it into a larger system." },
          { order: 4, label: "Distributor or channel", why: "How it reaches the buyer." },
          { order: 5, label: "End user", why: "The person or organization whose problem it solves." },
        ],
      },
    },
    {
      week: 3, code: "W3", starts: "2026-11-02", ends: "2026-11-08",
      title: "Customer Segments & Beachhead Markets", short: "Customer Segments & Beachhead Markets", axis: "Customer segments\n& beachhead",
      topic: "Beachhead Markets, Customer Segments, Problem-Solution Fit, Value Proposition Statement",
      review: "Beachhead Market and Value Proposition Review",
      sessions: [
        { date: "2026-11-03", kind: "learning", att: "LS", mode: "Online", time: LS_TIME,
          title: "Beachhead Markets, Customer Segments, Problem-Solution Fit, Value Proposition Statement" },
        { date: "2026-11-07", kind: "feedback", att: "FB", mode: "Online", time: FB_TIME,
          title: "Beachhead Market and Value Proposition Review" },
      ],
      output: true,
      tagline: "Choose the first market you can actually win.",
      brief: "From the markets on your map, list five to ten real opportunities, prioritize them, and choose a beachhead: the one customer segment you can win first. Then show the fit between the problem those customers feel and your solution, and say it in one value proposition statement.",
      able: [
        "Identify 5 to 10 possible market opportunities",
        "Prioritize them and choose a beachhead market",
        "Build a Problem-Solution Fit Canvas and a Value Proposition Statement for that segment",
      ],
      produce: "A prioritized list of 5–10 market opportunities, your chosen beachhead, a Problem-Solution Fit Canvas and a Value Proposition Statement — plus the five-minute video.",
      game: {
        title: "Choose a beachhead",
        prompt: "From many possible markets to one statement. Drag the cards into the order you would work.",
        steps: [
          { order: 1, label: "List 5 to 10 market opportunities", why: "Start wide, from your ecosystem map." },
          { order: 2, label: "Prioritize them", why: "Need, access and size decide which come first." },
          { order: 3, label: "Choose the beachhead", why: "One segment you can win before moving on." },
          { order: 4, label: "Fill the Problem-Solution Fit Canvas", why: "Check the problem they feel matches what you solve." },
          { order: 5, label: "Write the value proposition statement", why: "Say it in one line the customer would recognise." },
        ],
      },
    },
    {
      week: 4, code: "W4", starts: "2026-11-09", ends: "2026-11-15",
      title: "Market Size Estimation", short: "Market Size Estimation", axis: "Market size\nestimation",
      topic: "Market Size Estimation, TAM/SAM/SOM, Market Research",
      review: "Market Research and TAM/SAM/SOM Review",
      sessions: [
        { date: "2026-11-10", kind: "learning", att: "LS", mode: "Online", time: LS_TIME,
          title: "Market Size Estimation, TAM/SAM/SOM, Market Research" },
        { date: "2026-11-14", kind: "feedback", att: "FB", mode: "Online", time: FB_TIME,
          title: "Market Research and TAM/SAM/SOM Review" },
      ],
      output: true,
      tagline: "Put a defensible number on the market.",
      brief: "Estimate how big the beachhead really is — the total addressable, serviceable and obtainable market — each with its reasoning and sources. Then size the follow-on markets you could move into once the beachhead is won.",
      able: [
        "Estimate TAM, SAM and SOM for your beachhead, with the logic behind each",
        "Back the numbers with primary and secondary market research",
        "Size the follow-on markets you would enter next",
      ],
      produce: "TAM, SAM and SOM for your beachhead and your follow-on markets, with sources and reasoning — plus the five-minute video.",
      game: {
        title: "From the whole market to your share",
        prompt: "Drag the cards from the widest view to the narrowest.",
        steps: [
          { order: 1, label: "TAM — total addressable market", why: "Everyone who could use this kind of solution." },
          { order: 2, label: "SAM — serviceable available market", why: "The part your product and channels can actually reach." },
          { order: 3, label: "SOM — serviceable obtainable market", why: "The share you can realistically win in the first years." },
          { order: 4, label: "Check the numbers with research", why: "Primary interviews and secondary sources keep the estimate honest." },
          { order: 5, label: "Repeat for follow-on markets", why: "Where you go once the beachhead is won." },
        ],
      },
    },
    {
      week: 5, code: "W5", starts: "2026-11-16", ends: "2026-11-22",
      title: "Product Use Case Mapping", short: "Product Use Case Mapping", axis: "Product use\ncase mapping",
      topic: "Product Use Case Mapping and Quantified Value Proposition",
      review: "Value Proposition and Product Use Case Review",
      sessions: [
        { date: "2026-11-17", kind: "learning", att: "LS", mode: "Online", time: LS_TIME,
          title: "Product Use Case Mapping and Quantified Value Proposition" },
        { date: "2026-11-21", kind: "feedback", att: "FB", mode: "Online", time: FB_TIME,
          title: "Value Proposition and Product Use Case Review" },
      ],
      output: true,
      tagline: "Show how it is used, then put a number on the benefit.",
      brief: "Walk through your product's full life cycle use case — how a customer finds, buys, installs, uses and maintains it — then pick the two or three metrics the customer cares about and turn the improvement into a one-sentence quantified value proposition.",
      able: [
        "Map your product's full life cycle use case from start to end",
        "Identify 2–3 metrics your customer cares about and estimate baseline versus improvement",
        "Write a one-sentence quantified value proposition",
      ],
      produce: "Your life cycle use case, a concept board or brochure, and a one-sentence quantified value proposition — plus the five-minute video.",
      game: {
        title: "Quantify the value",
        prompt: "From a customer metric to one persuasive sentence. Drag the cards into order.",
        steps: [
          { order: 1, label: "Pick the metric the customer cares about", why: "Cost, time, yield, safety — in their terms, not yours." },
          { order: 2, label: "Measure today's baseline", why: "What it is now, without your technology." },
          { order: 3, label: "Estimate the improvement", why: "What changes when they use your product." },
          { order: 4, label: "Calculate the peso or % benefit", why: "The difference, in a number they can check." },
          { order: 5, label: "Write it in one sentence", why: "The quantified value proposition." },
        ],
      },
    },
    {
      week: 6, code: "W6", starts: "2026-11-23", ends: "2026-11-29",
      title: "Competitive Advantage", short: "Competitive Advantage", axis: "Competitive\nadvantage",
      topic: "Competitive Advantage, VRIO Framework, Competitor Profile Matrix",
      review: "Competitive Positioning Review",
      sessions: [
        { date: "2026-11-24", kind: "learning", att: "LS", mode: "Online", time: LS_TIME,
          title: "Competitive Advantage, VRIO Framework, Competitor Profile Matrix" },
        { date: "2026-11-28", kind: "feedback", att: "FB", mode: "Online", time: FB_TIME,
          title: "Competitive Positioning Review" },
      ],
      output: true,
      tagline: "Know why a customer would choose you, and why that lasts.",
      brief: "Compare yourself honestly with the alternatives customers already use, using a Competitor Profile Matrix, then test whether your advantage is sustainable with the VRIO framework — valuable, rare, hard to imitate, and backed by an organization that can use it.",
      able: [
        "Build a Competitor Profile Matrix against your closest alternatives",
        "Test whether your advantage is sustainable using VRIO",
        "Sharpen your value proposition around what lasts",
      ],
      produce: "Your Competitor Profile Matrix, VRIO analysis and Lean Canvas — plus the five-minute video.",
      game: {
        title: "Climb the VRIO ladder",
        prompt: "Each question only matters if the one before it is a yes. Drag the cards into order.",
        steps: [
          { order: 1, label: "Valuable?", why: "Does it let you meet a need or cut a cost?" },
          { order: 2, label: "Rare?", why: "Do few competitors have it?" },
          { order: 3, label: "Hard to imitate?", why: "Would copying it be costly or slow?" },
          { order: 4, label: "Organized to use it?", why: "Does the team have the setup to capture the value?" },
          { order: 5, label: "Sustained competitive advantage", why: "Four yeses — an advantage that lasts." },
        ],
      },
    },
    {
      week: 7, code: "W7", starts: "2026-11-30", ends: "2026-12-06",
      title: "Go-to-Market Plan", short: "Go-to-Market Plan", axis: "Go-to-market\nplan",
      topic: "Go-to-Market Plan, Lean Canvas, Product-Market Fit Validation",
      review: "GTM Plan and Lean Canvas Review",
      sessions: [
        { date: "2026-12-01", kind: "learning", att: "LS", mode: "Online", time: LS_TIME,
          title: "Go-to-Market Plan, Lean Canvas, Product-Market Fit Validation" },
        { date: "2026-12-05", kind: "feedback", att: "FB", mode: "Online", time: FB_TIME,
          title: "GTM Plan and Lean Canvas Review" },
      ],
      output: true,
      tagline: "Plan how you reach the first customers, then check they want it.",
      brief: "Turn the beachhead into a plan: the strategy canvas that sets you apart, the channels you will test with the bullseye framework, and a go-to-market Gantt chart for the months ahead — with a complete Lean Canvas and the evidence you have so far of product-market fit.",
      able: [
        "Draw a strategy canvas against the alternatives",
        "Choose and justify your first channels using the bullseye framework",
        "Lay out a go-to-market Gantt chart and complete your Lean Canvas",
      ],
      produce: "Your strategy canvas, completed Lean Canvas, bullseye framework and go-to-market Gantt chart — plus the five-minute video.",
      game: {
        title: "Find your channel",
        prompt: "The bullseye framework, step by step. Drag the cards into order.",
        steps: [
          { order: 1, label: "Brainstorm every possible channel", why: "Start with all of them, not the familiar two." },
          { order: 2, label: "Rank them into outer, middle and inner rings", why: "From possible, to promising, to the ones to test now." },
          { order: 3, label: "Pick the inner-ring channels", why: "The few worth testing first." },
          { order: 4, label: "Run cheap, quick tests", why: "Learn which channel actually brings customers." },
          { order: 5, label: "Focus on the channel that works", why: "Put it in the go-to-market Gantt chart." },
        ],
      },
    },
    {
      week: 8, code: "W8", starts: "2026-12-07", ends: "2026-12-13",
      title: "Ecosystem Positioning & Market Strategy", short: "Ecosystem Positioning & Market Strategy", axis: "Ecosystem &\nmarket strategy",
      topic: "Ecosystem Positioning and Market Strategy",
      milestone: "Mid-Program Checkpoint",
      review: "Market Strategy Review",
      sessions: [
        { date: "2026-12-08", kind: "holiday", mode: "No session",
          title: "No Session — Feast of the Immaculate Conception" },
        { date: "2026-12-09", kind: "learning", att: "LS", mode: "Online", time: LS_TIME, adjusted: true,
          title: "Ecosystem Positioning and Market Strategy" },
        { date: "2026-12-11", end: "2026-12-12", kind: "onsite", att: "OS", mode: "On site",
          title: "Mid-Program Checkpoint: Technology Review, Mentoring, Pitch Refinement, Business Model Validation Workshop" },
        { date: "2026-12-12", kind: "feedback", att: "FB", mode: "Online", time: FB_TIME,
          title: "Market Strategy Review" },
      ],
      output: true,
      tagline: "Halfway: place yourself in the ecosystem and set the market strategy.",
      brief: "The learning session moves to Wednesday because of the holiday. It brings the first half together: where your venture sits in the ecosystem you mapped in Week 2, and the market strategy that follows from it. On Friday and Saturday everyone meets on site for the Mid-Program Checkpoint — technology review, mentoring, pitch refinement and a business model validation workshop.",
      able: [
        "Position your venture in its ecosystem: partners, channels and competitors",
        "State a market strategy that ties your beachhead, value proposition and go-to-market plan together",
        "Bring a refined pitch and your technology status to the checkpoint",
      ],
      produce: "Your market strategy, ready for Saturday's Market Strategy Review.",
      game: {
        title: "Build the market strategy",
        prompt: "The first half of the program, in the order it builds. Drag the cards into order.",
        steps: [
          { order: 1, label: "Ecosystem and vertical market map", why: "Week 2 — who is around your technology." },
          { order: 2, label: "Beachhead market", why: "Week 3 — the first segment to win." },
          { order: 3, label: "Market size", why: "Week 4 — how big the prize is." },
          { order: 4, label: "Competitive advantage", why: "Week 6 — why customers choose you." },
          { order: 5, label: "Go-to-market plan", why: "Week 7 — how you reach them." },
        ],
      },
    },
    {
      week: 9, code: "W9", starts: "2027-01-04", ends: "2027-01-10",
      title: "Business Model and Market Validation", short: "Business Model and Market Validation", axis: "Business model &\nmarket validation",
      topic: "Business Model Validation, Market Validation, Industry Validation",
      review: "Business Model Validation Review",
      sessions: [
        { date: "2027-01-05", kind: "learning", att: "LS", mode: "Online", time: LS_TIME,
          title: "Business Model Validation, Market Validation, Industry Validation" },
        { date: "2027-01-09", kind: "feedback", att: "FB", mode: "Online", time: FB_TIME,
          title: "Business Model Validation Review" },
      ],
      output: true,
      tagline: "Test the business model with the people who would pay for it.",
      brief: "Back from the break, teams test the business model against reality: what customers, the market and industry players say about the channels, costs and revenue the model depends on. The Lean Canvas is refined and the Business Model Canvas moves from startup to scale-up.",
      able: [
        "Refine your Lean Canvas with what you have learned",
        "Validate your model with customers, the market and industry",
        "Move your Business Model Canvas from startup to scale-up",
      ],
      produce: "A refined Lean Canvas, a scale-up Business Model Canvas with the validation behind it, and an updated go-to-market Gantt chart to Demo Day — plus the five-minute video.",
      game: {
        title: "Test an assumption",
        prompt: "One validation loop, start to finish. Drag the cards into order.",
        steps: [
          { order: 1, label: "Write down your riskiest assumption", why: "The one that sinks the model if it is wrong." },
          { order: 2, label: "Design a small test", why: "Cheap and quick, with a result you decide in advance." },
          { order: 3, label: "Talk to customers and industry", why: "Market and industry validation, not opinions from the team." },
          { order: 4, label: "Record what you learned", why: "Evidence the panel can see." },
          { order: 5, label: "Update the canvas", why: "The model changes with the evidence." },
        ],
      },
    },
    {
      week: 10, code: "W10", starts: "2027-01-11", ends: "2027-01-17",
      title: "Team Organization, IP Strategy & Finance", short: "Team Organization, IP Strategy & Finance", axis: "Team, IP\n& finance",
      topic: "Finance, Team Organization, IP Strategy",
      review: "Finance and Commercialization Readiness Review",
      sessions: [
        { date: "2027-01-12", kind: "learning", att: "LS", mode: "Online", time: LS_TIME,
          title: "Finance, Team Organization, IP Strategy" },
        { date: "2027-01-16", kind: "feedback", att: "FB", mode: "Online", time: FB_TIME,
          title: "Finance and Commercialization Readiness Review" },
      ],
      output: true,
      tagline: "Check that the money, the team and the IP are ready for commercialization.",
      brief: "Three foundations of a spin-off in one week: the basics of finance for a technology venture, how the team will be organized — roles, responsibilities and equity — and an IP strategy that protects what makes the technology valuable.",
      able: [
        "Estimate the costs and revenues behind your business model",
        "Set out your spin-off team's roles and responsibilities",
        "Outline an IP strategy for your technology",
      ],
      produce: "Your finance basics, team organization and IP strategy, brought together for the Finance and Commercialization Readiness Review — plus the five-minute video.",
      game: {
        title: "Plan the IP strategy",
        prompt: "From invention to an IP plan. Drag the cards into order.",
        steps: [
          { order: 1, label: "Identify what is new", why: "The features that make the technology different." },
          { order: 2, label: "Search the prior art", why: "Check what is already patented or published." },
          { order: 3, label: "Choose the protection", why: "Patent, utility model, design or trade secret." },
          { order: 4, label: "File before you disclose", why: "Protect it before the pitch goes public." },
          { order: 5, label: "Decide how the IP will be used", why: "License it, or build the spin-off on it." },
        ],
      },
    },
    {
      week: 11, code: "W11", starts: "2027-01-18", ends: "2027-01-24",
      title: "Financial Projection", short: "Financial Projection", axis: "Financial\nprojection",
      topic: "Advanced Finance, Financial Projections, FASTRAC Orientation",
      review: "Financial Model and FASTRAC Review",
      sessions: [
        { date: "2027-01-19", kind: "learning", att: "LS", mode: "Online", time: LS_TIME,
          title: "Advanced Finance, Financial Projections, FASTRAC Orientation" },
        { date: "2027-01-23", kind: "feedback", att: "FB", mode: "Online", time: FB_TIME,
          title: "Financial Model and FASTRAC Review" },
      ],
      output: true,
      tagline: "Build the financial model, and get ready to write FASTRAC.",
      brief: "Turn the business model into numbers — projections, payback, return on investment and break-even — then an orientation to the DOST FASTRAC proposal those numbers will go into.",
      able: [
        "Build a five-year financial projection",
        "Compute and interpret payback, ROI and break-even",
        "Know what the FASTRAC proposal asks for and where your work so far fits",
      ],
      produce: "Your financial model — projections, payback, ROI and break-even — and a start on your FASTRAC proposal, plus the five-minute video.",
      game: {
        title: "Build the financial model",
        prompt: "From a sales forecast to the numbers a funder reads. Drag the cards into order.",
        steps: [
          { order: 1, label: "Forecast sales", why: "Units and prices, year by year." },
          { order: 2, label: "Estimate the costs", why: "What it takes to make, sell and support it." },
          { order: 3, label: "Project the cash flows", why: "Money in minus money out, five years ahead." },
          { order: 4, label: "Compute ROI and payback", why: "Is the investment worth it, and how soon is it repaid?" },
          { order: 5, label: "Find the break-even point", why: "Where revenue finally covers the costs." },
        ],
      },
    },
    {
      week: 12, code: "W12", starts: "2027-01-25", ends: "2027-01-31",
      title: "Demo Day", short: "Demo Day", axis: "Demo\nDay",
      topic: "Demo Day and Graduation",
      milestone: "Demo Day / Graduation",
      sessions: [
        { date: "2027-01-28", kind: "onsite", att: "DD", mode: "On site",
          title: "Demo Day — Final Presentations, Technology Roadmap, FASTRAC Capsule Submission" },
        { date: "2027-01-29", kind: "onsite", att: "GR", mode: "On site",
          title: "Graduation Ceremony and Ecosystem Networking" },
      ],
      output: false,
      tagline: "Present the venture, submit the FASTRAC capsule, and graduate.",
      brief: "Teams give their final presentations on Demo Day, with their technology roadmap, and submit the FASTRAC capsule. Friday closes the cycle with the graduation ceremony and ecosystem networking.",
      able: [
        "Deliver a final pitch that holds together from problem to ask",
        "Show a technology roadmap you can defend",
        "Submit your FASTRAC capsule",
      ],
      produce: "Your final presentation, technology roadmap and FASTRAC capsule, submitted on Demo Day.",
      game: {
        title: "Order the final pitch",
        prompt: "The spine of a Demo Day pitch. Drag the cards into the order you would present them.",
        steps: [
          { order: 1, label: "The problem", why: "Whose pain, and how big." },
          { order: 2, label: "Your solution", why: "What the technology does about it." },
          { order: 3, label: "The market", why: "Beachhead, size and who comes next." },
          { order: 4, label: "Business model and evidence", why: "How it makes money, and the validation so far." },
          { order: 5, label: "The ask", why: "What you need, and what it will achieve." },
        ],
      },
    },
  ];

  const BREAK = { starts: "2026-12-14", ends: "2027-01-03", resumes: "2027-01-05" };
  const cohort = {
    code: "STEP2.5", name: "STEP 2.5", timezone: "Asia/Manila",
    starts_on: "2026-10-12", ends_on: "2027-01-29", weeks_total: 12,
    source: "STEP 2.5 Master Tracker — Updated Schedule: October 12, 2026 – January 29, 2027",
  };

  /* ---------- dates ---------- */
  const pad = n => String(n).padStart(2, "0");
  /* today's calendar day in Manila, as YYYY-MM-DD */
  function manilaDay(d) {
    d = d || new Date();
    try { return d.toLocaleDateString("en-CA", { timeZone: "Asia/Manila" }); }
    catch (e) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  }
  function addDays(iso, n) {
    const [y, m, d] = iso.split("-").map(Number);
    const x = new Date(Date.UTC(y, m - 1, d + n));
    return x.getUTCFullYear() + "-" + pad(x.getUTCMonth() + 1) + "-" + pad(x.getUTCDate());
  }
  const DAYNAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const MON3 = MONTHS.map(m => m.slice(0, 3));
  const dayName = iso => { const [y, m, d] = iso.split("-").map(Number); return DAYNAMES[(new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7]; };
  const short = iso => { const [, m, d] = iso.split("-").map(Number); return MON3[m - 1] + " " + d; };
  const long = iso => { const [y, m, d] = iso.split("-").map(Number); return MONTHS[m - 1] + " " + d + ", " + y; };
  function range(a, b) {
    if (!b || a === b) return short(a);
    const [, ma] = a.split("-").map(Number), [, mb, db] = b.split("-").map(Number);
    return short(a) + "–" + (ma === mb ? db : short(b));
  }

  const byWeek = n => weeks.find(w => w.week === Number(n)) || null;
  const byCode = c => weeks.find(w => w.code === String(c).toUpperCase()) || null;
  const weekOfCode = c => { const m = String(c || "").match(/^W(\d+)/i); return m ? +m[1] : null; };
  const label = n => "Week " + n;

  const sessionOf = (n, kind) => { const w = byWeek(n); return w ? w.sessions.find(s => s.kind === kind) || null : null; };
  const learningOf = n => sessionOf(n, "learning");
  const feedbackOf = n => sessionOf(n, "feedback");

  /* the team output is due at 12:00 NN on the day before the feedback session */
  function dueOf(n) {
    const w = byWeek(n);
    if (!w || !w.output) return null;
    const fb = feedbackOf(n);
    return (fb ? addDays(fb.date, -1) : addDays(w.starts, 4)) + "T12:00:00+08:00";
  }

  /* where the program is today: the week, and whether it has started */
  function current(now) {
    const t = manilaDay(now);
    const first = weeks[0], last = weeks[weeks.length - 1];
    if (t < first.starts) return { week: 0, status: "pre", note: "The program starts " + dayName(first.starts) + ", " + long(first.starts) + "." };
    if (t > last.ends) return { week: last.week, status: "post", note: "The STEP 2.5 cycle closed on " + long(cohort.ends_on) + "." };
    const w = weeks.find(x => t >= x.starts && t <= x.ends);
    if (w) return { week: w.week, status: "live", note: "" };
    if (t >= BREAK.starts && t <= BREAK.ends) {
      return { week: 9, status: "break", note: "Christmas break — sessions resume " + dayName(BREAK.resumes) + ", " + long(BREAK.resumes) + "." };
    }
    const next = weeks.find(x => x.starts > t) || last;
    return { week: next.week, status: "live", note: "" };
  }

  /* the sessions attendance is taken for, in the order they happen */
  const ATT_LABEL = { OR: "Online orientation", OS: "On-site event", LS: "Learning session", FB: "Feedback session",
                      DD: "Demo Day", GR: "Graduation" };
  function attendanceSessions(n) {
    const w = byWeek(n); if (!w) return [];
    return w.sessions.filter(s => s.att).map(s => ({
      key: s.att, code: w.code + "-" + s.att, date: s.date, end: s.end || null,
      kind: s.kind, title: s.title,
      label: dayName(s.date).slice(0, 3) + (s.end ? "–" + dayName(s.end).slice(0, 3) : "") + " " + range(s.date, s.end) + " · " + ATT_LABEL[s.att],
      short: ATT_LABEL[s.att],
      type: s.kind === "feedback" ? "feedback" : s.kind === "learning" ? "learning" : s.kind,
    }));
  }

  /* "Week of October 26 – November 1, 2026" */
  function periodOf(n) {
    const w = byWeek(n); if (!w) return "";
    const [, ma, da] = w.starts.split("-").map(Number), [yb, mb, db] = w.ends.split("-").map(Number);
    return "Week of " + MONTHS[ma - 1] + " " + da + "–" + (ma === mb ? "" : MONTHS[mb - 1] + " ") + db + ", " + yb;
  }

  /* ---------- the seven days of a week, Monday to Sunday, for This Week ---------- */
  const joinNote = (a, b) => !a ? b : (/[.!?]$/.test(a) ? a : a + ".") + " " + b;
  function daysOf(n) {
    const w = byWeek(n); if (!w) return [];
    const due = dueOf(n), dueDay = due ? due.slice(0, 10) : null;
    const teaching = w.output;
    const out = [];
    for (let i = 0; i < 7; i++) {
      const d = addDays(w.starts, i), name = DAYNAMES[i];
      const here = w.sessions.filter(s => d >= s.date && d <= (s.end || s.date));
      const day = { d, label: name };
      if (here.length) {
        const s = here[0];
        const both = here.length > 1 ? here.slice(1) : [];
        const KIND = { learning: "session", feedback: "panel", orientation: "session", onsite: "onsite", holiday: "holiday" };
        day.kind = KIND[s.kind] || "info";
        if (s.kind === "learning") {
          day.title = (s.adjusted ? "Adjusted learning session · " : "Learning session · ") + s.title;
          day.time = s.time; day.where = "Zoom"; day.note = "Recording posted the same afternoon."; day.action = "recording";
        } else if (s.kind === "feedback") {
          day.title = "Feedback session · " + s.title;
          day.time = s.time; day.where = "Zoom"; day.note = "Five-minute video, then questions from your panel."; day.action = "join";
        } else if (s.kind === "orientation") {
          day.title = s.title; day.where = "Online"; day.note = "How the twelve weeks run, and how to use STEP Hub.";
        } else if (s.kind === "onsite") {
          const multi = s.end && s.end !== s.date;
          /* the day rail is a narrow card: a session can give it a short
             "rail" label to show here, while its full title (used in the
             topic brief, materials and the trainer pages) stays as written */
          const headline = s.rail || s.title.split(/:| — /)[0];
          day.title = (multi ? "On site · Day " + (d === s.date ? 1 : 2) + " — " : "On site · ") + headline;
          day.note = s.title.indexOf(":") > -1 || s.title.indexOf(" — ") > -1 ? s.title.split(/: | — /).slice(1).join(" — ") : "";
          day.where = "On site";
        } else if (s.kind === "holiday") {
          day.title = "No session"; day.note = s.title.replace(/^No Session\s*[-—]\s*/i, "");
        }
        both.forEach(x => {
          if (x.kind === "feedback") {
            day.title += " · Feedback session: " + x.title;
            day.note = joinNote(day.note, "Feedback session online, " + x.time + ".");
            day.action = "join";
          }
        });
        if (d === dueDay) day.note = joinNote(day.note, "Team output due 12:00 NN.");
      } else if (d === dueDay) {
        Object.assign(day, { kind: "deadline", title: "Team output due · " + w.short, time: "12:00 NN",
          note: "Upload the slide deck and the five-minute video on My Team's Work.",
          action: "submit" });
      } else if (teaching && (name === "Wednesday" || name === "Thursday" || name === "Friday")) {
        const wedTaken = w.sessions.some(s => s.date === addDays(w.starts, 2));
        const first = wedTaken ? "Thursday" : "Wednesday";
        Object.assign(day, name === first
          ? { kind: "window", title: "Mentoring window opens", time: first + " to Friday", note: "An hour and a half with your mentor, arranged directly." }
          : { kind: "window", title: "Mentoring continues", time: "Any slot your team booked", note: "Nothing scheduled by the STEP team today." });
      } else {
        Object.assign(day, { kind: "rest", title: "No session", note: name === "Sunday" ? "Rest and regroup." : "Nothing scheduled." });
      }
      out.push(day);
    }
    return out;
  }

  /* the program in calendar order, for timelines */
  function timeline() {
    const rows = [];
    weeks.forEach(w => w.sessions.forEach(s => rows.push(Object.assign({ week: w.week, code: w.code }, s))));
    return rows;
  }

  const teachingWeeks = () => weeks.filter(w => w.output);
  const learningCount = () => weeks.filter(w => w.sessions.some(s => s.kind === "learning")).length;

  window.STEP_SCHEDULE = {
    cohort, weeks, BREAK,
    byWeek, byCode, weekOfCode, label, current, dueOf,
    learningOf, feedbackOf, attendanceSessions, periodOf, daysOf, timeline,
    teachingWeeks, learningCount,
    manilaDay, addDays, dayName, fmtShort: short, fmtLong: long, fmtRange: range,
  };
})();
