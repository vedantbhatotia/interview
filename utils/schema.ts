// import { serial } from "drizzle-orm/mysql-core";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { serial } from "drizzle-orm/pg-core";
export const MockInterview = pgTable(
    'mockInterview',
    {
        id:serial('id').primaryKey(),
        jsonMockResp:text('jsonMockResp').notNull(),
        jobPosition:varchar('jobPosition').notNull(),
        jobDesc:varchar('jobDesc').notNull(),
        jobExperience:varchar('jobExperience').notNull(),
        createdBy:varchar('createdBy').notNull(),
        createdAt:varchar('createdAt'),
        mockId:varchar('mockId').notNull(),
    }
)