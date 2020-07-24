<template>
    <q-layout id="login">
        <q-page-container>
            <q-page>
                <q-card :bordered="true" flat square>
                    <q-form ref="form" @submit="login">
                        <q-card-section class="logo" style="padding: 0;">
                            <!-- <img src="~assets/quasar-logo-full.svg" alt="Logo"> -->
                            <h3>Propex</h3>
                        </q-card-section>

                        <q-card-section class="content" style="padding: 0;">
                            <q-input  label="Email"
                            v-model="credentials.email"
                            lazy-rules :rules="[ requiredInput ]"
                            autofocus dense filled square>
                                <template v-slot:prepend>
                                    <q-icon name="person"/>
                                </template>
                            </q-input>

                            <q-input  label="Password"
                            v-model="credentials.password"
                            :type="isPassword ? 'password' : 'text'"
                            lazy-rules :rules="[ requiredInput ]"
                            @keyup.enter="login()"
                            dense filled square>
                                <template v-slot:prepend>
                                    <q-icon name="lock"/>
                                </template>
                                <template v-slot:append>
                                    <q-icon :name="isPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPassword = !isPassword"/>
                                </template>
                            </q-input>

                            <q-checkbox v-model="rememberMe" label="Remember Me" dense />
                        </q-card-section>

                        <q-card-actions class="actions" style="padding: 0;">
                            <q-btn color="primary" label="Sing In" type="submit" unelevated/>
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

<style lang="scss" scoped>
$spacing: 16px;

.q-layout {
    background-color: $primary;

    .q-page {
        display: grid;
        place-items: center;

        .q-card {
            width: 500px;
            min-width: 100px;
            max-width: 80%;
            border: 1px solid #ddd;
            padding: $spacing;

            // .q-form {
            //     position: unset;
            // }

            .logo {
                margin-bottom: $spacing;
                text-align: center;
                color: $primary;
                font-weight: bolder;

                h1, h2, h3 {
                    margin: 0;
                }
            }

            .content {
                margin-bottom: $spacing;

                .q-input {
                    margin-bottom: $spacing;
                }
            }

            .actions {
                .q-btn {
                    width: 100%;
                }
            }
        }
    }
}
</style>
