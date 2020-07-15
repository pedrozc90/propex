<template>
    <q-item :href="link" :active="active" tag="a" clickable v-ripple>
        <q-item-section avatar>
            <q-icon :name="icon" />
        </q-item-section>
        <q-item-section>
            <q-item-label>{{ title }}</q-item-label>
            <q-item-label caption v-if="caption">{{ caption }}</q-item-label>
        </q-item-section>
    </q-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
@Component({ name: "AppItem" })
export default class AppItem extends Vue {

    @Prop({ type: String, required: true, default: "#" }) link!: string;
    @Prop({ type: String, required: true, default: null }) title!: string;
    @Prop({ type: String, required: false, default: null }) caption!: string;
    @Prop({ type: String, required: false, default: "code" }) icon!: string;
    @Prop({ type: Boolean, required: false, default: false }) active!: boolean;

}
</script>

<style lang="scss" scoped>
</style>
