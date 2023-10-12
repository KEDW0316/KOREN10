<script setup>
import illustrationJohnDark from '@images/cards/illustration-john-dark.png';
import illustrationJohnLight from '@images/cards/illustration-john-light.png';
import axios from 'axios';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useTheme } from 'vuetify';

const route = useRoute();
const hasConsent = ref(false); // 콘센트 유무
const isWindowSeat = ref(false); // 창가자리 유무
const seatCapacity = ref(1); // 몇인석인지 (기본값 1인석)

let intervalId; // setInterval의 ID를 저장하기 위한 변수

const { global } = useTheme();
const cafeid = route.query.cafeId;
console.log(cafeid)
const illustrationJohn = computed(() => global.name.value === 'dark' ? illustrationJohnDark : illustrationJohnLight);
const countdown = ref(5); // 카운트다운을 저장할 ref

onMounted(() => {
  fetchData(); // 처음에 한 번 호출
  intervalId = setInterval(() => {
    if (countdown.value === 0) {
      fetchData();
      countdown.value = 5; // fetchData 호출 후 카운트다운 재설정
    } else {
      countdown.value -= 1; // 카운트다운 감소
    }
  }, 1000); // 1초마다 실행
});

onBeforeUnmount(() => {
  clearInterval(intervalId); // 컴포넌트 파괴 전에 타이머 정리
});

function randomDelay(max) {
  return Math.random() * max;
}

function randomStayTime() {
  return Math.floor(Math.random() * 120) + 1;
}

const seats = ref([]);

const handleButtonClick = () => {
  updateSeatData();
  hidePopup();
};
const rearrangeSeats = async () => {
  try {
    const response = await axios.get('http://10.246.246.26:10001/rearrangement');
    if (response.status === 200) {
      console.log("Seats rearranged successfully");
      // 필요한 경우, 추가적인 로직 (예: 화면 갱신)을 여기에 추가합니다.
    } else {
      console.error("Error rearranging seats:", response.data);
    }
  } catch (error) {
    console.error("Error rearranging seats:", error);
  }
};

const updateSeatData = async () => {
  try {
    const url = `http://61.252.59.31:5000/update_etc/${cafeid}/${selectedSeat.value.id}`;
    const body = {
      "etc": selectedSeat.value.description
    };

    const response = await axios.put(url, body); // 여기를 수정합니다.

    if (response.status === 200) {
      console.log("Data updated successfully");
    } else {
      console.error("Error updating data:", response.data);
    }
  } catch (error) {
    console.error("Error updating data:", error);
  }
};



const fetchData = async () => {
  try {
    const response = await axios.get(`http://61.252.59.31:5000/seatinfo/${cafeid}`);
    const data = response.data;

    // 임시로 좌석 데이터를 저장합니다.
    const tempSeats = data.map(seat => ({
      x: seat.seat_x,
      y: seat.seat_y,
      delay: randomDelay(1) + 's',
      occupiedStatus: seat.seat_label === "2" ? 2 : 1,
      stayTime: seat.time, // 초를 분으로 변환
      description: '',
      id: seat.seat_id
    }));
    console.log(data)

    // 최대 x, y 값을 찾습니다.
    const maxX = Math.max(...tempSeats.map(seat => seat.x));
    const maxY = Math.max(...tempSeats.map(seat => seat.y));

    // 화면의 최대 너비와 높이를 정의합니다.
    const maxScreenWidth = 250;  // SVG의 너비
    const maxScreenHeight = 200; // SVG의 높이

    // 스케일링 비율을 계산합니다.
    const scaleX = maxScreenWidth / maxX;
    const scaleY = maxScreenHeight / maxY;

    // 스케일링된 좌표로 좌석 데이터를 업데이트합니다.
    seats.value = tempSeats.map(seat => ({
      ...seat,
      x: seat.x * scaleX,
      y: seat.y * scaleY
    }));

    console.log(scaleX);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


const svgWidth = 300;
const svgHeight = 280;

const isPopupVisible = ref(false);
const selectedSeat = ref(null);

const showPopup = async (seat) => {
  try {
    const response = await axios.get(`http://61.252.59.31:5000/seatinfo/${cafeid}`);
    const seatData = response.data.find(s => s.seat_id === seat.id);

    if (seatData) {
      selectedSeat.value = {
        ...seat,
        description: seatData.etc || ''  // etc 정보를 description에 저장
      };
      isPopupVisible.value = true;
    }
  } catch (error) {
    console.error("Error fetching seat data:", error);
  }
};


const hidePopup = () => {
  isPopupVisible.value = false;
  selectedSeat.value = null;
};

onMounted(fetchData);
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
          <div class="seating-title-container">
              <div class="seating-title">
                  MICA 좌석 현황
                  <VChip color="primary" text-color="white" class="countdown-chip">
                  <VIcon left>mdi-timer</VIcon> <!-- 아이콘 (Vuetify의 아이콘을 사용) -->
                  {{ countdown }}s
              </VChip>
              </div>
              <!-- 카운트다운 및 아이콘 -->
              
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
                    <!-- 콘센트 유무 체크박스 -->
                    <VCheckbox v-model="hasConsent" label="콘센트 유무"></VCheckbox>
                    
                    <!-- 창가자리 유무 체크박스 -->
                    <VCheckbox v-model="isWindowSeat" label="창가자리 여부"></VCheckbox>
                    <div style="margin-top: 16px;"></div>
                    <!-- 몇인석인지 선택 -->
                    <VTextField
                      v-model="seatCapacity"
                      label="좌석 수"
                      type="number"
                      min="1"
                      outlined
                    ></VTextField>
                    
                    <!-- 공백 추가 -->
                    <div style="margin-top: 16px;"></div>
                    
                    <!-- 기타 특이사항 -->
                    <VTextarea
                      v-model="selectedSeat.description"
                      label="기타 특이사항"
                      rows="3"
                      auto-grow
                      outlined
                    ></VTextarea>
                  </VCardText>
                  <VCardActions>
                    <VBtn color="green darken-1" text @click="handleButtonClick">저장</VBtn>
                    <VBtn text @click="hidePopup">닫기</VBtn>
                  </VCardActions>
                </VCard>
              </VDialog>


          </div>


        </VCol>
        <VCol cols="12" class="text-center mt-3">
          <VBtn color="primary" elevation="2" @click="rearrangeSeats">좌석 재배치</VBtn>
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
