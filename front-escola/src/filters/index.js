import filters from './filters'

export default {
  install (Vue) {
    Vue.filter('capitalize', filters.capitalize)
    Vue.filter('capitalizeFirst', filters.capitalizeFirst)
    Vue.filter('dateFormat', filters.dateFormat)
  }
}
