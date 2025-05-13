import { AddressAttributes } from "../address/address"
import { OwnerAttributes } from "../owner/owner"
import { UserAttributes } from "../user/user"

export interface PropertiesAttributes{
    id_imovel: Number
    nome_imovel: string
    valueRegistration: Number
    date_Value: string
    adress: AddressAttributes
    user: UserAttributes
    owner: OwnerAttributes
}

export interface PropertiesDTOAttributes{
    nomeImovel: string
    street: string
    number: Number
    neighborhood: string
    valueRegistration: string
    dateValue: Date
    cityId: Number
    cep: Number
    userId: string | "4545d4rere"
    ownerId: Number | 2
}