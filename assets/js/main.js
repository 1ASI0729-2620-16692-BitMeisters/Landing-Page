/* Set the full application URL when available; otherwise CTAs open the local demo. */
const PLATFORM_URL =
  "https://1asi0729-2620-16692-bitmeisters.github.io/Frontend-Web-Application/";
/* Set the YouTube video ids of About the Product and About the Team to replace their placeholders. */
const PRODUCT_VIDEO_ID = "";
const TEAM_VIDEO_ID = "";
const LANGUAGES = ["en-US", "es-419"];
const DEFAULT_LANGUAGE = "en-US";
const MESSAGES = window.FLEETSAFE_I18N || {};
let language = DEFAULT_LANGUAGE;
try {
  const stored = localStorage.getItem("fleetsafe-language");
  if (LANGUAGES.includes(stored)) language = stored;
} catch (_) {
  /* Storage may be unavailable when opening a local file. */
}
const t = (key, params = {}) =>
  (
    (MESSAGES[language] || {})[key] ??
    MESSAGES[DEFAULT_LANGUAGE]?.[key] ??
    key
  ).replace(/\{(\w+)\}/g, (_, name) => params[name] ?? "");
const menu = document.querySelector(".menu");
const navigation = document.querySelector("#navigation");
const dialog = document.querySelector("#inspection-dialog");
let currentInspection = null;
function updateMenuLabel() {
  menu.setAttribute(
    "aria-label",
    t(
      menu.getAttribute("aria-expanded") === "true"
        ? "app.close-menu"
        : "header.open-menu",
    ),
  );
}
function closeMenu() {
  menu.setAttribute("aria-expanded", "false");
  navigation.classList.remove("open");
  updateMenuLabel();
}
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  navigation.classList.toggle("open", open);
  updateMenuLabel();
});
navigation
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("open")) {
    closeMenu();
    menu.focus();
  }
});
window.matchMedia("(min-width:801px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});
document.querySelectorAll(".avatar img").forEach((img) => {
  const fallback = () => img.classList.add("failed");
  img.addEventListener("error", fallback);
  if (img.complete && !img.naturalWidth) fallback();
});
function updateCount() {
  const count = [...document.querySelectorAll("tr[data-status]")].filter(
    (row) => !row.hidden,
  ).length;
  document.querySelector("#result-count").textContent = t(
    count === 1 ? "app.sample-count-one" : "app.sample-count-other",
    { count },
  );
}
document.querySelectorAll("[data-filter]").forEach((button) =>
  button.addEventListener("click", () => {
    document
      .querySelectorAll("[data-filter]")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
    document.querySelectorAll("tr[data-status]").forEach((row) => {
      row.hidden =
        button.dataset.filter !== "all" &&
        row.dataset.status !== button.dataset.filter;
    });
    updateCount();
  }),
);
const examples = {
  ok: {
    unit: "FS-024",
    time: "07:42",
    label: "demo.cleared",
    css: "",
    checks: [
      ["app.mechanical-components", "app.passed"],
      ["app.safety-equipment", "app.complete"],
      ["app.documentation", "app.valid"],
    ],
    note: "app.this-sample-inspection-meets-the-configured",
  },
  warn: {
    unit: "FS-018",
    time: "07:35",
    label: "demo.flagged",
    css: "warn",
    checks: [
      ["app.mechanical-components", "app.passed"],
      ["app.safety-equipment", "app.complete"],
      ["app.documentation", "app.expiring-soon"],
    ],
    note: "app.example-of-a-documentation-flag-the",
  },
  stop: {
    unit: "FS-032",
    time: "07:21",
    label: "demo.not-cleared",
    css: "stop",
    checks: [
      ["app.braking-system", "app.fault-reported"],
      ["app.safety-equipment", "app.complete"],
      ["app.documentation", "app.valid"],
    ],
    note: "app.example-of-a-critical-issue-the",
  },
};
function renderInspection() {
  if (!currentInspection) return;
  const item = examples[currentInspection];
  document.querySelector("#inspection-title").textContent = t(
    "app.vehicle-title",
    { unit: item.unit },
  );
  document.querySelector("#inspection-description").textContent = t(
    "app.inspection-description",
    { time: item.time },
  );
  const badge = document.createElement("span");
  badge.className = "badge " + item.css;
  badge.textContent = t(item.label);
  document.querySelector("#inspection-status").replaceChildren(badge);
  const list = document.querySelector("#inspection-checks");
  list.replaceChildren();
  item.checks.forEach(([name, result]) => {
    const li = document.createElement("li");
    const label = document.createElement("span");
    const value = document.createElement("strong");
    label.textContent = t(name);
    value.textContent = t(result);
    li.append(label, value);
    list.append(li);
  });
  document.querySelector("#inspection-note").textContent = t(item.note);
}
document.querySelectorAll("[data-detail]").forEach((button) =>
  button.addEventListener("click", () => {
    currentInspection = button.dataset.detail;
    renderInspection();
    dialog.showModal();
  }),
);
document
  .querySelectorAll(".close,#close-detail")
  .forEach((button) => button.addEventListener("click", () => dialog.close()));
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  }
});
function setLanguage(next, announce = false) {
  language = LANGUAGES.includes(next) ? next : DEFAULT_LANGUAGE;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  for (const attr of ["aria-label", "alt", "content"])
    document.querySelectorAll(`[data-i18n-${attr}]`).forEach((element) => {
      element.setAttribute(attr, t(element.getAttribute(`data-i18n-${attr}`)));
    });
  document
    .querySelectorAll("[data-language]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.language === language),
      ),
    );
  updateMenuLabel();
  updateCount();
  renderInspection();
  if (PLATFORM_URL && /^https:\/\//.test(PLATFORM_URL))
    document.querySelectorAll("[data-app-link]").forEach((link) => {
      link.href = PLATFORM_URL;
      link.firstChild.textContent = t("app.go-to-platform") + " ";
    });
  try {
    localStorage.setItem("fleetsafe-language", language);
  } catch (_) {}
  if (announce)
    document.querySelector("#language-announcement").textContent = t(
      "app.language-changed",
    );
}
document
  .querySelectorAll("[data-language]")
  .forEach((button) =>
    button.addEventListener("click", () =>
      setLanguage(button.dataset.language, true),
    ),
  );
setLanguage(language);
for (const [name, id, title] of [
  ["product", PRODUCT_VIDEO_ID, "About the Product — FleetSafe"],
  ["team", TEAM_VIDEO_ID, "About the Team — BitMeisters"],
]) {
  if (!/^[\w-]{11}$/.test(id)) continue;
  const video = document.createElement("iframe");
  video.src = `https://www.youtube-nocookie.com/embed/${id}`;
  video.title = title;
  video.allow = "encrypted-media; picture-in-picture; fullscreen";
  video.loading = "lazy";
  document.querySelector(`[data-video="${name}"]`).replaceChildren(video);
}
