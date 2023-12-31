import amqplib from "amqplib";
import UserModel from "../components/v1/user/user.model";
import AuthModel from "../components/v1/auth/auth.model";
import appConfig from "../configs";

const { MESSAGE_BROKER_URL, EXCHANGE_NAME, QUEUE_NAME, CUSTOMER_BINDING_KEY } =
  appConfig;

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

  // async subscribeEvents(payload: { [key: string]: any }) {
  //   console.log("Triggering.... Customer Events");

  //   const { event, data: userId } = payload;

  //   switch (event) {
  //     case "GET_USER":
  //       return await this.getUser(userId);

  //     default:
  //       break;
  //   }
  // }
}

export const createChannel = async () => {
  try {
    console.log("creating channel from  customer service......");
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct");

    return channel;
  } catch (error) {
    throw error;
  }
};

//subscribe channel
export const subscribeMessage = async (
  channel: amqplib.Channel,
  service: any
) => {
  try {
    const appQueue = await channel.assertQueue(QUEUE_NAME);
    console.log("service  ", service);
    channel.bindQueue(appQueue.queue, EXCHANGE_NAME, CUSTOMER_BINDING_KEY);

    channel.consume(appQueue.queue, (data) => {
      console.log("user service subscribe some data..............");

      console.log(data.content.toString());
      channel.ack(data);
    });
  } catch (error) {
    throw error;
  }
};

const customer_service = new CustomerService();
export default customer_service;
