const axios = require('axios');
const { XMLHttpRequest } = require('xmlhttprequest')
global.XMLHttpRequest = XMLHttpRequest;

const url = 'http://localhost:8081/graphql'

describe('會員資料測試', () => {
  const user = {
    email: "kevin_ypfan@yahoo.com.tw",
    password: "abc123",
    username: "Kevin"
  }


  test('註冊會員', async () => {

    const response = await axios.post(url, {
      query: `
      mutation($email: String!, $username: String!, $password: String!) {
        signup(email: $email, username: $username, password: $password) {
          id
          username
          email
          tokens {
            id
            device
          }
        }
      }
      `,
      variables: user
    })
    expect(response.data).toMatchObject({
      data: {
        signup: {
          id: "1",
          username: "Kevin",
          email: "kevin_ypfan@yahoo.com.tw",
          tokens: [
            { id: "1", device: "darwin" }
          ]
        }
      },
    });
  })

  test('會員列表', async () => {
    const response = await axios.post(url, {
      query: `
      query {
        users {
          id
          username
          email
          tokens {
            id
            device
          }
        }
      }
      `,
    });

    expect(response.data).toMatchObject({
      data: {
        users: [
          {
            id: "1",
            email: user.email,
            username: user.username,
            tokens: [
              { id: "1", device: "darwin" }
            ]
          }
        ]
      }
    });
  })

  test('會員ID搜尋', async () => {
    const response = await axios.post(url, {
      query: `
      query ($userId: ID!) {
        user (userId: $userId){
          id
          email
          username
          tokens {
            id
            device
          }
        }
      }
      `,
      variables: { userId: "1" }
    });
    expect(response.data).toMatchObject({
      data: {
        user: {
          id: "1",
          email: user.email,
          username: user.username,
          tokens: [
            { id: "1", device: "darwin" }
          ]
        }
      }
    });
  })

  test('登入會員成功', async () => {
    const response = await axios.post(url, {
      query: `
      mutation ($email: String!, $password: String!) {
        login(email: $email, password: $password){
          id
          email
          username
          tokens {
            id
            device
          }
        }
      }
      `,
      variables: { email: user.email, password: user.password }
    });
    expect(response.data).toMatchObject({
      data: {
        login: {
          id: "1",
          email: user.email,
          username: user.username,
          tokens: [
            { id: "1", device: "darwin" },
            { id: "2", device: "darwin" }
          ]
        }
      }
    })
  })

  test('登入會員失敗', async () => {
    const response = await axios.post(url, {
      query: `
      mutation ($email: String!, $password: String!) {
        login(email: $email, password: $password){
          id
          email
          username
          tokens {
            id
            device
          }
        }
      }
      `,
      variables: { email: user.email, password: "acb123" }
    });
    expect(response.data).toMatchObject({
      errors: [{
        "message": "電子信箱或密碼有錯誤！",
        "locations": [
          {
            "line": 3,
            "column": 9
          }
        ],
        "path": [
          "login"
        ]
      }],
      "data": {
        "login": null
      }
    })
  })
  test('會員登出', async () => {
    const user1 = await axios.post(url, {
      query: `
      query ($userId: ID!) {
        user (userId: $userId){
          id
          email
          username
          tokens {
            id
            device
            tokenHash
          }
        }
      }
      `,
      variables: { userId: "1" }
    });
    const response = await axios.post(url, {
      query: `
       mutation {
        logout {
          id
          email
          username
          tokens{
            id
            device
          }
        }
      }
      `
    }, { headers: { authToken: user1.data.data.user.tokens[0].tokenHash } })
    expect(response.data).toMatchObject({
      data: {
        logout: {
          id: "1",
          username: user.username,
          email: user.email,
          tokens: [
            { id: "2", device: "darwin" }
          ]
        }
      }
    })
  })
})

