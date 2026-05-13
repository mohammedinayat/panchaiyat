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
  { name: "Chicken Steam Momos", price: 80, diet: "nonveg", category: "MOMOS" },
  { name: "Chicken Fried Momos", price: 100, diet: "nonveg", category: "MOMOS" },
  { name: "Chicken Steam Cheese Momos", price: 100, diet: "nonveg", category: "MOMOS" },
  { name: "Chicken Fried Cheese Momos", price: 120, diet: "nonveg", category: "MOMOS" },

  // BURGERS
  { name: "Veg Classic Burger", price: 50, diet: "veg", category: "BURGERS" },
  { name: "Veg Cheesy Burger", price: 70, diet: "veg", category: "BURGERS" },
  { name: "Veg BBQ Burger", price: 60, diet: "veg", category: "BURGERS" },
  { name: "Chicken Classic Burger", price: 80, diet: "nonveg", category: "BURGERS" },
  { name: "Chicken Cheesy Burger", price: 100, diet: "nonveg", category: "BURGERS" },
  { name: "Chicken BBQ Burger", price: 90, diet: "nonveg", category: "BURGERS" },
  { name: "Chicken Cheesy BBQ Burger", price: 110, diet: "nonveg", category: "BURGERS" },
  { name: "Chicken Zinger Burger", price: 100, diet: "nonveg", category: "BURGERS" },
  { name: "Chicken Cheesy Zinger Burger", price: 120, diet: "nonveg", category: "BURGERS" },
  { name: "Chicken Zinger BBQ Burger", price: 110, diet: "nonveg", category: "BURGERS" },
  { name: "Chicken Cheesy Zinger BBQ Burger", price: 130, diet: "nonveg", category: "BURGERS" },

  // MAGGIE
  { name: "Plain Maggie", price: 30, diet: "veg", category: "MAGGIE" },
  { name: "Veg Maggie", price: 40, diet: "veg", category: "MAGGIE" },
  { name: "Veg Cheesy Maggie", price: 50, diet: "veg", category: "MAGGIE" },

  // VEG PIZZA
  { name: "Margherita Pizza", note: "Single Cheese", sizes: { S: 70, M: 130, L: 200 }, diet: "veg", category: "VEG PIZZA" },
  { name: "Margherita Pizza", note: "Double Cheese", sizes: { S: 90, M: 150, L: 220 }, diet: "veg", category: "VEG PIZZA" },
  { name: "Tomato & Corn Pizza", sizes: { S: 110, M: 180, L: 250 }, diet: "veg", category: "VEG PIZZA" },
  { name: "Simple Veg Pizza", note: "Onion, Capsicum, Corn", sizes: { S: 120, M: 190, L: 260 }, diet: "veg", category: "VEG PIZZA" },
  { name: "Supreme Veg Pizza", note: "Onion, Capsicum, Corn, Olive", sizes: { S: 130, M: 200, L: 270 }, diet: "veg", category: "VEG PIZZA" },

  // CHICKEN PIZZA
  { name: "Delight Chicken Pizza", note: "Chicken Cubes", sizes: { S: 130, M: 200, L: 300 }, diet: "nonveg", category: "CHICKEN PIZZA" },
  { name: "Chicken & Corn Pizza", note: "Capsicum, Corn, Chicken Cubes", sizes: { S: 140, M: 220, L: 320 }, diet: "nonveg", category: "CHICKEN PIZZA" },
  { name: "Tandoori Chicken Pizza", note: "Onion, Capsicum, Tomato, Chicken Cubes", sizes: { S: 150, M: 230, L: 330 }, diet: "nonveg", category: "CHICKEN PIZZA" },
  { name: "BBQ Chicken Pizza", note: "Onion, Olive, Chicken Cubes", sizes: { S: 160, M: 240, L: 340 }, diet: "nonveg", category: "CHICKEN PIZZA" },
  { name: "Supreme Chicken Pizza", note: "Capsicum, Corn, Olive, Chicken Cubes", sizes: { S: 170, M: 250, L: 350 }, diet: "nonveg", category: "CHICKEN PIZZA" },

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
