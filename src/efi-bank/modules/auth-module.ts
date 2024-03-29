import axios from 'axios'
import { readFileSync } from 'fs'
import { Agent } from 'https'
import path from 'path'
import { type AuthModuleAuthenticateOutput, type EfiBankAuthModuleInput, type buildConfigOutput } from '../@types/auth-module'

export class AuthModule {
  private readonly clientPublicKey: string
  private readonly clientSecretKey: string
  protected readonly certificateFile: string

  public readonly environment: 'DEV' | 'PROD'
  protected readonly url: string

  constructor ({
    environment,
    clientPublicKey,
    clientSecretKey,
    certificatePath
  }: EfiBankAuthModuleInput) {
    this.environment = environment
    this.clientPublicKey = clientPublicKey
    this.clientSecretKey = clientSecretKey
    this.url = environment === 'DEV'
      ? 'https://pix-h.api.efipay.com.br'
      : 'https://pix.api.efipay.com.br'

    try {
      // Address Security issues with injected file paths
      let filePath = path.resolve(__dirname, certificatePath)
      filePath = path.normalize(filePath)

      this.certificateFile = readFileSync(filePath).toString()
    } catch (err) {
      throw new Error(`Could not read certificate file ${certificatePath} ${(err as Error).message}`)
    }
  }

  private buildAgent (): Agent {
    return new Agent({
      pfx: this.certificateFile,
      passphrase: ''
    })
  }

  protected buildConfig (): buildConfigOutput {
    const config = {
      httpsAgent: this.buildAgent(),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + Buffer.from(`${this.clientPublicKey}:${this.clientSecretKey}`).toString('base64')
      }
    }

    return { config }
  }

  public getEnvironment (): 'DEV' | 'PROD' {
    return this.environment
  }

  protected async authenticate (): Promise<AuthModuleAuthenticateOutput> {
    const url = this.url + '/oauth/token'

    const data = {
      grant_type: 'client_credentials'
    }

    const config = {
      httpsAgent: this.buildAgent(),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic' + Buffer.from(`${this.clientPublicKey}:${this.clientSecretKey}`).toString('base64')
      }
    }

    const response = await axios.post(url, data, config)

    if (response.status !== 200) {
      throw new Error("Could not authenticate with efi-bank's API")
    }

    const { accessToken: at } = response.data
    const accessToken: string = at

    return {
      accessToken
    }
  }
}
