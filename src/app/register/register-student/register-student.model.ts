export interface RegisterStudentRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNo: string;
  dob: string;
}

export interface RegisterStudentResponse {
  success: boolean;
  message: string;
}