import { type EfiBankAuthModuleInput } from '../efi-bank/@types/auth-module'
import { SubscriptionModule } from '../efi-bank/modules/subscription-module'

const authModuleVariables: EfiBankAuthModuleInput = {
  environment: 'PROD',
  certificatePath: '../fake-certificate',
  clientPublicKey: 'clientPublicKey',
  clientSecretKey: 'clientSecretKey'
}

const subscriptionModule = new SubscriptionModule(authModuleVariables)

async function useCaseSubscriptionModule () {
  const subscriptionPlan = await subscriptionModule.createSubscriptionPlan({
    name: 'Test Plan',
    interval: 2,
    repeats: 10
  })

  console.log(subscriptionPlan)

  const subscriptionVinculated = await subscriptionModule.createSubscriptionAndVinculateToPlan({
    expiresAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
    configurations: {
      fine: 0,
      interest: 0
    },
    items: [
      {
        name: 'Aluguel',
        value: 1500
      }
    ],
    message: 'Pagamento Referente ao mês 7',
    paymentInfo: {
      customer: {
        cpf: '123.456.789-00',
        email: 'johndoe@test.com',
        name: 'John Doe',
        phone_number: '839938838383'
      },
      address: {
        city: 'João Pessoa',
        complement: 'Casa',
        neighborhood: 'Bessa',
        number: '123',
        state: 'PB',
        street: 'Rua das Acácias',
        zipcode: '58035200'

      }
    }
  }, subscriptionPlan.planId)

  const subscriptionDetails = await subscriptionModule.getSubscriptionDetails(subscriptionVinculated.subscription_id)

  return subscriptionDetails
}

const promise = useCaseSubscriptionModule()
promise.then(data => { console.log(data) }).catch(err => { console.error(err) })
