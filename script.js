const donationForm = document.getElementById("donationForm");
const donationGrid = document.getElementById("donationGrid");
const formMessage = document.getElementById("formMessage");
const listingCount = document.getElementById("listingCount");
const nav = document.getElementById("nav");
const menuToggle = document.getElementById("menuToggle");

document.getElementById("year").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}

function formatTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function categoryEmoji(category) {
  const icons = {
    "Cooked meals": "🍱",
    "Fresh produce": "🍎",
    "Packaged food": "🥫",
    "Event leftovers": "🥘",
    "Bakery items": "🥐"
  };
  return icons[category] || "🍲";
}

donationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(donationForm);
  const foodName = String(formData.get("foodName")).trim();
  const category = String(formData.get("foodType"));
  const servings = Number(formData.get("servings"));
  const location = String(formData.get("location")).trim();
  const pickupTime = String(formData.get("pickupTime"));
  const contact = String(formData.get("contact")).trim();

  if (!foodName || !category || !location || !contact || !pickupTime || !Number.isInteger(servings) || servings < 1) {
    formMessage.textContent = "Please complete every field with valid information.";
    return;
  }

  const card = document.createElement("article");
  card.className = "donation-card";
  card.innerHTML = `
    <div class="food-photo photo-meal">
      <span aria-hidden="true">${categoryEmoji(category)}</span>
      <small>DEMO LISTING</small>
    </div>
    <div class="donation-info">
      <div class="tag">${escapeHTML(category)}</div>
      <h3>${escapeHTML(foodName)}</h3>
      <p>📍 ${escapeHTML(location)}</p>
      <div class="card-footer">
        <span><strong>${servings}</strong> servings</span>
        <span>Pickup · ${escapeHTML(formatTime(pickupTime))}</span>
      </div>
    </div>`;
  donationGrid.prepend(card);

  listingCount.textContent = `${donationGrid.children.length} listings`;
  formMessage.textContent = `Demo listing added! Contact: ${contact}. This information is only shown in this page session.`;
  donationForm.reset();
  document.getElementById("donations").scrollIntoView({ behavior: "smooth" });
});
