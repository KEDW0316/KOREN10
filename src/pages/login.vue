<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const form = ref({
  email: '',
  password: '',
  remember: false,
});

const isPasswordVisible = ref(false);
const router = useRouter();

// const handleLogin = async () => {
//   // TODO: 실제 로그인 로직을 여기에 구현합니다.
//   // 예를 들면, API 호출을 통해 서버에서 로그인을 처리할 수 있습니다.

//   // 로그인이 성공적으로 처리된 경우 대시보드로 리디렉션합니다.
//   const { email, password } = form.value;
//   if (email == 'test' && password == 'test') {
//     const cafeId = 1;
//     router.push({ name: 'Dashboard', query: { cafeId : cafeId } });
//   }

//   if (email == 'test2' && password == 'test2') {
//     const cafeId = 2;
//     router.push({ name: 'Dashboard', query: { cafeId : cafeId } });
//   }
  
// };

const handleLogin = async () => {
  const { email, password } = form.value;

  try {
    // email 값을 사용하여 API에서 사용자 정보를 가져옵니다.
    const response = await axios.get(`http://61.252.59.31:5000/user_web/${email}`);
    console.log(response)
    // API 응답에서 사용자 비밀번호와 관리하는 카페 ID를 가져옵니다.
    const { user_pw, manage_cafe_id } = response.data;

    // 입력된 비밀번호와 API 응답의 비밀번호를 비교합니다.
    if (password === user_pw) {
      // 비밀번호가 일치하면 대시보드로 리디렉션하고, 카페 ID를 쿼리로 전달합니다.
      router.push({ name: 'Dashboard', query: { cafeId: manage_cafe_id } });
    } else {
      // 비밀번호가 일치하지 않으면 오류 메시지를 표시합니다.
      console.error("Incorrect password");
      // 여기에 사용자에게 비밀번호가 틀렸다는 메시지를 표시하는 코드를 추가할 수 있습니다.
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    // 여기에 API 호출에 실패했을 때의 처리 로직을 추가할 수 있습니다.
  }
};

</script>
  
<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <VCardTitle class="text-2xl font-weight-bold">
          MICA
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="handleLogin">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                autofocus
                placeholder="johndoe"
                label="ID"
                type="email"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                <VCheckbox
                  v-model="form.remember"
                  label="Remember me"
                />

                <RouterLink
                  class="text-primary ms-2 mb-1"
                  to="javascript:void(0)"
                >
                  Forgot Password?
                </RouterLink>
              </div>

              <!-- login button -->
              <VBtn
                block
                type="submit"
              >
                Login
              </VBtn>
            </VCol>

            <!-- create account -->
            <VCol
              cols="12"
              class="text-center text-base"
            >
              <span>New on our platform?</span>
              <RouterLink
                class="text-primary ms-2"
                to="/register"
              >
                Create an account
              </RouterLink>
            </VCol>

            
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
