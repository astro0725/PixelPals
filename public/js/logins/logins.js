// firebase.initializeApp(firebaseConfig);

// // Set the persistence to "none"
// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

// Add an event listener to the DOMContentLoaded event
window.addEventListener("DOMContentLoaded", async () => {
  // Get the login form element
  const loginForm = document.getElementById("login");

  // Define an async function to handle the form submission
  const handleLogin = async (event) => {
    event.preventDefault();

    // Get the login and password values from the form
    const login = event.target.login.value;
    const password = event.target.password.value;

    try {
      // Sign in the user with the provided login and password
      const { user } = await firebase
        .auth()
        .signInWithEmailAndPassword(login, password);

      // Get the user's ID token
      const idToken = await user.getIdToken();

      // Send the ID token to the server for session login
      await fetch("/sessionLogin", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "CSRF-Token": Cookies.get("XSRF-TOKEN"),
        },
        body: JSON.stringify({ idToken }),
      });

      // Sign out the user
      await firebase.auth().signOut();

      // Redirect the user to the profile page
      window.location.assign("/profile");
    } catch (error) {
      // Handle any errors that occur during the authentication process
      console.error(error);
    }
  };

  window.addEventListener("DOMContentLoaded", async () => {});

  // Add a submit event listener to the login form
  loginForm.addEventListener("submit", handleLogin);
});
