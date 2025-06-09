import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  jsonb,
  serial,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

const fullTextIndexExpression = sql`
  to_tsvector(
    'english',
    first_name || ' ' || last_name || ' ' || city || ' ' || degree || ' ' || array_to_string(specialties, ' ')
  )
`;

const advocates = pgTable(
  "advocates", 
  {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    city: text("city").notNull(),
    degree: text("degree").notNull(),
    // Design question: Specialties
    // Data like specialties is this fun intemediary space between
    // enum-like data and free data. 
    // One apporach would be to say that there is a fixed list of valid specialties.
    // 
    // If this was the case, we would probably store the specialties in a static data
    // structure in code (no, not a database table, static database tables are just a performance 
    // and maintanene headache).
    //
    // The other approach is to say that the list of specialties is dynamic, and providers
    // can define new ones as they go along, perhaps with an outocomplete interface that pulls
    // from a list of 'common' specialties, but allows free form entry.
    //
    // This is ultimately a product question. Were I the product owner, I would recommend
    // a fixed set of specialties - as that limits provider's ability to manipulate the search
    // results with janky SEO. 
    specialties: text("specialties").array().default(sql`'{}'`),
    yearsOfExperience: integer("years_of_experience").notNull(),
    phoneNumber: text("phone_number").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    // This full text search document is generated in the appliation
    // rather than as a generated column, becausae postgres does not support
    // array_to_string in generated columns. It's annoying, but whatever.
    fullTextSearchDocument: text("full_text_search_document")
  },
  (table) => ({
    fullTextSearchIdx: index("full_text_search_index")
      .using('gin', sql`to_tsvector('english', ${table.fullTextSearchDocument})`)
  })
);

export { advocates };
