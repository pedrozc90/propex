<template>
    <q-layout id="user-registration" color="grey-2">
        <q-page-container>
            <q-page class="row justify-center items-center">
                <q-card class="full-width" :bordered="true" flat square>
                    <q-card-section class="header text-white" color="primary">
                        <h3 class="bg-primary text-h4">$t('users')</h3>
                    </q-card-section>

                    <q-card-section class="content">
                        <div v-for="user of users" :key="user.id">
                            {{ user.name }} - {{ user.email }} - {{ user.code }}
                        </div>
                    </q-card-section>
                </q-card>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import UsersPage from "./UsersCtrl";
export default UsersPage;
</script>

<style lang="scss" scoped>
    .q-page {
        height: 100%;

        .q-card {
            max-width: 500px;

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
