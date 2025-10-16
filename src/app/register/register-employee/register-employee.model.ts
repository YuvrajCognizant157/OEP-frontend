export interface RegisterEmployeeRequest {
  email: string;
  fullName: string;
  password: string;
  dob: string;
  phoneNo: string;
  role: string;
  token: string;
}

export interface RegisterEmployeeResponse {
  success: boolean;
  message: string;
}