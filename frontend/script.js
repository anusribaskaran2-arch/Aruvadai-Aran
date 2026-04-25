const BACKEND_URL = "http://localhost:5000";

const cropForm = document.getElementById("cropForm");
const cropTableBody = document.querySelector("#cropTable tbody");
const storageForm = document.getElementById("storageForm");
const storageTableBody = document.getElementById("storageTable");
const loginForm = document.getElementById("loginForm");
const loginStatus = document.getElementById("loginStatus");
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

function setLoadingRow(target, colspan) {
  if (target) {
    target.innerHTML = `<tr><td colspan="${colspan}">தகவல் ஏற்றுகிறது…</td></tr>`;
  }
}

function setStatus(element, message, type = "info") {
  if (!element) return;
  element.textContent = message;
  element.className = `form-status ${type}`;
}

// Check backend connection
async function checkBackendConnection() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Backend connection check failed:", error);
    return false;
  }
}

// Enhanced error handler for fetch requests
function handleFetchError(error, defaultMessage) {
  if (error.message === "Failed to fetch" || error.name === "TypeError") {
    return "சர்வர் இணைக்கப்படவில்லை. பின்புற சர்வர் இயங்குகிறதா என சரிபார்க்கவும். (Server not reachable. Please check if backend server is running.)";
  }
  return error.message || defaultMessage;
}

// --- 1. CROP MANAGEMENT FUNCTIONS ---

// Handle Form Submission for Crops
if (cropForm) {
  cropForm.addEventListener("submit", async (e) => {
  e.preventDefault();

    const name = document.getElementById("cropName").value.trim();
    const quantity = Number(document.getElementById("quantity").value);
    const village = document.getElementById("village").value.trim();

    try {
      const response = await fetch(`${BACKEND_URL}/api/crops`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, quantity, village }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message || "பயிர் பதிவு செய்யப்பட்டது! ✅");
        cropForm.reset();
        setLoadingRow(cropTableBody, 3);
        loadCrops();
      } else {
        alert(`பதிவு செய்ய முடியவில்லை: ${result.message}`);
      }
    } catch (error) {
      console.error("Crop submission error:", error);
      alert("பயிர் சேர்க்கும் போது பிழை ஏற்பட்டது! (Check console and server)");
    }
  });
}

// Load and Display Crops
async function loadCrops() {
  if (!cropTableBody) return;
  try {
    const response = await fetch(`${BACKEND_URL}/api/crops`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const crops = await response.json();
    if (!Array.isArray(crops) || crops.length === 0) {
      cropTableBody.innerHTML =
        '<tr><td colspan="3">பதிவுகள் இல்லை. தயவுசெய்து புதிய பயிர் பதிவுகளைச் சேர்க்கவும்.</td></tr>';
      return;
    }

    cropTableBody.innerHTML = "";

    crops.forEach((crop) => {
      const row = `
        <tr>
          <td>${crop.name || "—"}</td>
          <td>${crop.quantity ?? "—"}</td>
          <td>${crop.village || "—"}</td>
        </tr>
      `;
      cropTableBody.innerHTML += row;
    });
  } catch (error) {
    console.error("Error loading crops:", error);
    cropTableBody.innerHTML =
      '<tr><td colspan="3">❌ தரவை ஏற்ற முடியவில்லை. சர்வர் இயங்குகிறதா என சரிபார்க்கவும்.</td></tr>';
  }
}

// --- 2. STORAGE MANAGEMENT FUNCTIONS ---

// Handle Form Submission for Storages
if (storageForm) {
  storageForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("placeName").value.trim();
    const location = document.getElementById("location").value.trim();
    const capacity = Number(document.getElementById("capacity").value);
    const contact = document.getElementById("contact").value.trim();

    try {
      const response = await fetch(`${BACKEND_URL}/api/storages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location, capacity, contact, available: true }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message || "களஞ்சியம் பதிவு செய்யப்பட்டது! 🏡");
        storageForm.reset();
        setLoadingRow(storageTableBody, 5);
        fetchStorages();
      } else {
        alert(`களஞ்சியம் சேர்க்க முடியவில்லை: ${result.message}`);
      }
    } catch (error) {
      console.error("Storage submission error:", error);
      alert("களஞ்சியம் சேர்க்கும் போது பிழை ஏற்பட்டது! (Check console and server)");
    }
  });
}

// Fetch storages and display in table
async function fetchStorages() {
  if (!storageTableBody) return;
  try {
    const res = await fetch(`${BACKEND_URL}/api/storages`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const storages = await res.json();
    if (!Array.isArray(storages) || storages.length === 0) {
      storageTableBody.innerHTML =
        '<tr><td colspan="5">கிடைக்கும் களஞ்சியங்கள் இல்லை. புதியவற்றைச் சேர்க்கவும்.</td></tr>';
      return;
    }

    storageTableBody.innerHTML = "";

    storages.forEach((s) => {
      const statusText = s.available ? "🟢 Available" : "🔴 Full";
      const statusClass = s.available ? "status-chip" : "status-chip full";
      const row = `
        <tr>
          <td>${s.name || "—"}</td>
          <td>${s.location || "—"}</td>
          <td>${s.capacity ?? "—"}</td>
          <td>${s.contact || "—"}</td>
          <td><span class="${statusClass}">${statusText}</span></td>
        </tr>
      `;
      storageTableBody.innerHTML += row;
    });
  } catch (error) {
    console.error("Error fetching storages:", error);
    storageTableBody.innerHTML =
      '<tr><td colspan="5">❌ களஞ்சியத் தரவை ஏற்ற முடியவில்லை. சர்வர் இயங்குகிறதா என சரிபார்க்கவும்.</td></tr>';
  }
}

// --- 3. CONTACT SUBMISSIONS MANAGEMENT ---
const contactTableBody = document.getElementById("contactTableBody");

async function loadContacts() {
  if (!contactTableBody) return;
  
  try {
    contactTableBody.innerHTML = '<tr><td colspan="6">தகவல் ஏற்றுகிறது…</td></tr>';
    
    const response = await fetch(`${BACKEND_URL}/api/contact`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const contacts = await response.json();
    
    if (!Array.isArray(contacts) || contacts.length === 0) {
      contactTableBody.innerHTML =
        '<tr><td colspan="6">தொடர்பு செய்திகள் இல்லை.</td></tr>';
      return;
    }

    contactTableBody.innerHTML = "";

    contacts.forEach((contact) => {
      const date = new Date(contact.createdAt).toLocaleDateString("ta-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const statusColors = {
        new: "🟢",
        read: "🔵",
        replied: "🟡",
        archived: "⚫",
      };

      const statusText = {
        new: "புதியது",
        read: "படிக்கப்பட்டது",
        replied: "பதிலளிக்கப்பட்டது",
        archived: "காப்பகப்படுத்தப்பட்டது",
      };

      const row = `
        <tr>
          <td>${contact.name || "—"}</td>
          <td><a href="mailto:${contact.email}">${contact.email || "—"}</a></td>
          <td>${contact.subject || "—"}</td>
          <td style="max-width: 300px; word-wrap: break-word;">${contact.message || "—"}</td>
          <td>${statusColors[contact.status] || "⚪"} ${statusText[contact.status] || contact.status}</td>
          <td>${date}</td>
        </tr>
      `;
      contactTableBody.innerHTML += row;
    });
  } catch (error) {
    console.error("Error loading contacts:", error);
    contactTableBody.innerHTML =
      '<tr><td colspan="6">❌ தொடர்பு செய்திகளை ஏற்ற முடியவில்லை. சர்வர் இயங்குகிறதா என சரிபார்க்கவும்.</td></tr>';
  }
}

// Make loadContacts available globally
window.loadContacts = loadContacts;

// --- 4. INITIAL LOAD ---
window.addEventListener("load", () => {
  if (cropTableBody) {
    setLoadingRow(cropTableBody, 3);
    loadCrops();
  }
  if (storageTableBody) {
    setLoadingRow(storageTableBody, 5);
    fetchStorages();
  }
  if (contactTableBody) {
    loadContacts();
  }
});

// --- 5. AUTHENTICATION (Login) ---
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
      setStatus(loginStatus, "மின்னஞ்சல் மற்றும் கடவுச்சொல் தேவை.", "error");
      return;
    }

    setStatus(loginStatus, "உள்நுழையிறது...", "info");

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "உள்நுழைய முடியவில்லை.");
      }

      localStorage.setItem("aruvadai_token", result.token);
      localStorage.setItem("aruvadai_user", JSON.stringify(result.user));

      setStatus(loginStatus, "வெற்றிகரமாக உள்நுழைந்தீர்கள்! மாற்றப்படுகிறது...", "success");

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 800);
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = handleFetchError(error, "உள்நுழைய முடியவில்லை.");
      setStatus(loginStatus, errorMessage, "error");
    }
  });
}

// --- 6. CONTACT FORM ---
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      setStatus(contactStatus, "அனைத்து அவசியமான புலங்களை நிரப்பவும்.", "error");
      return;
    }

    setStatus(contactStatus, "செய்தி அனுப்பப்படுகிறது...", "info");

    try {
      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "செய்தி அனுப்ப முடியவில்லை.");
      }

      setStatus(contactStatus, result.message || "நன்றி! உங்கள் செய்தி அனுப்பப்பட்டது.", "success");
      contactForm.reset();
    } catch (error) {
      console.error("Contact submit error:", error);
      const errorMessage = handleFetchError(error, "சர்வர் பிழை காரணமாக உங்கள் செய்தி அனுப்பப்படவில்லை.");
      setStatus(contactStatus, errorMessage, "error");
    }
  });
}