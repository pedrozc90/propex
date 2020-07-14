<template>
    <q-layout>
        <q-page-container>
            <q-page class="row justify-center items-center bg-primary" style="height: 100%">
                <q-card class="full-width" :bordered="true" style="max-width: 500px" flat square>
                    <q-form ref="form" @submit="login">
                        <q-card-section class="logo">
                            <!-- <img src="~assets/quasar-logo-full.svg" alt="Logo"> -->
                            <h2 class="text-h4 text-primary" style="margin: 0; font-weight: bold;">Propex</h2>
                        </q-card-section>

                        <q-card-section class="q-gutter-y-md" style="margin-left: 0;">
                            <q-input v-model="credentials.email" label="Username"
                            lazy-rules :rules="[ requiredInput ]"
                            autofocus dense filled square>
                                <template v-slot:prepend>
                                    <q-icon name="person"/>
                                </template>
                            </q-input>

                            <q-input v-model="credentials.password" label="Password" :type="isPassword ? 'password' : 'text'"
                            lazy-rules :rules="[ requiredInput ]" @keyup.enter="login()" dense filled square>
                                <template v-slot:prepend>
                                    <q-icon name="lock"/>
                                </template>
                                <template v-slot:append>
                                    <q-icon :name="isPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPassword = !isPassword"/>
                                </template>
                            </q-input>

                            <q-checkbox v-model="rememberMe" label="Remember Me" dense />
                        </q-card-section>

                        <q-card-actions class="full-width q-pa-md" style="margin: 0; padding-top: 0">
                            <q-btn class="full-width" color="primary" label="Sing In" type="submit" unelevated/>
                        </q-card-actions>
                    </q-form>
                </q-card>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import Login from "./LoginCtrl";
export default Login;
</script>

<style scoped>
    .box {
        min-width: 150px;
        max-width: 350px;
        margin: 0px auto;
        margin-top: 30px;
    }
    .logo {
        margin: 0;
        width: 100%;
        text-align: center;
    }
    .logo img {
        height: 100px;
    }
</style>
