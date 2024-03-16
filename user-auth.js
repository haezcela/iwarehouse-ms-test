import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  collection,
  doc,
  getDoc,
  setDoc,
  db,
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
