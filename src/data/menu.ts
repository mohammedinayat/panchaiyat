export type Diet = "veg" | "nonveg" | "beverage";
export type MenuItem = {
  name: string;
  price?: number;
  sizes?: { S: number; M: number; L: number };
  note?: string;
  diet: Diet;
  category: string;
};

export const categories = [
  "MOMOS",
  "BURGERS",
  "MAGGIE",
  "VEG PIZZA",
  "CHICKEN PIZZA",
  "FRIES & WRAPS",
  "QUICK BITES",
  "SHAKES & COFFEE",
] as const;

export const menu: MenuItem[] = [
  // MOMOS
  { name: "Chicken Steam", price: 80, diet: "nonveg", category: "MOMOS" },
  { name: "Chicken Fried", price: 100, diet: "nonveg", category: "MOMOS" },
  { name: "Chicken Kurkuro", price: 130, diet: "nonveg", category: "MOMOS" },
  { name: "Chicken Gravy", price: 130, diet: "nonveg", category: "MOMOS" },

  // BURGERS
  { name: "Veg Classic", price: 50, diet: "veg", category: "BURGERS" },
  { name: "Veg Cheesy", price: 70, diet: "veg", category: "BURGERS" },
  { name: "Veg BBQ", price: 60, diet: "veg", category: "BURGERS" },
  { name: "Chicken Cheesy BBQ", price: 80, note: "Double Cheese", diet: "nonveg", category: "BURGERS" },
  { name: "Chicken Classic", price: 80, diet: "nonveg", category: "BURGERS" },
  { name: "Chicken Cheesy", price: 100, diet: "nonveg", category: "BURGERS" },
  { name: "Chicken BBQ", price: 90, diet: "nonveg", category: "BURGERS" },
  { name: "Chicken Cheesy BBQ", price: 100, diet: "nonveg", category: "BURGERS" },
  { name: "Chicken Zinger", price: 100, diet: "nonveg", category: "BURGERS" },
  { name: "Chicken Cheesy Zinger", price: 120, diet: "nonveg", category: "BURGERS" },
  { name: "Chicken Zinger BBQ", price: 110, diet: "nonveg", category: "BURGERS" },
  { name: "Chicken Cheesy Zinger BBQ", price: 130, diet: "nonveg", category: "BURGERS" },

  // MAGGIE
  { name: "Plain Maggie", price: 30, diet: "veg", category: "MAGGIE" },
  { name: "Veg Maggie", price: 40, diet: "veg", category: "MAGGIE" },
  { name: "Veg Cheesy Maggie", price: 50, diet: "veg", category: "MAGGIE" },

  // VEG PIZZA
  { name: "Margherita", note: "Single Cheese", sizes: { S: 70, M: 130, L: 200 }, diet: "veg", category: "VEG PIZZA" },
  { name: "Margherita", note: "Double Cheese", sizes: { S: 90, M: 150, L: 220 }, diet: "veg", category: "VEG PIZZA" },
  { name: "Tomato & Corn", sizes: { S: 110, M: 180, L: 250 }, diet: "veg", category: "VEG PIZZA" },
  { name: "Simple Veg", note: "Onion, Capsicum, Corn", sizes: { S: 120, M: 190, L: 260 }, diet: "veg", category: "VEG PIZZA" },
  { name: "Supreme Veg", note: "Onion, Capsicum, Corn, Olive", sizes: { S: 130, M: 200, L: 270 }, diet: "veg", category: "VEG PIZZA" },
  { name: "Veg Kulhad", note: "Onion, Capsicum, Corn", price: 60, diet: "veg", category: "VEG PIZZA" },

  // CHICKEN PIZZA
  { name: "Delight Chicken", note: "Chicken Cubes", sizes: { S: 130, M: 200, L: 300 }, diet: "nonveg", category: "CHICKEN PIZZA" },
  { name: "Chicken & Corn", note: "Capsicum, Corn, Chicken Cubes", sizes: { S: 140, M: 220, L: 320 }, diet: "nonveg", category: "CHICKEN PIZZA" },
  { name: "Tandoori Chicken", note: "Onion, Capsicum, Tomato, Chicken Cubes", sizes: { S: 150, M: 230, L: 330 }, diet: "nonveg", category: "CHICKEN PIZZA" },
  { name: "BBQ Chicken", note: "Onion, Olive, Chicken Cubes", sizes: { S: 160, M: 240, L: 340 }, diet: "nonveg", category: "CHICKEN PIZZA" },
  { name: "Supreme Chicken", note: "Capsicum, Corn, Olive, Chicken Cubes", sizes: { S: 170, M: 250, L: 350 }, diet: "nonveg", category: "CHICKEN PIZZA" },
  { name: "Chicken Kulhad", note: "Onion, Capsicum, Corn, Chicken Cubes", price: 80, diet: "nonveg", category: "CHICKEN PIZZA" },

  // FRIES & WRAPS
  { name: "Salted Fries", price: 60, diet: "veg", category: "FRIES & WRAPS" },
  { name: "Peri Peri Fries", price: 80, diet: "veg", category: "FRIES & WRAPS" },
  { name: "Cheesy Fries", price: 100, diet: "veg", category: "FRIES & WRAPS" },
  { name: "Cheesy Chicken Loaded Fries", price: 140, diet: "nonveg", category: "FRIES & WRAPS" },
  { name: "Veg Wrap", price: 60, diet: "veg", category: "FRIES & WRAPS" },
  { name: "Chicken Wrap", price: 100, diet: "nonveg", category: "FRIES & WRAPS" },

  // QUICK BITES
  { name: "Chicken Nuggets", note: "8 pcs", price: 100, diet: "nonveg", category: "QUICK BITES" },
  { name: "Cheesy Chicken Nuggets", note: "8 pcs", price: 120, diet: "nonveg", category: "QUICK BITES" },
  { name: "Chicken Popcorn", note: "14 pcs", price: 100, diet: "nonveg", category: "QUICK BITES" },
  { name: "Cheesy Chicken Popcorn", note: "14 pcs", price: 120, diet: "nonveg", category: "QUICK BITES" },

  // SHAKES & COFFEE
  { name: "Cold Coffee", price: 70, diet: "beverage", category: "SHAKES & COFFEE" },
  { name: "Chocolate Shake", price: 70, diet: "beverage", category: "SHAKES & COFFEE" },
  { name: "Oreo Shake", price: 70, diet: "beverage", category: "SHAKES & COFFEE" },
  { name: "KitKat Shake", price: 80, diet: "beverage", category: "SHAKES & COFFEE" },
  { name: "Strawberry Shake", price: 80, diet: "beverage", category: "SHAKES & COFFEE" },
  { name: "Butterscotch Shake", price: 80, diet: "beverage", category: "SHAKES & COFFEE" },
];

export const PHONE = "+91 9891025223";
export const PHONE_TEL = "+919891025223";
export const INSTAGRAM = "panchaiyat.cafe.kitchen";
export const ZOMATO_URL = "https://www.zomato.com/";
export const ADDRESS = "R-56/1, Ground Floor Back Side, Joga Bai, Qadri Masjid, New Delhi - 25";
export const HOURS = "Open Daily: 4 PM – 4 AM";
