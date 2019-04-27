/*eslint-disable */
const express = require('express')    // 引入express模块
const Mock = require('mockjs')        // 引入mock模块
const app = express()

const port = 2021

let domain = {}
domain.api = ''

app.all(domain.api + '/spactivity/spact/receive_api', (req, res) => {
    setTimeout(() => {
      res.json(Mock.mock({
        "code": "123",
        "data": "123456"
      }))
    }, 1000)
})

// 查询用户状态
app.all(domain.api + '/spactivity/spact/gain', (req, res) => {
    res.json(Mock.mock({
        code: '000000',
        'msg': '',
        'data': {
            state: 2
        },
    }))
})

// 通过手机号领取qq红包
app.all(domain.api + '/red-packet/api/redPacket/getUserRedState', (req, res) => {
    res.json(Mock.mock({
        code: 200,
        'msg': '',
        'data': {
            state: 1
        },
    }))
})

// 落地页大接口-弹框
app.all(domain.api + '/red-packet/api/redPacket/act', (req, res) => {
  setTimeout(() => {
    res.json(Mock.mock(
      {"code":200,
        "codeMsg":"",
        "data":{
        "alertCash":true,
          "cashLoan":{"cashLoan3":1,"cashLoan1":2,"cashLoan2":0},"ppdaiLoan":{"ppdaiLoan3":0,"ppdaiLoan2":0,"ppdaiLoan1":0},"alertCashValue":0.0
      }
      }))
  }, 1500)
})

app.listen(port);

console.log('success at ' + port);