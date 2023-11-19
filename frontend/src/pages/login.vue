<script setup lang="ts">
import { useTheme } from 'vuetify'
import { Modal } from 'usemodal-vue3'
import axios from 'axios'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'

import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'

const form = ref({
  email: '',
  password: '',
  remember: false,
})

// take form from local storage if saved
if (localStorage.getItem('form'))
  form.value = JSON.parse(localStorage.getItem('form')!)

const router = useRouter()

const vuetifyTheme = useTheme()

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light'
    ? authV1MaskLight
    : authV1MaskDark
})

const isPasswordVisible = ref(false)
const isModalErrorVisible = ref(false)
const errorMessage = ref('')

const goToRoot = () => {
  router.push('/')
}

const login = async (email: string, password: string) => {
  try {
    const response = await axios.post('http://localhost:4000/api/user/login', {
      email,
      password,
    })

    // Assuming that your server sends back JSON data
    const json = response.data

    if (response.status === 200) {
      // Save the user to local storage
      localStorage.setItem('user', JSON.stringify(json))
      goToRoot()
      console.log(json)
    }
  }
  catch (error) {
    // Handle any errors that occurred during the request
    isModalErrorVisible.value = true
    errorMessage.value = error.response.data.error
    console.error('Error during login:', error)
  }
}

const handleSubmit = async (e: SubmitEvent) => {
  e.preventDefault()
  console.log(form.value)
  await login(form.value.email, form.value.password)
}

const remmeberPassword = () => {
  // save the form data to local storage
  form.value.remember = !form.value.remember
  if (!form.value.remember)
    localStorage.removeItem('form')
  else
    localStorage.setItem('form', JSON.stringify(form.value))
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="app-logo d-flex align-center gap-x-3 app-title-wrapper">
            <VIcon icon="mdi-cash-multiple" />
          </div>
        </template>

        <VCardTitle class="font-weight-semibold text-2xl text-uppercase">
          Brokers
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 font-weight-semibold mb-1">
          Welcome to Brokers!
        </h5>
        <p class="mb-0">
          Please sign-in to your account and start the adventure
        </p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="handleSubmit">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                label="Email"
                type="email"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Password"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                <VCheckbox
                  v-model="form.remember"
                  label="Remember me"
                  @click="remmeberPassword"
                />

                <a
                  class="ms-2 mb-1"
                  href="javascript:void(0)"
                >
                  Forgot Password?
                </a>
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

            <VCol
              cols="12"
              class="d-flex align-center"
            >
              <VDivider />
              <span class="mx-4">or</span>
              <VDivider />
            </VCol>

            <!-- auth providers -->
            <VCol
              cols="12"
              class="text-center"
            >
              <AuthProvider />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <Modal
      v-model:visible="isModalErrorVisible"
      title="Error Message"
    >
      <div class="error-message">
        {{ errorMessage }}
      </div>
    </Modal>

    <VImg
      class="auth-footer-start-tree d-none d-md-block"
      :src="authV1Tree"
      :width="250"
    />

    <VImg
      :src="authV1Tree2"
      class="auth-footer-end-tree d-none d-md-block"
      :width="350"
    />

    <!-- bg img -->
    <VImg
      class="auth-footer-mask d-none d-md-block"
      :src="authThemeMask"
    />
  </div>
</template>

<style lang="scss">
@use "@core/scss/pages/page-auth.scss";
</style>
