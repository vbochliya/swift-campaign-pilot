
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export interface RegisterData {
  name: string;
  industry: string;
  admin_email: string;
  admin_password: string;
  admin_name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  organization: {
    id: number;
    name: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  refresh?: string;
  access?: string;
  user?: User;
}

export interface Campaign {
  id: number;
  name: string;
  description: string;
  organization_id: number;
  created_by_id: number;
  channel: string;
  contactsCSV: string;
  created_at: string;
  updated_at: string;
  message_templates?: MessageTemplate[];
}

export interface MessageTemplate {
  id: number;
  name: string;
  organization: number;
  channel: string;
  subject: string;
  content: {
    title: string;
    body: string;
    action_url: string;
    hero_image_alt: string;
    button_text: string;
  };
  is_html: boolean;
  created_at: string;
  updated_at: string;
  static_asset_url?: string;
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  campaign: string;
  template: string;
  contacts_processed: number;
  successful_sends: number;
  failed_sends: number;
  results: {
    recipient: string;
    success: boolean;
    result: string;
  }[];
}

export interface AssetUploadResponse {
  uploaded_at: string;
  response: {
    secure_url: string;
    [key: string]: any;
  };
}

// Helper function to handle HTTP errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
    
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
  return response.json();
};

// Auth token management
export const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

export const setAuthToken = (token: string) => {
  localStorage.setItem("access_token", token);
};

export const removeAuthToken = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

export const setRefreshToken = (token: string) => {
  localStorage.setItem("refresh_token", token);
};

export const getRefreshToken = () => {
  return localStorage.getItem("refresh_token");
};

export const setUserData = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUserData = (): User | null => {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
};

// API Functions
const api = {
  // Auth
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/accounts/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    console.log("Logging in with", data, "to", `${API_URL}/api/accounts/login/`);
    const response = await fetch(`${API_URL}/api/accounts/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("Login response:", response);
    const responseData = await handleResponse(response);
    
    if (responseData.success && responseData.access) {
      setAuthToken(responseData.access);
      setRefreshToken(responseData.refresh || '');
      if (responseData.user) {
        setUserData(responseData.user as User);
      }
    }
    
    return responseData;
  },

  logout: () => {
    removeAuthToken();
    toast.success("Successfully logged out");
  },

  // Templates
  createTemplate: async (data: any): Promise<MessageTemplate> => {
    console.log("Creating template with data:", data);
    console.log("API URL:", `${API_URL}/campaigns/create-message-template/`);
    console.log("Auth token:", getAuthToken());

    const response = await fetch(`${API_URL}/campaigns/create-message-template/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },

  // Campaigns
  createCampaign: async (formData: FormData): Promise<Campaign> => {
    console.log("Creating campaign with FormData containing:");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    console.log("API URL:", `${API_URL}/campaigns/create-campaign/`);
    
    const response = await fetch(`${API_URL}/campaigns/create-campaign/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });
    
    return handleResponse(response);
  },

  getCampaigns: async (): Promise<Campaign[]> => {
    const response = await fetch(`${API_URL}/campaigns/get-campaign/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    
    return handleResponse(response);
  },

  deleteCampaign: async (id: number): Promise<any> => {
    const response = await fetch(`${API_URL}/campaigns/delete-campaign/?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    
    return handleResponse(response);
  },

  // Messaging
  sendMessage: async (data: { campaign_id: number; template_id: number; variables: Record<string, any> }): Promise<SendMessageResponse> => {
    const response = await fetch(`${API_URL}/messaging/send-message/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },

  uploadAsset: async (file: File): Promise<AssetUploadResponse> => {
    console.log("Uploading asset:", file.name);
    console.log("API URL:", `${API_URL}/messaging/create-static-asset/`);
    
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_URL}/messaging/create-static-asset/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });
    
    return handleResponse(response);
  },
};

export default api;
