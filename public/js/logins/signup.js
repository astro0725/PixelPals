firebase.initializeApp(firebaseConfig);

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

document.getElementById("signup").addEventListener("submit", async (event) => {
  event.preventDefault();
  const login = event.target.login.value;
  const password = event.target.password.value;

  try {
    const { user } = await firebase
      .auth()
      .createUserWithEmailAndPassword(login, password);
    const idToken = await user.getIdToken();
    await fetch("/sessionLogin", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "CSRF-Token": Cookies.get("XSRF-TOKEN"),
      },
      body: JSON.stringify({ idToken }),
    });
    await firebase.auth().signOut();
    window.location.assign("/profile");
  } catch (error) {
    console.error(error);
  }
});
