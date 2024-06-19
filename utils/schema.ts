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
export const userAnswer = pgTable('userAnswer',{
    id:serial('id').primaryKey(),
    mockIdRef:varchar('mockId').notNull(),
    question:varchar('question').notNull(),
    correctAns:text('correctAns'),
    userAns:text('userAns'),
    feedback:text('feedback'),
    rating:varchar('rating'),
    userEmail:varchar('userEmail'),
    createdAt:varchar('createdAt'),
    
})