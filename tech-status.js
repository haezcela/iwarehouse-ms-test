// Import necessary Firebase modules and functions
import { db, doc, updateDoc } from "../firebase-config.js";

// Function to update the 'status' field in Firebase
async function updateStatus(orderId, status) {
  try {
    // Reference to the order document in Firestore
    const orderRef = doc(db, "order-forms", orderId);

    // Update the 'status' field
    await updateDoc(orderRef, {
      status: status,
    });

    console.log(`Status updated to: ${status}`);
  } catch (error) {
    console.error("Error updating status:", error);
  }
}

// Get all the checkboxes
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

// Add event listener to each checkbox
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", async () => {
    const orderId = getOrderIdFromURL(); // Function to extract orderId from URL

    if (!orderId) {
      console.error("No orderId found in the URL!");
      return; // Exit early if orderId is not available
    }

    if (checkbox.id === "cb1" && checkbox.checked) {
      await updateStatus(orderId, "Waiting for parts");
    } else if (checkbox.id === "cb2" && checkbox.checked) {
      await updateStatus(orderId, "Fixing");
    } else if (checkbox.id === "cb3" && checkbox.checked) {
      await updateStatus(orderId, "Ready for Pickup");
    }
  });
});

// Function to extract orderId from URL
function getOrderIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}
