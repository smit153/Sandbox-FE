export interface codeSchema {
  filename: string;
  code: string;
}

export interface SandboxType {
  _id: string;
  name: string;
  type: string;
  code: [codeSchema];
}

export interface SandboxCardType {
  _id: string;
  name: string;
  type: string;
}

export interface UserType {
  _id: string;
  name: string;
  email: string;
  password: string;
  sandbox: [string];
}

export interface DependencyType {
  package: {
    name: string;
    version: string;
  };
}

export interface DependencyVersions {
  [key: string]: string;
}
