import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const dbUrl = process.env.DATABASE_URL!;

async function createPrisma(): Promise<PrismaClient> {
  if (dbUrl.startsWith("file:")) {
    const { PrismaBetterSqlite3 } = await import("@prisma/adapter-better-sqlite3");
    return new PrismaClient({
      adapter: new PrismaBetterSqlite3({ url: dbUrl.replace(/^file:/, "") }),
    });
  }
  const { PrismaNeon } = await import("@prisma/adapter-neon");
  return new PrismaClient({
    adapter: new PrismaNeon({ connectionString: dbUrl }),
  });
}

interface FoodSeed {
  name: string;
  category: string;
  region: string;
  caloriesPerUnit: number;
  unitName: string;
  servingSizes: { label: string; multiplier: number }[];
}

const foods: FoodSeed[] = [
  // ===== SOUTH INDIAN BREAKFAST =====
  { name: "Idli", category: "breakfast", region: "south_indian", caloriesPerUnit: 70, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }, { label: "3 pieces", multiplier: 3 }, { label: "4 pieces", multiplier: 4 }] },
  { name: "Rava Idli", category: "breakfast", region: "south_indian", caloriesPerUnit: 90, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }, { label: "3 pieces", multiplier: 3 }] },
  { name: "Plain Dosa", category: "breakfast", region: "south_indian", caloriesPerUnit: 130, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Masala Dosa", category: "breakfast", region: "south_indian", caloriesPerUnit: 250, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Rava Dosa", category: "breakfast", region: "south_indian", caloriesPerUnit: 180, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Set Dosa", category: "breakfast", region: "south_indian", caloriesPerUnit: 100, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }, { label: "3 pieces", multiplier: 3 }] },
  { name: "Medu Vada", category: "breakfast", region: "south_indian", caloriesPerUnit: 100, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }, { label: "3 pieces", multiplier: 3 }] },
  { name: "Uttapam", category: "breakfast", region: "south_indian", caloriesPerUnit: 180, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Onion Uttapam", category: "breakfast", region: "south_indian", caloriesPerUnit: 200, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Pongal", category: "breakfast", region: "south_indian", caloriesPerUnit: 250, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Upma", category: "breakfast", region: "south_indian", caloriesPerUnit: 200, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Pesarattu", category: "breakfast", region: "south_indian", caloriesPerUnit: 200, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Appam", category: "breakfast", region: "south_indian", caloriesPerUnit: 120, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }, { label: "3 pieces", multiplier: 3 }] },
  { name: "Puttu", category: "breakfast", region: "south_indian", caloriesPerUnit: 180, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },

  // ===== NORTH INDIAN BREAKFAST =====
  { name: "Aloo Paratha", category: "breakfast", region: "north_indian", caloriesPerUnit: 250, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Gobi Paratha", category: "breakfast", region: "north_indian", caloriesPerUnit: 230, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Paneer Paratha", category: "breakfast", region: "north_indian", caloriesPerUnit: 300, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Plain Paratha", category: "breakfast", region: "north_indian", caloriesPerUnit: 180, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },

  // ===== BREADS =====
  { name: "Chapati / Roti", category: "bread", region: "general", caloriesPerUnit: 70, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }, { label: "3 pieces", multiplier: 3 }, { label: "4 pieces", multiplier: 4 }] },
  { name: "Phulka (no ghee)", category: "bread", region: "general", caloriesPerUnit: 60, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }, { label: "3 pieces", multiplier: 3 }, { label: "4 pieces", multiplier: 4 }] },
  { name: "Naan", category: "bread", region: "north_indian", caloriesPerUnit: 250, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Butter Naan", category: "bread", region: "north_indian", caloriesPerUnit: 320, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Tandoori Roti", category: "bread", region: "north_indian", caloriesPerUnit: 120, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Puri", category: "bread", region: "general", caloriesPerUnit: 100, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }, { label: "3 pieces", multiplier: 3 }] },

  // ===== RICE =====
  { name: "White Rice", category: "rice", region: "general", caloriesPerUnit: 200, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }, { label: "1 cup (cooked)", multiplier: 1 }] },
  { name: "Brown Rice", category: "rice", region: "general", caloriesPerUnit: 180, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Jeera Rice", category: "rice", region: "north_indian", caloriesPerUnit: 220, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Lemon Rice", category: "rice", region: "south_indian", caloriesPerUnit: 230, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Tamarind Rice", category: "rice", region: "south_indian", caloriesPerUnit: 250, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Curd Rice", category: "rice", region: "south_indian", caloriesPerUnit: 220, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Sambar Rice", category: "rice", region: "south_indian", caloriesPerUnit: 280, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Bisibele Bath", category: "rice", region: "south_indian", caloriesPerUnit: 300, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Tomato Rice", category: "rice", region: "south_indian", caloriesPerUnit: 240, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Coconut Rice", category: "rice", region: "south_indian", caloriesPerUnit: 280, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Biryani (Chicken)", category: "rice", region: "general", caloriesPerUnit: 400, unitName: "plate", servingSizes: [{ label: "1 small plate", multiplier: 0.75 }, { label: "1 plate", multiplier: 1 }, { label: "1 large plate", multiplier: 1.5 }] },
  { name: "Biryani (Vegetable)", category: "rice", region: "general", caloriesPerUnit: 320, unitName: "plate", servingSizes: [{ label: "1 small plate", multiplier: 0.75 }, { label: "1 plate", multiplier: 1 }, { label: "1 large plate", multiplier: 1.5 }] },
  { name: "Pulao", category: "rice", region: "general", caloriesPerUnit: 280, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Ghee Rice", category: "rice", region: "south_indian", caloriesPerUnit: 300, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },

  // ===== DAL / LENTILS =====
  { name: "Toor Dal", category: "dal", region: "general", caloriesPerUnit: 150, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Moong Dal", category: "dal", region: "general", caloriesPerUnit: 130, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Masoor Dal", category: "dal", region: "general", caloriesPerUnit: 140, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Dal Makhani", category: "dal", region: "north_indian", caloriesPerUnit: 280, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Dal Fry", category: "dal", region: "general", caloriesPerUnit: 180, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Sambar", category: "dal", region: "south_indian", caloriesPerUnit: 120, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Rasam", category: "dal", region: "south_indian", caloriesPerUnit: 60, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },

  // ===== CURRIES - VEG =====
  { name: "Paneer Butter Masala", category: "curry", region: "north_indian", caloriesPerUnit: 350, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Palak Paneer", category: "curry", region: "north_indian", caloriesPerUnit: 280, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Matar Paneer", category: "curry", region: "north_indian", caloriesPerUnit: 300, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Kadai Paneer", category: "curry", region: "north_indian", caloriesPerUnit: 320, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Shahi Paneer", category: "curry", region: "north_indian", caloriesPerUnit: 380, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Aloo Gobi", category: "curry", region: "north_indian", caloriesPerUnit: 180, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Aloo Matar", category: "curry", region: "north_indian", caloriesPerUnit: 200, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Chole (Chickpea Curry)", category: "curry", region: "north_indian", caloriesPerUnit: 250, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Rajma", category: "curry", region: "north_indian", caloriesPerUnit: 240, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Baingan Bharta", category: "curry", region: "north_indian", caloriesPerUnit: 160, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Bhindi Masala", category: "curry", region: "general", caloriesPerUnit: 180, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Mixed Vegetable Curry", category: "curry", region: "general", caloriesPerUnit: 170, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Malai Kofta", category: "curry", region: "north_indian", caloriesPerUnit: 350, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Dum Aloo", category: "curry", region: "north_indian", caloriesPerUnit: 260, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },

  // ===== CURRIES - SOUTH INDIAN =====
  { name: "Avial", category: "curry", region: "south_indian", caloriesPerUnit: 150, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Kootu", category: "curry", region: "south_indian", caloriesPerUnit: 160, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Poriyal (Stir-fried Vegetables)", category: "curry", region: "south_indian", caloriesPerUnit: 120, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Cabbage Poriyal", category: "curry", region: "south_indian", caloriesPerUnit: 110, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Beans Poriyal", category: "curry", region: "south_indian", caloriesPerUnit: 120, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Potato Fry (Urulai Roast)", category: "curry", region: "south_indian", caloriesPerUnit: 200, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Chettinad Vegetable Curry", category: "curry", region: "south_indian", caloriesPerUnit: 220, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },

  // ===== CURRIES - NON-VEG =====
  { name: "Butter Chicken", category: "curry", region: "north_indian", caloriesPerUnit: 380, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Chicken Curry", category: "curry", region: "general", caloriesPerUnit: 280, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Chicken Tikka Masala", category: "curry", region: "north_indian", caloriesPerUnit: 350, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Andhra Chicken Curry", category: "curry", region: "south_indian", caloriesPerUnit: 320, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Mutton Curry", category: "curry", region: "general", caloriesPerUnit: 350, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Fish Curry (Meen Kulambu)", category: "curry", region: "south_indian", caloriesPerUnit: 220, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Egg Curry", category: "curry", region: "general", caloriesPerUnit: 200, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },

  // ===== SIDES & CHUTNEYS =====
  { name: "Coconut Chutney", category: "side", region: "south_indian", caloriesPerUnit: 60, unitName: "tbsp", servingSizes: [{ label: "2 tbsp", multiplier: 1 }, { label: "3 tbsp", multiplier: 1.5 }, { label: "4 tbsp", multiplier: 2 }] },
  { name: "Tomato Chutney", category: "side", region: "south_indian", caloriesPerUnit: 40, unitName: "tbsp", servingSizes: [{ label: "2 tbsp", multiplier: 1 }, { label: "3 tbsp", multiplier: 1.5 }] },
  { name: "Peanut Chutney", category: "side", region: "south_indian", caloriesPerUnit: 80, unitName: "tbsp", servingSizes: [{ label: "2 tbsp", multiplier: 1 }, { label: "3 tbsp", multiplier: 1.5 }] },
  { name: "Mint Chutney", category: "side", region: "general", caloriesPerUnit: 25, unitName: "tbsp", servingSizes: [{ label: "1 tbsp", multiplier: 1 }, { label: "2 tbsp", multiplier: 2 }] },
  { name: "Raita", category: "side", region: "general", caloriesPerUnit: 80, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Papad", category: "side", region: "general", caloriesPerUnit: 50, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Pickle (Achar)", category: "side", region: "general", caloriesPerUnit: 25, unitName: "tsp", servingSizes: [{ label: "1 tsp", multiplier: 1 }, { label: "2 tsp", multiplier: 2 }] },
  { name: "Dahi / Curd", category: "side", region: "general", caloriesPerUnit: 80, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Buttermilk / Chaas", category: "side", region: "general", caloriesPerUnit: 40, unitName: "glass", servingSizes: [{ label: "1 glass", multiplier: 1 }, { label: "2 glasses", multiplier: 2 }] },

  // ===== SNACKS =====
  { name: "Samosa", category: "snack", region: "general", caloriesPerUnit: 150, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Pakora / Bajji", category: "snack", region: "general", caloriesPerUnit: 100, unitName: "piece", servingSizes: [{ label: "2 pieces", multiplier: 2 }, { label: "4 pieces", multiplier: 4 }] },
  { name: "Onion Pakora", category: "snack", region: "general", caloriesPerUnit: 80, unitName: "piece", servingSizes: [{ label: "2 pieces", multiplier: 2 }, { label: "4 pieces", multiplier: 4 }, { label: "6 pieces", multiplier: 6 }] },
  { name: "Murukku", category: "snack", region: "south_indian", caloriesPerUnit: 50, unitName: "piece", servingSizes: [{ label: "2 pieces", multiplier: 2 }, { label: "4 pieces", multiplier: 4 }] },
  { name: "Banana Chips", category: "snack", region: "south_indian", caloriesPerUnit: 160, unitName: "handful", servingSizes: [{ label: "1 small handful", multiplier: 0.75 }, { label: "1 handful", multiplier: 1 }] },
  { name: "Bhel Puri", category: "snack", region: "general", caloriesPerUnit: 200, unitName: "plate", servingSizes: [{ label: "1 small plate", multiplier: 0.75 }, { label: "1 plate", multiplier: 1 }] },
  { name: "Pani Puri", category: "snack", region: "general", caloriesPerUnit: 35, unitName: "piece", servingSizes: [{ label: "4 pieces", multiplier: 4 }, { label: "6 pieces", multiplier: 6 }, { label: "8 pieces", multiplier: 8 }] },
  { name: "Dhokla", category: "snack", region: "general", caloriesPerUnit: 100, unitName: "piece", servingSizes: [{ label: "2 pieces", multiplier: 2 }, { label: "4 pieces", multiplier: 4 }] },
  { name: "Vada Pav", category: "snack", region: "general", caloriesPerUnit: 280, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },

  // ===== DRINKS =====
  { name: "Chai (with milk & sugar)", category: "drink", region: "general", caloriesPerUnit: 80, unitName: "cup", servingSizes: [{ label: "1 cup", multiplier: 1 }, { label: "2 cups", multiplier: 2 }] },
  { name: "Chai (without sugar)", category: "drink", region: "general", caloriesPerUnit: 40, unitName: "cup", servingSizes: [{ label: "1 cup", multiplier: 1 }, { label: "2 cups", multiplier: 2 }] },
  { name: "Filter Coffee (with milk & sugar)", category: "drink", region: "south_indian", caloriesPerUnit: 90, unitName: "cup", servingSizes: [{ label: "1 cup", multiplier: 1 }, { label: "2 cups", multiplier: 2 }] },
  { name: "Filter Coffee (without sugar)", category: "drink", region: "south_indian", caloriesPerUnit: 50, unitName: "cup", servingSizes: [{ label: "1 cup", multiplier: 1 }, { label: "2 cups", multiplier: 2 }] },
  { name: "Masala Chai", category: "drink", region: "general", caloriesPerUnit: 100, unitName: "cup", servingSizes: [{ label: "1 cup", multiplier: 1 }, { label: "2 cups", multiplier: 2 }] },
  { name: "Lassi (Sweet)", category: "drink", region: "north_indian", caloriesPerUnit: 200, unitName: "glass", servingSizes: [{ label: "1 glass", multiplier: 1 }] },
  { name: "Lassi (Salty)", category: "drink", region: "north_indian", caloriesPerUnit: 120, unitName: "glass", servingSizes: [{ label: "1 glass", multiplier: 1 }] },
  { name: "Coconut Water", category: "drink", region: "south_indian", caloriesPerUnit: 60, unitName: "glass", servingSizes: [{ label: "1 glass", multiplier: 1 }, { label: "2 glasses", multiplier: 2 }] },
  { name: "Nimbu Pani / Lemonade", category: "drink", region: "general", caloriesPerUnit: 60, unitName: "glass", servingSizes: [{ label: "1 glass", multiplier: 1 }, { label: "2 glasses", multiplier: 2 }] },

  // ===== SWEETS / DESSERTS =====
  { name: "Gulab Jamun", category: "sweet", region: "general", caloriesPerUnit: 150, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Rasgulla", category: "sweet", region: "general", caloriesPerUnit: 120, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Jalebi", category: "sweet", region: "general", caloriesPerUnit: 150, unitName: "piece", servingSizes: [{ label: "2 pieces", multiplier: 2 }, { label: "4 pieces", multiplier: 4 }] },
  { name: "Kheer / Payasam", category: "sweet", region: "general", caloriesPerUnit: 250, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Mysore Pak", category: "sweet", region: "south_indian", caloriesPerUnit: 200, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Laddu", category: "sweet", region: "general", caloriesPerUnit: 180, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Halwa", category: "sweet", region: "general", caloriesPerUnit: 200, unitName: "piece", servingSizes: [{ label: "1 small piece", multiplier: 0.75 }, { label: "1 piece", multiplier: 1 }] },

  // ===== EGG & NON-VEG ITEMS =====
  { name: "Boiled Egg", category: "nonveg", region: "general", caloriesPerUnit: 75, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }, { label: "3 pieces", multiplier: 3 }] },
  { name: "Omelette (2 eggs)", category: "nonveg", region: "general", caloriesPerUnit: 190, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }] },
  { name: "Egg Bhurji", category: "nonveg", region: "general", caloriesPerUnit: 200, unitName: "plate", servingSizes: [{ label: "1 plate", multiplier: 1 }] },
  { name: "Chicken 65", category: "nonveg", region: "south_indian", caloriesPerUnit: 250, unitName: "plate", servingSizes: [{ label: "1 small plate", multiplier: 0.75 }, { label: "1 plate", multiplier: 1 }] },
  { name: "Tandoori Chicken (leg)", category: "nonveg", region: "north_indian", caloriesPerUnit: 250, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Chicken Tikka", category: "nonveg", region: "north_indian", caloriesPerUnit: 150, unitName: "piece", servingSizes: [{ label: "4 pieces", multiplier: 4 }, { label: "6 pieces", multiplier: 6 }] },
  { name: "Fish Fry", category: "nonveg", region: "general", caloriesPerUnit: 200, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Prawn Fry", category: "nonveg", region: "general", caloriesPerUnit: 200, unitName: "plate", servingSizes: [{ label: "1 small plate", multiplier: 0.75 }, { label: "1 plate", multiplier: 1 }] },

  // ===== FRUITS =====
  { name: "Banana", category: "fruit", region: "general", caloriesPerUnit: 105, unitName: "piece", servingSizes: [{ label: "1 small", multiplier: 0.75 }, { label: "1 medium", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Apple", category: "fruit", region: "general", caloriesPerUnit: 95, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }] },
  { name: "Orange", category: "fruit", region: "general", caloriesPerUnit: 60, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Mango", category: "fruit", region: "general", caloriesPerUnit: 150, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }] },
  { name: "Papaya", category: "fruit", region: "general", caloriesPerUnit: 80, unitName: "bowl", servingSizes: [{ label: "1 bowl", multiplier: 1 }] },
  { name: "Watermelon", category: "fruit", region: "general", caloriesPerUnit: 70, unitName: "bowl", servingSizes: [{ label: "1 bowl", multiplier: 1 }, { label: "2 bowls", multiplier: 2 }] },
  { name: "Grapes", category: "fruit", region: "general", caloriesPerUnit: 70, unitName: "handful", servingSizes: [{ label: "1 handful", multiplier: 1 }, { label: "2 handfuls", multiplier: 2 }] },
  { name: "Pomegranate", category: "fruit", region: "general", caloriesPerUnit: 80, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Guava", category: "fruit", region: "general", caloriesPerUnit: 40, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Sapota / Chikoo", category: "fruit", region: "general", caloriesPerUnit: 80, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },

  // ===== MISC =====
  { name: "Poha", category: "breakfast", region: "general", caloriesPerUnit: 220, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }, { label: "1 large bowl", multiplier: 1.5 }] },
  { name: "Sabudana Khichdi", category: "breakfast", region: "general", caloriesPerUnit: 280, unitName: "bowl", servingSizes: [{ label: "1 small bowl", multiplier: 0.75 }, { label: "1 bowl", multiplier: 1 }] },
  { name: "Thepla", category: "breakfast", region: "general", caloriesPerUnit: 100, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }, { label: "3 pieces", multiplier: 3 }] },
  { name: "Khakhra", category: "snack", region: "general", caloriesPerUnit: 60, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Bread (white slice)", category: "bread", region: "general", caloriesPerUnit: 70, unitName: "slice", servingSizes: [{ label: "1 slice", multiplier: 1 }, { label: "2 slices", multiplier: 2 }] },
  { name: "Bread (brown slice)", category: "bread", region: "general", caloriesPerUnit: 65, unitName: "slice", servingSizes: [{ label: "1 slice", multiplier: 1 }, { label: "2 slices", multiplier: 2 }] },
  { name: "Sandwich (vegetable)", category: "snack", region: "general", caloriesPerUnit: 250, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }, { label: "2 pieces", multiplier: 2 }] },
  { name: "Maggi / Instant Noodles", category: "snack", region: "general", caloriesPerUnit: 310, unitName: "plate", servingSizes: [{ label: "1 plate", multiplier: 1 }] },
  { name: "Biscuit (Marie / Digestive)", category: "snack", region: "general", caloriesPerUnit: 30, unitName: "piece", servingSizes: [{ label: "2 pieces", multiplier: 2 }, { label: "4 pieces", multiplier: 4 }] },
  { name: "Peanuts (roasted)", category: "snack", region: "general", caloriesPerUnit: 160, unitName: "handful", servingSizes: [{ label: "1 small handful", multiplier: 0.75 }, { label: "1 handful", multiplier: 1 }] },
  { name: "Cashew Nuts", category: "snack", region: "general", caloriesPerUnit: 160, unitName: "handful", servingSizes: [{ label: "1 small handful (10 pcs)", multiplier: 0.75 }, { label: "1 handful", multiplier: 1 }] },
  { name: "Almonds", category: "snack", region: "general", caloriesPerUnit: 70, unitName: "pieces", servingSizes: [{ label: "5 pieces", multiplier: 1 }, { label: "10 pieces", multiplier: 2 }] },
  { name: "Dark Chocolate", category: "snack", region: "general", caloriesPerUnit: 130, unitName: "piece", servingSizes: [{ label: "1 small piece (20g)", multiplier: 1 }, { label: "2 pieces (40g)", multiplier: 2 }] },
  { name: "Protein Bar", category: "snack", region: "general", caloriesPerUnit: 220, unitName: "piece", servingSizes: [{ label: "1 piece", multiplier: 1 }] },
];

async function main() {
  const prisma = await createPrisma();
  console.log("Seeding database...");

  // Upsert foods (name no longer unique, check first)
  for (const food of foods) {
    const existing = await prisma.food.findFirst({ where: { name: food.name, userId: null } });
    if (!existing) {
      await prisma.food.create({
        data: {
          name: food.name,
          category: food.category,
          region: food.region,
          caloriesPerUnit: food.caloriesPerUnit,
          unitName: food.unitName,
          servingSizes: JSON.stringify(food.servingSizes),
          isCommon: ["breakfast", "rice", "bread", "dal", "curry", "fruit"].includes(food.category),
        },
      });
    }
  }

  // Create default settings if not exists (seed user for legacy)
  const seedUser = await prisma.user.upsert({
    where: { googleId: "seed" },
    update: {},
    create: {
      googleId: "seed",
      email: "seed@example.com",
      name: "Seed User",
    },
  });
  await prisma.settings.upsert({
    where: { id: seedUser.id },
    update: {},
    create: { id: seedUser.id, userId: seedUser.id, dailyCalorieGoal: 2000 },
  });

  console.log(`Seeded ${foods.length} foods.`);
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
