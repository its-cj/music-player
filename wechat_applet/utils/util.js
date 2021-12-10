const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

let numChange = num => {
  let linsten = (num * 0.0001).toFixed(1)
  if (linsten >= 1) {
    return linsten + "万"
  } else {
    return num
  }
}


const qs = obj => {
  let arr = [];
  for (let o in obj) {
    arr.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
  }
  return arr.join("&");
}


let addCumulativemusic = function (name, musicMes, musicId) {
  wx.request({
    url: 'http://192.168.0.132:3000/add_cumulativemusic',
    data: {
      name,
      musicId,
      musicMes
    },
    success(res) {
      return res
    }
  })
}

const time_minute = (cc) => {
  let min = parseInt(cc / 60)
  let s = parseInt((cc - min * 60))
  if (min < 10) {
    min = "0" + min
  }
  if (s < 10) {
    s = "0" + s
  }
  return min + ":" + s
}
const trim = function (str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}


module.exports = {
  formatTime,
  numChange,
  qs,
  addCumulativemusic,
  time_minute,
  trim
}