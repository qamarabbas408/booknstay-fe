export const AppRoutes = {
    home: "/",
    login :"/login",
    register :"/register",
    registerVendor: "/register/vendor",
    registerGuest: "/register/guest",
    help: "/help",
    hotels :"/hotels",
    hotelDetails: "/hotel/:id",
    events :"/events",
    eventDetails: "/event/:id",
    bookings :"/bookings",
    registrationPending: "/registration-pending",

    // Guest
    guestDashboard: "/dashboard",
    addBooking: "/booking",
    eventBooking: "/event/booking/:id",

    // Vendor base & pages
    vendorBase: "vendor",
    vendorDashboard : "dashboard",
    vendorHotels : "hotels",
    vendorEvents : "events",
    vendorEventCreate: "event",
    vendorEventEdit: "event/edit/",
    vendorBookings : "bookings",
    vendorProfile : "profile",
    vendorSettings : "settings",
    vendorPropertyList: "properties",
    vendorAddHotel: "add/hotel",
    vendorEditProperty: "properties/edit/:id",
    vendorAddRoomtier : "add/roomtier/",
    editRoomtier : "roomtier/",
    editHotel : "hotel/",

}