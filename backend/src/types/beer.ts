export interface Beer {
  id: string;
  name: string;
  name_display?: string;
  description?: string;
  abv?: number;
  ibu?: number;
  srm?: number;
  style_id?: number;
  available_id?: number;
  glassware_id?: number;
  is_organic?: boolean;
  is_retired?: boolean;
  labels?: any;
  status?: string;
  status_display?: string;
  create_date?: Date;
  update_date?: Date;
}

export interface CreateBeerDTO {
  name: string;
  name_display?: string;
  description?: string;
  abv?: number;
  ibu?: number;
  srm?: number;
  style_id?: number;
  available_id?: number;
  glassware_id?: number;
  is_organic?: boolean;
  is_retired?: boolean;
  labels?: any;
  status?: string;
  status_display?: string;
}

export interface UpdateBeerDTO extends Partial<CreateBeerDTO> {} 