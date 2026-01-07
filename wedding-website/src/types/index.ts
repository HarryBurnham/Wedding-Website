export interface Guest {
  id: string;
  code: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  group_id?: string;
  has_plus_one: boolean;
  plus_one_name?: string;
  invited_to_ceremony: boolean;
  invited_to_reception: boolean;
  created_at: string;
  updated_at: string;
}

export interface RSVP {
  id: string;
  guest_id: string;
  attending_ceremony: boolean;
  attending_reception: boolean;
  plus_one_attending: boolean;
  plus_one_name?: string;
  meal_choice?: string;
  plus_one_meal_choice?: string;
  dietary_restrictions?: string;
  plus_one_dietary_restrictions?: string;
  song_request?: string;
  recipe_text?: string;
  recipe_file_url?: string;
  submitted_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  venue_name: string;
  address: string;
  description?: string;
  map_url?: string;
}

export interface MealOption {
  id: string;
  name: string;
  description?: string;
  is_vegetarian: boolean;
  is_vegan: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  sent_at: string;
}

export interface Accommodation {
  id: string;
  name: string;
  description?: string;
  address: string;
  website?: string;
  phone?: string;
  price_range?: string;
  distance_to_venue?: string;
  has_block_booking: boolean;
  block_code?: string;
}

export interface GuestWithRSVP extends Guest {
  rsvp?: RSVP;
}
