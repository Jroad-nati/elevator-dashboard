<template>
    <div v-for="(row, rowIndex) in buttonRows" :key="rowIndex" class="row no-wrap justify-center">
        <q-col v-for="(button, index) in row" :key="index" cols="6">
            <q-btn size="10px" @click="passengerDestinationFloor(button.value, elv.elevatorId)">{{ button.label
                }}</q-btn>
        </q-col>
    </div>
    <q-btn class="q-pa-none q-mt-xs close-btn" color="primary" @click="closeElevator(elv.elevatorId)">close</q-btn>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import axios from 'axios';
import { elevatorButtons } from "@/constants/floors"
import { useElevator } from "@/stores/elevator";
import { updateElevatorStatus } from "@/services/elevatorStatusUPdate"
import { fetchLogs } from "@/services/LogService"
const elevatorStore = useElevator();
const buttonRows = ref([]);
const props = defineProps({
    elv: String
})
onMounted(() => {
    buttonRows.value = elevatorButtons
})
const passengerDestinationFloor = async (destination, elevatorId) => {
    try {
        await axios.get(`/api/elevator/enqueue-stop?elevatorId=${elevatorId}&destination=${destination}`);
        fetchLogs();
    } catch (error) {
        console.error("Error fetching data:", error);
    }

}

const closeElevator = async (elevatorId) => {
    try {
        await axios.get(`/api/elevator/move-elevator?elevatorId=${elevatorId}`);
        fetchLogs();
        elevatorStore.removeSelectedElevator(elevatorId);
        updateElevatorStatus();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}



</script>
<style scoped>

.close-btn {
  width: 70px;
  height: 8px;
  text-align: center;
  font-size: 8px;
}
</style>