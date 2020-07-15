<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-btn aria-label="Menu" icon="menu"
                    @click="leftDrawerOpen = !leftDrawerOpen"
                    flat dense round/>
                <q-toolbar-title>Propex</q-toolbar-title>
                <div>v{{ $q.version }}</div>
            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-1">
            <q-list>
                <q-item-label header class="text-grey-8">Essential Links</q-item-label>
                <app-item v-for="link in essentialLinks" :key="link.title" v-bind="link"/>
            </q-list>
            <q-separator />
            <q-list>
                <q-item-label header>Essential Links</q-item-label>
                <app-link name="index" label="Index" caption="/index" icon="public" />
                <app-link name="login" label="Login" caption="/login" icon="public" />
                <app-link name="user-registration" label="User Regitratiin" caption="/user-registration" icon="public" />
            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import Layout from "./LayoutCtrl";
export default Layout;
</script>
