import { useState, useEffect, useContext, createContext } from "react";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import { firebase, firebaseAuth } from "../../config/firebase/client";

const authContext = createContext({ user: null });
const { Provider } = authContext;

const tokenName = "tokenName";

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
      .then((doc) => {
        if (doc.user) {
          return doc.user
            .updateProfile({
              displayName: name,
              photoURL: "",
            })
            .then(() => {
              redirectTo("/chat");
            });
        }
      })
      .catch((error) => {
        console.log(error);
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
        console.log(error);
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

  const onAuthStateChanged = () => {
    return firebaseAuth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        cookie.set(tokenName, token);
        setUser(user);
      } else {
        cookie.remove(tokenName);
        setUser(null);
      }
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged();

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
