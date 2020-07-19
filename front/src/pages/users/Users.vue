<template>
    <q-layout id="user-registration" color="grey-2">
        <q-page-container>
            <q-page>
                <q-table
                    :title="$t('user.label')" :data="users" :columns="columns" row-key="id"
                    hide-selected-banner
                    :pagination="pagination"
                    @update:pagination = "onUpdatePagination"
                    bordered dense flat square>
                    <template v-slot:top>
                        <!-- <q-btn color="primary" :disable="loading" label="Add row" @click="addRow" />
                        <q-btn class="q-ml-sm" color="primary" :disable="loading" label="Remove row" @click="removeRow" />
                        <q-space />
                        <q-input borderless dense debounce="300" color="primary" v-model="filter">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                        </q-input> -->
                        <q-space />
                        <q-input borderless dense debounce="300" v-model="q" type="text" :placeholder="$t('labels.search')" style="width: 250px;">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                        </q-input>
                    </template>
                    <!-- <template v-slot:top-right>
                        <q-input borderless dense debounce="300" v-model="q" type="text" :placeholder="$t('labels.search')" style="width: 250px;">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                        </q-input>
                    </template> -->
                    <template v-slot:header="props">
                        <q-tr :props="props">
                            <q-th v-for="col in props.cols" :key="col.name" :props="props">
                                {{ $t(`user.${col.label}`) }}
                            </q-th>
                        </q-tr>
                    </template>
                    <template v-slot:body="props">
                        <q-tr :props="props" @dblclick="open($event, props.row)">
                            <q-td key="name" :props="props">{{ props.row.name }}</q-td>
                            <q-td key="email" :props="props">{{ props.row.email }}</q-td>
                            <q-td key="role" :props="props">{{ $t(props.row.role.description) }}</q-td>
                            <q-td key="code" :props="props">{{ props.row.code }}</q-td>
                            <q-td key="phone" :props="props">{{ props.row.phone }}</q-td>
                        </q-tr>
                    </template>
                </q-table>
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
    max-width: 1280px;
    width: 80%;
    margin: 100px auto;

    .q-table {
        .q-table__top {
            background-color: $primary !important;
        }
    }
}
</style>
