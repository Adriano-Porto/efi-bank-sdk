import { container } from 'tsyringe'
import { EfiBankAuthModule, type EfiBankAuthModuleInput } from './auth-module'
import { EfiBankSubscriptionModule } from './subscription-module'

type UseModule = (EfiBankSubscriptionModule | EfiBankAuthModule)

export class EfiBank {
  auth ({
    clientPublicKey,
    clientSecretKey,
    certificatePath,
    environment = 'PROD'
  }: EfiBankAuthModuleInput): void {
    const authModule = {
      clientPublicKey,
      clientSecretKey,
      certificatePath,
      environment
    }

    container.register('EfiBankAuthModuleInput', { useValue: authModule })
  }

  use (classType: UseModule) {
    const instance = container.resolve<typeof classType>(classType)

    return instance
  }
}

// Search how to build, DI Container
// https://www.npmjs.com/package/tsyringe
// https://www.npmjs.com/package/inversify
