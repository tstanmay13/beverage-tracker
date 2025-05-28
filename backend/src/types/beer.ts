export interface Beer {
  id: number;
  name: string;
  brewery: string;
  style: string;
  abv: number;
  rating: number | null;
  image_url: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateBeerDTO {
  name: string;
  brewery: string;
  style: string;
  abv: number;
  rating?: number;
  image_url?: string;
  notes?: string;
}

export interface UpdateBeerDTO extends Partial<CreateBeerDTO> {} 