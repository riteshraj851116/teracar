import Car from "../models/Car.js";

export const initialCars = [
  {
    title: "Rolls-Royce Ghost Extended",
    brand: "Rolls-Royce",
    model: "Ghost Extended",
    year: 2024,
    category: "Luxury",
    seating_capacity: 4,
    fuel_type: "6.75L Twin-Turbo V12",
    transmission: "8-Speed Automatic",
    pricePerDay: 1800,
    location: "Miami Beach / Port Hub",
    description: "The epitome of bespoke luxury mobility. Handcrafted leather interior, Starlight headliner, and whisper-quiet effortless acceleration.",
    image: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?q=80&w=1200&auto=format&fit=crop",
    isAvaliable: true,
  },
  {
    title: "Porsche 911 GT3 RS",
    brand: "Porsche",
    model: "911 GT3 RS",
    year: 2024,
    category: "Supercar",
    seating_capacity: 2,
    fuel_type: "4.0L Naturally Aspirated Boxer-6",
    transmission: "7-Speed PDK Dual-Clutch",
    pricePerDay: 1450,
    location: "Los Angeles / Beverly Hills",
    description: "Aerodynamic mastery engineered for the track and highway. Active DRS wing, carbon bucket seats, and breathtaking 9,000 RPM redline.",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop",
    isAvaliable: true,
  },
  {
    title: "Ferrari F8 Tributo",
    brand: "Ferrari",
    model: "F8 Tributo",
    year: 2023,
    category: "Supercar",
    seating_capacity: 2,
    fuel_type: "3.9L Twin-Turbo V8",
    transmission: "7-Speed Dual-Clutch",
    pricePerDay: 1650,
    location: "Miami / Downtown Hub",
    description: "710 horsepower of pure Maranello performance. Carbon-fiber accents, razor-sharp steering dynamics, and unmistakable acoustic roar.",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop",
    isAvaliable: true,
  },
  {
    title: "Lamborghini Urus Performante",
    brand: "Lamborghini",
    model: "Urus Performante",
    year: 2024,
    category: "SUV",
    seating_capacity: 5,
    fuel_type: "4.0L Twin-Turbo V8",
    transmission: "8-Speed Automatic",
    pricePerDay: 1200,
    location: "New York / Manhattan",
    description: "The benchmark super-SUV. Aggressive carbon aero, all-wheel drive stability, and blistering supercar acceleration for five passengers.",
    image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1200&auto=format&fit=crop",
    isAvaliable: true,
  },
  {
    title: "Mercedes-AMG G 63 Magno Edition",
    brand: "Mercedes-Benz",
    model: "G 63 AMG",
    year: 2023,
    category: "SUV",
    seating_capacity: 5,
    fuel_type: "4.0L Biturbo V8",
    transmission: "9-Speed Speedshift",
    pricePerDay: 1100,
    location: "Chicago / Gold Coast",
    description: "Iconic military-grade luxury road presence. Side-exit sport exhausts, Burmester 3D surround sound, and legendary triple-locking differentials.",
    image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1200&auto=format&fit=crop",
    isAvaliable: true,
  },
  {
    title: "Lucid Air Sapphire",
    brand: "Lucid",
    model: "Air Sapphire",
    year: 2024,
    category: "Electric",
    seating_capacity: 5,
    fuel_type: "Tri-Motor All-Electric (1,234 HP)",
    transmission: "Single-Speed Direct Drive",
    pricePerDay: 950,
    location: "San Francisco / Silicon Valley",
    description: "The pinnacle of electric executive performance. 0-60 in 1.89 seconds, 400+ miles of range, and whisper-quiet ultra-luxury cabin.",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop",
    isAvaliable: true,
  },
];

export const seedDatabaseIfEmpty = async () => {
  try {
    const count = await Car.countDocuments();
    if (count === 0) {
      console.log("Database Car collection is empty. Seeding initial luxury fleet...");
      await Car.insertMany(initialCars);
      console.log(`Successfully seeded ${initialCars.length} luxury vehicles into MongoDB.`);
    }
  } catch (err) {
    console.error("Error checking or seeding cars:", err.message);
  }
};
