import Address from "../../../@shared/domain/value-object/address"


export interface AddClientInputDto {
  id?: string
  name: string
  email: string
  document: string
  address: string
}

export interface AddClientOutputDto {
  id: string
  name: string
  email: string
  document: string
  address: string
  createdAt: Date
  updatedAt: Date
}