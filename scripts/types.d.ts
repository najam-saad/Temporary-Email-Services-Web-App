interface ImprovMXEmail {
  id: string;
  from: string;
  to: string;
  subject: string;
  html?: string;
  text?: string;
  date: string;
}

interface ImprovMXResponse {
  emails: ImprovMXEmail[];
}

interface ImprovMXAlias {
  alias: string;
  forward: string;
  id: number;
  created: number;
}

interface ImprovMXAliasResponse {
  alias: ImprovMXAlias;
  success: boolean;
} 