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
const t = (key) =>
  MESSAGES[language]?.[key] ?? MESSAGES[DEFAULT_LANGUAGE]?.[key] ?? key;
function setLanguage(next) {
  language = LANGUAGES.includes(next) ? next : DEFAULT_LANGUAGE;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.language === language),
    );
  });
  try {
    localStorage.setItem("fleetsafe-language", language);
  } catch (_) {}
}
document
  .querySelectorAll("[data-language]")
  .forEach((button) =>
    button.addEventListener("click", () =>
      setLanguage(button.dataset.language),
    ),
  );
setLanguage(language);
