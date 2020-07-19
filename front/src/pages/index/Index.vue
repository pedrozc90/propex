<template>
    <q-page id="index">
        <div class="wrapper">
            <q-card class="box" v-for="project in projects" :key="project.id" bordered flat square @click="edit(project.id)">
                <q-card-section>
                    <h3>{{ project.title }}</h3>
                    <p>{{ project.program }}</p>
                    <p>{{ project.includedCourses }}</p>
                    <p>{{ project.createdAt }}</p>
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>

<script lang="ts">
import Index from "./IndexCtrl";
export default Index;
</script>

<style lang="scss" scoped>
$spacing: 16px;

#index {
    .wrapper {
        display: grid;
        gap: $spacing;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        padding: $spacing;

        .box {
        }
    }
}
</style>
