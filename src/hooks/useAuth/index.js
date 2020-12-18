import { useState, useEffect, useContext, createContext } from "react";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import { firebase, firebaseAuth } from "../../config/firebase/client";

const authContext = createContext({ user: null });
const { Provider } = authContext;

export const AuthProvider = ({ user, children }) => {
  const auth = useAuthProvider(user);

  return <Provider value={auth}>{children}</Provider>;
};

export const useAuthProvider = (userData) => {
  const [user, setUser] = useState(userData);
  const router = useRouter();

  const redirectTo = (location) => {
    router.push(location);
  };

  const signUp = ({ name, email, password }) => {
    return firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then(async (doc) => {
        if (doc.user) {
          await doc.user.updateProfile({
            displayName: name,
          });
          redirectTo("/chat");
        }
      })
      .catch((error) => {
        return { error };
      });
  };

  const signIn = ({ email, password }) => {
    return firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((doc) => {
        if (doc.user) {
          redirectTo("/chat");
        }
      })
      .catch((error) => {
        return { error };
      });
  };

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebaseAuth.signInWithPopup(provider).then((doc) => {
      if (doc.user) {
        redirectTo("/chat");
      }
    });
  };

  const signOut = () =>
    firebaseAuth.signOut().then(() => redirectTo("/accounts/signin"));

  let isAuthReady = false;

  const onIdTokenChanged = () => {
    return firebaseAuth.onIdTokenChanged(async (user) => {
      if (isAuthReady === false) {
        isAuthReady = true;
      } else {
        if (!user) {
          cookie.remove("token");
          setUser(null);
        } else {
          const token = await user.getIdToken();

          const userData = {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photoProfile: user.photoURL ? user.photoURL : null,
          };

          setUser(userData);
          cookie.set("token", token);
        }
      }
    });
  };

  useEffect(() => {
    const unsubscribe = onIdTokenChanged();

    return () => unsubscribe();
  }, []);

  return {
    user,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    redirectTo,
  };
};

export const useAuth = () => useContext(authContext);
