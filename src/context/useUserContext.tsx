import type { User } from "@/api/auth";
import { createContext } from "react-router-dom";


export const userContext = createContext<User | null>(null);
