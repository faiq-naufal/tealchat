import { firebaseAdmin } from "../../../config/firebase/admin";

const validateAuth = async (token) => {
  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token, true);
    const result = await firebaseAdmin.auth().getUser(decodedToken.uid);
    return { user: result };
  } catch (error) {
    throw error;
  }
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
    console.log("validation error masuk sini", error);

    return res.status(error.code).send({
      error: error,
      errorCode: error.code,
      message: error.message,
    });
  }
};
