/**
 * Created by Jeffrey on 2017/11/9.
 */

const isPro = Object.is(process.env.NODE_ENV, 'production')

module.exports = {
  baseUrl: isPro ? 'http://localhost/api/' : 'api/'
}
