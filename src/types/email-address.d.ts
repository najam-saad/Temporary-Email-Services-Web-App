declare module 'email-address' {
  export function parse(email: string): {
    local: string;
    domain: string;
    toString(): string;
  } | null;
  
  export function parseFrom(input: string): {
    name?: string;
    address: string;
    toString(): string;
  }[];
  
  export function parseOneAddress(input: string): {
    name?: string;
    address: string;
    toString(): string;
  } | null;
} 