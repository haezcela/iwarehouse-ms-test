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

// Get the forms
const adminSignupForm = document.getElementById("admin-signup-form");
const technicianSignupForm = document.getElementById("technician-signup-form");
const clientSignupForm = document.getElementById("client-signup-form");

// ADMIN SIGNUP
if (adminSignupForm) {
  adminSignupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Get form values
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signUp(firstName, lastName, email, password, "admin");
  });
}

// TECHNICIAN SIGNUP
if (technicianSignupForm) {
  technicianSignupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Get form values
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signUp(firstName, lastName, email, password, "technician");
  });
}

if (clientSignupForm) {
  // Client SIGNUP
  clientSignupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Get form values
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signUp(firstName, lastName, email, password, "client");
  });
}
function signUp(firstName, lastName, email, password, role) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Optional: Hide alert after a few seconds
      setTimeout(() => {
        alert.remove();
      }, 3000); // Remove after 3 seconds
      // Add a new document in collection "users"

      setDoc(doc(collection(db, "users"), userCredential.user.uid), {
        firstName: firstName,
        lastName: lastName,
        role: role,
      })
        .then(() => {
          console.log("User details set successfully");
        })
        .catch((error) => {
          console.error("Error setting user details: ", error);
        });
    })
    .catch((error) => {
      console.error("Error signing up: ", error);
    });
}

//LOGIN
// Get the form
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form values
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Call the logIn function
    logIn(email, password);
  });
}
function logIn(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      getDoc(doc(db, "users", userCredential.user.uid))
        .then((doc) => {
          if (doc.exists) {
            const role = doc.data().role;
            routeUser(role);
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    })
    .catch((error) => {
      console.error("Error logging in: ", error);
    });
}

function routeUser(role) {
  switch (role) {
    case "admin":
      window.location.href = "/admin/admin-dashboard.html";
      break;
    case "technician":
      window.location.href = "/technician/technician-dashboard.html";
      break;
    case "client":
      window.location.href = "/client/client-dashboard.html";
      break;
  }
}

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
});

export { userId, firstName };
