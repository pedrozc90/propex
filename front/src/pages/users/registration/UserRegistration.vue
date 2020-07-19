<template>
    <q-layout id="user-registration" color="grey-2">
        <q-page-container>
            <q-page class="row justify-center items-center">
                <q-card class="full-width" :bordered="true" flat square>
                    <q-card-section class="header text-white" color="primary">
                        <h3 class="bg-primary text-h4">{{ $t('user.registration')}}</h3>
                    </q-card-section>

                    <q-card-section class="content">
                        <q-form ref="form1">
                            <!-- USER -->
                            <q-input :label="$t('user.name')" v-model="user.name" type="text" lazy-rules :rules="[ requiredInput ]" autofocus dense filled square />

                            <q-input :label="$t('user.email')" v-model="user.email" type="email" lazy-rules :rules="[ requiredInput ]" dense filled square />

                            <q-input :label="$t('user.phone')" v-model="user.phone" type="tel" lazy-rules :rules="[ requiredInput ]" mask="(##) #####-####" dense filled square />

                            <q-input :label="$t('user.password')" v-model="user.password" :type="isPassword ? 'password' : 'text'" lazy-rules :rules="[ requiredInput ]" dense filled square>
                                <template v-slot:append>
                                    <q-icon :name="isPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPassword = !isPassword"/>
                                </template>
                            </q-input>
                        </q-form>

                        <q-separator dense />

                        <div class="role">
                            <q-checkbox :label="$t('student')" v-model="role" :true-value="student" :false-value="collaborator" dense />
                            <q-checkbox :label="$t('collaborator')" v-model="role" :true-value="collaborator" :false-value="student" dense />
                        </div>

                        <q-form ref="form2" v-show="role === student">
                            <!-- STUDENT -->
                            <q-input :label="$t('user.code')" v-model="user.code" type="text" lazy-rules :rules="[ requiredInput ]" dense filled square />

                            <q-input :label="$t('user.course')" v-model="user.course" type="text" lazy-rules :rules="[ requiredInput ]" dense filled square />

                            <q-input :label="$t('user.period')" v-model="user.period" type="text" lazy-rules :rules="[ requiredInput ]" dense filled square />

                            <q-checkbox :label="$t('user.scholarship')" style="margin: 0" v-model="user.scholarship" dense />
                        </q-form>

                        <q-form ref="form3" v-show="role === collaborator">
                            <!-- COLLABORATOR -->
                            <q-input :label="$t('user.registry')" v-model="user.code" type="text" lazy-rules :rules="[ requiredInput ]" dense filled square />

                            <q-input :label="$t('user.academic_function')" v-model="user.academicFunction" type="text" lazy-rules :rules="[ requiredInput ]" dense filled square />

                            <q-input :label="$t('user.affiliation')" v-model="user.affiliation" type="text" lazy-rules :rules="[ requiredInput ]" dense filled square />
                        </q-form>
                    </q-card-section>

                    <q-card-actions class="wrapper">
                        <q-btn class="box" color="grey-4" :label="$t('buttons.reset')" @click="reset" unelevated/>
                        <q-btn class="box" color="primary" :label="$t('buttons.save')" @click="submit" :disable="!ready" unelevated/>
                    </q-card-actions>
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
            border: 1px solid $primary;

            .content {
                .q-form {
                    & > * {
                        margin-top: 16px;
                    }
                    &:last-child {
                        margin-top: 0;
                    }
                }

                .q-separator {
                    &:nth-of-type(2) {
                        margin-top: 16px;
                    }
                }

                .role {
                    margin-top: 16px;
                    
                    .q-checkbox {
                        margin-right: 16px;

                        &:last-of-type {
                            margin-top: 0;
                        }
                    }
                }
            }
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
        padding: 0;
        width: 100%;
        text-align: center;
        font-weight: bold;

        h3 {
            margin: 0;
        }
    }
</style>
