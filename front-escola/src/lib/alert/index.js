import {Alert} from 'quasar'
import 'quasar-extras/animate/bounceInRight.css'
import 'quasar-extras/animate/bounceOutRight.css'

export default {
  success: function (message) {
    let alert = Alert.create({
      enter: 'bounceInRight',
      leave: 'bounceOutRight',
      color: 'positive',
      icon: 'done',
      html: message,
      position: 'top-right'
    })
    setTimeout(function () {
      alert.dismiss()
    }, 4000)
  },

  error: function (message) {
    let alert = Alert.create({
      enter: 'bounceInRight',
      leave: 'bounceOutRight',
      color: 'red',
      icon: 'error',
      html: message,
      position: 'top-right'
    })
    setTimeout(function () {
      alert.dismiss()
    }, 4000)
  },

  info: function (message) {
    let alert = Alert.create({
      enter: 'bounceInRight',
      leave: 'bounceOutRight',
      color: 'info',
      icon: 'info',
      html: message,
      position: 'top-right'
    })
    setTimeout(function () {
      alert.dismiss()
    }, 4000)
  },

  warning: function (message) {
    let alert = Alert.create({
      enter: 'bounceInRight',
      leave: 'bounceOutRight',
      color: 'warning',
      icon: 'warning',
      html: message,
      position: 'top-right'
    })
    setTimeout(function () {
      alert.dismiss()
    }, 4000)
  }
}
