<script setup>
import illustrationJohnDark from '@images/cards/illustration-john-dark.png';
import illustrationJohnLight from '@images/cards/illustration-john-light.png';
import { computed, ref } from 'vue';
import { useTheme } from 'vuetify';

const { global } = useTheme()
const illustrationJohn = computed(() => global.name.value === 'dark' ? illustrationJohnDark : illustrationJohnLight)

function randomDelay(max) {
  return Math.random() * max;
}

function randomOccupancy() {
  return Math.random() > 0.5; // 50% 확률로 점유 유무를 결정
}

function randomStayTime() {
  return Math.floor(Math.random() * 120) + 1; // 1분부터 120분까지 랜덤 체류시간
}

const getStayTime = (seat) => {
    return seat.stayTime;
}

const seatSpacing = 50; // 좌석 간의 간격
const rows = 5;
const cols = 5;
const seats = ref([]);  // <-- 여기를 수정하였습니다.

const svgWidth = 300; 
const svgHeight = 280; 
const totalSeatWidth = (cols - 1) * seatSpacing;
const totalSeatHeight = (rows - 1) * seatSpacing;

const startX = (svgWidth - totalSeatWidth) / 2;
const startY = (svgHeight - totalSeatHeight) / 2 - 20;

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    seats.value.push({  // <-- 여기를 수정하였습니다.
      x: startX + j * seatSpacing,
      y: startY + i * seatSpacing,
      delay: randomDelay(1) + 's',
      occupied: randomOccupancy(),
      stayTime: randomStayTime() // 랜덤 체류시간 설정
    });
  }
}

// const coordinates = [
//   { x: 400, y: 270 },
//   { x: 600, y: 270 },
//   { x: 850, y: 270 },
//   { x: 140, y: 400 },
//   { x: 780, y: 400 }
// ];

// // 최대 x, y 값을 찾습니다.
// const maxX = Math.max(...coordinates.map(coord => coord.x));
// const maxY = Math.max(...coordinates.map(coord => coord.y));

// // 화면의 최대 너비와 높이를 정의합니다.
// const maxScreenWidth = 250;  // SVG의 너비
// const maxScreenHeight = 200; // SVG의 높이

// // 스케일링 비율을 계산합니다.
// const scaleX = maxScreenWidth / maxX;
// const scaleY = maxScreenHeight / maxY;

// seats.value = coordinates.map(coord => ({
//   x: coord.x * scaleX,
//   y: coord.y * scaleY,
//   delay: randomDelay(1) + 's',
//   occupied: randomOccupancy(),
//   stayTime: randomStayTime() // 랜덤 체류시간 설정
// }));



console.log(seats)
</script>

<style scoped>
.seating-col {
  height: 400px; /* 원하는 높이로 조정 */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style scoped>
@keyframes popIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.seat-animation {
  animation: popIn 0.7s forwards;
  transform-origin: center;
  transform: scale(1);
  transition: transform 0.3s ease-in-out;
  z-index: 1; /* z-index 추가 */
  pointer-events: all; /* pointer-events 설정 */
}

.seat-animation:hover {
    transform: scale(1.1);
}



.seating-title {
    font-size: 1.5rem;
    font-weight: bold;
    padding: 1rem 0;
    text-align: center;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
}
</style>

<template>
  <VCard class="text-center text-sm-start">
    <VRow no-gutters>
        <!-- 제목 열 추가 -->
        <VCol cols="12">
            <div class="seating-title">
                MICA 좌석 현황
            </div>
        </VCol>

        <VCol cols="12" sm="8" order="2" order-sm="1" class="seating-col">
          <div class="seating-map">
    <!-- Dynamic Seating Map using SVG -->
    <svg :width="svgWidth" :height="svgHeight" xmlns="http://www.w3.org/2000/svg">
        <!-- Generate seats dynamically -->
        <rect 
          v-for="seat in seats" 
          :key="`${seat.x}-${seat.y}`" 
          :x="seat.x" 
          :y="seat.y" 
          width="30" 
          height="30" 
          :fill="seat.occupied ? '#FFB6C1' : '#ccc'"
          class="seat-animation" 
          :style="{ animationDelay: seat.delay }"
        />

        <g 
            v-for="seat in seats" 
            :key="`${seat.x}-${seat.y}-group`"
        >
            <text 
                v-if="seat.occupied"
                :key="`${seat.x}-${seat.y}-text`" 
                :x="seat.x + 15"  
                :y="seat.y + 20"  
                font-size="14"  
                fill="black"  
                text-anchor="middle"
            >
                {{ seat.stayTime }}m
            </text>
        </g>


    </svg>
</div>


        </VCol>

        <VCol cols="12" sm="4" order="1" order-sm="2" class="text-center">
            <img :src="illustrationJohn" :height="$vuetify.display.xs ? '150' : '175'" :class="$vuetify.display.xs ? 'mt-6 mb-n2' : 'position-absolute'" class="john-illustration flip-in-rtl">
        </VCol>
    </VRow>
</VCard>

</template>

<style lang="scss" scoped>
.john-illustration {
  inset-block-end: -0.0625rem;
  inset-inline-end: 3rem;
}
</style>
