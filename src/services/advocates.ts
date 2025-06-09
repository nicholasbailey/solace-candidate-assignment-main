import { Advocate } from "../types";
import { getDb } from "../db";
import { sql } from 'drizzle-orm' 
import { advocates } from "../db/schema";


const toAdvocateModel = (row: typeof advocates.$inferSelect) => ({
    firstName: row.firstName,
    lastName: row.lastName,
    city: row.city,
    degree: row.degree,
    specialties: row.specialties,
    yearsOfExperience: row.yearsOfExperience,
    phoneNumber: row.phoneNumber,
})

export const searchAdvocates = async (searchQuery: string): Promise<Advocate[]> => {
    const db = getDb();

    return (await db.select().from(advocates).orderBy(
        sql`ts_rank(to_tsvector('english', ${advocates.fullTextSearchDocument}), plainto_tsquery('english', ${searchQuery})) DESC`
    ).where(
        sql`
          to_tsvector('english', ${advocates.fullTextSearchDocument}) @@ plainto_tsquery('english', ${searchQuery})
        `
    )).map((row) => toAdvocateModel(row))
}



export const createAdvocates = async (input: Advocate[]) => {
    const db = getDb();

    const models = input.map((advocate) => ({
        ...advocate,
        fullTextSearchDocument: advocate.firstName + " " + advocate.lastName + " " + advocate.city + " " + advocate.degree + " " + advocate.specialties.join(" ")
    }))

    const results = await db.insert(advocates).values(models).returning();

    // This 
    return results.map((row) => toAdvocateModel(row))
}