// import * as dtfilters from "@core/utils/helpers/DateHelper";

// // initialize global filters
// export default async ({ Vue }) => {

//     // date
//     Vue.filter("toDate", dtfilters.toDate);
//     Vue.filter("toBRString", dtfilters.toBRString);
//     Vue.filter("toISOString", dtfilters.toISOString);
//     Vue.filter("toDateString", dtfilters.toDateString);
//     Vue.filter("toDateTimeString", dtfilters.toDateTimeString);
//     Vue.filter("isValid", dtfilters.isValid);
//     Vue.filter("formatDate", dtfilters.formatDate);
//     Vue.filter("compareDate", dtfilters.compareDate);
//     Vue.filter("convertDate", dtfilters.convertDate);

//     // string
//     Vue.filter("uppercase", (value: string) => (value) ? value.toUpperCase() : null);
//     Vue.filter("lowercase", (value: string) => (value) ? value.toLowerCase() : null);
//     Vue.filter("reverse", (value: string) => (value) ? value.split("").reverse().join("") : null);
//     Vue.filter("capitalize", (value: string) => (value) ? value.split(" ").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ") : null);

//     // Vue.prototype.$filters = Vue.prototype.$options.filters;

// };
