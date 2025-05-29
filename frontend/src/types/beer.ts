export interface Beer {
  id: string;
  name: string;
  name_display?: string;
  description?: string;
  abv?: number;
  ibu?: number;
  srm?: number;
  style_id?: number;
  style_name?: string;
  available_id?: number;
  availability_name?: string;
  glassware_id?: number;
  glassware_name?: string;
  is_organic?: boolean;
  is_retired?: boolean;
  labels?: {
    icon?: string;
    medium?: string;
    large?: string;
    contentAwareIcon?: string;
    contentAwareMedium?: string;
    contentAwareLarge?: string;
  };
  status?: string;
  status_display?: string;
  create_date?: string;
  update_date?: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserCollection {
  id: number;
  user_id: number;
  beer_id: string;
  rating: number;
  notes: string;
  created_at: string;
  updated_at: string;
  collection_id: number;
} 