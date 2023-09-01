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

const is_occupied = [
  [2, 2, 2, 2, 2, 1],
  [2, 2, 2, 2, 2, 1],
  [2, 2, 0, 2, 2, 1],
  [2, 2, 2, 2, 2, 1],
  [2, 2, 2, 2, 2, 1],
  [2, 1, 0, 2, 2, 1],
  [2, 1, 0, 2, 2, 1],
  [2, 1, 0, 2, 2, 1],
  [2, 1, 0, 2, 2, 1],
  [2, 1, 0, 0, 2, 1],
  [2, 1, 0, 0, 2, 1],
  [2, 1, 0, 0, 1, 1]
];
let currentIndex = ref(0); // 현재 is_occupied 배열의 인덱스

const updateOccupancyStatus = () => {
  
  if (currentIndex.value < is_occupied.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0; // 배열의 마지막 상태에 도달하면 처음으로 돌아갑니다.
  }

  seats.value.forEach((seat, index) => {
    seat.occupiedStatus = is_occupied[currentIndex.value][index];
  });
  
};

setInterval(updateOccupancyStatus, 1500);

// 최대 x, y 값을 찾습니다.
const maxX = Math.max(...coordinates.map(coord => coord.x));
const maxY = Math.max(...coordinates.map(coord => coord.y));

// 화면의 최대 너비와 높이를 정의합니다.
const maxScreenWidth = 250;  // SVG의 너비
const maxScreenHeight = 200; // SVG의 높이

// 스케일링 비율을 계산합니다.
const scaleX = maxScreenWidth / maxX;
const scaleY = maxScreenHeight / maxY;

// 팝업 상태와 선택된 좌석 정보를 저장하는 ref 추가
const isPopupVisible = ref(false);
const selectedSeat = ref(null);

// 팝업을 표시하는 함수
const showPopup = (seat) => {
  selectedSeat.value = seat;
  isPopupVisible.value = true;
};

// 팝업을 숨기는 함수
const hidePopup = () => {
  isPopupVisible.value = false;
  selectedSeat.value = null;
};


// 초기 상태 설정
seats.value = coordinates.map((coord, index) => ({
  x: coord.x * scaleX,
  y: coord.y * scaleY,
  delay: randomDelay(1) + 's',
  occupiedStatus: is_occupied[currentIndex.value][index],
  stayTime: randomStayTime(),
  description: ''  // 초기 설명은 빈 문자열로 설정
}));




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
.seat-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background-color: white;
  border: 1px solid #ccc;
  z-index: 1000;
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

        <VCol cols="12" sm="12" order="2" order-sm="1" class="seating-col">
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
                    :fill="seat.occupiedStatus === 2 ? '#ccc' : '#FFB6C1'"
                    class="seat-animation" 
                    :style="{ animationDelay: seat.delay }"
                    @click="showPopup(seat)"
                  />

                  <g 
                      v-for="seat in seats" 
                      :key="`${seat.x}-${seat.y}-group`"
                  >
                      <text 
                          v-if="seat.occupiedStatus === 0 || seat.occupiedStatus === 1"
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
              <VDialog v-model="isPopupVisible" max-width="400px">
                <VCard>
                  <VCardText v-if="selectedSeat">
                    
                    <VTextarea
                      v-model="selectedSeat.description"
                      label="설명"
                      rows="3"
                      auto-grow
                    ></VTextarea>
                  </VCardText>
                  <VCardActions>
                    <VBtn color="green darken-1" text @click="hidePopup">닫기</VBtn>
                  </VCardActions>
                </VCard>
              </VDialog>

          </div>


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
