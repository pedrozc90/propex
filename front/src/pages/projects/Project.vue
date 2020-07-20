<template>
    <q-layout id="project-layout" color="grey-2">
        <q-page-container>
            <q-page>
                
                <q-stepper v-model="step" ref="stepper" color="primary" header-nav animated flat bordered>
                    <q-step :name="1" title="General" icon="settings" :done="step > 1">
                        <general-form :project="project" />
                    </q-step>
                    <q-step :name="2" title="Human Resources" icon="settings" :done="step > 2">
                        STEP 2
                    </q-step>
                    <q-step :name="3" title="Atividades" icon="settings" :done="step > 3">
                        STEP 3
                    </q-step>
                    <q-step :name="4" title="Público" icon="settings" :done="step > 4">
                        STEP 4
                    </q-step>
                    <q-step :name="5" title="Parceiros" icon="settings" :done="step > 5">
                        STEP 5
                    </q-step>
                    <q-step :name="6" title="Avaliação" icon="settings" :done="step > 6">
                        STEP 6
                    </q-step>

                    <template v-slot:navigation>
                        <q-stepper-navigation>
                        <q-btn @click="$refs.stepper.next()" color="primary" :label="step === 3 ? 'Finish' : 'Continue'" unelevated />
                        <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" unelevated/>
                        </q-stepper-navigation>
                    </template>
                </q-stepper>

            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import ProjectPage from "./ProjectCtrl";
export default ProjectPage;
</script>

<style lang="scss" scoped>
$spacing: 16px;

.q-page {
    width: 80%;
    max-width: 1280px;
    padding: 16px;
    margin: 0 auto;
}

.q-stepper__step-content {
    .q-stepper__step-inner {
        padding: 16px !important;
    }
}
</style>
