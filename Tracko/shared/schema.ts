import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  onTimeDeliveryRate: decimal("on_time_delivery_rate", { precision: 5, scale: 2 }).default("0.00"),
  communicationQuality: decimal("communication_quality", { precision: 5, scale: 2 }).default("0.00"),
  documentAccuracy: decimal("document_accuracy", { precision: 5, scale: 2 }).default("0.00"),
  costCompetitiveness: decimal("cost_competitiveness", { precision: 5, scale: 2 }).default("0.00"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const deliveries = pgTable("deliveries", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  supplierName: text("supplier_name").notNull(),
  materialType: text("material_type").notNull(),
  quantity: text("quantity").notNull(),
  unit: text("unit").notNull(),
  expectedDate: timestamp("expected_date"),
  actualDate: timestamp("actual_date"),
  status: text("status").notNull().default("pending"), // pending, in-transit, delivered, delayed, cancelled
  invoiceAmount: decimal("invoice_amount", { precision: 10, scale: 2 }),
  currency: text("currency").default("INR"),
  deliveryLocation: text("delivery_location"),
  notes: text("notes"),
  source: text("source").notNull().default("manual"), // manual, whatsapp, email, pdf
  processingStatus: text("processing_status").default("completed"), // processing, completed, review, error
  extractedData: jsonb("extracted_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size"),
  filePath: text("file_path"),
  documentType: text("document_type").notNull(), // invoice, receipt, contract, delivery-note
  processingStatus: text("processing_status").default("processing"), // processing, completed, error
  extractedText: text("extracted_text"),
  extractedData: jsonb("extracted_data"),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  deliveryId: integer("delivery_id").references(() => deliveries.id),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

export const whatsappMessages = pgTable("whatsapp_messages", {
  id: serial("id").primaryKey(),
  senderId: text("sender_id").notNull(),
  senderName: text("sender_name").notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  processingStatus: text("processing_status").default("processing"), // processing, completed, review, error
  extractedData: jsonb("extracted_data"),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  deliveryId: integer("delivery_id").references(() => deliveries.id),
  processedAt: timestamp("processed_at"),
});

export const processingStats = pgTable("processing_stats", {
  id: serial("id").primaryKey(),
  messagesProcessed: integer("messages_processed").default(0),
  documentsProcessed: integer("documents_processed").default(0),
  onTimeDeliveryRate: decimal("on_time_delivery_rate", { precision: 5, scale: 2 }).default("0.00"),
  activeSuppliers: integer("active_suppliers").default(0),
  timeSavedHours: decimal("time_saved_hours", { precision: 5, scale: 2 }).default("0.00"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Insert schemas
export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDeliverySchema = createInsertSchema(deliveries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
  processedAt: true,
});

export const insertWhatsappMessageSchema = createInsertSchema(whatsappMessages).omit({
  id: true,
  timestamp: true,
  processedAt: true,
});

// Types
export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;

export type Delivery = typeof deliveries.$inferSelect;
export type InsertDelivery = z.infer<typeof insertDeliverySchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type WhatsappMessage = typeof whatsappMessages.$inferSelect;
export type InsertWhatsappMessage = z.infer<typeof insertWhatsappMessageSchema>;

export type ProcessingStats = typeof processingStats.$inferSelect;
