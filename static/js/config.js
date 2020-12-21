// import axios from 'axios'
// //手动添加的
// axios.defaults.timeout = 300000
// if (process.env.NODE_ENV === 'development') {
//   console.log('开发板')
//   axios.defaults.baseURL = 'http://192.168.1.15:8005'
//     axios.defaults.baseURL1 = 'http://192.168.1.15:8003'
// } else if (process.env.NODE_ENV === 'production') {
//   console.log('build后')
//   axios.get('serverconfig.json').then(res => {
//     console.log(res.data.baseUrl)
//     // console.log(res.data.baseUrl2)
//     if (res.data.baseUrl) {
//       axios.defaults.baseURL = res.data.baseUrl
//
//     } else {
//       // axios.defaults.baseURL = 'http://192.168.1.15:8005'
//       axios.defaults.baseURL = 'http://192.168.1.15:05'
//     }
//
//     if (res.data.baseUrl2) {
//       axios.defaults.baseURL1 = res.data.baseUrl2
//     } else {
//       axios.defaults.baseURL1 = 'http://192.168.1.15:03'
//     }
//   })
// }

window.global={
  BASE_URL:"http://192.168.1.15:8005",
  base_url:"http://192.168.1.15:8003"
}


