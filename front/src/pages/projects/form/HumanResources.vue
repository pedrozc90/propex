<template>
    <q-form ref="form-general" @submit="submit" @reset="reset">
        <div class="fields">
            <!-- COLLABORATORS -->
            <q-table
                :title="$t('user.label')"
                :data="collaborators"
                :columns="collaboratorColumns"
                :row-key="row => row.user.id"
                hide-selected-banner
                :pagination.sync="collaboratorPagination"
                :loading="loadingCollaborators"
                @request="onRequestCollaborators"
                bordered
                flat
                square
            >
                <template v-slot:top>
                    <p class="text-h6 text-primary">
                        {{ $t("project.coordenator_professors") }}
                    </p>
                    <q-space />
                    <q-input
                        :placeholder="$t('labels.search')"
                        v-model="collaboratorSearch"
                        type="text"
                        style="width: 300px;"
                        debounce="300"
                        borderless
                        dense
                        outlined
                        square
                    >
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </template>
                <template v-slot:header="props">
                    <q-tr :props="props">
                        <q-th
                            v-for="col in props.cols"
                            :key="col.name"
                            :props="props"
                        >
                            {{ $t(`user.${col.label}`) }}
                        </q-th>
                    </q-tr>
                </template>
                <template v-slot:body="props">
                    <q-tr :props="props" @dblclick="open($event, props.row)">
                        <q-td key="name" :props="props">{{ props.row.user.name }}</q-td>
                        <q-td key="academicFunction" :props="props">{{ props.row.user.academicFunction }}</q-td>
                        <q-td key="code" :props="props">{{ props.row.user.code }}</q-td>
                        <q-td key="affiliation" :props="props">{{ props.row.user.affiliation }}</q-td>
                        <q-td key="exclusive" :props="props">{{ props.row.exclusive }}</q-td>
                        <q-td key="workload" :props="props">{{ props.row.workload }}</q-td>
                        <q-td key="dateAdmission" :props="props">{{ props.row.dateAdmission | toBRString }}</q-td>
                    </q-tr>
                </template>
            </q-table>

            <q-table
                :title="$t('user.label')"
                :data="students"
                :columns="studentColumns"
                :row-key="row => row.user.id"
                hide-selected-banner
                :pagination="studentPagination"
                @request="onRequestStudents"
                bordered
                flat
                square
            >
                <template v-slot:top>
                    <p class="text-h6 text-primary">{{ $t("students") }}</p>
                    <q-space />
                    <q-input
                        :placeholder="$t('labels.search')"
                        v-model="studentSearch"
                        type="text"
                        style="width: 300px;"
                        debounce="300"
                        borderless
                        dense
                        outlined
                        square
                    >
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </template>
                <template v-slot:header="props">
                    <q-tr :props="props">
                        <q-th
                            v-for="col in props.cols"
                            :key="col.name"
                            :props="props"
                        >
                            {{ $t(`user.${col.label}`) }}
                        </q-th>
                    </q-tr>
                </template>
                <template v-slot:body="props">
                    <q-tr
                        :props="props"
                        @dblclick="open($event, props.row.user.id)"
                    >
                        <q-td key="name" :props="props">{{
                            props.row.user.name
                        }}</q-td>
                        <q-td key="code" :props="props">{{
                            props.row.user.code
                        }}</q-td>
                        <q-td key="course" :props="props">{{
                            props.row.user.course
                        }}</q-td>
                        <q-td key="period" :props="props">{{
                            props.row.user.period
                        }}</q-td>
                        <q-td key="workload" :props="props">{{
                            props.row.workload
                        }}</q-td>
                        <q-td key="contact" :props="props"
                            >{{ props.row.user.phone }} /
                            {{ props.row.user.email }}</q-td
                        >
                    </q-tr>
                </template>
            </q-table>
        </div>
        <div class="grid">
            <!-- <q-space /> -->
            <q-btn
                class="box"
                color="grey-4"
                :label="$t('buttons.reset')"
                @click="reset"
                unelevated
            />
            <q-btn
                class="box"
                color="primary"
                :label="$t('buttons.save')"
                @click="submit"
                :disable="true"
                unelevated
            />
        </div>
    </q-form>
</template>

<script lang="ts">
import HumanResources from "./HumanResourcesCtrl";
export default HumanResources;
</script>

<style lang="scss" scoped>
$spacing: 16px;

.fields {
    & > * {
        margin-bottom: $spacing;
    }
}

.grid {
    display: grid;
    gap: $spacing;
    grid-template-columns: repeat(2, 1fr);

    .box {
        width: 100%;
        border-radius: 0;
    }
}
</style>
