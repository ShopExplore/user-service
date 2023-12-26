import { startSession } from "mongoose";
import UserModel from "../../components/v1/user/user.model";
import appConfig from "..";
import AuthModel from "../../components/v1/auth/auth.model";
import { ClientSession } from "mongodb";
import { abortSessionWithResponse } from "../../utils/response";

const seeding = async () => {
  const session = await startSession();
  session.startTransaction();

  const { seedData } = appConfig;
  try {
    const userExist = await UserModel.findOne().session(session);
    if (userExist) {
      await session.abortTransaction();
      session.endSession();

      return;
    }

    console.log("seeding now......");

    const user = await new UserModel({
      userName: seedData.userName,
      role: seedData.role,
      email: seedData.email,
    }).save({ session });

    await new AuthModel({
      User: user._id,
      password: seedData.password,
      isVerified: true,
    }).save({ session });

    await session.commitTransaction();
    session.endSession();

    console.log("Seeding complete ✅");
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.log("error fetching info from DB " + err);
  }
};

export default seeding;
