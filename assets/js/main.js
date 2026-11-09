/* =========================================================
   SimpliGarden — interactions
   ========================================================= */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

/* ---------- Header + mobile navigation ---------- */

const header = $("[data-header]");
const menuToggle = $("[data-menu-toggle]");
const siteNav = $("[data-nav]");

function setMenu(open) {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute("aria-expanded", String(open));
  siteNav.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  $$("a", siteNav).forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) setMenu(false);
  });
}

if (header) {
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

/* ---------- Reveal on scroll ---------- */

const revealItems = $$("[data-reveal]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (revealItems.length) {
  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
}

/* ---------- Seasonal tabs ---------- */

const seasonTabs = $$("[data-season]");
const seasonPanels = $$("[data-season-panel]");

if (seasonTabs.length && seasonPanels.length) {
  const activateSeason = (season) => {
    seasonTabs.forEach((tab) => {
      const active = tab.dataset.season === season;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    seasonPanels.forEach((panel) => {
      panel.hidden = panel.dataset.seasonPanel !== season;
    });
  };

  const month = new Date().getMonth();
  const currentSeason =
    month >= 2 && month <= 4
      ? "spring"
      : month >= 5 && month <= 7
        ? "summer"
        : month >= 8 && month <= 10
          ? "autumn"
          : "winter";

  activateSeason(currentSeason);

  seasonTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateSeason(tab.dataset.season));

    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;

      if (event.key === "ArrowRight") nextIndex = (index + 1) % seasonTabs.length;
      else if (event.key === "ArrowLeft") nextIndex = (index - 1 + seasonTabs.length) % seasonTabs.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = seasonTabs.length - 1;
      else return;

      event.preventDefault();
      seasonTabs[nextIndex].focus();
      activateSeason(seasonTabs[nextIndex].dataset.season);
    });
  });
}

/* ---------- Guide library + dialog ---------- */

const guides = {
  "balcony-herbs": {
    title: "The 5-pot balcony herb garden",
    category: "Herbs",
    categories: ["herbs", "small-space"],
    time: "1 hour",
    difficulty: "Easy",
    season: "Spring – summer",
    image: "assets/images/herbs-close.jpg",
    intro:
      "A sunny windowsill or balcony is enough for a summer of basil, mint, rosemary, thyme, and parsley — no garden bed required. The trick is giving each herb the conditions it actually likes, rather than treating them all the same.",
    supplies: [
      "5 pots with drainage holes, roughly 25–30cm wide",
      "Saucers or pot feet to protect the surface below",
      "Peat-free multipurpose compost",
      "Slow-release plant food or a liquid feed",
      "5 herb plants (or seed packs, if you are starting earlier)",
      "A small watering can and snips"
    ],
    steps: [
      "<strong>Check the light.</strong> Basil, rosemary, and thyme want 6+ hours of direct sun. Mint and parsley will cope with 4 hours, or a little light shade.",
      "<strong>Give each herb its own pot.</strong> Mint is the exception that must be alone — it sends runners and will crowd out neighbours.",
      "<strong>Fill and water first.</strong> Leave a 2cm gap below the rim, firm the compost gently, and water before planting so the roots settle in.",
      "<strong>Plant at the same depth.</strong> Tease out the roots, set each herb at the level it was growing in its nursery pot, and firm the compost around it.",
      "<strong>Water and feed.</strong> Water when the top 2cm feels dry. Feed every two weeks through the growing season.",
      "<strong>Harvest kindly.</strong> Pinch basil tips just above a pair of leaves. Never take more than a third of a plant at once."
    ],
    tip: "Group thirsty herbs together and give rosemary its own corner. It would rather dry out than sit in wet compost.",
    why: "Five pots give you a salad, a garnish, and a tiny daily ritual without committing to a whole bed."
  },
  "no-dig-bed": {
    title: "Build a no-dig veggie bed",
    category: "Vegetables",
    categories: ["vegetables"],
    time: "A weekend",
    difficulty: "Easy",
    season: "Autumn – spring",
    image: "assets/images/herbs.jpg",
    intro:
      "No-dig gardening is exactly what it sounds like: you feed the soil from above and let worms, roots, and fungi do the digging. It is kinder to your back, kinder to soil life, and surprisingly good at suppressing weeds.",
    supplies: [
      "Plain cardboard (remove tape and staples)",
      "10–15cm of well-rotted compost or soil improver",
      "A rake",
      "Wooden boards or edging (optional)",
      "Seedlings or seeds",
      "A watering can or hose"
    ],
    steps: [
      "<strong>Choose a sunny spot.</strong> Most vegetables want 6–8 hours of sun. Keep the bed narrow enough to reach the middle from either side — about 1.2m is ideal.",
      "<strong>Clear the surface.</strong> Cut back tall weeds, but leave short grass and low weeds in place. They will break down underneath.",
      "<strong>Lay cardboard.</strong> Overlap the sheets by at least 15cm, then soak them thoroughly. This blocks light and starts the weed-smothering layer.",
      "<strong>Top with compost.</strong> Spread 10–15cm of compost over the cardboard. That is your growing layer — no digging required.",
      "<strong>Plant through the layer.</strong> Make a hole, settle the roots in, and water well. For seeds, sow into a shallow furrow of compost.",
      "<strong>Mulch and repeat.</strong> Top up with compost each season. Avoid walking on the bed; use boards as paths if needed."
    ],
    tip: "Do not dig. Every time you turn the soil you wake up weed seeds and disturb the network of roots and fungi underneath.",
    why: "A no-dig bed gets you growing faster, uses less water, and builds healthier soil with less effort over time."
  },
  "pollinator-pot": {
    title: "A pollinator pot that actually works",
    category: "Flowers",
    categories: ["flowers"],
    time: "30 minutes",
    difficulty: "Easy",
    season: "Spring – summer",
    image: "assets/images/flowers-4.jpg",
    intro:
      "You do not need a meadow to help pollinators. One generous pot packed with the right flowers can become a reliable pit stop for bees, hoverflies, and butterflies — especially if you keep it in flower for months.",
    supplies: [
      "A pot at least 40cm wide with drainage",
      "Peat-free multipurpose compost",
      "5–7 pollinator-friendly plants, such as salvia, lavender, calendula, borage, and verbena",
      "A shallow dish or saucer of water with pebbles",
      "A small trowel"
    ],
    steps: [
      "<strong>Pick the sunniest spot.</strong> Most pollinator plants flower best in full sun. Aim for 6 hours or more.",
      "<strong>Fill the pot.</strong> Leave a 3cm watering gap at the top and firm the compost gently as you go.",
      "<strong>Plant in odd numbers.</strong> A tall plant in the middle, medium plants around it, and a trailing herb at the edge gives the pot a full, natural shape.",
      "<strong>Water deeply.</strong> Water until it runs from the drainage holes, then wait until the top 2cm dries before watering again.",
      "<strong>Keep the flowers coming.</strong> Deadhead regularly and remove spent stems. A plant that keeps flowering keeps feeding pollinators.",
      "<strong>Leave the seedheads.</strong> At the end of the season, let some stems stand. Birds and beneficial insects will use them over winter."
    ],
    tip: "Plant in groups of three or more of the same flower. Pollinators spot larger blocks of colour more easily than single plants dotted around.",
    why: "A single well-planted pot can support dozens of visits a day and gives you a front-row seat to the garden's busiest workers."
  },
  "seed-starting": {
    title: "Start seeds without a greenhouse",
    category: "Seed starting",
    categories: ["seed-starting"],
    time: "20 minutes",
    difficulty: "Easy",
    season: "Late winter – spring",
    image: "assets/images/planting.jpg",
    intro:
      "A warm windowsill, a clean tray, and a little patience are enough to raise your own seedlings. The main things seeds need are steady moisture, warmth, and — once they sprout — plenty of light.",
    supplies: [
      "A clean seed tray or small pots with drainage",
      "Peat-free seed compost",
      "Seeds",
      "A clear lid or plastic bag",
      "Plant labels and a pencil",
      "A bright, warm spot"
    ],
    steps: [
      "<strong>Fill the tray.</strong> Use seed compost rather than multipurpose — it is finer and lower in nutrients. Firm it gently, then water from below.",
      "<strong>Sow thinly.</strong> Check the seed packet for depth. A good rule is to sow at about twice the seed's width. Label everything.",
      "<strong>Cover and keep warm.</strong> A clear lid holds in moisture. Most seeds germinate best at 18–22°C, but check your packet.",
      "<strong>Move into light.</strong> As soon as green shoots appear, remove the cover and move the tray to the brightest windowsill you have. Turn it daily.",
      "<strong>Prick out.</strong> When the first true leaves appear, gently lift seedlings by a leaf and pot them on into slightly larger pots.",
      "<strong>Harden off.</strong> Before planting outside, leave seedlings outdoors for a little longer each day over 7–10 days."
    ],
    tip: "Water from below and keep the surface on the dry side once seedlings are up. Damping-off fungus thrives in cold, soggy compost.",
    why: "Raising your own seeds is cheaper than buying plants, opens up far more varieties, and gives you a head start on the season."
  },
  "small-space-compost": {
    title: "Compost for small spaces",
    category: "Small space",
    categories: ["small-space"],
    time: "Ongoing",
    difficulty: "Easy",
    season: "All year",
    image: "assets/images/garden-4.jpg",
    intro:
      "You do not need a huge heap at the bottom of a garden. A lidded bin on a balcony or beside a back door can turn kitchen scraps and garden trimmings into dark, crumbly compost in six to twelve months.",
    supplies: [
      "A 30–50 litre lidded bin or wormery",
      "A drill for drainage and air holes",
      "A trowel or fork",
      "A mix of 'browns' (cardboard, dry leaves, twigs)",
      "A mix of 'greens' (fruit and veg scraps, grass clippings, coffee grounds)"
    ],
    steps: [
      "<strong>Add drainage and air.</strong> Drill a few holes in the base and upper sides of the bin. Place it on soil or a tray to catch any liquid.",
      "<strong>Layer browns and greens.</strong> Aim for roughly 50/50 by volume. Browns bring carbon and structure; greens bring nitrogen and moisture.",
      "<strong>Chop things up.</strong> Smaller pieces break down faster. Tear cardboard into palm-sized pieces and cut bulky stems.",
      "<strong>Turn it weekly.</strong> Give the contents a mix with a fork to add oxygen. If it smells sour, add more browns and turn again.",
      "<strong>Check moisture.</strong> It should feel like a wrung-out sponge. Add water if it is dusty; add dry leaves if it is slimy.",
      "<strong>Harvest the good stuff.</strong> When the bottom is dark, crumbly, and smells earthy, scoop it out and use it as a soil improver."
    ],
    tip: "Leave out meat, dairy, cooked food, and pet waste from a standard bin. If you want to compost cooked scraps, a sealed bokashi system is a better fit.",
    why: "Composting closes the loop: your kitchen scraps become the food that grows your next meal."
  },
  "window-box-salad": {
    title: "Grow salad in a window box",
    category: "Vegetables",
    categories: ["small-space", "vegetables"],
    time: "45 minutes",
    difficulty: "Easy",
    season: "Spring – autumn",
    image: "assets/images/hero-garden.jpg",
    intro:
      "A 60cm window box can keep you in cut-and-come-again leaves for months. Choose loose-leaf varieties rather than tight hearts, sow little and often, and harvest from the outside in.",
    supplies: [
      "A 60cm window box with drainage and a saucer",
      "Peat-free multipurpose compost",
      "Salad seedlings or seed tape",
      "Liquid feed",
      "Scissors or a sharp knife"
    ],
    steps: [
      "<strong>Check the weight and fixing.</strong> Wet compost is heavy. Make sure your bracket or windowsill can take it, and never hang a box over a busy path without a secure fixing.",
      "<strong>Set up drainage.</strong> Add a layer of crocks or leave the drainage holes clear. A saucer keeps the sill dry.",
      "<strong>Fill with compost.</strong> Leave a 2cm gap below the rim. Water thoroughly before planting or sowing.",
      "<strong>Sow or plant.</strong> Space seedlings 10–15cm apart. For seed tape, follow the packet spacing and cover lightly.",
      "<strong>Water little and often.</strong> Window boxes dry out fast, especially in wind. Check daily in summer and feed every two weeks.",
      "<strong>Harvest from the outside.</strong> Cut outer leaves first and leave the crown to regrow. Sow a new batch every three weeks for a continuous supply."
    ],
    tip: "In midsummer, move the box out of the fiercest afternoon sun. Salad prefers a little shade and bolts quickly in heat.",
    why: "It is the shortest possible route from windowsill to lunch, and a generous box can give you two or three servings a week."
  },
  "cut-flower-corner": {
    title: "A cut-flower corner",
    category: "Flowers",
    categories: ["flowers"],
    time: "1 hour",
    difficulty: "Easy",
    season: "Spring – summer",
    image: "assets/images/flowers-2.jpg",
    intro:
      "One square metre of annual flowers can fill a surprising number of vases. The secret is choosing productive varieties, cutting often, and treating every stem like it is going to a wedding.",
    supplies: [
      "A 1m² bed or three large pots",
      "Compost",
      "Annual flower seeds or plants: cosmos, zinnia, calendula, nigella",
      "Stakes and twine",
      "Sharp snips",
      "A clean bucket of deep water"
    ],
    steps: [
      "<strong>Choose a sunny, sheltered spot.</strong> Cut flowers need light and good air movement. Avoid a corner that stays wet.",
      "<strong>Prepare the soil.</strong> Clear weeds and add a 5cm layer of compost. There is no need to dig it in.",
      "<strong>Plant in a block.</strong> Group plants closely enough to shade the soil, but leave room for air. Stake tall varieties early.",
      "<strong>Water and pinch.</strong> Keep young plants watered. Pinch out the growing tips of cosmos and zinnia to encourage branching and more stems.",
      "<strong>Cut in the cool of the day.</strong> Early morning is best. Cut stems at an angle and plunge them straight into deep water.",
      "<strong>Harvest regularly.</strong> The more you cut, the more flowers many annuals produce. Deadhead anything you leave behind."
    ],
    tip: "Condition flowers in a cool, dark place for a few hours before arranging. It makes a noticeable difference to vase life.",
    why: "Growing your own cut flowers is a small luxury with a big payoff: more blooms, fewer air miles, and a garden that changes every week."
  },
  "houseplant-reset": {
    title: "The no-fail houseplant reset",
    category: "Indoors",
    categories: ["indoors"],
    time: "30 minutes",
    difficulty: "Easy",
    season: "Any time",
    image: "assets/images/tools.jpg",
    intro:
      "Most struggling houseplants are not beyond saving. A simple reset — check the roots, clean the leaves, sort out the light, and stop overwatering — solves more problems than any bottle of plant food.",
    supplies: [
      "Room-temperature water",
      "A shower or deep basin",
      "Sharp snips",
      "Fresh peat-free houseplant compost",
      "A pot one size larger, only if the roots are circling",
      "A soft cloth"
    ],
    steps: [
      "<strong>Check the roots.</strong> Slide the plant out of its pot. Healthy roots are firm and pale. Mushy brown roots mean too much water; a dense circling mat means it needs a bigger pot.",
      "<strong>Give it a shower.</strong> Rinse the leaves in lukewarm water or wipe them with a soft damp cloth. Clean leaves photosynthesise better and shed pests.",
      "<strong>Remove the dead.</strong> Snip yellow leaves, dead stems, and spent flowers. Do not tug — cut cleanly.",
      "<strong>Repot only if needed.</strong> If roots are circling or poking out of the drainage holes, move up one pot size. Otherwise, refresh the top 2cm of compost.",
      "<strong>Water properly.</strong> Water until it runs out of the drainage holes, then empty the saucer. Wait until the top few centimetres are dry before watering again.",
      "<strong>Reassess the light.</strong> Most foliage plants want bright, indirect light. Move the plant closer to a window if it is stretching, or further back if it is scorching."
    ],
    tip: "Yellow leaves are more often a sign of overwatering than underwatering. Check the compost before you reach for the watering can.",
    why: "A reset costs almost nothing and gives you a clear diagnosis. Most houseplants recover quickly once the basics are right."
  },
  "feed-the-soil": {
    title: "Feed your soil, not just your plants",
    category: "Vegetables",
    categories: ["vegetables"],
    time: "30 minutes",
    difficulty: "Easy",
    season: "Spring – autumn",
    image: "assets/images/seedlings.jpg",
    intro:
      "Healthy soil grows healthy plants with less fuss. Instead of reaching for a bottle every week, build a simple routine of top-dressing, mulching, and keeping the soil covered.",
    supplies: [
      "Well-rotted compost or worm castings",
      "A hand fork",
      "Mulch: straw, leaf mould, or fine bark",
      "A watering can"
    ],
    steps: [
      "<strong>Look before you feed.</strong> Dig a small hole. Earthworms, crumbly structure, and a dark colour are good signs. Waterlogged or compacted soil needs compost and aeration more than fertiliser.",
      "<strong>Top-dress.</strong> Spread a 2–3cm layer of compost around established plants, keeping it clear of stems.",
      "<strong>Mulch the surface.</strong> Cover bare soil with straw, leaf mould, or fine bark. Mulch holds moisture, suppresses weeds, and feeds the soil as it breaks down.",
      "<strong>Do not leave soil bare.</strong> Bare soil bakes, erodes, and loses structure. Grow a cover crop or add mulch after every harvest.",
      "<strong>Rotate crops.</strong> Move plant families around the bed each year. This prevents pests and diseases from building up in one spot.",
      "<strong>Feed the plants that need it.</strong> Heavy feeders such as tomatoes and courgettes may still want a liquid feed. Most established plants do not."
    ],
    tip: "Compost is a soil improver, not a fertiliser. It feeds the life in the soil, which in turn feeds your plants.",
    why: "Soil is the engine of the garden. Spend your effort there and the plants become much less needy."
  }
};

const guideDialog = $("#guide-dialog");
const guideDialogContent = $("#guide-dialog-content");
const guideCards = $$("[data-guide-card]");

function guideMarkup(guide) {
  return `
    <div class="dialog-hero">
      <img src="${guide.image}" alt="${guide.title}">
      <div class="dialog-hero-content">
        <span class="guide-card-tag">${guide.category}</span>
        <h2 id="guide-dialog-title">${guide.title}</h2>
        <div class="guide-meta">
          <span>${guide.time}</span>
          <span>${guide.difficulty}</span>
          <span>${guide.season}</span>
        </div>
      </div>
    </div>
    <div class="dialog-body">
      <p class="dialog-intro">${guide.intro}</p>
      <div class="dialog-grid">
        <section>
          <h3>What you'll need</h3>
          <ul class="dialog-list">
            ${guide.supplies.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </section>
        <section>
          <h3>At a glance</h3>
          <dl class="dialog-facts">
            <div><dt>Time</dt><dd>${guide.time}</dd></div>
            <div><dt>Difficulty</dt><dd>${guide.difficulty}</dd></div>
            <div><dt>Best season</dt><dd>${guide.season}</dd></div>
            <div><dt>Space</dt><dd>${guide.categories.includes("small-space") ? "Small space friendly" : "Any garden"}</dd></div>
          </dl>
        </section>
      </div>
      <h3 style="margin-top: 32px;">Step by step</h3>
      <ol class="dialog-steps">
        ${guide.steps.map((step) => `<li>${step}</li>`).join("")}
      </ol>
      <div class="dialog-tip">
        <strong>One good tip</strong>
        ${guide.tip}
      </div>
      <p class="dialog-why">${guide.why}</p>
    </div>
  `;
}

function syncGuideUrl(id) {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set("guide", id);
  else url.searchParams.delete("guide");
  window.history.replaceState({}, "", url.pathname + url.search);
}

function openGuide(id, updateUrl = true) {
  if (!guideDialog || !guideDialogContent || !guides[id]) return;

  guideDialogContent.innerHTML = guideMarkup(guides[id]);
  document.body.classList.add("dialog-open");

  if (typeof guideDialog.showModal === "function") {
    if (!guideDialog.open) guideDialog.showModal();
  } else {
    guideDialog.setAttribute("open", "");
  }

  const closeButton = $("[data-dialog-close]", guideDialog);
  if (closeButton) closeButton.focus({ preventScroll: true });
  if (updateUrl) syncGuideUrl(id);
}

function closeGuide() {
  if (!guideDialog) return;
  if (typeof guideDialog.close === "function" && guideDialog.open) guideDialog.close();
  else guideDialog.removeAttribute("open");
}

if (guideDialog) {
  const closeButton = $("[data-dialog-close]", guideDialog);

  if (closeButton) closeButton.addEventListener("click", closeGuide);

  guideDialog.addEventListener("click", (event) => {
    if (event.target === guideDialog) closeGuide();
  });

  guideDialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    syncGuideUrl(null);
  });
}

if (guideCards.length && guideDialog) {
  guideCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      const id = card.dataset.guideCard;
      if (!id || !guides[id]) return;
      event.preventDefault();
      openGuide(id);
    });
  });
}

/* ---------- Guide filtering + search ---------- */

const filterButtons = $$("[data-filter]");
const guideSearch = $("[data-guide-search]");
const guideCount = $("[data-guide-count]");
const emptyState = $("[data-empty-state]");

let activeFilter = "all";

function applyGuideFilters() {
  if (!guideCards.length) return;

  const term = guideSearch ? guideSearch.value.trim().toLowerCase() : "";

  let visible = 0;

  guideCards.forEach((card) => {
    const categories = (card.dataset.categories || "").split(" ");
    const matchesFilter = activeFilter === "all" || categories.includes(activeFilter);
    const haystack = `${card.dataset.title || ""} ${card.textContent}`.toLowerCase();
    const matchesSearch = !term || haystack.includes(term);
    const show = matchesFilter && matchesSearch;

    card.hidden = !show;
    if (show) visible += 1;
  });

  if (guideCount) guideCount.textContent = `${visible} guide${visible === 1 ? "" : "s"}`;
  if (emptyState) emptyState.hidden = visible !== 0;
}

function setFilter(filter, updateUrl = true) {
  activeFilter = filter;

  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
  });

  applyGuideFilters();

  if (updateUrl) {
    const url = new URL(window.location.href);
    if (filter === "all") url.searchParams.delete("filter");
    else url.searchParams.set("filter", filter);
    url.searchParams.delete("guide");
    window.history.replaceState({}, "", url.pathname + url.search);
  }
}

if (filterButtons.length) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => setFilter(button.dataset.filter));
  });
}

if (guideSearch) {
  guideSearch.addEventListener("input", applyGuideFilters);
}

const params = new URLSearchParams(window.location.search);
const requestedFilter = params.get("filter");

if (requestedFilter && filterButtons.some((button) => button.dataset.filter === requestedFilter)) {
  setFilter(requestedFilter, false);
} else {
  applyGuideFilters();
}

const requestedGuide = params.get("guide");
if (requestedGuide && guides[requestedGuide]) {
  window.requestAnimationFrame(() => openGuide(requestedGuide, false));
}

/* ---------- Newsletter forms ---------- */

$$(".js-newsletter-form").forEach((form) => {
  const status = form.parentElement.querySelector("[data-newsletter-status]");
  const emailInput = form.querySelector('input[type="email"]');

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!status || !emailInput) return;

    if (!emailInput.checkValidity() || !emailInput.value.trim()) {
      status.textContent = "Please enter a valid email address.";
      status.className = "form-status is-error";
      emailInput.focus();
      return;
    }

    const email = emailInput.value.trim();

    try {
      const list = JSON.parse(window.localStorage.getItem("simpligarden-subscribers") || "[]");
      if (!list.includes(email)) list.push(email);
      window.localStorage.setItem("simpligarden-subscribers", JSON.stringify(list));
    } catch (error) {
      /* Local storage may be unavailable; the planner link still works. */
    }

    form.reset();
    status.innerHTML = 'You’re in. <a href="planner.html">Open your printable planner →</a>';
    status.className = "form-status is-success";
  });
});

/* ---------- Contact form ---------- */

const contactForm = $("[data-contact-form]");

if (contactForm) {
  const status = $("[data-contact-status]");

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!status) return;

    if (!contactForm.checkValidity()) {
      status.textContent = "Please fill in your name, email, and message.";
      status.className = "form-status is-error";
      return;
    }

    const data = new FormData(contactForm);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const topic = String(data.get("topic") || "General question");
    const message = String(data.get("message") || "").trim();

    const subject = encodeURIComponent(`SimpliGarden website: ${topic}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

    status.textContent = "Opening your email app. If nothing happens, write to hello@simpligarden.com.";
    status.className = "form-status is-success";
    window.location.href = `mailto:hello@simpligarden.com?subject=${subject}&body=${body}`;
  });
}

/* ---------- Footer year ---------- */

$$("[data-year]").forEach((year) => {
  year.textContent = String(new Date().getFullYear());
});
