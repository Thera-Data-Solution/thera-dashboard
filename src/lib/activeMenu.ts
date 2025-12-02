import { DEFAULT_MENU } from "@/constants/menu";
import { useRouterState } from "@tanstack/react-router";

export function useActiveMenu() {
  const { location } = useRouterState();
  const pathname = location.pathname;

  // Cari parent
  const parent = DEFAULT_MENU.find((menu) => 
    pathname.startsWith(menu.path)
  );

  if (!parent) return null;

  // Cari child dalam parent itu
  const child = parent.items.find((item) =>
    pathname.startsWith(item.url)
  );

  return { parent, child };
}
