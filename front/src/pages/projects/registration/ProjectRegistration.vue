<template>
    <q-layout id="user-registration" color="grey-2">
        <q-page-container>
            <q-page class="row justify-center items-center">
                <q-card class="full-width" :bordered="true" flat square>
                    <q-card-section class="header text-white" color="primary">
                        <h3 class="bg-primary text-h4">{{ $t('project.new') }}</h3>
                    </q-card-section>

                    <q-card-section class="content">
                        <q-form ref="form">
                            <!-- USER -->
                            <q-input :label="$t('project.title')" v-model="project.title" type="text" lazy-rules :rules="[ requiredInput ]" autofocus dense filled square />

                            <q-input :label="$t('project.program')" v-model="project.program" type="text" lazy-rules :rules="[ requiredInput ]" dense filled square />

                            <q-select :label="$t('coordenator')"
                                v-model="coordinator"
                                use-input
                                hide-selected
                                fill-input
                                input-debounce="0"
                                :options="coordinatorOptions"
                                :option-label="opt => `${opt.name} (${opt.email})`"
                                map-options
                                @filter="filterFn"
                                @filter-abort="filterAbortFn"
                                style="width: 100%"
                                dense filled square>
                                <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">No results</q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                        </q-form>
                    </q-card-section>

                    <q-card-actions class="wrapper">
                        <q-btn class="box" color="grey-4" :label="$t('buttons.reset')" @click="reset" unelevated/>
                        <q-btn class="box" color="primary" :label="$t('buttons.save')" @click="submit" unelevated/>
                    </q-card-actions>
                </q-card>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import ProjectRegistration from "./ProjectRegistrationCtrl";
export default ProjectRegistration;
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
