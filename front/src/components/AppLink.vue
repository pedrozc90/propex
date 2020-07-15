<template>
    <q-item clickable v-ripple @click="redirect()">
        <q-item-section v-if="icon" avatar>
            <q-icon :name="icon" />
        </q-item-section>
        <q-item-section>
            <q-item-label>{{ label }}</q-item-label>
            <q-item-label caption>{{ caption }}</q-item-label>
        </q-item-section>
    </q-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "AppLink" })
export default class AppLink extends Vue {
    
    @Prop({ type: String, required: true, default: null }) name!: string;
    @Prop({ type: String, required: true, default: null }) label!: string;
    @Prop({ type: String, required: false, default: null }) caption!: string;
    @Prop({ type: String, required: false, default: "code" }) icon!: string;
    
    public async redirect(): Promise<void> {
        await this.$router.push({ name: this.name });
    }

}
</script>

<style lang="scss" scoped>
</style>
