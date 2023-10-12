<script setup>
import { hexToRgb } from '@layouts/utils';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router'; // useRoute 훅을 import 합니다.
import VueApexCharts from 'vue3-apexcharts';
import {
useDisplay,
useTheme,
} from 'vuetify';
const currentMenu = ref(''); // 현재 선택된 메뉴

const isAmericanoPopupVisible = ref(false); // 아메리카노 팝업 표시 여부
const showMenuPopup = (menuName) => {
  currentMenu.value = menuName;
  isAmericanoPopupVisible.value = true;
};
const showAmericanoPopup = () => {
  isAmericanoPopupVisible.value = true;
};

const hideAmericanoPopup = () => {
  isAmericanoPopupVisible.value = false;
};
// const menus = ref([
// { rank: 1, name: 'Americano', icon: '☕' },
//   { rank: 2, name: 'Latte', icon: '🥛' },
//   { rank: 3, name: 'Tea', icon: '🍵' },
//   { rank: 4, name: 'Juice', icon: '🍹' },
// ]);

const menus = ref([]); // 초기값을 빈 배열로 설정

const vuetifyTheme = useTheme()
const display = useDisplay()

const route = useRoute(); // 현재 라우트 객체를 가져옵니다.
const cafeId = route.query.cafeId; // query에서 cafeId 값을 가져옵니다.

const topMenuName = ref(''); // API 응답에서 가져온 menu_name 값을 저장하기 위한 ref

const fetchTopMenu = async () => {
  try {
    const response = await axios.get(`http://61.252.59.31:5000/sold/${cafeId}`);
    if (response.data && response.data.menu_name) {
      topMenuName.value = response.data.menu_name;
    }
  } catch (error) {
    console.error("Error fetching top menu:", error);
  }
};

const fetchMenus = async () => {
  try {
    const response = await axios.get(`http://61.252.59.31:5000/sold_menu/${cafeId}`);
    if (response.data) {
      const menuData = [
        { rank: 1, name: response.data.First || 'Unknown', icon: '☕' },
        { rank: 2, name: response.data.Second || 'Unknown', icon: '🥛' },
        { rank: 3, name: response.data.Third || 'Unknown', icon: '🍹' },
        { rank: 4, name: 'Juice', icon: '🍹' },
      ];
      menus.value = menuData;
    }
  } catch (error) {
    console.error("Error fetching menus:", error);
  }
};

onMounted(() => {
  fetchTopMenu();
  fetchMenus(); // 메뉴 데이터를 가져오는 함수를 호출
});
const series = [
  {
    name: `${ new Date().getFullYear() - 1 }`,
    data: [
      18,
      7,
      15,
      29,
      18,
      12,
      9,
    ],
  },
  {
    name: `${ new Date().getFullYear() - 2 }`,
    data: [
      -13,
      -18,
      -9,
      -14,
      -5,
      -17,
      -15,
    ],
  },
]

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  const disabledTextColor = `rgba(${ hexToRgb(String(currentTheme['on-surface'])) },${ variableTheme['disabled-opacity'] })`
  const primaryTextColor = `rgba(${ hexToRgb(String(currentTheme['on-surface'])) },${ variableTheme['high-emphasis-opacity'] })`
  const borderColor = `rgba(${ hexToRgb(String(variableTheme['border-color'])) },${ variableTheme['border-opacity'] })`
  
  return {
    bar: {
      chart: {
        stacked: true,
        parentHeightOffset: 0,
        toolbar: { show: false },
      },
      dataLabels: { enabled: false },
      stroke: {
        width: 6,
        lineCap: 'round',
        colors: [currentTheme.surface],
      },
      colors: [
        `rgba(${ hexToRgb(String(currentTheme.primary)) }, 1)`,
        `rgba(${ hexToRgb(String(currentTheme.info)) }, 1)`,
      ],
      legend: {
        offsetX: -10,
        position: 'top',
        fontSize: '14px',
        horizontalAlign: 'left',
        fontFamily: 'Public Sans',
        labels: { colors: currentTheme.secondary },
        itemMargin: {
          vertical: 4,
          horizontal: 10,
        },
        markers: {
          width: 8,
          height: 8,
          radius: 10,
          offsetX: -4,
        },
      },
      states: {
        hover: { filter: { type: 'none' } },
        active: { filter: { type: 'none' } },
      },
      grid: {
        borderColor,
        padding: { bottom: 5 },
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          columnWidth: '30%',
          endingShape: 'rounded',
          startingShape: 'rounded',
        },
      },
      xaxis: {
        axisTicks: { show: false },
        crosshairs: { opacity: 0 },
        axisBorder: { show: false },
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
        ],
        labels: {
          style: {
            fontSize: '14px',
            colors: disabledTextColor,
            fontFamily: 'Public Sans',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '14px',
            colors: disabledTextColor,
            fontFamily: 'Public Sans',
          },
        },
      },
      responsive: [
        {
          breakpoint: display.thresholds.value.xl,
          options: { plotOptions: { bar: { columnWidth: '43%' } } },
        },
        {
          breakpoint: display.thresholds.value.lg,
          options: { plotOptions: { bar: { columnWidth: '50%' } } },
        },
        {
          breakpoint: display.thresholds.value.md,
          options: { plotOptions: { bar: { columnWidth: '42%' } } },
        },
        {
          breakpoint: display.thresholds.value.sm,
          options: { plotOptions: { bar: { columnWidth: '45%' } } },
        },
      ],
    },
    radial: {
      chart: { sparkline: { enabled: true } },
      labels: ['1위 상품'],
      stroke: { dashArray: 5 },
      colors: [`rgba(${ hexToRgb(String(currentTheme.primary)) }, 1)`],
      states: {
        hover: { filter: { type: 'none' } },
        active: { filter: { type: 'none' } },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          opacityTo: 0.6,
          opacityFrom: 1,
          shadeIntensity: 0.5,
          stops: [
            30,
            70,
            100,
          ],
          inverseColors: false,
          gradientToColors: [currentTheme.primary],
        },
      },
      plotOptions: {
        radialBar: {
          endAngle: 150,
          startAngle: -140,
          hollow: { size: '55%' },
          track: { background: 'transparent' },
          dataLabels: {
            name: {
              offsetY: 25,
              fontWeight: 600,
              fontSize: '16px',
              color: currentTheme.secondary,
              fontFamily: 'Public Sans',
            },
            value: {
              offsetY: -15,
              fontWeight: 500,
              fontSize: '24px',
              color: primaryTextColor,
              fontFamily: 'Public Sans',
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 900,
          options: { chart: { height: 200 } },
        },
        {
          breakpoint: 735,
          options: { chart: { height: 200 } },
        },
        {
          breakpoint: 660,
          options: { chart: { height: 200 } },
        },
        {
          breakpoint: 600,
          options: { chart: { height: 280 } },
        },
      ],
    },
  }
})

const balanceData = [
  {
    icon: 'bx-dollar',
    amount: '$32.5k',
    year: '2023',
    color: 'primary',
  },
  {
    icon: 'bx-wallet',
    amount: '$41.2k',
    year: '2022',
    color: 'info',
  },
]
</script>

<template>
  <VCard>
    <VRow no-gutters>
      <VCol
        cols="12"
        sm="7"
        xl="8"
        :class="$vuetify.display.smAndUp ? 'border-e' : 'border-b'"
      >
        <VCardItem class="pb-0">
          <VCardTitle>총 매출</VCardTitle>

          <template #append>
            <div class="me-n3">
              <MoreBtn />
            </div>
          </template>
        </VCardItem>

        <!-- bar chart -->
        <VueApexCharts
          id="bar-chart"
          type="bar"
          :height="336"
          :options="chartOptions.bar"
          :series="series"
        />
      </VCol>

      <VCol cols="12" sm="5" xl="4">
        <VRow class="menu-grid">
          <VCol v-for="menu in menus" :key="menu.rank" cols="6" class="menu-col">
            <VCard class="menu-card" @click="showMenuPopup(menu.name)">
              <div class="menu-icon text-center">{{ menu.icon }}</div>
              <VCardTitle class="text-center">{{ menu.name }}</VCardTitle>
              <VCardSubtitle class="text-center">{{ menu.rank }}위</VCardSubtitle>
            </VCard>
          </VCol>
          <VDialog v-model="isAmericanoPopupVisible" max-width="600px">
            <VCard>
              <VCardTitle class="text-h5 py-4 px-5">{{ currentMenu }} 매출 정보</VCardTitle>
              <VCardText class="px-5">
                <div class="py-2">
                  <span class="text-h6">일일 평균 판매량:</span>
                  <span class="text-h5 ml-2">100잔</span>
                </div>
                <div class="py-2">
                  <span class="text-h6">최고 매출 시간대:</span>
                  <span class="text-h5 ml-2">10:00 ~ 11:00</span>
                </div>
                <div class="py-2">
                  <span class="text-h6">주 연령층:</span>
                  <span class="text-h5 ml-2">20대</span>
                </div>
              </VCardText>
              <VCardActions class="justify-end pr-5 pb-4">
                <VBtn text @click="hideAmericanoPopup">닫기</VBtn>
              </VCardActions>
            </VCard>
          </VDialog>

        </VRow>
        <div class="text-center mt-4" v-if="menus.length">
          카페의 매출 1위 메뉴는 <strong>{{ menus[0].name }}</strong> 입니다.
        </div>
      </VCol>


    </VRow>
  </VCard>
</template>

<style lang="scss">
#bar-chart .apexcharts-series[rel="2"] {
  transform: translateY(-10px);
}
</style>

<style scoped>
.menu-grid {
  padding: 16px;
}

.menu-col {
  padding: 8px; 
} 
.menu-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.menu-card {
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
  cursor: pointer; 

}
</style>





