import type { User } from '~server/types'
import { defineEventHandler } from 'h3'
import { useDatabase } from 'nitropack/runtime'

export default defineEventHandler(async () => {
    const db = useDatabase('sqlite3')

    // Query for users
    // const { rows } = await db.sql<QueryResult>`SELECT * FROM users`
    const data = await db.prepare('SELECT * FROM users').all() as User[]

    return {
        code: 200,
        message: 'API is working!',
        data,
    }
})
