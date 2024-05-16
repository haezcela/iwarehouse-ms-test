import {
  auth,
  onAuthStateChanged,
  collection,
  doc,
  getDocs,
  db,
  query,
  where,
} from "../firebase-config.js";

function displayOrder(orderData) {
  const orderCard = document.createElement("div");
  orderCard.classList.add("mb-3");

  let dateString = "N/A";
  if (orderData.timestamp instanceof Date) {
    dateString = orderData.timestamp.toDateString();
  }

  const cardContent = `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">${(orderData.brand || "N/A").toUpperCase()} ${(
    orderData.model || "N/A"
  ).toUpperCase()}</h5>
        <h6 class="card-title">${orderData.status || "N/A"}</h6>
        <p class="card-text">Device: ${orderData.deviceType || "N/A"}</p>
        <p class="card-text">Date: ${dateString}</p>
        <p class="card-text">Issues: ${orderData.issues || "N/A"}</p>
        <a href="invoice.html?orderId=${
          orderData.id
        }" class="btn btn-primary">View Invoice</a>
      </div>
    </div>
  `;

  orderCard.innerHTML = cardContent;
  const ordersContainer = document.getElementById("orders-container");
  ordersContainer.appendChild(orderCard);
}

function addInvoiceModal(orderData) {
  const modalContent = `
    <div class="modal fade" id="invoiceModal-${
      orderData.id
    }" tabindex="-1" aria-labelledby="invoiceModalLabel-${
    orderData.id
  }" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="invoiceModalLabel-${
              orderData.id
            }">Invoice</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Date: ${orderData.invoice?.date || "N/A"}</p>
            <p>Client Name: ${orderData.invoice?.clientName || "N/A"}</p>
            <p>Device: ${orderData.invoice?.device || "N/A"}</p>
            <p>Repair Type: ${orderData.invoice?.repairType || "N/A"}</p>
            <p>Repair Cost: ${orderData.invoice?.repairCost || "N/A"}</p>
            <p>Technician: ${orderData.invoice?.technician || "N/A"}</p>
            <p>Total: ${orderData.invoice?.total || "N/A"}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const modalsContainer = document.getElementById("modals-container");
  if (modalsContainer) {
    modalsContainer.insertAdjacentHTML("beforeend", modalContent);
  } else {
    console.error("Modals container not found in the DOM.");
  }
}

// Check authentication state
let userId;

onAuthStateChanged(auth, (user) => {
  if (user) {
    userId = user.uid;

    // Fetch user's orders
    const q = query(
      collection(db, "order-forms"),
      where("userId", "==", userId)
    );

    getDocs(q)
      .then((querySnapshot) => {
        const ordersContainer = document.getElementById("orders-container");
        ordersContainer.innerHTML = ""; // Clear container before displaying new orders

        if (querySnapshot.empty) {
          console.log("No orders found for this user.");
          return;
        }

        querySnapshot.forEach((doc) => {
          const orderData = doc.data();
          displayOrder(orderData);
        });
      })
      .catch((error) => {
        console.error("Error getting orders:", error);
      });
  } else {
    // User is signed out
    userId = null;
    console.log("Please sign in to view your orders.");
  }
});

// Logout function
function handleLogout() {
  auth
    .signOut()
    .then(() => {
      window.location.href = "login.html"; // Redirect to login page after successful sign out
    })
    .catch((error) => {
      console.error("Logout Error:", error);
    });
}

// Add event listener to logout button
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", handleLogout);
} else {
  console.error("Logout button not found in the DOM.");
}
