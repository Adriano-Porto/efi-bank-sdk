import axios from 'axios'
import { singleton } from 'tsyringe'
import { EfiBankAuthModule } from './auth-module'

/**
 * This module requires API de Emissão de Cobranças to be active
 */
interface CreateSubscriptionPlanInput {
  name: string
  interval?: number
  repeats?: number | null
}

interface CreateSubscriptionPlanOutput {
  planId: string
  createdAt: string
}

interface SubscriptionDetails {
  items: SubscriptionItem[]
  paymentInfo: BolixInformation
  expiresAt: Date
  configurations: {
    fine: number
    interest: number
  }
  message: string
}

interface SubscriptionItem {
  name: string
  value: number
  amount?: number
}

interface BolixInformation {
  customer: BolixCustomer
  address: BolixAdress
}

interface BolixAdress {
  street: string
  number: string
  neighborhood: string
  zipcode: string
  city: string
  complement: string
  state: string
}

interface BolixCustomer {
  name: string
  cpf: string
  email: string
  phone_number: string
  address: BolixAdress

}

interface CreateSubscriptionResponse {
  code: number
  data: {
    subscription_id: number
    status: string
    barcode: string
    link: string
    billet_link: string
    pdf: {
      charge: string
    }
    expire_at: string
    plan: {
      id: number
      interval: number
      repeats: null | number
    }
    charge: {
      id: number
      status: string
      parcel: number
      total: number
    }
    first_execution: string
    total: number
    payment: string
  }
}

interface CreateSubscriptionOutput {
  data: CreateSubscriptionResponse
}

interface UpdateNotificationUrlInput {
  notificationUrl: string
  customId: string
}

@singleton()
export class EfiBankSubscriptionModule extends EfiBankAuthModule {
  public async createSubscriptionPlan ({
    name,
    interval = 1,
    repeats = null
  }: CreateSubscriptionPlanInput): Promise<CreateSubscriptionPlanOutput> {
    const url = this.url + '/v1/plan'

    const data = {
      name,
      interval,
      repeats
    }

    const { config } = this.buildConfig()

    const response = await axios.post(url, data, config)

    if (response.status !== 200) {
      throw new Error('Could not create subscription')
    }

    return {
      planId: response.data.plan_id,
      createdAt: response.data.created_at
    }
  }

  async createSubscriptionAndVinculateToPlan (
    subscriptionDetails: SubscriptionDetails,
    planId: string
  ): Promise<CreateSubscriptionOutput> {
    const url = this.url + `/v1/subscription/${planId}/subscription/one-step`

    const payload = {
      items: subscriptionDetails.items,
      payment: {
        banking_bilet: subscriptionDetails.paymentInfo
      },
      expires_at: subscriptionDetails.expiresAt,
      configurations: subscriptionDetails.configurations,
      message: subscriptionDetails.message
    }

    const { config } = this.buildConfig()

    const response = await axios.post(url, payload, config)

    if (response.status !== 200) {
      throw new Error('Could not create subscription and vinculate subscription')
    }

    const data: CreateSubscriptionResponse = response.data

    return {
      data
    }
  }

  async getSubscriptionDetails (subscriptionId: string) {
    const url = this.url + `/v1/subscription/${subscriptionId}`

    const { config } = this.buildConfig()

    const response = await axios.get(url, config)

    if (response.status !== 200) {
      throw new Error('Could not get subscription details')
    }

    return response.data
  }

  async updateNotificationUrl ({ notificationUrl, customId }: UpdateNotificationUrlInput, subscriptionId: string) {
    const url = `${this.url}/v1/subscription/${subscriptionId}/metadata`

    const payload = {
      notification_url: notificationUrl,
      custom_id: customId
    }

    const { config } = this.buildConfig()

    const response = await axios.post(url, payload, config)

    if (response.status !== 200) {
      throw new Error('Could not update notification url')
    }

    return response.data
  }
}
