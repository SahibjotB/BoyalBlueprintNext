import pool from "@/lib/db";

export async function insertTestData(id: number, name: string) {
    const query = `
        INSERT INTO test (id, name)
        VALUES ($1, $2)
        RETURNING *
    `;
    const values = [id, name];      
    const result = await pool.query(query, values);

    return result.rows[0];
}
