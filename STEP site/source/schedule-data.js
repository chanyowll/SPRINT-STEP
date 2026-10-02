/* =====================================================================
   STEP Hub — the STEP 2.5 program schedule

   Taken from the "STEP 2.5 Kick Off Tracker" (Trainer's Timeline sheet),
   Updated Schedule: October 20, 2026 – January 29, 2027.

   Each week has a short name the program uses everywhere (title), and
   the topic exactly as the tracker words it (topic).

   The program runs by WEEK NUMBER, not by module:
     W0   Pre-program online orientation (Tue Oct 20)
     W1   Program launch, on site (Thu–Fri Oct 29–30): team formation,
          technology entrepreneurship and the market basics
     W2   No lesson — the market map from the launch is reviewed (Sat Nov 7)
     W3–W5, W7–W11  one topic a week: Tuesday learning session, Saturday
          feedback session (W7 and W8 move to Wednesday)
     W6   Mid-Program Checkpoint on site (Thu–Fri Dec 3–4): IP and finance
     —    Christmas break, Dec 21 – Jan 3 (not counted as a week)
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
      week: 0, code: "W0", starts: "2026-10-19", ends: "2026-10-25",
      title: "Pre-Program: STEP Onboarding", short: "Pre-Program: STEP Onboarding", axis: "Pre-Program\nonboarding",
      topic: "Pre-Program: STEP Onboarding",
      milestone: "Kick-Off", trainer: "STEP Team",
      sessions: [
        { date: "2026-10-20", kind: "orientation", att: "OR", mode: "Online",
          title: "Pre-Program: STEP Onboarding" },
      ],
      output: false,
      tagline: "Meet the program, the people and the platform before the work starts.",
      brief: "A short online session before the launch: how the twelve weeks run, what each team is expected to do every week, and how STEP Hub, the mentors and the Saturday panels fit together. Come with questions — this is the time to ask them.",
      able: [
        "Explain how a program week runs, from the learning session to Saturday's panel",
        "Find your materials, hand-ins and feedback on STEP Hub",
        "Name the team members who will attend each session",
      ],
      produce: "Nothing to hand in yet. Make sure everyone on the team can sign in to STEP Hub before the launch.",
      game: {
        title: "Put a program week in order",
        prompt: "Every teaching week follows the same rhythm. Drag the cards into the order they happen.",
        steps: [
          { order: 1, label: "Learning session", why: "The week's topic is taught first, so everything after it builds on the session." },
          { order: 2, label: "Mentoring, midweek", why: "Your mentor helps you turn the session into your team's own output." },
          { order: 3, label: "Team output due Friday, 12:00 NN", why: "The panel reads your work before they meet you." },
          { order: 4, label: "Saturday feedback session", why: "A five-minute video, then questions from your panel." },
          { order: 5, label: "Next week's topic", why: "The panel's comments become your short list for the week ahead." },
        ],
      },
    },
    {
      week: 1, code: "W1", starts: "2026-10-26", ends: "2026-11-01",
      title: "Program Launch: Team Formation & Technology Entrepreneurship", short: "Program Launch: Team Formation & Technology Entrepreneurship", axis: "Program\nlaunch",
      topic: "Program Launch, Team Formation Workshop, Technology Entrepreneurship, Time and Resource Management, Marketing Basics, Ecosystem & Vertical Market Mapping, Beachhead Market and Customer Segments, Market Research Workshop",
      sessions: [
        { date: "2026-10-29", end: "2026-10-30", kind: "onsite", att: "OS", mode: "On site",
          title: "Program Launch: Team Formation Workshop, Technology Entrepreneurship, Time and Resource Management, Marketing Basics, Ecosystem & Vertical Market Mapping, Beachhead Market and Customer Segments, Market Research Workshop",
          rail: "Program Launch & Team Formation" },
      ],
      output: false,
      tagline: "Two days on site to form the team, learn the market basics and map the ecosystem around your technology.",
      brief: "The cycle opens in person. Teams settle who does what, get an overview of technology entrepreneurship and of managing their time and resources, then go straight into the market: marketing basics, a first map of the ecosystem and vertical markets around the technology, the idea of a beachhead market, and a market research workshop to take home.",
      able: [
        "Agree on your team's roles for the cycle",
        "Map the ecosystem your technology would enter and the vertical markets it could serve",
        "Explain what a beachhead market is and shortlist candidates for yours",
      ],
      produce: "Your team's roles, agreed before you leave the launch, and a first ecosystem and vertical market map to finish for the Week 2 review.",
      game: {
        title: "From the lab to a first market",
        prompt: "The launch, in the order the work is done. Drag the cards into order.",
        steps: [
          { order: 1, label: "Form the team and agree the roles", why: "Everything after this needs someone responsible for it." },
          { order: 2, label: "Say what the technology does better", why: "Start from the advantage, in plain words." },
          { order: 3, label: "List who could use it", why: "Users and buyers, before any business model." },
          { order: 4, label: "Map the ecosystem and vertical markets", why: "Suppliers, channels, regulators, competitors — and the markets they serve." },
          { order: 5, label: "Shortlist beachhead candidates", why: "One of these becomes the market you try to win first." },
        ],
      },
    },
    {
      week: 2, code: "W2", starts: "2026-11-02", ends: "2026-11-08",
      title: "Market Mapping Review", short: "Market Mapping Review", axis: "Market mapping\nreview",
      topic: "Output Presentation on Market Mapping",
      review: "Output Presentation on Market Mapping",
      sessions: [
        { date: "2026-11-07", kind: "feedback", att: "FB", mode: "Online", time: FB_TIME,
          title: "Output Presentation on Market Mapping" },
      ],
      output: true,
      tagline: "Show the panel every player around your technology.",
      brief: "No new lesson this week: the ecosystem and vertical market map begun at the launch is finished with your mentor and presented to the panel on Saturday. Suppliers, users, buyers, regulators, funders and competitors — and the vertical markets where the technology could be applied — become the shortlist the following weeks work from.",
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
      week: 3, code: "W3", starts: "2026-11-09", ends: "2026-11-15",
      title: "Beachhead Market & Customer Segments", short: "Beachhead Market & Customer Segments", axis: "Beachhead market\n& segments",
      topic: "Marketing (Part 2): Beachhead Market, Customer Segments, Problem-Solution Fit, Value Proposition Statement",
      review: "Beachhead Market and Customer Segments Review", trainer: "Sir Tony",
      sessions: [
        { date: "2026-11-10", kind: "learning", att: "LS", mode: "Online", time: LS_TIME,
          title: "Beachhead Market, Customer Segments, Problem-Solution Fit, Value Proposition Statement" },
        { date: "2026-11-14", kind: "feedback", att: "FB", mode: "Online", time: FB_TIME,
          title: "Beachhead Market and Customer Segments Review" },
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
      week: 4, code: "W4", starts: "2026-11-16", ends: "2026-11-22",
      title: "Competitive Advantage", short: "Competitive Advantage", axis: "Competitive\nadvantage",
      topic: "Competitive Advantage, VRIO Framework, Competitor Profile Matrix",
      review: "Competitive Positioning Review", trainer: "Sir GQ",
      sessions: [
        { date: "2026-11-17", kind: "learning", att: "LS", mode: "Online", time: LS_TIME,
          title: "Competitive Advantage, VRIO Framework, Competitor Profile Matrix" },
        { date: "2026-11-21", kind: "feedback", att: "FB", mode: "Online", time: FB_TIME,
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
      produce: "Your Competitor Profile Matrix, VRIO analysis and a first Lean Canvas — plus the five-minute video.",
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
      week: 5, code: "W5", starts: "2026-11-23", ends: "2026-11-29",
      title: "Business Model Validation", short: "Business Model Validation", axis: "Business model\nvalidation",
      topic: "Business Model Validation, Market Validation, Industry Validation",
      review: "Business Model Validation Review",
      sessions: [
        { date: "2026-11-24", kind: "learning", att: "LS", mode: "Online", time: LS_TIME,
          title: "Business Model Validation, Market Validation, Industry Validation" },
        { date: "2026-11-28", kind: "feedback", att: "FB", mode: "Online", time: FB_TIME,
          title: "Business Model Validation Review" },
      ],
      output: true,
      tagline: "Test the business model with the people who would pay for it.",
      brief: "Teams test the business model against reality: what customers, the market and industry players say about the channels, costs and revenue the model depends on. The Lean Canvas is refined with the evidence, and the Business Model Canvas starts its move from startup to scale-up.",
      able: [
        "Refine your Lean Canvas with what you have learned",
        "Validate your model with customers, the market and industry",
        "Move your Business Model Canvas from startup to scale-up",
      ],
      produce: "A refined Lean Canvas and a scale-up Business Model Canvas with the validation behind it — plus the five-minute video.",
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
      week: 6, code: "W6", starts: "2026-11-30", ends: "2026-12-06",
      title: "Mid-Program Checkpoint: IP & Finance", short: "Mid-Program Checkpoint: IP & Finance", axis: "Checkpoint:\nIP & finance",
      topic: "Mid-Program Checkpoint: Overview of IP and Basics of Patent, Prior Art Search, IP Strategy and Freedom to Operate, IP Clinic, Basics of Finance, Cost Estimates, Cost-Benefit and Break-Even Analysis, Discounted Cash Flow and ROI, Sensitivity Analysis, Five-Year Projection, Presentation of Outputs",
      milestone: "Mid-Program Checkpoint", trainer: "Doc Jon (IP) · finance trainer to be announced",
      sessions: [
        { date: "2026-12-03", end: "2026-12-04", kind: "onsite", att: "OS", mode: "On site",
          title: "Mid-Program Checkpoint: IP and Finance — Overview of IP and Basics of Patent, Prior Art Search, IP Strategy and Freedom to Operate, IP Clinic, Basics of Finance, Cost-Benefit and Break-Even Analysis, Discounted Cash Flow and ROI, Sensitivity Analysis, Five-Year Projection, Presentation of Outputs",
          rail: "Mid-Program Checkpoint: IP & Finance" },
      ],
      output: false,
      tagline: "Halfway: protect the technology, then put numbers behind it.",
      brief: "Two days on site. The first half is intellectual property — what a patent protects, searching the prior art around your core technology, an IP strategy that keeps your freedom to operate, and an IP clinic with the AIPO team. The second half is finance — fixed, variable and investment costs, cost-benefit and break-even, discounted cash flow and ROI, sensitivity, and a five-year projection as the sustainability plan. Teams present their outputs before leaving.",
      able: [
        "Explain what your patent would protect and what the prior art search found",
        "Outline an IP strategy that keeps your freedom to operate",
        "Build a first cost estimate, break-even and five-year projection for the venture",
      ],
      produce: "Your IP strategy and first financial projection, presented on site at the checkpoint.",
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
      week: 7, code: "W7", starts: "2026-12-07", ends: "2026-12-13",
      title: "Go-to-Market & Lean Canvas", short: "Go-to-Market & Lean Canvas", axis: "Go-to-market\n& Lean Canvas",
      topic: "Go-To-Market Plan & Lean Canvas",
      review: "Presentation of Outputs: Go-to-Market Plan and Lean Canvas", trainer: "Sir GQ",
      sessions: [
        { date: "2026-12-08", kind: "holiday", mode: "No session",
          title: "No Session — Feast of the Immaculate Conception" },
        { date: "2026-12-09", kind: "learning", att: "LS", mode: "Online", time: LS_TIME, adjusted: true,
          title: "Go-To-Market Plan & Lean Canvas" },
        { date: "2026-12-12", kind: "feedback", att: "FB", mode: "Online", time: FB_TIME,
          title: "Presentation of Outputs: Go-to-Market Plan and Lean Canvas" },
      ],
      output: true,
      tagline: "Plan how you reach the first customers.",
      brief: "The learning session moves to Wednesday because of the holiday. Turn the beachhead into a plan: the strategy canvas that sets you apart, the channels you will test with the bullseye framework, and a go-to-market Gantt chart for the months ahead — with a complete Lean Canvas behind it.",
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
      week: 8, code: "W8", starts: "2026-12-14", ends: "2026-12-20",
      title: "Selling Skills", short: "Selling Skills", axis: "Selling\nskills",
      topic: "Selling Skill",
      review: "Presentation of Outputs: Selling", trainer: "Sir GQ",
      sessions: [
        { date: "2026-12-15", kind: "learning", att: "LS", mode: "Online", time: LS_TIME, adjusted: true,
          title: "Selling Skill" },
        { date: "2026-12-19", kind: "feedback", att: "FB", mode: "Online", time: FB_TIME,
          title: "Presentation of Outputs: Selling" },
      ],
      output: true,
      tagline: "Turn the value proposition into a conversation a customer says yes to.",
      brief: "The last week before the break is about the sales conversation itself: how to open with the customer's problem, ask and listen before you present, show the value in the customer's own numbers, handle the objections you will certainly hear, and ask for a next step. Teams practise it on their beachhead customer.",
      able: [
        "Structure a sales conversation from the customer's problem to a next step",
        "Answer the three objections your beachhead customer is most likely to raise",
        "Ask for a concrete next step — a trial, a visit, a letter of intent",
      ],
      produce: "A five-minute recorded sales conversation with one beachhead customer, with your objection-handling notes.",
      game: {
        title: "Run the sales conversation",
        prompt: "One customer conversation, start to finish. Drag the cards into order.",
        steps: [
          { order: 1, label: "Open with the customer's problem", why: "Their pain, not your technology." },
          { order: 2, label: "Ask and listen", why: "Find out how they handle it today and what it costs them." },
          { order: 3, label: "Show the value in their numbers", why: "The quantified value proposition, in terms they can check." },
          { order: 4, label: "Handle the objection", why: "Price, risk, switching — answer it, do not argue with it." },
          { order: 5, label: "Ask for the next step", why: "A trial, a visit or a letter of intent, with a date." },
        ],
      },
    },
    {
      week: 9, code: "W9", starts: "2027-01-04", ends: "2027-01-10",
      title: "Pitching Skills", short: "Pitching Skills", axis: "Pitching\nskills",
      topic: "Pitching Skill",
      review: "Presentation of Outputs: Pitch", trainer: "Sir GQ",
      sessions: [
        { date: "2027-01-05", kind: "learning", att: "LS", mode: "Online", time: LS_TIME,
          title: "Pitching Skill" },
        { date: "2027-01-09", kind: "feedback", att: "FB", mode: "Online", time: FB_TIME,
          title: "Presentation of Outputs: Pitch" },
      ],
      output: true,
      tagline: "Tell the whole story in five minutes, to a panel that has heard a hundred.",
      brief: "Back from the break, teams learn to pitch: the spine of a pitch from problem to ask, what to leave out, how to use the time, and how to answer hard questions without losing the room. Saturday's panel hears the first full pitch of the cycle.",
      able: [
        "Structure a five-minute pitch from the problem to the ask",
        "Deliver it on time, with the deck supporting the story rather than replacing it",
        "Answer tough questions from investors and industry without losing the thread",
      ],
      produce: "Your five-minute pitch, recorded, and the deck behind it.",
      game: {
        title: "Order the pitch",
        prompt: "The spine of a pitch. Drag the cards into the order you would present them.",
        steps: [
          { order: 1, label: "The problem", why: "Whose pain, and how big." },
          { order: 2, label: "Your solution", why: "What the technology does about it." },
          { order: 3, label: "The market", why: "Beachhead, size and who comes next." },
          { order: 4, label: "Business model and evidence", why: "How it makes money, and the validation so far." },
          { order: 5, label: "The ask", why: "What you need, and what it will achieve." },
        ],
      },
    },
    {
      week: 10, code: "W10", starts: "2027-01-11", ends: "2027-01-17",
      title: "Technology Roadmapping", short: "Technology Roadmapping", axis: "Technology\nroadmapping",
      topic: "Technology Roadmapping",
      review: "Presentation of Outputs: Technology Roadmap", trainer: "Sir Benjie",
      sessions: [
        { date: "2027-01-12", kind: "learning", att: "LS", mode: "Online", time: LS_TIME,
          title: "Technology Roadmapping" },
        { date: "2027-01-16", kind: "feedback", att: "FB", mode: "Online", time: FB_TIME,
          title: "Presentation of Outputs: Technology Roadmap" },
      ],
      output: true,
      tagline: "Lay out how the technology gets from today's prototype to a product in the market.",
      brief: "A roadmap for the technology itself: where it is now on the readiness scale, where the market needs it to be, and the milestones in between — each with its timing, cost, risks and the person responsible. This is the plan the FASTRAC proposal and the Demo Day pitch are built on.",
      able: [
        "State your technology's readiness level now and the level the market needs",
        "Set the milestones in between, with timing and cost for each",
        "Name the risks on the way and who owns them",
      ],
      produce: "Your technology roadmap: milestones from prototype to market, with timing, cost and the people responsible — plus the five-minute video.",
      game: {
        title: "Build the roadmap",
        prompt: "From today's prototype to a product in the market. Drag the cards into order.",
        steps: [
          { order: 1, label: "Where the technology is now", why: "Its readiness level today, honestly stated." },
          { order: 2, label: "Where the market needs it to be", why: "The level a customer can actually buy and use." },
          { order: 3, label: "The milestones in between", why: "Prototype, pilot, certification, first production." },
          { order: 4, label: "Time and cost per milestone", why: "What each step takes, in months and pesos." },
          { order: 5, label: "Risks and who owns them", why: "What could slip, and whose job it is to stop it." },
        ],
      },
    },
    {
      week: 11, code: "W11", starts: "2027-01-18", ends: "2027-01-24",
      title: "FASTRAC Proposal", short: "FASTRAC Proposal", axis: "FASTRAC\nproposal",
      topic: "FASTRAC Proposal Workshop",
      review: "Presentation of Outputs: FASTRAC Proposal", trainer: "Sir Steve",
      sessions: [
        { date: "2027-01-19", kind: "learning", att: "LS", mode: "Online", time: LS_TIME,
          title: "FASTRAC Proposal Workshop" },
        { date: "2027-01-23", kind: "feedback", att: "FB", mode: "Online", time: FB_TIME,
          title: "Presentation of Outputs: FASTRAC Proposal" },
      ],
      output: true,
      tagline: "Turn twelve weeks of work into a DOST FASTRAC proposal.",
      brief: "A workshop on the DOST FASTRAC proposal: what each item of the form asks for, which of your earlier outputs answers it — the beachhead, the competitive analysis, the validated model, the IP strategy, the financials, the roadmap — and how to write the budget and the plan so a reviewer can follow them. Teams leave with a complete first draft on My Team's Capstone.",
      able: [
        "Know what every item of the FASTRAC form asks for",
        "Fill the case and the plan from the outputs of the earlier weeks",
        "Write a budget and a milestone plan a reviewer can follow",
      ],
      produce: "A complete first draft of your FASTRAC proposal on My Team's Capstone, ready to become the capsule for Demo Day — plus the five-minute video.",
      game: {
        title: "Fill the FASTRAC form in order",
        prompt: "The proposal, section by section. Drag the cards into the order you would fill them.",
        steps: [
          { order: 1, label: "Project profile", why: "Title, agency, site, type of research — the facts first." },
          { order: 2, label: "The case", why: "Summary, rationale, objectives and the prior art." },
          { order: 3, label: "Market and commercial viability", why: "Beachhead, competition, channels and the sales forecast." },
          { order: 4, label: "The plan", why: "Methodology, technology roadmap, outputs and outcomes." },
          { order: 5, label: "Resources and budget", why: "People, equipment and the money, by year." },
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
          title: "Demo Day — Final Presentations" },
        { date: "2027-01-29", kind: "onsite", att: "GR", mode: "On site",
          title: "Graduation Ceremony and Ecosystem Networking" },
      ],
      output: false,
      tagline: "Present the venture, submit the FASTRAC capsule, and graduate.",
      brief: "Teams give their final presentations on Demo Day in front of investors and industry, with their technology roadmap, and submit the FASTRAC capsule. Friday closes the cycle with the graduation ceremony and ecosystem networking.",
      able: [
        "Deliver a final pitch that holds together from problem to ask",
        "Show a technology roadmap you can defend",
        "Submit your FASTRAC capsule",
      ],
      produce: "Your final presentation, technology roadmap and FASTRAC capsule, submitted on Demo Day.",
      game: {
        title: "Demo Day, in order",
        prompt: "The last week of the cycle. Drag the cards into the order they happen.",
        steps: [
          { order: 1, label: "Rehearse with your mentor", why: "The pitch is timed and the questions are rehearsed before the day." },
          { order: 2, label: "Submit the FASTRAC capsule", why: "The proposal goes in before you present, not after." },
          { order: 3, label: "Set up and test the demo", why: "Whatever can fail on stage is tested off it." },
          { order: 4, label: "Pitch", why: "Five minutes, problem to ask." },
          { order: 5, label: "Answer the panel", why: "Investors and industry ask; the team answers as one." },
        ],
      },
    },
  ];

  const BREAK = { starts: "2026-12-21", ends: "2027-01-03", resumes: "2027-01-05" };
  const cohort = {
    code: "STEP2.5", name: "STEP 2.5", timezone: "Asia/Manila",
    starts_on: "2026-10-20", ends_on: "2027-01-29", weeks_total: 12,
    source: "STEP 2.5 Kick Off Tracker — Trainer's Timeline, Updated Schedule: October 20, 2026 – January 29, 2027",
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
    if (t < first.starts) { const d0 = (first.sessions[0] || {}).date || first.starts;
      return { week: 0, status: "pre", note: "The program starts " + dayName(d0) + ", " + long(d0) + "." }; }
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
