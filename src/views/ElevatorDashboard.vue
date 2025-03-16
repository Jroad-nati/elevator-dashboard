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
                v-if="avaliableElevators?.elevatorId == item.elevatorId">
                <div v-for="(row, rowIndex) in buttonRows" :key="rowIndex" class="row no-wrap justify-center">
                  <q-col v-for="(button, index) in row" :key="index" cols="6">
                    <q-btn size="10px" @click="passengerDestinationFloor(button.value)">{{ button.label }}</q-btn>
                  </q-col>
                </div>

                <q-btn class="q-pa-none q-mt-xs close-btn" color="primary" @click="startElevator">close</q-btn>

              </q-card-section>
              <q-card-section v-else />
            </q-card>
          </q-col>
        </div>
        <!----Buttons in each floor to request an elevator-->
        <div class="row justify-center  no-wrap elevator-button-height q-pa-none q-mt-md">
          <q-col v-for="floor in floors" :key="floor.value" cols="2" class=" q-pa-none q-mr-xs">
            <q-btn class="close-btn" :disable="floor.value === 5"
              :style="{ width: '100%', backgroundColor: selectedFloor === floor.value && selectedDirection === 'up' ? '#1976D2' : '#808080', color: selectedFloor === floor.value ? 'white' : 'black' }"
              :icon="floor.value == 5 ? '' : 'arrow_upward'" @click="requestElevator(floor.value, 'up')" />
            <q-btn class="close-btn" :disable="floor.value === 0"
              :style="{ width: '100%', backgroundColor: selectedFloor === floor.value && selectedDirection === 'down' ? '#1976D2' : '#808080', color: selectedFloor === floor.value ? 'white' : 'black' }"
              :icon="floor.value == 0 ? '' : 'arrow_downward'" @click="requestElevator(floor.value, 'down')" />
            <p class="q-mt-xs floor-label" >Floor {{ floor.label }}</p>
          </q-col>
        </div>
        <p class="q-pa-none q-mt-xs">Logs</p>
        <LogsText :logs="logs" />
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script setup>
// Most of the code should be move to other files which i created some of it and refactor but not time for me right now.
import { ref, onMounted } from 'vue';
import ElevatorDashboardHeader from "@/components/ElevatorDashboardHeader.vue";
import LogsText from "@/components/LogsText.vue";
import axios from 'axios';
const elevator = ref([]);
const floors = ref([
  { value: 0, label: "G" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" }
]);
const buttonRows = ref([
  [{ value: 0, label: "G" }, { value: 1, label: "1" }],
  [{ value: 2, label: "2" }, { value: 3, label: "3" }],
  [{ value: 4, label: "4" }, { value: 5, label: "5" }]
]);
const logs = ref([])
const selectedFloor = ref(null); // Stores selected button value
const selectedDirection = ref(null);

onMounted(async () => {
  elevatorStatus()
});
const avaliableElevators = ref(null);
const requestElevator = async (floor, direction) => {
  try {
    selectedFloor.value = floor
    selectedDirection.value = direction
    const res = await axios.get(`/api/elevator/get-elevator?floor=${floor}&direction=${direction}`);
    avaliableElevators.value = res.data
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

const passengerDestinationFloor = async (destination) => {
  try {
    await axios.get(`/api/elevator/enqueue-stop?elevatorId=${avaliableElevators.value.elevatorId}&destination=${destination}`);
    setlogs();
  } catch (error) {
    console.error("Error fetching data:", error);
  }

}

const startElevator = async () => {
  try {
    await axios.get(`/api/elevator/move-elevator?elevatorId=${avaliableElevators.value.elevatorId}`);
    resetElevator();
    elevatorStatus();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const resetElevator = async () => {
  avaliableElevators.value = null
  selectedFloor.value = null
  selectedDirection.value = null
}

const setlogs = async () => {
  const res = await axios.get("/api/elevator/elevator-logs");
  logs.value = res.data
}


// To smulate progress but not time to do that.

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
</style>
