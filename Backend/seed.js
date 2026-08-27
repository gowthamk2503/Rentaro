const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const User = require('./models/User');
const Car = require('./models/Car');
const BookingDetails = require('./models/BookingDetails');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const initialCars = [
  {
    make: "Tata",
    model: "Nexon EV",
    year: 2025,
    category: "Electric",
    pricePerDay: 3500,
    available: true,
    fuelType: "Electric",
    transmission: "Automatic",
    seats: 5,
    mileage: "450 km/charge",
    bootSpace: "350 Litres",
    groundClearance: "190 mm",
    engine: "Permanent Magnet AC Motor",
    power: "142.6 bhp",
    torque: "215 Nm",
    image: "/tata_nexon_ev.png",
    images: ["/tata_nexon_ev.png", "/dark_car.jpg", "/red_car.png"],
    features: ["Fast Charging Support", "Sunroof", "Ventilated Seats", "360 Camera", "Air Purifier", "Connected Car Tech"],
    colors: ["Intense Teal", "Daytona Grey", "Pristine White", "Empowered Oxide"],
    rating: 4.9,
    tripsCount: 38,
    description: "The Tata Nexon EV combines emission-free electric efficiency with exceptional SUV versatility, long-range capabilities, and cutting-edge safety features."
  },
  {
    make: "Mahindra",
    model: "Thar 4x4",
    year: 2024,
    category: "SUV",
    pricePerDay: 6500,
    available: true,
    fuelType: "Diesel",
    transmission: "Manual",
    seats: 4,
    mileage: "15.2 kmpl",
    bootSpace: "220 Litres",
    groundClearance: "226 mm",
    engine: "2.2L mHawk Turbo Diesel",
    power: "130 bhp @ 3750 rpm",
    torque: "300 Nm @ 1600 rpm",
    image: "/mahindra_thar.png",
    images: ["/mahindra_thar.png", "/dark_car.jpg"],
    features: ["4x4 Drive with Low Range", "Removable Hardtop", "Touchscreen Display", "Roll Cage", "Hill Descent Control"],
    colors: ["Red Rage", "Napoli Black", "Aqua Marine", "Galaxy Grey"],
    rating: 4.9,
    tripsCount: 52,
    description: "Conquer any terrain with the iconic Mahindra Thar. Built for adrenaline-filled road trips, rugged trails, and effortless highway cruising."
  },
  {
    make: "Hyundai",
    model: "Creta SX",
    year: 2025,
    category: "SUV",
    pricePerDay: 4800,
    available: true,
    fuelType: "Diesel",
    transmission: "Automatic",
    seats: 5,
    mileage: "19.1 kmpl",
    bootSpace: "433 Litres",
    groundClearance: "190 mm",
    engine: "1.5L U2 CRDi Diesel",
    power: "114 bhp @ 4000 rpm",
    torque: "250 Nm @ 1500 rpm",
    image: "/hyundai_creta.png",
    images: ["/hyundai_creta.png", "/creta.jpg"],
    features: ["Panoramic Sunroof", "Bose 8-Speaker Audio", "Drive Modes", "Wireless Charger", "Cooled Glove Box", "Rear Sunblinds"],
    colors: ["Ranger Khaki", "Atlas White", "Abyss Black", "Titan Grey"],
    rating: 4.8,
    tripsCount: 44,
    description: "India's most loved compact SUV. Features supreme ride comfort, high-end infotainment, and class-leading highway poise."
  },
  {
    make: "Kia",
    model: "Seltos GT Line",
    year: 2025,
    category: "SUV",
    pricePerDay: 5200,
    available: true,
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    mileage: "17.7 kmpl",
    bootSpace: "433 Litres",
    groundClearance: "190 mm",
    engine: "1.5L Turbo GDi Petrol",
    power: "158 bhp @ 5500 rpm",
    torque: "253 Nm @ 1500 rpm",
    image: "/kia_seltos.png",
    images: ["/kia_seltos.png", "/seltos.jpg", "/car_view/back/seltos.jpg", "/car_view/side/seltos.jpg"],
    features: ["Level 2 ADAS", "Dual Panoramic Displays", "Ventilated Front Seats", "Ambient Mood Lighting", "Smart Air Purifier"],
    colors: ["Imperial Blue", "Glacier White Pearl", "Aurora Black Pearl", "Gravity Grey"],
    rating: 4.9,
    tripsCount: 31,
    description: "Striking design meets raw turbocharged power. The Kia Seltos GT Line delivers sports-car acceleration in a commanding SUV format."
  },
  {
    make: "Maruti Suzuki",
    model: "Swift ZXi+",
    year: 2025,
    category: "Economy",
    pricePerDay: 3200,
    available: true,
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 5,
    mileage: "24.8 kmpl",
    bootSpace: "265 Litres",
    groundClearance: "163 mm",
    engine: "1.2L Z-Series 3-Cylinder",
    power: "80.5 bhp @ 5700 rpm",
    torque: "111.7 Nm @ 4300 rpm",
    image: "/swift.jpg",
    images: ["/swift.jpg", "/car_view/back/swift.jpg", "/car_view/side/swift.jpg"],
    features: ["9-inch Touchscreen", "Wireless Apple CarPlay / Android Auto", "Cruise Control", "6 Airbags", "Hill Hold Assist"],
    colors: ["Sizzling Red", "Luster Blue", "Pearl Arctic White", "Magma Grey"],
    rating: 4.7,
    tripsCount: 65,
    description: "The nimble, super-efficient city icon. Agile steering, world-class fuel economy, and effortless parking everywhere."
  },
  {
    make: "Toyota",
    model: "Fortuner Legender",
    year: 2024,
    category: "Luxury",
    pricePerDay: 8500,
    available: true,
    fuelType: "Diesel",
    transmission: "Automatic",
    seats: 7,
    mileage: "14.2 kmpl",
    bootSpace: "296 Litres",
    groundClearance: "225 mm",
    engine: "2.8L 4-Cylinder Diesel",
    power: "201.15 bhp @ 3400 rpm",
    torque: "500 Nm @ 1600 rpm",
    image: "/fortuner.jpg",
    images: ["/fortuner.jpg", "/dark_car.jpg"],
    features: ["11-Speaker JBL Audio", "Sequential LED Indicators", "Powered Tailgate", "Dual Zone Climate Control", "Rear Diff Lock"],
    colors: ["Pearl White / Black Roof", "Attitude Black", "Phantom Brown"],
    rating: 5.0,
    tripsCount: 29,
    description: "The undisputed king of full-size luxury SUVs. Incredible road presence, bulletproof reliability, and lavish 7-seater comfort."
  },
  {
    make: "Toyota",
    model: "Innova Crysta",
    year: 2024,
    category: "Luxury",
    pricePerDay: 7000,
    available: true,
    fuelType: "Diesel",
    transmission: "Manual",
    seats: 7,
    mileage: "15.6 kmpl",
    bootSpace: "300 Litres",
    groundClearance: "178 mm",
    engine: "2.4L Diesel Engine",
    power: "147.5 bhp @ 3400 rpm",
    torque: "343 Nm @ 1400 rpm",
    image: "/innova.jpg",
    images: ["/innova.jpg", "/toyota_innova_crysta.jpg"],
    features: ["Captain Executive Seats", "Rear AC Controls", "Cruise Control", "Eco & Power Drive Modes", "7 Airbags"],
    colors: ["Super White", "Silver", "Attitude Black", "Bronze"],
    rating: 4.9,
    tripsCount: 47,
    description: "The ultimate long-distance family tourer. Unmatched ride quality, supreme second-row captain seats, and generous luggage capacity."
  },
  {
    make: "Honda",
    model: "City ZX",
    year: 2025,
    category: "Sedan",
    pricePerDay: 4600,
    available: true,
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    mileage: "18.4 kmpl",
    bootSpace: "506 Litres",
    groundClearance: "165 mm",
    engine: "1.5L i-VTEC DOHC Petrol",
    power: "119.35 bhp @ 6600 rpm",
    torque: "145 Nm @ 4300 rpm",
    image: "/city.jpg",
    images: ["/city.jpg", "/dark_car.jpg"],
    features: ["Electric Sunroof", "Honda Sensing ADAS", "LaneWatch Camera", "8-inch Touchscreen", "Leather Upholstery"],
    colors: ["Radiant Red Metallic", "Platinum White Pearl", "Golden Brown", "Lunar Silver"],
    rating: 4.8,
    tripsCount: 36,
    description: "The benchmark midsize sedan. Butter-smooth i-VTEC power, huge 506L trunk, whisper-quiet cabin, and sophisticated ride."
  },
  {
    make: "Hyundai",
    model: "Grand i10 Nios",
    year: 2024,
    category: "Economy",
    pricePerDay: 2800,
    available: true,
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 5,
    mileage: "20.7 kmpl",
    bootSpace: "260 Litres",
    groundClearance: "165 mm",
    engine: "1.2L Kappa Petrol",
    power: "81.8 bhp @ 6000 rpm",
    torque: "113.8 Nm @ 4000 rpm",
    image: "/grand_i10.jpg",
    images: ["/grand_i10.jpg", "/car_view/back/grand_i10.jpg", "/car_view/side/grand_i10.jpg"],
    features: ["Wireless Phone Charging", "Cooled Glovebox", "8-inch Infotainment", "Rear AC Vents", "Reverse Parking Camera"],
    colors: ["Polar White", "Titan Grey", "Typhoon Silver", "Fiery Red"],
    rating: 4.7,
    tripsCount: 41,
    description: "A refined, premium hatchback for urban commuters. Comfortable seating, excellent visibility, and effortless maneuvering."
  },
  {
    make: "Tata",
    model: "Tiago XZ+",
    year: 2024,
    category: "Economy",
    pricePerDay: 2600,
    available: true,
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 5,
    mileage: "20.0 kmpl",
    bootSpace: "242 Litres",
    groundClearance: "170 mm",
    engine: "1.2L Revotron Petrol",
    power: "84.8 bhp @ 6000 rpm",
    torque: "113 Nm @ 3300 rpm",
    image: "/tiago.jpg",
    images: ["/tiago.jpg", "/car_view/back/tiago.jpg", "/car_view/side/tiago.jpg"],
    features: ["Harman 8-Speaker System", "Digital Cluster", "Rear Defogger", "Projector Headlamps", "Rear Camera"],
    colors: ["Daytona Grey", "Tornado Blue", "Flame Red", "Opal White"],
    rating: 4.6,
    tripsCount: 39,
    description: "4-star GNCAP safety rated compact hatchback with punchy acceleration, sturdy construction, and class-leading acoustics."
  },
  {
    make: "Mahindra",
    model: "Scorpio Classic",
    year: 2024,
    category: "SUV",
    pricePerDay: 5800,
    available: true,
    fuelType: "Diesel",
    transmission: "Manual",
    seats: 7,
    mileage: "15.0 kmpl",
    bootSpace: "460 Litres",
    groundClearance: "209 mm",
    engine: "2.2L Gen-2 mHawk Diesel",
    power: "130 bhp @ 3750 rpm",
    torque: "300 Nm @ 1600 rpm",
    image: "/scorpio.jpg",
    images: ["/scorpio.jpg", "/dark_car.jpg"],
    features: ["9-inch Android Screen", "Hydraulic Steering", "Captain Seats option", "Dual Tone Cladding", "Roof Mounted Speakers"],
    colors: ["Napoli Black", "Pearl White", "Galaxy Grey"],
    rating: 4.8,
    tripsCount: 50,
    description: "The rugged veteran of Indian highways. Dominant high seating stance, monstrous low-end torque, and 7-passenger capability."
  },
  {
    make: "Maruti Suzuki",
    model: "Baleno Alpha",
    year: 2025,
    category: "Sedan",
    pricePerDay: 3600,
    available: true,
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    mileage: "22.9 kmpl",
    bootSpace: "318 Litres",
    groundClearance: "170 mm",
    engine: "1.2L DualJet Dual VVT",
    power: "88.5 bhp @ 6000 rpm",
    torque: "113 Nm @ 4400 rpm",
    image: "/baleno.jpg",
    images: ["/baleno.jpg", "/maruti_suzuki_baleno.png"],
    features: ["Heads Up Display (HUD)", "360 View Camera", "SmartPlay Pro+ 9-inch Screen", "Arkamys Sound System", "UV Cut Glass"],
    colors: ["Nexa Blue", "Grandeur Grey", "Opulent Red", "Splendid Silver"],
    rating: 4.8,
    tripsCount: 42,
    description: "Premium wide-body hatchback equipped with cutting-edge Heads-Up Display and surround cameras for an ultra-modern drive."
  },
  {
    make: "Tata",
    model: "Harrier Dark Edition",
    year: 2025,
    category: "Luxury",
    pricePerDay: 6800,
    available: true,
    fuelType: "Diesel",
    transmission: "Automatic",
    seats: 5,
    mileage: "16.8 kmpl",
    bootSpace: "445 Litres",
    groundClearance: "205 mm",
    engine: "2.0L Kryotec Turbocharged",
    power: "167.6 bhp @ 3750 rpm",
    torque: "350 Nm @ 1750 rpm",
    image: "/harrier.jpg",
    images: ["/harrier.jpg", "/dark_car.jpg"],
    features: ["Land Rover derived D8 Platform", "12.3-inch Touchscreen", "JBL 10-Speaker Audio", "ADAS Suite", "Electronic Parking Brake"],
    colors: ["Oberon Black", "Sunlit Yellow", "Pebble Grey", "Lunar White"],
    rating: 4.9,
    tripsCount: 27,
    description: "Built on Land Rover's legendary pedigree. Features commanding road manners, an imposing dark silhouette, and first-class cabin luxury."
  },
  {
    make: "Rentaro",
    model: "Velocita GT (Exotic)",
    year: 2026,
    category: "Luxury",
    pricePerDay: 14500,
    available: true,
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 2,
    mileage: "10.5 kmpl",
    bootSpace: "150 Litres",
    groundClearance: "125 mm",
    engine: "4.0L Twin-Turbo V8",
    power: "620 bhp @ 7500 rpm",
    torque: "760 Nm @ 3000 rpm",
    image: "/red_car.png",
    images: ["/red_car.png", "/dark_car.jpg"],
    features: ["Launch Control", "Active Aerodynamics", "Carbon Ceramic Brakes", "Alcantara Interior", "Track Telemetry"],
    colors: ["Rosso Corsa Red", "Nero Carbon", "Giallo Modena"],
    rating: 5.0,
    tripsCount: 15,
    description: "Our flagship exotic supercar rental. Experience pure adrenaline with 0-100 km/h in 2.9 seconds, thrilling exhaust notes, and head-turning aerodynamics."
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB successfully.');

    // 1. Seed Users
    console.log('Seeding Users...');
    const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
    const userPasswordHash = await bcrypt.hash('Password@123', 10);

    const usersToSeed = [
      {
        name: "Rentaro Master Admin",
        email: "admin@rentaro.com",
        password: adminPasswordHash,
        role: "admin",
        phone: "+1 (555) 019-2834",
        licenseNumber: "DL-ADM-2026-001",
        avatar: "https://ui-avatars.com/api/?name=Admin+Rentaro&background=0F172A&color=60A5FA"
      },
      {
        name: "Fleet Supervisor",
        email: "admin@carrental.com",
        password: adminPasswordHash,
        role: "admin",
        phone: "+1 (555) 019-4567",
        licenseNumber: "DL-ADM-2026-002",
        avatar: "https://ui-avatars.com/api/?name=Fleet+Supervisor&background=0F172A&color=F59E0B"
      },
      {
        name: "Alex Morgan",
        email: "customer@example.com",
        password: userPasswordHash,
        role: "user",
        phone: "+1 (555) 234-5678",
        licenseNumber: "DL-984729104",
        avatar: "/gowtham_ava.jpg"
      }
    ];

    for (const u of usersToSeed) {
      await User.findOneAndUpdate(
        { email: u.email },
        { $set: u },
        { upsert: true, new: true }
      );
    }
    console.log('✅ Users seeded/updated successfully.');

    // 2. Seed Cars
    console.log('Seeding Cars...');
    for (const carData of initialCars) {
      await Car.findOneAndUpdate(
        { make: carData.make, model: carData.model },
        { $set: carData },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${initialCars.length} vehicles seeded/updated successfully.`);

    // 3. Seed Sample Bookings
    console.log('Checking Bookings...');
    const existingBookingsCount = await BookingDetails.countDocuments();
    if (existingBookingsCount === 0) {
      console.log('Seeding initial sample bookings for analytics...');
      const sampleCars = await Car.find().limit(4);
      const alexUser = await User.findOne({ email: "customer@example.com" });

      const sampleBookings = [
        {
          bookingRef: "REN-2026-NEXON",
          user: alexUser ? alexUser._id : null,
          name: "Alex Morgan",
          email: "customer@example.com",
          phone: "+1 (555) 234-5678",
          pickupDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          returnDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          days: 3,
          color: "Intense Teal",
          comments: "Airport pickup requested.",
          car: "Tata Nexon EV",
          carId: sampleCars[0] ? sampleCars[0]._id : null,
          carDetails: {
            make: "Tata",
            model: "Nexon EV",
            year: 2025,
            category: "Electric",
            image: "/tata_nexon_ev.png",
            pricePerDay: 3500
          },
          dailyRate: 3500,
          taxAmount: 525,
          totalCost: 11025,
          status: "Confirmed",
          paymentStatus: "Paid"
        },
        {
          bookingRef: "REN-2026-THAR4",
          user: alexUser ? alexUser._id : null,
          name: "Sarah Jenkins",
          email: "sarah.j@example.com",
          phone: "+1 (555) 789-0123",
          pickupDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          returnDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          days: 3,
          color: "Napoli Black",
          comments: "Offroad mountain drive weekend trip.",
          car: "Mahindra Thar 4x4",
          carId: sampleCars[1] ? sampleCars[1]._id : null,
          carDetails: {
            make: "Mahindra",
            model: "Thar 4x4",
            year: 2024,
            category: "SUV",
            image: "/mahindra_thar.png",
            pricePerDay: 6500
          },
          dailyRate: 6500,
          taxAmount: 975,
          totalCost: 20475,
          status: "Completed",
          paymentStatus: "Paid"
        },
        {
          bookingRef: "REN-2026-FORTU",
          user: null,
          name: "Vikram Malhotra",
          email: "vikram.m@example.com",
          phone: "+91 98450 12345",
          pickupDate: new Date(),
          returnDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          date: new Date(),
          days: 5,
          color: "Pearl White",
          comments: "VIP Corporate Delegation transfer.",
          car: "Toyota Fortuner Legender",
          carId: sampleCars[5] ? sampleCars[5]._id : null,
          carDetails: {
            make: "Toyota",
            model: "Fortuner Legender",
            year: 2024,
            category: "Luxury",
            image: "/fortuner.jpg",
            pricePerDay: 8500
          },
          dailyRate: 8500,
          taxAmount: 2125,
          totalCost: 44625,
          status: "Active",
          paymentStatus: "Paid"
        }
      ];

      await BookingDetails.insertMany(sampleBookings);
      console.log('✅ Sample bookings created.');
    }

    console.log('\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('--------------------------------------------------');
    console.log('Admin Account 1: admin@rentaro.com / Admin@123');
    console.log('Admin Account 2: admin@carrental.com / Admin@123');
    console.log('Customer Account: customer@example.com / Password@123');
    console.log('--------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
