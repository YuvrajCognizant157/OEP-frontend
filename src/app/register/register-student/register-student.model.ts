export interface RegisterStudentRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNo: string;
  dob: string;
  verifyEmail: boolean;
}

export interface RegisterStudentResponse {
  success: boolean;
  message: string;
}