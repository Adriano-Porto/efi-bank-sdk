export interface EfiBankAuthModuleInput {
  environment: 'DEV' | 'PROD'
  clientPublicKey: string
  clientSecretKey: string
  certificatePath: string
}

export interface AuthModuleAuthenticateOutput {
  accessToken: string
}

export interface buildConfigOutput {
  config: {
    httpsAgent: Agent
    headers: {
      'Content-Type': string
      Authorization: string
    }
  }
}
