import { userId, firstName } from "/user-auth.js";
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  collection,
  doc,
  getDocs,
  setDoc,
  getDoc,
  db,
  query,
  where,
} from "../firebase-config.js";

console.log(userId);
console.log(firstName);

const ordersContainer = document.getElementById("orders-container");

// Function to display an order
function displayOrder(orderData) {
  const orderCard = document.createElement("div");
  orderCard.classList.add("col-md-4", "mb-3");

  const cardContent = `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">${orderData.firstName}</h5>
        <h6 class="card-title">${orderData.status}</h6>
        <p class="card-text">Device: ${orderData.deviceType.join(", ")}</p>
        <p class="card-text">Date: ${orderData.timestamp?.toLocaleDateString()}</p>
        <p class="card-text">Brand: ${orderData.brand}</p>
        <p class="card-text">Model: ${orderData.model}</p>
        <p class="card-text">Issues: ${orderData.issues}</p>
        <p class="card-text">Total: ${orderData.total}</p>
      </div>
    </div>
  `;

  orderCard.innerHTML = cardContent;
  ordersContainer.appendChild(orderCard);
}

// Check if user is logged in
if (userId) {
  // Create a query to get orders for the specific user
  const q = query(collection(db, "order-forms"), where("userId", "==", userId));

  // Get all matching documents
  getDocs(q)
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log("No orders found for this user.");
        return;
      }

      querySnapshot.forEach((doc) => {
        // Access order data from each document
        const orderData = doc.data();

        // Display order details in console (modify based on your needs)
        console.log("Order ID:", doc.id);
        console.log("Order Data:", orderData);
      });
    })
    .catch((error) => {
      console.error("Error getting orders:", error);
    });
} else {
  // User is signed out
  console.log("Please sign in to view your orders.");
}
