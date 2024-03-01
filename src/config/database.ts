import { createConnection, ConnectionOptions, Connection } from "typeorm";
import {
  ProductCategory,
  Cart,
  Address,
  CartItem,
  User,
  UserPayment,
  ProductReview,
  Product,
  ProductDiscount,
  ProductInventory,
  OrderDetail,
  OrderItem,
  ProductImage,
} from "../models";

export class DatabaseSingleton {
  private static instance: Connection | null = null;

  private constructor() {} // Đảm bảo không thể tạo đối tượng DatabaseSingleton từ bên ngoài

  static async getInstance(): Promise<Connection> {
    if (!DatabaseSingleton.instance) {
      const dbConfig: ConnectionOptions = {
        type: "mysql",
        host: "localhost", //npm run dev thi localhost, docker thì db
        port: 3306,
        username: "test",
        password: "test",
        database: "test",
        entities: [
          Product,
          ProductCategory,
          Cart,
          Address,
          CartItem,
          User,
          UserPayment,
          ProductReview,
          ProductDiscount,
          ProductInventory,
          OrderDetail,
          OrderItem,
          ProductImage
        ],
        // logging: true,
        synchronize: false, // dòng bug qq má m
      };

      try {
        // Kết nối đến cơ sở dữ liệu nếu instance chưa tồn tại
        DatabaseSingleton.instance = await createConnection(dbConfig);
        console.log("Connected to the database");
      } catch (error) {
        console.error("Unable to connect to the database:", error);
        throw error; // Xử lý lỗi kết nối ở đây, có thể throw để thông báo lỗi ra bên ngoài
      }
    }

    return DatabaseSingleton.instance;
  }

  static async closeConnection(): Promise<void> {
    if (DatabaseSingleton.instance) {
      await DatabaseSingleton.instance.close();
      console.log("Connection closed");
      DatabaseSingleton.instance = null;
    }
  }
}

// Sử dụng DatabaseSingleton để lấy kết nối đến cơ sở dữ liệu
export async function connectToDatabase(): Promise<void> {
  try {
    const connection = await DatabaseSingleton.getInstance();
    // Thực hiện các thao tác khác ở đây nếu cần thiết với biến 'connection'
  } catch (error) {
    // Xử lý lỗi kết nối ở đây
    console.error("Error connecting to the database:", error);
  }
}
