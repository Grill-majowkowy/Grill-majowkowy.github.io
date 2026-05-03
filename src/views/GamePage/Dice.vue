<template>
  <div class="dice-row">
    <div
      v-for="(die, idx) in dice"
      :key="idx"
      class="die"
      :class="{ selected: die.selected, rolling: die.rolling }"
      @click="!disabled ? emit('toggle', idx) : null"
    >
      <DiceFace :value="die.value" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue';

interface Die {
  value: number;
  selected: boolean;
  rolling: boolean;
}

const pipLayouts: Record<number, [number, number][]> = {
  1: [[30, 30]],
  2: [[15, 15], [45, 45]],
  3: [[15, 15], [30, 30], [45, 45]],
  4: [[15, 15], [45, 15], [15, 45], [45, 45]],
  5: [[15, 15], [45, 15], [30, 30], [15, 45], [45, 45]],
  6: [[15, 12], [45, 12], [15, 30], [45, 30], [15, 48], [45, 48]],
};

const DiceFace = defineComponent({
  props: { value: { type: Number, required: true } },
  setup(props) {
    return () => h('svg', { viewBox: '0 0 60 60', width: 52, height: 52 },
      (pipLayouts[props.value] ?? []).map(([cx, cy]) =>
        h('circle', { cx, cy, r: 6, fill: '#222' })
      )
    );
  },
});

const props = defineProps<{
  dice: Die[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle', idx: number): void;
}>();
</script>

<style>
.dice-row {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.die {
  width: 68px;
  height: 68px;
  border-radius: 14px;
  border: 3px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: white;
  transition: transform 0.15s, border-color 0.15s, box-shadow 0.15s;
  user-select: none;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  padding: 4px;
  box-sizing: border-box;
}

.die.selected {
  border-color: var(--ion-color-primary);
  box-shadow: 0 0 0 3px rgba(var(--ion-color-primary-rgb), 0.35);
  transform: translateY(-4px);
}

.die.rolling {
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(-15deg) scale(1.1); }
  40% { transform: rotate(15deg) scale(1.1); }
  60% { transform: rotate(-10deg); }
  80% { transform: rotate(10deg); }
}
</style>