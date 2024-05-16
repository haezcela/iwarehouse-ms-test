// Import necessary Firebase modules and functions
import {
  db,
  doc,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  getDoc,
} from "../firebase-config.js";

// Function to create or update the 'invoice' sub-collection in Firestore
async function createOrUpdateInvoiceSubcollection(orderId, invoiceData) {
  try {
    // Reference to the 'invoice' sub-collection in Firestore
    const invoiceCollectionRef = collection(
      doc(db, "order-forms", orderId),
      "invoice"
    );

    // Check if the 'invoice' sub-collection already exists
    const invoiceSnapshot = await getDocs(invoiceCollectionRef);
    if (invoiceSnapshot.empty) {
      // 'invoice' sub-collection does not exist, create a new document
      await addDoc(invoiceCollectionRef, {
        date: serverTimestamp(),
        clientName: invoiceData.clientName || "N/A",
        device: invoiceData.device || "N/A",
        repairType: invoiceData.repairType || "N/A",
        repairCost: document.getElementById("repair-cost").value || 0,
        technician: invoiceData.technician || "N/A",
        total: document.getElementById("total").value || 0,
        repairId: orderId,
      });
      console.log("Invoice sub-collection created successfully!");
    } else {
      // 'invoice' sub-collection already exists, update the existing document
      invoiceSnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, {
          date: serverTimestamp(),
          clientName: invoiceData.clientName || "N/A",
          device: invoiceData.device || "N/A",
          repairType: invoiceData.repairType || "N/A",
          repairCost: document.getElementById("repair-cost").value || 0,
          technician: invoiceData.technician || "N/A",
          total: document.getElementById("total").value || 0,
          repairId: orderId,
        });
      });
      console.log("Invoice sub-collection updated successfully!");
    }
  } catch (error) {
    console.error("Error creating or updating invoice sub-collection:", error);
  }
}

// Function to fetch order data from Firestore
async function getOrderData(orderId) {
  try {
    const orderDocRef = doc(db, "order-forms", orderId);
    const orderDocSnapshot = await getDoc(orderDocRef);
    if (orderDocSnapshot.exists()) {
      return orderDocSnapshot.data();
    } else {
      console.error("Order document not found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching order data:", error);
    return null;
  }
}
async function populateInvoiceFields(orderData) {
  try {
    // Extract orderId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("id");

    if (!orderId) {
      console.error("Missing order ID in URL");
      return;
    }

    const orderDocRef = doc(db, "order-forms", orderId);

    // Get the order document
    const orderDocSnapshot = await getDoc(orderDocRef);

    if (orderDocSnapshot.exists()) {
      // Get the invoice subcollection
      const invoiceCollectionRef = collection(orderDocRef, "invoice");

      // Query the invoice subcollection
      const invoiceQuerySnapshot = await getDocs(invoiceCollectionRef);

      // Check if any invoice documents exist
      if (!invoiceQuerySnapshot.empty) {
        // Assuming there's only one invoice document
        const invoiceDocSnapshot = invoiceQuerySnapshot.docs[0];
        const invoiceData = invoiceDocSnapshot.data();

        document.getElementById("date").value = new Date().toLocaleDateString();
        document.getElementById("client-name").value =
          orderData.firstName || "N/A";
        document.getElementById("device").value = `${
          orderData.brand || "N/A"
        } ${orderData.model || ""}`.trim();
        document.getElementById("repair-type").value =
          orderData.repairType || "N/A";
        document.getElementById("repair-cost").value =
          invoiceData.repairCost || "N/A";
        document.getElementById("total").value = invoiceData.total || "N/A";
        document.getElementById("technician").value =
          invoiceData.technician || "N/A";
      } else {
        console.warn("No invoice found for order ID:", orderId);
      }
    } else {
      console.warn("Order document not found for ID:", orderId);
    }

    document.getElementById("repairID").value = orderId || "N/A";
  } catch (error) {
    console.error("Error populating invoice fields:", error);
  }
}

// Add event listener to the send button
const sendButton = document.getElementById("send-button");
sendButton.addEventListener("click", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("id");

  const invoiceData = {
    clientName: document.getElementById("client-name").value || "N/A",
    device: document.getElementById("device").value || "N/A",
    repairType: document.getElementById("repair-type").value || "N/A",
    repairCost: document.getElementById("repair-cost").value || 0,
    technician: document.getElementById("technician").value || "N/A",
  };

  await createOrUpdateInvoiceSubcollection(orderId, invoiceData);
});

// Populate invoice fields when the page is loaded
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("id");
  if (orderId) {
    const orderData = await getOrderData(orderId);
    if (orderData) {
      await populateInvoiceFields(orderData);
    } else {
      console.error("Failed to fetch order data for invoice!");
    }
  } else {
    console.error("No order ID provided in URL!");
  }
});

// Function to format the repair cost in PESO
function formatRepairCost() {
  // Get the current value of the repair cost input field
  let repairCost = repairCostInput.value;

  // Remove any non-numeric characters from the input
  repairCost = repairCost.replace(/\D/g, "");

  // Ensure the input is not empty
  if (repairCost === "") {
    repairCostInput.value = ""; // Clear the input field
    return;
  }

  // Convert the repair cost to a number
  let costNumber = parseInt(repairCost) || 0;

  // Format the number as currency (PESO)
  let formattedCost = costNumber.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0, // Minimum fraction digits set to 0
    maximumFractionDigits: 0, // Maximum fraction digits set to 0
  });

  // Update the value of the repair cost input field with the formatted value
  repairCostInput.value = formattedCost;

  // Call the updateTotalCost function whenever the repair cost changes
  updateTotalCost(costNumber);
}

// Function to update the total cost based on the repair cost
function updateTotalCost(repairCost) {
  // Update the total cost input field
  totalCostInput.value = repairCost.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Add event listener to the repair cost input field
const repairCostInput = document.getElementById("repair-cost");
repairCostInput.addEventListener("input", formatRepairCost);

// Get the initial repair cost value
let initialRepairCost = parseFloat(repairCostInput.value) || 0;

// Add event listener to the total cost input field
const totalCostInput = document.getElementById("total");

// Call the updateTotalCost function initially to set the initial total cost
updateTotalCost(initialRepairCost);
