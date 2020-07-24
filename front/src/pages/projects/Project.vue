<template>
    <q-layout id="project-layout" color="grey-2">
        <q-page-container>
            <q-page>
                
                <q-stepper v-model="step" ref="stepper" color="primary" header-nav animated flat bordered>
                    <q-step :name="1" :title="$t('project.general')" icon="settings" :done="step > 1">
                        <general-form :id="id" />
                    </q-step>
                    <q-step :name="2" :title="$t('project.humanResources')" icon="settings" :done="step > 2">
                        <human-resources :id="id" />
                    </q-step>
                    <q-step :name="3" :title="$t('project.activities')" icon="settings" :done="step > 3">
                        <out-of-order />
                    </q-step>
                    <q-step :name="4" :title="$t('project.public')" icon="settings" :done="step > 4">
                        <out-of-order />
                    </q-step>
                    <q-step :name="5" :title="$t('project.partners')" icon="settings" :done="step > 5">
                        <out-of-order />
                    </q-step>
                    <q-step :name="6" :title="$t('project.avaliation')" icon="settings" :done="step > 6">
                        <out-of-order />
                    </q-step>
                    <q-step :name="7" :title="$t('project.demands')" icon="settings" :done="step > 7">
                        <out-of-order />
                    </q-step>
                    <q-step :name="8" :title="$t('project.disclosureMedia')" icon="settings" :done="step > 8">
                        <out-of-order />
                    </q-step>
                    <q-step :name="9" :title="$t('project.publications')" icon="settings" :done="step > 9">
                        <out-of-order />
                    </q-step>
                    <q-step :name="10" :title="$t('project.attachments')" icon="settings" :done="step > 10">
                        <out-of-order />
                    </q-step>

                    <!-- <template v-slot:navigation>
                        <q-stepper-navigation>
                            <q-btn @click="$refs.stepper.next()" color="primary" :label="step === 3 ? 'Finish' : 'Continue'" unelevated />
                            <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" unelevated/>
                        </q-stepper-navigation>
                    </template> -->
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
    // max-width: 1280px;
    margin: 0 auto;

    display: grid;
    place-items: center;
    position: unset;

    .q-stepper {
        width: 100%;
    }
}
</style>
