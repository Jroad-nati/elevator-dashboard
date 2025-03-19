import { useElevator } from "@/stores/elevator";
import axios from "axios";

export const updateElevatorStatus = async () => {
  try {
    const store = useElevator();
    const res = await axios.get("/api/elevator/all");
    store.elevator = res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
