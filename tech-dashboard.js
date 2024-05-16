// Import necessary Firebase modules and functions
import {
  auth,
  onAuthStateChanged,
  getDocs,
  collection,
  db,
  query,
  doc,
  getDoc,
} from "../firebase-config.js";

// Function to display an order
function displayOrder(orderData, orderId) {
  const orderCard = document.createElement("div");
  orderCard.classList.add("card", "mb-3");

  // Add a click event listener to the order card
  orderCard.addEventListener("click", () => {
    // Redirect to a page displaying order details
    window.location.href = `technician-status.html?id=${orderId}`;
  });

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  // Display customer's name
  const customerName = document.createElement("h5");
  customerName.classList.add("card-title");
  customerName.textContent = ` ${orderData.firstName || "N/A"}`;
  cardBody.appendChild(customerName);

  // Display order details
  const cardTitle = document.createElement("h6");
  cardTitle.classList.add("card-subtitle", "mb-2", "text-muted");
  cardTitle.textContent = `${orderData.brand?.toUpperCase()} ${
    orderData.model?.toUpperCase() || "N/A"
  }`;

  const status = document.createElement("p");
  status.classList.add("card-text", "mb-1");
  status.textContent = `Status: ${orderData.status || "N/A"}`;

  const deviceType = document.createElement("p");
  deviceType.classList.add("card-text", "mb-1");
  deviceType.textContent = `Device: ${orderData.deviceType || "N/A"}`;

  const date = document.createElement("p");
  date.classList.add("card-text", "mb-1");
  date.textContent = `Date: ${
    orderData.timestamp?.toDate()?.toLocaleDateString() || "N/A"
  }`;

  const issues = document.createElement("p");
  issues.classList.add("card-text", "mb-1");
  issues.textContent = `Issues: ${orderData.issues || "N/A"}`;

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(status);
  cardBody.appendChild(deviceType);
  cardBody.appendChild(date);
  cardBody.appendChild(issues);

  orderCard.appendChild(cardBody);

  const ordersContainer = document.getElementById("orders-container");
  ordersContainer.appendChild(orderCard);
}

// Function to fetch and display orders for the technician
async function fetchAndDisplayOrders() {
  try {
    // Create a query to get all orders
    const q = query(collection(db, "order-forms"));

    // Get all documents in the collection
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const orderData = doc.data();
      const orderId = doc.id; // Get the document ID
      displayOrder(orderData, orderId); // Pass the document ID to the displayOrder function
    });
  } catch (error) {
    console.error("Error getting orders:", error);
    // Display a user-friendly error message or fallback content
  }
}

// Authentication state change listener
onAuthStateChanged(auth, (user) => {
  try {
    if (user) {
      // User is signed in, fetch and display orders
      fetchAndDisplayOrders();
    } else {
      // User is signed out, redirect to login page
      window.location.href = "login.html";
    }
  } catch (error) {
    console.error("Error in authentication state change:", error);
  }
});

// Function to get order data by ID
async function getOrderDataById(orderId) {
  try {
    const orderRef = doc(db, "order-forms", orderId);
    const orderDoc = await getDoc(orderRef);
    if (orderDoc.exists()) {
      return orderDoc.data();
    } else {
      console.error("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting order data by ID:", error);
    return null;
  }
}
async function createAndPopulateDevInfoDiv() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("id");
    if (orderId) {
      const orderData = await getOrderDataById(orderId);
      if (orderData) {
        // Create the dev-info div
        const devInfoDiv = document.createElement("div");
        devInfoDiv.classList.add("dev-info");

        // Create the photo div
        const photoDiv = document.createElement("div");
        photoDiv.classList.add("row"); // Create a new row

        // Create col for the photo
        const photoCol = document.createElement("div");
        photoCol.classList.add("col-12");

        // Create the img element
        const img = document.createElement("img");
        img.src = orderData.img || "../images/logo.png"; // Assuming the field is imgVideo and the default placeholder image is "placeholder.jpg"
        img.alt = "Order Photo";
        img.classList.add("img-fluid"); // Add Bootstrap class to make the image responsive

        // Append img to photoCol
        photoCol.appendChild(img);

        // Append photoCol to photoDiv
        photoDiv.appendChild(photoCol);

        // Append photoDiv to dev-info div
        devInfoDiv.appendChild(photoDiv);

        // Create the col-4 div
        const col4Div = document.createElement("div");
        col4Div.classList.add("col-4");

        // Populate col-4 with h5 elements
        const deviceH5 = document.createElement("h5");
        deviceH5.textContent = `Device: ${orderData.deviceType || "N/A"}`;
        const brandH5 = document.createElement("h5");
        brandH5.textContent = `Brand: ${orderData.brand || "N/A"}`;
        const modelH5 = document.createElement("h5");
        modelH5.textContent = `Model: ${orderData.model || "N/A"}`;

        // Append h5 elements to col-4 div
        col4Div.appendChild(deviceH5);
        col4Div.appendChild(brandH5);
        col4Div.appendChild(modelH5);

        // Create the col-7 div
        const col7Div = document.createElement("div");
        col7Div.classList.add("col-7");

        // Populate col-7 with h5 elements
        const underWarrantyH5 = document.createElement("h5");
        underWarrantyH5.textContent = `Under Warranty: ${
          orderData.warranty || "N/A"
        }`;
        const repairTypeH5 = document.createElement("h5");
        repairTypeH5.textContent = `Repair Type: ${
          orderData.repairType || "N/A"
        }`;
        const issuesH5 = document.createElement("h5");
        issuesH5.textContent = `Issues: ${orderData.issues || "N/A"}`;

        // Append h5 elements to col-7 div
        col7Div.appendChild(underWarrantyH5);
        col7Div.appendChild(repairTypeH5);
        col7Div.appendChild(issuesH5);

        // Append col-4 and col-7 to dev-info div
        devInfoDiv.appendChild(col4Div);
        devInfoDiv.appendChild(col7Div);

        // Append dev-info div to its parent container (assuming there's a parent container with id "dev-info-container")
        const devInfoContainer = document.getElementById("dev-info-container");
        devInfoContainer.appendChild(devInfoDiv);
      } else {
        console.error("Failed to get order data!");
      }
    } else {
      console.error("No order ID provided in URL!");
    }
  } catch (error) {
    console.error("Error creating and populating dev-info div:", error);
  }
}

// Run the function when the page is loaded
document.addEventListener("DOMContentLoaded", createAndPopulateDevInfoDiv);
