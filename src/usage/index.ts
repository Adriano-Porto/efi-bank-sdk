import 'reflect-metadata'
import { EfiBank } from '../efi-bank'
import { EfiBankSubscriptionModule } from '../efi-bank/subscription-module'

const efiBank = new EfiBank()

efiBank.auth({
  certificatePath: '../../fake-certificate.txt', // check if its from the root or the auth-module file

  clientPublicKey: 'client-public',
  clientSecretKey: 'client-secret',
  environment: 'DEV'
})

const subscriptionModule = efiBank.use(EfiBankSubscriptionModule)
