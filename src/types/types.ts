export interface User {
  _id: string;
  orgId: string;
  email: string;
  name: string;
  roles: string[];
  eulaAccepted: boolean;
  status?: boolean;
}