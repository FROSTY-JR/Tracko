import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { insertSupplierSchema, insertDeliverySchema, insertDocumentSchema, insertWhatsappMessageSchema } from "@shared/schema";

// Extend Request interface to include file property
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Dashboard stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getProcessingStats();
      if (!stats) {
        return res.status(404).json({ message: "Stats not found" });
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Suppliers
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  app.get("/api/suppliers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const supplier = await storage.getSupplier(id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supplier" });
    }
  });

  app.post("/api/suppliers", async (req, res) => {
    try {
      const validatedData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(validatedData);
      res.status(201).json(supplier);
    } catch (error) {
      res.status(400).json({ message: "Invalid supplier data" });
    }
  });

  app.put("/api/suppliers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSupplierSchema.partial().parse(req.body);
      const supplier = await storage.updateSupplier(id, validatedData);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      res.status(400).json({ message: "Invalid supplier data" });
    }
  });

  app.delete("/api/suppliers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSupplier(id);
      if (!deleted) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete supplier" });
    }
  });

  // Deliveries
  app.get("/api/deliveries", async (req, res) => {
    try {
      const deliveries = await storage.getDeliveries();
      res.json(deliveries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deliveries" });
    }
  });

  app.get("/api/deliveries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const delivery = await storage.getDelivery(id);
      if (!delivery) {
        return res.status(404).json({ message: "Delivery not found" });
      }
      res.json(delivery);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch delivery" });
    }
  });

  app.post("/api/deliveries", async (req, res) => {
    try {
      const validatedData = insertDeliverySchema.parse(req.body);
      const delivery = await storage.createDelivery(validatedData);
      res.status(201).json(delivery);
    } catch (error) {
      res.status(400).json({ message: "Invalid delivery data" });
    }
  });

  app.put("/api/deliveries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertDeliverySchema.partial().parse(req.body);
      const delivery = await storage.updateDelivery(id, validatedData);
      if (!delivery) {
        return res.status(404).json({ message: "Delivery not found" });
      }
      res.json(delivery);
    } catch (error) {
      res.status(400).json({ message: "Invalid delivery data" });
    }
  });

  app.delete("/api/deliveries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteDelivery(id);
      if (!deleted) {
        return res.status(404).json({ message: "Delivery not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete delivery" });
    }
  });

  // Documents
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents/upload", upload.single('file'), async (req: MulterRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const document = await storage.createDocument({
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        filePath: req.file.path,
        documentType: req.body.documentType || "invoice",
        processingStatus: "processing",
        extractedText: null,
        extractedData: null,
        confidence: null,
        deliveryId: req.body.deliveryId ? parseInt(req.body.deliveryId) : null,
      });

      // Simulate OCR processing
      setTimeout(async () => {
        try {
          const extractedData = {
            supplier: "Mock Supplier",
            amount: "50000.00",
            date: new Date().toISOString(),
            items: ["Raw materials", "Processing fee"],
          };

          await storage.updateDocument(document.id, {
            processingStatus: "completed",
            extractedText: "Mock extracted text from OCR",
            extractedData: extractedData,
            confidence: "0.95",
          });
        } catch (error) {
          await storage.updateDocument(document.id, {
            processingStatus: "error",
          });
        }
      }, 2000);

      res.status(201).json(document);
    } catch (error) {
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  // WhatsApp Messages
  app.get("/api/whatsapp-messages", async (req, res) => {
    try {
      const messages = await storage.getWhatsappMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/whatsapp-messages", async (req, res) => {
    try {
      const validatedData = insertWhatsappMessageSchema.parse(req.body);
      const message = await storage.createWhatsappMessage(validatedData);
      
      // Simulate message processing
      setTimeout(async () => {
        try {
          const extractedData = {
            supplier: validatedData.senderName,
            material: "Auto-detected material",
            quantity: "Auto-detected quantity",
            status: "delivered",
            confidence: 0.9,
          };

          await storage.updateWhatsappMessage(message.id, {
            processingStatus: "completed",
            extractedData: extractedData,
            confidence: "0.90",
          });
        } catch (error) {
          await storage.updateWhatsappMessage(message.id, {
            processingStatus: "error",
          });
        }
      }, 1000);

      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  // WhatsApp webhook (mock endpoint)
  app.post("/api/webhook/whatsapp", async (req, res) => {
    try {
      const { sender, message } = req.body;
      
      if (!sender || !message) {
        return res.status(400).json({ message: "Invalid webhook data" });
      }

      const whatsappMessage = await storage.createWhatsappMessage({
        senderId: sender.id,
        senderName: sender.name,
        message: message.text,
        processingStatus: "processing",
        extractedData: null,
        confidence: null,
        deliveryId: null,
      });

      res.json({ success: true, messageId: whatsappMessage.id });
    } catch (error) {
      res.status(500).json({ message: "Failed to process webhook" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
