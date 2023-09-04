import Address from "../../../@shared/domain/value-object/address"

export interface FindClientUseCaseInputDto {
  id: string
}

export interface FindClientUseCaseOutputDto {
  id: string
  name: string
  email: string
  document: string
  address: string
  createdAt: Date
  updatedAt: Date
}