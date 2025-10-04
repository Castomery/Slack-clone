import { axiosInstance } from "./axios";

export async function getStreamToken() {
  try {
    const res = await axiosInstance.get("/chat/token");
    return res.data;
  } catch (error) {
    console.log("Error:", error);
  }
}
