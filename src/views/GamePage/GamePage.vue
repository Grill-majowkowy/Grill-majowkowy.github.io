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

        <div class="turn-banner" :class="'player-' + currentPlayerId">
          Tura: Gracz {{ currentPlayerId }}
        </div>

        <!-- Gracz 1 -->
        <div class="player-section" :class="{ active: currentPlayerId === 1, inactive: currentPlayerId !== 1 }">
          <h2 class="player-title">Gracz 1</h2>
          <div class="dice-row">
          <Dice 
            :dice="players[0].dice" 
            :disabled="currentPlayerId !== 1 || players[0].turnEnded" 
            @toggle="toggleDie(0, $event)" 
          />
          </div>
          <div class="controls" v-if="currentPlayerId === 1 && !players[0].turnEnded">
            <ion-button @click="rollSelectedDice(0)" :disabled="players[0].dice.every(d => !d.selected) || players[0].rollsLeft === 0" color="primary">
              Przerzuć zaznaczone ({{ players[0].rollsLeft }} pozostało)
            </ion-button>
            <ion-button @click="endTurn(0)" color="success">
              Zatwierdź ruch
            </ion-button>
          </div>
          <div class="turn-done" v-if="players[0].turnEnded">
            <ion-chip color="success">Ruch zakończony</ion-chip>
          </div>
        </div>

        <ion-divider></ion-divider>

        <!-- Gracz 2 -->
        <div class="player-section" :class="{ active: currentPlayerId === 2, inactive: currentPlayerId !== 2 }">
          <h2 class="player-title">Gracz 2</h2>
          <Dice 
            :dice="players[1].dice" 
            :disabled="currentPlayerId !== 2 || players[1].turnEnded" 
            @toggle="toggleDie(1, $event)" 
          />
          <div class="controls" v-if="currentPlayerId === 2 && !players[1].turnEnded">
            <ion-button @click="rollSelectedDice(1)" :disabled="players[1].dice.every(d => !d.selected) || players[1].rollsLeft === 0" color="primary">
              Przerzuć zaznaczone ({{ players[1].rollsLeft }} pozostało)
            </ion-button>
            <ion-button @click="endTurn(1)" color="success">
              Zatwierdź ruch
            </ion-button>
          </div>
          <div class="turn-done" v-if="players[1].turnEnded">
            <ion-chip color="success">Ruch zakończony</ion-chip>
          </div>
        </div>

        <!-- Koniec rundy -->
        <div class="round-end" v-if="players[0].turnEnded && players[1].turnEnded">
          <p class="round-summary">Runda zakończona!</p>
          <ion-button expand="block" @click="endRound" color="warning">Nowa runda</ion-button>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import {
  IonButtons, IonContent, IonHeader, IonMenuButton,
  IonPage, IonTitle, IonToolbar, IonButton, IonChip
} from '@ionic/vue';
import Dice from './Dice.vue';

const players = reactive([
  { id: 1, dice: getEmptyDice(), rollsLeft: 2, turnEnded: false },
  { id: 2, dice: getEmptyDice(), rollsLeft: 2, turnEnded: false },
]);

const currentPlayerId = ref(1);

function cleanPlayersBoard() {
  players[0].id = 1;
  players[1].id = 2;
  players[0].dice = getEmptyDice();
  players[1].dice = getEmptyDice();
  players[0].rollsLeft = 2;
  players[1].rollsLeft = 2;
  players[0].turnEnded = false;
  players[1].turnEnded = false;
  currentPlayerId.value = 1;
}

function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function getEmptyDice() {
  return Array.from({ length: 5 }, () => ({ 
    value: 0, 
    selected: true, 
    rolling: false,
  }));
}

function rollDice() {
  return Array.from({ length: 5 }, () => ({ 
    value: rollDie(), 
    selected: false, 
    rolling: false,
  }));
}

function toggleDie(playerId, dieIdx) {
  const die = players[playerId].dice[dieIdx];
  if (players[playerId].rollsLeft <= 0) return; // nie można zaznaczać kości po wykorzystaniu wszystkich rzutów
  if (die.value !== 0) { // nie roluj pustych kości
    die.selected = !die.selected;
  }
}

async function rollSelectedDice(playerId) {
  const player = players[playerId];
  if (player.rollsLeft <= 0) return;

  const selectedDice = player.dice.filter(d => d.selected);
  if (selectedDice.length === 0) return;

  // Animacja co trwa chwilę czasu (timeout)
  selectedDice.forEach(d => { d.rolling = true; });
  await new Promise(r => setTimeout(r, 500));

  selectedDice.forEach(d => {
    d.value = rollDie();
    d.selected = false;
    d.rolling = false;
  });

  player.rollsLeft--;
}

function endTurn(playerId) {
  // Odznacz wszystkie kości
  players[playerId].dice.forEach(d => { d.selected = false; });
  players[playerId].turnEnded = true;

  if (playerId === 0 && !players[1].turnEnded) {
    currentPlayerId.value = 2;
  }
}

function endRound() {
  cleanPlayersBoard();
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
