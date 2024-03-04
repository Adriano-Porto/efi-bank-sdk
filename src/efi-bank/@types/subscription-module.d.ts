export interface CreateSubscriptionPlanInput {
  name: string
  interval?: number
  repeats?: number | null
}

export interface CreateSubscriptionPlanOutput {
  planId: string
  createdAt: string
}

export interface SubscriptionDetails {
  items: SubscriptionItem[]
  paymentInfo: BolixInformation
  expiresAt: Date
  configurations: {
    fine: number
    interest: number
  }
  message: string
}

export interface SubscriptionItem {
  name: string
  value: number
  amount?: number
}

export interface BolixInformation {
  customer: BolixCustomer
  address: BolixAdress
}

export interface BolixAdress {
  street: string
  number: string
  neighborhood: string
  zipcode: string
  city: string
  complement: string
  state: string
}

export interface BolixCustomer {
  name: string
  cpf: string
  email: string
  phone_number: string
}

export interface CreateSubscriptionResponse {
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

export interface CreateSubscriptionOutput {
  data: CreateSubscriptionResponse
}

export interface UpdateNotificationUrlInput {
  notificationUrl: string
  customId: string
}
