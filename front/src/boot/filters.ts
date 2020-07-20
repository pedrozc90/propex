/* eslint-disable @typescript-eslint/unbound-method */
import Vue from "vue";

import { DateUtils, StringUtils } from "../core/utils";

// initialize global filters

// date
Vue.filter("toDate", DateUtils.toDate);
Vue.filter("toBRString", DateUtils.toBRString);
Vue.filter("toISOString", DateUtils.toISOString);
Vue.filter("toDateString", DateUtils.toDateString);
Vue.filter("toDateTimeString", DateUtils.toDateTimeString);
Vue.filter("isValid", DateUtils.isValid);
Vue.filter("formatDate", DateUtils.formatDate);
Vue.filter("compareDate", DateUtils.compareDate);
Vue.filter("convertDate", DateUtils.convertDate);

// string
Vue.filter("uppercase", StringUtils.uppercase);
Vue.filter("lowercase", StringUtils.lowercase);
Vue.filter("reverse", StringUtils.reverse);
Vue.filter("capitalize", StringUtils.captalize);

//     // Vue.prototype.$filters = Vue.prototype.$options.filters;
// };
