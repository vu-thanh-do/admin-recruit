export interface FormResponse {
  data : Form[]
  status: number
  message: string
}
export interface Form {
  _id: string;
  nameForm: {
    vi: string;
    en: string;
  };
  typeForm: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
