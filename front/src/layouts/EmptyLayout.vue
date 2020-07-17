<template>
    <div id="user">
        <router-view />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({ name: "EmptyLayout" })
export default class EmptyLayout extends Vue {

    // nothing in here

}
</script>

<style lang="scss" scoped>
</style>
