import { useElevator } from "@/stores/elevator";
import axios from "axios";

export const fetchLogs = async () => {
  try {
    const store = useElevator();
    const res = await axios.get("/api/elevator/elevator-logs");
    store.logs = res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
