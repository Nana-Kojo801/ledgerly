import type { Category, Expense } from '@/types'
import { Dexie, type EntityTable } from 'dexie'

const db = new Dexie('LedgerlyDatabase') as Dexie & {
  categories: EntityTable<Category, 'id'>
  expenses: EntityTable<Expense, 'id'>
}

db.version(1).stores({
  categories: 'id, name, description, monthlyBudget, color', // id is primary key (string UUID)
  expenses: 'id, amount, categoryId, date, note',
})

export default db
