<template>
    <q-layout id="user-registration" color="grey-2">
        <q-page-container>
            <q-page class="row justify-center items-center">
                <span>{{ project.title }}</span>
                <q-card class="full-width" :bordered="true" flat square>
                    <q-card-section class="header text-white" color="primary">
                        <h3 class="bg-primary text-h4">{{ project.title }}</h3>
                    </q-card-section>

                    <q-card-section class="content">
                        <q-form ref="form1">
                            <!-- USER -->
                            <q-input label="Título" v-model="project.title" type="text" lazy-rules :rules="[ requiredInput ]" autofocus dense filled square />

                            <q-input label="Programa" v-model="project.program" type="text" lazy-rules :rules="[ requiredInput ]" dense filled square />

                            <q-input label="Cursos Inclídos" v-model="project.includedCourses" type="text" lazy-rules :rules="[ requiredInput ]" dense filled square />
                        </q-form>
                    </q-card-section>

                    <q-card-actions class="wrapper">
                        <q-btn class="box" color="grey-4" label="Reset" @click="reset" unelevated/>
                        <q-btn class="box" color="primary" label="Save" @click="submit" unelevated/>
                    </q-card-actions>
                </q-card>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import ProjectPage from "./ProjectCtrl";
export default ProjectPage;
</script>

<style lang="scss" scoped>
</style>
