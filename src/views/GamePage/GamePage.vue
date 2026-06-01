<template>
  <ion-page>
    <PageHeader text="Kościany Poker" />

    <ion-content :fullscreen="true">
      <div class="game-container">

        <!-- Gracz 1 -->
        <div class="player-section" :class="{ active: currentPlayerId === 1, inactive: currentPlayerId !== 1 }">
          <h2 class="player-title">Gracz 1</h2>
          <Dice 
            :dice="players[0].dice" 
            :disabled="currentPlayerId !== 1 || players[0].turnEnded" 
            @toggle="toggleDie(0, $event)" 
          />
          <ion-chip color="success">Obecna figura: {{ calculatePlayerDiceSchema(players[0].dice).name }} </ion-chip>
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

        <div class="result-info-banner">
          <div>
            Tura: Gracz {{ currentPlayerId }}
          </div>
          <ion-chip>
            Gracz 1: {{ players[0].points }} punktów
          </ion-chip>
          <ion-chip>
            Gracz 2: {{ players[1].points }} punktów
          </ion-chip>
        </div>

        <!-- Gracz 2 -->
        <div class="player-section" :class="{ active: currentPlayerId === 2, inactive: currentPlayerId !== 2 }">
          <h2 class="player-title">Gracz 2</h2>
          <Dice 
            :dice="players[1].dice" 
            :disabled="currentPlayerId !== 2 || players[1].turnEnded" 
            @toggle="toggleDie(1, $event)" 
          />
          <ion-chip v-if="currentPlayerId === 2" color="success">Obecna figura: {{ calculatePlayerDiceSchema(players[1].dice).name }} </ion-chip>
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
import {
  IonButton,
  IonButtons,
  IonChip,
  IonContent, IonHeader, IonMenuButton,
  IonPage, IonTitle, IonToolbar,
  toastController,
} from '@ionic/vue';
import { reactive, ref } from 'vue';
import Dice from './Dice.vue';
import PageHeader from '../../components/PageHeader.vue';

const players = reactive([
  { id: 1, dice: getEmptyDice(), rollsLeft: 2, turnEnded: false, points: 0 },
  { id: 2, dice: getEmptyDice(), rollsLeft: 2, turnEnded: false, points: 0 },
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

async function compareResultsAndAddPoints() {
  const player1Points = calculatePlayerDiceSchema(players[0].dice).points;
  const player2Points = calculatePlayerDiceSchema(players[1].dice).points;

  let message;
  let color;
  if (player1Points === player2Points) {
    message = 'Remis! Nikt nie dostaje punktów.';
    color = 'warning';
  } else if (player1Points > player2Points) {
    players[0].points += player1Points;
    message = `Gracz 1 wygrywa rundę! (+${player1Points} pkt)`;
    color = 'success';
  } else {
    players[1].points += player2Points;
    message = `Gracz 2 wygrywa rundę! (+${player2Points} pkt)`;
    color = 'success';
  }

  const toast = await toastController.create({
    message,
    duration: 2500,
    color,
    position: 'middle',
  });
  await toast.present();
}

async function endTurn(playerId) {
  // Odznacz wszystkie kości
  players[playerId].dice.forEach(d => { d.selected = false; });
  players[playerId].turnEnded = true;

  if (playerId === 0 && !players[1].turnEnded) {
    currentPlayerId.value = 2;
  }
  if (playerId === 1 && players[1].turnEnded) {
    await compareResultsAndAddPoints();
  } 
}

const diceSchemas = {
  x0_nothing: {name: "nic", points: 0},
  x1_pair: { name: "para", points: 1 },
  x2_two_pairs: { name: "dwie pary", points: 2 },
  x3_three_of_a_kind: { name: "trójka", points: 3 },
  x4_small_straight: { name: "mały strit", points: 4 },
  x5_big_straight: { name: "duży strit", points: 5 },
  x6_full_house: { name: "full", points: 6 },
  x7_four_of_a_kind: { name: "kareta", points: 7 },
  x8_poker: { name: "poker", points: 8 },
};

function calculatePlayerDiceSchema(dice) {
  const sortedValues = [...dice].sort((a, b) => a.value - b.value).map(d => d.value);
  
  
  // DUŻY I MAŁY STRIT
  // JSON Stringify jest potrzebne bo bez tego nawet jak tablice mają takie same wartości to są rozpoznawane jako 2 różne obiekty i porównanie zwraca false
  const isSmallStraight = JSON.stringify(sortedValues) === JSON.stringify([1, 2, 3, 4, 5]);
  const isBigStraight = JSON.stringify(sortedValues) === JSON.stringify([2, 3, 4, 5, 6]);
  if (isSmallStraight) {
    return diceSchemas.x4_small_straight;
  }
  if (isBigStraight) {
    return diceSchemas.x5_big_straight;
  }

  // POZOSTAŁE UKŁADY (PARA, DWIE PARY, TRÓJKA, FULL, KARETA, POKER)
  const cumulatedValues = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  };
  sortedValues.forEach((value, index) => {
    cumulatedValues[value]++;
  });
  const isPoker = Object.values(cumulatedValues).includes(5);
  const isFourOfAKind = Object.values(cumulatedValues).includes(4);
  const isFullHouse = Object.values(cumulatedValues).includes(3) && Object.values(cumulatedValues).includes(2);
  const isThreeOfAKind = Object.values(cumulatedValues).includes(3) && !isFullHouse;
  const isTwoPairs = Object.values(cumulatedValues).filter(count => count === 2).length === 2;
  const isPair = Object.values(cumulatedValues).includes(2) && !isTwoPairs;
  if (isPoker) return diceSchemas.x8_poker;
  if (isFourOfAKind) return diceSchemas.x7_four_of_a_kind;
  if (isFullHouse) return diceSchemas.x6_full_house;
  if (isThreeOfAKind) return diceSchemas.x3_three_of_a_kind;
  if (isTwoPairs) return diceSchemas.x2_two_pairs;
  if (isPair) return diceSchemas.x1_pair; 
  return diceSchemas.x0_nothing; // Zwraca nic jeśli nie ma żadnego układu
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

.result-info-banner {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 16px;
  color: white;
  background: var(--ion-color-tertiary);
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
