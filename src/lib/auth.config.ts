import { InactiveAccountError, InvalidEmailPasswordError } from '@/utils/error'
import { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { cookies } from 'next/headers'

const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      credentials: {
        employeeCode: {},
        password: {}
      },
      async authorize(credentials) {
        const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
          method: 'POST',
          body: JSON.stringify({
            employeeCode: credentials?.employeeCode,
            password: credentials?.password
          }),
          headers: { 'Content-Type': 'application/json' }
        })
        const checkRes = await response.json()
        console.log('>>> response: ', checkRes)

        if (checkRes.status == 200) {
          const getInfoAccount = await fetch(`${process.env.BACKEND_URL}/auth/get-me`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${checkRes.data?.token}` }
          })
          const checkResInfoAccount = await getInfoAccount.json()
          if (checkResInfoAccount.status == 200) {
            const cookieStore = await cookies()
            cookieStore.set('token', checkRes.data?.token)
            return {
              _id: checkResInfoAccount.data.UserId,
              Username: checkResInfoAccount.data.Username,
              email: checkResInfoAccount.data.Email,
              Avatar: checkResInfoAccount.data.Avatar,
              EmployeeCode: checkResInfoAccount.data?.EmployeeCode
            }
          } else {
            throw new Error('Internal server error')
          }
        } else if (checkRes.status === 1) {
          throw new InvalidEmailPasswordError()
        } else if (+checkRes.status === 400) {
          throw new InactiveAccountError()
        } else {
          throw new Error('Internal server error')
        }
      }
    })
  ],
  pages: {
    signIn: '/'
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log(token, 'token')
      console.log(user, 'user')
      if (user) {
        token.id = user.id
        token.Username = user.Username
        token.email = user.email
        token.Avatar = user.Avatar
        token.EmployeeCode = user.EmployeeCode
      }
      return token
    },
    async session({ session, token }) {
      session.user._id = token.id as string
      session.user.Username = token.Username as string
      session.user.email = token.email as string
      session.user.Avatar = token.Avatar as string
      session.user.EmployeeCode = token.EmployeeCode as string
      return session
    }
  }
} satisfies NextAuthConfig
export default authConfig
