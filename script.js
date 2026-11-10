const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

document.getElementById("year").textContent = new Date().getFullYear();

// No backend yet: the form only confirms locally.
document.getElementById("signupForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = e.target.email.value.trim();
  document.getElementById("formMsg").textContent =
    `Terima kasih! Kami akan menghubungi ${email} segera. 🎉`;
  e.target.reset();
});
