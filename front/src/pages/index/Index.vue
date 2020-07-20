<template>
    <q-page id="index">
        <q-card class="filters" bordered flat square>
            <q-card-section class="grid">
                <q-select :label="$t('knowledge-area.label')"
                    v-model="knowledgeArea"
                    use-input
                    hide-selected
                    fill-input
                    input-debounce="0"
                    :options="knowledgeAreas"
                    :option-label="opt => opt.name"
                    map-options
                    style="width: 100%"
                    dense filled square>
                    <template v-slot:no-option>
                        <q-item>
                            <q-item-section class="text-grey">No results</q-item-section>
                        </q-item>
                    </template>
                </q-select>

                <q-select :label="$t('extension-line.label')"
                    v-model="extensionLine"
                    use-input
                    hide-selected
                    fill-input
                    input-debounce="0"
                    :options="extensionLines"
                    :option-label="opt => opt.name"
                    map-options
                    style="width: 100%"
                    dense filled square>
                    <template v-slot:no-option>
                        <q-item>
                            <q-item-section class="text-grey">No results</q-item-section>
                        </q-item>
                    </template>
                </q-select>

                <q-input  :placeholder="$t('labels.search')"
                    v-model="q" type="text"
                    style="width: 100%;"
                    debounce="300" borderless dense filled square>
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </q-card-section>
        </q-card>

        <div class="wrapper">
            <q-card class="box" v-for="project in projects" :key="project.id" bordered flat square @dblclick="edit(project.id)">
                <q-card-section class="header">
                    <p>{{ project.title }}</p>
                </q-card-section>
                <q-card-section class="content">
                    <p><b>{{ $t('project.program') }}:</b> {{ project.program }}</p>
                    <p><b>{{ $t('project.includedCourses') }}:</b> {{ project.includedCourses }}</p>
                    <p><b>{{ $t('coordinator') }}:</b> {{ project.projectHumanResources[0].user.name }}</p>
                    <p><b>{{ $t('project.createdAt') }}:</b> {{ project.createdAt | toBRString }}</p>
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
    display: grid;
    gap: $spacing;
    grid-template-rows: minmax(40px, calc(40px + 2 * 16px)) auto;
    grid-template-areas:
        "filters"
        "content"
    ;
    padding: $spacing;

    .filters {
        width: 100%;
        grid-area: filters;

        .grid {
            display: grid;
            gap: $spacing;
            grid-template-columns: repeat(4, minmax(100px, 1fr));
        }
    }

    .wrapper {
        grid-area: content;

        display: grid;
        gap: $spacing;
        grid-template-columns: repeat(5, minmax(100px, 1fr));

        .box {
            max-width: 500px;
            max-height: 200px;
            border: 1px solid $primary;

            .header {
                background-color: $primary;
                color: white;
                font-size: 1.35rem;
                padding: 8px;

                p {
                    margin: 0;
                }
            }

            .content {
                p {
                    margin-bottom: 4px;
                }
            }
        }
    }
}
</style>
