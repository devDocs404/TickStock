// import {
//   pgTable,
//   uuid,
//   text,
//   timestamp,
//   integer,
//   decimal,
//   boolean,
// } from "drizzle-orm/pg-core";
// import { createId } from "@paralleldrive/cuid2";

// export const users = pgTable("users", {
//   id: text("id")
//     .primaryKey()
//     .$defaultFn(() => createId()),
//   email: text("email").notNull().unique(), // unique email
//   password: text("password").notNull(),
//   firstName: text("first_name").notNull(),
//   lastName: text("last_name").notNull(),
//   createdAt: timestamp("created_at").defaultNow(), // Use PostgreSQL's built-in timestamp
//   updatedAt: timestamp("updated_at").defaultNow(), // Automatically set to current timestamp
//   isActive: boolean("is_active").default(true),
// });
// export const basketRecords = pgTable("basket_records", {
//   id: text("id")
//     .primaryKey()
//     .$defaultFn(() => createId()),
//   userId: text("user_id").references(() => users.id), // Foreign key to users
//   basketName: text("basket_name").notNull(),
//   createdAt: timestamp("created_at").defaultNow(), // Created at timestamp
//   updatedAt: timestamp("updated_at").defaultNow(), // Updated at timestamp
//   isActive: boolean("is_active").default(true),
// });

// export const stockRecords = pgTable("stock_records", {
//   id: text("id")
//     .primaryKey()
//     .$defaultFn(() => createId()),
//   userId: text("user_id").references(() => users.id), // Foreign key to users
//   basketId: text("basket_id").references(() => basketRecords.id),
//   tickerId: text("ticker_Id").references(() => tickerTable.symbolId),
//   buyDate: text("buy_date").notNull(), // Timestamp for buy date
//   buyPrice: text("buy_price").notNull(), // Decimal value for buy price
//   quantity: text("quantity").notNull(), // Quantity of stock bought
//   brokerName: text("broker_name").notNull(),
//   createdAt: timestamp("created_at", ).defaultNow(), // Created at timestamp
//   updatedAt: timestamp("updated_at").defaultNow(), // Updated at timestamp
//   isActive: boolean("is_active").default(true),
// });

// export const tickerTable = pgTable("ticker_table", {
//   symbolId: text("symbol_id").primaryKey(),
//   tickerName: text("ticker_name").notNull(),
//   // symbol: text("symbol").notNull(),
//   exchange: text("exchange").notNull(),
//   createdAt: timestamp("created_at").defaultNow(), // Created at timestamp
//   updatedAt: timestamp("updated_at").defaultNow(), // Updated at timestamp
//   isActive: boolean("is_active").default(true),
// });

// import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
// import { createId } from "@paralleldrive/cuid2";
// import { relations } from "drizzle-orm";

// // Define the users table
// export const users = pgTable("users", {
//   id: text("id")
//     .primaryKey()
//     .$defaultFn(() => createId()),
//   email: text("email").notNull().unique(),
//   password: text("password").notNull(),
//   firstName: text("first_name").notNull(),
//   lastName: text("last_name").notNull(),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
//   updatedAt: timestamp("updated_at").defaultNow().notNull(),
//   isActive: boolean("is_active").default(true).notNull(),
// });

// // Define the basket_records table
// export const basketRecords = pgTable("basket_records", {
//   id: text("id")
//     .primaryKey()
//     .$defaultFn(() => createId()),
//   userId: text("user_id")
//     .references(() => users.id)
//     .notNull(),
//   basketName: text("basket_name").notNull().unique(),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
//   updatedAt: timestamp("updated_at").defaultNow().notNull(),
//   isActive: boolean("is_active").default(true).notNull(),
// });

// // Define the ticker_table
// export const tickerTable = pgTable("ticker_table", {
//   symbolId: text("symbol_id").primaryKey().unique().notNull(),
//   tickerName: text("ticker_name").notNull().unique(),
//   exchange: text("exchange").notNull(),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
//   updatedAt: timestamp("updated_at").defaultNow().notNull(),
//   isActive: boolean("is_active").default(true).notNull(),
// });

// // Define the stock_records table
// export const stockRecords = pgTable("stock_records", {
//   id: text("id")
//     .primaryKey()
//     .$defaultFn(() => createId()),
//   userId: text("user_id")
//     .references(() => users.id)
//     .notNull(),
//   basketId: text("basket_id").references(() => basketRecords.id),
//   tickerId: text("ticker_id")
//     .references(() => tickerTable.symbolId)
//     .notNull(),
//   buyDate: timestamp("buy_date").notNull(),
//   buyPrice: text("buy_price").notNull(),
//   quantity: text("quantity").notNull(),
//   brokerName: text("broker_name").notNull(),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
//   updatedAt: timestamp("updated_at").defaultNow().notNull(),
//   isActive: boolean("is_active").default(true).notNull(),
// });

// // Define explicit relations
// export const usersRelations = relations(users, ({ many }) => ({
//   stockRecords: many(stockRecords),
//   basketRecords: many(basketRecords),
// }));

// export const basketRecordsRelations = relations(
//   basketRecords,
//   ({ one, many }) => ({
//     user: one(users, {
//       fields: [basketRecords.userId],
//       references: [users.id],
//     }),
//     stockRecords: many(stockRecords),
//   })
// );

// export const tickerTableRelations = relations(tickerTable, ({ many }) => ({
//   stockRecords: many(stockRecords),
// }));

// export const stockRecordsRelations = relations(stockRecords, ({ one }) => ({
//   user: one(users, {
//     fields: [stockRecords.userId],
//     references: [users.id],
//   }),
//   basket: one(basketRecords, {
//     fields: [stockRecords.basketId],
//     references: [basketRecords.id],
//   }),
//   ticker: one(tickerTable, {
//     fields: [stockRecords.tickerId],
//     references: [tickerTable.symbolId],
//   }),
// }));

import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

// Define the users table
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Define the basket_records table
export const basketRecords = pgTable("basket_records", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  basketName: text("basket_name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Define the ticker_table
export const tickerTable = pgTable("ticker_table", {
  symbolId: text("symbol_id").primaryKey().unique().notNull(),
  tickerName: text("ticker_name").notNull().unique(),
  exchange: text("exchange").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Define the stock_records table
export const stockRecords = pgTable("stock_records", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  basketId: text("basket_id").references(() => basketRecords.id),
  tickerId: text("ticker_id")
    .references(() => tickerTable.symbolId)
    .notNull(),
  buyDate: timestamp("buy_date").notNull(),
  buyPrice: text("buy_price").notNull(),
  quantity: text("quantity").notNull(),
  brokerName: text("broker_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Define explicit relations
export const usersRelations = relations(users, ({ many }) => ({
  stockRecords: many(stockRecords),
  basketRecords: many(basketRecords),
}));

export const basketRecordsRelations = relations(
  basketRecords,
  ({ one, many }) => ({
    user: one(users, {
      fields: [basketRecords.userId],
      references: [users.id],
    }),
    stockRecords: many(stockRecords),
  })
);

export const tickerTableRelations = relations(tickerTable, ({ many }) => ({
  stockRecords: many(stockRecords),
}));

export const stockRecordsRelations = relations(stockRecords, ({ one }) => ({
  user: one(users, {
    fields: [stockRecords.userId],
    references: [users.id],
  }),
  basket: one(basketRecords, {
    fields: [stockRecords.basketId],
    references: [basketRecords.id],
  }),
  ticker: one(tickerTable, {
    fields: [stockRecords.tickerId],
    references: [tickerTable.symbolId],
  }),
}));
