import { firebaseAdmin } from "../../../config/firebase/admin";

const validateAuth = async (token) => {
  const decodedToken = await firebaseAdmin.auth().verifyIdToken(token, true);
  const result = await firebaseAdmin.auth().getUser(decodedToken.uid);
  const userData = {
    uid: result.uid,
    name: result.displayName,
    email: result.email,
    photoProfile: result.photoURL ? result.photoURL : null,
  };

  return { userData };
};

export default async (req, res) => {
  try {
    const { token } = JSON.parse(req.headers.authorization || "{}");
    if (!token) {
      return res.status(403).send({
        error: error,
        errorCode: 403,
        message: `Missing auth token`,
      });
    }

    const result = await validateAuth(token);

    return res.status(200).send(result);
  } catch (error) {
    return res.status(error.code).send({
      error: error,
      errorCode: error.code,
      message: error.message,
    });
  }
};
