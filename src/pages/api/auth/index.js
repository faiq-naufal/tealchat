import { firebaseAdmin } from "../../../config/firebase/admin";

const validateAuth = async (token) => {
  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token, true);
    const result = await firebaseAdmin.auth().getUser(decodedToken.uid);
    const userData = {
      uid: result.uid,
      name: result.displayName,
      email: result.email,
      photoProfile: result.photoURL ? result.photoURL : null,
    };

    return { userData };
  } catch (error) {
    console.log("Error getting document", error);
    return error;
  }
};

export default async (req, res) => {
  try {
    const { token } = JSON.parse(req.headers.authorization || "{}");
    if (!token) {
      return res.status(403).send({
        errorCode: 403,
        message: `Missing auth token`,
      });
    }

    const result = await validateAuth(token);

    if (result.errorInfo) {
      return res.status(500).send({
        error: result.errorInfo.code,
        errorCode: 500,
        message: result.errorInfo.message,
      });
    }

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({
      errorCode: 500,
      message: error.message,
    });
  }
};