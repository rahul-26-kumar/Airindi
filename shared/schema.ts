import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users schema from existing file
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// New booking schema for flight bookings
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  source: text("source").notNull(),
  destination: text("destination").notNull(),
  departureDate: text("departure_date").notNull(),
  passengers: jsonb("passengers").notNull(),
  userId: integer("user_id").references(() => users.id),
  createdAt: text("created_at").notNull(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
}));

export const insertBookingSchema = createInsertSchema(bookings).pick({
  source: true,
  destination: true,
  departureDate: true,
  passengers: true,
  userId: true,
});

export const passengers = z.object({
  adults: z.number().min(1).max(9),
  children: z.number().min(0).max(9),
  infants: z.number().min(0).max(9),
});

export const bookingSchema = insertBookingSchema.extend({
  // Accept both string and date for departure date
  departureDate: z.string().or(z.date()).transform(val => 
    typeof val === 'string' ? val : val.toISOString().split('T')[0]
  ),
  passengers: passengers,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// New flight searches schema
export const flightSearches = pgTable("flight_searches", {
  id: serial("id").primaryKey(),
  source: text("source").notNull(),
  destination: text("destination").notNull(),
  departureDate: text("departure_date").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertFlightSearchSchema = createInsertSchema(flightSearches).pick({
  source: true,
  destination: true,
  departureDate: true,
});

export type InsertFlightSearch = z.infer<typeof insertFlightSearchSchema>;
export type FlightSearch = typeof flightSearches.$inferSelect;
