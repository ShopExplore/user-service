import UserModel from "../../components/v1/user/user.model";
import AuthModel from "../../components/v1/auth/auth.model";

class CustomerService {
  async getUser(ref: string) {
    const user = await UserModel.findById(ref);

    if (!user) {
      return {
        message: "authorization failed",
        status: 401,
      };
    }

    const userAuth = await AuthModel.findOne({
      User: user._id,
    });

    if (!userAuth) {
      return {
        message: "authorization failed",
        status: 401,
      };
    }

    return {
      user,
      userAuth,
    };
  }

  async subscribeEvents(payload: { [key: string]: any }) {
    console.log("Triggering.... Customer Events");

    const { event, data: userId } = payload;

    switch (event) {
      case "GET_USER":
        return await this.getUser(userId);

      default:
        break;
    }
  }
}

const customer_service = new CustomerService();
export default customer_service;
