import type { QueryResult, User } from '../../types'
import { defineEventHandler } from 'h3'
import { useDatabase } from 'nitropack/runtime'

export default defineEventHandler(async () => {
    const db = useDatabase()

    // Query for users
    const { rows } = await db.sql<QueryResult<User[]>>`SELECT * FROM users`

    return {
        code: 200,
        message: 'API is working!',
        data: rows || [],
    }
})
