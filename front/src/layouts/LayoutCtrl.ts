import { Vue, Component } from "vue-property-decorator";
import { openURL } from "quasar";

import AppLink from "../components/AppLink.vue";
import AppItem from "../components/AppItem.vue";

@Component({
    name: "Layout",
    components: {
        "app-link": AppLink,
        "app-item": AppItem
    }
})
export default class Layout extends Vue {

    public leftDrawerOpen: boolean = this.$q.platform.is.desktop || false;

    public openURL: (url: string) => void = openURL;

    public get isAuthenticated(): boolean {
        return this.$store.getters["auth/isAuthenticated"];
    }
    
    public async logout(): Promise<void> {
        await this.$store.dispatch("authentication/logout");
    }
    
    public essentialLinks = [
        { title: "Docs", caption: "quasar.dev", icon: "school", link: "https://quasar.dev" },
        { title: "Github", caption: "github.com/quasarframework", icon: "code", link: "https://github.com/quasarframework" },
        { title: "Discord Chat Channel", caption: "chat.quasar.dev", icon: "chat", link: "https://chat.quasar.dev" },
        { title: "Forum", caption: "forum.quasar.dev", icon: "record_voice_over", link: "https://forum.quasar.dev" },
        { title: "Twitter", caption: "@quasarframework", icon: "rss_feed", link: "https://twitter.quasar.dev" },
        { title: "Facebook", caption: "@QuasarFramework", icon: "public", link: "https://facebook.quasar.dev" },
        { title: "Quasar Awesome", caption: "Community Quasar projects", icon: "favorite", link: "https://awesome.quasar.dev" }
    ];
    
}
