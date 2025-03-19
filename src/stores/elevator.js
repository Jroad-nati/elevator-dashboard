import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useElevator = defineStore('elevator', () => {

    const avaliableElevators = ref(new Set());
    const elevator = ref([]);
    const logs = ref([]);


    /** actions */

    const setLogs = (logs) => {
      logs.value = logs;
    }

    const addAvailableElevator = (elevatorId) => {
      avaliableElevators.value.add(elevatorId);
    }

    const removeSelectedElevator = (elevatorId) => {
      avaliableElevators.value.delete(elevatorId);
    }
  return { elevator,removeSelectedElevator, avaliableElevators, addAvailableElevator, setLogs,logs }
})


