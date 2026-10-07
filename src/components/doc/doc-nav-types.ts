export interface DocNavItem {
  title: string;
  id: string;
  href?: string;
  method?: string;
  children?: DocNavItem[];
  /** Submenú colapsable (p. ej. Facturación) abierto por defecto */
  defaultOpen?: boolean;
}

export interface DocNavGroup {
  label: string;
  items: DocNavItem[];
  defaultOpen?: boolean;
}
