<template>
    <q-layout id="user-registration" color="grey-2">
        <q-page-container>
            <q-page class="row justify-center items-center">
                <q-card class="full-width" :bordered="true" flat square>
                    <q-form ref="form" @submit="register">
                        <q-card-section class="header">
                            <q-header class="bg-primary text-h4">User</q-header>
                        </q-card-section>

                        <q-card-section class="q-gutter-y-md" style="margin-left: 0;">
                            <!-- USER -->
                            <q-input  label="Name" v-model="user.name" type="text" lazy-rules :rules="[ requiredInput ]" autofocus dense filled square />

                            <q-input  label="Email" v-model="user.email" type="email" lazy-rules :rules="[ requiredInput ]" autofocus dense filled square />

                            <q-input  label="Phone" v-model="user.phone" type="tel" lazy-rules :rules="[ requiredInput ]" mask="(##) #####-####" autofocus dense filled square />

                            <q-input  label="Password" v-model="user.password" :type="isPassword ? 'password' : 'text'" lazy-rules :rules="[ requiredInput ]" dense filled square>
                                <template v-slot:append>
                                    <q-icon :name="isPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPassword = !isPassword"/>
                                </template>
                            </q-input>

                            <!-- STUDENT -->
                            <q-separator dense />

                            <q-input  label="Code" v-model="user.student.code" type="text" lazy-rules :rules="[ requiredInput ]" autofocus dense filled square />

                            <q-input  label="Course" v-model="user.student.course" type="text" lazy-rules :rules="[ requiredInput ]" autofocus dense filled square />

                            <q-input  label="Period" v-model="user.student.period" type="text" lazy-rules :rules="[ requiredInput ]" autofocus dense filled square />

                            <q-checkbox v-model="user.student.scholarship" label="Scholarship" dense />

                            <!-- COLLABORATOR -->
                            <q-separator dense/>

                            <q-input  label="Academic Function" v-model="user.collaborator.academicFunction" type="text" lazy-rules :rules="[ requiredInput ]" autofocus dense filled square />

                            <q-input  label="Profissional Registry" v-model="user.collaborator.profissionalRegistry" type="text" lazy-rules :rules="[ requiredInput ]" autofocus dense filled square />

                            <q-input  label="Affiliation" v-model="user.collaborator.affiliation" type="text" lazy-rules :rules="[ requiredInput ]" autofocus dense filled square />
                        </q-card-section>

                        <q-card-actions class="wrapper">
                            <q-btn class="box" color="grey-4" label="Cancel" type="cancel" unelevated/>
                            <q-btn class="box" color="primary" label="Save" type="submit" unelevated/>
                        </q-card-actions>
                    </q-form>
                </q-card>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import UserRegistration from "./UserRegistrationCtrl";
export default UserRegistration;
</script>

<style lang="scss" scoped>
    .q-page {
        height: 100%;

        .q-card {
            max-width: 500px;
        }

        .wrapper {
            display: grid;
            gap: 16px;
            grid-template-columns: 1fr 1fr;
            width: 100%;
            padding: 0 16px 16px 16px;

            .box {
                &:last-of-type {
                    margin: 0;
                }
            }
        }
    }

    .header {
        margin: 0;
        width: 100%;
        text-align: center;
        font-weight: bold;
    }
</style>
