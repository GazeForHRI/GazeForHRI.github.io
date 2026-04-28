const charts = {
  lighting: [
    ["PureGaze (E)", 11.41],
    ["GazeTR (E)", 11.65],
    ["PureGaze (G)", 16.14],
    ["GazeTR (G)", 15.25],
    ["L2CS-Net", 18.79],
    ["MCGaze", 15.24],
    ["GaT", 16.71],
  ],
  camera: [
    ["PureGaze (E)", 11.12],
    ["GazeTR (E)", 14.42],
    ["PureGaze (G)", 18.46],
    ["GazeTR (G)", 17.80],
    ["L2CS-Net", 18.15],
    ["MCGaze", 15.57],
    ["GaT", 16.05],
  ],
  conflict: [
    ["PureGaze (E)", 7.25],
    ["GazeTR (E)", 8.67],
    ["PureGaze (G)", 11.38],
    ["GazeTR (G)", 12.93],
    ["L2CS-Net", 16.62],
    ["MCGaze", 20.24],
    ["GaT", 12.09],
  ],
  mutual: [
    ["PureGaze (E)", 5.35],
    ["GazeTR (E)", 10.43],
    ["PureGaze (G)", 9.49],
    ["GazeTR (G)", 7.41],
    ["L2CS-Net", 15.45],
    ["MCGaze", 23.31],
    ["GaT", 16.45],
  ],
};

function renderCharts() {
  document.querySelectorAll("[data-chart]").forEach((chart) => {
    const key = chart.dataset.chart;
    const data = charts[key] || [];
    const max = Math.max(...data.map(([, value]) => value), 1);
    chart.innerHTML = data
      .map(([label, value]) => {
        const width = Math.max(4, (value / max) * 100).toFixed(1);
        return `
          <div class="bar-row">
            <span class="bar-label" title="${label}">${label}</span>
            <span class="bar-track" aria-hidden="true"><span class="bar-fill" style="width:${width}%"></span></span>
            <span class="bar-value">${value.toFixed(1)}°</span>
          </div>`;
      })
      .join("");
  });
}

function initTabs() {
  const container = document.querySelector("[data-tabs]");
  if (!container) return;
  const buttons = [...container.querySelectorAll("[data-tab]")];
  const panels = [...container.querySelectorAll("[data-panel]")];

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab;
      buttons.forEach((btn) => {
        const active = btn === button;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-selected", String(active));
      });
      panels.forEach((panel) => {
        const active = panel.dataset.panel === target;
        panel.classList.toggle("active", active);
        panel.hidden = !active;
      });
    });
  });
}

function initCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const selector = button.dataset.copy;
      const target = document.querySelector(selector);
      if (!target) return;
      try {
        await navigator.clipboard.writeText(target.textContent.trim());
        const original = button.textContent;
        button.textContent = "Copied";
        button.classList.add("copied");
        window.setTimeout(() => {
          button.textContent = original;
          button.classList.remove("copied");
        }, 1600);
      } catch (error) {
        button.textContent = "Copy failed";
      }
    });
  });
}

function initNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const links = document.querySelector("[data-nav-links]");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  const observedSections = [...document.querySelectorAll("main section[id]")];
  const navAnchors = [...links.querySelectorAll("a[href^='#']")];
  const byId = new Map(navAnchors.map((a) => [a.getAttribute("href").slice(1), a]));

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navAnchors.forEach((a) => a.classList.remove("active"));
      const active = byId.get(visible.target.id);
      if (active) active.classList.add("active");
    },
    { rootMargin: "-25% 0px -55% 0px", threshold: [0.15, 0.35, 0.6] }
  );
  observedSections.forEach((section) => observer.observe(section));
}

function initProjectLinks() {
  const links = window.PROJECT_LINKS || {};

  document.querySelectorAll("[data-link]").forEach((element) => {
    const key = element.dataset.link;
    const url = links[key];

    if (!url || url.includes("_LINK_HERE")) {
      element.classList.add("disabled-link");
      element.setAttribute("aria-disabled", "true");
      return;
    }

    element.href = url;

    if (url.startsWith("http")) {
      element.target = "_blank";
      element.rel = "noopener noreferrer";
    }
  });
}

renderCharts();
initTabs();
initCopyButtons();
initNav();
initProjectLinks();