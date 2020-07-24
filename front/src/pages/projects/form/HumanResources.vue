<template>
    <q-form ref="form-general" @submit="submit" @reset="reset">
        <div class="fields">
            <table  class="full-width">
                <thead>
                    <tr>
                        <th class="text-center">Name</th>
                        <th class="text-center">Formação Acadêmica / Função</th>
                        <th class="text-center">Registro Profissional</th>
                        <th class="text-center">Forma de Vínculo (CLT, Pres. Serviço, etc.)</th>
                        <th class="text-center">Dedicação Exclusiva</th>
                        <th class="text-center">Carga Horária</th>
                        <th class="text-center">Data Admissão</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="phr in collaborators" :key="phr.id">
                        <td class="text-center">{{ phr.user.name }}</td>
                        <td class="text-center">{{ phr.user.academicFunction }}</td>
                        <td class="text-center">{{ phr.user.code }}</td>
                        <td class="text-center">{{ phr.user.affiliation }}</td>
                        <td class="text-center">{{ phr.exclusive }}</td>
                        <td class="text-center">{{ phr.workload }}</td>
                        <td class="text-center">{{ phr.dtAdmission }}</td>
                    </tr>
                </tbody>
            </table>

            <q-table
                :title="$t('user.label')" :data="collaborators" :columns="columns" :row-key="(row) => row.user.id"
                hide-selected-banner
                :pagination="pagination"
                @update:pagination = "onUpdatePagination"
                bordered flat square>
                <template v-slot:top>
                    <q-space />
                    <q-input  :placeholder="$t('labels.search')"
                        v-model="q" type="text"
                        style="width: 300px;" debounce="300"
                        borderless dense outlined square>
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                    </q-input>
                </template>
                <template v-slot:header="props">
                    <q-tr :props="props">
                        <q-th v-for="col in props.cols" :key="col.name" :props="props">
                            {{ $t(`user.${col.label}`) }}
                        </q-th>
                    </q-tr>
                </template>
                <template v-slot:body="props">
                    <q-tr :props="props" @dblclick="open($event, props.row)">
                        <q-td key="name" :props="props">{{ props.row.user.name }}</q-td>
                        <q-td key="email" :props="props">{{ props.row.user.email }}</q-td>
                        <q-td key="role" :props="props">{{ $t(props.row.user.role.description) }}</q-td>
                        <q-td key="code" :props="props">{{ props.row.user.code }}</q-td>
                        <q-td key="phone" :props="props">{{ props.row.user.phone }}</q-td>
                    </q-tr>
                </template>
            </q-table>

            <q-table
                :title="$t('user.label')" :data="students" :columns="columns" :row-key="(row) => row.user.id"
                hide-selected-banner
                :pagination="pagination"
                @update:pagination = "onUpdatePagination"
                bordered flat square>
                <template v-slot:top>
                    <q-space />
                    <q-input  :placeholder="$t('labels.search')"
                        v-model="q" type="text"
                        style="width: 300px;" debounce="300"
                        borderless dense outlined square>
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                    </q-input>
                </template>
                <template v-slot:header="props">
                    <q-tr :props="props">
                        <q-th v-for="col in props.cols" :key="col.name" :props="props">
                            {{ $t(`user.${col.label}`) }}
                        </q-th>
                    </q-tr>
                </template>
                <template v-slot:body="props">
                    <q-tr :props="props" @dblclick="open($event, props.row)">
                        <q-td key="name" :props="props">{{ props.row.user.name }}</q-td>
                        <q-td key="email" :props="props">{{ props.row.user.email }}</q-td>
                        <q-td key="role" :props="props">{{ $t(props.row.user.role.description) }}</q-td>
                        <q-td key="code" :props="props">{{ props.row.user.code }}</q-td>
                        <q-td key="phone" :props="props">{{ props.row.user.phone }}</q-td>
                    </q-tr>
                </template>
            </q-table>
        </div>
        <div class="grid">
            <!-- <q-space /> -->
            <q-btn class="box" color="grey-4" :label="$t('buttons.reset')" @click="reset" unelevated/>
            <q-btn class="box" color="primary" :label="$t('buttons.save')" @click="submit" :disable="true" unelevated/>
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
