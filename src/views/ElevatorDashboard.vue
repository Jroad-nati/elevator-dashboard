<template>
  <q-layout view="hHh lpR fFf">
    <ElevatorDashboardHeader />
    <q-page-container>
      <q-page class="q-pa-none q-mt-md">
        <div class="row justify-center no-wrap">
          <q-col v-for="(elv, index) in elevators" :key="index" cols="2" class="q-mr-xs">
            <q-card class="text-center justify-center  text-black shadow-2 elevator-card">
              <!---Label each elevator and the status of the elevator-->
              <q-card-section class="q-pa-none q-mt-md">
                <div class="header-text"> {{ elv.elevatorId }} </div>
              </q-card-section>
              <q-card-section class="q-pa-none card-header q-mt-xs">
                <div class="header-text">{{ elv.elevatorState == 'IDLE' ? '-' : elv.elevatorState }}</div>
                <div class="header-text">{{ elv.currentFloor == 0 ? 'G' : elv.currentFloor }}</div>
              </q-card-section>
              <q-separator dark />
              <!------Buttons inside elevator to move to a floor-->
              <q-card-section class="elvs-center q-pa-none q-mt-md"
                v-if="avaliableElevators.size > 0 && avaliableElevators.has(elv.elevatorId)">
                <ElevatorButton :elv="elv" />
              </q-card-section>
              <q-card-section v-else />
            </q-card>
          </q-col>
        </div>
        <!----Buttons in each floor to request an elevator-->
        <FloorButton />
        <p class="q-pa-none q-mt-xs">Logs</p>
        <LogsText />
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import ElevatorDashboardHeader from "@/components/ElevatorDashboardHeader.vue";
import ElevatorButton from "@/components/ElevatorButtons.vue";
import FloorButton from "@/components/FloorButtons.vue";
import LogsText from "@/components/LogsText.vue";
import { fetchLogs } from "@/services/LogService";

import { useElevator } from "@/stores/elevator";
import { updateElevatorStatus } from "@/services/elevatorStatusUPdate"
const elevatorStore = useElevator();
onMounted(async () => {
  updateElevatorStatus();
  fetchLogs();
});
const elevators = computed(() => elevatorStore.elevator);
const avaliableElevators = computed(() => elevatorStore.avaliableElevators);


</script>
<style scoped>
.font-size {
  font-size: 8px;
}

.elevator-button-height {
  min-height: 100px;
  /* Adjust as needed */
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



.header-text {
  font-size: 12px;
  font-weight: bold;
}
</style>
