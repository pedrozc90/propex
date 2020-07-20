<template>
    <q-layout id="users" color="grey-2">
        <q-page-container>
            <q-page class="col">
                <q-header class="text-h5">{{ $t('user.label') }}</q-header>
                <q-table
                    :title="$t('user.label')" :data="users" :columns="columns" row-key="id"
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
}

.q-header {
    position: unset;
    padding: 8px 16px;
    border: 1px solid $primary;
}

.q-table {
    
    &__container {
        border: 1px solid $primary;
    }
    
    &__top {
        padding: 8px;
    }
}
</style>
