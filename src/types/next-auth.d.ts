import 'next-auth'

declare module 'next-auth' {
  interface User {
    _id: string
    Username: string
    email: string
    Avatar: string
    EmployeeCode: string
  }

  interface Session {
    user: {
      _id: string
      Username: string
      email: string
      Avatar: string
      EmployeeCode: string
    }
  }
} 