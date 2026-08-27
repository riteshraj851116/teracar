import logo from "./logo.svg";
import gmail_logo from "./gmail_logo.svg";
import facebook_logo from "./facebook_logo.svg";
import instagram_logo from "./instagram_logo.svg";
import twitter_logo from "./twitter_logo.svg";
import menu_icon from "./menu_icon.svg";
import search_icon from "./search_icon.svg"
import close_icon from "./close_icon.svg"
import users_icon from "./users_icon.svg"
import car_icon from "./car_icon.svg"
import location_icon from "./location_icon.svg"
import fuel_icon from "./fuel_icon.svg"
import addIcon from "./addIcon.svg"
import carIcon from "./carIcon.svg"
import carIconColored from "./carIconColored.svg"
import dashboardIcon from "./dashboardIcon.svg"
import dashboardIconColored from "./dashboardIconColored.svg"
import addIconColored from "./addIconColored.svg"
import listIcon from "./listIcon.svg"
import listIconColored from "./listIconColored.svg"
import cautionIconColored from "./cautionIconColored.svg"
import arrow_icon from "./arrow_icon.svg"
import star_icon from "./star_icon.svg"
import check_icon from "./check_icon.svg"
import tick_icon from "./tick_icon.svg"
import delete_icon from "./delete_icon.svg"
import eye_icon from "./eye_icon.svg"
import eye_close_icon from "./eye_close_icon.svg"
import filter_icon from "./filter_icon.svg"
import edit_icon from "./edit_icon.svg"
import calendar_icon_colored from "./calendar_icon_colored.svg"
import location_icon_colored from "./location_icon_colored.svg"
import testimonial_image_1 from "./testimonial_image_1.png"
import testimonial_image_2 from "./testimonial_image_2.png"
import main_car from "./main_car.png"
import banner_car_image from "./banner_car_image.png"
import user_profile from "./user_profile.png"
import upload_icon from "./upload_icon.svg"
import car_image1 from "./car_image1.png"
import car_image2 from "./car_image2.png"
import car_image3 from "./car_image3.png"
import car_image4 from "./car_image4.png"

export const cityList = ['Mumbai', 'Delhi NCR', 'Bangalore', 'Goa', 'Hyderabad', 'Dubai', 'London']

export const assets = {
    logo,
    gmail_logo,
    facebook_logo,
    instagram_logo,
    twitter_logo,
    menu_icon,
    search_icon,
    close_icon,
    users_icon,
    edit_icon,
    car_icon,
    location_icon,
    fuel_icon,
    addIcon,
    carIcon,
    carIconColored,
    dashboardIcon,
    dashboardIconColored,
    addIconColored,
    listIcon,
    listIconColored,
    cautionIconColored,
    calendar_icon_colored,
    location_icon_colored,
    arrow_icon,
    star_icon,
    check_icon,
    tick_icon,
    delete_icon,
    eye_icon,
    eye_close_icon,
    filter_icon,
    testimonial_image_1,
    testimonial_image_2,
    main_car,
    banner_car_image,
    car_image1,
    upload_icon,
    user_profile,
    car_image2,
    car_image3,
    car_image4
}

export const menuLinks = [
    { name: "Home", path: "/" },
    { name: "Cars", path: "/cars" },
    { name: "My Bookings", path: "/my-bookings" },
]

export const ownerMenuLinks = [
    { name: "Dashboard", path: "/owner", icon: dashboardIcon, coloredIcon: dashboardIconColored },
    { name: "Add car", path: "/owner/add-car", icon: addIcon, coloredIcon: addIconColored },
    { name: "Manage Cars", path: "/owner/manage-cars", icon: carIcon, coloredIcon: carIconColored },
    { name: "Manage Bookings", path: "/owner/manage-bookings", icon: listIcon, coloredIcon: listIconColored },
]

export const dummyUserData = {
  "_id": "6847f7cab3d8daecdb517095",
  "name": "Alexander Wright",
  "email": "alex.wright@velocity.com",
  "role": "owner",
  "image": user_profile,
}

export const dummyCarData = [
    {
        "_id": "67ff5bc069c03d4e45f30b01",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Porsche",
        "model": "911 GT3 RS",
        "title": "Porsche 911 GT3 RS",
        "image": "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop",
        "year": 2024,
        "category": "Supercar",
        "seating_capacity": 2,
        "seats": 2,
        "fuel_type": "4.0L Naturally Aspirated Boxer",
        "fuelType": "4.0L Boxer",
        "transmission": "7-Speed PDK",
        "pricePerDay": 75000,
        "price": 75000,
        "location": "Mumbai",
        "description": "The ultimate track weapon with DRS aerodynamics, race-derived suspension, and 518 naturally aspirated horsepower that revs to 9,000 RPM.",
        "isAvaliable": true,
        "createdAt": "2025-04-16T07:26:56.215Z",
    },
    {
        "_id": "67ff5bc069c03d4e45f30b02",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Ferrari",
        "model": "F8 Tributo",
        "title": "Ferrari F8 Tributo",
        "image": "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=1200&auto=format&fit=crop",
        "year": 2024,
        "category": "Supercar",
        "seating_capacity": 2,
        "seats": 2,
        "fuel_type": "3.9L Twin-Turbo V8",
        "fuelType": "Twin-Turbo V8",
        "transmission": "7-Speed Dual-Clutch F1",
        "pricePerDay": 95000,
        "price": 95000,
        "location": "Delhi NCR",
        "description": "An Italian masterpiece generating 710 horsepower with 0-100 km/h in 2.9 seconds. Sculpted for blistering performance and presence.",
        "isAvaliable": true,
        "createdAt": "2025-04-16T07:30:00.000Z",
    },
    {
        "_id": "67ff5bc069c03d4e45f30b03",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Lamborghini",
        "model": "Huracán Evo Spyder",
        "title": "Lamborghini Huracán Evo",
        "image": "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1200&auto=format&fit=crop",
        "year": 2024,
        "category": "Supercar",
        "seating_capacity": 2,
        "seats": 2,
        "fuel_type": "5.2L V10 Petrol",
        "fuelType": "5.2L V10",
        "transmission": "7-Speed LDF Dual-Clutch",
        "pricePerDay": 110000,
        "price": 110000,
        "location": "Goa",
        "description": "Screaming naturally aspirated 630 hp V10 engine, all-wheel steering, predictive LDVI chassis dynamics, and open-top convertible thrills.",
        "isAvaliable": true,
        "createdAt": "2025-04-16T07:35:00.000Z",
    },
    {
        "_id": "67ff5bc069c03d4e45f30b04",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Rolls-Royce",
        "model": "Ghost Extended",
        "title": "Rolls-Royce Ghost Extended",
        "image": "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop",
        "year": 2024,
        "category": "Luxury",
        "seating_capacity": 4,
        "seats": 4,
        "fuel_type": "6.75L Twin-Turbo V12",
        "fuelType": "Twin-Turbo V12",
        "transmission": "Satellite-Aided 8-Speed Auto",
        "pricePerDay": 150000,
        "price": 150000,
        "location": "Mumbai",
        "description": "Pinnacle of executive luxury with Starlight Headliner, Planar suspension system, whisper-quiet acoustic insulation, and rear massage suites.",
        "isAvaliable": true,
        "createdAt": "2025-04-16T07:40:00.000Z",
    },
    {
        "_id": "67ff5bc069c03d4e45f30b05",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "McLaren",
        "model": "720S Spider",
        "title": "McLaren 720S Spider",
        "image": "https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=1200&auto=format&fit=crop",
        "year": 2023,
        "category": "Supercar",
        "seating_capacity": 2,
        "seats": 2,
        "fuel_type": "4.0L Twin-Turbo V8",
        "fuelType": "Twin-Turbo V8",
        "transmission": "7-Speed SSG Seamless Shift",
        "pricePerDay": 105000,
        "price": 105000,
        "location": "Bangalore",
        "description": "Carbon fiber Monocage II-S chassis, dihedral doors, 710 hp output, and lightning fast 0-100 in 2.8 seconds with active rear airbrake.",
        "isAvaliable": true,
        "createdAt": "2025-04-16T07:45:00.000Z",
    },
    {
        "_id": "67ff5bc069c03d4e45f30b06",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Mercedes-AMG",
        "model": "G 63 Biturbo",
        "title": "Mercedes-AMG G 63",
        "image": "https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?q=80&w=1200&auto=format&fit=crop",
        "year": 2024,
        "category": "SUV",
        "seating_capacity": 5,
        "seats": 5,
        "fuel_type": "4.0L V8 Handcrafted Biturbo",
        "fuelType": "Biturbo V8",
        "transmission": "AMG SPEEDSHIFT 9-Speed",
        "pricePerDay": 55000,
        "price": 55000,
        "location": "Hyderabad",
        "description": "Iconic luxury off-road icon featuring side-pipe AMG exhausts, triple differential locks, Burmester 3D surround sound, and 577 horsepower.",
        "isAvaliable": true,
        "createdAt": "2025-04-16T07:50:00.000Z",
    },
    {
        "_id": "67ff5bc069c03d4e45f30b07",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Aston Martin",
        "model": "DB12 Super Tourer",
        "title": "Aston Martin DB12",
        "image": "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1200&auto=format&fit=crop",
        "year": 2024,
        "category": "Luxury",
        "seating_capacity": 4,
        "seats": 4,
        "fuel_type": "4.0L Twin-Turbo V8",
        "fuelType": "Twin-Turbo V8",
        "transmission": "8-Speed Automatic with E-Diff",
        "pricePerDay": 85000,
        "price": 85000,
        "location": "Delhi NCR",
        "description": "The world's first Super Tourer with 671 hp, bespoke hand-stitched Bridge of Weir leather interior, and 202 mph top speed capability.",
        "isAvaliable": true,
        "createdAt": "2025-04-16T07:55:00.000Z",
    },
    {
        "_id": "67ff5bc069c03d4e45f30b08",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Porsche",
        "model": "Taycan Turbo S",
        "title": "Porsche Taycan Turbo S",
        "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
        "year": 2024,
        "category": "Electric",
        "seating_capacity": 4,
        "seats": 4,
        "fuel_type": "Dual Permanent Magnet EV",
        "fuelType": "Electric Dual-Motor",
        "transmission": "2-Speed Rear Transmission",
        "pricePerDay": 52000,
        "price": 52000,
        "location": "Mumbai",
        "description": "750 horsepower overboost launch control, 800-volt architecture for rapid charging, Porsche Ceramic Composite Brakes, and zero direct emissions.",
        "isAvaliable": true,
        "createdAt": "2025-04-16T08:00:00.000Z",
    },
    {
        "_id": "67ff5bc069c03d4e45f30b09",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "BMW",
        "model": "M8 Competition Gran Coupe",
        "title": "BMW M8 Competition",
        "image": "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop",
        "year": 2024,
        "category": "Luxury",
        "seating_capacity": 5,
        "seats": 5,
        "fuel_type": "4.4L M TwinPower Turbo V8",
        "fuelType": "TwinPower V8",
        "transmission": "8-Speed M Steptronic",
        "pricePerDay": 48000,
        "price": 48000,
        "location": "Bangalore",
        "description": "617 horsepower executive express featuring M xDrive with rear-wheel drive drift mode, carbon fiber roof, and M carbon bucket seats.",
        "isAvaliable": true,
        "createdAt": "2025-04-16T08:05:00.000Z",
    },
    {
        "_id": "67ff5bc069c03d4e45f30b10",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Audi",
        "model": "RS e-tron GT",
        "title": "Audi RS e-tron GT",
        "image": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop",
        "year": 2024,
        "category": "Electric",
        "seating_capacity": 4,
        "seats": 4,
        "fuel_type": "Dual Synchronous Motors",
        "fuelType": "Dual EV Motors",
        "transmission": "Single-Speed Front, 2-Speed Rear",
        "pricePerDay": 45000,
        "price": 45000,
        "location": "Delhi NCR",
        "description": "Grand touring grand coupe with 637 hp boost mode, all-wheel steering, adaptive air suspension, and striking Matrix LED lighting design.",
        "isAvaliable": true,
        "createdAt": "2025-04-16T08:10:00.000Z",
    },
    {
        "_id": "67ff5bc069c03d4e45f30b11",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Bentley",
        "model": "Continental GT Speed",
        "title": "Bentley Continental GT",
        "image": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop",
        "year": 2024,
        "category": "Luxury",
        "seating_capacity": 4,
        "seats": 4,
        "fuel_type": "6.0L Twin-Turbo W12",
        "fuelType": "Twin-Turbo W12",
        "transmission": "8-Speed Dual-Clutch",
        "pricePerDay": 80000,
        "price": 80000,
        "location": "Mumbai",
        "description": "Grand tourer powered by a 650 hp W12 powerplant. Diamond-in-Diamond quilting, rotating dashboard display, and effortless high-speed cruising.",
        "isAvaliable": true,
        "createdAt": "2025-04-16T08:15:00.000Z",
    },
    {
        "_id": "67ff5bc069c03d4e45f30b12",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Tesla",
        "model": "Model S Plaid",
        "title": "Tesla Model S Plaid",
        "image": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1200&auto=format&fit=crop",
        "year": 2024,
        "category": "Electric",
        "seating_capacity": 5,
        "seats": 5,
        "fuel_type": "Tri-Motor All-Wheel Drive",
        "fuelType": "Tri-Motor EV",
        "transmission": "Single-Speed Direct Drive",
        "pricePerDay": 38000,
        "price": 38000,
        "location": "Goa",
        "description": "1,020 horsepower with torque vectoring, 0-100 km/h in 1.99 seconds, 322 km/h top speed, and next-gen gaming and autonomous cockpit.",
        "isAvaliable": true,
        "createdAt": "2025-04-16T08:20:00.000Z",
    }
];

export const dummyMyBookingsData = [
    {
        "_id": "68482bcc98eb9722b7751f70",
        "car": dummyCarData[0],
        "user": "6847f7cab3d8daecdb517095",
        "owner": "6847f7cab3d8daecdb517095",
        "pickupDate": "2026-09-01T00:00:00.000Z",
        "returnDate": "2026-09-03T00:00:00.000Z",
        "status": "confirmed",
        "price": 150000,
        "createdAt": "2026-08-25T12:57:48.244Z",
    },
    {
        "_id": "68482bb598eb9722b7751f60",
        "car": dummyCarData[1],
        "user": "6847f7cab3d8daecdb517095",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "pickupDate": "2026-09-05T00:00:00.000Z",
        "returnDate": "2026-09-07T00:00:00.000Z",
        "status": "pending",
        "price": 190000,
        "createdAt": "2026-08-26T12:57:25.613Z",
    },
    {
        "_id": "684800fa0fb481c5cfd92e56",
        "car": dummyCarData[2],
        "user": "6847f7cab3d8daecdb517095",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "pickupDate": "2026-09-10T00:00:00.000Z",
        "returnDate": "2026-09-12T00:00:00.000Z",
        "status": "confirmed",
        "price": 220000,
        "createdAt": "2026-08-27T09:55:06.379Z",
    }
]

export const dummyDashboardData = {
    "totalCars": 12,
    "totalBookings": 3,
    "pendingBookings": 1,
    "completedBookings": 2,
    "recentBookings": [
        dummyMyBookingsData[0],
        dummyMyBookingsData[1],
        dummyMyBookingsData[2]
    ],
    "monthlyRevenue": 560000
}