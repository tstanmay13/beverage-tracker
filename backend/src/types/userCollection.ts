export interface UserCollection {
  id: number;
  user_id: number;
  beer_id: number;
  rating: number | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserCollectionDTO {
  user_id: number;
  beer_id: number;
  rating?: number;
  notes?: string;
}

export interface UpdateUserCollectionDTO extends Partial<CreateUserCollectionDTO> {} 