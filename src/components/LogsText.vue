<template>
    <q-scroll-area dark class="q-pa-none bg-grey-9 text-white rounded-borders" style="height: 100px; max-width: 100%;">
        <div v-for="(log, index) in logs" :key="index" class="q-pa-xs">
            {{ log }}
        </div>
    </q-scroll-area>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useElevator } from "@/stores/elevator";
const elevatorStore = useElevator();
const logs=computed(() => elevatorStore.logs);

</script>