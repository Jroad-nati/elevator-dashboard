<template>
  <q-layout view="hHh lpR fFf">
    <ElevatorDashboardHeader />
    <q-page-container>
      <q-page class="q-pa-none q-mt-md">
        <div class="row justify-center no-wrap">
          <q-col v-for="(item, index) in elevator" :key="index" cols="2" class="q-mr-xs">
            <q-card class="text-center justify-center  text-black shadow-2 elevator-card">
              <!---Label each elevator and the status of the elevator-->
              <q-card-section class="q-pa-none q-mt-md">
                <div class="header-text"> {{ item.elevatorId }} </div>
              </q-card-section>
              <q-card-section class="q-pa-none card-header q-mt-xs">
                <div class="header-text">{{ item.elevatorState == 'IDLE' ? '-' : item.elevatorState }}</div>
                <div class="header-text">{{ item.currentFloor == 0 ? 'G' : item.currentFloor }}</div>
              </q-card-section>
              <q-separator dark />
              <!------Buttons inside elevator to move to a floor-->
              <q-card-section class="items-center q-pa-none q-mt-md"
                v-if="avaliableElevators.size > 0 && avaliableElevators.has(item.elevatorId)">
                <div v-for="(row, rowIndex) in buttonRows" :key="rowIndex" class="row no-wrap justify-center">
                  <q-col v-for="(button, index) in row" :key="index" cols="6">
                    <q-btn size="10px" @click="passengerDestinationFloor(button.value, item.elevatorId)">{{ button.label
                    }}</q-btn>
                  </q-col>
                </div>

                <q-btn class="q-pa-none q-mt-xs close-btn" color="primary"
                  @click="closeElevator(item.elevatorId)">close</q-btn>

              </q-card-section>
              <q-card-section v-else />
            </q-card>
          </q-col>
        </div>
        <!----Buttons in each floor to request an elevator-->
        <div class="row justify-center  no-wrap elevator-button-height q-pa-none q-mt-md">
          <q-col v-for="floor in floors" :key="floor.value" cols="auto" class=" q-pa-none q-mr-xs">
            <q-btn class="close-btn" :disable="floor.value === maxFloor" :class="getButtonClass(floor.value, 'up')"
              :icon="floor.value === maxFloor ? '' : 'arrow_upward'" @click="requestElevator(floor.value, 'up')" />
            <q-btn class="close-btn" :disable="floor.value === minFloor" :class="getButtonClass(floor.value, 'down')"
              :icon="floor.value === minFloor ? '' : 'arrow_downward'" @click="requestElevator(floor.value, 'down')" />
            <p class="q-mt-xs floor-label">Floor {{ floor.label }}</p>
          </q-col>
        </div>
        <p class="q-pa-none q-mt-xs">Logs</p>
        <LogsText :logs="logs" />
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, onMounted , computed} from 'vue';
import ElevatorDashboardHeader from "@/components/ElevatorDashboardHeader.vue";
import LogsText from "@/components/LogsText.vue";
import axios from 'axios';
import { floorsLabel, elevatorButtons } from "@/constants/floors"

/** initialize variables */
const elevator = ref([]);
const floors = ref([]);
const buttonRows = ref([]);
const minFloor = 0;
const maxFloor = computed(() => floors.value.length - 1);
const logs = ref([])
const selectedFloor = ref(null); 
const selectedDirection = ref(null);
const avaliableElevators = ref(new Set());

/** functions */
onMounted(async () => {
  floors.value = floorsLabel;
  buttonRows.value = elevatorButtons
  elevatorStatus()
});

const requestElevator = async (floor, direction) => {
  try {
    selectedFloor.value = floor
    selectedDirection.value = direction
    const res = await axios.get(`/api/elevator/get-elevator?floor=${floor}&direction=${direction}`);
    avaliableElevators.value.add(res.data.elevatorId);
    console.log(avaliableElevators.value)
    elevatorStatus();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


const elevatorStatus = async () => {
  try {
    const res = await axios.get("/api/elevator/all");
    elevator.value = res.data;
    setlogs();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const passengerDestinationFloor = async (destination, elevatorId) => {
  try {
    await axios.get(`/api/elevator/enqueue-stop?elevatorId=${elevatorId}&destination=${destination}`);
    setlogs();
  } catch (error) {
    console.error("Error fetching data:", error);
  }

}

const closeElevator = async (elevatorId) => {
  try {
    await axios.get(`/api/elevator/move-elevator?elevatorId=${elevatorId}`);
    avaliableElevators.value.delete(elevatorId);
    resetElevator();
    elevatorStatus();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const resetElevator = async () => {
  selectedFloor.value = null
  selectedDirection.value = null
}

const setlogs = async () => {
  const res = await axios.get("/api/elevator/elevator-logs");
  logs.value = res.data
}

const getButtonClass = (floorValue, direction) => {
  return {
    'arrow-selected': selectedFloor.value === floorValue && selectedDirection.value === direction,
    'arrow-default': !(selectedFloor.value === floorValue && selectedDirection.value === direction)
  };
}
</script>
<style scoped>
.font-size {
  font-size: 8px;
}

.elevator-button-height {
  min-height: 100px;
  /* Adjust as needed */
}

/* Make buttons take full width */
.floor-btn {
  width: 100%;
  flex-grow: 1;
  /* Ensures buttons expand evenly */
}

.elevator-card {
  min-height: 200px;
  width: 100px;
}

.card-header {
  background-color: cadetblue;
  color: brown;
  max-height: 50px;
}

.close-btn {
  width: 70px;
  height: 8px;
  text-align: center;
  font-size: 8px;
}

.header-text {
  font-size: 12px;
  font-weight: bold;
}

.floor-label {
  width: 100%;
  height: 20%;
  text-align: center;
  background-color: aliceblue;
  border: 1px solid #808080;
  color: black;
}

.arrow-selected {
  width: 100%;
  color: white;
  background-color: #1976D2;
}

.arrow-default {
  width: 100%;
  color: black;
  background-color: #808080;

}
</style>
