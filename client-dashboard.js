import {
  auth,
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

// Get orders for the user with security rule check
//AUTHSTATE
let userId;
let firstName;

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    userId = user.uid;
    console.log(userId);
    // Get the user's first name from Firestore
    getDoc(doc(db, "users", userId))
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          firstName = docSnapshot.data().firstName;
          console.log(firstName);
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  } else {
    // User is signed out
    userId = null;
    firstName = null;
  }

  // Check if user is logged in
  if (userId) {
    // Create a query to get orders for the specific user
    const q = query(
      collection(db, "order-forms"),
      where("userId", "==", userId)
    );

    // Get all matching documents
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
        // Display a user-friendly error message or fallback content
      });
  } else {
    // User is signed out
    console.log("Please sign in to view your orders.");
  }
});

// Function to display an order (modify based on your data structure)
function displayOrder(orderData) {
  const orderCard = document.createElement("div");
  orderCard.classList.add("mb-3");

  let dateString = "N/A";
  if (
    typeof orderData.timestamp === "object" &&
    typeof orderData.timestamp.toDateString === "function"
  ) {
    dateString = orderData.timestamp.toDateString();
  }

  const cardContent = `
        <div class="card">
          <div class="card-body">
          <h5 class="card-title">${orderData.brand?.toUpperCase()} ${
    orderData.model?.toUpperCase() || "N/A"
  }</h5>
  
            <h6 class="card-title">${orderData.status || "N/A"}</h6>
            <p class="card-text">Device: ${orderData.deviceType || "N/A"}</p>
            <p class="card-text">Date: ${
              orderData.timestamp?.toDate()?.toLocaleDateString() || "N/A"
            }</p>
            <p class="card-text">Issues: ${orderData.issues || "N/A"}</p>
          </div>
        </div>
      `;

  orderCard.innerHTML = cardContent;
  const ordersContainer = document.getElementById("orders-container");
  ordersContainer.appendChild(orderCard);

  const greetingElement = document.getElementById("greetings"); // Replace with your element ID
  greetingElement.textContent = `Hello, ${
    firstName.charAt(0).toUpperCase() + firstName.slice(1)
  }!`;
}
