import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Simple list of funny/smart demo responses if no image or no API key is provided
const DEMO_GROCERIES = [
  { productName: "Organic Gala Apples", price: 180.00, category: "Produce" },
  { productName: "Fresh Whole Milk 1L", price: 95.00, category: "Dairy" },
  { productName: "Artisanal Sourdough Bread", price: 145.00, category: "Bakery" },
  { productName: "Premium Salmon Fillet", price: 420.00, category: "Meat" },
  { productName: "Gluten-Free Oats 500g", price: 120.00, category: "Pantry" },
  { productName: "Greek Yogurt Honey", price: 85.00, category: "Dairy" },
  { productName: "Fresh Baby Spinach 200g", price: 110.00, category: "Produce" },
  { productName: "Chocolate Chip Cookies", price: 135.05, category: "Bakery" },
  { productName: "Prime Ribeye Steak", price: 799.99, category: "Meat" },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productImage, priceImage, productNameClue, priceClue } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    
    // Fallback if images are missing/mocked
    if (!productImage && !priceImage) {
      // Return a simulated high-quality response
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate loading shimmer
      
      // If the client provided a verbal name clue, use it to make a realistic response!
      if (productNameClue) {
        let matchedCategory = "Other";
        const lowerClue = productNameClue.toLowerCase();
        if (lowerClue.includes("apple") || lowerClue.includes("banana") || lowerClue.includes("spinach") || lowerClue.includes("salad") || lowerClue.includes("orange") || lowerClue.includes("pear") || lowerClue.includes("grape") || lowerClue.includes("tato")) {
          matchedCategory = "Produce";
        } else if (lowerClue.includes("milk") || lowerClue.includes("cheese") || lowerClue.includes("yogurt") || lowerClue.includes("butter") || lowerClue.includes("cream")) {
          matchedCategory = "Dairy";
        } else if (lowerClue.includes("bread") || lowerClue.includes("loaf") || lowerClue.includes("cookie") || lowerClue.includes("croissant") || lowerClue.includes("cake") || lowerClue.includes("bun")) {
          matchedCategory = "Bakery";
        } else if (lowerClue.includes("cereal") || lowerClue.includes("flour") || lowerClue.includes("pasta") || lowerClue.includes("rice") || lowerClue.includes("oil") || lowerClue.includes("sauce")) {
          matchedCategory = "Pantry";
        } else if (lowerClue.includes("steak") || lowerClue.includes("meat") || lowerClue.includes("pork") || lowerClue.includes("beef") || lowerClue.includes("chicken") || lowerClue.includes("salmon") || lowerClue.includes("fish")) {
          matchedCategory = "Meat";
        }
        
        let parsedPrice = parseFloat(priceClue) || 120.00;
        return NextResponse.json({
          productName: productNameClue,
          price: parsedPrice,
          category: matchedCategory,
          extractedVia: "mock_rule_based"
        });
      }

      // Pick random grocery item
      const index = Math.floor(Math.random() * DEMO_GROCERIES.length);
      return NextResponse.json({
        ...DEMO_GROCERIES[index],
        extractedVia: "mock_random"
      });
    }

    // Require API Key if we are doing a real scan
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured. Please add your Gemini API Key in the Secrets panel.");
    }

    // Initialize GoogleGenAI client (lazy initializer style)
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const parts: any[] = [];
    parts.push({
      text: "You are an expert grocery shopping assistant scanner. Examine the user-uploaded image(s) and extract the grocery product details. " +
            "1. Identify the product name from the product photo. If unclear, try to find text or guess. " +
            "2. Identify the pricing (numeric value) from the price tag photo or sticker. If not present in any photo, estimate a standard supermarket price. " +
            "3. Choose the most appropriate single category from: Produce, Dairy, Bakery, Pantry, Meat, Other." +
            (productNameClue ? ` Context hint for product: ${productNameClue}.` : "") +
            (priceClue ? ` Context hint for price: ${priceClue}.` : "")
    });

    if (productImage) {
      const cleanBase64 = productImage.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanBase64
        }
      });
    }

    if (priceImage) {
      const cleanBase64 = priceImage.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: {
              type: Type.STRING,
              description: "The name of the grocery item. Be descriptive (e.g., 'Gala Apples Mix', 'Whole Cream Milk')."
            },
            price: {
              type: Type.NUMBER,
              description: "The decimal price value of the grocery item parsed from the label."
            },
            category: {
              type: Type.STRING,
              description: "Exactly one category string: Produce, Dairy, Bakery, Pantry, Meat, or Other."
            }
          },
          required: ["productName", "price", "category"]
        }
      }
    });

    const textResult = response.text;
    if (!textResult) {
      throw new Error("No response output from Gemini API");
    }

    const parsed = JSON.parse(textResult.trim());
    return NextResponse.json({
      productName: parsed.productName || "",
      price: typeof parsed.price === "number" ? parsed.price : 0,
      category: ["Produce", "Dairy", "Bakery", "Pantry", "Meat", "Other"].includes(parsed.category) ? parsed.category : "Other",
      extractedVia: "gemini"
    });

  } catch (error: any) {
    console.error("Scanning API Error:", error);
    return NextResponse.json({
      error: error.message || "Failed to scan images",
      productName: "",
      price: 0,
      category: "Other",
      extractedVia: "error-fallback"
    }, { status: 200 }); // Return standard response with code 200 but error flagged so user gets items anyway
  }
}
