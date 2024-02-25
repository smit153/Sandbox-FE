import { gql } from "@apollo/client";

export const GET_DATA = gql`
  query getUserSandbox($id: String!) {
    getUserSandbox(id: $id) {
      user {
        email
        name
        sandbox {
          name
          type
          _id
        }
      }
    }
  }
`;

export const CREATE_SANDBOX = gql`
  mutation CreateSandbox($name: String!, $type: String!, $token: String!) {
    createSandbox(name: $name, type: $type, token: $token) {
      name
      type
      _id
    }
  }
`;

export const DELETE_SANDBOX = gql`
  mutation DeleteSandbox($deleteSandboxId: String!, $token: String!) {
    deleteSandbox(id: $deleteSandboxId, token: $token)
  }
`;

export const GET_SANDBOX = gql`
  query GetSandbox($getSandboxId: String!) {
    getSandbox(id: $getSandboxId) {
      port
      sandbox {
        _id
        codes {
          code
          filename
        }
        name
        type
      }
    }
  }
`;

export const UPDATE_SANDBOX_CODE = gql`
  mutation UpdateSandboxCode(
    $sandboxId: String!
    $filename: String!
    $code: String!
    $port: Int!
  ) {
    updateSandboxCode(
      sandboxId: $sandboxId
      filename: $filename
      code: $code
      port: $port
    )
  }
`;

export const DELETE_SANDBOX_FILE = gql`
  mutation DeleteSandbox($sandboxId: String!, $filename: String!, $port: Int!) {
    deleteSandboxFile(sandboxId: $sandboxId, filename: $filename, port: $port)
  }
`;

export const CLEAN_UP_SANDBOX = gql`
  mutation CleanUpSandbox($port: Int) {
    cleanUpSandbox(port: $port)
  }
`;

export const GET_OUTPUT_LOGS = gql`
  query Query($port: Int) {
    getOutput(port: $port)
  }
`;
