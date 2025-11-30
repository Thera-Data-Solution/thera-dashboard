import { authApi } from ".";

export type AppSettings = {
  appName: string;
  appLogo?: string;
  appTitle: string;
  appDescription: string;
  appTheme: "light" | "dark";
  appMainColor: string;
  appHeaderColor: string;
  appFooterColor: string;
  fontSize: number | string;
  appDecoration?: string;
  enableChatBot: boolean | string;
  enableFacilitator: boolean | string;
  enablePaymentGateway: boolean | string;
  metaOg?: string;
  timezone: string;
};


export const getSettings = async (): Promise<AppSettings | null> => {
  const res = await authApi.get("/settings");
  const data = res.data;
  if (Array.isArray(data)) {
    return data[0] ?? null;
  }
  return data ?? null;
};

export const upsertSettings = async (payload: FormData): Promise<AppSettings> => {
  console.log(payload, "payload");
  const res = await authApi.post("/settings", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

