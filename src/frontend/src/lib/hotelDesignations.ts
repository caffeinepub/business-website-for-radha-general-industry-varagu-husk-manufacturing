// Comprehensive list of hotel industry designations
export const HOTEL_DESIGNATIONS = [
  // Management & Administration
  'General Manager',
  'Assistant General Manager',
  'Hotel Manager',
  'Assistant Manager',
  'Front Office Manager',
  'Duty Manager',
  'Night Manager',
  
  // Front Office
  'Front Desk Supervisor',
  'Front Desk Agent',
  'Front Desk Staff',
  'Receptionist',
  'Guest Relations Officer',
  'Concierge',
  'Bell Captain',
  'Bellboy',
  'Door Attendant',
  'Valet Parking Attendant',
  
  // Housekeeping
  'Housekeeping Manager',
  'Assistant Housekeeping Manager',
  'Housekeeping Supervisor',
  'Room Attendant',
  'Housekeeping Attendant',
  'Linen Room Attendant',
  'Public Area Attendant',
  'Laundry Manager',
  'Laundry Supervisor',
  'Laundry Attendant',
  
  // Food & Beverage
  'F&B Manager',
  'Restaurant Manager',
  'Assistant Restaurant Manager',
  'Banquet Manager',
  'Bar Manager',
  'Captain',
  'Waiter',
  'Waitress',
  'Steward',
  'Bartender',
  'Barista',
  'Sommelier',
  'Room Service Supervisor',
  'Room Service Attendant',
  
  // Kitchen
  'Executive Chef',
  'Sous Chef',
  'Chef de Partie',
  'Demi Chef',
  'Commis I',
  'Commis II',
  'Commis III',
  'Kitchen Steward',
  'Kitchen Helper',
  'Kitchen Staff',
  'Pastry Chef',
  'Bakery Chef',
  
  // Accounts & Finance
  'Finance Manager',
  'Accountant',
  'Assistant Accountant',
  'Accounts Executive',
  'Accounts Staff',
  'Cashier',
  'Night Auditor',
  
  // Sales & Marketing
  'Sales Manager',
  'Sales Executive',
  'Marketing Manager',
  'Marketing Executive',
  'Reservation Manager',
  'Reservation Executive',
  
  // Human Resources
  'HR Manager',
  'HR Executive',
  'Training Manager',
  'Training Executive',
  
  // Engineering & Maintenance
  'Chief Engineer',
  'Maintenance Manager',
  'Maintenance Supervisor',
  'Electrician',
  'Plumber',
  'Carpenter',
  'AC Technician',
  'Maintenance Technician',
  
  // Security
  'Security Manager',
  'Security Supervisor',
  'Security Guard',
  
  // Other
  'Spa Manager',
  'Spa Therapist',
  'Fitness Instructor',
  'Swimming Pool Attendant',
  'Driver',
  'Gardener',
] as const;

export type HotelDesignation = typeof HOTEL_DESIGNATIONS[number];
