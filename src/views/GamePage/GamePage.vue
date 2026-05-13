<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Kościany Poker</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="game-container">

        <div class="turn-banner" :class="'player-' + currentPlayer">
          Tura: Gracz {{ currentPlayer }}
        </div>

        <!-- Gracz 1 -->
        <div class="player-section" :class="{ active: currentPlayer === 1, inactive: currentPlayer !== 1 }">
          <h2 class="player-title">Gracz 1</h2>
          <div class="dice-row">
          <Dice 
            :dice="players[0].dice" 
            :disabled="currentPlayer !== 1 || turnEnded[0]" 
            @toggle="toggleDie(0, $event)" 
          />
          </div>
          <div class="controls" v-if="currentPlayer === 1 && !turnEnded[0]">
            <ion-button @click="rollSelected(0)" :disabled="players[0].dice.every(d => !d.selected) || players[0].rollsLeft === 0" color="primary">
              Przerzuć zaznaczone ({{ players[0].rollsLeft }} pozostało)
            </ion-button>
            <ion-button @click="endTurn(0)" color="success">
              Zatwierdź ruch
            </ion-button>
          </div>
          <div class="turn-done" v-if="turnEnded[0]">
            <ion-chip color="success">Ruch zakończony</ion-chip>
          </div>
        </div>

        <ion-divider></ion-divider>

        <!-- Gracz 2 -->
        <div class="player-section" :class="{ active: currentPlayer === 2, inactive: currentPlayer !== 2 }">
          <h2 class="player-title">Gracz 2</h2>
          <Dice 
            :dice="players[1].dice" 
            :disabled="currentPlayer !== 2 || turnEnded[1]" 
            @toggle="toggleDie(1, $event)" 
          />
          <div class="controls" v-if="currentPlayer === 2 && !turnEnded[1]">
            <ion-button @click="rollSelected(1)" :disabled="players[1].dice.every(d => !d.selected) || players[1].rollsLeft === 0" color="primary">
              Przerzuć zaznaczone ({{ players[1].rollsLeft }} pozostało)
            </ion-button>
            <ion-button @click="endTurn(1)" color="success">
              Zatwierdź ruch
            </ion-button>
          </div>
          <div class="turn-done" v-if="turnEnded[1]">
            <ion-chip color="success">Ruch zakończony</ion-chip>
          </div>
        </div>

        <!-- Koniec rundy -->
        <div class="round-end" v-if="turnEnded[0] && turnEnded[1]">
          <p class="round-summary">Runda zakończona!</p>
          <ion-button expand="block" @click="resetRound" color="warning">Nowa runda</ion-button>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, reactive } from 'vue';
import {
  IonButtons, IonContent, IonHeader, IonMenuButton,
  IonPage, IonTitle, IonToolbar, IonButton, IonChip, IonDivider
} from '@ionic/vue';
import Dice from './Dice.vue';

function randomDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function makeDice() {
  return Array.from({ length: 5 }, () => ({ value: randomDie(), selected: false, rolling: false }));
}

const players = reactive([
  { dice: makeDice(), rollsLeft: 2 },
  { dice: makeDice(), rollsLeft: 2 },
]);

const currentPlayer = ref(1);
const turnEnded = reactive([false, false]);

function toggleDie(playerIdx, dieIdx) {
  const die = players[playerIdx].dice[dieIdx];
  die.selected = !die.selected;
}

async function rollSelected(playerIdx) {
  const player = players[playerIdx];
  if (player.rollsLeft <= 0) return;

  const selectedDice = player.dice.filter(d => d.selected);
  if (selectedDice.length === 0) return;

  // Animacja
  selectedDice.forEach(d => { d.rolling = true; });
  await new Promise(r => setTimeout(r, 500));

  selectedDice.forEach(d => {
    d.value = randomDie();
    d.selected = false;
    d.rolling = false;
  });

  player.rollsLeft--;
}

function endTurn(playerIdx) {
  // Odznacz wszystkie kości
  players[playerIdx].dice.forEach(d => { d.selected = false; });
  turnEnded[playerIdx] = true;

  if (playerIdx === 0 && !turnEnded[1]) {
    currentPlayer.value = 2;
  }
}

function resetRound() {
  players[0].dice = makeDice();
  players[1].dice = makeDice();
  players[0].rollsLeft = 2;
  players[1].rollsLeft = 2;
  turnEnded[0] = false;
  turnEnded[1] = false;
  currentPlayer.value = 1;
}
</script>

<style scoped>
.game-container {
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.turn-banner {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 16px;
  color: white;
}

.turn-banner.player-1 {
  background: var(--ion-color-primary);
}

.turn-banner.player-2 {
  background: var(--ion-color-secondary);
}

.player-section {
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  transition: opacity 0.3s;
}

.player-section.inactive {
  opacity: 0.4;
  pointer-events: none;
}

.player-section.active {
  opacity: 1;
  background: rgba(var(--ion-color-primary-rgb), 0.06);
}

.player-title {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.turn-done {
  text-align: center;
  margin-top: 8px;
}

.round-end {
  text-align: center;
  padding: 20px;
}

.round-summary {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 12px;
}
</style>
