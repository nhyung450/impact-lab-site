const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
const isSamsungInternet = /SamsungBrowser/i.test(navigator.userAgent);
const forcedDarkDetector = document.createElement("div");
forcedDarkDetector.setAttribute("aria-hidden", "true");
forcedDarkDetector.style.cssText = "position:fixed;left:-9999px;width:1px;height:1px;background-color:Canvas;color-scheme:light";
document.body.appendChild(forcedDarkDetector);
const forcedDarkCanvas = getComputedStyle(forcedDarkDetector).backgroundColor;
forcedDarkDetector.remove();
if (prefersDarkScheme && (isSamsungInternet || forcedDarkCanvas !== "rgb(255, 255, 255)")) {
  document.documentElement.classList.add("forced-dark-fallback");
}

const pages = [
  ["Home", "index.html"],
  ["Research", "research.html"],
  ["Publications", "publications.html"],
  ["Team", "people.html"],
  ["Teaching & Advising", "teaching.html"],
  ["On Media", "media.html"],
  ["Contact", "contact.html"],
];

const currentPage = window.location.pathname.split("/").pop() || "index.html";
const isActive = (href) => currentPage === href || (currentPage === "" && href === "index.html");

document.addEventListener("click", (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const target = event.target instanceof Element ? event.target : null;
  const link = target?.closest("a[href]");
  if (!link || link.hasAttribute("download")) return;

  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin || !url.pathname.endsWith(".html")) return;

  url.searchParams.set("fresh", Date.now().toString());
  link.href = url.href;
}, { capture: true });

const headerTarget = document.querySelector("[data-site-header]");
if (headerTarget) {
  headerTarget.innerHTML = `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header" data-header>
      <div class="nav-shell">
        <a class="header-brand" href="index.html" aria-label="IMPACT Lab home">
          <img class="header-logo" src="assets/images/impact-lab-logo.png" alt="IMPACT Lab">
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">
          <span></span><span></span><span></span><b class="sr-only">Open menu</b>
        </button>
        <nav class="primary-nav" id="primary-nav" aria-label="Primary navigation">
          ${pages.map(([label, href]) => `<a href="${href}"${isActive(href) ? ' class="active" aria-current="page"' : ""}>${label}</a>`).join("")}
        </nav>
      </div>
    </header>`;
}

const footerTarget = document.querySelector("[data-site-footer]");
if (footerTarget) {
  footerTarget.innerHTML = `
    <footer class="site-footer">
      <div class="footer-grid">
        <div>
          <a class="brand brand-light" href="index.html">
            <img class="brand-logo" src="assets/images/impact-lab-logo-kaist.png" alt="IMPACT Lab at KAIST">
          </a>
          <p>Integrating Multidisciplinary Perspectives<br>to Advance Climate Transition</p>
          ${isActive("index.html") ? `
          <div class="footer-affiliations" aria-label="KAIST affiliations">
            <a href="https://cee.kaist.ac.kr/" target="_blank" rel="noreferrer">KAIST CEE</a>
            <a href="https://gggs.kaist.ac.kr/" target="_blank" rel="noreferrer">KAIST GGGS</a>
            <a href="https://ax.kaist.ac.kr/#/" target="_blank" rel="noreferrer">KAIST AX</a>
          </div>` : ""}
        </div>
        <div>
          <div class="footer-links">
            <a href="research.html">Research</a>
            <a href="publications.html">Publications</a><a href="people.html">Team</a>
            <a href="teaching.html">Teaching &amp; Advising</a>
            <a href="media.html">On Media</a><a href="contact.html">Contact</a>
          </div>
        </div>
        <div>
          <span class="footer-label">Find us</span>
          <p>291 Daehak-ro, Yuseong-gu<br>Daejeon 34141, Republic of Korea</p>
          <a class="footer-email" href="mailto:si2131@kaist.ac.kr">si2131@kaist.ac.kr</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} IMPACT Lab, KAIST</span>
        <a class="footer-linkedin" href="https://www.linkedin.com/company/impact-lab-kaist/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
      </div>
    </footer>`;
}

const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  header?.classList.toggle("menu-open", !open);
  document.body.classList.toggle("nav-open", !open);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && header?.classList.contains("menu-open")) menuButton?.click();
});

primaryNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  if (header?.classList.contains("menu-open")) menuButton?.click();
}));

const onScroll = () => header?.classList.toggle("scrolled", window.scrollY > 20);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
}

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
    document.querySelectorAll("[data-pub-type]").forEach((item) => {
      const show = filter === "all" || item.dataset.pubType === filter;
      item.hidden = !show;
    });
  });
});

const contactForm = document.querySelector("[data-contact-form]");
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const subject = encodeURIComponent(`[IMPACT Lab inquiry] ${data.get("subject") || "Website inquiry"}`);
  const body = encodeURIComponent(`Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`);
  window.location.href = `mailto:si2131@kaist.ac.kr?subject=${subject}&body=${body}`;
});
