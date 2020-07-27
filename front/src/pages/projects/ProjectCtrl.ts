import { Vue, Component } from "vue-property-decorator";

import General from "./form/General.vue";
import HumanResources from "./form/HumanResources.vue";
import Public from "./form/Public.vue";

@Component({
    name: "ProjectPage",
    components: {
        "general-form": General,
        "human-resources": HumanResources,
        "publics-component": Public
    }
})
export default class ProjectPage extends Vue {
    
    public step = 4;

    public id?: number;
    
    public created() {
        this.id = parseInt(this.$route.params.id);
    }

}
