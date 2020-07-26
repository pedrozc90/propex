import { Vue, Component } from "vue-property-decorator";

import General from "./form/General.vue";
import HumanResources from "./form/HumanResources.vue";
import Public from "./form/Public.vue";
import OutOfOrder from "./form/OutOfOrder.vue";

@Component({
    name: "ProjectPage",
    components: {
        "general-form": General,
        "human-resources": HumanResources,
        "publics-component": Public,
        "out-of-order": OutOfOrder
    }
})
export default class ProjectPage extends Vue {
    
    public step = 2;

    public id?: number;
    
    public created() {
        this.id = parseInt(this.$route.params.id);
    }

}
