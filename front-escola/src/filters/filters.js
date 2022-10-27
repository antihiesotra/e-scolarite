import moment from 'moment'
const filters = {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.toUpperCase()
  },
  capitalizeFirst: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  },
  dateFormat: function (date) {
    return moment(date).format('DD/MM/YYYY')
  }
}
export default filters
