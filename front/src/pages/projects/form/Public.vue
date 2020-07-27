<template>
    <q-form ref="form-general" @submit="submit" @reset="reset">
        <div class="targets">
            <!-- TARGET -->
            <q-table
                class="target-table q-mb-md"
                :title="$t('user.label')"
                :data="targets"
                :columns="columns"
                :row-key="row => row.id"
                hide-selected-banner
                :pagination.sync="pagination"
                hide-pagination
                bordered
                flat
                square
            >
                <template v-slot:top>
                    <p class="text-h6 text-primary">{{ $t("target.label") }}</p>
                    <q-space />
                </template>
                <template v-slot:header="props">
                    <q-tr :props="props">
                        <q-th
                            v-for="col in props.cols"
                            :key="col.name"
                            :props="props"
                        >
                            {{ $t(`target.${col.label}`) }}
                        </q-th>
                    </q-tr>
                </template>
                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="ageRange" :props="props">
                            {{ props.row.ageRange.description }}
                        </q-td>
                        <q-td key="menNumber" :props="props">
                            {{ props.row.menNumber }}
                            <q-popup-edit v-model="props.row.menNumber" buttons persistent>
                                <q-input v-model="props.row.menNumber" type="number" dense autofocus counter buttons />
                            </q-popup-edit>
                        </q-td>
                        <q-td key="womenNumber" :props="props">
                            {{ props.row.womenNumber }}
                            <q-popup-edit v-model="props.row.womenNumber" buttons persistent>
                                <q-input v-model="props.row.womenNumber" type="number" dense autofocus counter />
                            </q-popup-edit>
                        </q-td>
                    </q-tr>
                </template>
            </q-table>
        </div>
        <div class="publics">
            <span>Informe o(s) público(s), mais representativo, do projeto. Onde opção (1) Diretamente (2) Indiretamente</span>
            <div v-for="pp in projectPublics" :key="pp.public.id" class="row">
                <!-- <q-input v-model="p.value" type="number" dense filled square/>{{ p. public.name }} -->
                <project-public-checkbox  :projectPublic="pp" />
            </div>
        </div>
        <div class="grid">
            <!-- <q-space /> -->
            <q-btn class="box" color="grey-4" :label="$t('buttons.reset')" @click="reset" unelevated />
            <q-btn class="box" color="primary" :label="$t('buttons.save')" @click="submit" unelevated />
        </div>
    </q-form>
</template>

<script lang="ts">
import Public from "./PublicCtrl";
export default Public;
</script>

<style lang="scss" scoped>
$spacing: 16px;

// .fields {
//     & > * {
//         margin-bottom: $spacing;
//     }
// }

.target-table {
    th, td {
        text-align: center;

        &:first-of-type {
            text-align: left;
        }
    }
}

.publics {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 16px;

    & > span {
        grid-column: 1 / span 2;
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
