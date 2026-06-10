export type DragonModel = "black-dragon" | "white-dragon";

export interface OrderFormData {
  model: DragonModel;
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  notes?: string;
}
