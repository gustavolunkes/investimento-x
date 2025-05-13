import { AddressAttributes } from "../address/address"
import { UserAttributes } from "../user/user"

export interface OwnerAttributes{
    id: Number
    name: string
    cpf_cnpj: string
    phone: string
    email: string
    ativo: boolean
    address: AddressAttributes
    user: UserAttributes
}