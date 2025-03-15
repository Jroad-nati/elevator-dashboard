<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Elevator dashboard</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-md">
        <div class="row justify-center no-wrap">
          <q-col v-for="(item, index) in elevator" :key="index" cols="2" class="q-mr-xs">
            <q-card  class="text-center justify-center  text-black shadow-2 elevator-card">
              <!---Label each elevator and the status of the elevator-->
              <q-card-section>
                <div class="text-h8"> {{ item.elevatorId }} </div>
              </q-card-section>
              <q-card-section class="card-header">
                <div class="text-h8">{{ item.elevatorState }}</div>
                <div class="text-h8">{{ item.currentFloor == 0 ? 'G' : item.currentFloor }}</div>
              </q-card-section>
              <q-separator dark />
              <!------Buttons inside elevator to move to a floor-->
              <q-card-section class="flex justify-center items-center"
                v-if="avaliableElevators?.elevatorId == item.elevatorId">
                <div v-for="(row, rowIndex) in buttonRows" :key="rowIndex" class="row no-wrap justify-center">
                  <q-col v-for="(button, index) in row" :key="index" cols="6">
                    <q-btn @click="passengerDestinationFloor(button.value)">{{ button.label }}</q-btn>
                  </q-col>
                </div>
                <div class="row justify-center q-mt-md">
                  <q-btn color="primary" size="10px" @click="startElevator">close</q-btn>
                </div>
              </q-card-section>
              <q-card-section v-else />
            </q-card>
          </q-col>
        </div>
        <!----Buttons in each floor to request an elevator-->
        <div class="row justify-center no-wrap elevator-button-height q-pt-md">
          <q-col v-for="floor in floors" :key="floor.value" cols="2" class="q-mr-xs">
            <q-btn :disable="floor.value === 5"
              :style="{ width: '100%', backgroundColor: selectedFloor === floor.value && selectedDirection === 'up' ? '#1976D2' : '#808080', color: selectedFloor === floor.value ? 'white' : 'black' }"
              :icon="floor.value == 5 ? '' : 'arrow_upward'" @click="requestElevator(floor.value, 'up')" />
            <q-btn :disable="floor.value === 0"
              :style="{ width: '100%', backgroundColor: selectedFloor === floor.value && selectedDirection === 'down' ? '#1976D2' : '#808080', color: selectedFloor === floor.value ? 'white' : 'black' }"
              :icon="floor.value == 0 ? '' : 'arrow_downward'" @click="requestElevator(floor.value, 'down')" />
            <q-btn :style="{ width: '100%', height: '10px' }" :label="`Floor ${floor.label}`" color="white"
              text-color="black" class="q-mt-xs font-size" />
          </q-col>
        </div>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
const elevator = ref([]);
const isDisabled = ref(false);
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
const selectedFloor = ref(null); // Stores selected button value
const selectedDirection = ref(null);
const movingToDestination = ref(false);
onMounted(async () => {
  elevatorStatus()
});
const avaliableElevators = ref(null);
const requestElevator = async (floor, direction) => {
  try {
    selectedFloor.value = floor
    selectedDirection.value = direction
    const res = await axios.get(`/api/elevator/get-elevator?floor=${floor}&direction=${direction}`);
    console.log("elevator selected", res.data)
    avaliableElevators.value = res.data
    elevatorStatus();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const elevatorStatus = async () => {
  try {
    const res = await axios.get("/api/elevator/all");
    console.log(res.data)
    elevator.value = res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const passengerDestinationFloor = async (destination) => {
  try {
    await axios.get(`/api/elevator/enqueue-stop?elevatorId=${avaliableElevators.value.elevatorId}&destination=${destination}`);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

}

const startElevator = async () => {
   try {
    await axios.get(`/api/elevator/move-elevator?elevatorId=${avaliableElevators.value.elevatorId}`);
    avaliableElevators.value = null
    selectedFloor.value = null
    selectedDirection.value = null
    elevatorStatus();
  } catch (error) {
    console.error("Error fetching data:", error);
  } 
}

const loading = ref([false, false, false, false, false])
function simulateProgress(number) {
  // we set loading state
  loading.value[number] = true

  // simulate a delay
  setTimeout(() => {
    // we're done, we reset loading state
    loading.value[number] = false
  }, 3000)
}

</script>
<style scoped>
.full-btn {
  width: 100%;
  height: 100%;
  /* Makes sure buttons fill the entire space */
}

.full-btn2 {
  width: 100%;
  margin-bottom: 8px;
  /* Add spacing between buttons */
}

.font-size {
  font-size: 8px;
}

.elevator-button-height {
  min-height: 150px;
  /* Adjust as needed */
}

/* Make buttons take full width */
.floor-btn {
  width: 100%;
  flex-grow: 1;
  /* Ensures buttons expand evenly */
}

.elevator-card {
  min-height: 310px; 
  width:100px;
}
.card-header {
  background-color: cadetblue; 
  color: brown;
}
</style>
