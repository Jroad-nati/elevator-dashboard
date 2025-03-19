<template>
    <div class="row justify-center  no-wrap elevator-button-height q-pa-none q-mt-md">
        <q-col v-for="floor in floors" :key="floor.value" cols="auto" class=" q-pa-none q-mr-xs">
            <q-btn size="xs"  :disable="floor.value === maxFloor" :class="getButtonClass(floor.value, 'up')"
                :icon="floor.value === maxFloor ? '' : 'arrow_upward'" @click="requestElevator(floor.value, 'up')" />
            <q-btn size="xs"  :disable="floor.value === minFloor" :class="getButtonClass(floor.value, 'down')"
                :icon="floor.value === minFloor ? '' : 'arrow_downward'"
                @click="requestElevator(floor.value, 'down')" />
            <p class="q-mt-xs floor-label">Floor {{ floor.label }}</p>
        </q-col>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { floorsLabel } from "@/constants/floors"
import { updateElevatorStatus } from "@/services/elevatorStatusUPdate"
import { useElevator } from "@/stores/elevator";

const floors = ref([]);
onMounted(() => {
    floors.value = floorsLabel
})


const elevatorStore = useElevator();

/** initialize variables */
const minFloor = 0;
const maxFloor = computed(() => floors.value.length-1);

const selectedFloor = ref(null);
const selectedDirection = ref(null);

const requestElevator = async (floor, direction) => {
    try {
        console.log("selected floor", floor, direction)
        selectedFloor.value = floor;
        selectedDirection.value = direction;
        const res = await axios.get(`/api/elevator/get-elevator?floor=${floor}&direction=${direction}`);
        console.log('res data', res.data)
        elevatorStore.addAvailableElevator(res.data.elevatorId);
        updateElevatorStatus();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

const getButtonClass = (floorValue, direction) => {
    return {
        'arrow-selected': selectedFloor.value === floorValue && selectedDirection.value === direction,
        'arrow-default': !(selectedFloor.value === floorValue && selectedDirection.value === direction)
    };
}
</script>
<style scoped>
.arrow-selected {
    width: 100%;
    color: white;
    background-color: #1976D2;
}

.arrow-default {
    width: 100%;
    color: black;
    background-color: aliceblue;

}

.floor-label {
    width: 100%;
    font-size: 12px;
    text-align: center;
    background-color: aliceblue;
    border: 1px solid #808080;
    color: black;
}


</style>