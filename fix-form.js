import {
  db,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
} from "/firebase-config.js";
import { storage, ref, uploadBytes, getDownloadURL } from "/firebase-config.js";

import { userId, firstName } from "/user-auth.js";

console.log(userId);
console.log(firstName);

$(document).ready(function () {
  $("#issuesInput").tagEditor({
    placeholder: "Enter issues ...",
    beforeTagSave: (field, editor, tags, tag, val) => {
      // make sure it is a formally valid email
      return val;
    },
  });

  // Prevent form submission when Enter is pressed in tag input field
  $("#issuesInput").on("keydown", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      var tagValue = $(this).val().trim();
      if (tagValue !== "") {
        $(this).tagEditor("addTag", tagValue);
        $(this).val(""); // Clear the input field after adding tag
      }
    }
  });

  // Listen for form submission
  $("#fix-form").submit(function (event) {
    // Prevent default form submission
    event.preventDefault();

    // Get the tags from the tag editor input field
    var tags = $("#issuesInput").tagEditor("getTags")[0].tags;

    // Print the array of tags to the console
    console.log("Tags:", tags);
  });
});

// Add event listener for DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function () {
  // Update file label with selected file name
  function updateFileName(input) {
    var fileName = input.files[0].name;
    var label = document.getElementById("fileLabel");
    label.textContent = fileName;
  }

  // Add event listener to the file input
  document
    .getElementById("fileUpload")
    .addEventListener("change", function (event) {
      updateFileName(event.target);
    });
});

// Function to show success modal and redirect to dashboard after 3 seconds
function showSuccessModal() {
  $("#successModal").modal("show");
  setTimeout(function () {
    $("#successModal").modal("hide");
    window.location.href = "client-dashboard.html"; // Redirect to dashboard
  }, 3000);
}

// Listen for form submission
$("#fix-form").submit(async function (event) {
  // Prevent default form submission
  event.preventDefault();

  // Get form inputs
  var deviceType = $("input[name='deviceType']:checked").val();
  var brand = $("#brandSelect").val();
  var model = $("#modelInput").val();
  var description = $("#descriptionTextarea").val();
  var repairType = $("#repairTypeSelect").val();
  var phoneNumber = $("#phoneNumberInput").val();
  var file = $("#fileUpload")[0].files[0];

  // Get the tags from the tag editor input field
  var tags = $("#issuesInput").tagEditor("getTags")[0].tags;

  // Prepare data object with timestamp
  // Prepare data object with timestamp
  var formData = {
    userId: userId,
    firstName: firstName,
    deviceType: deviceType,
    brand: brand,
    model: model,
    description: description,
    repairType: repairType,
    phoneNumber: phoneNumber,
    issues: tags, // Add issues array to form data
    timestamp: new Date(), // Add a timestamp field with the current date and time
  };

  try {
    // Upload file to Firebase Storage
    const storageRef = ref(storage, `fix-request/${file.name}`);
    await uploadBytes(storageRef, file);

    // Get the download URL for the uploaded file
    const downloadURL = await getDownloadURL(storageRef);

    // Add download URL to the form data
    formData["img-video"] = downloadURL;

    // Upload form data to Firestore
    const docRef = await addDoc(collection(db, "order-forms"), formData);
    console.log("Document written with ID: ", docRef.id);

    // Reset form
    $("#fix-form")[0].reset();
    $("#fileLabel").text("Choose file");

    // Show success modal
    showSuccessModal();
  } catch (e) {
    console.error("Error uploading form data: ", e);
  }
});

// Add event listener for DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function () {
  // Update file label with selected file name
  function updateFileName(input) {
    var fileName = input.files[0].name;
    var label = document.getElementById("fileLabel");
    label.textContent = fileName;
  }

  // Add event listener to the file input
  document
    .getElementById("fileUpload")
    .addEventListener("change", function (event) {
      updateFileName(event.target);
    });

  /*
  // Query Firestore collection and order by timestamp
  async function getOrderedFormData() {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "order-forms"), orderBy("timestamp", "desc"))
      );
      querySnapshot.forEach((doc) => {
        // Process each document
        console.log(doc.id, " => ", doc.data());
      });
    } catch (error) {
      console.error("Error getting ordered form data: ", error);
    }
  }

  // Call the function to get ordered form data
  getOrderedFormData();

*/
});
