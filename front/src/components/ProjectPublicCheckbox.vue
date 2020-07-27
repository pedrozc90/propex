<template>
    <div class="wrapper">
        <q-checkbox class="box" v-model="direct" >
            <q-tooltip>Diretamente</q-tooltip>
        </q-checkbox>
        <q-checkbox class="box" v-model="indirect">
            <q-tooltip>Indiretamente</q-tooltip>
        </q-checkbox>
        <span class="box-label">{{ projectPublic.public.name }}</span>
        <q-input class="box-input"
            v-if="projectPublic.public.customizable"
            v-model="projectPublic.otherPublicCras"
            label="Qual?"
            type="text" dense filled square />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { ProjectPublic } from "../core/types";1

@Component({ name: "ProjectPublicCheckbox" })
export default class ProjectPublicCheckbox extends Vue {

    @Prop({ type: Object, required: true, default: {} }) public projectPublic!: ProjectPublic;

    public direct: boolean = false;
    public indirect: boolean = false;

    @Watch("direct")
    public onUpdateDirect(newValue: boolean, oldValue: boolean) {
        if (newValue === true) {
            this.indirect = false;
            this.projectPublic.directly = true;
        }
        this.resetProjectPublic();
    }

    @Watch("indirect")
    public onUpdateIndirect(newValue: boolean, oldValue: boolean) {
        if (newValue === true) {
            this.direct = false;
            this.projectPublic.directly = false;
        }
        this.resetProjectPublic();
    }

    private resetProjectPublic(): void {
        if (!this.indirect && !this.direct) {
            delete this.projectPublic.directly;
        }
    }

    public mounted(): void {
        if (this.projectPublic.directly === true) this.direct = true;
        if (this.projectPublic.directly === false) this.indirect = true;
    }

}
</script>

<style lang="scss" scoped>
.wrapper {
    width: 100%;
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(2, 40px) repeat(2, auto);

    .box {
        &-label {
            text-align: left;
            margin: auto 0;
        }
        &-input {
            width: 100%;
        }
    }
}
</style>
