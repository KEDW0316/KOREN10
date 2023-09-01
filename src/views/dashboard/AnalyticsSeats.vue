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

// const startX = (svgWidth - totalSeatWidth) / 2;
// const startY = (svgHeight - totalSeatHeight) / 2 - 20;

// for (let i = 0; i < rows; i++) {
//   for (let j = 0; j < cols; j++) {
//     seats.value.push({  // <-- 여기를 수정하였습니다.
//       x: startX + j * seatSpacing,
//       y: startY + i * seatSpacing,
//       delay: randomDelay(1) + 's',
//       occupied: randomOccupancy(),
//       stayTime: randomStayTime() // 랜덤 체류시간 설정
//     });
//   }
// }

const coordinates = [
  { x: 0, y: 0 },
  { x: 23, y: 0 },
  { x: 50, y: 0 },
  { x: 50, y: 20 },
  { x: 0, y: 50 },
  { x: 50, y: 50 }
];


// 최대 x, y 값을 찾습니다.
const maxX = Math.max(...coordinates.map(coord => coord.x));
const maxY = Math.max(...coordinates.map(coord => coord.y));

// 화면의 최대 너비와 높이를 정의합니다.
const maxScreenWidth = 150;  // SVG의 너비
const maxScreenHeight = 100; // SVG의 높이

// 스케일링 비율을 계산합니다.
const scaleX = maxScreenWidth / maxX;
const scaleY = maxScreenHeight / maxY;



// 초기 상태 설정
seats.value = coordinates.map((coord, index) => ({
  x: coord.x * scaleX,
  y: coord.y * scaleY,
  delay: randomDelay(1) + 's',
  stayTime: randomStayTime(),
  description: ''  // 초기 설명은 빈 문자열로 설정
}));

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

.seating-title {
    font-size: 1.5rem;
    font-weight: bold;
    padding: 1rem 0;
    text-align: center;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
}

.text-wrapper {
  display: flex; /* Flexbox를 사용하여 자식 요소들을 가로로 배열 */
  justify-content: space-between; /* 자식 요소들 사이에 동일한 간격을 부여 */
}

.text-container {
  padding: 20px;
  border: 2px solid #E0E0E0;
  background-color: #EDE7F6;
  border-radius: 10px;
  font-size: 16px;
  color: #616161;
  text-align: center;
  margin-bottom: 10px; /* 각 텍스트 박스 사이에 마진 추가 */
  height: 80px; /* 텍스트 박스의 높이를 조절 */
  display: flex;
  align-items: center; /* 텍스트를 박스 중앙에 위치시키기 위해 */
  justify-content: center;
}
</style>

<template>
  <VCard class="text-center text-sm-start">
    <VRow no-gutters>
      <!-- 제목 열 추가 -->
      <VCol cols="12">
          <div class="seating-title">
              좌석 통계 정보
          </div>
      </VCol>

      <VCol cols="12" sm="8" order="2" order-sm="1" class="seating-col">
        <div class="seating-map">
          <!-- Dynamic Seating Map using SVG -->
          <svg :width="svgWidth" :height="svgHeight" xmlns="http://www.w3.org/2000/svg">
            <!-- Generate seats dynamically -->
            <g v-for="(seat, index) in seats" :key="`${seat.x}-${seat.y}-group`">
              <rect 
                :x="seat.x" 
                :y="seat.y" 
                width="30" 
                height="30" 
                fill="#ccc"
                class="seat-animation" 
                :style="{ animationDelay: seat.delay }"
              />
              <text 
                :x="seat.x + 15"  
                :y="seat.y + 20"  
                font-size="14"  
                fill="black"  
                text-anchor="middle"
              >
                {{ index + 1 }}
              </text>
            </g>
          </svg>
        </div>
      </VCol>
      <VCol cols="12" sm="4" order="2" order-sm="1" class="seating-col">
        <VRow>
          좌석별 빅데이터 분석 결과가 여기 표시됩니다.
          좌석을 클릭하면 해당 데이터를 볼 수 있게 개발 할 예정입니다!
        </VRow>
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
