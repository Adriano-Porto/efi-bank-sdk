import axios from 'axios'
import {
  type CreateSubscriptionOutput,
  type CreateSubscriptionPlanInput,
  type CreateSubscriptionPlanOutput,
  type CreateSubscriptionResponse,
  type SubscriptionDetails,
  type UpdateNotificationUrlInput
} from '../@types/subscription-module'
import { AuthModule } from './auth-module'

/**
 * This module requires API de Emissão de Cobranças to be active
 */

export class SubscriptionModule extends AuthModule {
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
    const url =
      this.url +
      `/v1/subscription/${planId}/subscription/one-step`

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
      throw new Error(
        'Could not create subscription and vinculate subscription'
      )
    }

    const data: CreateSubscriptionResponse = response.data

    return {
      data
    }
  }

  async getSubscriptionDetails (subscriptionId: string) {
    const url =
      this.url + `/v1/subscription/${subscriptionId}`

    const { config } = this.buildConfig()

    const response = await axios.get(url, config)

    if (response.status !== 200) {
      throw new Error('Could not get subscription details')
    }

    return response.data
  }

  async updateNotificationUrl (
    {
      notificationUrl,
      customId
    }: UpdateNotificationUrlInput,
    subscriptionId: string
  ) {
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
