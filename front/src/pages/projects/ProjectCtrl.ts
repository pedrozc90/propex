import { Vue, Component } from "vue-property-decorator";

import General from "./form/General.vue";
import HumanResources from "./form/HumanResources.vue";
import OutOfOrder from "./form/OutOfOrder.vue";

@Component({
    name: "ProjectPage",
    components: {
        "general-form": General,
        "human-resources": HumanResources,
        "out-of-order": OutOfOrder
    }
})
export default class ProjectPage extends Vue {
    
    public step = 1;

    public id?: number;
    
    public mounted() {
        this.id = parseInt(this.$route.params.id);
        console.log("PROJECT ID:", this.id);
    }

}
