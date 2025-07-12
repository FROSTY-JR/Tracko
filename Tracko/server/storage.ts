import { 
  suppliers, 
  deliveries, 
  documents, 
  whatsappMessages, 
  processingStats,
  type Supplier, 
  type InsertSupplier,
  type Delivery,
  type InsertDelivery,
  type Document,
  type InsertDocument,
  type WhatsappMessage,
  type InsertWhatsappMessage,
  type ProcessingStats,
} from "@shared/schema";

export interface IStorage {
  // Suppliers
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: number): Promise<boolean>;

  // Deliveries
  getDeliveries(): Promise<Delivery[]>;
  getDelivery(id: number): Promise<Delivery | undefined>;
  createDelivery(delivery: InsertDelivery): Promise<Delivery>;
  updateDelivery(id: number, delivery: Partial<InsertDelivery>): Promise<Delivery | undefined>;
  deleteDelivery(id: number): Promise<boolean>;

  // Documents
  getDocuments(): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;

  // WhatsApp Messages
  getWhatsappMessages(): Promise<WhatsappMessage[]>;
  getWhatsappMessage(id: number): Promise<WhatsappMessage | undefined>;
  createWhatsappMessage(message: InsertWhatsappMessage): Promise<WhatsappMessage>;
  updateWhatsappMessage(id: number, message: Partial<InsertWhatsappMessage>): Promise<WhatsappMessage | undefined>;

  // Processing Stats
  getProcessingStats(): Promise<ProcessingStats | undefined>;
  updateProcessingStats(stats: Partial<ProcessingStats>): Promise<ProcessingStats>;
}

export class MemStorage implements IStorage {
  private suppliers: Map<number, Supplier> = new Map();
  private deliveries: Map<number, Delivery> = new Map();
  private documents: Map<number, Document> = new Map();
  private whatsappMessages: Map<number, WhatsappMessage> = new Map();
  private processingStats: ProcessingStats | undefined;
  
  private currentSupplierId = 1;
  private currentDeliveryId = 1;
  private currentDocumentId = 1;
  private currentWhatsappMessageId = 1;
  private currentStatsId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed suppliers
    const supplierData: InsertSupplier[] = [
      {
        name: "ABC Trading Co.",
        contactPerson: "John Smith",
        email: "john@abctrading.com",
        phone: "+91-9876543210",
        address: "123 Industrial Area, Mumbai",
        rating: "4.5",
        onTimeDeliveryRate: "87.30",
        communicationQuality: "85.00",
        documentAccuracy: "95.00",
        costCompetitiveness: "80.00",
        isActive: true,
      },
      {
        name: "XYZ Suppliers",
        contactPerson: "Sarah Johnson",
        email: "sarah@xyzsuppliers.com",
        phone: "+91-9876543211",
        address: "456 Business Park, Delhi",
        rating: "4.2",
        onTimeDeliveryRate: "82.10",
        communicationQuality: "88.00",
        documentAccuracy: "92.00",
        costCompetitiveness: "85.00",
        isActive: true,
      },
      {
        name: "PQR Industries",
        contactPerson: "Mike Wilson",
        email: "mike@pqrindustries.com",
        phone: "+91-9876543212",
        address: "789 Manufacturing Hub, Chennai",
        rating: "4.8",
        onTimeDeliveryRate: "94.50",
        communicationQuality: "90.00",
        documentAccuracy: "98.00",
        costCompetitiveness: "78.00",
        isActive: true,
      },
    ];

    supplierData.forEach(supplier => {
      this.createSupplier(supplier);
    });

    // Seed deliveries
    const deliveryData: InsertDelivery[] = [
      {
        supplierId: 1,
        supplierName: "ABC Trading Co.",
        materialType: "Raw Steel",
        quantity: "500",
        unit: "tons",
        expectedDate: new Date("2024-12-15"),
        actualDate: new Date("2024-12-15"),
        status: "delivered",
        invoiceAmount: "2500000.00",
        currency: "INR",
        deliveryLocation: "Mumbai Factory",
        notes: "Delivered on time, quality good",
        source: "whatsapp",
        processingStatus: "completed",
        extractedData: {
          confidence: 0.95,
          originalMessage: "Delivered 500 tons of raw steel to Mumbai factory today at 3pm"
        },
      },
      {
        supplierId: 2,
        supplierName: "XYZ Suppliers",
        materialType: "Electronics",
        quantity: "200",
        unit: "units",
        expectedDate: new Date("2024-12-16"),
        actualDate: new Date("2024-12-17"),
        status: "delayed",
        invoiceAmount: "750000.00",
        currency: "INR",
        deliveryLocation: "Delhi Warehouse",
        notes: "Delayed due to traffic, quality acceptable",
        source: "whatsapp",
        processingStatus: "review",
        extractedData: {
          confidence: 0.88,
          originalMessage: "Shipment delayed due to traffic. Will reach by 5pm"
        },
      },
      {
        supplierId: 3,
        supplierName: "PQR Industries",
        materialType: "Textiles",
        quantity: "1000",
        unit: "yards",
        expectedDate: new Date("2024-12-18"),
        actualDate: null,
        status: "in-transit",
        invoiceAmount: "500000.00",
        currency: "INR",
        deliveryLocation: "Chennai Plant",
        notes: "In transit, expected on time",
        source: "email",
        processingStatus: "completed",
        extractedData: {
          confidence: 0.92,
          originalMessage: "Invoice for 1000 yards of textiles"
        },
      },
    ];

    deliveryData.forEach(delivery => {
      this.createDelivery(delivery);
    });

    // Seed processing stats
    this.processingStats = {
      id: 1,
      messagesProcessed: 1247,
      documentsProcessed: 342,
      onTimeDeliveryRate: "87.30",
      activeSuppliers: 34,
      timeSavedHours: "3.50",
      lastUpdated: new Date(),
    };
  }

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = this.currentSupplierId++;
    const supplier: Supplier = {
      ...insertSupplier,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Ensure null values instead of undefined
      address: insertSupplier.address ?? null,
      email: insertSupplier.email ?? null,
      contactPerson: insertSupplier.contactPerson ?? null,
      phone: insertSupplier.phone ?? null,
      rating: insertSupplier.rating ?? null,
      onTimeDeliveryRate: insertSupplier.onTimeDeliveryRate ?? null,
      communicationQuality: insertSupplier.communicationQuality ?? null,
      documentAccuracy: insertSupplier.documentAccuracy ?? null,
      costCompetitiveness: insertSupplier.costCompetitiveness ?? null,
      isActive: insertSupplier.isActive ?? null,
    };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  async updateSupplier(id: number, insertSupplier: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const existing = this.suppliers.get(id);
    if (!existing) return undefined;

    const updated: Supplier = {
      ...existing,
      ...insertSupplier,
      updatedAt: new Date(),
    };
    this.suppliers.set(id, updated);
    return updated;
  }

  async deleteSupplier(id: number): Promise<boolean> {
    return this.suppliers.delete(id);
  }

  // Deliveries
  async getDeliveries(): Promise<Delivery[]> {
    return Array.from(this.deliveries.values());
  }

  async getDelivery(id: number): Promise<Delivery | undefined> {
    return this.deliveries.get(id);
  }

  async createDelivery(insertDelivery: InsertDelivery): Promise<Delivery> {
    const id = this.currentDeliveryId++;
    const delivery: Delivery = {
      ...insertDelivery,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Ensure required fields have proper defaults
      source: insertDelivery.source || "manual",
      status: insertDelivery.status || "pending",
      processingStatus: insertDelivery.processingStatus || "completed",
      supplierId: insertDelivery.supplierId ?? null,
      expectedDate: insertDelivery.expectedDate ?? null,
      actualDate: insertDelivery.actualDate ?? null,
      invoiceAmount: insertDelivery.invoiceAmount ?? null,
      currency: insertDelivery.currency || "INR",
      deliveryLocation: insertDelivery.deliveryLocation ?? null,
      notes: insertDelivery.notes ?? null,
      extractedData: insertDelivery.extractedData ?? null,
    };
    this.deliveries.set(id, delivery);
    return delivery;
  }

  async updateDelivery(id: number, insertDelivery: Partial<InsertDelivery>): Promise<Delivery | undefined> {
    const existing = this.deliveries.get(id);
    if (!existing) return undefined;

    const updated: Delivery = {
      ...existing,
      ...insertDelivery,
      updatedAt: new Date(),
    };
    this.deliveries.set(id, updated);
    return updated;
  }

  async deleteDelivery(id: number): Promise<boolean> {
    return this.deliveries.delete(id);
  }

  // Documents
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.currentDocumentId++;
    const document: Document = {
      ...insertDocument,
      id,
      uploadedAt: new Date(),
      processedAt: null,
      // Ensure required fields have proper defaults
      processingStatus: insertDocument.processingStatus || "processing",
      extractedText: insertDocument.extractedText ?? null,
      extractedData: insertDocument.extractedData ?? null,
      confidence: insertDocument.confidence ?? null,
      fileSize: insertDocument.fileSize ?? null,
      filePath: insertDocument.filePath ?? null,
      deliveryId: insertDocument.deliveryId ?? null,
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: number, insertDocument: Partial<InsertDocument>): Promise<Document | undefined> {
    const existing = this.documents.get(id);
    if (!existing) return undefined;

    const updated: Document = {
      ...existing,
      ...insertDocument,
      processedAt: insertDocument.processingStatus === "completed" ? new Date() : existing.processedAt,
    };
    this.documents.set(id, updated);
    return updated;
  }

  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }

  // WhatsApp Messages
  async getWhatsappMessages(): Promise<WhatsappMessage[]> {
    return Array.from(this.whatsappMessages.values());
  }

  async getWhatsappMessage(id: number): Promise<WhatsappMessage | undefined> {
    return this.whatsappMessages.get(id);
  }

  async createWhatsappMessage(insertMessage: InsertWhatsappMessage): Promise<WhatsappMessage> {
    const id = this.currentWhatsappMessageId++;
    const message: WhatsappMessage = {
      ...insertMessage,
      id,
      timestamp: new Date(),
      processedAt: null,
      // Ensure required fields have proper defaults
      processingStatus: insertMessage.processingStatus || "processing",
      extractedData: insertMessage.extractedData ?? null,
      confidence: insertMessage.confidence ?? null,
      deliveryId: insertMessage.deliveryId ?? null,
    };
    this.whatsappMessages.set(id, message);
    return message;
  }

  async updateWhatsappMessage(id: number, insertMessage: Partial<InsertWhatsappMessage>): Promise<WhatsappMessage | undefined> {
    const existing = this.whatsappMessages.get(id);
    if (!existing) return undefined;

    const updated: WhatsappMessage = {
      ...existing,
      ...insertMessage,
      processedAt: insertMessage.processingStatus === "completed" ? new Date() : existing.processedAt,
    };
    this.whatsappMessages.set(id, updated);
    return updated;
  }

  // Processing Stats
  async getProcessingStats(): Promise<ProcessingStats | undefined> {
    return this.processingStats;
  }

  async updateProcessingStats(stats: Partial<ProcessingStats>): Promise<ProcessingStats> {
    this.processingStats = {
      ...this.processingStats!,
      ...stats,
      lastUpdated: new Date(),
    };
    return this.processingStats;
  }
}

export const storage = new MemStorage();
